// server/index.ts — Express API Server
//
// Pada Tugas 7 (Next.js App Router), setiap berkas app/api/*/route.ts adalah
// sebuah Route Handler yang dijalankan oleh runtime Next.js, dan
// middleware.ts melindungi /dashboard/* di Edge Runtime SEBELUM request
// mencapai halaman. Vite TIDAK punya konsep Route Handler maupun Middleware
// server-side — Vite murni bundler + dev server untuk aset statis (HTML/CSS/JS).
//
// Karena itu, Tugas 8 memindahkan seluruh Route Handler + middleware.ts ke
// satu Express App kecil di sini. Selama development, Vite (port 5173)
// mem-proxy semua request "/api/*" ke server Express ini (port 4000) —
// lihat vite.config.ts `server.proxy`. Saat produksi, Express App inilah
// yang men-serve hasil `vite build` (folder dist/) SEKALIGUS menjawab
// "/api/*" — satu proses Node, satu port, persis seperti pola populer
// "Vite (frontend) + Express (backend)".
//
// Proteksi rute /dashboard/* pada arsitektur SPA TIDAK bisa lagi dilakukan
// dengan mencegat request HTML di server (karena hanya ada SATU index.html
// yang dikirim untuk semua rute — client-side routing). Sebagai gantinya,
// endpoint GET /api/session di bawah menjadi sumber kebenaran sesi: React
// Router memanggilnya lewat <ProtectedRoute> (src/router/ProtectedRoute.tsx)
// sebelum merender halaman /dashboard/* apa pun, dan redirect ke /login jika
// tidak terautentikasi — reimplementasi 1:1 dari logika middleware.ts.

import path from "node:path";
import { fileURLToPath } from "node:url";
import cookieParser from "cookie-parser";
import express, { type NextFunction, type Request, type Response } from "express";
import {
  CreateClassRoomSchema,
  CreateMaterialSchema,
  RegisterInputSchema,
  UpdateProfileInputSchema,
} from "../shared/schema";
import {
  type AiMode,
  buildClassReportCsv,
  buildClassReportHtml,
  createClassRoom,
  deleteClassRoom,
  getAiContent,
  getChapterProgress,
  getClassRooms,
  getClassSummary,
  getMaterials,
  getNotifications,
  getQuestionsByLevel,
  getStudentsNeedingHelp,
  getUserProfileByRole,
  markNotificationAsRead,
  registerUserAccount,
  saveMaterial,
  updateUserProfile,
  verifyUserCredentials,
} from "./data";
import { SESSION_COOKIE, isValidRole } from "./session";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 4000);
const isProduction = process.env.NODE_ENV === "production";

const app = express();
app.use(express.json());
app.use(cookieParser());

// Header kustom sekadar contoh manipulasi header di layer server — padanan
// `response.headers.set("x-uns-taskflow", "app-router")` pada middleware.ts.
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("x-uns-taskflow", "vite-spa");
  next();
});

const router = express.Router();

// --- Auth: login / logout / session (pengganti middleware.ts + cookie) ----

router.post("/login", async (req: Request, res: Response) => {
  const { email, password, role } = req.body || {};

  // Jika menyertakan email & password, lakukan verifikasi credential dengan bcrypt (NFR-01, TC-01, TC-02, TC-03)
  if (email && password) {
    try {
      const user = await verifyUserCredentials(email, password);
      res.cookie(SESSION_COOKIE, user.role, {
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction,
        path: "/",
        maxAge: 1000 * 60 * 60 * 8, // 8 jam
      });
      return res.json({ ok: true, role: user.role, user });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Email atau kata sandi tidak valid.";
      return res.status(401).json({ error: message });
    }
  }

  // 1-Click Instant Demo Login (Praktikum)
  if (!isValidRole(role)) {
    return res.status(400).json({ error: "Role tidak valid." });
  }
  res.cookie(SESSION_COOKIE, role, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: 1000 * 60 * 60 * 8, // 8 jam
  });
  return res.json({ ok: true, role });
});

// Registrasi Pengguna Baru (FR-01, TC-04, TC-05) - Mendukung segala format email valid
router.post("/register", async (req: Request, res: Response) => {
  const parsed = RegisterInputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: parsed.error.errors[0]?.message ?? "Data registrasi tidak valid." });
  }

  try {
    const user = await registerUserAccount(parsed.data);
    res.cookie(SESSION_COOKIE, user.role, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      path: "/",
      maxAge: 1000 * 60 * 60 * 8,
    });
    return res.status(201).json({ ok: true, user });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal mendaftarkan akun.";
    return res.status(400).json({ error: message });
  }
});

router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie(SESSION_COOKIE, { path: "/" });
  return res.json({ ok: true });
});

// Sumber kebenaran sesi untuk React Router <ProtectedRoute>
router.get("/session", (req: Request, res: Response) => {
  const roleCookie = req.cookies?.[SESSION_COOKIE];
  if (!isValidRole(roleCookie)) {
    return res.json({ authenticated: false });
  }
  return res.json({ authenticated: true, role: roleCookie });
});

