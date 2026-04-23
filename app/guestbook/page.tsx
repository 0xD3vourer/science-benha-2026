"use client";

import { useState, useEffect } from 'react';
import { getMessages, addMessage } from '@/lib/firebase';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

export default function GuestBook() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const msgs = await getMessages();
    setMessages(msgs as any[]);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      toast.error('اكتب رسالة أولاً');
      return;
    }

    await addMessage(newMessage, userName || undefined);
    toast.success('تمت إضافة رسالتك ❤️');
    setNewMessage('');
    loadMessages();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 to-black p-8">
      <Toaster />
      
      {/* 👇 ضيف زر الرجوع هنا */}
      <div className="max-w-4xl mx-auto mb-4">
        <a 
          href="/" 
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition bg-white/10 px-4 py-2 rounded-full text-sm"
        >
          ← رجوع للصفحة الرئيسية
        </a>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          📖 سجل الذكريات
        </h1>
        <p className="text-gray-400 text-center mb-8">كل كلمة بتكتبها هنا تفضل ذكرى للدفعة كلها</p>

        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
          <input
            type="text"
            placeholder="اسمك (اختياري)"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full bg-white/20 rounded-lg p-3 mb-3 text-white placeholder-gray-400"
          />
          <textarea
            placeholder="اكتب رسالتك للدفعة..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full bg-white/20 rounded-lg p-3 mb-3 text-white placeholder-gray-400 min-h-[100px]"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full text-white font-semibold hover:opacity-90 transition"
          >
            💬 أضف رسالتك
          </button>
        </form>

        {loading ? (
          <div className="text-center text-white">جاري التحميل...</div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <p className="text-white">{msg.message}</p>
                <div className="flex justify-between mt-2 text-sm text-gray-400">
                  <span>✍️ {msg.name}</span>
                  <span>📅 {msg.timestamp?.toDate?.().toLocaleDateString('ar-EG') || 'الآن'}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}