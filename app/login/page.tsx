'use client';

import { useState, useEffect } from 'react';
import { sendSignInLinkToEmail, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.push('/gallery');
      else setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSend = async () => {
    if (!email.trim()) return toast.error('اكتب إيميلك الأول');
    setSending(true);
    try {
      await sendSignInLinkToEmail(auth, email.trim(), {
        url: 'https://science-benha-graduation-2026.vercel.app/finishSignIn',
        handleCodeInApp: true,
      });
      localStorage.setItem('emailForSignIn', email.trim());
      setSent(true);
    } catch (err: any) {
      console.error(err);
      toast.error('في مشكلة: ' + (err.message || 'حاول تاني'));
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-500 text-sm">جاري التحقق...</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 flex items-center justify-center p-5">
      <Toaster />
      <div className="max-w-sm w-full">
        <Link href="/" className="text-gray-500 hover:text-white text-sm mb-8 inline-block transition">
          ← الرئيسية
        </Link>

        {!sent ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h1 className="text-2xl font-bold text-amber-400 mb-1">👋 أهلاً</h1>
            <p className="text-gray-500 text-sm mb-6">
              هنبعتلك لينك على إيميلك — من غير باسورد
            </p>
            <input
              type="email"
              placeholder="إيميلك"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="w-full bg-white/10 rounded-xl p-3 text-white placeholder-gray-500 text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button onClick={handleSend} disabled={sending}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-black py-3 rounded-xl font-semibold transition text-sm">
              {sending ? '⏳ جاري الإرسال...' : 'ابعتلي اللينك 🔗'}
            </button>
            <p className="text-xs text-gray-600 mt-4 text-center">
              استخدم نفس الإيميل اللي سجلت بيه في الدفعة
            </p>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-5xl mb-4">📬</div>
            <h2 className="text-xl font-bold text-white mb-2">اتحقق من إيميلك</h2>
            <p className="text-gray-400 text-sm mb-1">
              بعتنالك لينك على
            </p>
            <p className="text-amber-400 text-sm font-medium mb-4">{email}</p>
            <p className="text-gray-600 text-xs">افتح اللينك وهتدخل تلقائي</p>
            <button onClick={() => setSent(false)}
              className="mt-5 text-xs text-gray-500 hover:text-gray-300 transition underline">
              غير الإيميل
            </button>
          </div>
        )}
      </div>
    </main>
  );
}