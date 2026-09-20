// server/data.ts
//
// "Server-side data layer" — mensimulasikan akses langsung ke database /
// RAG Engine. Pada Tugas 7 (Next.js App Router) modul ini adalah lib/data.ts
// dan dipanggil langsung dari React Server Component (async/await tanpa
// round-trip HTTP). Pada Tugas 8 (Vite SPA + Express), TIDAK ADA RSC —
// Vite hanya membundel & menyajikan HTML/CSS/JS statis ke browser, tidak
// pernah mengeksekusi kode di server saat runtime. Karena itu modul ini
// dipindah ke server/ (dijalankan oleh Express/Node) dan SETIAP fungsi di
// bawah diekspos lewat Route Handler REST (server/index.ts), lalu dikonsumsi
// klien lewat TanStack Query — persis pola yang SUDAH dipakai untuk entitas
// Materials & Quiz Questions di Tugas 7. Lihat README.md § Migrasi.

import { availableChapters } from "../shared/catalog";
import bcrypt from "bcryptjs";

export type AiMode = "ringkasan" | "analogi" | "mindmap" | "contoh";

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
  hint: string;
}

export interface ChapterProgress {
  id: number;
  name: string;
  percent: number;
  tone: "high" | "good" | "warning";
}

export interface StudentHelp {
  id: string;
  name: string;
  chapter: string;
  score: number;
  outOf: number;
}

export interface ClassSummary {
  totalStudents: number;
  averageComprehension: number;
  activeModules: number;
  studentsNeedingIntervention: number;
}

const isTestEnv = process.env.NODE_ENV === "test" || Boolean(process.env.VITEST);
const delay = (ms: number) =>
  isTestEnv ? Promise.resolve() : new Promise((resolve) => setTimeout(resolve, ms));

// Dipakai hanya untuk memvalidasi query param ?chapter= pada /api/ai-content.
void availableChapters;

const chapterProgressDb: ChapterProgress[] = [
  { id: 1, name: "Bab 1: Pengantar Software Engineering", percent: 88, tone: "high" },
  { id: 2, name: "Bab 2: Agile, Scrum & AI Assessment", percent: 58, tone: "warning" },
  { id: 3, name: "Bab 3: Software Requirements & SKPL", percent: 76, tone: "good" },
];

const studentsNeedingHelpDb: StudentHelp[] = [
  { id: "s1", name: "Ridho Asykuri", chapter: "Bab 2", score: 2, outOf: 10 },
  { id: "s2", name: "Siswa B", chapter: "Bab 2", score: 5, outOf: 10 },
];

