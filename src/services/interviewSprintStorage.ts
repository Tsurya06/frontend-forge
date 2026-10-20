import { STORAGE_KEYS } from "@/constants/storage";
import type {
  SprintProgressState,
  DayProgress,
  MockInterviewResult,
} from "@/data/interviewSprint/types";

const CURRENT_SCHEMA_VERSION = 1;

export function getInitialSprintProgress(): SprintProgressState {
  const initialDays: Record<number, DayProgress> = {};
  for (let day = 1; day <= 7; day++) {
    initialDays[day] = {
      day,
      completed: false,
      needsRevision: false,
    };
  }

  return {
    version: CURRENT_SCHEMA_VERSION,
    currentDay: 1,
    dayProgress: initialDays,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Validates and safely parses sprint progress from localStorage.
 * Handles schema migration, corrupt JSON, or malformed data cleanly.
 */
export function loadSprintProgress(): SprintProgressState {
  if (typeof window === "undefined") {
    return getInitialSprintProgress();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INTERVIEW_SPRINT_PROGRESS);
    if (!raw) {
      return getInitialSprintProgress();
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return getInitialSprintProgress();
    }

    // Version migration handling
    const version = typeof parsed.version === "number" ? parsed.version : 1;
    const currentDay = typeof parsed.currentDay === "number" && parsed.currentDay >= 1 && parsed.currentDay <= 7
      ? parsed.currentDay
      : 1;

    const base = getInitialSprintProgress();
    const dayProgress: Record<number, DayProgress> = { ...base.dayProgress };

    if (parsed.dayProgress && typeof parsed.dayProgress === "object") {
      for (let day = 1; day <= 7; day++) {
        const item = parsed.dayProgress[day] || parsed.dayProgress[String(day)];
        if (item && typeof item === "object") {
          dayProgress[day] = {
            day,
            completed: Boolean(item.completed),
            needsRevision: Boolean(item.needsRevision),
            quizScore: typeof item.quizScore === "number" ? Math.max(0, Math.min(100, item.quizScore)) : undefined,
            quizAnswered: item.quizAnswered && typeof item.quizAnswered === "object" ? item.quizAnswered : undefined,
            exerciseAttempted: Boolean(item.exerciseAttempted),
            exerciseCompleted: Boolean(item.exerciseCompleted),
            lastPracticedAt: typeof item.lastPracticedAt === "string" ? item.lastPracticedAt : undefined,
          };
        }
      }
    }

    let mockResult: MockInterviewResult | undefined = undefined;
    if (parsed.mockResult && typeof parsed.mockResult === "object") {
      mockResult = {
        completedAt: String(parsed.mockResult.completedAt || new Date().toISOString()),
        scorePercentage: Number(parsed.mockResult.scorePercentage) || 0,
        timeSpentSeconds: Number(parsed.mockResult.timeSpentSeconds) || 0,
        passedCount: Number(parsed.mockResult.passedCount) || 0,
        totalCount: Number(parsed.mockResult.totalCount) || 0,
        weakTopics: Array.isArray(parsed.mockResult.weakTopics) ? parsed.mockResult.weakTopics : [],
      };
    }

    return {
      version,
      currentDay,
      dayProgress,
      mockResult,
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
    };
  } catch {
    // Malformed JSON fallback
    return getInitialSprintProgress();
  }
}

/**
 * Persists sprint progress to localStorage safely.
 */
export function saveSprintProgress(state: SprintProgressState): void {
  if (typeof window === "undefined") return;
  try {
    const payload = {
      ...state,
      version: CURRENT_SCHEMA_VERSION,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.INTERVIEW_SPRINT_PROGRESS, JSON.stringify(payload));
    window.dispatchEvent(new Event("feeq-sprint-progress-changed"));
  } catch {
    // Ignore quota issues
  }
}

/**
 * Updates a single day's progress.
 */
export function updateDayProgress(
  day: number,
  updater: (prev: DayProgress) => DayProgress
): SprintProgressState {
  const current = loadSprintProgress();
  const existingDay = current.dayProgress[day] || {
    day,
    completed: false,
    needsRevision: false,
  };

  const updatedDay = updater(existingDay);
  updatedDay.lastPracticedAt = new Date().toISOString();

  // If completing current day, advance currentDay to next uncompleted day
  let nextCurrentDay = current.currentDay;
  if (updatedDay.completed && day === current.currentDay) {
    for (let d = 1; d <= 7; d++) {
      if (d === day) continue;
      if (!current.dayProgress[d]?.completed) {
        nextCurrentDay = d;
        break;
      }
    }
  }

  const nextState: SprintProgressState = {
    ...current,
    currentDay: nextCurrentDay,
    dayProgress: {
      ...current.dayProgress,
      [day]: updatedDay,
    },
  };

  saveSprintProgress(nextState);
  return nextState;
}

/**
 * Record mock interview result
 */
export function saveMockInterviewResult(result: MockInterviewResult): SprintProgressState {
  const current = loadSprintProgress();
  const nextState: SprintProgressState = {
    ...current,
    mockResult: result,
    dayProgress: {
      ...current.dayProgress,
      7: {
        ...(current.dayProgress[7] || { day: 7, completed: false, needsRevision: false }),
        completed: true,
        lastPracticedAt: new Date().toISOString(),
      },
    },
  };
  saveSprintProgress(nextState);
  return nextState;
}

/**
 * Reset all sprint progress
 */
export function resetSprintProgress(): SprintProgressState {
  const fresh = getInitialSprintProgress();
  saveSprintProgress(fresh);
  return fresh;
}
