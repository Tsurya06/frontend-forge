import { describe, it, expect } from "vitest";
import {
  VISUALIZER_PRESETS,
  traceCustomCode,
} from "@/utils/runtimeVisualizerEngine";

describe("JavaScript Runtime Visualizer Engine", () => {
  it("all 5 presets have valid code and step sequences", () => {
    expect(VISUALIZER_PRESETS.length).toBe(5);

    for (const preset of VISUALIZER_PRESETS) {
      expect(preset.id).toBeTruthy();
      expect(preset.code.length).toBeGreaterThan(10);
      expect(preset.steps.length).toBeGreaterThan(3);

      for (const step of preset.steps) {
        expect(step.line).toBeGreaterThan(0);
        expect(step.explanation).toBeTruthy();
        expect(Array.isArray(step.callStack)).toBe(true);
        expect(Array.isArray(step.heap)).toBe(true);
        expect(Array.isArray(step.consoleLogs)).toBe(true);
      }
    }
  });

  it("traceCustomCode traces synchronous and asynchronous execution with accurate line numbers", () => {
    const userCode = `console.log("1: Start");
setTimeout(() => {
  console.log("2: Timeout 0ms");
}, 0);
Promise.resolve().then(() => {
  console.log("3: Microtask");
});
console.log("4: End");`;

    const steps = traceCustomCode(userCode);
    expect(steps.length).toBeGreaterThan(5);

    // Initial step
    expect(steps[0]?.line).toBe(1);

    // Check that microtask runs before macrotask
    const microDrainStep = steps.find(
      (s) => s.eventLoopStatus === "draining-microtask",
    );
    expect(microDrainStep).toBeDefined();
    expect(microDrainStep?.line).toBe(6); // Line 6 contains console.log("3: Microtask")

    // Check that macrotask runs after microtask
    const macroDrainStep = steps.find(
      (s) => s.eventLoopStatus === "pulling-macrotask",
    );
    expect(macroDrainStep).toBeDefined();
    expect(macroDrainStep?.line).toBe(3); // Line 3 contains setTimeout callback

    // Check console logs progression
    const finalStep = steps[steps.length - 1];
    expect(finalStep?.consoleLogs).toEqual([
      "1: Start",
      "4: End",
      "3: Microtask",
      "2: Timeout 0ms",
    ]);
  });

  it("traceCustomCode allocates heap objects and binds pointers to stack", () => {
    const code = `let user = { name: "Alice", role: "Frontend" };
console.log("User initialized");`;

    const steps = traceCustomCode(code);
    const allocStep = steps.find((s) => s.heap.length > 0);
    expect(allocStep).toBeDefined();
    expect(allocStep?.heap[0]?.properties).toEqual(
      expect.arrayContaining([
        { key: "name", value: '"Alice"' },
        { key: "role", value: '"Frontend"' },
      ]),
    );
    expect(allocStep?.callStack[0]?.variables[0]?.heapRef).toBeTruthy();
  });
});
