import { motion } from 'framer-motion';

interface UniversityProgressProps {
  universityPercentage: number;
}

export default function UniversityProgress({ universityPercentage }: UniversityProgressProps) {
  return (
    <motion.div 
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-r from-amber-950/40 to-orange-950/40 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20"
    >
      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🏛️</span>
          <span className="text-xl font-bold">كلية العلوم - جامعة بنها</span>
          <span className="px-2 py-1 bg-amber-500/20 rounded-full text-xs text-amber-300">قسم حاسب آلي</span>
        </div>
        <span className="text-3xl font-bold text-amber-400">{Math.floor(universityPercentage)}%</span>
      </div>
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full relative"
          initial={{ width: "0%" }}
          animate={{ width: `${universityPercentage}%` }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-4 bg-white rounded-full" />
        </motion.div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-3">
        <span>📅 البداية: 1 أكتوبر 2022</span>
        <span>🎯 النهاية: 14 يونيو 2026</span>
        <span>💻 قسـم الحاسب الآلي</span>
      </div>
    </motion.div>
  );
}