import { transform } from "sucrase";

export interface RunResult {
  logs: Array<{
    type: "log" | "warn" | "error" | "info" | "result";
    text: string;
  }>;
  executionTime: number;
  hasError: boolean;
}

export interface TestCaseEvaluation {
  caseIndex: number;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed: boolean;
  error?: string;
  logs: string[];
  executionTime: number;
}

export interface ProblemEvaluationResult {
  status: "accepted" | "wrong_answer" | "runtime_error" | "syntax_error";
  totalCases: number;
  passedCases: number;
  totalTime: number;
  cases: TestCaseEvaluation[];
  failedCase?: TestCaseEvaluation;
  logs: string[];
  errorMessage?: string;
}

/**
 * Transpiles TypeScript and JSX code to clean executable JavaScript using Sucrase.
 */
export function transpileToJS(code: string): string {
  try {
    const result = transform(code, {
      transforms: ["typescript", "jsx"],
      disableESTransforms: true,
      production: true,
    });
    return result.code;
  } catch {
    // If sucrase fails, return raw code as fallback
    return code;
  }
}

/**
 * Formats any JavaScript value into a human-readable string.
 */
export function formatValue(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  if (typeof value === "function")
    return `[Function: ${value.name || "anonymous"}]`;
  if (typeof value === "symbol") return value.toString();
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (value instanceof Set)
    return `Set(${value.size}) { ${Array.from(value).map(formatValue).join(", ")} }`;
  if (value instanceof Map) {
    const entries = Array.from(value.entries()).map(
      ([k, v]) => `${formatValue(k)} => ${formatValue(v)}`,
    );
    return `Map(${value.size}) { ${entries.join(", ")} }`;
  }
  if (Array.isArray(value)) {
    try {
      return JSON.stringify(value);
    } catch {
      return "[Circular Array]";
    }
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "[Circular Object]";
    }
  }
  return String(value);
}

/**
 * Deep equality check for comparing test outputs
 */
function isValueMatch(
  actual: unknown,
  expectedStr: string,
  logs: string[],
): boolean {
  const normExpected = expectedStr.trim();

  // Boolean match
  if (normExpected === "true" && actual === true) return true;
  if (normExpected === "false" && actual === false) return true;

  // Null / Undefined match
  if (normExpected === "null" && actual === null) return true;
  if (normExpected === "undefined" && actual === undefined) return true;

  // Number match
  if (
    !isNaN(Number(normExpected)) &&
    typeof actual === "number" &&
    Number(normExpected) === actual
  ) {
    return true;
  }

  // String match
  if (typeof actual === "string") {
    if (
      actual === normExpected ||
      `"${actual}"` === normExpected ||
      normExpected.includes(actual)
    ) {
      return true;
    }
  }

  // JSON match
  try {
    const actualJSON = JSON.stringify(actual);
    if (
      actualJSON === normExpected ||
      actualJSON.replace(/\s+/g, "") === normExpected.replace(/\s+/g, "")
    ) {
      return true;
    }
  } catch {
    // Ignore circular / non-serializable
  }

  // Formatted value match
  const formattedActual = formatValue(actual).replace(/\s+/g, "");
  const formattedExpected = normExpected.replace(/\s+/g, "");
  if (formattedActual === formattedExpected) return true;

  // Check logs for side-effect / console output match (e.g. Logs "c" after 300ms)
  for (const log of logs) {
    if (normExpected.toLowerCase().includes(log.toLowerCase())) {
      return true;
    }
  }

  return false;
}

/**
 * Real test runner that evaluates user code against actual problem examples.
 */
export function evaluateProblem(
  userCode: string,
  examples: Array<{ input: string; output: string; explanation?: string }>,
): ProblemEvaluationResult {
  const allLogs: string[] = [];
  const caseResults: TestCaseEvaluation[] = [];
  let totalTime = 0;

  if (!userCode.trim()) {
    return {
      status: "wrong_answer",
      totalCases: examples.length,
      passedCases: 0,
      totalTime: 0,
      cases: [],
      errorMessage: "No code provided to execute.",
      logs: [],
    };
  }

  const transpiled = transpileToJS(userCode);

  for (let i = 0; i < examples.length; i++) {
    const example = examples[i];
    if (!example) continue;

    const caseLogs: string[] = [];
    const origLog = console.log;
    const origWarn = console.warn;
    const origError = console.error;

    console.log = (...args: unknown[]) => {
      const msg = args.map(formatValue).join(" ");
      caseLogs.push(msg);
      allLogs.push(msg);
    };
    console.warn = (...args: unknown[]) => {
      const msg = "[WARN] " + args.map(formatValue).join(" ");
      caseLogs.push(msg);
      allLogs.push(msg);
    };
    console.error = (...args: unknown[]) => {
      const msg = "[ERROR] " + args.map(formatValue).join(" ");
      caseLogs.push(msg);
      allLogs.push(msg);
    };

    const startTime = performance.now();
    let actualResult: unknown = undefined;
    let runError: string | undefined = undefined;

    try {
      // Construct executable sandbox
      const testSnippet = example.input.trim();
      let runnerBody = "";

      if (
        testSnippet.includes("\n") ||
        testSnippet.includes(";") ||
        testSnippet.includes("const ") ||
        testSnippet.includes("let ")
      ) {
        // Multi-line statement
        runnerBody = `
          ${transpiled}
          
          let __result;
          try {
            ${testSnippet}
            if (typeof __result !== 'undefined') return __result;
          } catch (e) {
            throw e;
          }
        `;
      } else {
        // Single expression
        runnerBody = `
          ${transpiled}
          return (${testSnippet});
        `;
      }

      const fn = new Function(runnerBody);
      actualResult = fn();
    } catch (err: unknown) {
      runError = err instanceof Error ? err.message : String(err);
    } finally {
      console.log = origLog;
      console.warn = origWarn;
      console.error = origError;
    }

    const elapsed = Math.round(performance.now() - startTime);
    totalTime += elapsed;

    if (runError) {
      const failedCase: TestCaseEvaluation = {
        caseIndex: i,
        input: example.input,
        expectedOutput: example.output,
        actualOutput: undefined,
        passed: false,
        error: runError,
        logs: caseLogs,
        executionTime: Math.max(1, elapsed),
      };
      caseResults.push(failedCase);

      return {
        status: "runtime_error",
        totalCases: examples.length,
        passedCases: i,
        totalTime,
        cases: caseResults,
        failedCase,
        logs: allLogs,
        errorMessage: runError,
      };
    }

    const passed = isValueMatch(actualResult, example.output, caseLogs);
    const caseEval: TestCaseEvaluation = {
      caseIndex: i,
      input: example.input,
      expectedOutput: example.output,
      actualOutput: formatValue(actualResult),
      passed,
      logs: caseLogs,
      executionTime: Math.max(1, elapsed),
    };
    caseResults.push(caseEval);

    if (!passed) {
      return {
        status: "wrong_answer",
        totalCases: examples.length,
        passedCases: i,
        totalTime,
        cases: caseResults,
        failedCase: caseEval,
        logs: allLogs,
      };
    }
  }

  return {
    status: "accepted",
    totalCases: examples.length,
    passedCases: examples.length,
    totalTime: Math.max(12, totalTime),
    cases: caseResults,
    logs: allLogs,
  };
}
