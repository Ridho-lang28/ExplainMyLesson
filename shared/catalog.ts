// shared/catalog.ts
//
// Katalog statis (bukan hasil query server, tidak ada delay/async) yang
// dipakai baik di klien (ChapterModeSelector, UploadModal) maupun di server
// (server/data.ts, sebagai kunci aiContentLibrary). Persis seperti pada
// Tugas 7 (lib/data.ts): konstanta ini SUDAH dibundel ke klien sejak awal
// karena diimpor langsung oleh Client Component ("use client"), sehingga
// memindahkannya ke shared/ tidak mengubah perilaku apa pun — hanya lokasi.

export type AiMode = "ringkasan" | "analogi" | "mindmap" | "contoh";

export const availableChapters = [
  { value: "1", label: "Bab 1: Pengantar Software Engineering" },
  { value: "2", label: "Bab 2: Agile, Scrum & AI Assessment" },
  { value: "3", label: "Bab 3: Software Requirements & SKPL" },
];

export const aiModes: { value: AiMode; icon: string; label: string }[] = [
  { value: "ringkasan", icon: "📄", label: "Ringkasan (200 hlm → 2 hlm)" },
  { value: "analogi", icon: "💡", label: "Analogi Sederhana" },
  { value: "mindmap", icon: "🧠", label: "Mind Map / Hierarki" },
  { value: "contoh", icon: "✍️", label: "Contoh Soal & Pembahasan" },
];