const aiContentLibrary: Record<string, Record<AiMode, { title: string; body: string[] }>> = {
  "1": {
    ringkasan: {
      title: "Ringkasan — Bab 1: Pengantar Software Engineering",
      body: [
        "Software Engineering adalah pendekatan sistematis untuk merancang, mengembangkan, dan memelihara perangkat lunak.",
        "Siklus hidup perangkat lunak mencakup analisis kebutuhan, desain, implementasi, pengujian, dan pemeliharaan.",
      ],
    },
    analogi: {
      title: "Analogi Sederhana — Bab 1: Pengantar Software Engineering",
      body: [
        "Bayangkan membangun perangkat lunak seperti membangun rumah: butuh rancangan (desain), fondasi yang kuat (implementasi inti), dan pengecekan kualitas sebelum ditempati (pengujian).",
        "Tanpa tahapan yang jelas, software yang dibangun tanpa proses SE yang benar akan sulit dipelihara.",
      ],
    },
    mindmap: {
      title: "Mind Map — Bab 1: Pengantar Software Engineering",
      body: [
        "🔹 Software Engineering",
        "  ├─ Analisis Kebutuhan — mengumpulkan apa yang diinginkan pengguna",
        "  ├─ Desain — merancang arsitektur & struktur sistem",
        "  ├─ Implementasi — menulis kode program",
        "  ├─ Pengujian — memastikan sistem bebas dari bug",
        "  └─ Pemeliharaan — perbaikan & pembaruan setelah rilis",
      ],
    },
    contoh: {
      title: "Contoh Soal & Pembahasan — Bab 1: Pengantar Software Engineering",
      body: [
        "Soal: Tahap apa yang bertujuan memastikan perangkat lunak bebas dari kesalahan sebelum dirilis?",
        "Pembahasan: Jawabannya adalah tahap Pengujian (Testing), yang memverifikasi sistem sesuai spesifikasi kebutuhan.",
      ],
    },
  },
  "2": {
    ringkasan: {
      title: "Ringkasan — Bab 2: Agile, Scrum & AI Assessment",
      body: [
        "Agile adalah metodologi pengembangan perangkat lunak yang berfokus pada iterasi cepat, kolaborasi tim, dan adaptabilitas.",
        "RAG (Retrieval-Augmented Generation) membantu membedah dokumen modul panjang menjadi materi ringkas yang personal.",
      ],
    },
    analogi: {
      title: "Analogi Sederhana — Bab 2: Agile, Scrum & AI Assessment",
      body: [
        "Scrum itu seperti memasak dalam porsi kecil bertahap (Sprint), bukan menyiapkan pesta besar sekaligus.",
        "Product Owner ibarat kepala koki yang menentukan menu prioritas, Scrum Master menjaga dapur tetap lancar.",
      ],
    },
    mindmap: {
      title: "Mind Map — Bab 2: Agile, Scrum & AI Assessment",
      body: [
        "🔹 Agile & Scrum",
        "  ├─ Sprint — siklus kerja 1–4 minggu",
        "  ├─ Scrum Master — memfasilitasi & menghilangkan hambatan",
        "  ├─ Product Owner — mengelola prioritas backlog",
        "  └─ AI Assessment — RAG meringkas materi panjang jadi ringkas",
      ],
    },
    contoh: {
      title: "Contoh Soal & Pembahasan — Bab 2: Agile, Scrum & AI Assessment",
      body: [
        "Soal: Siapa yang bertanggung jawab mengelola Product Backlog dalam Scrum?",
        "Pembahasan: Product Owner — mewakili suara pengguna/bisnis dan menentukan prioritas fitur.",
      ],
    },
  },
  "3": {
    ringkasan: {
      title: "Ringkasan — Bab 3: Software Requirements & SKPL",
      body: [
        "SKPL mendokumentasikan kebutuhan fungsional dan non-fungsional sebuah sistem.",
        "Kebutuhan yang tertulis jelas menjadi dasar penerjemahan ke komponen UI yang terstruktur.",
      ],
    },
    analogi: {
      title: "Analogi Sederhana — Bab 3: Software Requirements & SKPL",
      body: [
        "SKPL itu seperti cetak biru (blueprint) sebelum membangun gedung.",
        "Kebutuhan fungsional adalah 'apa yang harus dilakukan', non-fungsional adalah 'seberapa baik ia bekerja'.",
      ],
    },
    mindmap: {
      title: "Mind Map — Bab 3: Software Requirements & SKPL",
      body: [
        "🔹 SKPL",
        "  ├─ Kebutuhan Fungsional — fitur & perilaku sistem",
        "  ├─ Kebutuhan Non-Fungsional — performa, keamanan, usability",
        "  └─ Penerjemahan ke UI — struktur komponen mengikuti dokumen SKPL",
      ],
    },
    contoh: {
      title: "Contoh Soal & Pembahasan — Bab 3: Software Requirements & SKPL",
      body: [
        "Soal: Apa perbedaan kebutuhan fungsional dan non-fungsional dalam SKPL?",
        "Pembahasan: Fungsional menjelaskan fitur/perilaku sistem, non-fungsional menjelaskan kualitas seperti performa & keamanan.",
      ],
    },
  },
};

