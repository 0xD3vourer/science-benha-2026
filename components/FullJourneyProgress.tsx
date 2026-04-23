import { motion } from 'framer-motion';

interface FullJourneyProgressProps {
  targetDate: number;
  stages: any[];
}

export default function FullJourneyProgress({ targetDate, stages }: FullJourneyProgressProps) {
  return (
    <motion.div 
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.25 }}
      className="bg-gradient-to-r from-slate-900/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🏆</span>
          <span className="text-xl font-bold">الرحلة التعليمية الكاملة</span>
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-400 mb-3">
        <span>🎒 أول يوم: الأحد 25 سبتمبر 2010</span>
        <span>🏁 يوم التخرج: 14 يونيو 2026</span>
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-300">📊 إجمالي الإنجاز</span>
        <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-slate-400 via-amber-400 to-orange-400 bg-clip-text">
          {(() => {
            const totalStart = new Date("2010-09-25").getTime();
            const totalEnd = targetDate;
            const now = new Date().getTime();
            const totalDuration = totalEnd - totalStart;
            const elapsed = Math.min(Math.max(now - totalStart, 0), totalDuration);
            const percentage = totalDuration > 0 ? (elapsed / totalDuration) * 100 : 100;
            return Math.floor(percentage);
          })()}%
        </span>
      </div>
      
      <div className="h-5 bg-gray-800 rounded-full overflow-hidden shadow-inner">
        <motion.div 
          className="h-full bg-gradient-to-r from-slate-500 via-amber-500 to-orange-500 rounded-full relative"
          initial={{ width: "0%" }}
          animate={{ width: `${(() => {
            const totalStart = new Date("2010-09-25").getTime();
            const totalEnd = targetDate;
            const now = new Date().getTime();
            const totalDuration = totalEnd - totalStart;
            const elapsed = Math.min(Math.max(now - totalStart, 0), totalDuration);
            return totalDuration > 0 ? (elapsed / totalDuration) * 100 : 100;
          })()}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-white rounded-full shadow-lg" />
        </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
        {stages.map((stage, idx) => {
          const totalStart = new Date("2010-09-25").getTime();
          const totalEnd = targetDate;
          const totalDuration = totalEnd - totalStart;
          const stageDuration = stage.end - stage.start;
          const stagePercentageOfTotal = (stageDuration / totalDuration) * 100;
          
          return (
            <div key={idx} className="text-center p-2 bg-white/5 rounded-lg">
              <div className="text-2xl mb-1">{stage.emoji}</div>
              <div className="text-xs font-semibold text-white/80">{stage.name.split(' ')[0]}</div>
              <div className={`text-sm font-bold bg-gradient-to-r ${stage.color} bg-clip-text text-transparent`}>
                {Math.floor(stagePercentageOfTotal)}%
              </div>
              <div className="text-xs text-gray-500">{stage.period}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-center text-xs text-gray-400 border-t border-white/10 pt-3">
        {(() => {
          const totalStart = new Date("2010-09-25").getTime();
          const totalEnd = targetDate;
          const now = new Date().getTime();
          const totalDays = Math.floor((totalEnd - totalStart) / (1000 * 60 * 60 * 24));
          const daysPassed = Math.floor(Math.min(Math.max(now - totalStart, 0), totalEnd - totalStart) / (1000 * 60 * 60 * 24));
          const percentComplete = Math.floor((daysPassed / totalDays) * 100);
          const daysLeft = totalDays - daysPassed;
          
          if (now >= totalEnd) {
            return `🎉 مبروك! أكملت رحلة ${totalDays.toLocaleString('ar-EG')} يوم (16 سنة) بنجاح! 🎉`;
          }
          
          return `📖 تم إنجاز ${daysPassed.toLocaleString('ar-EG')} يوم من أصل ${totalDays.toLocaleString('ar-EG')} يوم (16 سنة) • ${percentComplete}% اكتمل • باقي ${daysLeft.toLocaleString('ar-EG')} يوم على التخرج 🎯`;
        })()}
      </div>
    </motion.div>
  );
}