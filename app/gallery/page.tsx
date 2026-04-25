'use client';

// src/pages/Gallery.tsx
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase'; // ← حسب path عندك

interface Graduate {
  id: string;
  name: string;
  section: string;
  photoUrl: string;
  approvedAt: string;
}

const SECTIONS = ['الكل', 'الحاسب', 'الكيمياء', 'الفيزياء', 'الرياضيات', 'الجيولوجيا', 'النبات', 'علوم الحيوان', 'علم الحشرات', 'كيمياء حيوية / ميكروبيولوجي'];

export default function Gallery() {
  const [graduates, setGraduates] = useState<Graduate[]>([]);
  const [filter, setFilter] = useState('الكل');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const q = query(collection(db, 'graduates'), orderBy('approvedAt', 'desc'));
      const snap = await getDocs(q);
      setGraduates(snap.docs.map(d => ({ id: d.id, ...d.data() } as Graduate)));
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = graduates.filter(g => {
    const matchSection = filter === 'الكل' || g.section === filter;
    const matchSearch = g.name.includes(search);
    return matchSection && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold text-center text-amber-400 mb-8">
        🎓 خريجو دفعة 2026
      </h1>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="ابحث بالاسم..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700"
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700"
        >
          {SECTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Count */}
      <p className="text-center text-gray-400 mb-6">
        {filtered.length} خريج
      </p>

      {/* Grid */}
      {loading ? (
        <p className="text-center text-gray-400">جاري التحميل...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {filtered.map(g => (
            <div key={g.id} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-amber-500 transition-all">
              {g.photoUrl ? (
                <img
                  src={g.photoUrl}
                  alt={g.name}
                  className="w-full aspect-square object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                />
              ) : (
                <div className="w-full aspect-square bg-gray-800 flex items-center justify-center text-4xl">
                  👤
                </div>
              )}
              <div className="p-2 text-center">
                <p className="text-sm font-semibold text-white truncate">{g.name}</p>
                <p className="text-xs text-amber-400">{g.section}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}