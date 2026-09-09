import { describe, it, expect } from "vitest";
import {
  buildReactIframeSrc,
  buildHtmlIframeSrc,
} from "@/components/playground/playgroundRunner";
import { SNIPPETS } from "@/components/playground/templates";
import vm from "node:vm";

function assertValidScriptSyntax(html: string) {
  const scriptMatch = html.match(/<script>\s*(\(function\(\)[\s\S]*?\)\(\);)\s*<\/script>/);
  expect(scriptMatch).not.toBeNull();
  const scriptCode = scriptMatch![1];
  expect(() => {
    new vm.Script(scriptCode);
  }).not.toThrow();
}

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
      expect(result.html).toContain("exports.default = TestCounter");
      expect(result.html).toContain("ReactDOM.createRoot");
      assertValidScriptSyntax(result.html);
    });

    it("compiles component with destructured typed props without syntax error", () => {
      const tsx = `
        import React, { useState, useCallback } from "react";

        interface Props {
          totalStars?: number;
          defaultValue?: number;
          label?: string;
        }

        export default function StarRating({
          totalStars = 5,
          defaultValue = 0,
          label = "Rating",
        }: Props) {
          const [rating, setRating] = useState(defaultValue);
          return (
            <div aria-label={label}>
              {Array.from({ length: totalStars }, (_, i) => (
                <button key={i} onClick={() => setRating(i + 1)}>
                  {i < rating ? "★" : "☆"}
                </button>
              ))}
            </div>
          );
        }
      `;

      const result = buildReactIframeSrc(tsx);
      expect(result.error).toBeUndefined();
      expect(result.html).not.toContain("Unexpected identifier 'window'");
      assertValidScriptSyntax(result.html);
    });

    it("supports class components, arrow functions, and side-effect imports", () => {
      const classTsx = `
        import React from "react";
        import "./theme.css";
        import { Heart } from "lucide-react";

        export default class CounterClass extends React.Component {
          render() {
            return <div><Heart /> Hello</div>;
          }
        }
      `;
      const resultClass = buildReactIframeSrc(classTsx);
      expect(resultClass.error).toBeUndefined();
      assertValidScriptSyntax(resultClass.html);

      const arrowTsx = `
        import React from "react";
        const ArrowComp = () => <div>Arrow</div>;
        export default ArrowComp;
      `;
      const resultArrow = buildReactIframeSrc(arrowTsx);
      expect(resultArrow.error).toBeUndefined();
      assertValidScriptSyntax(resultArrow.html);
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
      assertValidScriptSyntax(result.html);
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

    it("all React templates compile without error and have valid script syntax", () => {
      const reactTemplates = SNIPPETS.filter(
        (t) => t.language === "react",
      );

      for (const tpl of reactTemplates) {
        const compiled = buildReactIframeSrc(tpl.code);
        expect(
          compiled.error,
          `Template "${tpl.name}" failed to compile: ${compiled.error}`,
        ).toBeUndefined();
        assertValidScriptSyntax(compiled.html);
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


import { MONACO_THEMES, registerMonacoThemes, configureMonacoLanguages } from "@/pages/playground/monacoThemes";
import { THEMES, DEFAULT_HTML_CODE, DEFAULT_REACT_CODE } from "@/components/playground/templates";

describe("Monaco Themes & Language Configuration", () => {
  it("defines distinct themes for all theme dropdown choices", () => {
    const definedThemeKeys = Object.keys(MONACO_THEMES);
    // Every theme option (except auto) should have a defined theme in MONACO_THEMES
    for (const opt of THEMES) {
      if (opt.id === "auto") continue;
      expect(definedThemeKeys).toContain(opt.id);
    }
  });

  it("ensures each theme has rich syntax token colors for keywords, types, functions, strings, and tags", () => {
    for (const [themeName, themeDef] of Object.entries(MONACO_THEMES)) {
      expect(themeDef.rules.length).toBeGreaterThanOrEqual(10);
      const tokenMap = new Map(themeDef.rules.map((r) => [r.token, r.foreground]));

      expect(tokenMap.has("keyword"), `${themeName} missing keyword token`).toBe(true);
      expect(tokenMap.has("string"), `${themeName} missing string token`).toBe(true);
      expect(tokenMap.has("function"), `${themeName} missing function token`).toBe(true);
      expect(tokenMap.has("type"), `${themeName} missing type token`).toBe(true);
      expect(tokenMap.has("tag"), `${themeName} missing tag token`).toBe(true);

      // Verify colors are distinct and not all identical
      const colors = new Set(themeDef.rules.map((r) => r.foreground).filter(Boolean));
      expect(colors.size).toBeGreaterThan(4);
    }
  });

  it("registerMonacoThemes and configureMonacoLanguages execute successfully", () => {
    const definedThemes: Record<string, unknown> = {};
    let tsCompilerOptions: Record<string, unknown> = {};
    
    const mockMonaco = {
      editor: {
        defineTheme: (name: string, theme: unknown) => {
          definedThemes[name] = theme;
        },
      },
      languages: {
        typescript: {
          ScriptTarget: { ES2022: 9 },
          JsxEmit: { ReactJSX: 4 },
          ModuleResolutionKind: { NodeJs: 2 },
          typescriptDefaults: {
            setCompilerOptions: (opts: Record<string, unknown>) => {
              tsCompilerOptions = opts;
            },
            setDiagnosticsOptions: () => {},
          },
          javascriptDefaults: {
            setCompilerOptions: () => {},
            setDiagnosticsOptions: () => {},
          },
        },
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    registerMonacoThemes(mockMonaco as any);
    expect(Object.keys(definedThemes)).toEqual(Object.keys(MONACO_THEMES));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    configureMonacoLanguages(mockMonaco as any);
    expect(tsCompilerOptions.jsx).toBe(4); // ReactJSX
  });
});


describe("HTML/CSS Live Component Template Behavior", () => {
  it("ensures interactive card disables button and guards click events when toggle is off", () => {
    const src = DEFAULT_HTML_CODE;
    expect(src).toContain(".btn:disabled");
    expect(src).toContain("btn.disabled = !isEnabled");
    expect(src).toContain("if (!toggle.checked)");
  });
});


describe("Language Mode Isolation", () => {
  it("compiles CounterApp as React bundle and not raw HTML", () => {
    const result = buildReactIframeSrc(DEFAULT_REACT_CODE);
    expect(result.error).toBeUndefined();
    expect(result.html).toContain("ReactDOM.createRoot");
    expect(result.html).not.toContain("CounterApp() { const [count");
  });
});
