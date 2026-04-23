"use client";

import { useEffect, useState } from "react";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Home() {
  const targetDate = new Date("2026-06-14T15:30:00").getTime();
  const [isFinished, setIsFinished] = useState(false);
  const [timeSince, setTimeSince] = useState(0);
  const [showFullTimeline, setShowFullTimeline] = useState(false);

  // تواريخ المراحل (كاملة)
  const stages = [
    {
      name: "المرحلة الابتدائية",
      period: "2010 - 2016",
      start: new Date("2010-09-25").getTime(),
      end: new Date("2016-06-15").getTime(),
      color: "from-slate-500 to-gray-500",
      badgeColor: "slate",
      emoji: "🏫",
      icon: "📖",
      achievements: ["أول يوم في المدرسة", "تعلمت القراءة والكتابة", "ذكريات مش هتتكرر"]
    },
    {
      name: "المرحلة الإعدادية",
      period: "2016 - 2019",
      start: new Date("2016-09-25").getTime(),
      end: new Date("2019-06-20").getTime(),
      color: "from-blue-600 to-indigo-600",
      badgeColor: "blue",
      emoji: "📚",
      icon: "🏃",
      achievements: ["بداية المراهقة", "أولى خطوات الجد", "أصدقاء العمر"]
    },
    {
      name: "المرحلة الثانوية",
      period: "2019 - 2022",
      start: new Date("2019-09-29").getTime(),
      end: new Date("2022-06-30").getTime(),
      color: "from-purple-600 to-fuchsia-600",
      badgeColor: "purple",
      emoji: "🎓",
      icon: "⚡",
      achievements: ["ثانوية عامة", "تحديد المسار", "أيام لا تنسى"]
    },
    {
      name: "كلية العلوم - بنها",
      period: "2022 - 2026",
      start: new Date("2022-10-01").getTime(),
      end: targetDate,
      color: "from-amber-600 to-orange-600",
      badgeColor: "amber",
      emoji: "🏛️",
      icon: "💻",
      achievements: ["قسم حاسب آلي", "مشاريع التخرج", "أفضل أيام العمر"],
      isMain: true
    }
  ];

  const [stagePercentages, setStagePercentages] = useState([0, 0, 0, 0]);
  const [universityPercentage, setUniversityPercentage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      
      const newPercentages = stages.map(stage => {
        const total = stage.end - stage.start;
        const elapsed = Math.min(Math.max(now - stage.start, 0), total);
        return total > 0 ? (elapsed / total) * 100 : 100;
      });
      setStagePercentages(newPercentages);
      
      const universityTotal = stages[3].end - stages[3].start;
      const universityElapsed = Math.min(Math.max(now - stages[3].start, 0), universityTotal);
      setUniversityPercentage(universityTotal > 0 ? (universityElapsed / universityTotal) * 100 : 100);

      if (now >= targetDate && !isFinished) {
        setIsFinished(true);
        setTimeSince(now - targetDate);
      }
      if (isFinished) {
        setTimeSince(now - targetDate);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isFinished]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950">
      <div className="container mx-auto px-4 py-8 relative">
        <Toaster position="top-center" />
        
        {/* خلفية متحركة ناعمة */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] top-40 -left-20 animate-pulse" />
          <div className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] bottom-40 -right-20 animate-pulse delay-1000" />
        </div>

        {/* المحتوى الرئيسي */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          
          {/* العنوان */}
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

          {/* العداد الرئيسي */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl"
          >
            {!isFinished ? (
              <>
                <p className="text-center text-amber-400 mb-4 text-sm tracking-wider font-semibold">
                  ⏳ العد التنازلي للحظة التخرج العظيمة
                </p>
                <FlipClockCountdown
                  to={targetDate}
                  labels={['أيام', 'ساعات', 'دقائق', 'ثواني']}
                  labelStyle={{ fontSize: 12, color: '#aaa' }}
                  digitBlockStyle={{ background: '#0f0f1a', color: '#fff', borderRadius: 12 }}
                />
                <p className="text-center text-gray-500 text-xs mt-4">
                  14 يونيو 2026 - الساعة 3:30 عصراً
                </p>
              </>
            ) : (
              <>
                <p className="text-center text-green-400 mb-4 text-sm tracking-wider font-semibold">
                  🎉 مبروك التخرج! 🎉
                </p>
                <FlipClockCountdown
                  to={Date.now() + timeSince}
                  labels={['أيام', 'ساعات', 'دقائق', 'ثواني']}
                  labelStyle={{ fontSize: 12, color: '#aaa' }}
                  digitBlockStyle={{ background: '#0f0f1a', color: '#4ade80', borderRadius: 12 }}
                />
                <p className="text-center text-gray-500 text-xs mt-4">
                  الوقت المنقضي على التخرج المجيد
                </p>
              </>
            )}
          </motion.div>

          {/* شريط الجامعة المميز */}
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

          {/* شريط الرحلة التعليمية الكاملة 2010-2026 🏆 */}
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
            
            {/* تاريخ الرحلة كاملة */}
            <div className="flex justify-between text-xs text-gray-400 mb-3">
              <span>🎒 أول يوم: الأحد 25 سبتمبر 2010</span>
              <span>🏁 يوم التخرج: 14 يونيو 2026</span>
            </div>
            
            {/* شريط النسبة الإجمالي */}
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
            
            {/* الشريط الرئيسي */}
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

            {/* إحصائيات المراحل */}
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

            {/* النص التحفيزي */}
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

          {/* الخط الزمني المبسط */}
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

          {/* باقي المراحل بتنسيق جميل */}
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
                        {stage.achievements.map((achievement, i) => (
                          <span key={i} className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full">✨ {achievement}</span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* الروابط السريعة */}
          <div className="flex justify-center gap-4 pt-6 pb-4 text-sm">
            <a href="/guestbook" className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition px-5 py-2 rounded-full bg-white/5 hover:bg-white/10">
              📖 سجل الزوار
            </a>
            <a href="/anonymous" className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition px-5 py-2 rounded-full bg-white/5 hover:bg-white/10">
              💌 رسائل مجهولة
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}