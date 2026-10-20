import { describe, it, expect } from "vitest";
import { machineCodingProblems } from "@/data/machine-coding";
import { buildReactIframeSrc } from "@/components/playground/playgroundRunner";
import vm from "node:vm";

describe("Machine Coding Problems Live Preview Audit", () => {
  for (const prob of machineCodingProblems) {
    it(`compiles and has valid syntax for ${prob.id} (${prob.title})`, () => {
      expect(prob.implementation).toBeDefined();
      const { html, error } = buildReactIframeSrc(prob.implementation);
      expect(error, `Failed to compile ${prob.id}: ${error}`).toBeUndefined();
      expect(html).toContain("<!DOCTYPE html>");

      // Extract the executable script block
      const scriptMatch = html.match(/<script>\s*(\(function\(\)[\s\S]*?\)\(\);)\s*<\/script>/);
      expect(scriptMatch, `Should contain an execution script for ${prob.id}`).not.toBeNull();
      
      const scriptCode = scriptMatch![1] || "";
      // Parsing with vm.Script checks for SyntaxErrors (like unexpected identifier window)
      expect(() => {
        new vm.Script(scriptCode, { filename: `${prob.id}.js` });
      }).not.toThrow();
    });
  }
});
