import { motion } from 'framer-motion';

interface TimelineProps {
  stages: any[];
}

export default function Timeline({ stages }: TimelineProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-black/30 backdrop-blur-sm rounded-xl p-5"
    >
      <p className="text-center text-gray-400 text-sm mb-4">📅 رحلة 16 عاماً من العلم والذكريات</p>
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gradient-to-r from-slate-600 via-blue-500 via-purple-500 to-amber-500" />
        <div className="relative flex justify-between">
          {stages.map((stage, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-900 border-2 border-white/20 flex items-center justify-center text-2xl relative z-10">
                {stage.emoji}
              </div>
              <span className="text-xs font-semibold mt-2 text-white/80">{stage.name.split(' ')[0]}</span>
              <span className="text-xs text-gray-500">{stage.period}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}