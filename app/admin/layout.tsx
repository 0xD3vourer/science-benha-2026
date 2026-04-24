"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

const ADMIN_PASSWORD = "benha2026";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const pathname = usePathname();

  // التحقق من المصادقة
  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      toast.success('تم الدخول بنجاح');
    } else {
      toast.error('كلمة السر غلط');
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
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6">🔐 دخول المشرف</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة السر"
              className="w-full bg-white/10 rounded-xl p-3 text-white border border-white/20 outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 py-3 rounded-xl font-semibold"
            >
              دخول
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950">
      <Toaster position="top-center" />
      
      {/* شريط التنقل العلوي */}
      <div className="border-b border-white/10 bg-black/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div className="flex items-center gap-6 flex-wrap">
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                👑 لوحة التحكم
              </h1>
              <nav className="flex gap-2">
                <Link 
                  href="/admin"
                  className={`px-4 py-2 rounded-lg text-sm transition ${
                    pathname === '/admin' 
                      ? 'bg-amber-500/20 text-amber-400' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  📊 Dashboard
                </Link>
                <Link 
                  href="/admin/pending"
                  className={`px-4 py-2 rounded-lg text-sm transition ${
                    pathname === '/admin/pending' 
                      ? 'bg-amber-500/20 text-amber-400' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  ⏳ الطلبات المعلقة
                </Link>
                <Link 
                  href="/admin/members"
                  className={`px-4 py-2 rounded-lg text-sm transition ${
                    pathname === '/admin/members' 
                      ? 'bg-amber-500/20 text-amber-400' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  🎓 أعضاء الدفعة
                </Link>
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
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </div>
    </main>
  );
}