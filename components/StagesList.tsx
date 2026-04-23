import { motion } from 'framer-motion';

interface StagesListProps {
  stages: any[];
  stagePercentages: number[];
  showFullTimeline: boolean;
  setShowFullTimeline: (value: boolean) => void;
}

export default function StagesList({ stages, stagePercentages, showFullTimeline, setShowFullTimeline }: StagesListProps) {
  return (
    <motion.div 
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <button 
        onClick={() => setShowFullTimeline(!showFullTimeline)}
        className="w-full text-center text-gray-400 text-sm py-3 hover:text-amber-400 transition flex items-center justify-center gap-2 bg-white/5 rounded-xl mt-2"
      >
        {showFullTimeline ? '▲ إخفاء التفاصيل' : '▼ عرض الرحلة التعليمية الكاملة بالتفصيل'}
      </button>

      {showFullTimeline && (
        <div className="space-y-3 mt-4">
          {stages.map((stage, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-black/30 backdrop-blur-sm rounded-xl p-4 border-l-4 border-l-${stage.badgeColor}-500 hover:bg-black/40 transition`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{stage.emoji}</span>
                    <h3 className="text-lg font-bold text-white">{stage.name}</h3>
                  </div>
                  <p className="text-gray-500 text-sm">{stage.period}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xl font-bold bg-gradient-to-r ${stage.color} bg-clip-text text-transparent`}>
                    {Math.floor(stagePercentages[idx])}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-3">
                <motion.div 
                  className={`h-full bg-gradient-to-r ${stage.color} rounded-full`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${stagePercentages[idx]}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>📅 من: {new Date(stage.start).toLocaleDateString('ar-EG')}</span>
                <span>➡️</span>
                <span>🏁 إلى: {new Date(stage.end).toLocaleDateString('ar-EG')}</span>
              </div>
              {stage.achievements && (
                <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-2 text-xs text-gray-400">
                  {stage.achievements.map((achievement: string, i: number) => (
                    <span key={i} className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full">✨ {achievement}</span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}