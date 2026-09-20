import { describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import {
  registerUserAccount,
  verifyUserCredentials,
} from "../../server/data";

describe("Security Controls & Authentication (NFR-01, TC-01, TC-02, TC-03, TC-05)", () => {
  describe("Bcrypt Password Hashing", () => {
    it("should securely hash plaintext password and verify match", () => {
      const password = "mySecretPassword2026";
      const saltRounds = 10;
      const hash = bcrypt.hashSync(password, saltRounds);

      expect(hash).not.toBe(password);
      expect(bcrypt.compareSync(password, hash)).toBe(true);
      expect(bcrypt.compareSync("wrongPassword", hash)).toBe(false);
    });
  });

  describe("User Credential Verification (TC-01, TC-02, TC-03)", () => {
    it("TC-01: should successfully verify existing demo accounts with valid password", async () => {
      const user = await verifyUserCredentials("ghandur@student.uns.ac.id", "secret123");
      expect(user).toBeDefined();
      expect(user.role).toBe("pelajar");
      expect(user.email).toBe("ghandur@student.uns.ac.id");
    });

    it("TC-02: should throw error on invalid password", async () => {
      await expect(
        verifyUserCredentials("ghandur@student.uns.ac.id", "wrongPassword")
      ).rejects.toThrow("Email atau kata sandi tidak valid");
    });

    it("TC-03: should throw error on unregistered email", async () => {
      await expect(
        verifyUserCredentials("unknown_user_999@uns.ac.id", "secret123")
      ).rejects.toThrow("Akun tidak ditemukan");
    });
  });

  describe("Duplicate Email Prevention (TC-05)", () => {
    it("TC-05: should reject registration if email is already registered", async () => {
      await expect(
        registerUserAccount({
          name: "Test Duplicate",
          email: "ghandur@student.uns.ac.id", // email sudah ada di usersDb
          password: "password123",
          role: "pelajar",
        })
      ).rejects.toThrow("Email sudah terdaftar");
    });
  });
});