const mockQuestions: Record<number, Question[]> = {
  1: Array.from({ length: 10 }, (_, i) => ({
    id: `q1_${i + 1}`,
    question: `[Level 1 - Soal ${i + 1}] Apa prinsip utama Agile Manifesto?`,
    options: [
      "Individu dan interaksi lebih dari proses dan sarana",
      "Dokumentasi menyeluruh lebih dari perangkat lunak yang berfungsi",
      "Negosiasi kontrak lebih dari kolaborasi pelanggan",
      "Mengikuti rencana lebih dari tanggap terhadap perubahan",
    ],
    correctOption: 0,
    hint: "Utamakan komunikasi antar manusia dibandingkan aturan yang kaku.",
  })),
  2: Array.from({ length: 10 }, (_, i) => ({
    id: `q2_${i + 1}`,
    question: `[Level 2 - Soal ${i + 1}] Siapa yang bertanggung jawab mengelola Product Backlog dalam Scrum?`,
    options: ["Scrum Master", "Product Owner", "Development Team", "Stakeholder"],
    correctOption: 1,
    hint: "Peran ini mewakili suara pengguna dan menentukan prioritas fitur.",
  })),
  3: Array.from({ length: 10 }, (_, i) => ({
    id: `q3_${i + 1}`,
    question: `[Level 3 - Soal ${i + 1}] Bagaimana AI dapat membantu dalam estimasi Sprint Planning?`,
    options: [
      "Menggantikan seluruh anggota tim developer",
      "Menganalisis histori velocity dan kompleksitas tugas secara presisi",
      "Menghapus kebutuhan Daily Standup",
      "Membuat keputusan produk tanpa persetujuan PO",
    ],
    correctOption: 1,
    hint: "AI berperan sebagai asisten berbasis data historis, bukan pengganti peran manusia.",
  })),
};

export async function getChapterProgress(): Promise<ChapterProgress[]> {
  await delay(500);
  return chapterProgressDb;
}

export async function getStudentsNeedingHelp(): Promise<StudentHelp[]> {
  await delay(500);
  return studentsNeedingHelpDb;
}

// Sengaja diberi delay lebih lama untuk mendemonstrasikan Loading Skeleton +
// TanStack Query pada ClassSummaryCards (dulu Streaming SSR + <Suspense> di
// Next.js; kini Loading State standar useQuery.isLoading di Vite SPA).
export async function getClassSummary(): Promise<ClassSummary> {
  await delay(1400);
  return {
    totalStudents: 50,
    averageComprehension: 78.4,
    activeModules: 6,
    studentsNeedingIntervention: studentsNeedingHelpDb.length,
  };
}

export async function getAiContent(chapterId: string, mode: AiMode) {
  await delay(900);
  const content = aiContentLibrary[chapterId]?.[mode];
  if (!content) {
    throw new Error("Konten untuk kombinasi Bab & Mode ini belum tersedia.");
  }
  return content;
}

export async function getQuestionsByLevel(level: number): Promise<Question[]> {
  await delay(600);
  const data = mockQuestions[level];
  if (!data) {
    throw new Error(`Soal untuk level ${level} tidak ditemukan.`);
  }
  return data;
}

// --- "Database" materi in-memory --------------------------------------------
export interface MaterialRecord {
  id: string;
  title: string;
  fileName: string;
  variant: "private" | "public";
  chapter?: string;
  indexedAt: string;
}

const materialsDb: MaterialRecord[] = [];

export async function getMaterials(): Promise<MaterialRecord[]> {
  await delay(600);
  return [...materialsDb].reverse();
}

export async function saveMaterial(payload: {
  title: string;
  fileName: string;
  variant: "private" | "public";
  chapter?: string;
}) {
  await delay(900);
  const record: MaterialRecord = {
    id: `doc_${Date.now()}`,
    title: payload.title,
    fileName: payload.fileName,
    variant: payload.variant,
    chapter: payload.chapter,
    indexedAt: new Date().toISOString(),
  };
  materialsDb.push(record);
  return record;
}

export async function buildClassReportCsv() {
  await delay(700);
  const summary = await getClassSummary();
  const chapters = await getChapterProgress();
  const students = await getStudentsNeedingHelp();

  const rows: (string | number)[][] = [];
  rows.push(["Laporan Analisis & Pemahaman Kelas"]);
  rows.push(["Diekspor pada", new Date().toLocaleString("id-ID")]);
  rows.push([]);
  rows.push(["Ringkasan Umum"]);
  rows.push(["Total Pelajar Terdaftar", summary.totalStudents]);
  rows.push(["Rata-Rata Pemahaman Kelas (%)", summary.averageComprehension]);
  rows.push(["Materi Aktif di-Upload", summary.activeModules]);
  rows.push(["Pelajar Perlu Intervensi", summary.studentsNeedingIntervention]);
  rows.push([]);
  rows.push(["Tingkat Pemahaman Per Bab"]);
  rows.push(["Bab", "Persentase (%)"]);
  for (const c of chapters) rows.push([c.name, c.percent]);
  rows.push([]);
  rows.push(["Pelajar Perlu Bimbingan"]);
  rows.push(["Nama", "Bab", "Skor Kuis"]);
  for (const s of students) rows.push([s.name, s.chapter, `${s.score}/${s.outOf}`]);

  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\r\n");

  return { fileName: `Laporan_Analisis_Kelas_${Date.now()}.csv`, content: csv };
}