// Profil Pengguna (FR-22)
router.get("/profile", async (req: Request, res: Response) => {
  const roleCookie = req.cookies?.[SESSION_COOKIE];
  const role = isValidRole(roleCookie) ? roleCookie : "pelajar";
  const profile = await getUserProfileByRole(role);
  res.json(profile);
});

router.put("/profile", async (req: Request, res: Response) => {
  const roleCookie = req.cookies?.[SESSION_COOKIE];
  const role = isValidRole(roleCookie) ? roleCookie : "pelajar";
  const parsed = UpdateProfileInputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: parsed.error.errors[0]?.message ?? "Data profil tidak valid." });
  }
  try {
    const updated = await updateUserProfile(role, parsed.data);
    res.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal memperbarui profil.";
    res.status(500).json({ error: message });
  }
});

// Manajemen Kelas (FR-21)
router.get("/classes", async (_req: Request, res: Response) => {
  const classes = await getClassRooms();
  res.json(classes);
});

router.post("/classes", async (req: Request, res: Response) => {
  const parsed = CreateClassRoomSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: parsed.error.errors[0]?.message ?? "Data kelas tidak valid." });
  }
  try {
    const created = await createClassRoom(parsed.data);
    res.status(201).json(created);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal membuat kelas baru.";
    res.status(500).json({ error: message });
  }
});

router.delete("/classes/:id", async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const success = await deleteClassRoom(id);
  if (!success) {
    return res.status(404).json({ error: "Kelas tidak ditemukan." });
  }
  res.json({ ok: true });
});

// Notifikasi Adaptif (FR-20)
router.get("/notifications", async (_req: Request, res: Response) => {
  const notifications = await getNotifications();
  res.json(notifications);
});

router.post("/notifications/:id/read", async (req: Request, res: Response) => {
  const id = String(req.params.id);
  await markNotificationAsRead(id);
  res.json({ ok: true });
});

// --- Dashboard Pengajar: ringkasan kelas, progres bab, siswa perlu bantuan -

router.get("/class-summary", async (_req: Request, res: Response) => {
  const summary = await getClassSummary();
  res.json(summary);
});

router.get("/chapter-progress", async (_req: Request, res: Response) => {
  const chapters = await getChapterProgress();
  res.json(chapters);
});

router.get("/students-needing-help", async (_req: Request, res: Response) => {
  const students = await getStudentsNeedingHelp();
  res.json(students);
});

// Ekspor Laporan: mendukung format CSV dan PDF/HTML (FR-18, TC-21, TC-22)
router.get("/export", async (req: Request, res: Response) => {
  const format = String(req.query.format ?? "csv").toLowerCase();
  try {
    if (format === "pdf" || format === "html") {
      const { fileName, content } = await buildClassReportHtml();
      res.status(200);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
      res.send(content);
    } else {
      const { fileName, content } = await buildClassReportCsv();
      res.status(200);
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      res.send(content);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal membuat laporan.";
    res.status(500).json({ error: message });
  }
});

// --- Dashboard Pelajar: konten AI (ringkasan/analogi/mindmap/contoh) -------

router.get("/ai-content", async (req: Request, res: Response) => {
  const chapterId = String(req.query.chapter ?? "1");
  const mode = String(req.query.mode ?? "ringkasan") as AiMode;
  try {
    const content = await getAiContent(chapterId, mode);
    res.json(content);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal memuat konten AI.";
    res.status(502).json({ error: message });
  }
});

// --- Kuis Adaptif 3 Level ----------------------------------------------------

router.get("/quiz", async (req: Request, res: Response) => {
  const level = Number(req.query.level ?? "1");
  try {
    const questions = await getQuestionsByLevel(level);
    res.json({ level, questions });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal memuat soal.";
    res.status(404).json({ error: message });
  }
});

// --- Materi ter-upload (GET list / POST create) -----------------------------

router.get("/materials", async (_req: Request, res: Response) => {
  try {
    const materials = await getMaterials();
    res.json(materials);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal mengambil daftar materi.";
    res.status(502).json({ error: message });
  }
});

router.post("/materials", async (req: Request, res: Response) => {
  const parsed = CreateMaterialSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0]?.message ?? "Data tidak valid." });
  }

  try {
    const result = await saveMaterial(parsed.data);
    return res.status(201).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal mengunggah dokumen.";
    return res.status(502).json({ error: message });
  }
});

app.use("/api", router);

// --- Produksi: sajikan hasil `vite build` (dist/) dari proses yang sama ----
if (isProduction) {
  const distDir = path.resolve(__dirname, "../dist");
  app.use(express.static(distDir));
  // SPA fallback: seluruh rute non-/api (mis. /dashboard/pelajar/kuis saat
  // di-refresh langsung oleh browser) dikembalikan ke index.html supaya
  // React Router yang menanganinya di sisi klien.
  app.get("*", (_req: Request, res: Response) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[uns-fastbuild] Express API server siap di http://localhost:${PORT}`);
    if (isProduction) {
      console.log(
        `[uns-fastbuild] Menyajikan build produksi dari ${path.resolve(__dirname, "../dist")}`
      );
    }
  });
}

export default app;
