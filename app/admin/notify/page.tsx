'use client';

import { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx1H9s93Ub82jM0yH5IsU0e5gdx6NP2HRCOvewW73mPrmiLMbnRlZqoBofchQA9-0g1cg/exec';

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
    if (!subject.trim()) return toast.error('الموضوع مطلوب');
    if (!body.trim()) return toast.error('المحتوى مطلوب');

    setSending(true);
    try {
      const params = new URLSearchParams();
      params.append('action', 'send_bulk');
      params.append('subject', subject);
      params.append('body', body);

      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: params,
      });

      toast.success('تم إرسال الإشعار ✅');
      setSubject('');
      setBody('');
    } catch {
      toast.error('فشل الإرسال');
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
        <button onClick={loadMembers}
          className="px-4 py-2 bg-white/10 rounded-xl text-sm hover:bg-white/20 transition">
          🔄 عرض الأعضاء
        </button>
      </div>

      {loading && <p className="text-center text-gray-400">جاري التحميل...</p>}

      {members.length > 0 && (
        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-2">📊 الأعضاء: {members.length}</h3>
          <div className="max-h-40 overflow-y-auto text-sm text-gray-400 space-y-1">
            {members.map(m => (
              <div key={m.id} className="flex justify-between py-1 border-b border-white/5">
                <span>{m.name}</span>
                <span className="text-amber-400">{m.email || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">الموضوع *</label>
            <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
              className="w-full bg-white/10 rounded-xl p-3 text-white border border-white/20 focus:border-amber-500 outline-none"
              placeholder="مثال: تذكير بموعد التخرج" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">المحتوى *</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={8}
              className="w-full bg-white/10 rounded-xl p-3 text-white border border-white/20 focus:border-amber-500 outline-none font-mono text-sm"
              placeholder="اكتب محتوى الإيميل هنا..." />
          </div>
          <button onClick={sendNotification} disabled={sending}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
            {sending ? 'جاري الإرسال...' : '📧 إرسال للجميع'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}