// --- Entitas Pengguna & Profil (FR-01, FR-22) -------------------------------
export interface UserAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "pelajar" | "pengajar";
  nimNip: string;
  institution: string;
}

const usersDb: UserAccount[] = [
  {
    id: "usr_1",
    name: "Ghandur Fauzan Ngauf Hisam",
    email: "ghandur@student.uns.ac.id",
    passwordHash: bcrypt.hashSync("secret123", 10),
    role: "pelajar",
    nimNip: "V3925024",
    institution: "D3 Teknik Informatika Madiun, Sekolah Vokasi UNS",
  },
  {
    id: "usr_2",
    name: "Ridho Asykuri",
    email: "ridho@student.uns.ac.id",
    passwordHash: bcrypt.hashSync("secret123", 10),
    role: "pelajar",
    nimNip: "V3925015",
    institution: "D3 Teknik Informatika Madiun, Sekolah Vokasi UNS",
  },
  {
    id: "usr_3",
    name: "Darmawan Lahru Riatma, S.Kom., M.MT",
    email: "darmawan@staff.uns.ac.id",
    passwordHash: bcrypt.hashSync("dosen123", 10),
    role: "pengajar",
    nimNip: "1991091420200801",
    institution: "D3 Teknik Informatika Madiun, Sekolah Vokasi UNS",
  },
];

export async function verifyUserCredentials(email: string, password: string) {
  await delay(200);
  const normalizedEmail = email.toLowerCase().trim();
  const user = usersDb.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    throw new Error("Akun tidak ditemukan. Silakan registrasi terlebih dahulu.");
  }
  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    throw new Error("Email atau kata sandi tidak valid.");
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    nimNip: user.nimNip,
    institution: user.institution,
  };
}

export async function registerUserAccount(data: {
  name: string;
  email: string;
  password: string;
  role: "pelajar" | "pengajar";
}) {
  await delay(400);
  const normalizedEmail = data.email.toLowerCase().trim();
  const existing = usersDb.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error("Email sudah terdaftar. Silakan gunakan email lain atau masuk langsung.");
  }

  const newUser: UserAccount = {
    id: `usr_${Date.now()}`,
    name: data.name.trim(),
    email: normalizedEmail,
    passwordHash: bcrypt.hashSync(data.password, 10),
    role: data.role,
    nimNip: data.role === "pelajar" ? "V3925xxx" : "199xxxxxxxxx",
    institution: "D3 Teknik Informatika Madiun, Sekolah Vokasi UNS",
  };
  usersDb.push(newUser);
  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    nimNip: newUser.nimNip,
    institution: newUser.institution,
  };
}

export async function getUserProfileByRole(role: "pelajar" | "pengajar") {
  await delay(300);
  const user = usersDb.find((u) => u.role === role);
  if (!user) {
    return {
      id: "usr_guest",
      name:
        role === "pelajar" ? "Ghandur Fauzan Ngauf Hisam" : "Darmawan Lahru Riatma, S.Kom., M.MT",
      email: role === "pelajar" ? "ghandur@student.uns.ac.id" : "darmawan@staff.uns.ac.id",
      role,
      nimNip: role === "pelajar" ? "V3925024" : "1991091420200801",
      institution: "D3 Teknik Informatika Madiun, Sekolah Vokasi UNS",
    };
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    nimNip: user.nimNip,
    institution: user.institution,
  };
}

