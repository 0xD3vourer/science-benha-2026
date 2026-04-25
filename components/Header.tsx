"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

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
      <p className="text-gray-400 mt-3 text-base">قسم الحاسب — دفعة 2026 🎓</p>
      <div className="flex justify-center gap-3 mt-3 text-sm flex-wrap">
        <span className="text-slate-400">🏫 2010</span>
        <span className="text-gray-600">←</span>
        <span className="text-blue-400">📚 2016</span>
        <span className="text-gray-600">←</span>
        <span className="text-purple-400">🎓 2019</span>
        <span className="text-gray-600">←</span>
        <span className="text-amber-400">🏛️ 2022</span>
        <span className="text-gray-600">←</span>
        <span className="text-rose-400">🎉 2026</span>
      </div>
      <div className="flex justify-center gap-3 mt-5 flex-wrap">
        <Link href="/join"
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-sm font-semibold rounded-xl transition">
          🎓 سجل في الدفعة
        </Link>
        <Link href="/gallery"
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-xl transition">
          💭 ذاكرة الدفعة
        </Link>
      </div>
    </motion.div>
  );
}