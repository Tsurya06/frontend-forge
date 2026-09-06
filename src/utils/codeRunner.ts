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
 * Deep structural equality check that is key-order independent.
 */
function deepStructuralEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (typeof a === "number" && typeof b === "number") {
    if (isNaN(a) && isNaN(b)) return true;
    return Math.abs(a - b) < 1e-9;
  }

  if (
    a === null ||
    b === null ||
    typeof a !== "object" ||
    typeof b !== "object"
  ) {
    return false;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepStructuralEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;
  const aKeys = Object.keys(aObj);
  const bKeys = Object.keys(bObj);

  if (aKeys.length !== bKeys.length) return false;

  for (const k of aKeys) {
    if (!Object.prototype.hasOwnProperty.call(bObj, k)) return false;
    if (!deepStructuralEqual(aObj[k], bObj[k])) return false;
  }

  return true;
}

/**
 * Deep equality check for comparing test outputs
 */
function unquote(str: string): string {
  const trimmed = str.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith("`") && trimmed.endsWith("`"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseExpectedObject(str: string): unknown {
  try {
    return JSON.parse(str);
  } catch {}
  try {
    return new Function("return (" + str + ")")();
  } catch {}
  return undefined;
}

/**
 * Robust equality check for comparing test outputs.
 * Enforces strict equality (NEVER loose normExpected.includes(actual)).
 */
function isValueMatch(
  actual: unknown,
  expectedStr: string,
  logs: string[],
): boolean {
  const normExpected = expectedStr.trim();
  const unquotedExpected = unquote(normExpected);

  // Null / Undefined match
  if (normExpected === "null" && actual === null) return true;
  if (normExpected === "undefined" && actual === undefined) return true;

  // Boolean match
  if (normExpected === "true" && actual === true) return true;
  if (normExpected === "false" && actual === false) return true;

  // Number match
  if (
    !isNaN(Number(normExpected)) &&
    typeof actual === "number" &&
    (Number(normExpected) === actual || Math.abs(Number(normExpected) - actual) < 1e-9)
  ) {
    return true;
  }

  // String match (STRICT: exact match only)
  if (typeof actual === "string") {
    if (
      actual === normExpected ||
      actual === unquotedExpected ||
      `"${actual}"` === normExpected ||
      `'${actual}'` === normExpected
    ) {
      return true;
    }
  }

  // Deep Structural JSON & Object match (key-order independent)
  if (typeof actual === "object" && actual !== null) {
    const parsedExpected = parseExpectedObject(normExpected) ?? parseExpectedObject(unquotedExpected);
    if (parsedExpected !== undefined && deepStructuralEqual(actual, parsedExpected)) {
      return true;
    }

    try {
      const actualJSON = JSON.stringify(actual);
      if (
        actualJSON === normExpected ||
        actualJSON === unquotedExpected ||
        actualJSON.replace(/\s+/g, "") === normExpected.replace(/\s+/g, "") ||
        actualJSON.replace(/\s+/g, "") === unquotedExpected.replace(/\s+/g, "")
      ) {
        return true;
      }
    } catch {}
  }

  // Formatted value match (only if non-empty unless expected is empty)
  const formattedActual = formatValue(actual).replace(/\s+/g, "");
  const formattedExpected = normExpected.replace(/\s+/g, "");
  const formattedUnquoted = unquotedExpected.replace(/\s+/g, "");
  if (
    formattedActual.length > 0 &&
    (formattedActual === formattedExpected || formattedActual === formattedUnquoted)
  ) {
    return true;
  }

  // Exact console log match
  if (logs.length > 0) {
    const joinedLogs = logs.join("\n").trim();
    if (
      joinedLogs === normExpected ||
      joinedLogs === unquotedExpected ||
      joinedLogs.replace(/\s+/g, "") === normExpected.replace(/\s+/g, "") ||
      joinedLogs.replace(/\s+/g, "") === unquotedExpected.replace(/\s+/g, "")
    ) {
      return true;
    }
  }

  return false;
}

function skipString(code: string, start: number): number {
  const quote = code[start];
  let i = start + 1;
  while (i < code.length) {
    if (code[i] === "\\" && i + 1 < code.length) {
      i += 2;
      continue;
    }
    if (code[i] === quote) return i + 1;
    i++;
  }
  return i;
}

function skipComment(code: string, start: number): number {
  if (code[start + 1] === "/") {
    const nextLine = code.indexOf("\n", start);
    return nextLine === -1 ? code.length : nextLine;
  }
  if (code[start + 1] === "*") {
    const end = code.indexOf("*/", start + 2);
    return end === -1 ? code.length : end + 2;
  }
  return start + 1;
}

function findMatchingParen(code: string, openIndex: number): number {
  let depth = 1;
  let i = openIndex + 1;
  while (i < code.length && depth > 0) {
    const ch = code[i];
    if (ch === '"' || ch === "'" || ch === "`") {
      i = skipString(code, i);
      continue;
    }
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    i++;
  }
  return depth === 0 ? i : -1;
}

function skipWhitespace(code: string, start: number): number {
  let i = start;
  while (i < code.length && /\s/.test(code[i] ?? "")) {
    i++;
  }
  return i;
}

function tryHandleLoop(
  code: string,
  i: number,
): { output: string; nextIndex: number } | null {
  const isDo = code.startsWith("do", i) && !/[a-zA-Z0-9_$]/.test(code[i + 2] ?? "");
  if (isDo) {
    const afterDo = skipWhitespace(code, i + 2);
    if (code[afterDo] === "{") {
      return {
        output: code.slice(i, afterDo + 1) + " __checkTimeout(); ",
        nextIndex: afterDo + 1,
      };
    }
    return null;
  }

  const isFor = code.startsWith("for", i) && !/[a-zA-Z0-9_$]/.test(code[i + 3] ?? "");
  const isWhile = code.startsWith("while", i) && !/[a-zA-Z0-9_$]/.test(code[i + 5] ?? "");

  if (isFor || isWhile) {
    const keywordLen = isFor ? 3 : 5;
    const openParen = code.indexOf("(", i + keywordLen);
    if (openParen === -1) return null;

    const closeParen = findMatchingParen(code, openParen);
    if (closeParen === -1) return null;

    const afterParen = skipWhitespace(code, closeParen);
    if (code[afterParen] === "{") {
      return {
        output: code.slice(i, afterParen + 1) + " __checkTimeout(); ",
        nextIndex: afterParen + 1,
      };
    }
  }

  return null;
}

/**
 * Injects a loop timeout guard into loop bodies to prevent synchronous UI freezes from infinite loops.
 */
export function protectInfiniteLoops(code: string): string {
  let result = "";
  let i = 0;

  while (i < code.length) {
    const ch = code[i] ?? "";

    if (ch === '"' || ch === "'" || ch === "`") {
      const next = skipString(code, i);
      result += code.slice(i, next);
      i = next;
      continue;
    }

    if (ch === "/" && (code[i + 1] === "/" || code[i + 1] === "*")) {
      const next = skipComment(code, i);
      result += code.slice(i, next);
      i = next;
      continue;
    }

    const prevChar = i > 0 ? (code[i - 1] ?? " ") : " ";
    const isBoundary = !/[a-zA-Z0-9_$]/.test(prevChar);

    if (isBoundary) {
      const loopMatch = tryHandleLoop(code, i);
      if (loopMatch) {
        result += loopMatch.output;
        i = loopMatch.nextIndex;
        continue;
      }
    }

    result += ch;
    i++;
  }

  return result;
}

/**
 * Real test runner that evaluates user code against actual problem examples.
 */
function prepareSnippet(snippet: string): string {
  const trimmed = snippet.trim().replace(/;+$/, "");
  
  const lines = trimmed.split("\n");
  const lastLine = (lines[lines.length - 1] ?? "").replace(/\/\/.*$/, "").trim().replace(/;+$/, "");

  // If the last line already starts with return, leave it as is
  if (/^return\b/.test(lastLine)) {
    return trimmed;
  }

  // Try wrapping the whole snippet as an expression in an async context
  try {
    new Function("return (async () => { return (" + trimmed + "); })");
    return "return (" + trimmed + ");";
  } catch {}

  // Multi-statement snippet: find the last expression statement to return
  for (let i = lines.length - 1; i >= 0; i--) {
    const clean = (lines[i] ?? "").replace(/\/\/.*$/, "").trim().replace(/;+$/, "");
    if (!clean) continue;
    if (/^(?:const|let|var|if|for|while|function|class|try|catch|switch|import|export)\b/.test(clean)) {
      break;
    }
    const lastExpr = lines.slice(i).join("\n").replace(/\/\/.*$/, "").trim().replace(/;+$/, "");
    const candidate = lines.slice(0, i).join("\n") + "\nreturn (" + lastExpr + ");";
    try {
      new Function("return (async () => { " + candidate + " })");
      return candidate;
    } catch {}
  }
  return trimmed;
}

export async function evaluateProblem(
  userCode: string,
  examples: Array<{ input: string; output: string; explanation?: string }>,
): Promise<ProblemEvaluationResult> {
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
  const guardedCode = protectInfiniteLoops(transpiled);

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
      // Construct executable sandbox with iteration timeout protection
      const testSnippet = example.input.trim();
      const timeoutPreamble = `
        const __startTime = performance.now();
        let __iterCount = 0;
        function __checkTimeout() {
          if (++__iterCount % 5000 === 0 && performance.now() - __startTime > 1500) {
            throw new Error("Time Limit Exceeded: Execution took longer than 1500ms");
          }
          if (__iterCount > 2000000) {
            throw new Error("Time Limit Exceeded: Loop iteration limit exceeded (2,000,000 iterations)");
          }
        }
      `;

      const preparedSnippet = prepareSnippet(testSnippet);
      const runnerBody = `
        ${timeoutPreamble}
        ${guardedCode}
        
        return (async () => {
          try {
            ${preparedSnippet}
          } catch (e) {
            throw e;
          }
        })();
      `;

      const fn = new Function(runnerBody);
      actualResult = await fn();
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

/**
 * Executes a standalone JavaScript snippet safely in a sandboxed Function scope,
 * intercepting console logs, warnings, errors, and async results.
 */
export async function executeSnippet(
  code: string,
  timeoutMs: number = 2500,
): Promise<RunResult> {
  const logs: Array<{
    type: "log" | "warn" | "error" | "info" | "result";
    text: string;
  }> = [];
  const startTime = performance.now();
  let hasError = false;

  const appendLog = (
    type: "log" | "warn" | "error" | "info" | "result",
    ...args: unknown[]
  ) => {
    logs.push({
      type,
      text: args.map(formatValue).join(" "),
    });
  };

  const sandboxConsole = {
    log: (...args: unknown[]) => appendLog("log", ...args),
    warn: (...args: unknown[]) => appendLog("warn", ...args),
    error: (...args: unknown[]) => appendLog("error", ...args),
    info: (...args: unknown[]) => appendLog("info", ...args),
    clear: () => {
      logs.length = 0;
    },
    table: (...args: unknown[]) => appendLog("log", ...args),
  };

  const activeTimers: number[] = [];
  const sandboxSetTimeout = (handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
    const id = window.setTimeout(() => {
      if (typeof handler === "function") {
        try {
          handler(...args);
        } catch (err: unknown) {
          hasError = true;
          appendLog("error", `Async Error: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    }, timeout);
    activeTimers.push(id);
    return id;
  };

  const sandboxSetInterval = (handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
    const id = window.setInterval(() => {
      if (typeof handler === "function") {
        try {
          handler(...args);
        } catch (err: unknown) {
          hasError = true;
          appendLog("error", `Interval Error: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    }, timeout);
    activeTimers.push(id);
    return id;
  };

  try {
    const jsExecutable = transpileToJS(code);
    const runner = new Function(
      "console",
      "setTimeout",
      "setInterval",
      "clearTimeout",
      "clearInterval",
      "Promise",
      `
      return (async () => {
        ${jsExecutable}
      })();
      `,
    );

    const execPromise = runner(
      sandboxConsole,
      sandboxSetTimeout,
      sandboxSetInterval,
      window.clearTimeout.bind(window),
      window.clearInterval.bind(window),
      Promise,
    );

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Execution timed out after ${timeoutMs}ms`)), timeoutMs);
    });

    const result = await Promise.race([execPromise, timeoutPromise]);
    if (result !== undefined) {
      appendLog("result", result);
    }
    await new Promise((resolve) => setTimeout(resolve, 30));
  } catch (err: unknown) {
    hasError = true;
    appendLog(
      "error",
      `Runtime / Syntax Error: ${err instanceof Error ? err.message : String(err)}`,
    );
  } finally {
    for (const id of activeTimers) {
      window.clearTimeout(id);
      window.clearInterval(id);
    }
  }

  return {
    logs,
    executionTime: Math.round(performance.now() - startTime),
    hasError,
  };
}
