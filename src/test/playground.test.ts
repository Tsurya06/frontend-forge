import { describe, it, expect } from "vitest";
import {
  buildReactIframeSrc,
  buildHtmlIframeSrc,
} from "@/components/playground/playgroundRunner";
import { SNIPPETS } from "@/components/playground/templates";

describe("Playground Runner & Templates Engine", () => {
  describe("buildReactIframeSrc", () => {
    it("compiles valid React component with TypeScript/JSX into an iframe bundle", () => {
      const tsx = `
        import React, { useState } from "react";

        export default function TestCounter() {
          const [count, setCount] = useState<number>(0);
          return (
            <button onClick={() => setCount(count + 1)}>
              Count: {count}
            </button>
          );
        }
      `;

      const result = buildReactIframeSrc(tsx);
      expect(result.error).toBeUndefined();
      expect(result.html).toContain("<!DOCTYPE html>");
      expect(result.html).toContain("react.development.js");
      expect(result.html).toContain("window.__defaultComponent = TestCounter;");
      expect(result.html).toContain("ReactDOM.createRoot");
    });

    it("handles JSX compilation errors gracefully and returns error object", () => {
      const brokenTsx = `
        export default function Broken() {
          return <div>Unclosed tag
        }
      `;

      const result = buildReactIframeSrc(brokenTsx);
      expect(result.error).toBeDefined();
      expect(result.html).toContain("JSX / TSX Compilation Error");
    });

    it("intercepts console.log calls and dispatches feeq-log postMessages", () => {
      const code = `export default function App() { return <div>Hi</div>; }`;
      const result = buildReactIframeSrc(code);
      expect(result.html).toContain("feeq-log");
      expect(result.html).toContain("window.parent.postMessage");
    });
  });

  describe("buildHtmlIframeSrc", () => {
    it("wraps HTML snippets and injects console messenger", () => {
      const htmlSnippet = `<div class="card"><h1>Hello HTML</h1></div>`;
      const result = buildHtmlIframeSrc(htmlSnippet);
      expect(result).toContain("<!DOCTYPE html>");
      expect(result).toContain(htmlSnippet);
      expect(result).toContain("feeq-log");
    });

    it("automatically wraps pure CSS into a live demo canvas", () => {
      const cssSnippet = `
        .button-pulse {
          background: #3b82f6;
          animation: pulse 2s infinite;
        }
      `;
      const result = buildHtmlIframeSrc(cssSnippet);
      expect(result).toContain("demo-canvas");
      expect(result).toContain(".button-pulse");
      expect(result).toContain("demo-card-box");
    });
  });

  describe("Built-in Playground Templates Integrity", () => {
    it("contains all required snippets", () => {
      expect(SNIPPETS.length).toBeGreaterThanOrEqual(6);
      const names = SNIPPETS.map((t) => t.name.toLowerCase());
      expect(names.some((n) => n.includes("tic-tac-toe"))).toBe(true);
      expect(names.some((n) => n.includes("todo"))).toBe(true);
      expect(names.some((n) => n.includes("debounce"))).toBe(true);
      expect(names.some((n) => n.includes("holy grail"))).toBe(true);
    });

    it("all React templates compile without error", () => {
      const reactTemplates = SNIPPETS.filter(
        (t) => t.language === "react",
      );

      for (const tpl of reactTemplates) {
        const compiled = buildReactIframeSrc(tpl.code);
        expect(
          compiled.error,
          `Template "${tpl.name}" failed to compile: ${compiled.error}`,
        ).toBeUndefined();
      }
    });

    it("all HTML templates generate valid iframe sources", () => {
      const htmlTemplates = SNIPPETS.filter(
        (t) => t.language === "html",
      );

      for (const tpl of htmlTemplates) {
        const src = buildHtmlIframeSrc(tpl.code);
        expect(src).toContain("<!DOCTYPE html>");
      }
    });
  });
});
