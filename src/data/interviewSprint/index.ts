import { day1Lesson } from "./day1";
import { day2Lesson } from "./day2";
import { day3Lesson } from "./day3";
import { day4Lesson } from "./day4";
import { day5Lesson } from "./day5";
import { day6Lesson } from "./day6";
import { day7Lesson, day7MockScenarios, type MockScenario } from "./day7";
import type { SprintDayLesson } from "./types";

export * from "./types";
export { day7MockScenarios, type MockScenario };

export const allSprintDays: SprintDayLesson[] = [
  day1Lesson,
  day2Lesson,
  day3Lesson,
  day4Lesson,
  day5Lesson,
  day6Lesson,
  day7Lesson,
];

export function getSprintDay(day: number): SprintDayLesson | undefined {
  return allSprintDays.find((d) => d.day === day);
}

export function getSprintDayById(id: string): SprintDayLesson | undefined {
  return allSprintDays.find((d) => d.id === id);
}