export async function updateUserProfile(
  role: "pelajar" | "pengajar",
  payload: {
    name: string;
    email: string;
    nimNip?: string;
    institution?: string;
    password?: string;
  }
) {
  await delay(400);
  let user = usersDb.find((u) => u.role === role);
  if (!user) {
    user = {
      id: `usr_${Date.now()}`,
      name: payload.name,
      email: payload.email,
      passwordHash: payload.password || "secret123",
      role,
      nimNip: payload.nimNip || (role === "pelajar" ? "V3925024" : "1991091420200801"),
      institution: payload.institution || "D3 Teknik Informatika Madiun, Sekolah Vokasi UNS",
    };
    usersDb.push(user);
  } else {
    user.name = payload.name;
    user.email = payload.email;
    if (payload.nimNip) user.nimNip = payload.nimNip;
    if (payload.institution) user.institution = payload.institution;
    if (payload.password) user.passwordHash = payload.password;
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    nimNip: user.nimNip,
    institution: user.institution,
  };
}

// --- Entitas Manajemen Kelas (FR-21) ---------------------------------------
export interface ClassRoomRecord {
  id: string;
  name: string;
  code: string;
  semester: string;
  academicYear: string;
  studentCount: number;
  modulesCount: number;
}

const classRoomsDb: ClassRoomRecord[] = [
  {
    id: "cls_1",
    name: "Praktik Pemrograman Front-End (D3TI Madiun)",
    code: "TI-MAD-WEB",
    semester: "Semester Ganjil",
    academicYear: "2025/2026",
    studentCount: 50,
    modulesCount: 3,
  },
  {
    id: "cls_2",
    name: "Manajemen Proyek Teknologi Informasi",
    code: "TI-MAD-MPTI",
    semester: "Semester Ganjil",
    academicYear: "2025/2026",
    studentCount: 48,
    modulesCount: 4,
  },
  {
    id: "cls_3",
    name: "Analisis dan Perancangan Sistem (SKPL RAG)",
    code: "TI-MAD-APS",
    semester: "Semester Ganjil",
    academicYear: "2025/2026",
    studentCount: 52,
    modulesCount: 3,
  },
];

export async function getClassRooms(): Promise<ClassRoomRecord[]> {
  await delay(400);
  return [...classRoomsDb];
}

export async function createClassRoom(data: {
  name: string;
  code: string;
  semester?: string;
  academicYear?: string;
}): Promise<ClassRoomRecord> {
  await delay(500);
  const newClass: ClassRoomRecord = {
    id: `cls_${Date.now()}`,
    name: data.name.trim(),
    code: data.code.trim().toUpperCase(),
    semester: data.semester || "Semester Ganjil",
    academicYear: data.academicYear || "2025/2026",
    studentCount: 0,
    modulesCount: 1,
  };
  classRoomsDb.unshift(newClass);
  return newClass;
}

export async function deleteClassRoom(id: string): Promise<boolean> {
  await delay(400);
  const idx = classRoomsDb.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  classRoomsDb.splice(idx, 1);
  return true;
}

// --- Entitas Notifikasi Adaptif (FR-20) ------------------------------------
export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  type: "warning" | "info" | "success";
  link: string;
  isRead: boolean;
  createdAt: string;
}

const notificationsDb: NotificationRecord[] = [
  {
    id: "notif_1",
    title: "Rekomendasi Remedial: Bab 2",
    message:
      "Skor kuis Bab 2 terdeteksi 58% (< 60%). Disarankan mempelajari kembali ringkasan & analogi.",
    type: "warning",
    link: "/dashboard/pelajar?chapter=2&mode=ringkasan",
    isRead: false,
    createdAt: "Baru saja",
  },
  {
    id: "notif_2",
    title: "Modul Baru Terbit",
    message: "Dosen mengunggah materi Bab 3: Software Requirements Specification (SKPL).",
    type: "info",
    link: "/dashboard/pelajar?chapter=3&mode=ringkasan",
    isRead: false,
    createdAt: "1 jam lalu",
  },
  {
    id: "notif_3",
    title: "Pencapaian XP Meningkat",
    message: "Selamat! Anda telah mengumpulkan total 420 XP pada kuis adaptif level 1 dan 2.",
    type: "success",
    link: "/dashboard/pelajar/kuis",
    isRead: true,
    createdAt: "Kemarin",
  },
];

