// src/components/NotificationCenter.tsx — Pusat Notifikasi & Rekomendasi Adaptif (FR-20)
//
// Menampilkan notifikasi peringatan dini jika terdapat bab materi yang memerlukan
// intervensi remedial (skor kuis < 60) sesuai kebutuhan fungsional FR-20 SKPL.

import { fetchNotifications, markNotificationRead } from "@/lib/api/classApi";
import type { NotificationItem } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery<NotificationItem[]>({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    staleTime: 1000 * 30,
  });

  const readMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Pusat Notifikasi Rekomendasi"
        aria-expanded={isOpen}
        title="Notifikasi & Rekomendasi Adaptif"
        className="relative w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition shadow-2xs"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <title>Ikon Notifikasi</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-black text-[9px] rounded-full flex items-center justify-center shadow-xs animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          role="region"
          aria-label="Daftar Notifikasi"
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900 tracking-tight">
                Notifikasi Rekomendasi
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                AI Adaptif
              </span>
            </div>
            <span className="text-[10px] text-slate-500">{unreadCount} pesan belum dibaca</span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">Tidak ada notifikasi aktif.</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl border text-xs transition relative ${
                    n.isRead
                      ? "bg-slate-50/70 border-slate-200 text-slate-600"
                      : n.type === "warning"
                        ? "bg-amber-50/90 border-amber-300 text-slate-800 shadow-xs"
                        : "bg-blue-50/80 border-blue-200 text-slate-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold flex items-center gap-1.5">
                      {n.type === "warning" && <span>⚠️</span>}
                      {n.type === "info" && <span>📌</span>}
                      {n.type === "success" && <span>🎉</span>}
                      <span className="text-slate-900">{n.title}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 shrink-0">{n.createdAt}</span>
                  </div>

                  <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">{n.message}</p>

                  <div className="mt-2.5 flex items-center justify-between gap-2 pt-1 border-t border-slate-200/50">
                    <Link
                      to={n.link}
                      onClick={() => {
                        readMutation.mutate(n.id);
                        setIsOpen(false);
                      }}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
                    >
                      <span>Buka Modul Belajar</span>
                      <span>&rarr;</span>
                    </Link>

                    {!n.isRead && (
                      <button
                        type="button"
                        onClick={() => readMutation.mutate(n.id)}
                        className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 bg-white/80 border border-slate-200 px-2 py-0.5 rounded-md"
                      >
                        Tandai Selesai
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
