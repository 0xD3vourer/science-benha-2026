'use client';

import { useEffect, useState } from 'react';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function FinishSignInPage() {
  const [name, setName] = useState('');
  const [needsName, setNeedsName] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState('جاري التحقق...');
  const router = useRouter();

  useEffect(() => {
    const finish = async () => {
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        router.push('/login');
        return;
      }
      let email = localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('اكتب إيميلك للتأكيد') || '';
      }
      try {
        const result = await signInWithEmailLink(auth, email, window.location.href);
        localStorage.removeItem('emailForSignIn');
        const u = result.user;
        setUser(u);
        const snap = await getDoc(doc(db, 'users', u.uid));
        if (snap.exists()) {
          router.push('/gallery');
        } else {
          setNeedsName(true);
        }
      } catch (err: any) {
        console.error(err);
        setStatus('في مشكلة في الدخول، جرب تاني');
        setTimeout(() => router.push('/login'), 2000);
      }
    };
    finish();
  }, []);

  const handleSaveName = async () => {
    const parts = name.trim().split(/\s+/);
    if (parts.length < 3) return toast.error('اكتب اسمك ثلاثي على الأقل');
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
        email: user.email,
        createdAt: new Date(),
      });
      router.push('/gallery');
    } catch {
      toast.error('في مشكلة، حاول تاني');
    }
  };

  if (!needsName) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400 text-sm">{status}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 flex items-center justify-center p-5">
      <Toaster />
      <div className="max-w-sm w-full bg-white/5 border border-white/10 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-amber-400 mb-1">🎉 أهلاً بيك!</h1>
        <p className="text-gray-500 text-sm mb-6">
          اكتب اسمك عشان نعرفك — مش هتكتبه تاني أبداً
        </p>
        <input
          placeholder="الاسم ثلاثي"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSaveName()}
          className="w-full bg-white/10 rounded-xl p-3 text-white placeholder-gray-500 text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
        <button onClick={handleSaveName}
          className="w-full bg-amber-500 hover:bg-amber-600 text-black py-3 rounded-xl font-semibold transition text-sm">
          يلا 🚀
        </button>
      </div>
    </main>
  );
}