import { describe, expect, it } from "vitest";
import { SESSION_COOKIE, isValidRole } from "../../server/session";

describe("Session Helper & Cookie Validation (server/session.ts)", () => {
  it("should have correct SESSION_COOKIE name", () => {
    expect(SESSION_COOKIE).toBe("uns_session");
  });

  it("should validate allowed roles", () => {
    expect(isValidRole("pelajar")).toBe(true);
    expect(isValidRole("pengajar")).toBe(true);
  });

  it("should reject invalid roles or undefined values", () => {
    expect(isValidRole("admin")).toBe(false);
    expect(isValidRole("guest")).toBe(false);
    expect(isValidRole("")).toBe(false);
    expect(isValidRole(undefined)).toBe(false);
  });
});
