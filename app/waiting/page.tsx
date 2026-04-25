'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function WaitingPage() {
  const params = useSearchParams();
  const router = useRouter();
  const email = (params.get('email') || '').trim().toLowerCase();
  const [status, setStatus] = useState<'pending' | 'approved' | 'unknown'>(
    'unknown'
  );
  const [checking, setChecking] = useState(true);

  // فحص الحالة كل 30 ثانية — لو اتوافق تلقائي نوديه على /login
  useEffect(() => {
    if (!email) return;

    const check = async () => {
      try {
        // 1) approved؟
        const gq = query(
          collection(db, 'graduates'),
          where('email', '==', email)
        );
        const gSnap = await getDocs(gq);
        if (!gSnap.empty) {
          setStatus('approved');
          setTimeout(() => router.push('/login'), 1500);
          return;
        }

        // 2) pending؟
        const pq = query(
          collection(db, 'pending_requests'),
          where('email', '==', email)
        );
        const pSnap = await getDocs(pq);
        setStatus(pSnap.empty ? 'unknown' : 'pending');
      } catch (e) {
        console.error(e);
      } finally {
        setChecking(false);
      }
    };

    check();
    const interval = setInterval(check, 30_000); // كل 30 ثانية
    return () => clearInterval(interval);
  }, [email, router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 flex items-center justify-center p-5">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
        {!email ? (
          <>
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-white mb-3">
              مفيش إيميل في الرابط
            </h1>
            <Link
              href="/login"
              className="text-amber-400 hover:text-amber-300 text-sm transition"
            >
              ارجع لصفحة الدخول →
            </Link>
          </>
        ) : status === 'approved' ? (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-xl font-bold text-white mb-3">تمت الموافقة!</h1>
            <p className="text-gray-400 text-sm">
              بنوديك على صفحة الدخول دلوقتي...
            </p>
          </>
        ) : status === 'pending' ? (
          <>
            <div className="text-5xl mb-4">⏳</div>
            <h1 className="text-xl font-bold text-amber-400 mb-3">
              طلبك تحت المراجعة
            </h1>
            <p className="text-gray-300 text-sm mb-2">
              سجلنا طلبك على الإيميل:
            </p>
            <p className="text-amber-300 text-sm font-medium mb-4">{email}</p>
            <p className="text-gray-500 text-xs leading-relaxed">
              المشرف هيراجع طلبك قريب. لما يتم قبولك، هيوصلك إيميل وهتقدر تدخل
              من صفحة <Link href="/login" className="text-amber-400 underline">الدخول</Link>.
            </p>
            <p className="text-gray-600 text-xs mt-6">
              {checking ? 'بنفحص الحالة...' : 'بنفحص كل 30 ثانية تلقائياً'}
            </p>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">❓</div>
            <h1 className="text-xl font-bold text-white mb-3">
              مفيش طلب على الإيميل ده
            </h1>
            <p className="text-gray-400 text-sm mb-4">
              الإيميل <span className="text-amber-400">{email}</span> مش مسجل
              في الدفعة.
            </p>
            <Link
              href="/join"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-black px-5 py-2 rounded-xl text-sm font-semibold transition"
            >
              انضم للدفعة
            </Link>
          </>
        )}

        <div className="mt-8 pt-4 border-t border-white/5">
          <Link
            href="/"
            className="text-xs text-gray-600 hover:text-gray-400 transition"
          >
            ← الرئيسية
          </Link>
        </div>
      </div>
    </main>
  );
}
