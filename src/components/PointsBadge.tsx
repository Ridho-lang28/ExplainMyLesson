// src/components/PointsBadge.tsx — Client UI State (Zustand)

import { useUIStore } from "@/lib/store/useUIStore";

export default function PointsBadge() {
  const totalPoints = useUIStore((state) => state.totalPoints);
  return (
    <div className="flex items-center gap-1.5 text-amber-300">
      <svg className="w-4 h-4 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <span className="text-xl font-extrabold tracking-tight">{totalPoints}</span>
      <span className="text-xs font-semibold text-amber-300/80 -ml-0.5">XP</span>
    </div>
  );
}
