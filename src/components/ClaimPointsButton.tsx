// src/components/ClaimPointsButton.tsx — Gamifikasi Klaim Poin (FR-13 & FR-14)

import { useUIStore } from "@/lib/store/useUIStore";
import { useState } from "react";

const POINTS_PER_CLAIM = 10;

export default function ClaimPointsButton() {
  const [claimed, setClaimed] = useState(false);
  const addPoints = useUIStore((state) => state.addPoints);

  function handleClaim() {
    if (claimed) return;
    addPoints(POINTS_PER_CLAIM);
    setClaimed(true);
  }

  return (
    <button
      type="button"
      onClick={handleClaim}
      disabled={claimed}
      className={`text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-xs ${
        claimed
          ? "bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default font-extrabold shadow-2xs"
          : "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-500/25 active:scale-95"
      }`}
    >
      {claimed ? (
        <>
          <svg
            className="w-3.5 h-3.5 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Poin Berhasil Diklaim (+{POINTS_PER_CLAIM} XP)</span>
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span>Tandai Selesai Baca (+{POINTS_PER_CLAIM} XP)</span>
        </>
      )}
    </button>
  );
}
