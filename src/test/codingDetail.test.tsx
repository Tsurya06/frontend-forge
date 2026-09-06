import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  generateStarterCode,
  isHtmlCssProblem,
  getStorageCode,
  saveStorageCode,
  removeStorageCode,
  getStorageSubmissions,
  saveStorageSubmissions,
} from "@/components/codingDetail/codingDetailUtils";
import { evaluateProblem } from "@/utils/codeRunner";
import { highlightTextProblem, mergeObjectsProblem, camelCaseKeysProblem } from "@/data/coding";
import type { CodingProblem } from "@/types";

describe("Coding Detail Utilities & Submission Engine", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("generateStarterCode", () => {
    it("generates HTML/CSS starter template for HTML/CSS problems", () => {
      const htmlProblem: CodingProblem = {
        id: "center-div",
        title: "Center a Div",
        difficulty: "Beginner",
        category: "HTML & CSS",
        problem: "Center a div vertically and horizontally",
        tags: ["css", "layout"],
        requirements: ["Center a div"],
        edgeCases: [],
        examples: [],
        optimalApproach: "Use CSS flexbox or grid",
        stepByStep: ["Set display flex", "justify-content center", "align-items center"],
        timeComplexity: "O(1)",
        spaceComplexity: "O(1)",
        implementation: `<div class="box">Center me</div>`,
      };

      expect(isHtmlCssProblem(htmlProblem)).toBe(true);
      const starter = generateStarterCode(htmlProblem);
      expect(starter).toContain("<!-- Write your implementation for Center a Div below -->");
      expect(starter).toContain("<div class=\"container\">");
      expect(starter).toContain("<style>");
    });

    it("generates JS starter function with correct signature from problem implementation", () => {
      const jsProblem: CodingProblem = {
        id: "debounce",
        title: "Debounce Function",
        difficulty: "Intermediate",
        category: "JavaScript",
        problem: "Implement a debounce function",
        tags: ["javascript", "async"],
        requirements: ["Debounce calls"],
        edgeCases: [],
        examples: [],
        optimalApproach: "Use closure with setTimeout timer",
        stepByStep: ["Return debounced wrapper", "Clear previous timeout", "Set new timeout"],
        timeComplexity: "O(1)",
        spaceComplexity: "O(1)",
        implementation: `function debounce(fn, delay) {\n  let timer;\n  return (...args) => {};\n}`,
      };

      expect(isHtmlCssProblem(jsProblem)).toBe(false);
      const starter = generateStarterCode(jsProblem);
      expect(starter).toContain("function debounce(fn, delay) {");
      expect(starter).toContain("// Write your solution here");
    });

    it("correctly identifies main function when helper functions precede it in implementation", () => {
      const highlightStarter = generateStarterCode(highlightTextProblem);
      expect(highlightStarter).toContain("function highlightText(text, searchTerm) {");
      expect(highlightStarter).not.toContain("function escapeRegExp(string) {");

      const mergeStarter = generateStarterCode(mergeObjectsProblem);
      expect(mergeStarter).toContain("function deepMerge(target, source) {");
      expect(mergeStarter).not.toContain("function isPlainObject(val) {");

      const camelStarter = generateStarterCode(camelCaseKeysProblem);
      expect(camelStarter).toContain("function camelCaseKeys(input) {");
    });

  });

  describe("Local Storage Persistence for Code & Submissions", () => {
    it("saves and retrieves user problem code", () => {
      const problemId = "two-sum";
      const code = "function twoSum() { return [0, 1]; }";
      saveStorageCode(problemId, code);
      expect(getStorageCode(problemId, "default")).toBe(code);

      removeStorageCode(problemId);
      expect(getStorageCode(problemId, "default")).toBe("default");
    });

    it("saves and retrieves user submissions", () => {
      const problemId = "two-sum";
      const submissions = [
        {
          id: "sub-1",
          timestamp: "10:00:00 AM",
          status: "accepted" as const,
          passedCases: 2,
          totalCases: 2,
          runtimeMs: 15,
          codeSnippet: "function twoSum() {}",
        },
      ];

      saveStorageSubmissions(problemId, submissions);
      const retrieved = getStorageSubmissions(problemId);
      expect(retrieved).toHaveLength(1);
      expect(retrieved[0]?.status).toBe("accepted");
      expect(retrieved[0]?.passedCases).toBe(2);
    });

    it("handles storage write failures gracefully without throwing", () => {
      const setItemSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });
      expect(() => saveStorageCode("test-id", "code")).not.toThrow();
      expect(() => saveStorageSubmissions("test-id", [])).not.toThrow();
      setItemSpy.mockRestore();
    });
  });

  describe("evaluateProblem Execution Engine", () => {
    const twoSumExamples = [
      {
        input: "twoSum([2, 7, 11, 15], 9)",
        output: "[0, 1]",
      },
      {
        input: "twoSum([3, 2, 4], 6)",
        output: "[1, 2]",
      },
    ];

    it("returns 'wrong_answer' when empty code is provided", async () => {
      const result = await evaluateProblem("", twoSumExamples);
      expect(result.status).toBe("wrong_answer");
      expect(result.passedCases).toBe(0);
      expect(result.errorMessage).toContain("No code provided");
    });

    it("returns 'accepted' when code passes all test cases", async () => {
      const code = `
        function twoSum(nums, target) {
          const map = new Map();
          for (let i = 0; i < nums.length; i++) {
            const diff = target - nums[i];
            if (map.has(diff)) return [map.get(diff), i];
            map.set(nums[i], i);
          }
          return [];
        }
      `;
      const result = await evaluateProblem(code, twoSumExamples);
      expect(result.status).toBe("accepted");
      expect(result.passedCases).toBe(2);
      expect(result.totalCases).toBe(2);
      expect(result.cases).toHaveLength(2);
      expect(result.cases[0]?.passed).toBe(true);
      expect(result.cases[1]?.passed).toBe(true);
    });

    it("returns 'wrong_answer' when code produces wrong output", async () => {
      const code = `
        function twoSum(nums, target) {
          return [0, 0];
        }
      `;
      const result = await evaluateProblem(code, twoSumExamples);
      expect(result.status).toBe("wrong_answer");
      expect(result.failedCase).toBeDefined();
      expect(result.failedCase?.passed).toBe(false);
    });

    it("returns 'runtime_error' when code throws exception during execution", async () => {
      const code = `
        function twoSum(nums, target) {
          throw new Error("IndexOutOfBounds");
        }
      `;
      const result = await evaluateProblem(code, twoSumExamples);
      expect(result.status).toBe("runtime_error");
      expect(result.errorMessage).toContain("IndexOutOfBounds");
    });

    it("captures console logs accurately during test runs", async () => {
      const code = `
        function twoSum(nums, target) {
          console.log("Checking nums:", nums.length);
          console.warn("Looking for target:", target);
          return [0, 1];
        }
      `;
      const result = await evaluateProblem(code, [twoSumExamples[0]!]);
      expect(result.logs.some((l) => l.includes("Checking nums") && l.includes("4"))).toBe(true);
      expect(result.logs.some((l) => l.includes("[WARN]") && l.includes("Looking for target"))).toBe(true);
    });

    it("safely aborts infinite loops and returns 'runtime_error' without freezing", async () => {
      const code = `
        function twoSum(nums, target) {
          while (true) {}
          return [0, 1];
        }
      `;
      const result = await evaluateProblem(code, twoSumExamples);
      expect(result.status).toBe("runtime_error");
      expect(result.errorMessage).toMatch(/Time Limit Exceeded/i);
    });
  });

  describe("CodingDetailHeader Run vs Submit Distinction", () => {
    it("distinguishes Run and Submit button clicks cleanly", async () => {
      const { CodingDetailHeader } = await import("@/components/codingDetail/CodingDetailHeader");
      const { render, screen, fireEvent } = await import("@testing-library/react");
      const { MemoryRouter } = await import("react-router-dom");

      const onRunMock = vi.fn();
      const onSubmitMock = vi.fn();

      const sampleProblem = {
        id: "test-prob",
        title: "Test Problem",
        difficulty: "Beginner" as const,
        category: "Coding",
        problem: "test",
        tags: [],
        requirements: [],
        edgeCases: [],
        examples: [],
        optimalApproach: "",
        implementation: "",
        timeComplexity: "",
        spaceComplexity: "",
        stepByStep: [],
      };

      render(
        <MemoryRouter>
          <CodingDetailHeader
            problem={sampleProblem}
            prevProblem={null}
            nextProblem={null}
            isRunning={false}
            isHtmlCss={false}
            completed={false}
            bookmarked={false}
            passCount={0}
            failCount={0}
            hasSubmissions={false}
            onRun={onRunMock}
            onSubmit={onSubmitMock}
            onPrev={vi.fn()}
            onNext={vi.fn()}
            onRandom={vi.fn()}
            onToggleBookmark={vi.fn()}
          />
        </MemoryRouter>
      );

      const runBtn = screen.getByRole("button", { name: /^Run$/i });
      const submitBtn = screen.getByRole("button", { name: /^Submit$/i });

      // Click Run -> should call onRunMock ONLY
      fireEvent.click(runBtn);
      expect(onRunMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).not.toHaveBeenCalled();

      // Click Submit -> should call onSubmitMock ONLY
      fireEvent.click(submitBtn);
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onRunMock).toHaveBeenCalledTimes(1);
    });
  });

});
