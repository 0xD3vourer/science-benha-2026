'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast, { Toaster } from 'react-hot-toast';

interface Memory {
  id: string;
  text: string;
  name: string;
  isAnonymous: boolean;
  imageUrl?: string;
  createdAt: any;
}

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => { loadMemories(); }, []);

  const loadMemories = async () => {
    const q = query(collection(db, 'memories'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    setMemories(snap.docs.map(d => ({ id: d.id, ...d.data() } as Memory)));
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!text.trim()) return toast.error('اكتب حاجة الأول');
    if (!isAnonymous && !name.trim()) return toast.error('اكتب اسمك أو اختار مجهول');
    setSending(true);
    await addDoc(collection(db, 'memories'), {
      text: text.trim(),
      name: isAnonymous ? 'مجهول' : name.trim(),
      isAnonymous,
      createdAt: serverTimestamp(),
    });
    toast.success('تم إرسال ذكرتك ✨');
    setText(''); setName('');
    setSending(false);
    loadMemories();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 p-6">
      <Toaster />
      <div className="max-w-2xl mx-auto">
        
        <a href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition">
          → الصفحة الرئيسية
        </a>

        <h1 className="text-3xl font-bold text-amber-400 text-center mb-1">💭 ذاكرة الدفعة</h1>
        <p className="text-gray-500 text-center text-sm mb-8">كل ذكرى هنا هتفضل للأبد</p>

        {/* Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
          <textarea
            placeholder="اكتب ذكرى، كلمة، أو أي حاجة نفسك فيها..."
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={300}
            rows={4}
            className="w-full bg-white/10 rounded-xl p-3 text-white placeholder-gray-500 resize-none text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          
          {/* Anonymous toggle */}
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => setIsAnonymous(false)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${!isAnonymous ? 'bg-amber-500 text-black' : 'bg-white/10 text-gray-400'}`}
            >
              ✍️ باسمي
            </button>
            <button
              onClick={() => setIsAnonymous(true)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${isAnonymous ? 'bg-slate-600 text-white' : 'bg-white/10 text-gray-400'}`}
            >
              🎭 مجهول
            </button>
          </div>

          {!isAnonymous && (
            <input
              placeholder="اسمك"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white/10 rounded-xl p-3 text-white placeholder-gray-500 text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          )}

          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs">{text.length}/300</span>
            <button
              onClick={handleSubmit}
              disabled={sending}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black px-5 py-2 rounded-xl text-sm font-semibold transition"
            >
              {sending ? '...' : 'إرسال ✨'}
            </button>
          </div>
        </div>

        {/* Memories list */}
        {loading ? (
          <p className="text-center text-gray-600">جاري التحميل...</p>
        ) : memories.length === 0 ? (
          <p className="text-center text-gray-600">لسه مفيش ذكريات — كن الأول 🌟</p>
        ) : (
          <div className="space-y-3">
            {memories.map(m => (
              <div key={m.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white text-sm leading-relaxed">{m.text}</p>
                <div className="flex justify-between mt-3 text-xs text-gray-500">
                  <span>{m.isAnonymous ? '🎭 مجهول' : `✍️ ${m.name}`}</span>
                  <span>{m.createdAt?.toDate?.().toLocaleDateString('ar-EG') || 'الآن'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}