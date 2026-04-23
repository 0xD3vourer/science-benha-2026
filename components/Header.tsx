"use client";
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.div 
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="text-center"
    >
      <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
        SCIENCE BENHA 2026
      </h1>
      <p className="text-gray-400 mt-4 text-lg">قسم الحاسب الآلي • دفعة الأبطال</p>
      <div className="flex justify-center gap-3 mt-3 text-sm">
        <span className="text-slate-400">🏫 2010</span>
        <span className="text-gray-600">→</span>
        <span className="text-blue-400">📚 2016</span>
        <span className="text-gray-600">→</span>
        <span className="text-purple-400">🎓 2019</span>
        <span className="text-gray-600">→</span>
        <span className="text-amber-400">🏛️ 2022</span>
        <span className="text-gray-600">→</span>
        <span className="text-rose-400">🎉 2026</span>
      </div>
    </motion.div>
  );
}