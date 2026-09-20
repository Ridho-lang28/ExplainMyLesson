// src/components/ChapterProgressList.tsx — Tingkat Pemahaman Per Bab (FR-15)

import { ErrorBanner, ListSkeleton } from "@/components/AsyncStateBanners";
import { useChapterProgressQuery } from "@/hooks/useChapterProgressQuery";

const TONE_STYLES: Record<string, { bar: string; text: string; label: string; badge: string }> = {
  high: {
    bar: "bg-gradient-to-r from-emerald-500 to-teal-500",
    text: "text-emerald-800",
    label: "Pemahaman Tinggi",
    badge: "bg-emerald-50 border-emerald-200",
  },
  good: {
    bar: "bg-gradient-to-r from-blue-600 to-indigo-600",
    text: "text-blue-800",
    label: "Pemahaman Baik",
    badge: "bg-blue-50 border-blue-200",
  },
  warning: {
    bar: "bg-gradient-to-r from-amber-500 to-rose-500",
    text: "text-amber-800",
    label: "Perlu Perhatian",
    badge: "bg-amber-50 border-amber-200",
  },
};

const DEFAULT_TONE = TONE_STYLES.good!;

export default function ChapterProgressList() {
  const { data: chapters, isLoading, isError, error, refetch } = useChapterProgressQuery();

  if (isLoading) return <ListSkeleton rows={3} />;

  if (isError || !chapters) {
    return (
      <ErrorBanner
        message={error instanceof Error ? error.message : "Gagal memuat progres bab."}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-5 pt-2">
      {chapters.map((chapter) => {
        const tone = TONE_STYLES[chapter.tone] ?? DEFAULT_TONE;
        return (
          <div key={chapter.id} className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">{chapter.name}</span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${tone.badge} ${tone.text}`}
              >
                {chapter.percent}% · {tone.label}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-[1px] border border-slate-200/80">
              <div
                className={`${tone.bar} h-full rounded-full transition-all duration-700`}
                style={{ width: `${chapter.percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
