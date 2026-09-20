// src/lib/api/sessionApi.ts
//
// Lapisan akses REST API sisi klien untuk sesi login. GET /api/session adalah
// pengganti middleware.ts: dipanggil oleh <ProtectedRoute> setiap kali rute
// /dashboard/* dikunjungi, karena SPA tidak punya cara mencegat request di
// server sebelum HTML dikirim (hanya ada satu index.html untuk semua rute).

import {
  type RegisterInput,
  type Role,
  type SessionResponse,
  SessionResponseSchema,
  type UpdateProfileInput,
  type UserProfile,
  UserProfileSchema,
} from "@shared/schema";

export async function fetchSession(): Promise<SessionResponse> {
  const response = await fetch("/api/session", { credentials: "same-origin" });
  const rawData = await response.json().catch(() => null);
  return SessionResponseSchema.parse(rawData);
}

export type LoginPayload =
  | { role: Role }
  | { email: string; password: string; role?: Role };

export async function login(payload: LoginPayload): Promise<{ ok: true; role: Role; user?: UserProfile }> {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "same-origin",
  });
  const resData = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(resData?.error ?? "Gagal masuk. Periksa kembali email dan kata sandi Anda.");
  }
  return resData;
}

export async function register(data: RegisterInput): Promise<{ ok: true; user: UserProfile }> {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "same-origin",
  });
  const resData = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(resData?.error ?? "Gagal mendaftarkan akun.");
  }
  return resData;
}

export async function logout(): Promise<void> {
  await fetch("/api/logout", { method: "POST", credentials: "same-origin" });
}

export async function fetchProfile(): Promise<UserProfile> {
  const response = await fetch("/api/profile", { credentials: "same-origin" });
  const rawData = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error("Gagal memuat profil pengguna.");
  }
  return UserProfileSchema.parse(rawData);
}

export async function updateProfile(data: UpdateProfileInput): Promise<UserProfile> {
  const response = await fetch("/api/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "same-origin",
  });
  const rawData = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(rawData?.error ?? "Gagal memperbarui profil.");
  }
  return UserProfileSchema.parse(rawData);
}
