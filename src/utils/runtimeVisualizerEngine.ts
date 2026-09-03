export interface CallVariable {
  name: string;
  type: "number" | "string" | "boolean" | "object-ref" | "function";
  value: string;
  heapRef?: string;
}

export interface CallFrame {
  id: string;
  name: string;
  line: number;
  variables: CallVariable[];
}

export interface HeapProperty {
  key: string;
  value: string;
  isRef?: boolean;
  refAddress?: string;
}

export interface HeapObject {
  address: string;
  label: string;
  type: "object" | "array" | "closure" | "function";
  properties: HeapProperty[];
  isMarked?: boolean;
  isCollecting?: boolean;
}

export interface WebApiTask {
  id: string;
  type: "timer" | "fetch" | "microtask-dispatch";
  label: string;
  duration: string;
  progress: number;
}

export interface QueueItem {
  id: string;
  label: string;
  source: string;
  isMicrotask: boolean;
}

export interface ExecutionStep {
  stepIndex: number;
  line: number;
  phase:
    | "executing"
    | "evaluating"
    | "webapi"
    | "microtask-queue"
    | "macrotask-queue"
    | "event-loop-drain"
    | "gc"
    | "done";
  eventLoopStatus:
    | "stack-running"
    | "checking-microtasks"
    | "draining-microtask"
    | "checking-macrotasks"
    | "pulling-macrotask"
    | "idle";
  explanation: string;
  callStack: CallFrame[];
  heap: HeapObject[];
  webApis: WebApiTask[];
  microtasks: QueueItem[];
  macrotasks: QueueItem[];
  consoleLogs: string[];
  highlightAddress?: string;
}

export interface VisualizerPreset {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  steps: ExecutionStep[];
  takeaway: string;
}

