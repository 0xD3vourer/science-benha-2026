"use client";

import { useState, useEffect } from 'react';
import { getPendingRequests, approveRequest, rejectRequest, getJoinRequests } from '@/lib/firebase';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

// كلمة سر بسيطة (غيرها بكلمة أقوى)
const ADMIN_PASSWORD = "benha2026";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadRequests();
    }
  }, [isAuthenticated]);

  const loadRequests = async () => {
    setLoading(true);
    const data = await getPendingRequests();
    setRequests(data as any[]);
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success('تم الدخول بنجاح');
    } else {
      toast.error('كلمة السر غلط');
    }
  };

  const handleApprove = async (request: any) => {
    setProcessing(request.id);
    try {
      await approveRequest(request.id, request);
      toast.success(`✅ تمت الموافقة على ${request.fullName}`);
      await loadRequests();
    } catch (error) {
      toast.error('حدث خطأ');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setProcessing(requestId);
    try {
      await rejectRequest(requestId);
      toast.success('تم رفض الطلب');
      await loadRequests();
    } catch (error) {
      toast.error('حدث خطأ');
    } finally {
      setProcessing(null);
    }
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
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 py-12 px-4">
      <Toaster position="top-center" />
      
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            👑 لوحة التحكم - طلبات الانضمام
          </h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-gray-400 hover:text-white text-sm px-4 py-2 bg-white/5 rounded-xl"
          >
            تسجيل خروج
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-12">جاري التحميل...</div>
        ) : requests.length === 0 ? (
          <div className="text-center text-gray-400 py-12 bg-white/5 rounded-2xl p-8">
            🎉 مفيش طلبات جديدة في انتظار المراجعة
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/40 backdrop-blur-sm rounded-xl p-5 border border-white/10"
              >
                <div className="flex flex-wrap gap-4">
                  {/* الصورة */}
                  {req.imageUrl && (
                    <img 
                      src={req.imageUrl} 
                      alt="ID Card" 
                      className="w-32 h-24 object-cover rounded-lg border border-white/20"
                    />
                  )}
                  
                  {/* بيانات الطلب */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{req.fullName}</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <p><span className="text-gray-500">رقم الجلوس:</span> {req.seatNumber}</p>
                      <p><span className="text-gray-500">الشعبة:</span> {req.section || 'غير محدد'}</p>
                      {req.phone && <p><span className="text-gray-500">الهاتف:</span> {req.phone}</p>}
                      <p><span className="text-gray-500">تاريخ الطلب:</span> {req.timestamp?.toDate?.().toLocaleDateString('ar-EG')}</p>
                    </div>
                  </div>
                  
                  {/* أزرار التحكم */}
                  <div className="flex gap-3 items-center">
                    <button
                      onClick={() => handleApprove(req)}
                      disabled={processing === req.id}
                      className="px-5 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition disabled:opacity-50"
                    >
                      {processing === req.id ? '...' : '✅ قبول'}
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      disabled={processing === req.id}
                      className="px-5 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-semibold transition disabled:opacity-50"
                    >
                      {processing === req.id ? '...' : '❌ رفض'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-6">
          <a href="/" className="text-gray-400 hover:text-amber-400 text-sm transition">← رجوع للصفحة الرئيسية</a>
        </div>
      </div>
    </main>
  );
}