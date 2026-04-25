'use client';

import { useEffect, useState } from "react";
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';
import BackgroundEffects from '@/components/BackgroundEffects';
import CountdownTimer from '@/components/CountdownTimer';
import UniversityProgress from '@/components/UniversityProgress';
import FullJourneyProgress from '@/components/FullJourneyProgress';
import Timeline from '@/components/Timeline';
import StagesList from '@/components/StagesList';
import BottomNav from '@/components/BottomNav';
import Link from 'next/link';

export default function Home() {
  const targetDate = new Date("2026-06-14T15:30:00").getTime();
  const [isFinished, setIsFinished] = useState(false);
  const [timeSince, setTimeSince] = useState(0);
  const [showFullTimeline, setShowFullTimeline] = useState(false);

  const stages = [
    {
      name: "الابتدائية",
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
      name: "الإعدادية",
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
      name: "الثانوية",
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
      name: "الكلية",
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
        <BackgroundEffects />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <Header />

          {/* 🔥 زرار الجاليري في مكان مناسب */}
          <div className="flex justify-center">
            <Link href="/gallery">
              <button className="bg-amber-500 hover:bg-amber-600 text-black px-5 py-2 rounded-xl transition shadow-lg">
                🖼️ معرض الخريجين
              </button>
            </Link>
          </div>

          <CountdownTimer targetDate={targetDate} isFinished={isFinished} timeSince={timeSince} />
          <UniversityProgress universityPercentage={universityPercentage} />
          <FullJourneyProgress targetDate={targetDate} stages={stages} />
          <Timeline stages={stages} />
          <StagesList 
            stages={stages} 
            stagePercentages={stagePercentages} 
            showFullTimeline={showFullTimeline} 
            setShowFullTimeline={setShowFullTimeline} 
          />
          <BottomNav />
        </div>
      </div>
    </main>
  );
}