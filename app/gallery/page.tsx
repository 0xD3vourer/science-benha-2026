'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, orderBy, query, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Memory {
  id: string;
  text: string;
  name: string;
  email?: string;
  isAnonymous: boolean;
  imageUrl?: string;
  createdAt: any;
}

const CLOUD_NAME = 'dgsrya7bw';
const UPLOAD_PRESET = 'science_benha_memories';

export default function GalleryPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [text, setText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }
      setCurrentUser(user);
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) setUserProfile(snap.data());
      else router.push('/finishSignIn');
    });
    loadMemories();
    return () => unsub();
  }, []);

  const loadMemories = async () => {
    const q = query(collection(db, 'memories'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    setMemories(snap.docs.map(d => ({ id: d.id, ...d.data() } as Memory)));
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error('الصورة أكبر من 5MB');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: fd });
    const data = await res.json();
    if (!data.secure_url) throw new Error('فشل الرفع');
    return data.secure_url;
  };

  const handleSubmit = async () => {
    if (!text.trim()) return toast.error('اكتب حاجة الأول 😅');
    if (!currentUser || !userProfile) return toast.error('لازم تدخل الأول');
    setSending(true);
    try {
      let imageUrl = '';
      if (imageFile) imageUrl = await uploadToCloudinary(imageFile);
      await addDoc(collection(db, 'memories'), {
        text: text.trim(),
        name: isAnonymous ? 'مجهول' : userProfile.name,
        email: currentUser.email, // دايماً محفوظ للأدمن
        userId: currentUser.uid,
        isAnonymous,
        imageUrl,
        createdAt: serverTimestamp(),
      });
      toast.success('اتحفظت ✨');
      setText(''); setImageFile(null); setImagePreview(null); setIsAnonymous(false);
      loadMemories();
    } catch {
      toast.error('في مشكلة، جرب تاني');
    } finally {
      setSending(false);
    }
  };

  const displayName = userProfile?.name?.split(' ').slice(0, 2).join(' ') || '';

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 p-5">
      <Toaster />
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-gray-500 hover:text-white text-sm transition">← الرئيسية</Link>
          {userProfile && (
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">أهلاً {displayName} 👋</span>
              <button onClick={() => signOut(auth).then(() => router.push('/login'))}
                className="text-xs text-gray-600 hover:text-gray-400 transition">
                خروج
              </button>
            </div>
          )}
        </div>

        <h1 className="text-4xl font-bold text-amber-400 mb-1">💭 ذاكرة الدفعة</h1>
        <p className="text-gray-500 text-sm mb-6">كل ذكرى هنا هتفضل للأبد 🌟</p>

        {/* Post Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
          {/* User info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
              {displayName?.[0] || '?'}
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{displayName}</p>
              <button
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`text-xs transition ${isAnonymous ? 'text-slate-400' : 'text-gray-600 hover:text-gray-400'}`}
              >
                {isAnonymous ? '🎭 هتنشر مجهول — اضغط تعدّل' : '🌐 عام · اضغط عشان تنشر مجهول'}
              </button>
            </div>
          </div>

          <textarea
            placeholder={`اكتب ذكرى، موقف، أي حاجة نفسك فيها يا ${displayName?.split(' ')[0] || ''}...`}
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={300}
            rows={3}
            className="w-full bg-transparent text-white placeholder-gray-600 resize-none text-sm mb-3 focus:outline-none"
          />

          {imagePreview && (
            <div className="relative mb-3">
              <img src={imagePreview} className="w-full max-h-64 object-cover rounded-xl" />
              <button onClick={() => { setImageFile(null); setImagePreview(null); }}
                className="absolute top-2 left-2 bg-black/60 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">
                ✕
              </button>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t border-white/10">
            <div className="flex gap-3">
              <label className="cursor-pointer text-gray-500 hover:text-amber-400 text-sm transition">
                🖼️
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              <span className="text-gray-700 text-xs self-center">{text.length}/300</span>
            </div>
            <button onClick={handleSubmit} disabled={sending || !text.trim()}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-30 text-black px-4 py-1.5 rounded-xl text-sm font-semibold transition">
              {sending ? '⏳' : 'نشر'}
            </button>
          </div>
        </div>

        {/* Memories Feed */}
        {loading ? (
          <p className="text-center text-gray-600 text-sm py-8">جاري التحميل...</p>
        ) : memories.length === 0 ? (
          <p className="text-center text-gray-600 text-sm py-8">لسه مفيش ذكريات — كن الأول 🌟</p>
        ) : (
          <div className="space-y-3">
            {memories.map(m => (
              <div key={m.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">
                    {m.isAnonymous ? '🎭' : m.name?.[0] || '?'}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{m.isAnonymous ? 'مجهول' : m.name}</p>
                    <p className="text-gray-600 text-xs">{m.createdAt?.toDate?.().toLocaleDateString('ar-EG') || 'الآن'}</p>
                  </div>
                </div>
                {m.imageUrl && <img src={m.imageUrl} className="w-full max-h-72 object-cover rounded-xl mb-3" />}
                <p className="text-gray-200 text-sm leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}