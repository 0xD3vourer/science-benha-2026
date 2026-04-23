"use client";
import { useState, useEffect } from 'react';
import { getGraduates } from '@/lib/firebase';
import { motion } from 'framer-motion';

export default function GraduatesList() {
  const [graduates, setGraduates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getGraduates();
      setGraduates(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return null;

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-5">
      <h3 className="text-center text-gray-300 text-sm mb-4">🎓 أسماء الخريجين المعتمدين ({graduates.length})</h3>
      <div className="flex flex-wrap justify-center gap-2 max-h-40 overflow-y-auto">
        {graduates.map((g, idx) => (
          <motion.span
            key={g.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.02 }}
            className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300"
          >
            {g.name}
          </motion.span>
        ))}
      </div>
    </div>
  );
}