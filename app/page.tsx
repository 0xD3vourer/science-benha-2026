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
      achievements: ["قسم الحاسب", "مشاريع التخرج", "أحسن أيام العمر"],
      isMain: true
    }
  ];

  const [stagePercentages, setStagePercentages] = useState([0, 0, 0, 0]);
  const [universityPercentage, setUniversityPercentage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const newPercentages = stages.map(stage => {
        const total = stage.end - stage.start;
        const elapsed = Math.min(Math.max(now - stage.start, 0), total);
        return total > 0 ? (elapsed / total) * 100 : 100;
      });
      setStagePercentages(newPercentages);

      const uTotal = stages[3].end - stages[3].start;
      const uElapsed = Math.min(Math.max(now - stages[3].start, 0), uTotal);
      setUniversityPercentage(uTotal > 0 ? (uElapsed / uTotal) * 100 : 100);

      if (now >= targetDate && !isFinished) setIsFinished(true);
      if (isFinished) setTimeSince(now - targetDate);
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