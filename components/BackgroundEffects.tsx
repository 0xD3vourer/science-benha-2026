export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] top-40 -left-20 animate-pulse" />
      <div className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] bottom-40 -right-20 animate-pulse delay-1000" />
    </div>
  );
}