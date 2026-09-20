// src/pages/PengajarDashboardPage.tsx — Panel Analisis & Evaluasi Dosen (ExplainMyLesson AI)

import ChapterProgressList from "@/components/ChapterProgressList";
import ClassSummaryCards from "@/components/ClassSummaryCards";
import ExportReportButton from "@/components/ExportReportButton";
import MaterialsList from "@/components/MaterialsList";
import OpenUploadModalButton from "@/components/OpenUploadModalButton";
import StudentsNeedingHelp from "@/components/StudentsNeedingHelp";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function PengajarDashboardPage() {
  useDocumentTitle("Dashboard Pengajar — Analisis & Evaluasi Kelas");

  return (
    <div className="space-y-7">
      {/* 1. TOP COMMAND CENTER BANNER (WARNA CERAH, RAME, ANALITIK) */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-700 p-6 sm:p-7 text-white shadow-xl shadow-indigo-500/15">
        {/* Subtle Decorative Light Rings */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-400/20 blur-2xl rounded-full pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-60 h-60 bg-purple-400/25 blur-2xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-purple-950 bg-white/95 px-3 py-1 rounded-full shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Semester Ganjil 2025/2026 · D3 Teknik Informatika SV UNS Madiun</span>
              </span>
              <span className="text-[11px] font-black text-amber-950 bg-gradient-to-r from-amber-300 to-orange-300 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                <span>🎓</span>
                <span>Dosen Pengampu: Darmawan Lahru Riatma, S.Kom., M.MT</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-xs">
              Panel Evaluasi &amp; Analisis Capaian Kelas
            </h1>
            <p className="text-xs sm:text-sm text-purple-100/90 max-w-xl font-medium leading-relaxed">
              Monitoring tingkat pemahaman mahasiswa per modul kuliah, deteksi dini siswa butuh
              bimbingan (remedial), dan agregat nilai CBT adaptif.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ExportReportButton />
            <OpenUploadModalButton
              variant="public"
              label={
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <title>Ikon Unggah Modul</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Unggah Modul Pembelajaran</span>
                </span>
              }
              className="bg-white hover:bg-slate-50 text-indigo-900 text-xs font-black px-4 py-2.5 rounded-xl shadow-md transition active:scale-95 flex items-center gap-1.5 border border-white/60"
            />
          </div>
        </div>
      </section>

      {/* 2. BENTO METRIC CARDS (CLASS SUMMARY) */}
      <ClassSummaryCards />

      {/* 3. MAIN ANALYTICS GRID (CHAPTER PROGRESS & STUDENTS NEEDING INTERVENTION) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Chapter Comprehension Rate */}
        <section className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Tingkat Pemahaman Mahasiswa Per Bab
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Kalkulasi rata-rata skor kuis adaptif berbasis RAG per modul kuliah
              </p>
            </div>
            <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
              Live Aggregate
            </span>
          </div>

          <ChapterProgressList />
        </section>

        {/* Right: Students Needing Help (Score < 60) */}
        <section className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-slate-900 text-sm">Perlu Intervensi Bimbingan</h2>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full">
                Perhatian
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Terdeteksi skor kuis adaptif &lt; 60 (Ambang remedial)
            </p>
          </div>

          <StudentsNeedingHelp />
        </section>
      </div>

      {/* 4. PUBLISHED COURSE MODULES & MATERIALS */}
      <section className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs">
        <MaterialsList />
      </section>
    </div>
  );
}
