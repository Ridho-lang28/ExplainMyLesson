import { describe, expect, it } from "vitest";

// Logic unit gamifikasi & kuis adaptif
function calculateQuizScore(level: 1 | 2 | 3, isCorrect: boolean): number {
  if (!isCorrect) return 0;
  switch (level) {
    case 1:
      return 10;
    case 2:
      return 20;
    case 3:
      return 30;
  }
}

function isNextLevelUnlocked(
  _currentLevel: 1 | 2 | 3,
  score: number,
  maxPossible: number
): boolean {
  const percentage = (score / maxPossible) * 100;
  return percentage >= 60;
}

function evaluateRemedialStatus(scorePercent: number): {
  needsRemedial: boolean;
  recommendation: string | null;
} {
  if (scorePercent < 60) {
    return {
      needsRemedial: true,
      recommendation: "Pelajari ulang materi, ringkasan esensial, dan analogi modul ini.",
    };
  }
  return {
    needsRemedial: false,
    recommendation: null,
  };
}

describe("Adaptive Quiz & Gamification Logic (FR-11, FR-12, FR-13, FR-14, FR-17)", () => {
  describe("Point Calculation Rules", () => {
    it("Level 1 (Mudah): +10 Poin jika benar (FR-11, TC-14)", () => {
      expect(calculateQuizScore(1, true)).toBe(10);
      expect(calculateQuizScore(1, false)).toBe(0);
    });

    it("Level 2 (Sedang): +20 Poin jika benar (FR-12, TC-15)", () => {
      expect(calculateQuizScore(2, true)).toBe(20);
      expect(calculateQuizScore(2, false)).toBe(0);
    });

    it("Level 3 (Sulit): +30 Poin jika benar (FR-13, TC-16)", () => {
      expect(calculateQuizScore(3, true)).toBe(30);
      expect(calculateQuizScore(3, false)).toBe(0);
    });
  });

  describe("Adaptive Progression & Level Unlocking", () => {
    it("should unlock Level 2 only when Level 1 score >= 60%", () => {
      expect(isNextLevelUnlocked(1, 30, 50)).toBe(true); // 60%
      expect(isNextLevelUnlocked(1, 40, 50)).toBe(true); // 80%
      expect(isNextLevelUnlocked(1, 20, 50)).toBe(false); // 40% (locked)
    });

    it("should unlock Level 3 only when Level 2 score >= 60%", () => {
      expect(isNextLevelUnlocked(2, 60, 100)).toBe(true);
      expect(isNextLevelUnlocked(2, 50, 100)).toBe(false);
    });
  });

  describe("Remedial Triggering (FR-17, TC-18)", () => {
    it("should trigger remedial recommendation if score < 60%", () => {
      const evaluation = evaluateRemedialStatus(55);
      expect(evaluation.needsRemedial).toBe(true);
      expect(evaluation.recommendation).toContain("Pelajari ulang materi");
    });

    it("should not trigger remedial recommendation if score >= 60%", () => {
      const evaluation = evaluateRemedialStatus(75);
      expect(evaluation.needsRemedial).toBe(false);
      expect(evaluation.recommendation).toBeNull();
    });
  });
});
