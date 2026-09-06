
import { describe, it, expect } from "vitest";
import { evaluateProblem } from "@/utils/codeRunner";
import { allCodingProblems } from "@/data";

describe("Audit All 32 Coding Problems Evaluation", () => {
  for (const problem of allCodingProblems) {
    it(`evaluates ${problem.id} properly`, async () => {
      // 1. Reference implementation should pass
      const validResult = await evaluateProblem(problem.implementation, problem.examples);
      if (validResult.status !== "accepted") {
        console.error(`FAILED REFERENCE: ${problem.id}`, validResult.failedCase, validResult.errorMessage);
      }
      expect(validResult.status, `Problem ${problem.id} reference implementation must pass`).toBe("accepted");

      // 2. Dummy empty string implementation must fail
      const dummyCode = `function ${problem.id.replace(/-/g, "_")}() { return ""; }`;
      const dummyResult = await evaluateProblem(dummyCode, problem.examples);
      expect(dummyResult.status, `Problem ${problem.id} dummy code must fail`).not.toBe("accepted");
    });
  }
});
