"use client";

import { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec'; // 👈 ضع رابط Web App بتاعك

export default function NotifyPage() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMembers = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, 'graduates'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMembers(data);
    setLoading(false);
  };

  const sendNotification = async () => {
    if (!subject.trim()) {
      toast.error('الموضوع مطلوب');
      return;
    }
    if (!body.trim()) {
      toast.error('المحتوى مطلوب');
      return;
    }

    setSending(true);
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_bulk', subject, body })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`✅ تم إرسال الإشعار إلى ${data.count} مستخدم`);
        setSubject('');
        setBody('');
      } else {
        toast.error('حدث خطأ في الإرسال');
      }
    } catch (error) {
      console.error(error);
      toast.error('فشل الاتصال بالخادم');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Toaster position="top-center" />
      
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">📧 إشعارات جماعية</h2>
          <p className="text-gray-400 text-sm">إرسال إيميلات لجميع أعضاء الدفعة المسجلين</p>
        </div>
        <button
          onClick={loadMembers}
          className="px-4 py-2 bg-white/10 rounded-xl text-sm hover:bg-white/20 transition"
        >
          🔄 عرض الأعضاء
        </button>
      </div>

      {loading && <div className="text-center text-gray-400">جاري التحميل...</div>}

      {members.length > 0 && (
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-2">📊 الأعضاء المسجلون: {members.length}</h3>
          <div className="max-h-32 overflow-y-auto text-sm text-gray-400">
            {members.map(m => (
              <div key={m.id} className="flex justify-between py-1 border-b border-white/5">
                <span>{m.name}</span>
                <span className="text-amber-400">{m.email || 'بريد غير موجود'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1">الموضوع *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-white/10 rounded-xl p-3 text-white border border-white/20 focus:border-amber-500 outline-none transition"
              placeholder="مثال: تذكير بموعد التخرج"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">المحتوى (HTML) *</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              className="w-full bg-white/10 rounded-xl p-3 text-white border border-white/20 focus:border-amber-500 outline-none transition font-mono text-sm"
              placeholder="<h1>مرحباً</h1><p>نص الإشعار...</p>"
            />
            <p className="text-xs text-gray-500 mt-1">يمكنك استخدام HTML لتنسيق النص</p>
          </div>

          <button
            onClick={sendNotification}
            disabled={sending}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {sending ? 'جاري الإرسال...' : '📧 إرسال الإشعار للجميع'}
          </button>
        </div>
      </motion.div>

      <div className="text-center text-xs text-gray-500">
        الإشعارات ستُرسل إلى جميع الأعضاء الذين لديهم بريد إلكتروني مسجل.
        <br />
        يمكنك إدارة الأعضاء من صفحة <a href="/admin/members" className="text-amber-400 hover:underline">أعضاء الدفعة</a>.
      </div>
    </div>
  );
}