export async function getNotifications(): Promise<NotificationRecord[]> {
  await delay(300);
  return [...notificationsDb];
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  await delay(200);
  const notif = notificationsDb.find((n) => n.id === id);
  if (!notif) return false;
  notif.isRead = true;
  return true;
}

// --- Ekspor Laporan Resmi Format PDF (HTML Print-Ready) (FR-18) ------------
export async function buildClassReportHtml(): Promise<{ fileName: string; content: string }> {
  await delay(600);
  const summary = await getClassSummary();
  const chapters = await getChapterProgress();
  const students = await getStudentsNeedingHelp();
  const dateStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <title>Laporan Hasil Analitik Pembelajaran - ExplainMyLesson AI</title>
  <style>
    @media print {
      body { margin: 1.5cm; }
      .no-print { display: none; }
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      color: #111;
      line-height: 1.5;
      padding: 30px;
      max-width: 900px;
      margin: 0 auto;
    }
    .kop {
      border-bottom: 3px double #000;
      padding-bottom: 15px;
      margin-bottom: 25px;
      text-align: center;
    }
    .kop h3 { margin: 0; font-size: 16pt; text-transform: uppercase; font-weight: bold; }
    .kop h2 { margin: 4px 0; font-size: 18pt; text-transform: uppercase; font-weight: bold; }
    .kop p { margin: 2px 0; font-size: 10.5pt; font-family: Arial, sans-serif; }
    .title { text-align: center; margin: 20px 0; }
    .title h1 { font-size: 14pt; text-decoration: underline; margin-bottom: 4px; text-transform: uppercase; }
    .title p { font-size: 11pt; margin: 0; font-style: italic; }
    .meta-table, .data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-family: Arial, sans-serif;
      font-size: 10pt;
    }
    .meta-table td { padding: 4px 8px; vertical-align: top; }
    .data-table th, .data-table td {
      border: 1px solid #333;
      padding: 8px 12px;
      text-align: left;
    }
    .data-table th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    .badge-warn { color: #b91c1c; font-weight: bold; }
    .badge-good { color: #15803d; font-weight: bold; }
    .signatures {
      margin-top: 50px;
      display: flex;
      justify-content: space-between;
      font-family: Arial, sans-serif;
      font-size: 11pt;
    }
    .sign-box { text-align: center; width: 250px; }
    .sign-box .space { height: 75px; }
    .btn-print {
      background: #2563eb;
      color: white;
      border: none;
      padding: 10px 20px;
      font-size: 14px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="no-print" style="text-align: right;">
    <button class="btn-print" onclick="window.print()">Cetak / Simpan sebagai PDF</button>
  </div>

  <div class="kop">
    <h3>KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI</h3>
    <h2>UNIVERSITAS SEBELAS MARET</h2>
    <h3>SEKOLAH VOKASI — D3 TEKNIK INFORMATIKA KAB. MADIUN</h3>
    <p>Jl. Imam Bonjol No. 82, Caruban, Madiun | Website: uns.ac.id | Email: vokasi@unit.uns.ac.id</p>
  </div>

  <div class="title">
    <h1>REKAPITULASI HASIL PEMAHAMAN MAHASISWA & ANALITIK RAG</h1>
    <p>Sistem Pembelajaran Adaptif ExplainMyLesson AI — Semester Ganjil 2025/2026</p>
  </div>

  <table class="meta-table">
    <tr>
      <td style="width: 220px; font-weight: bold;">Mata Kuliah</td>
      <td style="width: 10px;">:</td>
      <td>Praktik Pemrograman Front-End / Manajemen Proyek TI</td>
    </tr>
    <tr>
      <td style="font-weight: bold;">Dosen Pengampu</td>
      <td>:</td>
      <td>Darmawan Lahru Riatma, S.Kom., M.MT (NIP. 1991091420200801)</td>
    </tr>
    <tr>
      <td style="font-weight: bold;">Penyusun / Asisten</td>
      <td>:</td>
      <td>Ghandur Fauzan Ngauf Hisam (V3925024) & Ridho Asykuri (V3925015)</td>
    </tr>
    <tr>
      <td style="font-weight: bold;">Waktu Ekspor</td>
      <td>:</td>
      <td>${dateStr}</td>
    </tr>
  </table>

  <h4 style="font-family: Arial, sans-serif; margin-bottom: 6px;">I. Ringkasan Eksekutif Kelas</h4>
  <table class="data-table">
    <thead>
      <tr>
        <th>Indikator Metrik</th>
        <th>Nilai Agregat</th>
        <th>Standar Kelulusan</th>
        <th>Status Kelas</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Total Pelajar Terdaftar</td>
        <td><strong>${summary.totalStudents} Mahasiswa</strong></td>
        <td>50 Kuota</td>
        <td><span class="badge-good">Optimal</span></td>
      </tr>
      <tr>
        <td>Rata-Rata Pemahaman Modul</td>
        <td><strong>${summary.averageComprehension}%</strong></td>
        <td>≥ 70%</td>
        <td><span class="badge-good">Memenuhi Ambang Batas</span></td>
      </tr>
      <tr>
        <td>Materi Pembelajaran Aktif</td>
        <td><strong>${summary.activeModules} Modul Kuliah</strong></td>
        <td>Kurikulum Lengkap</td>
        <td><span class="badge-good">Tersinkronisasi RAG</span></td>
      </tr>
      <tr>
        <td>Mahasiswa Perlu Intervensi (Remedial)</td>
        <td><strong>${summary.studentsNeedingIntervention} Mahasiswa</strong></td>
        <td>Skor &lt; 60</td>
        <td><span class="badge-warn">Perlu Bimbingan Terarah</span></td>
      </tr>
    </tbody>
  </table>

  <h4 style="font-family: Arial, sans-serif; margin-bottom: 6px; margin-top: 24px;">II. Capaian Tingkat Pemahaman Per Modul</h4>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 60px;">No</th>
        <th>Nama Modul / Bab Pembelajaran</th>
        <th style="width: 140px;">Tingkat Pemahaman</th>
        <th style="width: 140px;">Kategori Evaluasi</th>
      </tr>
    </thead>
    <tbody>
      ${chapters
        .map(
          (c, i) => `
        <tr>
          <td style="text-align: center;">${i + 1}</td>
          <td>${c.name}</td>
          <td><strong>${c.percent}%</strong></td>
          <td>${c.percent >= 75 ? '<span class="badge-good">Sangat Baik</span>' : '<span class="badge-warn">Perlu Remedial</span>'}</td>
        </tr>`
        )
        .join("")}
    </tbody>
  </table>

  <h4 style="font-family: Arial, sans-serif; margin-bottom: 6px; margin-top: 24px;">III. Daftar Pelajar Dalam Pengawasan Intervensi Remedial</h4>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 60px;">No</th>
        <th>Nama Mahasiswa</th>
        <th>Modul Terkendala</th>
        <th>Skor Kuis Adaptif</th>
        <th>Rekomendasi Sistem</th>
      </tr>
    </thead>
    <tbody>
      ${students
        .map(
          (s, i) => `
        <tr>
          <td style="text-align: center;">${i + 1}</td>
          <td><strong>${s.name}</strong></td>
          <td>${s.chapter}</td>
          <td><span class="badge-warn">${s.score} / ${s.outOf} (Remedial)</span></td>
          <td>Wajib mempelajari ulang Analogi & Mind Map modul terkait</td>
        </tr>`
        )
        .join("")}
    </tbody>
  </table>

  <div class="signatures">
    <div class="sign-box">
      <p>Mengetahui,<br />Penyusun Sistem ExplainMyLesson AI</p>
      <div class="space"></div>
      <p><strong>Ghandur Fauzan Ngauf Hisam</strong><br />NIM. V3925024</p>
    </div>
    <div class="sign-box">
      <p>Madiun, ${dateStr}<br />Dosen Pengampu,</p>
      <div class="space"></div>
      <p><strong>Darmawan Lahru Riatma, S.Kom., M.MT</strong><br />NIP. 1991091420200801</p>
    </div>
  </div>
</body>
</html>`;

  return {
    fileName: `Laporan_Resmi_ExplainMyLesson_UNS_${Date.now()}.html`,
    content: html,
  };
}
