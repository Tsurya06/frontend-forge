import { describe, it, expect } from "vitest";
import {
  allQuestions,
  allCodingProblems as codingProblems,
  allSystemDesignProblems as systemDesignProblems,
  allMachineCodingProblems as machineCodingProblems,
} from "@/data";

describe("Cross-Application Search & Filter Integrity", () => {
  describe("Topics & Questions Filtering", () => {
    it("filters questions by search query case-insensitively", () => {
      const query = "closures";
      const results = allQuestions.filter(
        (q) =>
          q.question.toLowerCase().includes(query.toLowerCase()) ||
          q.shortAnswer.toLowerCase().includes(query.toLowerCase()) ||
          q.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())),
      );

      expect(results.length).toBeGreaterThan(0);
      expect(
        results.every(
          (q) =>
            q.question.toLowerCase().includes("closure") ||
            q.shortAnswer.toLowerCase().includes("closure") ||
            q.tags.some((t) => t.includes("closure")),
        ),
      ).toBe(true);
    });

    it("filters questions by category", () => {
      const category = "JavaScript";
      const jsQuestions = allQuestions.filter((q) => q.category === category);
      expect(jsQuestions.length).toBeGreaterThan(50);
      expect(jsQuestions.every((q) => q.category === "JavaScript")).toBe(true);
    });

    it("filters questions by difficulty level", () => {
      const beginners = allQuestions.filter((q) => q.difficulty === "Beginner");
      const intermediate = allQuestions.filter((q) => q.difficulty === "Intermediate");
      const advanced = allQuestions.filter((q) => q.difficulty === "Advanced");

      expect(beginners.length).toBeGreaterThan(0);
      expect(intermediate.length).toBeGreaterThan(0);
      expect(advanced.length).toBeGreaterThan(0);
    });
  });

  describe("Coding Problems Search & Filtering", () => {
    it("contains valid coding problems with all required fields", () => {
      expect(codingProblems.length).toBeGreaterThan(10);
      for (const p of codingProblems) {
        expect(p.id).toBeTruthy();
        expect(p.title).toBeTruthy();
        expect(p.difficulty).toMatch(/^(Beginner|Intermediate|Advanced|Senior)$/);
        expect(p.category).toBeTruthy();
        expect(p.implementation).toBeTruthy();
        expect(Array.isArray(p.examples)).toBe(true);
      }
    });

    it("filters coding problems by search query", () => {
      const query = "debounce";
      const filtered = codingProblems.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query),
      );
      expect(filtered.length).toBeGreaterThanOrEqual(1);
      expect(filtered[0]?.title.toLowerCase()).toContain("debounce");
    });
  });

  describe("System Design & Machine Coding Filtering", () => {
    it("filters system design problems by difficulty", () => {
      expect(systemDesignProblems.length).toBeGreaterThan(5);
      const advanced = systemDesignProblems.filter(
        (p) => p.difficulty === "Advanced",
      );
      expect(advanced.length).toBeGreaterThan(0);
      expect(advanced.every((p) => p.difficulty === "Advanced")).toBe(true);
    });

    it("filters machine coding problems by category or query", () => {
      expect(machineCodingProblems.length).toBeGreaterThan(5);
      const reactProblems = machineCodingProblems.filter(
        (p) =>
          p.category.toLowerCase().includes("react") ||
          p.title.toLowerCase().includes("react") ||
          p.tags?.some((t) => t.toLowerCase().includes("react")),
      );
      expect(reactProblems.length).toBeGreaterThan(0);
    });
  });
});
