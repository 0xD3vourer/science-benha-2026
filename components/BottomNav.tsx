export default function BottomNav() {
  return (
    <div className="flex justify-center gap-4 pt-6 pb-4 text-sm">
      <a href="/guestbook" className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition px-5 py-2 rounded-full bg-white/5 hover:bg-white/10">
        📖 سجل الزوار
      </a>
      <a href="/anonymous" className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition px-5 py-2 rounded-full bg-white/5 hover:bg-white/10">
        💌 رسائل مجهولة
      </a>
    </div>
  );
}