// src/components/ChapterModeSelector.tsx
// Navigasi Bab & Mode Generasi AI (FR-07, FR-08, FR-09, FR-10)

import { type AiMode, aiModes, availableChapters } from "@shared/catalog";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ChapterModeSelector({
  chapter,
  mode,
}: {
  chapter: string;
  mode: AiMode;
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function updateQuery(next: { chapter?: string; mode?: string }) {
    const params = new URLSearchParams(searchParams);
    if (next.chapter) params.set("chapter", next.chapter);
    if (next.mode) params.set("mode", next.mode);
    navigate(`/dashboard/pelajar?${params.toString()}`);
  }

  return (
    <div className="space-y-5">
      <div>
        <label
          htmlFor="selectBab"
          className="block text-xs font-bold text-slate-800 mb-2 flex items-center justify-between"
        >
          <span>Pilih Modul Pembelajaran</span>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
            Publik
          </span>
        </label>
        <div className="relative">
          <select
            id="selectBab"
            value={chapter}
            onChange={(e) => updateQuery({ chapter: e.target.value })}
            className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 pr-10 font-bold cursor-pointer transition shadow-2xs"
          >
            {availableChapters.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      <fieldset>
        <legend className="block text-xs font-bold text-slate-800 mb-2.5">
          Pilih Format Penjelasan RAG
        </legend>
        <div className="space-y-2.5 text-xs">
          {aiModes.map((m) => {
            const isSelected = mode === m.value;
            const modeConfig: Record<
              string,
              {
                bgSelected: string;
                borderSelected: string;
                ringColor: string;
                iconBg: string;
                iconColor: string;
                icon: string;
              }
            > = {
              ringkasan: {
                bgSelected: "bg-gradient-to-r from-blue-50/90 via-indigo-50/40 to-white",
                borderSelected: "border-blue-500",
                ringColor: "ring-2 ring-blue-500/20",
                iconBg: "bg-blue-100",
                iconColor: "text-blue-600",
                icon: "📄",
              },
              analogi: {
                bgSelected: "bg-gradient-to-r from-purple-50/90 via-pink-50/40 to-white",
                borderSelected: "border-purple-500",
                ringColor: "ring-2 ring-purple-500/20",
                iconBg: "bg-purple-100",
                iconColor: "text-purple-600",
                icon: "💡",
              },
              mindmap: {
                bgSelected: "bg-gradient-to-r from-emerald-50/90 via-teal-50/40 to-white",
                borderSelected: "border-emerald-500",
                ringColor: "ring-2 ring-emerald-500/20",
                iconBg: "bg-emerald-100",
                iconColor: "text-emerald-600",
                icon: "🌳",
              },
              "tanya-jawab": {
                bgSelected: "bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-white",
                borderSelected: "border-amber-500",
                ringColor: "ring-2 ring-amber-500/20",
                iconBg: "bg-amber-100",
                iconColor: "text-amber-600",
                icon: "💬",
              },
            };
            const cfg = modeConfig[m.value] ?? modeConfig.ringkasan!;

            return (
              <label
                key={m.value}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition shadow-2xs ${
                  isSelected
                    ? `${cfg.borderSelected} ${cfg.bgSelected} ${cfg.ringColor} shadow-sm font-semibold`
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg ${cfg.iconBg} flex items-center justify-center text-sm shrink-0 shadow-2xs`}
                  >
                    {cfg.icon}
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 block text-xs">{m.label}</span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {m.value === "ringkasan"
                        ? "Ekstraksi ringkas 2 halaman esensial"
                        : m.value === "analogi"
                          ? "Pola pikir & perumpamaan kehidupan nyata"
                          : m.value === "mindmap"
                            ? "Hierarki pohon konsep terstruktur"
                            : "Latihan soal terapan praktikum"}
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="ai_mode"
                  value={m.value}
                  checked={isSelected}
                  onChange={(e) => updateQuery({ mode: e.target.value })}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                />
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
