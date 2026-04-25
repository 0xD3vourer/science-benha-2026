'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminMemoriesPage() {
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => { loadMemories(); }, []);

  const loadMemories = async () => {
    const q = query(collection(db, 'memories'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    setMemories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('مسح الذكرى دي؟')) return;
    setDeleting(id);
    await deleteDoc(doc(db, 'memories', id));
    toast.success('اتمسحت ✅');
    setMemories(prev => prev.filter(m => m.id !== id));
    setDeleting(null);
  };

  if (loading) return <p className="text-center text-gray-400 py-12">جاري التحميل...</p>;

  return (
    <div className="space-y-4">
      <Toaster />
      <h2 className="text-2xl font-bold text-white mb-6">💭 الذكريات ({memories.length})</h2>

      {memories.length === 0 ? (
        <p className="text-center text-gray-500 py-12">مفيش ذكريات لحد دلوقتي</p>
      ) : memories.map(m => (
        <div key={m.id} className="bg-black/40 border border-white/10 rounded-xl p-4">
          <div className="flex gap-4">
            {m.imageUrl && <img src={m.imageUrl} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm leading-relaxed">{m.text}</p>
              <div className="mt-2 space-y-0.5">
                <p className="text-xs text-gray-500">
                  {m.isAnonymous ? '🎭 نشر مجهول' : `✍️ ${m.name}`} • {m.createdAt?.toDate?.().toLocaleDateString('ar-EG') || '—'}
                </p>
                {/* الإيميل الحقيقي — للأدمن بس */}
                <p className="text-xs text-amber-600/70">📧 {m.email || 'إيميل غير محفوظ'}</p>
              </div>
            </div>
            <button onClick={() => handleDelete(m.id)} disabled={deleting === m.id}
              className="text-red-400 hover:text-red-300 text-sm px-3 py-1 bg-red-500/10 rounded-lg transition flex-shrink-0 self-start disabled:opacity-40">
              {deleting === m.id ? '...' : '🗑️'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}