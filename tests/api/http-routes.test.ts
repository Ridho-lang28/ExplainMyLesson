import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../server/index";

describe("Express REST API Route Handlers Integration (server/index.ts)", () => {
  it("includes custom server header x-uns-taskflow", async () => {
    const res = await request(app).get("/api/session");
    expect(res.headers["x-uns-taskflow"]).toBe("vite-spa");
  });

  describe("Authentication Endpoints (/api/login, /api/register, /api/logout, /api/session)", () => {
    it("POST /api/login: succeeds with valid email & password", async () => {
      const res = await request(app)
        .post("/api/login")
        .send({ email: "darmawan@staff.uns.ac.id", password: "dosen123" });

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.role).toBe("pengajar");
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("POST /api/login: rejects invalid password", async () => {
      const res = await request(app)
        .post("/api/login")
        .send({ email: "darmawan@staff.uns.ac.id", password: "wrongpassword" });

      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    it("POST /api/login: rejects unregistered email", async () => {
      const res = await request(app)
        .post("/api/login")
        .send({ email: "unregistered@uns.ac.id", password: "password123" });

      expect(res.status).toBe(401);
      expect(res.body.error).toContain("tidak ditemukan");
    });

    it("POST /api/login: succeeds with 1-click demo role", async () => {
      const res = await request(app).post("/api/login").send({ role: "pelajar" });

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.role).toBe("pelajar");
    });

    it("POST /api/login: rejects invalid demo role", async () => {
      const res = await request(app).post("/api/login").send({ role: "guest_unknown" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Role tidak valid.");
    });

    it("POST /api/register: succeeds with valid user input and rejects duplicate email", async () => {
      const uniqueEmail = `mhs_api_${Date.now()}@student.uns.ac.id`;
      const res = await request(app).post("/api/register").send({
        name: "Test API Student",
        email: uniqueEmail,
        password: "securePassword123",
        role: "pelajar",
      });

      expect(res.status).toBe(201);
      expect(res.body.ok).toBe(true);
      expect(res.body.user.email).toBe(uniqueEmail);

      // Attempt duplicate registration
      const dupRes = await request(app).post("/api/register").send({
        name: "Duplicate User",
        email: uniqueEmail,
        password: "securePassword123",
        role: "pelajar",
      });

      expect(dupRes.status).toBe(400);
      expect(dupRes.body.error).toContain("sudah terdaftar");
    });

    it("POST /api/register: returns 400 on invalid input", async () => {
      const res = await request(app).post("/api/register").send({
        email: "not-an-email",
        password: "123",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it("POST /api/logout: clears session cookie", async () => {
      const res = await request(app).post("/api/logout");
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
    });

    it("GET /api/session: returns unauthenticated when no cookie provided", async () => {
      const res = await request(app).get("/api/session");
      expect(res.status).toBe(200);
      expect(res.body.authenticated).toBe(false);
    });

    it("GET /api/session: returns authenticated when valid role cookie provided", async () => {
      const res = await request(app)
        .get("/api/session")
        .set("Cookie", ["uns_session=pengajar"]);

      expect(res.status).toBe(200);
      expect(res.body.authenticated).toBe(true);
      expect(res.body.role).toBe("pengajar");
    });
  });

  describe("Profile Endpoints (/api/profile)", () => {
    it("GET /api/profile: returns profile based on session cookie", async () => {
      const res = await request(app)
        .get("/api/profile")
        .set("Cookie", ["uns_session=pengajar"]);

      expect(res.status).toBe(200);
      expect(res.body.role).toBe("pengajar");
      expect(res.body.name).toBeDefined();
    });

    it("PUT /api/profile: updates profile data with validation", async () => {
      const res = await request(app)
        .put("/api/profile")
        .set("Cookie", ["uns_session=pelajar"])
        .send({
          name: "Ghandur Fauzan Updated",
          email: "ghandur@student.uns.ac.id",
        });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Ghandur Fauzan Updated");
    });

    it("PUT /api/profile: rejects invalid email format", async () => {
      const res = await request(app)
        .put("/api/profile")
        .send({
          name: "Invalid Test",
          email: "not-valid-email",
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("Class Management Endpoints (/api/classes)", () => {
    it("GET /api/classes: returns list of classes", async () => {
      const res = await request(app).get("/api/classes");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("POST /api/classes and DELETE /api/classes/:id: creates and deletes a class", async () => {
      const classCode = `CODE_${Date.now()}`;
      const createRes = await request(app).post("/api/classes").send({
        name: "Kelas Uji Otomatis",
        code: classCode,
        semester: "Semester Genap",
        academicYear: "2025/2026",
      });

      expect(createRes.status).toBe(201);
      expect(createRes.body.id).toBeDefined();
      expect(createRes.body.code).toBe(classCode);

      // DELETE the created class
      const delRes = await request(app).delete(`/api/classes/${createRes.body.id}`);
      expect(delRes.status).toBe(200);
      expect(delRes.body.ok).toBe(true);

      // DELETE non-existent class should return 404
      const notFoundRes = await request(app).delete("/api/classes/cls_non_existent_999");
      expect(notFoundRes.status).toBe(404);
      expect(notFoundRes.body.error).toBe("Kelas tidak ditemukan.");
    });

    it("POST /api/classes: rejects invalid class data", async () => {
      const res = await request(app).post("/api/classes").send({
        name: "",
        code: "",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("Notifications Endpoints (/api/notifications)", () => {
    it("GET /api/notifications & POST /api/notifications/:id/read", async () => {
      const listRes = await request(app).get("/api/notifications");
      expect(listRes.status).toBe(200);
      expect(Array.isArray(listRes.body)).toBe(true);
      expect(listRes.body.length).toBeGreaterThan(0);

      const targetId = listRes.body[0].id;
      const readRes = await request(app).post(`/api/notifications/${targetId}/read`);
      expect(readRes.status).toBe(200);
      expect(readRes.body.ok).toBe(true);
    });
  });

  describe("Analytics & Export Endpoints (/api/class-summary, /api/export, etc.)", () => {
    it("GET /api/class-summary returns analytics summary", async () => {
      const res = await request(app).get("/api/class-summary");
      expect(res.status).toBe(200);
      expect(res.body.averageComprehension).toBeDefined();
    });

    it("GET /api/chapter-progress returns progress per chapter", async () => {
      const res = await request(app).get("/api/chapter-progress");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("GET /api/students-needing-help returns list of students", async () => {
      const res = await request(app).get("/api/students-needing-help");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("GET /api/export: exports CSV report with attachment header", async () => {
      const res = await request(app).get("/api/export?format=csv");
      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toContain("text/csv");
      expect(res.headers["content-disposition"]).toContain("attachment");
      expect(res.text).toContain("Laporan Analisis & Pemahaman Kelas");
    });

    it("GET /api/export: exports HTML print-ready report for PDF", async () => {
      const res = await request(app).get("/api/export?format=pdf");
      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toContain("text/html");
      expect(res.text).toContain("KEMENTERIAN PENDIDIKAN TINGGI");
      expect(res.text).toContain("window.print()");
    });
  });

  describe("Learning Content & Adaptive Quiz Endpoints (/api/ai-content, /api/quiz, /api/materials)", () => {
    it("GET /api/ai-content returns AI learning mode content", async () => {
      const res = await request(app).get("/api/ai-content?chapter=1&mode=ringkasan");
      expect(res.status).toBe(200);
      expect(res.body.title).toBeDefined();
      expect(Array.isArray(res.body.body)).toBe(true);
    });

    it("GET /api/quiz returns questions for level 1, 2, and 3", async () => {
      const res1 = await request(app).get("/api/quiz?level=1");
      expect(res1.status).toBe(200);
      expect(res1.body.level).toBe(1);
      expect(res1.body.questions.length).toBeGreaterThan(0);

      const res2 = await request(app).get("/api/quiz?level=2");
      expect(res2.status).toBe(200);
      expect(res2.body.level).toBe(2);

      const res3 = await request(app).get("/api/quiz?level=3");
      expect(res3.status).toBe(200);
      expect(res3.body.level).toBe(3);
    });

    it("GET /api/quiz returns 404 for non-existent level", async () => {
      const res = await request(app).get("/api/quiz?level=999");
      expect(res.status).toBe(404);
      expect(res.body.error).toBeDefined();
    });

    it("GET /api/materials and POST /api/materials: fetches and uploads materials", async () => {
      const getRes = await request(app).get("/api/materials");
      expect(getRes.status).toBe(200);
      expect(Array.isArray(getRes.body)).toBe(true);

      const postRes = await request(app).post("/api/materials").send({
        title: "Dokumen Praktikum Vitest API Integration",
        fileName: "praktikum_api.pdf",
        variant: "public",
      });

      expect(postRes.status).toBe(201);
      expect(postRes.body.id).toBeDefined();
      expect(postRes.body.title).toBe("Dokumen Praktikum Vitest API Integration");
    });

    it("POST /api/materials: rejects invalid material payload", async () => {
      const res = await request(app).post("/api/materials").send({
        title: "",
        scope: "invalid-scope",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });
});
