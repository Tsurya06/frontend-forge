import { describe, it, expect, beforeEach } from "vitest";
import { allSprintDays, getSprintDay, getSprintDayById } from "@/data/interviewSprint";
import {
  loadSprintProgress,
  saveSprintProgress,
  updateDayProgress,
  saveMockInterviewResult,
  resetSprintProgress,
  getInitialSprintProgress,
} from "@/services/interviewSprintStorage";
import { STORAGE_KEYS } from "@/constants/storage";

describe("7-Day Interview Sprint Curriculum", () => {
  it("contains exactly 7 consecutive days", () => {
    expect(allSprintDays).toHaveLength(7);
    allSprintDays.forEach((day, idx) => {
      expect(day.day).toBe(idx + 1);
      expect(day.id).toBeTruthy();
      expect(day.title).toBeTruthy();
      expect(day.sections.length).toBeGreaterThan(0);
      expect(day.questions.length).toBeGreaterThan(0);
      expect(day.quiz.length).toBeGreaterThan(0);
    });
  });

  it("retrieves each day by number and by ID", () => {
    for (let d = 1; d <= 7; d++) {
      const day = getSprintDay(d);
      expect(day?.day).toBe(d);
      expect(getSprintDayById(day!.id)?.day).toBe(d);
    }
  });
});

describe("Interview Sprint Progress Persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loads initial defaults and saves custom progress", () => {
    const initial = getInitialSprintProgress();
    expect(initial.version).toBe(1);
    expect(initial.currentDay).toBe(1);

    initial.currentDay = 3;
    saveSprintProgress(initial);
    expect(loadSprintProgress().currentDay).toBe(3);
  });

  it("updates day progress and advances day", () => {
    updateDayProgress(1, (prev) => ({ ...prev, completed: true }));
    const loaded = loadSprintProgress();
    expect(loaded.dayProgress[1]?.completed).toBe(true);
    expect(loaded.currentDay).toBe(2);
  });

  it("records mock interview results and resets cleanly", () => {
    saveMockInterviewResult({
      completedAt: new Date().toISOString(),
      scorePercentage: 90,
      timeSpentSeconds: 1800,
      passedCount: 9,
      totalCount: 10,
      weakTopics: [],
    });
    expect(loadSprintProgress().mockResult?.scorePercentage).toBe(90);

    resetSprintProgress();
    expect(loadSprintProgress().currentDay).toBe(1);
  });

  it("recovers gracefully from corrupted storage", () => {
    localStorage.setItem(STORAGE_KEYS.INTERVIEW_SPRINT_PROGRESS, "invalid_json");
    expect(loadSprintProgress().currentDay).toBe(1);

    localStorage.setItem(STORAGE_KEYS.INTERVIEW_SPRINT_PROGRESS, JSON.stringify("not-an-object"));
    expect(loadSprintProgress().version).toBe(1);
  });
});
