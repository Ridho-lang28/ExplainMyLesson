// app/api/[...slug]/route.ts
//
// Next.js App Router Catch-All Route Handler.
// Menjamin seluruh endpoint /api/* berjalan secara native di runtime Next.js
// (Vercel Serverless & local next dev/start) dengan menghubungkan langsung ke server/data.ts.

import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
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
} from "../../../server/data";
import { SESSION_COOKIE, isValidRole } from "../../../server/session";
import {
  CreateClassRoomSchema,
  CreateMaterialSchema,
  RegisterInputSchema,
  UpdateProfileInputSchema,
} from "../../../shared/schema";

type RouteContext = {
  params: Promise<{ slug: string[] }>;
};

// --- GET Handler -------------------------------------------------------------
export async function GET(req: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const path = slug.join("/");
  const cookieStore = await cookies();
  const sessionRole = cookieStore.get(SESSION_COOKIE)?.value;
  const role = isValidRole(sessionRole) ? sessionRole : "pelajar";

  try {
    if (path === "session") {
      if (!isValidRole(sessionRole)) {
        return NextResponse.json({ authenticated: false });
      }
      return NextResponse.json({ authenticated: true, role: sessionRole });
    }

    if (path === "profile") {
      const profile = await getUserProfileByRole(role);
      return NextResponse.json(profile);
    }

    if (path === "classes") {
      const classes = await getClassRooms();
      return NextResponse.json(classes);
    }

    if (path === "notifications") {
      const notifications = await getNotifications();
      return NextResponse.json(notifications);
    }

    if (path === "class-summary") {
      const summary = await getClassSummary();
      return NextResponse.json(summary);
    }

    if (path === "chapter-progress") {
      const chapters = await getChapterProgress();
      return NextResponse.json(chapters);
    }

    if (path === "students-needing-help") {
      const students = await getStudentsNeedingHelp();
      return NextResponse.json(students);
    }

    if (path === "export") {
      const format = req.nextUrl.searchParams.get("format") ?? "csv";
      if (format.toLowerCase() === "pdf" || format.toLowerCase() === "html") {
        const { fileName, content } = await buildClassReportHtml();
        return new NextResponse(content, {
          status: 200,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Content-Disposition": `inline; filename="${fileName}"`,
          },
        });
      }
      const { fileName, content } = await buildClassReportCsv();
      return new NextResponse(content, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${fileName}"`,
        },
      });
    }

    if (path === "ai-content") {
      const chapter = req.nextUrl.searchParams.get("chapter") ?? "1";
      const mode = (req.nextUrl.searchParams.get("mode") ?? "ringkasan") as AiMode;
      const content = await getAiContent(chapter, mode);
      return NextResponse.json(content);
    }

    if (path === "quiz") {
      const level = Number(req.nextUrl.searchParams.get("level") ?? "1");
      const questions = await getQuestionsByLevel(level);
      return NextResponse.json({ level, questions });
    }

    if (path === "materials") {
      const materials = await getMaterials();
      return NextResponse.json(materials);
    }

    return NextResponse.json({ error: `Route /api/${path} not found` }, { status: 404 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// --- POST Handler ------------------------------------------------------------
export async function POST(req: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const path = slug.join("/");
  const cookieStore = await cookies();

  try {
    const body = await req.json().catch(() => ({}));

    if (path === "login") {
      const { email, password, role } = body;
      if (email && password) {
        try {
          const user = await verifyUserCredentials(email, password);
          cookieStore.set(SESSION_COOKIE, user.role, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 8,
          });
          return NextResponse.json({ ok: true, role: user.role, user });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Email atau kata sandi tidak valid.";
          return NextResponse.json({ error: message }, { status: 401 });
        }
      }

      if (!isValidRole(role)) {
        return NextResponse.json({ error: "Role tidak valid." }, { status: 400 });
      }

      cookieStore.set(SESSION_COOKIE, role, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 8,
      });
      return NextResponse.json({ ok: true, role });
    }

    if (path === "register") {
      const parsed = RegisterInputSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.errors[0]?.message ?? "Data registrasi tidak valid." },
          { status: 400 }
        );
      }

      try {
        const user = await registerUserAccount(parsed.data);
        cookieStore.set(SESSION_COOKIE, user.role, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 8,
        });
        return NextResponse.json({ ok: true, user }, { status: 201 });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Gagal mendaftarkan akun.";
        return NextResponse.json({ error: message }, { status: 400 });
      }
    }

    if (path === "logout") {
      cookieStore.delete(SESSION_COOKIE);
      return NextResponse.json({ ok: true });
    }

    if (path === "classes") {
      const parsed = CreateClassRoomSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.errors[0]?.message ?? "Data kelas tidak valid." },
          { status: 400 }
        );
      }
      const created = await createClassRoom(parsed.data);
      return NextResponse.json(created, { status: 201 });
    }

    if (slug.length === 3 && slug[0] === "notifications" && slug[2] === "read") {
      const notifId = slug[1];
      if (notifId) {
        await markNotificationAsRead(notifId);
      }
      return NextResponse.json({ ok: true });
    }

    if (path === "materials") {
      const parsed = CreateMaterialSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.errors[0]?.message ?? "Data tidak valid." },
          { status: 400 }
        );
      }
      const result = await saveMaterial(parsed.data);
      return NextResponse.json(result, { status: 201 });
    }

    return NextResponse.json({ error: `Route /api/${path} not found` }, { status: 404 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// --- PUT Handler -------------------------------------------------------------
export async function PUT(req: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const path = slug.join("/");
  const cookieStore = await cookies();
  const sessionRole = cookieStore.get(SESSION_COOKIE)?.value;
  const role = isValidRole(sessionRole) ? sessionRole : "pelajar";

  try {
    if (path === "profile") {
      const body = await req.json().catch(() => ({}));
      const parsed = UpdateProfileInputSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.errors[0]?.message ?? "Data profil tidak valid." },
          { status: 400 }
        );
      }
      const updated = await updateUserProfile(role, parsed.data);
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: `Route /api/${path} not found` }, { status: 404 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// --- DELETE Handler ----------------------------------------------------------
export async function DELETE(_req: NextRequest, context: RouteContext) {
  const { slug } = await context.params;

  try {
    if (slug.length === 2 && slug[0] === "classes") {
      const classId = slug[1];
      if (!classId) {
        return NextResponse.json({ error: "ID kelas tidak valid." }, { status: 400 });
      }
      const success = await deleteClassRoom(classId);
      if (!success) {
        return NextResponse.json({ error: "Kelas tidak ditemukan." }, { status: 404 });
      }
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Route not found" }, { status: 404 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
