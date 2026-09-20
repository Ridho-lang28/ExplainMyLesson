import ClassManagementModal from "@/components/ClassManagementModal";
import Navbar from "@/components/Navbar";
import ProfileModal from "@/components/ProfileModal";
import UploadModal from "@/components/UploadModal";
import { useSession } from "@/hooks/useSession";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const { data } = useSession();
  const role = data?.role ?? "pelajar";

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Ambient Pastel Background Blobs (Biar rame & gak polos) */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[380px] bg-gradient-to-tr from-blue-300/45 via-indigo-200/45 to-sky-300/45 blur-3xl rounded-full pointer-events-none z-0" />
      <div className="absolute top-1/4 -right-32 w-[420px] h-[420px] bg-gradient-to-br from-purple-300/35 to-pink-200/35 blur-3xl rounded-full pointer-events-none z-0" />
      <div className="absolute top-1/2 -left-32 w-[420px] h-[420px] bg-gradient-to-tr from-cyan-200/35 via-emerald-200/30 to-blue-200/30 blur-3xl rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-gradient-to-tr from-amber-200/35 to-orange-200/25 blur-3xl rounded-full pointer-events-none z-0" />

      {/* Subtle Dot Matrix Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none z-0 opacity-60" />

      <div className="relative z-10">
        <Navbar role={role} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>

      {/* Modal instances global */}
      <UploadModal />
      <ProfileModal />
      <ClassManagementModal />
    </div>
  );
}
