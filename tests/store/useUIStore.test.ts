import { beforeEach, describe, expect, it } from "vitest";
import { useUIStore } from "../../src/lib/store/useUIStore";

describe("useUIStore Zustand Client State Management (Bab 6)", () => {
  beforeEach(() => {
    useUIStore.setState({
      isUploadModalOpen: false,
      uploadModalVariant: "private",
      themeMode: "light",
      quizDraft: { selectedOption: null, showHint: false },
      totalPoints: 420,
      isProfileModalOpen: false,
      isClassModalOpen: false,
    });
  });

  it("manages upload modal state and variants", () => {
    expect(useUIStore.getState().isUploadModalOpen).toBe(false);

    useUIStore.getState().openUploadModal("public");
    expect(useUIStore.getState().isUploadModalOpen).toBe(true);
    expect(useUIStore.getState().uploadModalVariant).toBe("public");

    useUIStore.getState().closeUploadModal();
    expect(useUIStore.getState().isUploadModalOpen).toBe(false);
  });

  it("toggles theme mode between light and dark", () => {
    expect(useUIStore.getState().themeMode).toBe("light");

    useUIStore.getState().toggleTheme();
    expect(useUIStore.getState().themeMode).toBe("dark");

    useUIStore.getState().toggleTheme();
    expect(useUIStore.getState().themeMode).toBe("light");
  });

  it("manages quiz draft options, hints, and resets", () => {
    expect(useUIStore.getState().quizDraft.selectedOption).toBeNull();
    expect(useUIStore.getState().quizDraft.showHint).toBe(false);

    useUIStore.getState().setQuizSelectedOption(2);
    expect(useUIStore.getState().quizDraft.selectedOption).toBe(2);

    useUIStore.getState().setQuizShowHint(true);
    expect(useUIStore.getState().quizDraft.showHint).toBe(true);

    useUIStore.getState().resetQuizDraft();
    expect(useUIStore.getState().quizDraft.selectedOption).toBeNull();
    expect(useUIStore.getState().quizDraft.showHint).toBe(false);
  });

  it("accumulates gamification totalPoints", () => {
    expect(useUIStore.getState().totalPoints).toBe(420);

    useUIStore.getState().addPoints(30);
    expect(useUIStore.getState().totalPoints).toBe(450);

    useUIStore.getState().addPoints(10);
    expect(useUIStore.getState().totalPoints).toBe(460);
  });

  it("manages profile modal open/close states", () => {
    expect(useUIStore.getState().isProfileModalOpen).toBe(false);

    useUIStore.getState().openProfileModal();
    expect(useUIStore.getState().isProfileModalOpen).toBe(true);

    useUIStore.getState().closeProfileModal();
    expect(useUIStore.getState().isProfileModalOpen).toBe(false);
  });

  it("manages class management modal open/close states", () => {
    expect(useUIStore.getState().isClassModalOpen).toBe(false);

    useUIStore.getState().openClassModal();
    expect(useUIStore.getState().isClassModalOpen).toBe(true);

    useUIStore.getState().closeClassModal();
    expect(useUIStore.getState().isClassModalOpen).toBe(false);
  });
});
