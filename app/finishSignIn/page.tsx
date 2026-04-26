'use client';

import { useEffect, useState } from 'react';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function FinishSignInPage() {
  const [status, setStatus] = useState('جاري التحقق...');
  const [needsEmail, setNeedsEmail] = useState(false);
  const [manualEmail, setManualEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isSignInWithEmailLink(auth, window.location.href)) {
      router.push('/login');
      return;
    }
    const stored = localStorage.getItem('emailForSignIn');
    if (stored) {
      completeSignIn(stored);
    } else {
      // فتح اللينك من device تاني
      setNeedsEmail(true);
      setStatus('');
    }
  }, []);

  const completeSignIn = async (email: string) => {
    try {
      const result = await signInWithEmailLink(auth, email, window.location.href);
      localStorage.removeItem('emailForSignIn');
      const u = result.user;

      // جيب بياناته من graduates
      const q = query(
        collection(db, 'graduates'),
        where('email', '==', email.toLowerCase())
      );
      const snap = await getDocs(q);

      if (!snap.empty) {
        const data = snap.docs[0].data();
        await setDoc(doc(db, 'users', u.uid), {
          name: data.name,
          email: u.email,
          section: data.section || '',
          uid: u.uid,
        }, { merge: true });
      }

      setStatus('✅ تم الدخول! جاري التحويل...');
      setTimeout(() => router.push('/gallery'), 1000);
    } catch (err: any) {
      console.error(err);
      toast.error('في مشكلة، جرب تاني');
      setTimeout(() => router.push('/login'), 2000);
    }
  };

  if (needsEmail) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 flex items-center justify-center p-5">
        <Toaster />
        <div className="max-w-sm w-full bg-white/5 border border-white/10 rounded-2xl p-6">
          <h1 className="text-xl font-bold text-amber-400 mb-2">تأكيد الإيميل</h1>
          <p className="text-gray-500 text-sm mb-4">
            يبدو إنك فتحت اللينك من جهاز تاني — اكتب إيميلك للتأكيد
          </p>
          <input
            type="email"
            placeholder="إيميلك"
            value={manualEmail}
            onChange={e => setManualEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && completeSignIn(manualEmail.trim())}
            className="w-full bg-white/10 rounded-xl p-3 text-white placeholder-gray-500 text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <button
            onClick={() => completeSignIn(manualEmail.trim())}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black py-3 rounded-xl font-semibold transition text-sm"
          >
            تأكيد ودخول 🚀
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-pulse">🔐</div>
        <p className="text-gray-400 text-sm">{status}</p>
      </div>
    </main>
  );
}