export const VISUALIZER_PRESETS: VisualizerPreset[] = [
  // ── PRESET 1: EVENT LOOP & QUEUES ──────────────────────────────────────
  {
    id: "event-loop",
    title: "Event Loop: Microtasks vs Macrotasks",
    subtitle:
      "Understand why Promises execute before setTimeout even with 0ms delay",
    code: `console.log("1: Script start");

setTimeout(() => {
  console.log("2: setTimeout (macrotask)");
}, 0);

Promise.resolve().then(() => {
  console.log("3: Promise.then (microtask 1)");
}).then(() => {
  console.log("4: Promise chained (microtask 2)");
});

queueMicrotask(() => {
  console.log("5: queueMicrotask (microtask 3)");
});

console.log("6: Script end");`,
    takeaway:
      "V8 Call Stack executes all synchronous code first. When the stack empties, the Event Loop drains the ENTIRE Microtask Queue (Promises, queueMicrotask) before picking even ONE Macrotask (setTimeout).",
    steps: [
      {
        stepIndex: 0,
        line: 1,
        phase: "executing",
        eventLoopStatus: "stack-running",
        explanation:
          "Global execution context is created on the Call Stack. V8 prepares to execute console.log('1: Script start') synchronously.",
        callStack: [
          {
            id: "main",
            name: "main()",
            line: 1,
            variables: [],
          },
        ],
        heap: [],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: [],
      },
      {
        stepIndex: 1,
        line: 1,
        phase: "executing",
        eventLoopStatus: "stack-running",
        explanation:
          "console.log('1: Script start') is pushed, executed, and immediately outputs to the console.",
        callStack: [
          { id: "main", name: "main()", line: 1, variables: [] },
          { id: "log-1", name: "console.log()", line: 1, variables: [] },
        ],
        heap: [],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: ["1: Script start"],
      },
      {
        stepIndex: 2,
        line: 3,
        phase: "webapi",
        eventLoopStatus: "stack-running",
        explanation:
          "setTimeout(..., 0) is called. The JS engine delegates the timer to the browser's Web APIs timer thread. It does NOT go to the task queue yet!",
        callStack: [
          { id: "main", name: "main()", line: 3, variables: [] },
          { id: "settimeout", name: "setTimeout()", line: 3, variables: [] },
        ],
        heap: [
          {
            address: "0x101",
            label: "TimerCallback()",
            type: "function",
            properties: [{ key: "target", value: "console.log(2)" }],
          },
        ],
        webApis: [
          {
            id: "timer-1",
            type: "timer",
            label: "setTimeout(cb, 0ms)",
            duration: "0ms",
            progress: 100,
          },
        ],
        microtasks: [],
        macrotasks: [],
        consoleLogs: ["1: Script start"],
      },
      {
        stepIndex: 3,
        line: 4,
        phase: "macrotask-queue",
        eventLoopStatus: "stack-running",
        explanation:
          "The 0ms timer expires immediately in the Web API thread. Its callback is moved into the Macrotask (Callback) Queue to await its turn.",
        callStack: [{ id: "main", name: "main()", line: 4, variables: [] }],
        heap: [
          {
            address: "0x101",
            label: "TimerCallback()",
            type: "function",
            properties: [{ key: "target", value: "console.log(2)" }],
          },
        ],
        webApis: [],
        microtasks: [],
        macrotasks: [
          {
            id: "macro-1",
            label: "TimerCallback()",
            source: "setTimeout 0ms",
            isMicrotask: false,
          },
        ],
        consoleLogs: ["1: Script start"],
      },
      {
        stepIndex: 4,
        line: 7,
        phase: "microtask-queue",
        eventLoopStatus: "stack-running",
        explanation:
          "Promise.resolve() is already resolved! Its .then() callback is immediately enqueued into the high-priority Microtask Queue.",
        callStack: [
          { id: "main", name: "main()", line: 7, variables: [] },
          { id: "promise", name: "Promise.then()", line: 7, variables: [] },
        ],
        heap: [
          {
            address: "0x101",
            label: "TimerCallback()",
            type: "function",
            properties: [{ key: "target", value: "console.log(2)" }],
          },
          {
            address: "0x102",
            label: "PromiseCallback1()",
            type: "function",
            properties: [{ key: "target", value: "console.log(3)" }],
          },
        ],
        webApis: [],
        microtasks: [
          {
            id: "micro-1",
            label: "PromiseCallback1()",
            source: "Promise.then",
            isMicrotask: true,
          },
        ],
        macrotasks: [
          {
            id: "macro-1",
            label: "TimerCallback()",
            source: "setTimeout 0ms",
            isMicrotask: false,
          },
        ],
        consoleLogs: ["1: Script start"],
      },
      {
        stepIndex: 5,
        line: 13,
        phase: "microtask-queue",
        eventLoopStatus: "stack-running",
        explanation:
          "queueMicrotask() explicitly schedules its callback directly into the Microtask Queue behind PromiseCallback1.",
        callStack: [
          { id: "main", name: "main()", line: 13, variables: [] },
          {
            id: "q-micro",
            name: "queueMicrotask()",
            line: 13,
            variables: [],
          },
        ],
        heap: [
          {
            address: "0x101",
            label: "TimerCallback()",
            type: "function",
            properties: [{ key: "target", value: "console.log(2)" }],
          },
          {
            address: "0x102",
            label: "PromiseCallback1()",
            type: "function",
            properties: [{ key: "target", value: "console.log(3)" }],
          },
          {
            address: "0x103",
            label: "MicrotaskCallback()",
            type: "function",
            properties: [{ key: "target", value: "console.log(5)" }],
          },
        ],
        webApis: [],
        microtasks: [
          {
            id: "micro-1",
            label: "PromiseCallback1()",
            source: "Promise.then",
            isMicrotask: true,
          },
          {
            id: "micro-2",
            label: "MicrotaskCallback()",
            source: "queueMicrotask",
            isMicrotask: true,
          },
        ],
        macrotasks: [
          {
            id: "macro-1",
            label: "TimerCallback()",
            source: "setTimeout 0ms",
            isMicrotask: false,
          },
        ],
        consoleLogs: ["1: Script start"],
      },
      {
        stepIndex: 6,
        line: 17,
        phase: "executing",
        eventLoopStatus: "stack-running",
        explanation:
          "console.log('6: Script end') executes synchronously. Note: Even though setTimeout has been ready, it CANNOT run yet!",
        callStack: [
          { id: "main", name: "main()", line: 17, variables: [] },
          { id: "log-6", name: "console.log()", line: 17, variables: [] },
        ],
        heap: [
          {
            address: "0x101",
            label: "TimerCallback()",
            type: "function",
            properties: [{ key: "target", value: "console.log(2)" }],
          },
          {
            address: "0x102",
            label: "PromiseCallback1()",
            type: "function",
            properties: [{ key: "target", value: "console.log(3)" }],
          },
          {
            address: "0x103",
            label: "MicrotaskCallback()",
            type: "function",
            properties: [{ key: "target", value: "console.log(5)" }],
          },
        ],
        webApis: [],
        microtasks: [
          {
            id: "micro-1",
            label: "PromiseCallback1()",
            source: "Promise.then",
            isMicrotask: true,
          },
          {
            id: "micro-2",
            label: "MicrotaskCallback()",
            source: "queueMicrotask",
            isMicrotask: true,
          },
        ],
        macrotasks: [
          {
            id: "macro-1",
            label: "TimerCallback()",
            source: "setTimeout 0ms",
            isMicrotask: false,
          },
        ],
        consoleLogs: ["1: Script start", "6: Script end"],
      },
      {
        stepIndex: 7,
        line: 17,
        phase: "event-loop-drain",
        eventLoopStatus: "checking-microtasks",
        explanation:
          "Call Stack is now completely EMPTY! The Event Loop checks the Microtask Queue first. It has 2 pending items. Microtasks ALWAYS take VIP priority.",
        callStack: [],
        heap: [
          {
            address: "0x101",
            label: "TimerCallback()",
            type: "function",
            properties: [{ key: "target", value: "console.log(2)" }],
          },
          {
            address: "0x102",
            label: "PromiseCallback1()",
            type: "function",
            properties: [{ key: "target", value: "console.log(3)" }],
          },
          {
            address: "0x103",
            label: "MicrotaskCallback()",
            type: "function",
            properties: [{ key: "target", value: "console.log(5)" }],
          },
        ],
        webApis: [],
        microtasks: [
          {
            id: "micro-1",
            label: "PromiseCallback1()",
            source: "Promise.then",
            isMicrotask: true,
          },
          {
            id: "micro-2",
            label: "MicrotaskCallback()",
            source: "queueMicrotask",
            isMicrotask: true,
          },
        ],
        macrotasks: [
          {
            id: "macro-1",
            label: "TimerCallback()",
            source: "setTimeout 0ms",
            isMicrotask: false,
          },
        ],
        consoleLogs: ["1: Script start", "6: Script end"],
      },
      {
        stepIndex: 8,
        line: 8,
        phase: "draining-microtasks" as any,
        eventLoopStatus: "draining-microtask",
        explanation:
          "PromiseCallback1() is pushed onto the Call Stack and logs '3: Promise.then'. It returns a new Promise, scheduling a chained .then()!",
        callStack: [
          {
            id: "cb-1",
            name: "PromiseCallback1()",
            line: 8,
            variables: [],
          },
        ],
        heap: [
          {
            address: "0x101",
            label: "TimerCallback()",
            type: "function",
            properties: [{ key: "target", value: "console.log(2)" }],
          },
          {
            address: "0x104",
            label: "ChainedPromiseCallback()",
            type: "function",
            properties: [{ key: "target", value: "console.log(4)" }],
          },
        ],
        webApis: [],
        microtasks: [
          {
            id: "micro-2",
            label: "MicrotaskCallback()",
            source: "queueMicrotask",
            isMicrotask: true,
          },
          {
            id: "micro-3",
            label: "ChainedPromiseCallback()",
            source: ".then() chained",
            isMicrotask: true,
          },
        ],
        macrotasks: [
          {
            id: "macro-1",
            label: "TimerCallback()",
            source: "setTimeout 0ms",
            isMicrotask: false,
          },
        ],
        consoleLogs: [
          "1: Script start",
          "6: Script end",
          "3: Promise.then (microtask 1)",
        ],
      },
      {
        stepIndex: 9,
        line: 14,
        phase: "draining-microtasks" as any,
        eventLoopStatus: "draining-microtask",
        explanation:
          "Next microtask MicrotaskCallback() runs from queueMicrotask. Outputs '5: queueMicrotask'.",
        callStack: [
          {
            id: "cb-2",
            name: "MicrotaskCallback()",
            line: 14,
            variables: [],
          },
        ],
        heap: [
          {
            address: "0x101",
            label: "TimerCallback()",
            type: "function",
            properties: [{ key: "target", value: "console.log(2)" }],
          },
          {
            address: "0x104",
            label: "ChainedPromiseCallback()",
            type: "function",
            properties: [{ key: "target", value: "console.log(4)" }],
          },
        ],
        webApis: [],
        microtasks: [
          {
            id: "micro-3",
            label: "ChainedPromiseCallback()",
            source: ".then() chained",
            isMicrotask: true,
          },
        ],
        macrotasks: [
          {
            id: "macro-1",
            label: "TimerCallback()",
            source: "setTimeout 0ms",
            isMicrotask: false,
          },
        ],
        consoleLogs: [
          "1: Script start",
          "6: Script end",
          "3: Promise.then (microtask 1)",
          "5: queueMicrotask (microtask 3)",
        ],
      },
      {
        stepIndex: 10,
        line: 10,
        phase: "draining-microtasks" as any,
        eventLoopStatus: "draining-microtask",
        explanation:
          "The chained Promise callback runs. Outputs '4: Promise chained'. Notice microtasks added DURING microtask execution are drained in the SAME tick!",
        callStack: [
          {
            id: "cb-3",
            name: "ChainedPromiseCallback()",
            line: 10,
            variables: [],
          },
        ],
        heap: [
          {
            address: "0x101",
            label: "TimerCallback()",
            type: "function",
            properties: [{ key: "target", value: "console.log(2)" }],
          },
        ],
        webApis: [],
        microtasks: [],
        macrotasks: [
          {
            id: "macro-1",
            label: "TimerCallback()",
            source: "setTimeout 0ms",
            isMicrotask: false,
          },
        ],
        consoleLogs: [
          "1: Script start",
          "6: Script end",
          "3: Promise.then (microtask 1)",
          "5: queueMicrotask (microtask 3)",
          "4: Promise chained (microtask 2)",
        ],
      },
      {
        stepIndex: 11,
        line: 4,
        phase: "macrotask-queue",
        eventLoopStatus: "pulling-macrotask",
        explanation:
          "Microtask Queue is now COMPLETELY empty! The Event Loop is finally permitted to pull ONE task from the Macrotask Queue: the setTimeout callback!",
        callStack: [
          {
            id: "timer-cb",
            name: "TimerCallback()",
            line: 4,
            variables: [],
          },
        ],
        heap: [],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: [
          "1: Script start",
          "6: Script end",
          "3: Promise.then (microtask 1)",
          "5: queueMicrotask (microtask 3)",
          "4: Promise chained (microtask 2)",
          "2: setTimeout (macrotask)",
        ],
      },
      {
        stepIndex: 12,
        line: 18,
        phase: "done",
        eventLoopStatus: "idle",
        explanation:
          "Execution complete! All stacks and queues are clear. The Event Loop returns to its low-power idle spin.",
        callStack: [],
        heap: [],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: [
          "1: Script start",
          "6: Script end",
          "3: Promise.then (microtask 1)",
          "5: queueMicrotask (microtask 3)",
          "4: Promise chained (microtask 2)",
          "2: setTimeout (macrotask)",
        ],
      },
    ],
  },

  // ── PRESET 2: MEMORY HEAP & PASS BY REFERENCE ─────────────────────────
  {
    id: "memory-allocation",
    title: "Memory Heap vs Stack: Reference Mutation",
    subtitle:
      "Visualize how primitives live on the Stack while Objects allocate on the Heap",
    code: `let age = 25;
let name = "Alex";

let userA = { name: "Alex", score: 10 };
let userB = userA; // Copy reference (0x10A)

userB.score = 99; // Mutates heap object directly!
console.log("userA.score:", userA.score);

let numbers = [1, 2, 3]; // Array allocated on heap (0x10B)
userA.stats = numbers;   // Heap-to-heap reference pointer`,
    takeaway:
      "Primitives (numbers, strings) are stored directly inside Call Stack frames by value. Objects and arrays allocate memory blocks in the Heap. Variables hold 64-bit pointers (memory addresses like 0x10A). Copying an object copies the pointer, not the data!",
    steps: [
      {
        stepIndex: 0,
        line: 1,
        phase: "executing",
        eventLoopStatus: "stack-running",
        explanation:
          "Executing line 1: `let age = 25`. Primitive number is allocated directly on the Call Stack frame.",
        callStack: [
          {
            id: "main",
            name: "Global Scope",
            line: 1,
            variables: [{ name: "age", type: "number", value: "25" }],
          },
        ],
        heap: [],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: [],
      },
      {
        stepIndex: 1,
        line: 2,
        phase: "executing",
        eventLoopStatus: "stack-running",
        explanation:
          "Executing line 2: `let name = 'Alex'`. Primitive string value is allocated on the Stack.",
        callStack: [
          {
            id: "main",
            name: "Global Scope",
            line: 2,
            variables: [
              { name: "age", type: "number", value: "25" },
              { name: "name", type: "string", value: '"Alex"' },
            ],
          },
        ],
        heap: [],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: [],
      },
      {
        stepIndex: 2,
        line: 4,
        phase: "executing",
        eventLoopStatus: "stack-running",
        explanation:
          "Executing line 4: Object literal `{ name: 'Alex', score: 10 }` is allocated in the Memory Heap at address `0x10A`. Stack variable `userA` holds a POINTER (`0x10A`).",
        callStack: [
          {
            id: "main",
            name: "Global Scope",
            line: 4,
            variables: [
              { name: "age", type: "number", value: "25" },
              { name: "name", type: "string", value: '"Alex"' },
              {
                name: "userA",
                type: "object-ref",
                value: "ref -> 0x10A",
                heapRef: "0x10A",
              },
            ],
          },
        ],
        heap: [
          {
            address: "0x10A",
            label: "Object (userA)",
            type: "object",
            properties: [
              { key: "name", value: '"Alex"' },
              { key: "score", value: "10" },
            ],
            isMarked: true,
          },
        ],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: [],
        highlightAddress: "0x10A",
      },
      {
        stepIndex: 3,
        line: 5,
        phase: "executing",
        eventLoopStatus: "stack-running",
        explanation:
          "Executing line 5: `let userB = userA`. V8 copies the memory address `0x10A`. Both `userA` and `userB` now point to the exact same memory block!",
        callStack: [
          {
            id: "main",
            name: "Global Scope",
            line: 5,
            variables: [
              { name: "age", type: "number", value: "25" },
              { name: "name", type: "string", value: '"Alex"' },
              {
                name: "userA",
                type: "object-ref",
                value: "ref -> 0x10A",
                heapRef: "0x10A",
              },
              {
                name: "userB",
                type: "object-ref",
                value: "ref -> 0x10A",
                heapRef: "0x10A",
              },
            ],
          },
        ],
        heap: [
          {
            address: "0x10A",
            label: "Object (userA, userB)",
            type: "object",
            properties: [
              { key: "name", value: '"Alex"' },
              { key: "score", value: "10" },
            ],
            isMarked: true,
          },
        ],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: [],
        highlightAddress: "0x10A",
      },
      {
        stepIndex: 4,
        line: 7,
        phase: "executing",
        eventLoopStatus: "stack-running",
        explanation:
          "Executing line 7: `userB.score = 99`. V8 follows `userB`'s pointer to `0x10A` and mutates property `score`. Notice that `userA.score` is now also 99 because it shares `0x10A`!",
        callStack: [
          {
            id: "main",
            name: "Global Scope",
            line: 7,
            variables: [
              { name: "age", type: "number", value: "25" },
              { name: "name", type: "string", value: '"Alex"' },
              {
                name: "userA",
                type: "object-ref",
                value: "ref -> 0x10A",
                heapRef: "0x10A",
              },
              {
                name: "userB",
                type: "object-ref",
                value: "ref -> 0x10A",
                heapRef: "0x10A",
              },
            ],
          },
        ],
        heap: [
          {
            address: "0x10A",
            label: "Object (MUTATED)",
            type: "object",
            properties: [
              { key: "name", value: '"Alex"' },
              { key: "score", value: "99" },
            ],
            isMarked: true,
          },
        ],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: [],
        highlightAddress: "0x10A",
      },
      {
        stepIndex: 5,
        line: 8,
        phase: "executing",
        eventLoopStatus: "stack-running",
        explanation:
          "Executing line 8: `console.log('userA.score:', userA.score)`. Outputs `userA.score: 99`. Demonstrates why shallow copy vs deep clone is a fundamental interview question.",
        callStack: [
          {
            id: "main",
            name: "Global Scope",
            line: 8,
            variables: [
              { name: "age", type: "number", value: "25" },
              { name: "name", type: "string", value: '"Alex"' },
              {
                name: "userA",
                type: "object-ref",
                value: "ref -> 0x10A",
                heapRef: "0x10A",
              },
              {
                name: "userB",
                type: "object-ref",
                value: "ref -> 0x10A",
                heapRef: "0x10A",
              },
            ],
          },
        ],
        heap: [
          {
            address: "0x10A",
            label: "Object (userA, userB)",
            type: "object",
            properties: [
              { key: "name", value: '"Alex"' },
              { key: "score", value: "99" },
            ],
            isMarked: true,
          },
        ],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: ["userA.score: 99"],
        highlightAddress: "0x10A",
      },
      {
        stepIndex: 6,
        line: 10,
        phase: "executing",
        eventLoopStatus: "stack-running",
        explanation:
          "Executing line 10: Array `[1, 2, 3]` is allocated at address `0x10B` in the Heap. Variable `numbers` holds pointer `0x10B`.",
        callStack: [
          {
            id: "main",
            name: "Global Scope",
            line: 10,
            variables: [
              { name: "age", type: "number", value: "25" },
              { name: "name", type: "string", value: '"Alex"' },
              {
                name: "userA",
                type: "object-ref",
                value: "ref -> 0x10A",
                heapRef: "0x10A",
              },
              {
                name: "userB",
                type: "object-ref",
                value: "ref -> 0x10A",
                heapRef: "0x10A",
              },
              {
                name: "numbers",
                type: "object-ref",
                value: "ref -> 0x10B",
                heapRef: "0x10B",
              },
            ],
          },
        ],
        heap: [
          {
            address: "0x10A",
            label: "Object (userA, userB)",
            type: "object",
            properties: [
              { key: "name", value: '"Alex"' },
              { key: "score", value: "99" },
            ],
            isMarked: true,
          },
          {
            address: "0x10B",
            label: "Array (numbers)",
            type: "array",
            properties: [
              { key: "0", value: "1" },
              { key: "1", value: "2" },
              { key: "2", value: "3" },
              { key: "length", value: "3" },
            ],
            isMarked: true,
          },
        ],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: ["userA.score: 99"],
        highlightAddress: "0x10B",
      },
      {
        stepIndex: 7,
        line: 11,
        phase: "done",
        eventLoopStatus: "idle",
        explanation:
          "Executing line 11: `userA.stats = numbers`. A heap object property can point to another heap address! `0x10A.stats` now points to `0x10B`.",
        callStack: [
          {
            id: "main",
            name: "Global Scope",
            line: 11,
            variables: [
              { name: "age", type: "number", value: "25" },
              { name: "name", type: "string", value: '"Alex"' },
              {
                name: "userA",
                type: "object-ref",
                value: "ref -> 0x10A",
                heapRef: "0x10A",
              },
              {
                name: "userB",
                type: "object-ref",
                value: "ref -> 0x10A",
                heapRef: "0x10A",
              },
              {
                name: "numbers",
                type: "object-ref",
                value: "ref -> 0x10B",
                heapRef: "0x10B",
              },
            ],
          },
        ],
        heap: [
          {
            address: "0x10A",
            label: "Object (userA, userB)",
            type: "object",
            properties: [
              { key: "name", value: '"Alex"' },
              { key: "score", value: "99" },
              {
                key: "stats",
                value: "ref -> 0x10B",
                isRef: true,
                refAddress: "0x10B",
              },
            ],
            isMarked: true,
          },
          {
            address: "0x10B",
            label: "Array (numbers)",
            type: "array",
            properties: [
              { key: "0", value: "1" },
              { key: "1", value: "2" },
              { key: "2", value: "3" },
              { key: "length", value: "3" },
            ],
            isMarked: true,
          },
        ],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: ["userA.score: 99"],
        highlightAddress: "0x10A",
      },
    ],
  },

  // ── PRESET 3: CLOSURES & SCOPE LIFETIME ────────────────────────────────
  {
    id: "closures",
    title: "Closures & Lexical Scope Lifetime",
    subtitle:
      "Watch an execution frame pop off the Call Stack while its Heap Scope stays alive",
    code: `function createCounter() {
  let count = 0; // Stored in Lexical Environment

  return function increment() {
    count += 1;
    return count;
  };
}

const counter = createCounter(); // Frame pops!
console.log(counter()); // 1
console.log(counter()); // 2`,
    takeaway:
      "When a function returns, its Call Stack frame is destroyed immediately. However, if an inner function references outer variables, V8 retains the outer Lexical Environment on the Heap! This persistent link is a Closure.",
    steps: [
      {
        stepIndex: 0,
        line: 10,
        phase: "executing",
        eventLoopStatus: "stack-running",
        explanation:
          "Executing `createCounter()` call. A new Execution Context frame is pushed onto the Call Stack.",
        callStack: [
          { id: "main", name: "Global Scope", line: 10, variables: [] },
          {
            id: "createCounter",
            name: "createCounter()",
            line: 1,
            variables: [],
          },
        ],
        heap: [],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: [],
      },
      {
        stepIndex: 1,
        line: 2,
        phase: "executing",
        eventLoopStatus: "stack-running",
        explanation:
          "Inside `createCounter()`: `let count = 0` is initialized. Because an inner function references it, V8 allocates a Closure Scope Environment on the Heap (`0x201`).",
        callStack: [
          { id: "main", name: "Global Scope", line: 10, variables: [] },
          {
            id: "createCounter",
            name: "createCounter()",
            line: 2,
            variables: [
              {
                name: "[[Scope]]",
                type: "object-ref",
                value: "ref -> 0x201",
                heapRef: "0x201",
              },
            ],
          },
        ],
        heap: [
          {
            address: "0x201",
            label: "Closure (createCounter)",
            type: "closure",
            properties: [{ key: "count", value: "0" }],
            isMarked: true,
          },
        ],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: [],
        highlightAddress: "0x201",
      },
      {
        stepIndex: 2,
        line: 4,
        phase: "executing",
        eventLoopStatus: "stack-running",
        explanation:
          "`createCounter()` returns function `increment`. The returned function object is stored at Heap `0x202` with a hidden internal `[[Scopes]]` pointer to `0x201`.",
        callStack: [
          { id: "main", name: "Global Scope", line: 10, variables: [] },
          {
            id: "createCounter",
            name: "createCounter()",
            line: 4,
            variables: [
              {
                name: "[[Scope]]",
                type: "object-ref",
                value: "ref -> 0x201",
                heapRef: "0x201",
              },
            ],
          },
        ],
        heap: [
          {
            address: "0x201",
            label: "Closure (createCounter)",
            type: "closure",
            properties: [{ key: "count", value: "0" }],
            isMarked: true,
          },
          {
            address: "0x202",
            label: "Function (increment)",
            type: "function",
            properties: [
              {
                key: "[[Scopes]]",
                value: "ref -> 0x201",
                isRef: true,
                refAddress: "0x201",
              },
            ],
            isMarked: true,
          },
        ],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: [],
        highlightAddress: "0x202",
      },
      {
        stepIndex: 3,
        line: 10,
        phase: "executing",
        eventLoopStatus: "stack-running",
        explanation:
          "`createCounter()` finishes and POPS OFF THE CALL STACK! Notice: Stack frame is gone, but Heap `0x201` is NOT garbage collected because `counter` (`0x202`) holds a live reference!",
        callStack: [
          {
            id: "main",
            name: "Global Scope",
            line: 10,
            variables: [
              {
                name: "counter",
                type: "function",
                value: "ref -> 0x202",
                heapRef: "0x202",
              },
            ],
          },
        ],
        heap: [
          {
            address: "0x201",
            label: "Closure (createCounter)",
            type: "closure",
            properties: [{ key: "count", value: "0" }],
            isMarked: true,
          },
          {
            address: "0x202",
            label: "Function (increment)",
            type: "function",
            properties: [
              {
                key: "[[Scopes]]",
                value: "ref -> 0x201",
                isRef: true,
                refAddress: "0x201",
              },
            ],
            isMarked: true,
          },
        ],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: [],
        highlightAddress: "0x201",
      },
      {
        stepIndex: 4,
        line: 11,
        phase: "executing",
        eventLoopStatus: "stack-running",
        explanation:
          "Executing `counter()`. Frame `increment()` is pushed to Call Stack. It accesses and updates `count` in Heap `0x201` from 0 to 1.",
        callStack: [
          {
            id: "main",
            name: "Global Scope",
            line: 11,
            variables: [
              {
                name: "counter",
                type: "function",
                value: "ref -> 0x202",
                heapRef: "0x202",
              },
            ],
          },
          {
            id: "increment-1",
            name: "increment()",
            line: 5,
            variables: [
              {
                name: "count (via closure)",
                type: "number",
                value: "1",
              },
            ],
          },
        ],
        heap: [
          {
            address: "0x201",
            label: "Closure (UPDATED)",
            type: "closure",
            properties: [{ key: "count", value: "1" }],
            isMarked: true,
          },
          {
            address: "0x202",
            label: "Function (increment)",
            type: "function",
            properties: [
              {
                key: "[[Scopes]]",
                value: "ref -> 0x201",
                isRef: true,
                refAddress: "0x201",
              },
            ],
            isMarked: true,
          },
        ],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: ["1"],
        highlightAddress: "0x201",
      },
      {
        stepIndex: 5,
        line: 12,
        phase: "done",
        eventLoopStatus: "idle",
        explanation:
          "Executing `counter()` again. Frame `increment()` is pushed. `count` in Heap `0x201` is incremented to 2! The state persisted across both function calls.",
        callStack: [
          {
            id: "main",
            name: "Global Scope",
            line: 12,
            variables: [
              {
                name: "counter",
                type: "function",
                value: "ref -> 0x202",
                heapRef: "0x202",
              },
            ],
          },
          {
            id: "increment-2",
            name: "increment()",
            line: 5,
            variables: [
              {
                name: "count (via closure)",
                type: "number",
                value: "2",
              },
            ],
          },
        ],
        heap: [
          {
            address: "0x201",
            label: "Closure (UPDATED)",
            type: "closure",
            properties: [{ key: "count", value: "2" }],
            isMarked: true,
          },
          {
            address: "0x202",
            label: "Function (increment)",
            type: "function",
            properties: [
              {
                key: "[[Scopes]]",
                value: "ref -> 0x201",
                isRef: true,
                refAddress: "0x201",
              },
            ],
            isMarked: true,
          },
        ],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: ["1", "2"],
        highlightAddress: "0x201",
      },
    ],
  },

  // ── PRESET 4: ASYNC / AWAIT FLOW ───────────────────────────────────────
  {
    id: "async-await",
    title: "Async/Await Deconstruction",
    subtitle:
      "Witness how 'await' pauses execution and yields the thread back to the Event Loop",
    code: `async function fetchUserData() {
  console.log("1: Inside async before await");

  await Promise.resolve("Data loaded");
  // PAUSES! Rest of function scheduled as microtask

  console.log("3: After await resumed");
}

fetchUserData();
console.log("2: Synchronous execution continues");`,
    takeaway:
      "Async/Await is syntactic sugar over Promises and Generators. The instant execution hits an 'await', the async function yields control back to synchronous code. Everything after 'await' runs as a microtask!",
    steps: [
      {
        stepIndex: 0,
        line: 10,
        phase: "executing",
        eventLoopStatus: "stack-running",
        explanation:
          "`fetchUserData()` is invoked. Its execution frame enters the Call Stack.",
        callStack: [
          { id: "main", name: "main()", line: 10, variables: [] },
          {
            id: "async-fn",
            name: "fetchUserData() [async]",
            line: 1,
            variables: [],
          },
        ],
        heap: [],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: [],
      },
      {
        stepIndex: 1,
        line: 2,
        phase: "executing",
        eventLoopStatus: "stack-running",
        explanation:
          "`console.log('1: Inside async before await')` runs synchronously inside the async function.",
        callStack: [
          { id: "main", name: "main()", line: 10, variables: [] },
          {
            id: "async-fn",
            name: "fetchUserData() [async]",
            line: 2,
            variables: [],
          },
        ],
        heap: [],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: ["1: Inside async before await"],
      },
      {
        stepIndex: 2,
        line: 4,
        phase: "microtask-queue",
        eventLoopStatus: "stack-running",
        explanation:
          "Hit `await Promise.resolve()`! The remainder of `fetchUserData()` is paused and transformed into a microtask callback.",
        callStack: [
          { id: "main", name: "main()", line: 10, variables: [] },
          {
            id: "async-fn",
            name: "fetchUserData() [PAUSED]",
            line: 4,
            variables: [],
          },
        ],
        heap: [
          {
            address: "0x301",
            label: "AsyncContinuation()",
            type: "function",
            properties: [{ key: "target", value: "Lines 5-7 resumed" }],
          },
        ],
        webApis: [],
        microtasks: [
          {
            id: "micro-res",
            label: "AsyncResume(fetchUserData)",
            source: "await resolution",
            isMicrotask: true,
          },
        ],
        macrotasks: [],
        consoleLogs: ["1: Inside async before await"],
      },
      {
        stepIndex: 3,
        line: 11,
        phase: "executing",
        eventLoopStatus: "stack-running",
        explanation:
          "`fetchUserData()` immediately returned its Promise. Call Stack returns to `main()`: `console.log('2: Synchronous execution continues')` executes!",
        callStack: [
          { id: "main", name: "main()", line: 11, variables: [] },
        ],
        heap: [
          {
            address: "0x301",
            label: "AsyncContinuation()",
            type: "function",
            properties: [{ key: "target", value: "Lines 5-7 resumed" }],
          },
        ],
        webApis: [],
        microtasks: [
          {
            id: "micro-res",
            label: "AsyncResume(fetchUserData)",
            source: "await resolution",
            isMicrotask: true,
          },
        ],
        macrotasks: [],
        consoleLogs: [
          "1: Inside async before await",
          "2: Synchronous execution continues",
        ],
      },
      {
        stepIndex: 4,
        line: 6,
        phase: "draining-microtasks" as any,
        eventLoopStatus: "draining-microtask",
        explanation:
          "Main script finished! Event Loop picks `AsyncResume` from Microtask Queue. It restores the `fetchUserData()` frame right after the `await` keyword!",
        callStack: [
          {
            id: "async-resumed",
            name: "fetchUserData() [RESUMED]",
            line: 6,
            variables: [
              {
                name: "resolvedVal",
                type: "string",
                value: '"Data loaded"',
              },
            ],
          },
        ],
        heap: [],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: [
          "1: Inside async before await",
          "2: Synchronous execution continues",
          "3: After await resumed",
        ],
      },
      {
        stepIndex: 5,
        line: 7,
        phase: "done",
        eventLoopStatus: "idle",
        explanation:
          "Async function finishes execution. The outer returned Promise resolves with undefined. All queues are clear.",
        callStack: [],
        heap: [],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: [
          "1: Inside async before await",
          "2: Synchronous execution continues",
          "3: After await resumed",
        ],
      },
    ],
  },

  // ── PRESET 5: GARBAGE COLLECTION MARK & SWEEP ─────────────────────────
  {
    id: "garbage-collection",
    title: "Garbage Collection: Mark & Sweep",
    subtitle:
      "See how V8 reclaims memory even when cyclic/circular references exist",
    code: `let rootA = { label: "Node A" }; // Heap 0x401
let rootB = { label: "Node B" }; // Heap 0x402

// Create circular reference
rootA.neighbor = rootB;
rootB.neighbor = rootA;

// Sever root references from Call Stack
rootA = null;
rootB = null;

// GC Sweep: Island of isolation is collected!`,
    takeaway:
      "Older reference-counting GC failed on circular references. Modern V8 engines use 'Mark and Sweep': starting from GC Roots (Call Stack, global variables), every reachable object is marked. Any object that cannot be reached from roots is swept away, regardless of internal cycles!",
    steps: [
      {
        stepIndex: 0,
        line: 1,
        phase: "executing",
        eventLoopStatus: "stack-running",
        explanation:
          "`rootA` is created. Allocated at Heap `0x401` and reachable from Call Stack root.",
        callStack: [
          {
            id: "main",
            name: "Global Scope",
            line: 1,
            variables: [
              {
                name: "rootA",
                type: "object-ref",
                value: "ref -> 0x401",
                heapRef: "0x401",
              },
            ],
          },
        ],
        heap: [
          {
            address: "0x401",
            label: "Node A",
            type: "object",
            properties: [{ key: "label", value: '"Node A"' }],
            isMarked: true,
          },
        ],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: [],
        highlightAddress: "0x401",
      },
      {
        stepIndex: 1,
        line: 2,
        phase: "executing",
        eventLoopStatus: "stack-running",
        explanation:
          "`rootB` is created. Allocated at Heap `0x402` and reachable from Call Stack root.",
        callStack: [
          {
            id: "main",
            name: "Global Scope",
            line: 2,
            variables: [
              {
                name: "rootA",
                type: "object-ref",
                value: "ref -> 0x401",
                heapRef: "0x401",
              },
              {
                name: "rootB",
                type: "object-ref",
                value: "ref -> 0x402",
                heapRef: "0x402",
              },
            ],
          },
        ],
        heap: [
          {
            address: "0x401",
            label: "Node A",
            type: "object",
            properties: [{ key: "label", value: '"Node A"' }],
            isMarked: true,
          },
          {
            address: "0x402",
            label: "Node B",
            type: "object",
            properties: [{ key: "label", value: '"Node B"' }],
            isMarked: true,
          },
        ],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: [],
        highlightAddress: "0x402",
      },
      {
        stepIndex: 2,
        line: 5,
        phase: "executing",
        eventLoopStatus: "stack-running",
        explanation:
          "Circular reference created! `rootA.neighbor` points to `0x402`, and `rootB.neighbor` points to `0x401`.",
        callStack: [
          {
            id: "main",
            name: "Global Scope",
            line: 5,
            variables: [
              {
                name: "rootA",
                type: "object-ref",
                value: "ref -> 0x401",
                heapRef: "0x401",
              },
              {
                name: "rootB",
                type: "object-ref",
                value: "ref -> 0x402",
                heapRef: "0x402",
              },
            ],
          },
        ],
        heap: [
          {
            address: "0x401",
            label: "Node A (cyclic)",
            type: "object",
            properties: [
              { key: "label", value: '"Node A"' },
              {
                key: "neighbor",
                value: "ref -> 0x402",
                isRef: true,
                refAddress: "0x402",
              },
            ],
            isMarked: true,
          },
          {
            address: "0x402",
            label: "Node B (cyclic)",
            type: "object",
            properties: [
              { key: "label", value: '"Node B"' },
              {
                key: "neighbor",
                value: "ref -> 0x401",
                isRef: true,
                refAddress: "0x401",
              },
            ],
            isMarked: true,
          },
        ],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: [],
      },
      {
        stepIndex: 3,
        line: 9,
        phase: "executing",
        eventLoopStatus: "stack-running",
        explanation:
          "`rootA = null` and `rootB = null`. The stack variables no longer hold references to `0x401` or `0x402`! An island of isolation is formed.",
        callStack: [
          {
            id: "main",
            name: "Global Scope",
            line: 9,
            variables: [
              { name: "rootA", type: "boolean", value: "null" },
              { name: "rootB", type: "boolean", value: "null" },
            ],
          },
        ],
        heap: [
          {
            address: "0x401",
            label: "Node A (UNREACHABLE)",
            type: "object",
            properties: [
              { key: "label", value: '"Node A"' },
              {
                key: "neighbor",
                value: "ref -> 0x402",
                isRef: true,
                refAddress: "0x402",
              },
            ],
            isMarked: false,
          },
          {
            address: "0x402",
            label: "Node B (UNREACHABLE)",
            type: "object",
            properties: [
              { key: "label", value: '"Node B"' },
              {
                key: "neighbor",
                value: "ref -> 0x401",
                isRef: true,
                refAddress: "0x401",
              },
            ],
            isMarked: false,
          },
        ],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: [],
      },
      {
        stepIndex: 4,
        line: 12,
        phase: "gc",
        eventLoopStatus: "stack-running",
        explanation:
          "V8 Major GC runs Mark & Sweep! Starting from GC Roots (Call Stack), neither 0x401 nor 0x402 is reachable. Even though they reference each other, their isMarked flag is false!",
        callStack: [
          {
            id: "main",
            name: "Global Scope",
            line: 12,
            variables: [
              { name: "rootA", type: "boolean", value: "null" },
              { name: "rootB", type: "boolean", value: "null" },
            ],
          },
        ],
        heap: [
          {
            address: "0x401",
            label: "Node A (SWEEPING...)",
            type: "object",
            properties: [{ key: "status", value: "reclaiming..." }],
            isMarked: false,
            isCollecting: true,
          },
          {
            address: "0x402",
            label: "Node B (SWEEPING...)",
            type: "object",
            properties: [{ key: "status", value: "reclaiming..." }],
            isMarked: false,
            isCollecting: true,
          },
        ],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: ["[GC] Mark & Sweep running: 2 unreachable objects detected"],
      },
      {
        stepIndex: 5,
        line: 12,
        phase: "done",
        eventLoopStatus: "idle",
        explanation:
          "Memory Swept! The unreachable memory blocks are returned to the OS / free-list. Circular references did NOT cause a memory leak thanks to Mark & Sweep!",
        callStack: [
          {
            id: "main",
            name: "Global Scope",
            line: 12,
            variables: [
              { name: "rootA", type: "boolean", value: "null" },
              { name: "rootB", type: "boolean", value: "null" },
            ],
          },
        ],
        heap: [],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: [
          "[GC] Mark & Sweep running: 2 unreachable objects detected",
          "[GC] 0x401 and 0x402 reclaimed successfully!",
        ],
      },
    ],
  },
];

