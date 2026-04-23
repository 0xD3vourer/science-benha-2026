"use client";

import { useState, useEffect } from 'react';
import { addMessage, getMessages } from '@/lib/firebase';
import toast, { Toaster } from 'react-hot-toast';

export default function AnonymousPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const allMsgs = await getMessages();
    const anonMsgs = allMsgs.filter((msg: any) => msg.isAnonymous === true);
    setMessages(anonMsgs as any[]);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      toast.error('اكتب رسالة أولاً');
      return;
    }

    await addMessage(newMessage);
    toast.success('✨ تم إرسال رسالتك المجهولة');
    setNewMessage('');
    loadMessages();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
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
        <h1 className="text-4xl font-bold text-white text-center mb-2">💌 رسائل مجهولة</h1>
        <p className="text-gray-400 text-center mb-8">محدش هيعرف مين كتب... اكتب اللي نفسك فيه</p>

        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-8">
          <textarea
            placeholder="اكتب هنا... (آمن و confidential)"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            maxLength={200}
            className="w-full bg-white/10 rounded-lg p-3 text-white placeholder-gray-400 min-h-[120px]"
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-gray-400 text-sm">{newMessage.length}/200</span>
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-2 rounded-full text-white font-semibold hover:opacity-90 transition"
            >
              ✨ إرسال مجهول
            </button>
          </div>
        </form>

        {loading ? (
          <div className="text-center text-white">جاري التحميل...</div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                <p className="text-gray-200">{msg.message}</p>
                <div className="mt-2 text-xs text-gray-500">
                  🕊️ مجهول • {msg.timestamp?.toDate?.().toLocaleDateString('ar-EG') || 'الآن'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}