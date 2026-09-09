
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

describe("HTML/CSS Problem Validator", () => {
  it("accepts correct Holy Grail implementation", async () => {
    const { evaluateHtmlCssProblem } = await import("../utils/codeRunner");
    const validators = [
      { check: "display: grid", label: "Uses CSS Grid" },
      { check: "grid-template-areas", label: "Defines grid-template-areas" },
      { check: "<header", label: "Has header element" },
      { check: "<main", label: "Has main element" },
      { check: "@media", label: "Has media query" },
    ];

    const goodCode = `<header>Header</header>
<main>Content</main>
<footer>Footer</footer>
<style>
.holy-grail {
  display: grid;
  grid-template-areas: "header" "main" "footer";
  grid-template-columns: 1fr;
}
@media (min-width: 768px) {
  .holy-grail { grid-template-columns: 220px 1fr 200px; }
}
</style>`;

    const result = evaluateHtmlCssProblem(goodCode, validators);
    expect(result.status).toBe("accepted");
    expect(result.passedCases).toBe(validators.length);
  });

  it("rejects incomplete HTML/CSS with wrong_answer", async () => {
    const { evaluateHtmlCssProblem } = await import("../utils/codeRunner");
    const validators = [
      { check: "display: grid", label: "Uses CSS Grid" },
      { check: "grid-template-areas", label: "Defines grid-template-areas" },
      { check: "<header", label: "Has header element" },
    ];

    const badCode = `<div>just a div</div><style>.foo { color: red; }</style>`;
    const result = evaluateHtmlCssProblem(badCode, validators);
    expect(result.status).toBe("wrong_answer");
    expect(result.passedCases).toBeLessThan(validators.length);
  });

  it("rejects empty code", async () => {
    const { evaluateHtmlCssProblem } = await import("../utils/codeRunner");
    const result = evaluateHtmlCssProblem("", [
      { check: "display: grid", label: "Grid" },
    ]);
    expect(result.status).toBe("wrong_answer");
    expect(result.passedCases).toBe(0);
  });
});