/**
 * Dynamically parses and traces custom user JavaScript code into a step-by-step
 * Call Stack, Memory Heap, Web API, and Event Loop execution sequence.
 */
export function traceCustomCode(userCode: string): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const lines = userCode.split("\n");

  let currentStack: CallFrame[] = [
    {
      id: "main",
      name: "main()",
      line: 1,
      variables: [],
    },
  ];
  let currentHeap: HeapObject[] = [];
  let currentWebApis: WebApiTask[] = [];
  let currentMicrotasks: QueueItem[] = [];
  let currentMacrotasks: QueueItem[] = [];
  let currentLogs: string[] = [];

  let heapAddressCounter = 0x500;
  let timerIdCounter = 1;
  let microtaskIdCounter = 1;

  // Track pending deferred tasks to run during Event Loop drain phase
  interface DeferredCallback {
    type: "microtask" | "macrotask";
    source: string;
    label: string;
    callbackLine: number;
    bodyLines: string[];
  }
  const pendingMicrotasks: DeferredCallback[] = [];
  const pendingMacrotasks: DeferredCallback[] = [];

  // Helper to deep clone current state for each step snapshot
  const recordStep = (
    lineNum: number,
    phase: ExecutionStep["phase"],
    eventLoopStatus: ExecutionStep["eventLoopStatus"],
    explanation: string,
    highlightAddress?: string,
  ) => {
    steps.push({
      stepIndex: steps.length,
      line: lineNum,
      phase,
      eventLoopStatus,
      explanation,
      callStack: JSON.parse(JSON.stringify(currentStack)),
      heap: JSON.parse(JSON.stringify(currentHeap)),
      webApis: JSON.parse(JSON.stringify(currentWebApis)),
      microtasks: JSON.parse(JSON.stringify(currentMicrotasks)),
      macrotasks: JSON.parse(JSON.stringify(currentMacrotasks)),
      consoleLogs: [...currentLogs],
      highlightAddress,
    });
  };

  // Initial step
  recordStep(
    1,
    "executing",
    "stack-running",
    "Global Execution Context created on the Call Stack. Engine begins synchronous execution.",
  );

  let i = 0;
  while (i < lines.length) {
    const rawLine = lines[i] ?? "";
    const trimmed = rawLine.trim();
    const lineNum = i + 1;

    // Skip empty lines or pure comment lines
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("/*")) {
      i++;
      continue;
    }

    // 1. console.log(...)
    const logMatch = trimmed.match(/console\.log\((.*)\);?/);
    if (logMatch && !trimmed.includes("setTimeout") && !trimmed.includes("Promise") && !trimmed.includes("queueMicrotask")) {
      const rawArg = logMatch[1] ?? "";
      let printed = rawArg;
      try {
        if ((printed.startsWith('"') && printed.endsWith('"')) || (printed.startsWith("'") && printed.endsWith("'"))) {
          printed = printed.slice(1, -1);
        } else {
          const foundVar = currentStack[0]?.variables.find((v) => v.name === printed.trim());
          if (foundVar) {
            printed = foundVar.value;
          }
        }
      } catch {
        printed = rawArg;
      }

      currentLogs.push(printed);
      currentStack.push({
        id: `log-${lineNum}`,
        name: "console.log()",
        line: lineNum,
        variables: [],
      });

      recordStep(
        lineNum,
        "executing",
        "stack-running",
        `Executing console.log(${rawArg}). Outputs to stdout immediately.`,
      );

      // Pop console.log
      currentStack.pop();
      i++;
      continue;
    }

    // 2. setTimeout(...)
    if (trimmed.includes("setTimeout")) {
      const timerId = `timer-${timerIdCounter++}`;
      const timeMatch = trimmed.match(/,\s*(\d+)\s*\)/);
      const delay = timeMatch ? `${timeMatch[1]}ms` : "0ms";

      let callbackLine = lineNum;
      const bodyLines: string[] = [];

      if (trimmed.includes("{")) {
        let depth = 0;
        for (const ch of trimmed) {
          if (ch === "{") depth++;
          if (ch === "}") depth--;
        }

        if (depth > 0) {
          let curIdx = i + 1;
          while (curIdx < lines.length && depth > 0) {
            const nextL = lines[curIdx] ?? "";
            for (const ch of nextL) {
              if (ch === "{") depth++;
              if (ch === "}") depth--;
            }
            if (depth > 0) {
              bodyLines.push(nextL);
              if (callbackLine === lineNum && (nextL.includes("console.log") || nextL.trim())) {
                callbackLine = curIdx + 1;
              }
            }
            curIdx++;
          }
          i = curIdx - 1;
        } else {
          const innerMatch = trimmed.match(/\{([^}]*)\}/);
          if (innerMatch) bodyLines.push(innerMatch[1] ?? "");
        }
      } else {
        bodyLines.push(trimmed);
      }

      let innerSnippet = "callback";
      for (const bl of bodyLines) {
        const m = bl.match(/console\.log\((.*?)\)/);
        if (m) {
          innerSnippet = m[1] ?? "callback";
          break;
        }
      }

      const cbLabel = `TimerCallback(${innerSnippet})`;

      currentWebApis.push({
        id: timerId,
        type: "timer",
        label: cbLabel,
        duration: delay,
        progress: 100,
      });

      recordStep(
        lineNum,
        "webapi",
        "stack-running",
        `setTimeout(..., ${delay}) registered. V8 offloads the timer to the browser's Web API thread.`,
      );

      // Move from Web API to Macrotask Queue
      currentWebApis = currentWebApis.filter((w) => w.id !== timerId);
      currentMacrotasks.push({
        id: `macro-${timerIdCounter}`,
        label: cbLabel,
        source: `setTimeout (${delay})`,
        isMicrotask: false,
      });

      pendingMacrotasks.push({
        type: "macrotask",
        source: `setTimeout (${delay})`,
        label: cbLabel,
        callbackLine,
        bodyLines: bodyLines.length > 0 ? bodyLines : [`console.log("${innerSnippet}");`],
      });

      recordStep(
        lineNum,
        "macrotask-queue",
        "stack-running",
        `Timer completed in Web API thread! Callback enqueued into the Macrotask (Task) Queue.`,
      );

      i++;
      continue;
    }

    // 3. Promise.resolve().then(...)
    if (trimmed.includes("Promise") && trimmed.includes(".then")) {
      const pId = `micro-${microtaskIdCounter++}`;
      let callbackLine = lineNum;
      const bodyLines: string[] = [];

      if (trimmed.includes("{")) {
        let depth = 0;
        for (const ch of trimmed) {
          if (ch === "{") depth++;
          if (ch === "}") depth--;
        }

        if (depth > 0) {
          let curIdx = i + 1;
          while (curIdx < lines.length && depth > 0) {
            const nextL = lines[curIdx] ?? "";
            for (const ch of nextL) {
              if (ch === "{") depth++;
              if (ch === "}") depth--;
            }
            if (depth > 0) {
              bodyLines.push(nextL);
              if (callbackLine === lineNum && (nextL.includes("console.log") || nextL.trim())) {
                callbackLine = curIdx + 1;
              }
            }
            curIdx++;
          }
          i = curIdx - 1;
        } else {
          const innerMatch = trimmed.match(/\{([^}]*)\}/);
          if (innerMatch) bodyLines.push(innerMatch[1] ?? "");
        }
      } else {
        bodyLines.push(trimmed);
      }

      let innerSnippet = "promise cb";
      for (const bl of bodyLines) {
        const m = bl.match(/console\.log\((.*?)\)/);
        if (m) {
          innerSnippet = m[1] ?? "promise cb";
          break;
        }
      }

      const cbLabel = `PromiseCallback(${innerSnippet})`;

      currentMicrotasks.push({
        id: pId,
        label: cbLabel,
        source: "Promise.then",
        isMicrotask: true,
      });

      pendingMicrotasks.push({
        type: "microtask",
        source: "Promise.then",
        label: cbLabel,
        callbackLine,
        bodyLines: bodyLines.length > 0 ? bodyLines : [`console.log("${innerSnippet}");`],
      });

      recordStep(
        lineNum,
        "microtask-queue",
        "stack-running",
        `Promise resolved! Its .then() callback is immediately scheduled in the VIP Microtask Queue.`,
      );

      i++;
      continue;
    }

    // 4. queueMicrotask(...)
    if (trimmed.includes("queueMicrotask")) {
      const mId = `micro-${microtaskIdCounter++}`;
      let callbackLine = lineNum;
      const bodyLines: string[] = [];

      if (trimmed.includes("{")) {
        let depth = 0;
        for (const ch of trimmed) {
          if (ch === "{") depth++;
          if (ch === "}") depth--;
        }

        if (depth > 0) {
          let curIdx = i + 1;
          while (curIdx < lines.length && depth > 0) {
            const nextL = lines[curIdx] ?? "";
            for (const ch of nextL) {
              if (ch === "{") depth++;
              if (ch === "}") depth--;
            }
            if (depth > 0) {
              bodyLines.push(nextL);
              if (callbackLine === lineNum && (nextL.includes("console.log") || nextL.trim())) {
                callbackLine = curIdx + 1;
              }
            }
            curIdx++;
          }
          i = curIdx - 1;
        } else {
          const innerMatch = trimmed.match(/\{([^}]*)\}/);
          if (innerMatch) bodyLines.push(innerMatch[1] ?? "");
        }
      } else {
        bodyLines.push(trimmed);
      }

      let innerSnippet = "microtask cb";
      for (const bl of bodyLines) {
        const m = bl.match(/console\.log\((.*?)\)/);
        if (m) {
          innerSnippet = m[1] ?? "microtask cb";
          break;
        }
      }

      const cbLabel = `MicrotaskCallback(${innerSnippet})`;

      currentMicrotasks.push({
        id: mId,
        label: cbLabel,
        source: "queueMicrotask",
        isMicrotask: true,
      });

      pendingMicrotasks.push({
        type: "microtask",
        source: "queueMicrotask",
        label: cbLabel,
        callbackLine,
        bodyLines: bodyLines.length > 0 ? bodyLines : [`console.log("${innerSnippet}");`],
      });

      recordStep(
        lineNum,
        "microtask-queue",
        "stack-running",
        `queueMicrotask() explicitly enqueues its callback into the Microtask Queue.`,
      );

      i++;
      continue;
    }

    // 5. Variable declaration: Objects `{ ... }` -> Heap allocation
    const objMatch = trimmed.match(/(?:let|const|var)\s+([a-zA-Z0-9_$]+)\s*=\s*\{([^}]*)\};?/);
    if (objMatch) {
      const varName = objMatch[1] ?? "obj";
      const propsStr = objMatch[2] ?? "";
      heapAddressCounter += 0x1;
      const hexAddr = `0x${heapAddressCounter.toString(16).toUpperCase()}`;

      const props: HeapProperty[] = [];
      if (propsStr.trim()) {
        const pairs = propsStr.split(",");
        for (const p of pairs) {
          const [k, v] = p.split(":").map((s) => s.trim());
          if (k) props.push({ key: k, value: v ?? "undefined" });
        }
      }

      currentHeap.push({
        address: hexAddr,
        label: `Object (${varName})`,
        type: "object",
        properties: props.length > 0 ? props : [{ key: "empty", value: "{}" }],
        isMarked: true,
      });

      currentStack[0]?.variables.push({
        name: varName,
        type: "object-ref",
        value: `ref -> ${hexAddr}`,
        heapRef: hexAddr,
      });

      recordStep(
        lineNum,
        "executing",
        "stack-running",
        `Allocating Object on Memory Heap at address ${hexAddr}. Stack variable '${varName}' stores pointer '${hexAddr}'.`,
        hexAddr,
      );

      i++;
      continue;
    }

    // 6. Variable declaration: Arrays `[ ... ]` -> Heap allocation
    const arrMatch = trimmed.match(/(?:let|const|var)\s+([a-zA-Z0-9_$]+)\s*=\s*\[(.*)\];?/);
    if (arrMatch) {
      const varName = arrMatch[1] ?? "arr";
      const itemsStr = arrMatch[2] ?? "";
      heapAddressCounter += 0x1;
      const hexAddr = `0x${heapAddressCounter.toString(16).toUpperCase()}`;

      const items = itemsStr ? itemsStr.split(",").map((s) => s.trim()) : [];
      const props: HeapProperty[] = items.map((val, idx) => ({
        key: String(idx),
        value: val,
      }));
      props.push({ key: "length", value: String(items.length) });

      currentHeap.push({
        address: hexAddr,
        label: `Array (${varName})`,
        type: "array",
        properties: props,
        isMarked: true,
      });

      currentStack[0]?.variables.push({
        name: varName,
        type: "object-ref",
        value: `ref -> ${hexAddr}`,
        heapRef: hexAddr,
      });

      recordStep(
        lineNum,
        "executing",
        "stack-running",
        `Allocating Array on Memory Heap at address ${hexAddr}. Stack variable '${varName}' stores reference '${hexAddr}'.`,
        hexAddr,
      );

      i++;
      continue;
    }

    // 7. Primitive Variable declaration: `let a = 10`
    const primMatch = trimmed.match(/(?:let|const|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(.+);?/);
    if (primMatch) {
      const varName = primMatch[1] ?? "var";
      const val = primMatch[2]?.trim() ?? "undefined";
      const isNum = !isNaN(Number(val));
      const isStr = val.startsWith('"') || val.startsWith("'");

      currentStack[0]?.variables.push({
        name: varName,
        type: isNum ? "number" : isStr ? "string" : "boolean",
        value: val,
      });

      recordStep(
        lineNum,
        "executing",
        "stack-running",
        `Primitive '${varName} = ${val}' allocated directly inside the active Call Stack frame.`,
      );

      i++;
      continue;
    }

    // Default step for other lines
    recordStep(
      lineNum,
      "executing",
      "stack-running",
      `Executing line: ${trimmed}`,
    );
    i++;
  }

  // ── 8. SYNCHRONOUS CODE COMPLETED ──
  currentStack = [];
  recordStep(
    lines.length,
    "event-loop-drain",
    "checking-microtasks",
    "Call Stack is now EMPTY! Event Loop awakens and inspects the Microtask Queue. Microtasks ALWAYS run before macrotasks.",
  );

  // ── 9. DRAIN MICROTASKS ──
  while (pendingMicrotasks.length > 0) {
    const task = pendingMicrotasks.shift()!;
    currentMicrotasks.shift();

    currentStack = [
      {
        id: `micro-frame-${pendingMicrotasks.length}`,
        name: task.label,
        line: task.callbackLine,
        variables: [],
      },
    ];

    for (const bodyLine of task.bodyLines) {
      const m = bodyLine.match(/console\.log\((.*)\)/);
      if (m) {
        let printed = m[1]?.trim() ?? "";
        if ((printed.startsWith('"') && printed.endsWith('"')) || (printed.startsWith("'") && printed.endsWith("'"))) {
          printed = printed.slice(1, -1);
        }
        currentLogs.push(printed);
      }
    }

    recordStep(
      task.callbackLine,
      "microtask-queue",
      "draining-microtask",
      `Draining VIP Microtask: ${task.label}. Pushed to Call Stack and executed to completion.`,
    );

    currentStack = [];
  }

  // ── 10. DRAIN MACROTASKS ──
  recordStep(
    lines.length,
    "event-loop-drain",
    "checking-macrotasks",
    "Microtask Queue is now completely clear! Event Loop is now permitted to pull 1 task from the Macrotask Queue.",
  );

  while (pendingMacrotasks.length > 0) {
    const task = pendingMacrotasks.shift()!;
    currentMacrotasks.shift();

    currentStack = [
      {
        id: `macro-frame-${pendingMacrotasks.length}`,
        name: task.label,
        line: task.callbackLine,
        variables: [],
      },
    ];

    for (const bodyLine of task.bodyLines) {
      const m = bodyLine.match(/console\.log\((.*)\)/);
      if (m) {
        let printed = m[1]?.trim() ?? "";
        if ((printed.startsWith('"') && printed.endsWith('"')) || (printed.startsWith("'") && printed.endsWith("'"))) {
          printed = printed.slice(1, -1);
        }
        currentLogs.push(printed);
      }
    }

    recordStep(
      task.callbackLine,
      "macrotask-queue",
      "pulling-macrotask",
      `Pulling Macrotask: ${task.label}. Pushed to Call Stack, executed, and completed.`,
    );

    currentStack = [];
  }

  // ── 11. COMPLETION ──
  recordStep(
    lines.length,
    "done",
    "idle",
    "Execution finished! Call stack and all task queues are clear. Event Loop returns to idle spin.",
  );

  return steps;
}

