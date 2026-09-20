// src/App.tsx
//
// Padanan struktur folder app/ (file-based routing Next.js) pada Tugas 7.
// Vite tidak punya file-based router bawaan, sehingga pemetaan rute
// dideklarasikan eksplisit di sini dengan react-router-dom — satu-satunya
// perubahan STRUKTURAL dari migrasi ini; peta rute publik/privat & nested
// layout-nya sendiri dipertahankan 1:1:
//
//   Publik : /              -> LandingPage
//            /login         -> LoginPage
//   Privat : /dashboard              -> DashboardIndex (redirect by role)
//            /dashboard/pelajar      -> PelajarDashboardPage
//            /dashboard/pelajar/kuis -> KuisAdaptifPage
//            /dashboard/pengajar     -> PengajarDashboardPage
//
// Seluruh rute /dashboard/* dibungkus <ProtectedRoute> (pengganti
// middleware.ts) DAN <DashboardLayout> (nested layout, Navbar + UploadModal
// tidak remount saat berpindah sub-rute — persis app/dashboard/layout.tsx).
//
// Code Splitting: halaman dashboard di-lazy-load agar initial bundle (index.js)
// lebih kecil — pengguna anonim yang hanya ke / dan /login TIDAK perlu
// mendownload kode dashboard sama sekali. Ini setara dengan Dynamic Import
// yang dilakukan Next.js secara otomatis per segment di app/.

import { Suspense, lazy } from "react";
import LandingPage from "@/views/LandingPage";
import LoginPage from "@/views/LoginPage";
import ProtectedRoute from "@/router/ProtectedRoute";
import { Route, Routes } from "react-router-dom";

// Lazy-loaded dashboard pages — hanya diunduh saat pengguna masuk /dashboard/*
const DashboardIndex = lazy(() => import("@/views/DashboardIndex"));
const DashboardLayout = lazy(() => import("@/views/DashboardLayout"));
const KuisAdaptifPage = lazy(() => import("@/views/KuisAdaptifPage"));
const PelajarDashboardPage = lazy(() => import("@/views/PelajarDashboardPage"));
const PengajarDashboardPage = lazy(() => import("@/views/PengajarDashboardPage"));

// Fallback minimalis ditampilkan saat chunk sedang diunduh
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">
      Memuat halaman…
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<PageLoader />}>
              <DashboardLayout />
            </Suspense>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<PageLoader />}>
                <DashboardIndex />
              </Suspense>
            }
          />
          <Route
            path="pelajar"
            element={
              <Suspense fallback={<PageLoader />}>
                <PelajarDashboardPage />
              </Suspense>
            }
          />
          <Route
            path="pelajar/kuis"
            element={
              <Suspense fallback={<PageLoader />}>
                <KuisAdaptifPage />
              </Suspense>
            }
          />
          <Route
            path="pengajar"
            element={
              <Suspense fallback={<PageLoader />}>
                <PengajarDashboardPage />
              </Suspense>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}
