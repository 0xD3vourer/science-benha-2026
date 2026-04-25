'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  doc,
  getDoc,
} from 'firebase/firestore';
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
    let isMounted = true;

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;

      if (!user) {
        setLoading(false);
        router.push('/login');
        return;
      }

      try {
        setCurrentUser(user);

        const snap = await getDoc(doc(db, 'users', user.uid));

        if (!snap.exists()) {
          router.push('/login');
          return;
        }

        if (isMounted) {
          setUserProfile(snap.data());
          await loadMemories();
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, [router]);

  const loadMemories = async () => {
    try {
      const q = query(
        collection(db, 'memories'),
        orderBy('createdAt', 'desc')
      );

      const snap = await getDocs(q);

      setMemories(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Memory[]
      );
    } catch (err) {
      console.error(err);
      toast.error('خطأ في تحميل الذكريات');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error('الصورة أكبر من 5MB');
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: fd }
    );

    const data = await res.json();

    if (!data.secure_url) throw new Error('Upload failed');

    return data.secure_url;
  };

  const handleSubmit = async () => {
    if (!text.trim()) return toast.error('اكتب حاجة الأول 😅');
    if (!currentUser || !userProfile)
      return toast.error('لازم تدخل الأول');

    setSending(true);

    try {
      let imageUrl = '';

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      await addDoc(collection(db, 'memories'), {
        text: text.trim(),
        name: isAnonymous ? 'مجهول' : userProfile.name,
        email: currentUser.email,
        userId: currentUser.uid,
        isAnonymous,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      toast.success('اتحفظت ✨');

      setText('');
      setImageFile(null);
      setImagePreview(null);
      setIsAnonymous(false);

      await loadMemories();
    } catch (err) {
      console.error(err);
      toast.error('في مشكلة، جرب تاني');
    } finally {
      setSending(false);
    }
  };

  const displayName =
    userProfile?.name?.split(' ').slice(0, 2).join(' ') || '';

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 p-5">
      <Toaster />

      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/"
            className="text-gray-500 hover:text-white text-sm transition"
          >
            ← الرئيسية
          </Link>

          {userProfile && (
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">
                أهلاً {displayName} 👋
              </span>

              <button
                onClick={() =>
                  signOut(auth).then(() => router.push('/login'))
                }
                className="text-xs text-gray-600 hover:text-gray-400 transition"
              >
                خروج
              </button>
            </div>
          )}
        </div>

        <h1 className="text-4xl font-bold text-amber-400 mb-1">
          💭 ذاكرة الدفعة
        </h1>

        <p className="text-gray-500 text-sm mb-6">
          كل ذكرى هنا هتفضل للأبد 🌟
        </p>

        {/* Post Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
          <textarea
            placeholder="اكتب ذكرى..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={300}
            rows={3}
            className="w-full bg-transparent text-white placeholder-gray-600 resize-none text-sm mb-3 focus:outline-none"
          />

          {imagePreview && (
            <div className="relative mb-3">
              <img
                src={imagePreview}
                className="w-full max-h-64 object-cover rounded-xl"
              />
              <button
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="absolute top-2 left-2 bg-black/60 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t border-white/10">
            <label className="cursor-pointer text-gray-500 hover:text-amber-400 text-sm transition">
              🖼️
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <button
              onClick={handleSubmit}
              disabled={sending || !text.trim()}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-30 text-black px-4 py-1.5 rounded-xl text-sm font-semibold transition"
            >
              {sending ? '⏳' : 'نشر'}
            </button>
          </div>
        </div>

        {/* Memories */}
        {loading ? (
          <p className="text-center text-gray-600 text-sm py-8">
            جاري التحميل...
          </p>
        ) : memories.length === 0 ? (
          <p className="text-center text-gray-600 text-sm py-8">
            لسه مفيش ذكريات 🌟
          </p>
        ) : (
          <div className="space-y-3">
            {memories.map((m) => (
              <div
                key={m.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-4"
              >
                <p className="text-white text-sm font-medium mb-2">
                  {m.isAnonymous ? 'مجهول' : m.name}
                </p>

                {m.imageUrl && (
                  <img
                    src={m.imageUrl}
                    className="w-full max-h-72 object-cover rounded-xl mb-3"
                  />
                )}

                <p className="text-gray-200 text-sm">{m.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}