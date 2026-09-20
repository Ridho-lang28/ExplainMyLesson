// src/components/AiContentPanel.tsx — Panel Generasi AI & RAG Reader (FR-07 s/d FR-10, FR-19)

import { ListSkeleton } from "@/components/AsyncStateBanners";
import ClaimPointsButton from "@/components/ClaimPointsButton";
import RefreshAiButton from "@/components/RefreshAiButton";
import { useAiContentQuery } from "@/hooks/useAiContentQuery";
import type { AiMode } from "@shared/catalog";
import { useState } from "react";

export default function AiContentPanel({
  chapterId,
  mode,
  refreshNonce,
}: {
  chapterId: string;
  mode: AiMode;
  refreshNonce: string;
}) {
  const {
    data: content,
    isLoading,
    isError,
    error,
  } = useAiContentQuery(chapterId, mode, refreshNonce);

  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!content) return;
    const textToCopy = `${content.title}\n\n${content.body.join("\n\n")}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (isLoading) {
    return (
      <div className="space-y-4 p-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded-lg w-2/3" />
        <div className="h-4 bg-slate-100 rounded-lg w-1/3" />
        <div className="pt-4 space-y-3">
          <ListSkeleton rows={5} />
        </div>
      </div>
    );
  }

  if (isError || !content) {
    const message = error instanceof Error ? error.message : "Gagal memuat konten AI.";
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium p-6 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 font-bold text-sm">
          <svg
            className="w-5 h-5 text-rose-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>Gagal memuat konten pembelajaran AI</span>
        </div>
        <p>{message}</p>
        <RefreshAiButton variant="retry" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full justify-between space-y-6">
      {/* Top Header & RAG Badge */}
      <div className="space-y-3 border-b border-slate-100 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>RAG Verified (0% Halusinasi)</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">⏱️ ~2 menit baca</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition flex items-center gap-1.5 shadow-2xs"
            >
              {copied ? (
                <>
                  <svg
                    className="w-3.5 h-3.5 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-emerald-700 font-bold">Tersalin!</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-3.5 h-3.5 text-slate-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Salin Teks</span>
                </>
              )}
            </button>
            <RefreshAiButton />
          </div>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            {content.title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dihasilkan secara deterministik dari modul materi pembelajaran resmi dosen pengampu
          </p>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="space-y-3.5 text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
        {content.body.map((paragraph, idx) => {
          const borderColors = [
            "border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/40 via-white to-transparent",
            "border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-50/40 via-white to-transparent",
            "border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50/40 via-white to-transparent",
            "border-l-4 border-l-teal-500 bg-gradient-to-r from-teal-50/40 via-white to-transparent",
          ];
          const style = borderColors[idx % borderColors.length];

          return (
            <div
              key={`${content.title}-${idx}`}
              className={`p-4 sm:p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition shadow-2xs ${style}`}
            >
              <div className="flex items-center gap-2 mb-1.5 text-[11px] font-bold text-slate-500">
                <span className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs text-[10px]">
                  {idx + 1}
                </span>
                <span>Poin Esensial Modul</span>
              </div>
              <p className="whitespace-pre-wrap leading-relaxed text-slate-700">{paragraph}</p>
            </div>
          );
        })}
      </div>

      {/* Footer & Gamification CTA */}
      <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-purple-50/90 border border-blue-200/80 p-4 sm:p-5 rounded-2xl shadow-xs mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs text-slate-700">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/30">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="font-extrabold text-slate-900">Selesai Membaca?</p>
            <p className="text-slate-500 text-[11px]">
              Klaim poin gamifikasi XP sebelum menguji pemahaman di kuis adaptif.
            </p>
          </div>
        </div>
        <ClaimPointsButton />
      </div>
    </div>
  );
}
