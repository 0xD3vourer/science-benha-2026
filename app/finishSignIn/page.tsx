'use client';

import { useEffect, useState } from 'react';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function FinishSignInPage() {
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

        // جيب بياناته من graduates
        const q = query(
          collection(db, 'graduates'),
          where('email', '==', email.toLowerCase())
        );
        const snap = await getDocs(q);

        if (!snap.empty) {
          const graduateData = snap.docs[0].data();
          // احفظ في users collection عشان نستخدمه بعدين
          await setDoc(doc(db, 'users', u.uid), {
            name: graduateData.name,
            email: u.email,
            section: graduateData.section || '',
            uid: u.uid,
          }, { merge: true });
        }

        setStatus('تم الدخول ✅ جاري التحويل...');
        router.push('/gallery');
      } catch (err: any) {
        console.error(err);
        setStatus('في مشكلة في الدخول، هنرجعك لصفحة الدخول...');
        setTimeout(() => router.push('/login'), 2000);
      }
    };

    finish();
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🔐</div>
        <p className="text-gray-400 text-sm">{status}</p>
      </div>
    </main>
  );
}