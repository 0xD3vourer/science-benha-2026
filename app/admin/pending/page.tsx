"use client";
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, addDoc, getDocs, where } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbxIBSm-6HT_NG-rk58OR9LlGn7JxL54DahapL_3Xj640VpwZK_wACC8vuPxpujJdeWtAg/exec';

export default function PendingPage() {
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [existingMembers, setExistingMembers] = useState<any[]>([]);

  // تحميل قائمة الأعضاء الحاليين
  useEffect(() => {
    const loadMembers = async () => {
      const snapshot = await getDocs(collection(db, 'graduates'));
      setExistingMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    loadMembers();
  }, []);

  // Real-time listener للطلبات المعلقة
  useEffect(() => {
    const q = query(collection(db, 'pending_requests'), orderBy('submittedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPendingRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error(error);
      toast.error('حدث خطأ في جلب الطلبات');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // دالة فحص التكرار
  const isDuplicate = (name: string, section: string) => {
    return existingMembers.some(member => member.name === name && member.section === section);
  };

  const handleApprove = async (request: any) => {
    // الفحص الأول: هل الاسم موجود أصلاً؟
    if (isDuplicate(request.name, request.section)) {
      toast.error(`⚠️ الاسم "${request.name}" موجود بالفعل في قسم "${request.section}"`);
      return;
    }

    setProcessing(request.id);
    try {
      // 1. حفظ الاسم
      await addDoc(collection(db, 'graduates'), {
        name: request.name,
        section: request.section,
        approvedAt: new Date()
      });

      // 2. تحديث Google Sheets
      await fetch(SHEETS_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', name: request.name, section: request.section })
      });

      // 3. مسح الطلب المعلق
      await deleteDoc(doc(db, 'pending_requests', request.id));

      // 4. تحديث الـ local state
      setExistingMembers(prev => [...prev, { name: request.name, section: request.section }]);
      toast.success(`✅ تمت الموافقة على ${request.name}`);

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'حدث خطأ');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (request: any) => {
    if (!confirm(`متأكد من رفض طلب ${request.name}؟`)) return;
    setProcessing(request.id);
    try {
      await deleteDoc(doc(db, 'pending_requests', request.id));
      toast.success(`❌ تم رفض طلب ${request.name}`);
    } catch (error) {
      toast.error('حدث خطأ');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <div className="text-center text-gray-400 py-12"><div className="animate-pulse">جاري التحميل...</div></div>;

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">⏳ طلبات الانضمام المعلقة</h2>
          <p className="text-gray-400 text-sm">الطلبات الجديدة من Google Forms تظهر هنا تلقائياً</p>
        </div>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="text-center text-gray-400 py-12 bg-white/5 rounded-2xl p-8">
          🎉 مفيش طلبات معلقة جديدة
        </div>
      ) : (
        <div className="space-y-3">
          {pendingRequests.map((request, idx) => {
            const duplicateExists = isDuplicate(request.name, request.section);
            return (
              <motion.div key={request.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                className={`bg-black/40 backdrop-blur-sm rounded-xl p-5 border ${duplicateExists ? 'border-red-500/50 bg-red-950/20' : 'border-white/10 hover:border-amber-500/30'} transition`}>
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold ${duplicateExists ? 'text-red-400' : 'text-white'}`}>{request.name}</h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm">
                      <p><span className="text-gray-500">القسم:</span> {request.section || 'غير محدد'}</p>
                      <p><span className="text-gray-500">تاريخ الطلب:</span> {request.submittedAt?.toDate?.().toLocaleDateString('ar-EG') || 'منذ قليل'}</p>
                    </div>
                    {duplicateExists && <p className="text-red-400 text-xs mt-2">⚠️ هذا الاسم موجود بالفعل في قائمة الخريجين</p>}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleApprove(request)} disabled={processing === request.id || duplicateExists}
                      className={`px-5 py-2 rounded-lg font-semibold transition disabled:opacity-50 ${duplicateExists ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'}`}>
                      {processing === request.id ? '...' : '✅ قبول'}
                    </button>
                    <button onClick={() => handleReject(request)} disabled={processing === request.id}
                      className="px-5 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-semibold transition disabled:opacity-50">
                      {processing === request.id ? '...' : '❌ رفض'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}