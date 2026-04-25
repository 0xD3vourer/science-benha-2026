"use client";

import { motion } from 'framer-motion';

export default function JoinPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            انضم لقائمة الدفعة 🎓
          </h1>
          <p className="text-gray-400 mt-2">أضف اسمك لسجل خريجين علوم بنها 2026</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10 text-center"
        >
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-bold text-white mb-4">طلب الانضمام للدفعة</h2>
          <p className="text-gray-400 mb-6">
            عشان نضيف اسمك لقائمة الخريجين، محتاج تملأ الفورم التالي:
          </p>
          
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSclIdouwKK2NrIYx6Axtgwa2K-0J0oNMIm78BC7ZkUXE8M9Cw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            🎓 اضغط هنا لتقديم الطلب
          </a>
          
          <p className="text-xs text-gray-500 mt-6">
            بعد ما تقدم الطلب، هنتواصل معاك للموافقة على إضافتك
          </p>
        </motion.div>
        
        <div className="text-center mt-6">
          <a href="/" className="text-gray-400 hover:text-amber-400 text-sm transition">← رجوع للصفحة الرئيسية</a>
        </div>
      </div>
    </main>
  );
} 