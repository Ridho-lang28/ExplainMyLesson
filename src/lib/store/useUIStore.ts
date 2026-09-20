// src/lib/store/useUIStore.ts
//
// Store Zustand (~0.5 KB gzipped) — SATU-SATUNYA tempat menyimpan Client UI
// State di seluruh aplikasi. Dipertahankan 1:1 dari Tugas 7 (lib/store/useUIStore.ts)
// — migrasi build tool ke Vite TIDAK mengubah state management sama sekali.
//
// ATURAN KETAT yang dijaga di file ini:
//   1. TIDAK PERNAH menyimpan hasil panggilan REST API (Material/Question/
//      ClassSummary/dst.) di sini — itu tanggung jawab TanStack Query.
//   2. TIDAK dibungkus <Context.Provider> apa pun — hook ini bisa dipanggil
//      langsung dari komponen mana saja.
//   3. Setiap komponen WAJIB memakai selector presisi (mis. useUIStore(s => s.x))
//      agar hanya re-render saat slice yang dipilih berubah.
//
// Empat kelompok Client UI State yang dikelola:
//   A. Modal/Drawer aktif   -> isUploadModalOpen, uploadModalVariant
//   B. Theme Toggle         -> themeMode
//   C. Draft Form Steps     -> quizDraft
//   D. Gamifikasi           -> totalPoints

import { create } from "zustand";

export type UploadModalVariant = "private" | "public";
export type ThemeMode = "light" | "dark";

interface QuizDraftState {
  selectedOption: number | null;
  showHint: boolean;
}

interface UIState {
  isUploadModalOpen: boolean;
  uploadModalVariant: UploadModalVariant;
  openUploadModal: (variant: UploadModalVariant) => void;
  closeUploadModal: () => void;

  themeMode: ThemeMode;
  toggleTheme: () => void;

  quizDraft: QuizDraftState;
  setQuizSelectedOption: (index: number) => void;
  setQuizShowHint: (value: boolean) => void;
  resetQuizDraft: () => void;

  totalPoints: number;
  addPoints: (amount: number) => void;

  isProfileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;

  isClassModalOpen: boolean;
  openClassModal: () => void;
  closeClassModal: () => void;
}

const initialQuizDraft: QuizDraftState = { selectedOption: null, showHint: false };

export const useUIStore = create<UIState>()((set) => ({
  isUploadModalOpen: false,
  uploadModalVariant: "private",
  openUploadModal: (variant) => set({ isUploadModalOpen: true, uploadModalVariant: variant }),
  closeUploadModal: () => set({ isUploadModalOpen: false }),

  themeMode: "light",
  toggleTheme: () =>
    set((state) => ({ themeMode: state.themeMode === "light" ? "dark" : "light" })),

  quizDraft: initialQuizDraft,
  setQuizSelectedOption: (index) =>
    set((state) => ({ quizDraft: { ...state.quizDraft, selectedOption: index } })),
  setQuizShowHint: (value) =>
    set((state) => ({ quizDraft: { ...state.quizDraft, showHint: value } })),
  resetQuizDraft: () => set({ quizDraft: initialQuizDraft }),

  totalPoints: 420,
  addPoints: (amount) => set((state) => ({ totalPoints: state.totalPoints + amount })),

  isProfileModalOpen: false,
  openProfileModal: () => set({ isProfileModalOpen: true }),
  closeProfileModal: () => set({ isProfileModalOpen: false }),

  isClassModalOpen: false,
  openClassModal: () => set({ isClassModalOpen: true }),
  closeClassModal: () => set({ isClassModalOpen: false }),
}));
