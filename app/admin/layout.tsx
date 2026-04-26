"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

// 🔐 الباسورد بييجي من Vercel Env Var (NEXT_PUBLIC_ADMIN_PASSWORD)
//    لو مش موجود، fallback على القيمة القديمة علشان الموقع ما يقعش.
//    ⚠️ ملحوظة: Next.js public env vars بتظهر في الـ client bundle برضو،
//    فده bypass خفيف مش حماية حقيقية. لو محتاج حماية أقوى استخدم
//    Firebase Auth + custom claim "admin: true" بدل الباسورد ده.
const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'benha2026';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') setIsAuthenticated(true);
    // 🪲 Debug helper: في الـ console هتشوف إيه الباسورد المتوقع.
    //    شيل السطر ده بعد ما تتأكد إن كل حاجة شغالة.
    if (typeof window !== 'undefined') {
      console.log(
        '[Admin] expected password length:',
        ADMIN_PASSWORD.length,
        '| using env var?',
        !!process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      );
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === ADMIN_PASSWORD.trim()) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      toast.success('تم الدخول بنجاح');
    } else {
      toast.error('كلمة السر غلط');
      console.log(
        '[Admin] wrong password. Entered length:',
        password.length,
        '| expected length:',
        ADMIN_PASSWORD.length
      );
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    toast.success('تم تسجيل الخروج');
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 flex items-center justify-center p-4">
        <Toaster position="top-center" />
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6">🔐 دخول المشرف</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة السر"
              autoComplete="current-password"
              className="w-full bg-white/10 rounded-xl p-3 text-white border border-white/20 outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 py-3 rounded-xl font-semibold"
            >
              دخول
            </button>
          </form>
          <p className="text-xs text-gray-600 mt-4 text-center">
            افتح Console (F12) لو الباسورد مش بيدخل علشان تشوف التفاصيل
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950">
      <Toaster position="top-center" />

      <div className="border-b border-white/10 bg-black/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div className="flex items-center gap-6 flex-wrap">
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                👑 لوحة التحكم
              </h1>
              <nav className="flex gap-2 flex-wrap">
                {[
                  { href: '/admin', label: '📊 Dashboard' },
                  { href: '/admin/pending', label: '⏳ الطلبات المعلقة' },
                  { href: '/admin/members', label: '🎓 أعضاء الدفعة' },
                  { href: '/admin/notify', label: '📧 إشعارات' },
                  { href: '/admin/memories', label: '💭 الذكريات' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm transition ${
                      pathname === link.href
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white text-sm px-4 py-2 bg-white/5 rounded-xl transition"
            >
              تسجيل خروج
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>
    </main>
  );
}
