// src/pages/LandingPage.tsx — Vibrant Light SaaS Edition (Stripe / Linear Light style)
// ExplainMyLesson AI · Platform Pembelajaran RAG Adaptif

import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  useDocumentTitle("ExplainMyLesson AI — Platform Pembelajaran Adaptif Terverifikasi RAG");

  // State interaktif untuk interactive product demo frame
  const [activePreviewTab, setActivePreviewTab] = useState<
    "ringkasan" | "analogi" | "kuis" | "rag"
  >("ringkasan");
  const [selectedDemoQuizOption, setSelectedDemoQuizOption] = useState<number | null>(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Bagaimana ExplainMyLesson AI mencegah halusinasi jawaban?",
      a: "ExplainMyLesson menerapkan arsitektur Retrieval-Augmented Generation (RAG) ketat berbasis dokumen resmi perkuliahan yang diunggah oleh Dosen Pengampu. Jawaban, ringkasan, dan kuis dikunci secara matematis hanya dari chunk dokumen materi (500 karakter/vektor) tanpa mengambil informasi liar yang tidak terverifikasi dari internet terbuka.",
    },
    {
      q: "Apakah aplikasi ini benar-benar Front-End murni (tanpa setup database eksternal)?",
      a: "Tepat sekali. Sesuai dengan spesifikasi Tugas 8 dan Bab 12 panduan front-end engineering 2026, seluruh sistem berjalan sebagai Client-Side SPA berbasis React 18, Vite, TypeScript, TanStack Query v5, dan Zustand dengan in-memory Backend-for-Frontend (BFF) mock server. Tidak memerlukan instalasi database MySQL/PostgreSQL.",
    },
    {
      q: "Bagaimana sistem mendeteksi mahasiswa yang membutuhkan intervensi bimbingan?",
      a: "Sistem mencatat skor pengerjaan kuis adaptif secara real-time. Jika mahasiswa mendapatkan skor kuis di bawah ambang batas kelulusan (< 60) pada modul tertentu (misalnya Bab 2: Agile & Scrum), sistem secara otomatis mengibarkan status 'Perlu Bimbingan' pada Dashboard Analisis Dosen dan memberikan rekomendasi modul remedial di sisi Pelajar.",
    },
    {
      q: "Apa saja perbedaan antara akun Pelajar dan akun Pengajar?",
      a: "Akun Pelajar (Mahasiswa) memiliki akses ke modul publik, unggah catatan PDF privat, latihan kuis adaptif 3 tingkat berpoin, dan pelacakan level gamifikasi. Sedangkan akun Pengajar (Dosen) memiliki wewenang mengunggah modul kuliah resmi satu kelas, memantau heatmap pemahaman bab, daftar mahasiswa perlu bimbingan, serta mengekspor rekapitulasi nilai kelas ke format CSV.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-slate-900 font-sans selection:bg-blue-600 selection:text-white antialiased relative">
      {/* 1. TOP HEADER & MODERN SAAS NAVIGATION BAR */}
      <header
        className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-[1px] shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition">
              <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
                <svg
                  className="w-4.5 h-4.5 text-blue-600"
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
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition">
                  ExplainMyLesson
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  EdTech AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-0.5">
                Adaptive RAG Learning Platform
              </p>
            </div>
          </Link>

          <nav
            className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-600"
            role="navigation"
            aria-label="Navigasi Utama"
          >
            <a href="#demo" className="hover:text-blue-600 transition">
              Interactive Demo
            </a>
            <a href="#bento" className="hover:text-blue-600 transition">
              Arsitektur Fitur
            </a>
            <a href="#komparasi" className="hover:text-blue-600 transition">
              RAG vs AI Bebas
            </a>
            <a href="#pieces" className="hover:text-blue-600 transition">
              Latar Belakang PIECES
            </a>
            <a href="#faq" className="hover:text-blue-600 transition">
              FAQ
            </a>
            <a href="#tentang" className="hover:text-blue-600 transition">
              Tentang Platform
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-bold text-slate-700 hover:text-blue-600 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition"
            >
              Masuk
            </Link>
            <Link
              to="/login?mode=register"
              className="text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-4 py-2 rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 active:scale-95"
            >
              <span>Daftar Akun</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION DENGAN PASTEL GLOW & DOT GRID PATTERN */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80">
        {/* Ambient Soft Pastel Aurora Blobs */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[450px] bg-gradient-to-tr from-blue-200/60 via-indigo-200/50 to-cyan-200/50 blur-3xl rounded-full pointer-events-none z-0" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-200/50 blur-3xl rounded-full pointer-events-none z-0" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-emerald-100/50 blur-3xl rounded-full pointer-events-none z-0" />

        {/* Subtle Dot Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0 opacity-80" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
            {/* Announcement Shimmer Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-xs text-slate-800 text-xs font-bold backdrop-blur-md hover:border-blue-300 transition cursor-default">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span>Proyek Akhir Front-End Engineering 2026</span>
              <span className="text-slate-300">|</span>
              <span className="text-blue-700 font-semibold">Platform Edukasi Adaptif</span>
            </div>

            {/* High-Impact Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
              Dari 200 Halaman Modul Menjadi{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                2 Halaman Esensial
              </span>{" "}
              Tanpa Halusinasi.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
              Platform pembelajaran adaptif Front-End berbasis Retrieval-Augmented Generation (RAG).
              Tersinkronisasi 100% dengan materi resmi dosen pengampu untuk pemahaman konsep tanpa
              spekulasi liar.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 w-full sm:w-auto">
              <Link
                to="/login?role=pelajar"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/35 transition flex items-center justify-center gap-2.5 group"
              >
                <svg
                  className="w-4 h-4 text-blue-200 group-hover:scale-110 transition"
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
                <span>Mulai Belajar (Demo Mahasiswa)</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
              <Link
                to="/login?role=pengajar"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-slate-900 font-bold text-sm shadow-xs transition flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span>Portal Evaluasi Dosen</span>
              </Link>
            </div>

            {/* Social Trust Proof Pill */}
            <div className="pt-4 flex items-center gap-3 text-xs text-slate-600">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                  P
                </div>
                <div className="w-7 h-7 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                  M
                </div>
                <div className="w-7 h-7 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                  D
                </div>
              </div>
              <span className="font-medium">
                Diuji &amp; divalidasi pada modul kurikulum pembelajaran modern
              </span>
            </div>
          </div>

          {/* 3. INTERACTIVE PRODUCT DEMO FRAME (MAC / BROWSER LIGHT SAAS STYLE) */}
          <div id="demo" className="mt-14 max-w-5xl mx-auto">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-200 to-slate-300 p-1 shadow-2xl shadow-blue-500/10 border border-slate-200">
              <div className="rounded-xl bg-white overflow-hidden">
                {/* Browser Window Bar */}
                <div className="bg-slate-100/90 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                    <div className="hidden sm:flex items-center gap-2 ml-4 px-3 py-1 rounded-md bg-white border border-slate-200 text-[11px] text-slate-500 font-mono">
                      <span className="text-emerald-600 font-semibold">https://</span>
                      <span>app.explainmylesson.id/modul/bab-2</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      RAG Verified (0% Halusinasi)
                    </span>
                  </div>
                </div>

                {/* Interactive Mode Tabs */}
                <div className="bg-slate-50/70 p-2.5 border-b border-slate-200 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setActivePreviewTab("ringkasan")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                      activePreviewTab === "ringkasan"
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span>1. Ringkasan Eksekutif (2 Halaman)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreviewTab("analogi")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                      activePreviewTab === "analogi"
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span>2. Analogi Logis Sehari-Hari</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreviewTab("kuis")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                      activePreviewTab === "kuis"
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                    <span>3. Kuis CBT Adaptif (+Poin)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreviewTab("rag")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                      activePreviewTab === "rag"
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                      />
                    </svg>
                    <span>4. Inspektur Chunk Sumber RAG</span>
                  </button>
                </div>

                {/* Live Preview Screen Content */}
                <div className="p-6 sm:p-8 min-h-[300px] text-slate-700 text-xs sm:text-sm">
                  {activePreviewTab === "ringkasan" && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <h4 className="text-base font-bold text-slate-900">
                            Bab 2: Agile Methodology &amp; AI-Assisted Assessment
                          </h4>
                          <span className="text-xs text-slate-500">
                            Kompresi cerdas: 180 halaman silabus diekstraksi menjadi 3 pilar aksi
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded font-bold">
                          0.38s Processing
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4 pt-1">
                        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1">
                          <span className="text-blue-600 font-mono text-xs font-bold">Pilar 1</span>
                          <h5 className="font-bold text-slate-900 text-xs">
                            Iterasi Sprint 2 Minggu
                          </h5>
                          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                            Pengembangan berbasis user story terukur dengan retrospective
                            berkelanjutan demi adaptasi cepat terhadap perubahan kebutuhan.
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-1">
                          <span className="text-indigo-600 font-mono text-xs font-bold">
                            Pilar 2
                          </span>
                          <h5 className="font-bold text-slate-900 text-xs">
                            Automated Quality Gates
                          </h5>
                          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                            Verifikasi kode terotomasi lewat Biome Linter dan TypeScript compile
                            check di pull request sebelum masuk branch utama.
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                          <span className="text-emerald-600 font-mono text-xs font-bold">
                            Pilar 3
                          </span>
                          <h5 className="font-bold text-slate-900 text-xs">
                            Outcome-Based Evaluation
                          </h5>
                          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                            Penilaian kompetensi praktikum yang mengukur pemahaman nyata melalui
                            kuis adaptif dan artefak kode terverifikasi.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activePreviewTab === "analogi" && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="border-b border-slate-100 pb-3">
                        <h4 className="text-base font-bold text-slate-900">
                          Analogi Logis: Mengapa Vite Menggantikan Bundler Webpack Konvensional?
                        </h4>
                        <span className="text-xs text-slate-500">
                          Model mental sederhana agar teori arsitektur langsung dipahami
                        </span>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-50/70 via-blue-50/40 to-slate-50 border border-indigo-100">
                        <p className="text-slate-800 leading-relaxed text-xs sm:text-sm">
                          "Bayangkan Anda sedang membaca ensiklopedia tebal di perpustakaan.{" "}
                          <strong>Bundler lama (Webpack)</strong> seperti mencetak ulang seluruh 500
                          halaman buku setiap kali penulis merevisi satu kata di bab 3. Sedangkan{" "}
                          <strong>Vite</strong> bekerja seperti web browser modern: ia hanya memuat
                          satu paragraf yang sedang Anda baca lewat modul ESM mandiri. Itulah
                          mengapa server Vite menyala dalam 5 milidetik terlepas dari seberapa besar
                          aplikasi Anda."
                        </p>
                        <div className="mt-3 pt-3 border-t border-indigo-100 flex items-center justify-between text-[11px] text-indigo-700 font-semibold">
                          <span>Relevan untuk Bab 8: Migrasi Vite &amp; Fast Build</span>
                          <span className="text-emerald-700">✓ Diverifikasi Dosen Pengampu</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activePreviewTab === "kuis" && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                              Level 2 — MEDIUM
                            </span>
                            <span className="text-xs text-amber-700 font-bold">
                              +20 Poin Gamifikasi
                            </span>
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                            Soal Latihan: Apa perbedaan utama antara Client State dan Server State?
                          </h4>
                        </div>
                        <span className="text-xs text-slate-500 font-mono">Soal 4/10</span>
                      </div>

                      <div className="space-y-2">
                        {[
                          "Client State menyimpan data UI ephemeral (Zustand), sedangkan Server State meng-cache data remote asynchronous (TanStack Query).",
                          "Client State hanya bisa digunakan di server, sedangkan Server State berjalan di browser.",
                          "Keduanya persis sama dan tidak perlu dipisahkan dalam arsitektur modern.",
                        ].map((opt, i) => (
                          <button
                            type="button"
                            key={`demo-quiz-${i}`}
                            onClick={() => setSelectedDemoQuizOption(i)}
                            className={`w-full text-left p-3.5 rounded-xl border text-xs cursor-pointer transition flex items-center gap-3 ${
                              selectedDemoQuizOption === i
                                ? "bg-blue-50 border-blue-500 text-blue-900 shadow-xs"
                                : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                selectedDemoQuizOption === i
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span className="leading-snug flex-1">{opt}</span>
                            {selectedDemoQuizOption === i && i === 0 && (
                              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                                Benar (+10 XP)
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activePreviewTab === "rag" && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <h4 className="text-base font-bold text-slate-900">
                            Inspektur Vektor Chunk RAG
                          </h4>
                          <span className="text-xs text-slate-500">
                            Melihat teks asli dari PDF modul dosen yang dipakai sebagai rujukan
                            sistem
                          </span>
                        </div>
                        <span className="text-xs font-mono text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded font-bold">
                          Cosine Similarity: 0.941
                        </span>
                      </div>
                      <div className="bg-slate-50 font-mono text-[11px] p-4 rounded-xl border border-slate-200 text-slate-800 space-y-2">
                        <div className="text-slate-500 text-[10px]">
                          // Sumber: modul_pembelajaran_resmi.pdf [Halaman 42, Chunk #108]
                        </div>
                        <p className="text-slate-900">
                          "Metodologi Agile pada rekayasa front-end menuntut mahasiswa mampu membagi
                          arsitektur menjadi unit terisolasi yang dapat diuji secara mandiri sebelum
                          digabungkan ke pipeline integrasi berkelanjutan."
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Window Bottom Status Footer */}
                <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-3">
                    <span>
                      Modul Aktif:{" "}
                      <strong className="text-slate-900">Bab 2 (Agile &amp; Scrum)</strong>
                    </span>
                    <span className="text-slate-300">|</span>
                    <span>
                      Pengampu: <strong className="text-slate-900">[Nama Dosen]</strong>
                    </span>
                  </div>
                  <Link
                    to="/login?role=pelajar"
                    className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
                  >
                    <span>Jalankan di Dashboard Pelajar</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MODERN LIGHT SAAS BENTO GRID (ARSITEKTUR & FITUR KUNCI) */}
      <section id="bento" className="py-20 lg:py-28 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              Arsitektur Berstandar Industri 2026
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Didesain dengan Standar Rekayasa Modern, Bukan Sekadar AI Chatbot Biasa
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Menggabungkan kecepatan build Vite, isolasi state terstruktur (Zustand + TanStack
              Query), dan guardrail RAG anti-halusinasi.
            </p>
          </div>

          {/* Bento Box Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento 1: 200 Halaman to 2 Halaman (Span 2) */}
            <div className="md:col-span-2 rounded-2xl bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-white p-7 sm:p-8 border border-blue-200/80 hover:border-blue-400 hover:shadow-xl transition relative overflow-hidden group">
              <div className="relative z-10 space-y-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Kompresi Cerdas Modul 200 Halaman &rarr; 2 Halaman
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed font-medium">
                    Mahasiswa sering kelelahan membaca ratusan halaman modul tebal. Algoritma
                    chunking dan RAG mengekstraksi konsep inti, analogi mental, dan poin krusial
                    yang langsung aplikatif saat praktikum.
                  </p>
                </div>
                <div className="pt-2 grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-white/90 border border-blue-200 text-center shadow-2xs">
                    <div className="text-lg font-black text-blue-600">95%</div>
                    <div className="text-[10px] text-slate-500 font-bold">
                      Pengurangan Waktu Baca
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/90 border border-emerald-200 text-center shadow-2xs">
                    <div className="text-lg font-black text-emerald-600">100%</div>
                    <div className="text-[10px] text-slate-500 font-bold">Sesuai Silabus Dosen</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/90 border border-indigo-200 text-center shadow-2xs">
                    <div className="text-lg font-black text-indigo-600">0.05s</div>
                    <div className="text-[10px] text-slate-500 font-bold">
                      Query Cache Invalidation
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento 2: 0% Halusinasi Guardrail (Span 1) */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-white p-7 sm:p-8 border border-emerald-200/80 hover:border-emerald-400 hover:shadow-xl transition relative overflow-hidden group">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  RAG Anti-Halusinasi
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Tidak seperti ChatGPT umum yang bisa mengarang teori fiktif, ExplainMyLesson
                  mengunci batas jawaban hanya pada teks modul PDF yang diunggah dosen.
                </p>
                <div className="p-3 rounded-xl bg-white/90 border border-emerald-300 text-[11px] text-emerald-900 font-bold flex items-center gap-2 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Setiap jawaban menyertakan rujukan bab &amp; halaman asli.</span>
                </div>
              </div>
            </div>

            {/* Bento 3: 3-Tier Adaptive Quiz CBT (Span 1) */}
            <div className="rounded-2xl bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-white p-7 sm:p-8 border border-amber-300 hover:border-amber-400 hover:shadow-xl transition relative overflow-hidden group">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Kuis CBT 3 Tingkat
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Tingkat kesulitan adaptif yang berjenjang:
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/90 border border-emerald-200 shadow-2xs">
                    <span className="text-emerald-800 font-bold">Level 1: Dasar</span>
                    <span className="text-emerald-700 font-bold">+10 Poin</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/90 border border-blue-200 shadow-2xs">
                    <span className="text-blue-800 font-bold">Level 2: Menengah</span>
                    <span className="text-blue-700 font-bold">+20 Poin</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/90 border border-purple-200 shadow-2xs">
                    <span className="text-purple-800 font-bold">Level 3: Analisis</span>
                    <span className="text-purple-700 font-bold">+30 Poin</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento 4: Dosen Analytics Matrix & Intervention (Span 2) */}
            <div className="md:col-span-2 rounded-2xl bg-gradient-to-br from-purple-50/80 via-pink-50/40 to-white p-7 sm:p-8 border border-purple-200/80 hover:border-purple-400 hover:shadow-xl transition relative overflow-hidden group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Panel Analisis Dosen &amp; Early Intervention
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Dosen pengampu dapat mengidentifikasi mahasiswa yang belum tuntas memahami bab
                    tertentu sebelum ujian tengah semester tiba.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="text-xs text-amber-800 font-bold flex items-center justify-center sm:justify-start gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>Otomasi Deteksi Skor &lt; 60</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Sistem menyediakan tombol bimbingan terarah dan ekspor rekapitulasi nilai
                      kelas langsung ke format CSV.
                    </p>
                  </div>
                  <Link
                    to="/login?role=pengajar"
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition whitespace-nowrap shadow-md shadow-purple-500/20"
                  >
                    Buka Panel Pengajar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MODERN LIGHT SAAS COMPARISON TABLE (SKPL TABEL 1.1) */}
      <section
        id="komparasi"
        className="py-20 lg:py-28 border-b border-slate-200/80 bg-slate-50/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-800 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full">
              Matriks Validasi Dokumen SKPL
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Mengapa ExplainMyLesson Jauh Lebih Unggul dari AI Publik?
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Perbandingan komprehensif antara model bahasa internet terbuka dan platform RAG
              terikat modul kuliah.
            </p>
          </div>

          <div className="max-w-5xl mx-auto overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    <th className="p-4 sm:p-5">Parameter Evaluasi</th>
                    <th className="p-4 sm:p-5 text-slate-500">
                      AI Bebas Internet (ChatGPT / Gemini)
                    </th>
                    <th className="p-4 sm:p-5 text-blue-900 bg-blue-50/70 border-l border-r border-blue-100 font-extrabold">
                      ExplainMyLesson AI (RAG Terverifikasi)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-slate-900">Sumber Pengetahuan</td>
                    <td className="p-4 sm:p-5 text-slate-600">
                      Internet publik secara acak; tidak mengenal modul dan silabus dosen.
                    </td>
                    <td className="p-4 sm:p-5 font-bold text-blue-800 bg-blue-50/40 border-l border-r border-blue-100">
                      ✓ 100% Modul PDF resmi yang diunggah dosen pengampu.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-slate-900">
                      Tingkat Risiko Halusinasi
                    </td>
                    <td className="p-4 sm:p-5 text-rose-600 font-medium">
                      Tinggi (Sering mengarang istilah teknis fiktif dan kode tidak kompatibel).
                    </td>
                    <td className="p-4 sm:p-5 font-bold text-emerald-800 bg-blue-50/40 border-l border-r border-blue-100">
                      ✓ 0% Halusinasi — output terikat pada chunk referensi dokumen.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-slate-900">
                      Pelacakan Pemahaman Mahasiswa
                    </td>
                    <td className="p-4 sm:p-5 text-slate-600">
                      Tidak ada riwayat; tidak terintegrasi ke penilaian capaian pembelajaran.
                    </td>
                    <td className="p-4 sm:p-5 font-bold text-blue-800 bg-blue-50/40 border-l border-r border-blue-100">
                      ✓ Kuis adaptif 3 tingkat, poin gamifikasi, dan rekomendasi remedial.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-slate-900">
                      Dukungan Intervensi Dosen
                    </td>
                    <td className="p-4 sm:p-5 text-slate-600">
                      Tidak ada data untuk dosen (black box).
                    </td>
                    <td className="p-4 sm:p-5 font-bold text-blue-800 bg-blue-50/40 border-l border-r border-blue-100">
                      ✓ Dashboard dosen lengkap dengan deteksi nilai &lt; 60 &amp; ekspor CSV.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LATAR BELAKANG ANALISIS PIECES */}
      <section id="pieces" className="py-20 lg:py-24 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
              Analisis Kebutuhan Sistem
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Menjawab Tiga Masalah Nyata Mahasiswa di Kampus
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Dirancang berdasarkan evaluasi lapangan kebutuhan pembelajaran interaktif dan
              kurikulum modern.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition space-y-3">
              <span className="text-xs font-bold text-blue-700 font-mono">01 / PERFORMANCE</span>
              <h3 className="font-extrabold text-slate-900 text-base">
                Modul 200+ Halaman Terlalu Padat
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mahasiswa kehabisan waktu mencerna tumpukan teori tebal sebelum praktikum dimulai
                tanpa tahu pilar mana yang paling esensial.
              </p>
              <div className="pt-2 text-xs font-bold text-blue-600">
                &rarr; Diringkas jadi 2 halaman ringkas berpoin per bab.
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-amber-300 hover:shadow-md transition space-y-3">
              <span className="text-xs font-bold text-amber-700 font-mono">02 / INFORMATION</span>
              <h3 className="font-extrabold text-slate-900 text-base">
                Konsep Abstrak Sulit Dibayangkan
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Topik seperti Native ESM, HMR, Client/Server State, dan Cosine Similarity
                membingungkan tanpa analogi logis dari dunia nyata.
              </p>
              <div className="pt-2 text-xs font-bold text-amber-700">
                &rarr; Diterjemahkan menjadi perumpamaan konkret sehari-hari.
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition space-y-3">
              <span className="text-xs font-bold text-emerald-700 font-mono">03 / CONTROL</span>
              <h3 className="font-extrabold text-slate-900 text-base">
                Evaluasi Pemahaman Terlambat
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kesenjangan pemahaman baru diketahui saat UTS/UAS ketika semester hampir usai,
                sehingga tidak ada kesempatan untuk intervensi dini.
              </p>
              <div className="pt-2 text-xs font-bold text-emerald-700">
                &rarr; Kuis adaptif mingguan &amp; peringatan remedial otomatis.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE FAQ ACCORDION (LIGHT SAAS STYLE) */}
      <section id="faq" className="py-20 lg:py-24 border-b border-slate-200/80 bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Segala hal tentang arsitektur, metode RAG, dan pemenuhan 14 Bab Standar Industri
              Front-End 2026.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={`faq-${index}`}
                  className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 transition"
                  >
                    <span>{faq.q}</span>
                    <svg
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-3 ${
                        isOpen ? "rotate-180 text-blue-600" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. VIBRANT SAAS CTA CALLOUT BANNER */}
      <section className="py-20 lg:py-24 relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Siap Menguasai Materi Front-End Tanpa Pusing?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto">
            Akses langsung platform ExplainMyLesson AI sekarang. Tersedia akun demo instan untuk
            mahasiswa maupun dosen pengampu.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/login?role=pelajar"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-xl transition flex items-center justify-center gap-2"
            >
              <span>Buka Demo Pelajar (Mahasiswa)</span>
              <span>&rarr;</span>
            </Link>
            <Link
              to="/login?role=pengajar"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-900/60 hover:bg-blue-900/80 border border-white/20 text-white font-bold text-xs sm:text-sm transition"
            >
              Buka Demo Panel Dosen
            </Link>
          </div>
        </div>
      </section>

      {/* 9. PLATFORM OVERVIEW & FOOTER */}
      <footer
        id="tentang"
        className="py-14 bg-white border-t border-slate-200/80 text-slate-600 text-xs relative z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid md:grid-cols-12 gap-8 items-center border-b border-slate-100 pb-8">
            <div className="md:col-span-7 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-sm shadow-blue-500/20">
                  E
                </div>
                <span className="font-bold text-slate-900 text-sm tracking-tight">
                  ExplainMyLesson AI
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  EdTech AI
                </span>
              </div>
              <p className="text-slate-600 text-xs max-w-md leading-relaxed">
                Platform Pembelajaran Adaptif Terintegrasi berbasis Retrieval-Augmented Generation
                (RAG) dan Computer-Based Testing (CBT) multi-tingkat.
              </p>
              <p className="text-slate-400 text-[11px] font-medium">
                Dirancang untuk memudahkan mahasiswa menguasai materi modul perkuliahan secara
                ringkas, esensial, dan deterministik tanpa spekulasi liar.
              </p>
            </div>

            <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="bg-slate-50/90 hover:bg-blue-50/40 p-4 rounded-xl border border-slate-200/80 shadow-xs transition">
                <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider bg-blue-100/70 px-2 py-0.5 rounded-full inline-block">
                  Institusi
                </span>
                <p className="font-bold text-slate-800 text-xs mt-2">[Nama Instansi]</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Program Studi / Fakultas</p>
              </div>
              <div className="bg-slate-50/90 hover:bg-indigo-50/40 p-4 rounded-xl border border-slate-200/80 shadow-xs transition">
                <span className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider bg-indigo-100/70 px-2 py-0.5 rounded-full inline-block">
                  Pengampu
                </span>
                <p className="font-bold text-slate-800 text-xs mt-2">[Nama Dosen]</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Dosen Pengampu Kelas</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              <span>Platform Pembelajaran Digital · </span>
              <strong className="text-slate-800 font-semibold">[Nama Instansi]</strong>
              <span className="text-slate-400 ml-1.5">
                © 2026 ExplainMyLesson AI. Seluruh Hak Cipta Dilindungi.
              </span>
            </div>
            <div className="text-slate-400">
              Stack: React 18 · Vite 5 · TypeScript · Tailwind · Zustand · TanStack Query
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
