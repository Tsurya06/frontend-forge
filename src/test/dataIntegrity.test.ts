import { describe, it, expect } from "vitest";
import {
  allTopics,
  allQuestions,
  allCodingProblems,
  allMachineCodingProblems,
  allSystemDesignProblems,
  categories,
} from "../data";

describe("Data Integrity & Coverage Verification", () => {
  it("should have all 35 machine coding problems populated with required fields", () => {
    expect(allMachineCodingProblems.length).toBe(35);

    allMachineCodingProblems.forEach((problem) => {
      expect(problem.id).toBeDefined();
      expect(problem.title).toBeTruthy();
      expect(problem.problemStatement).toBeTruthy();
      expect(problem.functionalRequirements.length).toBeGreaterThan(0);
      expect(problem.nonFunctionalRequirements.length).toBeGreaterThan(0);
      expect(problem.componentHierarchy).toBeTruthy();
      expect(problem.stateDesign).toBeTruthy();
      expect(problem.architecture).toBeTruthy();
      expect(problem.implementation).toBeTruthy();
      expect(problem.accessibility).toBeTruthy();
      expect(problem.performance).toBeTruthy();
      expect(problem.edgeCases.length).toBeGreaterThan(0);
      expect(problem.testingStrategy.length).toBeGreaterThan(0);
      expect(problem.improvements.length).toBeGreaterThan(0);
      expect(problem.followUpQuestions.length).toBeGreaterThan(0);
    });
  });

  it("should have all coding problems populated with required fields", () => {
    expect(allCodingProblems.length).toBeGreaterThanOrEqual(33); // 33 core JS algorithm polyfills + HTML/CSS layout challenges

    allCodingProblems.forEach((problem) => {
      expect(problem.id).toBeDefined();
      expect(problem.title).toBeTruthy();
      expect(problem.problem).toBeTruthy();
      expect(problem.requirements.length).toBeGreaterThan(0);
      expect(problem.examples.length).toBeGreaterThan(0);
      expect(problem.edgeCases.length).toBeGreaterThan(0);
      expect(problem.optimalApproach).toBeTruthy();
      expect(problem.implementation).toBeTruthy();
      expect(problem.timeComplexity).toBeTruthy();
      expect(problem.spaceComplexity).toBeTruthy();
    });
  });

  it("should have all 9 system design problems populated with full architecture", () => {
    expect(allSystemDesignProblems.length).toBe(9);

    allSystemDesignProblems.forEach((problem) => {
      expect(problem.id).toBeDefined();
      expect(problem.title).toBeTruthy();
      expect(problem.requirements).toBeTruthy();
      expect(problem.highLevelArchitecture).toBeTruthy();
      expect(problem.componentArchitecture).toBeTruthy();
      expect(problem.stateManagement).toBeTruthy();
      expect(problem.apiDesign).toBeTruthy();
      expect(problem.caching).toBeTruthy();
      expect(problem.performance).toBeTruthy();
      expect(problem.security).toBeTruthy();
      expect(problem.accessibility).toBeTruthy();
      expect(problem.errorHandling).toBeTruthy();
      expect(problem.offlineStrategy).toBeTruthy();
      expect(problem.scalability).toBeTruthy();
      expect(problem.tradeoffs).toBeTruthy();
    });
  });

  it("should have all curriculum categories initialized with valid topics and questions", () => {
    expect(categories.length).toBeGreaterThanOrEqual(11);
    expect(allTopics.length).toBeGreaterThan(50);
    expect(allQuestions.length).toBeGreaterThan(400);

    allQuestions.forEach((q) => {
      expect(q.id).toBeTruthy();
      expect(q.question).toBeTruthy();
      expect(q.answer).toBeTruthy();
      expect(q.shortAnswer).toBeTruthy();
      expect(q.difficulty).toBeDefined();
      expect(q.type).toBeDefined();
      expect(q.category).toBeTruthy();
    });
  });

  it("should have unique IDs across all entities to prevent key collisions", () => {
    const topicIds = new Set<string>();
    allTopics.forEach((t) => {
      expect(topicIds.has(t.id)).toBe(false);
      topicIds.add(t.id);
    });

    const questionIds = new Set<string>();
    allQuestions.forEach((q) => {
      expect(questionIds.has(q.id)).toBe(false);
      questionIds.add(q.id);
    });

    const codingIds = new Set<string>();
    allCodingProblems.forEach((c) => {
      expect(codingIds.has(c.id)).toBe(false);
      codingIds.add(c.id);
    });

    const mcIds = new Set<string>();
    allMachineCodingProblems.forEach((m) => {
      expect(mcIds.has(m.id)).toBe(false);
      mcIds.add(m.id);
    });
  });
});
