// src/pages/LoginPage.tsx — Vibrant Light SaaS Auth Page (Stripe / Linear style)
// ExplainMyLesson AI · Platform Pembelajaran RAG Adaptif

import LoginForm from "@/components/LoginForm";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Link, useSearchParams } from "react-router-dom";

export default function LoginPage() {
  useDocumentTitle("Masuk — ExplainMyLesson AI");
  const [searchParams] = useSearchParams();
  const authError = searchParams.get("auth_error");
  const redirect = searchParams.get("redirect");

  return (
    <main className="min-h-screen relative flex items-center justify-center px-4 py-12 bg-[#fafafa] text-slate-900 selection:bg-blue-600 selection:text-white overflow-hidden">
      {/* Ambient Pastel Gradient Aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-blue-200/60 via-indigo-200/50 to-cyan-200/50 blur-3xl rounded-full pointer-events-none z-0" />
      <div className="absolute -bottom-10 -right-20 w-80 h-80 bg-purple-200/40 blur-3xl rounded-full pointer-events-none z-0" />

      {/* Dot Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-0 opacity-70" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Back Link & Brand Header */}
        <div className="text-center space-y-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Kembali ke Beranda Utama</span>
          </Link>

          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-[1px] shadow-lg shadow-blue-500/25">
              <div className="w-full h-full bg-white rounded-[15px] flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              ExplainMyLesson AI
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Portal Otentikasi Terpadu · Platform Pembelajaran Adaptif
            </p>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl p-6 sm:p-8">
          {authError && (
            <div className="mb-4 text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
              <svg
                className="w-4 h-4 text-amber-600 shrink-0 mt-0.5"
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
              <p className="leading-relaxed">
                Sesi Anda berakhir atau belum masuk. Silakan masuk kembali untuk mengakses halaman
                tersebut.
              </p>
            </div>
          )}

          <LoginForm redirectTo={redirect} />
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500 font-medium">
          Standar Industri Front-End 2026 · Terverifikasi SKPL v1.0
        </div>
      </div>
    </main>
  );
}
