"use client";
import { motion } from 'framer-motion';
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";

interface CountdownTimerProps {
  targetDate: number;
  isFinished: boolean;
  timeSince: number;
}

export default function CountdownTimer({ targetDate, isFinished, timeSince }: CountdownTimerProps) {
  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl"
    >
      {!isFinished ? (
        <>
          <p className="text-center text-amber-400 mb-4 text-xs md:text-sm tracking-wider font-semibold">
            ⏳ العد التنازلي للحظة التخرج العظيمة
          </p>
          <div className="flex justify-center overflow-x-auto">
            <FlipClockCountdown
              to={targetDate}
              labels={['أيام', 'ساعات', 'دقائق', 'ثواني']}
              labelStyle={{ fontSize: 12, color: '#aaa' }}
              digitBlockStyle={{ background: '#0f0f1a', color: '#fff', borderRadius: 12 }}
            />
          </div>
          <p className="text-center text-gray-500 text-xs mt-4">
            14 يونيو 2026 - الساعة 3:30 عصراً
          </p>
        </>
      ) : (
        <>
          <p className="text-center text-green-400 mb-4 text-xs md:text-sm tracking-wider font-semibold">
            🎉 مبروك التخرج! 🎉
          </p>
          <div className="flex justify-center overflow-x-auto">
            <FlipClockCountdown
              to={Date.now() + timeSince}
              labels={['أيام', 'ساعات', 'دقائق', 'ثواني']}
              labelStyle={{ fontSize: 12, color: '#aaa' }}
              digitBlockStyle={{ background: '#0f0f1a', color: '#4ade80', borderRadius: 12 }}
            />
          </div>
          <p className="text-center text-gray-500 text-xs mt-4">
            الوقت المنقضي على التخرج المجيد
          </p>
        </>
      )}
    </motion.div>
  );
}