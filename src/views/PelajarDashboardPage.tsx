// src/pages/PelajarDashboardPage.tsx — Ruang Belajar Mahasiswa (ExplainMyLesson AI)

import AiContentPanel from "@/components/AiContentPanel";
import ChapterModeSelector from "@/components/ChapterModeSelector";
import LevelBadge from "@/components/LevelBadge";
import MaterialsList from "@/components/MaterialsList";
import OpenUploadModalButton from "@/components/OpenUploadModalButton";
import PointsBadge from "@/components/PointsBadge";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { type AiMode, availableChapters } from "@shared/catalog";
import { Link, useSearchParams } from "react-router-dom";

export default function PelajarDashboardPage() {
  const [searchParams] = useSearchParams();
  const chapter = searchParams.get("chapter") ?? "2";
  const mode = (searchParams.get("mode") ?? "ringkasan") as AiMode;
  const refreshNonce = searchParams.get("r") ?? "0";

  const chapterLabel =
    availableChapters.find((c) => c.value === chapter)?.label ?? "Dashboard Pelajar";
  useDocumentTitle(`Pelajar — ${chapterLabel}`);

  return (
    <div className="space-y-6">
      {/* 1. STUDENT MISSION COMMAND BANNER (WARNA CERAH, RAME, GAMIFIKASI) */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 sm:p-7 text-white shadow-xl shadow-indigo-500/15">
        {/* Subtle Decorative Light Rings */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-purple-400/25 blur-2xl rounded-full pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-60 h-60 bg-cyan-400/25 blur-2xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-blue-950 bg-white/95 px-3 py-1 rounded-full shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Semester Ganjil 2025/2026 · D3 Teknik Informatika SV UNS Madiun</span>
              </span>
              <span className="text-[11px] font-black text-amber-950 bg-gradient-to-r from-amber-300 to-orange-300 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                <span>🔥</span>
                <span>7 Hari Beruntun</span>
              </span>
              <span className="text-[11px] font-extrabold text-emerald-950 bg-emerald-300/90 px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                <span>⚡</span>
                <span>Target Harian: 100% Selesai</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-xs">
              Halo, Mahasiswa D3 TI (Ghandur &amp; Ridho) 👋
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/95 max-w-xl font-medium leading-relaxed">
              Dari 200 Halaman Modul jadi 2 Halaman Ringkas. Sumber 100% dari materi resmi dosen
              pengampu tanpa spekulasi AI bebas.
            </p>
          </div>

          {/* Gamification Stats Card */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4 shadow-md text-white">
            <div className="pr-4 border-r border-white/25">
              <span className="text-[10px] uppercase font-black text-blue-100 tracking-wider block">
                Total Poin XP
              </span>
              <div className="mt-1 text-white">
                <PointsBadge />
              </div>
            </div>

            <div className="pl-1 space-y-1">
              <span className="text-[10px] uppercase font-black text-blue-100 tracking-wider block">
                Level Saat Ini
              </span>
              <div className="mt-0.5">
                <LevelBadge level="MEDIUM" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SMART ADAPTIVE RECOMMENDATION ALERT (FR-16 & FR-17) — SUPER SHARP, VIBRANT & HIGH CONTRAST */}
      <aside className="rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50/60 to-amber-100/50 p-5 sm:p-6 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden">
        {/* Subtle decorative glow ring */}
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-amber-200/50 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-black text-slate-900 text-sm sm:text-base tracking-tight">
                Rekomendasi Remedial Adaptif
              </h2>
              <span className="text-[11px] font-black text-white bg-rose-500 px-2.5 py-0.5 rounded-full shadow-xs tracking-wide">
                Nilai &lt; 60 (Perlu Penguatan)
              </span>
              <span className="text-[10px] font-extrabold text-amber-900 bg-amber-200/90 border border-amber-300 px-2 py-0.5 rounded-md">
                ⚡ Algoritma Adaptif
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl font-medium">
              Skor kuis terakhir Anda di bawah ambang kelulusan pada{" "}
              <span className="text-amber-950 font-extrabold bg-amber-200/80 border border-amber-300 px-1.5 py-0.5 rounded">
                Bab 2: Agile, Scrum &amp; AI Assessment
              </span>
              . Disarankan untuk mempelajari kembali ringkasan esensial dan analogi bab ini sebelum
              mencoba kuis ulang.
            </p>
          </div>
        </div>

        <Link
          to="/dashboard/pelajar?chapter=2&mode=ringkasan"
          className="relative z-10 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-95 whitespace-nowrap self-start sm:self-auto shrink-0 flex items-center gap-2"
        >
          <span>Pelajari Modul Ini</span>
          <span className="text-base font-bold">&rarr;</span>
        </Link>
      </aside>

      {/* 3. MAIN WORKSPACE GRID (LEFT CONTROLS & RIGHT AI PANEL) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Controls & Materials */}
        <aside className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          {/* Upload Catatan Pribadi (FR-05 & FR-06) */}
          <div className="border-b border-slate-100 pb-5">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs font-bold text-slate-800">Upload PDF Catatan Pribadi</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
                Privat (500 char)
              </span>
            </div>
            <OpenUploadModalButton
              variant="private"
              label={
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  <span>Unggah File Catatan PDF</span>
                </span>
              }
              className="w-full border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-700 font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center shadow-2xs"
            />
          </div>

          {/* Chapter & AI Mode Switcher */}
          <ChapterModeSelector chapter={chapter} mode={mode} />

          {/* Kuis Adaptif Callout Button (FR-11 s/d FR-14) */}
          <div className="pt-1">
            <Link
              to="/dashboard/pelajar/kuis"
              className="w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs transition shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-95 flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <span>Mulai Kuis Adaptif 3 Level</span>
              </div>
              <span className="text-[10px] bg-amber-300 text-amber-950 font-black px-2 py-0.5 rounded-full shadow-2xs">
                +30 XP
              </span>
            </Link>
          </div>

          {/* Daftar Modul Terbitan */}
          <div className="border-t border-slate-100 pt-5">
            <MaterialsList />
          </div>
        </aside>

        {/* Right Article: AI Studio / Content Viewer */}
        <article className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <AiContentPanel chapterId={chapter} mode={mode} refreshNonce={refreshNonce} />
        </article>
      </div>
    </div>
  );
}
