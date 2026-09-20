import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createClass,
  deleteClass,
  exportClassReportUrl,
  fetchAiContent,
  fetchChapterProgress,
  fetchClasses,
  fetchClassSummary,
  fetchNotifications,
  fetchStudentsNeedingHelp,
  markNotificationRead,
} from "../../src/lib/api/classApi";
import { createMaterial, fetchMaterials } from "../../src/lib/api/materialsApi";
import { fetchQuestionsByLevel } from "../../src/lib/api/quizApi";
import {
  fetchProfile,
  fetchSession,
  login,
  logout,
  register,
  updateProfile,
} from "../../src/lib/api/sessionApi";

describe("Client API Layer Unit Tests (src/lib/api/)", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe("classApi.ts", () => {
    it("fetchClassSummary resolves valid summary", async () => {
      const mockSummary = {
        totalStudents: 120,
        averageComprehension: 78.5,
        activeModules: 3,
        studentsNeedingIntervention: 4,
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockSummary,
      });

      const result = await fetchClassSummary();
      expect(result.totalStudents).toBe(120);
      expect(result.averageComprehension).toBe(78.5);
      expect(result.studentsNeedingIntervention).toBe(4);
    });

    it("fetchClassSummary throws on failure", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Error" }),
      });

      await expect(fetchClassSummary()).rejects.toThrow("Gagal memuat ringkasan kelas.");
    });

    it("fetchChapterProgress resolves array of chapters", async () => {
      const mockProgress = [
        {
          id: 1,
          name: "Pengantar Rekayasa Perangkat Lunak",
          percent: 85,
          tone: "high" as const,
        },
      ];

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockProgress,
      });

      const result = await fetchChapterProgress();
      expect(result.length).toBe(1);
      expect(result[0]?.percent).toBe(85);
      expect(result[0]?.tone).toBe("high");
    });

    it("fetchChapterProgress throws on error", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, json: async () => null });
      await expect(fetchChapterProgress()).rejects.toThrow("Gagal memuat progres bab.");
    });

    it("fetchStudentsNeedingHelp resolves list of students", async () => {
      const mockStudents = [
        {
          id: "std_1",
          name: "Andi Saputra",
          chapter: "Bab 2: Analisis Kebutuhan",
          score: 55,
          outOf: 100,
        },
      ];

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockStudents,
      });

      const result = await fetchStudentsNeedingHelp();
      expect(result.length).toBe(1);
      expect(result[0]?.score).toBe(55);
    });

    it("fetchStudentsNeedingHelp throws on error", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, json: async () => null });
      await expect(fetchStudentsNeedingHelp()).rejects.toThrow(
        "Gagal memuat daftar pelajar perlu bimbingan."
      );
    });

    it("fetchAiContent resolves AI content and throws on error", async () => {
      const mockAi = {
        title: "Ringkasan Bab 1",
        body: ["Poin 1", "Poin 2"],
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockAi,
      });

      const result = await fetchAiContent("1", "ringkasan");
      expect(result.title).toBe("Ringkasan Bab 1");
      expect(result.body.length).toBe(2);

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Gagal memuat konten AI." }),
      });
      await expect(fetchAiContent("99", "ringkasan")).rejects.toThrow("Gagal memuat konten AI.");
    });

    it("exportClassReportUrl returns raw fetch response", async () => {
      const mockRes = { status: 200 } as Response;
      globalThis.fetch = vi.fn().mockResolvedValue(mockRes);

      const res = await exportClassReportUrl("csv");
      expect(res.status).toBe(200);
    });

    it("fetchClasses, createClass, and deleteClass handle success and errors", async () => {
      const mockClass = {
        id: "cls_1",
        name: "Pemrograman Web",
        code: "TI-WEB",
        semester: "Semester Ganjil",
        academicYear: "2025/2026",
        studentCount: 40,
        modulesCount: 2,
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [mockClass],
      });
      const list = await fetchClasses();
      expect(list.length).toBe(1);

      // fetchClasses error
      globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, json: async () => null });
      await expect(fetchClasses()).rejects.toThrow("Gagal memuat daftar kelas.");

      // createClass
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockClass,
      });
      const created = await createClass({
        name: "Web",
        code: "TI-WEB",
        semester: "Semester Ganjil",
        academicYear: "2025/2026",
      });
      expect(created.id).toBe("cls_1");

      // createClass error
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Validasi gagal." }),
      });
      await expect(
        createClass({
          name: "",
          code: "",
          semester: "Ganjil",
          academicYear: "2025/2026",
        })
      ).rejects.toThrow("Validasi gagal.");

      // deleteClass
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true }),
      });
      const del = await deleteClass("cls_1");
      expect(del.ok).toBe(true);

      // deleteClass error
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Kelas tidak ditemukan." }),
      });
      await expect(deleteClass("cls_999")).rejects.toThrow("Kelas tidak ditemukan.");
    });

    it("fetchNotifications and markNotificationRead", async () => {
      const mockNotifs = [
        {
          id: "notif_1",
          title: "Notifikasi 1",
          message: "Pesan",
          type: "info" as const,
          link: "/link",
          isRead: false,
          createdAt: "Sekarang",
        },
      ];

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockNotifs,
      });

      const notifs = await fetchNotifications();
      expect(notifs.length).toBe(1);

      // Error case
      globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, json: async () => null });
      await expect(fetchNotifications()).rejects.toThrow("Gagal memuat notifikasi.");

      // Mark read
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true }),
      });
      const mark = await markNotificationRead("notif_1");
      expect(mark.ok).toBe(true);
    });
  });

  describe("materialsApi.ts", () => {
    it("fetchMaterials fetches and parses material list", async () => {
      const mockMaterial = {
        id: "mat_1",
        title: "Modul Pertama Rekayasa Web",
        fileName: "modul1.pdf",
        variant: "public" as const,
        chapter: "1",
        indexedAt: "2026-03-10",
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [mockMaterial],
      });

      const list = await fetchMaterials();
      expect(list.length).toBe(1);
      expect(list[0]?.title).toBe("Modul Pertama Rekayasa Web");
    });

    it("fetchMaterials throws on server error", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Server error" }),
      });

      await expect(fetchMaterials()).rejects.toThrow("Server error");
    });

    it("createMaterial creates and parses new material", async () => {
      const mockCreated = {
        id: "mat_2",
        title: "Modul Baru Mahasiswa",
        fileName: "baru.pdf",
        variant: "private" as const,
        chapter: "2",
        indexedAt: "2026-03-11",
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockCreated,
      });

      const res = await createMaterial({
        title: "Modul Baru Mahasiswa",
        fileName: "baru.pdf",
        variant: "private",
        chapter: "2",
      });
      expect(res.id).toBe("mat_2");
    });

    it("createMaterial throws on failed response", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Ukuran file terlalu besar." }),
      });

      await expect(
        createMaterial({
          title: "Modul Baru Mahasiswa",
          fileName: "baru.pdf",
          variant: "private",
        })
      ).rejects.toThrow("Ukuran file terlalu besar.");
    });
  });

  describe("quizApi.ts", () => {
    it("fetchQuestionsByLevel resolves question list", async () => {
      const mockQuiz = {
        level: 1,
        questions: [
          {
            id: "q1",
            level: 1,
            question: "Apa itu RAG?",
            options: ["A", "B", "C", "D"],
            correctOption: 0,
            hint: "Petunjuk",
          },
        ],
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockQuiz,
      });

      const questions = await fetchQuestionsByLevel(1);
      expect(questions.length).toBe(1);
      expect(questions[0]?.question).toBe("Apa itu RAG?");
    });

    it("fetchQuestionsByLevel throws on failure", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Soal tidak ditemukan." }),
      });

      await expect(fetchQuestionsByLevel(99)).rejects.toThrow("Soal tidak ditemukan.");
    });
  });

  describe("sessionApi.ts", () => {
    it("fetchSession returns session data", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ authenticated: true, role: "pelajar" }),
      });

      const session = await fetchSession();
      expect(session.authenticated).toBe(true);
      expect(session.role).toBe("pelajar");
    });

    it("login handles success and error", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true, role: "pelajar" }),
      });

      const res = await login({ role: "pelajar" });
      expect(res.ok).toBe(true);
      expect(res.role).toBe("pelajar");

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Kredensial salah" }),
      });
      await expect(
        login({ email: "user@uns.ac.id", password: "wrong" })
      ).rejects.toThrow("Kredensial salah");
    });

    it("register handles success and error", async () => {
      const mockUser = {
        id: "u1",
        name: "Mahasiswa Baru",
        email: "baru@student.uns.ac.id",
        role: "pelajar" as const,
        nimNip: "V123",
        institution: "UNS",
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true, user: mockUser }),
      });

      const res = await register({
        name: "Mahasiswa Baru",
        email: "baru@student.uns.ac.id",
        password: "password123",
        role: "pelajar",
      });
      expect(res.ok).toBe(true);

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Email sudah terdaftar" }),
      });
      await expect(
        register({
          name: "Mahasiswa Baru",
          email: "baru@student.uns.ac.id",
          password: "password123",
          role: "pelajar",
        })
      ).rejects.toThrow("Email sudah terdaftar");
    });

    it("logout fires POST request", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({ ok: true });
      await expect(logout()).resolves.toBeUndefined();
    });

    it("fetchProfile and updateProfile", async () => {
      const mockProfile = {
        id: "u_prof",
        name: "Ghandur",
        email: "ghandur@student.uns.ac.id",
        role: "pelajar" as const,
        nimNip: "V3925024",
        institution: "UNS",
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockProfile,
      });

      const prof = await fetchProfile();
      expect(prof.name).toBe("Ghandur");

      // fetchProfile error
      globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, json: async () => null });
      await expect(fetchProfile()).rejects.toThrow("Gagal memuat profil pengguna.");

      // updateProfile success
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ...mockProfile, name: "Ghandur Fauzan" }),
      });
      const updated = await updateProfile({
        name: "Ghandur Fauzan",
        email: "ghandur@student.uns.ac.id",
      });
      expect(updated.name).toBe("Ghandur Fauzan");

      // updateProfile error
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Gagal memperbarui profil." }),
      });
      await expect(
        updateProfile({ name: "", email: "ghandur@student.uns.ac.id" })
      ).rejects.toThrow("Gagal memperbarui profil.");
    });
  });
});
