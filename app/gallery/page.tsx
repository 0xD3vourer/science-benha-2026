'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

interface Memory {
  id: string;
  text: string;
  name: string;
  isAnonymous: boolean;
  imageUrl?: string;
  createdAt: any;
}

const CLOUD_NAME = 'dgsrya7bw';
const UPLOAD_PRESET = 'science_benha_memories';

export default function GalleryPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [savedName, setSavedName] = useState('');

  useEffect(() => {
    // جيب الاسم المحفوظ من localStorage
    const stored = localStorage.getItem('user_name');
    if (stored) { setName(stored); setSavedName(stored); }
    loadMemories();
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
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST', body: fd,
    });
    const data = await res.json();
    if (!data.secure_url) throw new Error('فشل الرفع');
    return data.secure_url;
  };

  const handleSubmit = async () => {
    if (!text.trim()) return toast.error('اكتب حاجة الأول 😅');
    if (!isAnonymous && !name.trim()) return toast.error('اكتب اسمك أو اختار مجهول');
    setSending(true);
    try {
      let imageUrl = '';
      if (imageFile) imageUrl = await uploadToCloudinary(imageFile);

      // احفظ الاسم في localStorage
      if (!isAnonymous && name.trim()) {
        localStorage.setItem('user_name', name.trim());
        setSavedName(name.trim());
      }

      await addDoc(collection(db, 'memories'), {
        text: text.trim(),
        name: isAnonymous ? 'مجهول' : name.trim(),
        isAnonymous,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      toast.success('اتحفظت ذكرتك ✨');
      setText(''); setImageFile(null); setImagePreview(null);
      loadMemories();
    } catch {
      toast.error('في مشكلة، جرب تاني');
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 p-5">
      <Toaster />
      <div className="max-w-xl mx-auto">
        <Link href="/" className="text-gray-500 hover:text-white text-sm transition mb-6 inline-block">
          ← الرئيسية
        </Link>

        <h1 className="text-4xl font-bold text-amber-400 mb-1">💭 ذاكرة الدفعة</h1>
        <p className="text-gray-500 text-sm mb-8">كل ذكرى هنا هتفضل للأبد 🌟</p>

        {/* Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
          {/* اسمي / مجهول */}
          <div className="flex gap-2 mb-4">
            <button onClick={() => setIsAnonymous(false)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${!isAnonymous ? 'bg-amber-500 text-black' : 'bg-white/10 text-gray-400'}`}>
              ✍️ باسمي
            </button>
            <button onClick={() => setIsAnonymous(true)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${isAnonymous ? 'bg-slate-600 text-white' : 'bg-white/10 text-gray-400'}`}>
              🎭 مجهول
            </button>
          </div>

          {!isAnonymous && (
            <div className="mb-3">
              <input
                placeholder="اسمك"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-white/10 rounded-xl p-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {savedName && (
                <p className="text-xs text-gray-600 mt-1 pr-1">محفوظ: {savedName}</p>
              )}
            </div>
          )}

          <textarea
            placeholder="اكتب ذكرى، موقف، أي حاجة نفسك فيها..."
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={300}
            rows={4}
            className="w-full bg-white/10 rounded-xl p-3 text-white placeholder-gray-500 resize-none text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />

          <label className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-amber-400 text-sm mb-3 transition w-fit">
            🖼️ أضف صورة (اختياري)
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>

          {imagePreview && (
            <div className="relative w-28 h-28 mb-3">
              <img src={imagePreview} className="w-28 h-28 object-cover rounded-xl" />
              <button onClick={() => { setImageFile(null); setImagePreview(null); }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                ✕
              </button>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs">{text.length}/300</span>
            <button onClick={handleSubmit} disabled={sending}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-black px-5 py-2 rounded-xl text-sm font-semibold transition">
              {sending ? '⏳ شوية...' : 'إرسال ✨'}
            </button>
          </div>
        </div>

        {/* الذكريات */}
        {loading ? (
          <p className="text-center text-gray-600 text-sm">جاري التحميل...</p>
        ) : memories.length === 0 ? (
          <p className="text-center text-gray-600 text-sm">لسه مفيش ذكريات — كن الأول 🌟</p>
        ) : (
          <div className="space-y-4">
            {memories.map(m => (
              <div key={m.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-amber-500/30 transition">
                {m.imageUrl && (
                  <img src={m.imageUrl} className="w-full max-h-72 object-cover rounded-xl mb-3" />
                )}
                <p className="text-white text-sm leading-relaxed">{m.text}</p>
                <div className="flex justify-between mt-3 text-xs text-gray-500">
                  <span>{m.isAnonymous ? '🎭 مجهول' : `✍️ ${m.name}`}</span>
                  <span>{m.createdAt?.toDate?.().toLocaleDateString('ar-EG') || 'الآن'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}