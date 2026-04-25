import Link from 'next/link';

export default function BottomNav() {
  return (
    <div className="flex justify-center gap-3 pt-4 pb-6 text-sm flex-wrap border-t border-white/5 mt-4">
      <Link href="/join"
        className="px-4 py-2 rounded-full bg-white/5 hover:bg-amber-500/20 hover:text-amber-400 text-gray-400 transition">
        🎓 سجل في الدفعة
      </Link>
      <Link href="/gallery"
        className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-amber-400 text-gray-400 transition">
        💭 ذاكرة الدفعة
      </Link>
    </div>
  );
}