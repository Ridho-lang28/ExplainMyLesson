// src/components/StudentsNeedingHelp.tsx — Daftar Mahasiswa Perlu Bimbingan (FR-15)

import { ErrorBanner, ListSkeleton } from "@/components/AsyncStateBanners";
import { useStudentsNeedingHelpQuery } from "@/hooks/useStudentsNeedingHelpQuery";
import { useState } from "react";

export default function StudentsNeedingHelp() {
  const { data: students, isLoading, isError, error, refetch } = useStudentsNeedingHelpQuery();
  const [helpedIds, setHelpedIds] = useState<Record<string, boolean>>({});

  function handleGuide(studentId: string, studentName: string) {
    setHelpedIds((prev) => ({ ...prev, [studentId]: true }));
    alert(
      `Notifikasi materi remedial & jadwal konsultasi dikirimkan ke email mahasiswa: ${studentName}`
    );
  }

  if (isLoading) return <ListSkeleton rows={2} />;

  if (isError || !students) {
    return (
      <ErrorBanner
        message={
          error instanceof Error ? error.message : "Gagal memuat daftar pelajar perlu bimbingan."
        }
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-3">
      {students.map((student) => {
        const isHelped = !!helpedIds[student.id];
        const initials = student.name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("");

        return (
          <div
            key={student.id}
            className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 flex items-center justify-between gap-3 transition shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                {initials}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{student.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-slate-600">{student.chapter}</span>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                    Skor: {student.score}/{student.outOf}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleGuide(student.id, student.name)}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition shrink-0 shadow-xs ${
                isHelped
                  ? "bg-emerald-600 text-white cursor-default"
                  : "bg-amber-600 hover:bg-amber-500 text-white"
              }`}
            >
              {isHelped ? "✓ Terjadwal" : "Bimbing"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
