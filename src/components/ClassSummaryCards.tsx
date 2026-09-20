// src/components/ClassSummaryCards.tsx — Bento Metric Cards Panel Dosen (FR-15 & FR-18)

import { ErrorBanner } from "@/components/AsyncStateBanners";
import ClassSummarySkeleton from "@/components/ClassSummarySkeleton";
import { useClassSummaryQuery } from "@/hooks/useClassSummaryQuery";

function MetricCard({
  label,
  value,
  valueClass = "text-slate-900",
  note,
  noteClass = "text-slate-500",
  cardBg = "bg-white border-slate-200",
  iconBg = "bg-slate-100 text-slate-700",
  icon,
}: {
  label: string;
  value: string | number;
  valueClass?: string;
  note: string;
  noteClass?: string;
  cardBg?: string;
  iconBg?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={`p-5 sm:p-6 rounded-2xl border transition shadow-xs hover:shadow-md flex flex-col justify-between ${cardBg}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold tracking-tight text-slate-700">{label}</span>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-2xs ${iconBg}`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-4">
        <p className={`text-2xl sm:text-3xl font-black tracking-tight ${valueClass}`}>{value}</p>
        <span className={`text-[11px] font-bold mt-1 inline-block ${noteClass}`}>{note}</span>
      </div>
    </div>
  );
}

export default function ClassSummaryCards() {
  const { data: summary, isLoading, isError, error, refetch } = useClassSummaryQuery();

  if (isLoading) return <ClassSummarySkeleton />;

  if (isError || !summary) {
    return (
      <ErrorBanner
        message={error instanceof Error ? error.message : "Gagal memuat ringkasan kelas."}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <MetricCard
        label="Mahasiswa Terdaftar"
        value={summary.totalStudents}
        valueClass="text-blue-900"
        cardBg="border-blue-200 bg-gradient-to-br from-blue-50/90 via-indigo-50/30 to-white"
        iconBg="bg-blue-600 text-white shadow-sm shadow-blue-500/25"
        note="● 100% Aktif Semester Ini"
        noteClass="text-emerald-700"
        icon={
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        }
      />
      <MetricCard
        label="Rata-Rata Pemahaman"
        value={`${summary.averageComprehension}%`}
        valueClass="text-indigo-900"
        cardBg="border-indigo-200 bg-gradient-to-br from-indigo-50/90 via-purple-50/30 to-white"
        iconBg="bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
        note="↑ +2.1% Peningkatan vs Minggu Lalu"
        noteClass="text-indigo-700"
        icon={
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        }
      />
      <MetricCard
        label="Modul Aktif Terindeks"
        value={`${summary.activeModules} Modul`}
        valueClass="text-purple-900"
        cardBg="border-purple-200 bg-gradient-to-br from-purple-50/90 via-pink-50/30 to-white"
        iconBg="bg-purple-600 text-white shadow-sm shadow-purple-500/25"
        note="✓ PDF Resmi Terverifikasi RAG"
        noteClass="text-purple-700"
        icon={
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        }
      />
      <MetricCard
        label="Mahasiswa Perlu Bimbingan"
        value={`${summary.studentsNeedingIntervention} Mahasiswa`}
        valueClass="text-amber-950"
        cardBg="border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-100/40"
        iconBg="bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm shadow-orange-500/30"
        note="⚠️ Perhatian: Nilai Kuis < 60"
        noteClass="text-amber-900 font-extrabold"
        icon={
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        }
      />
    </div>
  );
}
