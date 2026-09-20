// src/components/QuizClient.tsx — Kuis Adaptif CBT 3-Level (FR-11 s/d FR-14)

import { ErrorBanner, ListSkeleton } from "@/components/AsyncStateBanners";
import LevelBadge from "@/components/LevelBadge";
import { useQuizQuestionsQuery } from "@/hooks/useQuizQuery";
import { useUIStore } from "@/lib/store/useUIStore";
import type { Question } from "@shared/schema";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LEVEL_KEY: Record<number, string> = { 1: "EASY", 2: "MEDIUM", 3: "HARD" };

export default function QuizClient({ initialQuestions }: { initialQuestions?: Question[] }) {
  const navigate = useNavigate();

  const [level, setLevel] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const {
    data: questions,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuizQuestionsQuery(level, level === 1 ? initialQuestions : undefined);

  const selectedOption = useUIStore((s) => s.quizDraft.selectedOption);
  const showHint = useUIStore((s) => s.quizDraft.showHint);
  const setQuizSelectedOption = useUIStore((s) => s.setQuizSelectedOption);
  const setQuizShowHint = useUIStore((s) => s.setQuizShowHint);
  const resetQuizDraft = useUIStore((s) => s.resetQuizDraft);

  function handleSubmitAnswer() {
    if (!questions) return;
    if (selectedOption === null) {
      setFeedback("Pilih salah satu jawaban!");
      return;
    }

    const currentQuestion = questions[questionIndex];
    if (!currentQuestion) return;
    const isCorrect = selectedOption === currentQuestion.correctOption;
    const nextScore = isCorrect ? score + 10 : score;
    if (isCorrect) setScore(nextScore);

    setFeedback(null);
    resetQuizDraft();

    const nextIndex = questionIndex + 1;
    if (nextIndex >= questions.length) {
      if (level < 3) {
        setQuestionIndex(0);
        setLevel(level + 1);
      } else {
        alert(`Kuis Selesai! Total Skor: ${nextScore}`);
        navigate("/dashboard/pelajar");
      }
    } else {
      setQuestionIndex(nextIndex);
    }
  }

  function handleExit() {
    if (confirm("Keluar dari kuis?")) navigate("/dashboard/pelajar");
  }

  const totalQuestions = questions?.length ?? 10;
  const progressPercent = Math.round(((questionIndex + 1) / totalQuestions) * 100);
  const currentQuestion = questions?.[questionIndex] ?? null;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Status Bar */}
      <section className="bg-white border border-slate-200/80 p-5 sm:p-6 rounded-2xl shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <LevelBadge level={LEVEL_KEY[level]} />
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 mt-2">
            Bab 2: Agile, Scrum &amp; AI Assessment
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sistem Ujian Terkomputerisasi (CBT) Adaptif · [Nama Instansi]
          </p>
        </div>

        <div className="w-full sm:w-56 space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Progres Soal</span>
            <span className="text-blue-700 font-mono font-bold">
              {questionIndex + 1} / {totalQuestions}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleExit}
          className="text-xs text-slate-600 hover:text-slate-900 font-semibold px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl transition shadow-2xs"
        >
          Keluar Kuis
        </button>
      </section>

      {/* Question Card */}
      <article className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-xs space-y-6">
        {isLoading && <ListSkeleton rows={4} />}

        {isError && (
          <ErrorBanner
            message={error instanceof Error ? error.message : "Gagal memuat soal kuis."}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && currentQuestion && (
          <>
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-blue-700 uppercase font-bold">
                Soal Nomor {questionIndex + 1}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            <fieldset>
              <legend className="sr-only">Pilihan Jawaban</legend>
              <div className="space-y-2.5 text-xs sm:text-sm">
                {currentQuestion.options.map((option, idx) => (
                  <label
                    key={`${currentQuestion.id}-option-${idx}`}
                    className={`flex items-center p-4 rounded-xl border cursor-pointer transition ${
                      selectedOption === idx
                        ? "border-blue-500 bg-blue-50 text-blue-900 shadow-xs font-semibold"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
                    }`}
                  >
                    <input
                      type="radio"
                      name="quiz_option"
                      value={idx}
                      checked={selectedOption === idx}
                      onChange={() => {
                        setQuizSelectedOption(idx);
                        setFeedback(null);
                      }}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span className="ml-3 font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* RAG Hint Box */}
            <aside className="bg-gradient-to-r from-indigo-50/70 to-blue-50/40 border border-indigo-200 p-4 sm:p-5 rounded-xl flex items-start justify-between gap-4 shadow-2xs">
              <div className="text-xs text-indigo-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-indigo-900">
                  <svg
                    className="w-4 h-4 text-amber-500 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <span>Petunjuk RAG Terverifikasi</span>
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {showHint
                    ? currentQuestion.hint
                    : "Klik tombol di samping untuk membuka petunjuk referensi dari modul terkait."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQuizShowHint(true)}
                className="text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-lg transition whitespace-nowrap shadow-xs shrink-0"
              >
                Buka Petunjuk
              </button>
            </aside>

            {/* Bottom Actions */}
            <div className="border-t border-slate-100 pt-5 flex justify-between items-center">
              <span className="text-xs text-slate-500 font-mono font-semibold">
                {feedback ?? `Skor sementara: ${score} poin`}
              </span>
              <button
                type="button"
                onClick={handleSubmitAnswer}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md shadow-blue-500/25 transition active:scale-95"
              >
                Jawab &amp; Lanjut &rarr;
              </button>
            </div>
          </>
        )}
      </article>
    </main>
  );
}
