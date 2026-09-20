// src/components/LoginForm.tsx
//
// Implementasi Autentikasi Multi-Role & Registrasi (FR-01, FR-02, FR-03).
// Mendukung pemisahan hak akses Pelajar & Pengajar, validasi email institusi,
// serta tombol Masuk Cepat untuk kemudahan demonstrasi pengujian praktikum.

import { SESSION_QUERY_KEY } from "@/hooks/useSession";
import { login, register } from "@/lib/api/sessionApi";
import { isInstitutionalEmail, type Role } from "@shared/schema";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function LoginForm({ redirectTo }: { redirectTo: string | null }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const initialRole = (searchParams.get("role") as Role) || "pelajar";
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";

  const [role, setRole] = useState<Role>(initialRole);
  const [isRegister, setIsRegister] = useState<boolean>(initialMode === "register");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleDemoAuthenticate(targetRole: Role) {
    setLoading(targetRole);
    setError(null);
    setSuccessMessage(null);

    try {
      await login({ role: targetRole });
      await queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY });

      const target = redirectTo?.startsWith("/dashboard") ? redirectTo : `/dashboard/${targetRole}`;
      navigate(target);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat otentikasi demo.");
      setLoading(null);
    }
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (isRegister && !name.trim()) {
      setError("Silakan masukkan nama lengkap Anda.");
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      setError("Format email tidak valid (contoh: user@example.com).");
      return;
    }

    setLoading(role);

    if (isRegister) {
      if (password.length < 6) {
        setError("Kata sandi minimal 6 karakter.");
        setLoading(null);
        return;
      }
      try {
        await register({ name, email, password, role });
        await queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY });
        setSuccessMessage("Akun berhasil didaftarkan! Mengalihkan ke dashboard...");
        setTimeout(() => {
          const target = redirectTo?.startsWith("/dashboard") ? redirectTo : `/dashboard/${role}`;
          navigate(target);
        }, 800);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal mendaftarkan akun.");
        setLoading(null);
      }
    } else {
      try {
        const res = await login({ email, password, role });
        await queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY });
        const userRole = res.role || role;
        const target = redirectTo?.startsWith("/dashboard") ? redirectTo : `/dashboard/${userRole}`;
        navigate(target);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Email atau kata sandi tidak valid.");
        setLoading(null);
      }
    }
  }

  return (
    <div className="space-y-4 text-slate-800">
      {/* ROLE SWITCHER TABS (FR-02) */}
      <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
        <button
          type="button"
          onClick={() => {
            setRole("pelajar");
            setError(null);
          }}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
            role === "pelajar"
              ? "bg-white text-blue-700 shadow-xs border border-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <svg
            className="w-3.5 h-3.5 text-blue-600"
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
          <span>Pelajar (Mahasiswa)</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setRole("pengajar");
            setError(null);
          }}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
            role === "pengajar"
              ? "bg-white text-purple-700 shadow-xs border border-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <svg
            className="w-3.5 h-3.5 text-purple-600"
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
          <span>Pengajar (Dosen)</span>
        </button>
      </div>

      {error && (
        <div className="text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2">
          <svg
            className="w-4 h-4 text-rose-600 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="leading-relaxed">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2">
          <svg
            className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="leading-relaxed">{successMessage}</p>
        </div>
      )}

      {/* FORM INPUT MANUAL (FR-01 & FR-02) */}
      <form onSubmit={handleFormSubmit} className="space-y-3 pt-1">
        {isRegister && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                role === "pelajar" ? "Nama Pelajar / Mahasiswa" : "Nama Pengajar / Dosen"
              }
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-2xs"
            />
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700">
              Alamat Email ({role === "pelajar" ? "Pelajar" : "Pengajar"})
            </label>
            {email.includes("@") && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  isInstitutionalEmail(email)
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {isInstitutionalEmail(email) ? "✓ Email Institusi Terverifikasi" : "Email Umum / Publik"}
              </span>
            )}
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={
              role === "pelajar" ? "pelajar@student.uns.ac.id" : "dosen@staff.uns.ac.id"
            }
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-2xs"
          />
        </div>

        <button
          type="submit"
          disabled={loading !== null}
          className={`w-full text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition active:scale-95 ${
            role === "pelajar"
              ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20 disabled:opacity-60"
              : "bg-purple-600 hover:bg-purple-500 shadow-purple-500/20 disabled:opacity-60"
          }`}
        >
          {loading !== null
            ? "Memproses Autentikasi..."
            : isRegister
              ? `Daftarkan Akun ${role === "pelajar" ? "Pelajar" : "Pengajar"}`
              : `Masuk sebagai ${role === "pelajar" ? "Pelajar" : "Pengajar"}`}
        </button>
      </form>

      {/* TOGGLE ANTARA LOGIN & REGISTRASI */}
      <div className="text-center text-xs text-slate-500 pt-1">
        <span>{isRegister ? "Sudah punya akun terdaftar?" : "Belum punya akun?"}</span>{" "}
        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setError(null);
          }}
          className="font-bold text-blue-600 hover:underline"
        >
          {isRegister ? "Masuk di Sini" : "Daftar Akun Baru"}
        </button>
      </div>

      {/* 1-CLICK DEMO LOGIN UNTUK PENGUJIAN PRAKTIKUM / DOSEN */}
      <div className="border-t border-slate-200 pt-4 mt-4 space-y-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
          Akses Cepat Pengujian (1-Click Instant Demo):
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleDemoAuthenticate("pelajar")}
            disabled={loading !== null}
            className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold py-2 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <svg
              className="w-3.5 h-3.5 text-blue-600"
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
            <span>Demo Pelajar</span>
          </button>
          <button
            type="button"
            onClick={() => handleDemoAuthenticate("pengajar")}
            disabled={loading !== null}
            className="w-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold py-2 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <svg
              className="w-3.5 h-3.5 text-purple-600"
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
            <span>Demo Pengajar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
