import type { CodingProblem } from '../../types';

export const deepEqualProblem: CodingProblem = {
  id: 'coding-deep-equal',
  title: 'Deep Equality Comparison',
  difficulty: 'Advanced',
  category: 'Coding',
  tags: ['comparison', 'recursion', 'type-checking', 'edge-cases', 'utility'],

  problem: `Implement a deep equality function that determines whether two JavaScript values are structurally equivalent. Unlike the strict equality operator (===) which checks reference identity for objects, deep equality should compare the actual contents: two distinct objects with the same properties and values should be considered equal.

The function must handle all JavaScript types: primitives (string, number, boolean, null, undefined), plain objects, arrays, Date objects, RegExp objects, and special values like NaN (which is not === to itself). Nested structures should be compared recursively. Two objects are deeply equal if they have the same set of keys and all corresponding values are deeply equal.

This is used extensively in testing frameworks (Jest's toEqual), React's shallow/deep comparison for memoization, and state management libraries for detecting changes.`,

  requirements: [
    'Compare primitives using strict equality (===)',
    'Handle NaN correctly (NaN should equal NaN)',
    'Recursively compare plain objects by keys and values',
    'Recursively compare arrays by length and elements',
    'Compare Date objects by their time value',
    'Compare RegExp objects by source and flags',
    'Return false for values of different types',
    'Handle null and undefined correctly',
  ],

  examples: [
    {
      input: `deepEqual({ a: 1, b: { c: [2, 3] } }, { a: 1, b: { c: [2, 3] } })`,
      output: 'true',
      explanation: 'Both objects have identical structure and values at every level.',
    },
    {
      input: `deepEqual({ a: 1, b: 2 }, { a: 1, b: 3 })`,
      output: 'false',
      explanation: 'The value of key "b" differs between the two objects.',
    },
    {
      input: `deepEqual(NaN, NaN)`,
      output: 'true',
      explanation: 'Special case: NaN === NaN is false in JS, but they should be considered deeply equal.',
    },
  ],

  edgeCases: [
    'NaN compared to NaN (should return true)',
    'null compared to undefined (should return false)',
    '+0 compared to -0 (typically considered equal)',
    'Objects with different key counts but overlapping keys',
    'Arrays of different lengths',
    'Date objects with the same vs different timestamps',
    'RegExp objects with same pattern but different flags',
  ],

  naiveApproach: `A naive approach is JSON.stringify(a) === JSON.stringify(b). This fails for many reasons: key order in objects is not guaranteed, NaN serializes to null, undefined is dropped, Date objects become strings, RegExp becomes {}, and circular references throw errors. It also has unnecessary performance overhead from stringifying the entire structure.`,

  optimalApproach: `The optimal approach uses a recursive function with early type-checking bailouts. First, use === for quick identity check (same reference or same primitive). Then handle NaN with Number.isNaN. Check if types match (typeof). Handle special objects: compare Dates via getTime(), RegExps via source and flags.

For arrays, compare lengths first (quick bailout) then recursively compare each element by index. For objects, compare key counts first (quick bailout), then check that every key in the first object exists in the second and that the corresponding values are deeply equal. The key-count check is important — without it, { a: 1 } would incorrectly equal { a: 1, b: 2 } because all of the first object's keys match.

The early bailouts at each level make this efficient in practice: most unequal structures differ at a high level and the function returns false quickly without traversing the entire tree.`,

  implementation: `function deepEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (Number.isNaN(a) && Number.isNaN(b)) {
    return true;
  }

  if (
    a === null || b === null ||
    typeof a !== 'object' || typeof b !== 'object'
  ) {
    return false;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }

  if (a instanceof Date !== b instanceof Date) return false;
  if (a instanceof RegExp !== b instanceof RegExp) return false;

  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) {
      return false;
    }
    if (!deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

// Usage
console.log(deepEqual({ a: 1, b: [2, 3] }, { a: 1, b: [2, 3] }));  // true
console.log(deepEqual({ a: 1 }, { a: 1, b: 2 }));                    // false
console.log(deepEqual([1, [2, 3]], [1, [2, 3]]));                     // true
console.log(deepEqual(NaN, NaN));                                      // true
console.log(deepEqual(new Date('2024-01-01'), new Date('2024-01-01'))); // true
console.log(deepEqual(/abc/gi, /abc/gi));                              // true
console.log(deepEqual(/abc/g, /abc/i));                                // false
console.log(deepEqual(null, undefined));                               // false`,

  implementationTS: `function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }

  if (Number.isNaN(a) && Number.isNaN(b)) {
    return true;
  }

  if (
    a === null || b === null ||
    typeof a !== 'object' || typeof b !== 'object'
  ) {
    return false;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }

  if (a instanceof Date !== b instanceof Date) return false;
  if (a instanceof RegExp !== b instanceof RegExp) return false;

  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }

  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, key)) {
      return false;
    }
    if (!deepEqual(objA[key], objB[key])) {
      return false;
    }
  }

  return true;
}`,



  theoryAndConcepts: "SHALLOW VS DEEP EQUALITY:\n-------------------------\n\nSHALLOW (===):\n- Primitives: Compare by value\n- Objects: Compare by reference (same memory location)\n\nDEEP EQUALITY:\n- Compare structure and values recursively\n- Two different objects with same content are equal\n\nEXAMPLE:\nconst a = { x: { y: 1 } };\nconst b = { x: { y: 1 } };\na === b           // false (different references)\ndeepEqual(a, b)   // true (same structure and values)\n\nSPECIAL CASES:\n--------------\nNaN === NaN       // false (!)\n+0 === -0         // true (but Object.is says false)\nnull === null     // true\nundefined === undefined // true\n\n\n\nCOMPARISON APPROACHES:\n----------------------\n1. JSON.stringify() - Simple but loses functions, order-dependent\n2. Object.is() - Better than === for NaN and \u00b10\n3. Recursive comparison - Full control, handles all types",
  beginnerApproach: "Beginner: Basic deep equal for simple objects and arrays",
  beginnerImplementation: "function deepEqualBeginner(a, b) {\n  // Same reference or same primitive\n  if (a === b) return true;\n  \n  // Different types\n  if (typeof a !== typeof b) return false;\n  \n  // Handle null (typeof null === 'object')\n  if (a === null || b === null) return false;\n  \n  // Not objects? (primitives that are !== already)\n  if (typeof a !== 'object') return false;\n  \n  // Both are objects/arrays\n  \n  // Different constructors (Array vs Object)\n  if (a.constructor !== b.constructor) return false;\n  \n  // Compare arrays\n  if (Array.isArray(a)) {\n    if (a.length !== b.length) return false;\n    \n    for (let i = 0; i < a.length; i++) {\n      if (!deepEqualBeginner(a[i], b[i])) return false;\n    }\n    return true;\n  }\n  \n  // Compare objects\n  const keysA = Object.keys(a);\n  const keysB = Object.keys(b);\n  \n  if (keysA.length !== keysB.length) return false;\n  \n  for (const key of keysA) {\n    if (!keysB.includes(key)) return false;\n    if (!deepEqualBeginner(a[key], b[key])) return false;\n  }\n  \n  return true;\n}\n\n// Test Beginner Level\nconsole.log('=== BEGINNER LEVEL ===');\n\nconsole.log(deepEqualBeginner(1, 1));                      // true\nconsole.log(deepEqualBeginner('a', 'a'));                  // true\nconsole.log(deepEqualBeginner({ a: 1 }, { a: 1 }));        // true\nconsole.log(deepEqualBeginner([1, 2], [1, 2]));            // true\nconsole.log(deepEqualBeginner({ a: { b: 1 } }, { a: { b: 1 } })); // true\nconsole.log(deepEqualBeginner({ a: 1 }, { a: 2 }));        // false\nconsole.log(deepEqualBeginner([1, 2], [1, 2, 3]));         // false",
  intermediateApproach: "Intermediate: Handle special values (NaN, Date, RegExp)\nAdd circular reference detection",
  intermediateImplementation: "function deepEqualIntermediate(a, b, seen = new WeakMap()) {\n  // Same reference\n  if (a === b) return true;\n  \n  // Handle NaN (NaN !== NaN, but should be equal)\n  if (Number.isNaN(a) && Number.isNaN(b)) return true;\n  \n  // Null or non-objects\n  if (a === null || b === null) return a === b;\n  if (typeof a !== 'object' || typeof b !== 'object') return false;\n  \n  // Different constructors\n  if (a.constructor !== b.constructor) return false;\n  \n  // Circular reference check\n  if (seen.has(a)) {\n    return seen.get(a) === b;\n  }\n  seen.set(a, b);\n  \n  // Date comparison\n  if (a instanceof Date) {\n    return a.getTime() === b.getTime();\n  }\n  \n  // RegExp comparison\n  if (a instanceof RegExp) {\n    return a.source === b.source && a.flags === b.flags;\n  }\n  \n  // Array comparison\n  if (Array.isArray(a)) {\n    if (a.length !== b.length) return false;\n    for (let i = 0; i < a.length; i++) {\n      if (!deepEqualIntermediate(a[i], b[i], seen)) return false;\n    }\n    return true;\n  }\n  \n  // Object comparison\n  const keysA = Object.keys(a);\n  const keysB = Object.keys(b);\n  \n  if (keysA.length !== keysB.length) return false;\n  \n  for (const key of keysA) {\n    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;\n    if (!deepEqualIntermediate(a[key], b[key], seen)) return false;\n  }\n  \n  return true;\n}\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL ===');\n\n// NaN\nconsole.log('NaN:', deepEqualIntermediate(NaN, NaN)); // true\n\n// Date\nconst date1 = new Date('2024-01-01');\nconst date2 = new Date('2024-01-01');\nconsole.log('Date:', deepEqualIntermediate(date1, date2)); // true\n\n// RegExp\nconsole.log('RegExp:', deepEqualIntermediate(/test/gi, /test/gi)); // true\nconsole.log('RegExp diff:', deepEqualIntermediate(/test/g, /test/i)); // false\n\n// Circular reference\nconst obj1 = { a: 1 };\nobj1.self = obj1;\nconst obj2 = { a: 1 };\nobj2.self = obj2;\nconsole.log('Circular:', deepEqualIntermediate(obj1, obj2)); // true",
  expertApproach: "Expert: Full implementation handling all types\n- Map, Set\n- Symbol keys\n- Functions\n- ArrayBuffer, TypedArray\n- Error objects\n- Property descriptors (optional)",
  expertImplementation: "function deepEqual(a, b, options = {}) {\n  const {\n    strict = true,           // Use Object.is for -0/+0\n    compareFunctions = false, // Compare function references\n    compareSymbols = true,    // Compare Symbol properties\n    seen = new WeakMap()\n  } = options;\n  \n  // Same reference\n  if (a === b) return true;\n  \n  // Strict comparison using Object.is\n  if (strict && Object.is(a, b)) return true;\n  \n  // Handle NaN\n  if (Number.isNaN(a) && Number.isNaN(b)) return true;\n  \n  // Handle -0 and +0 in strict mode\n  if (strict && a === 0 && b === 0) {\n    return Object.is(a, b);\n  }\n  \n  // Null or undefined\n  if (a === null || b === null || a === undefined || b === undefined) {\n    return a === b;\n  }\n  \n  // Different types\n  const typeA = typeof a;\n  const typeB = typeof b;\n  \n  if (typeA !== typeB) return false;\n  \n  // Functions\n  if (typeA === 'function') {\n    if (!compareFunctions) return a === b;\n    return a.toString() === b.toString();\n  }\n  \n  // Not objects (primitive that are !== already)\n  if (typeA !== 'object') return false;\n  \n  // Different constructors\n  if (a.constructor !== b.constructor) return false;\n  \n  // Circular reference detection\n  if (seen.has(a)) {\n    return seen.get(a) === b;\n  }\n  seen.set(a, b);\n  \n  // Date\n  if (a instanceof Date) {\n    return a.getTime() === b.getTime();\n  }\n  \n  // RegExp\n  if (a instanceof RegExp) {\n    return a.source === b.source && a.flags === b.flags;\n  }\n  \n  // Error\n  if (a instanceof Error) {\n    return a.name === b.name && \n           a.message === b.message && \n           a.stack === b.stack;\n  }\n  \n  // Map\n  if (a instanceof Map) {\n    if (a.size !== b.size) return false;\n    \n    for (const [key, value] of a) {\n      // Check if key exists in b (need to find matching key for objects)\n      let found = false;\n      for (const [bKey, bValue] of b) {\n        if (deepEqual(key, bKey, { ...options, seen })) {\n          if (!deepEqual(value, bValue, { ...options, seen })) {\n            return false;\n          }\n          found = true;\n          break;\n        }\n      }\n      if (!found) return false;\n    }\n    return true;\n  }\n  \n  // Set\n  if (a instanceof Set) {\n    if (a.size !== b.size) return false;\n    \n    for (const value of a) {\n      // For primitives, simple check\n      if (typeof value !== 'object' || value === null) {\n        if (!b.has(value)) return false;\n      } else {\n        // For objects, need deep comparison\n        let found = false;\n        for (const bValue of b) {\n          if (deepEqual(value, bValue, { ...options, seen })) {\n            found = true;\n            break;\n          }\n        }\n        if (!found) return false;\n      }\n    }\n    return true;\n  }\n  \n  // ArrayBuffer\n  if (a instanceof ArrayBuffer) {\n    if (a.byteLength !== b.byteLength) return false;\n    const viewA = new Uint8Array(a);\n    const viewB = new Uint8Array(b);\n    for (let i = 0; i < viewA.length; i++) {\n      if (viewA[i] !== viewB[i]) return false;\n    }\n    return true;\n  }\n  \n  // TypedArray\n  if (ArrayBuffer.isView(a) && !(a instanceof DataView)) {\n    if (a.length !== b.length) return false;\n    for (let i = 0; i < a.length; i++) {\n      if (a[i] !== b[i]) return false;\n    }\n    return true;\n  }\n  \n  // Array\n  if (Array.isArray(a)) {\n    if (a.length !== b.length) return false;\n    for (let i = 0; i < a.length; i++) {\n      if (!deepEqual(a[i], b[i], { ...options, seen })) return false;\n    }\n    return true;\n  }\n  \n  // Plain object\n  // Get all keys including Symbols\n  const keysA = Object.keys(a);\n  const keysB = Object.keys(b);\n  \n  if (keysA.length !== keysB.length) return false;\n  \n  // Compare string keys\n  for (const key of keysA) {\n    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;\n    if (!deepEqual(a[key], b[key], { ...options, seen })) return false;\n  }\n  \n  // Compare Symbol keys\n  if (compareSymbols) {\n    const symbolsA = Object.getOwnPropertySymbols(a);\n    const symbolsB = Object.getOwnPropertySymbols(b);\n    \n    if (symbolsA.length !== symbolsB.length) return false;\n    \n    for (const sym of symbolsA) {\n      if (!symbolsB.includes(sym)) return false;\n      if (!deepEqual(a[sym], b[sym], { ...options, seen })) return false;\n    }\n  }\n  \n  return true;\n}\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL ===');\n\n// Map\nconst map1 = new Map([[{ id: 1 }, 'one'], [{ id: 2 }, 'two']]);\nconst map2 = new Map([[{ id: 1 }, 'one'], [{ id: 2 }, 'two']]);\nconsole.log('Map:', deepEqual(map1, map2)); // true\n\n// Set\nconst set1 = new Set([{ a: 1 }, { b: 2 }]);\nconst set2 = new Set([{ a: 1 }, { b: 2 }]);\nconsole.log('Set:', deepEqual(set1, set2)); // true\n\n// Symbol keys\nconst sym = Symbol('test');\nconst withSym1 = { [sym]: 'value', regular: 1 };\nconst withSym2 = { [sym]: 'value', regular: 1 };\nconsole.log('Symbol keys:', deepEqual(withSym1, withSym2)); // true\n\n// Error\nconst err1 = new Error('test');\nconst err2 = new Error('test');\nerr2.stack = err1.stack; // Match stack\nconsole.log('Error:', deepEqual(err1, err2)); // true\n\n// +0 vs -0\nconsole.log('+0 vs -0 (strict):', deepEqual(+0, -0, { strict: true })); // false\nconsole.log('+0 vs -0 (loose):', deepEqual(+0, -0, { strict: false })); // true\n\n// ArrayBuffer\nconst buf1 = new Uint8Array([1, 2, 3]).buffer;\nconst buf2 = new Uint8Array([1, 2, 3]).buffer;\nconsole.log('ArrayBuffer:', deepEqual(buf1, buf2)); // true",
  interviewTraps: [
      "console.log('\\n=== EDGE CASES ===');",
      "EDGE CASE 1: NaN",
      "console.log('NaN === NaN:', NaN === NaN); // false",
      "console.log('deepEqual(NaN, NaN):', deepEqual(NaN, NaN)); // true",
      "EDGE CASE 2: +0 and -0",
      "console.log('+0 === -0:', +0 === -0); // true",
      "console.log('Object.is(+0, -0):', Object.is(+0, -0)); // false",
      "EDGE CASE 3: Object with null prototype"
  ],
  stepByStep: [
    'Check strict equality (===) first — handles same reference and same primitives.',
    'Handle NaN: both values being NaN should return true (NaN !== NaN in JS).',
    'If either value is null or non-object, return false (different primitives already failed === check).',
    'Check for Date instances — compare using getTime() for timestamp equality.',
    'Check for RegExp instances — compare source and flags strings.',
    'Check Array.isArray consistency — an array should not equal a non-array.',
    'Compare key counts — different counts means not equal.',
    'Iterate keys of the first object: verify each key exists in the second and recursively deepEqual the values.',
    'If all keys and values match, return true.',
  ],

  timeComplexity: 'O(n) where n is the total number of properties/elements across both structures. Early bailouts make average case faster.',
  spaceComplexity: 'O(d) where d is the maximum nesting depth (recursion stack).',

  commonMistakes: [
    'Forgetting that NaN !== NaN in JavaScript — must explicitly handle this case',
    'Not comparing key counts, causing { a: 1 } to equal { a: 1, b: 2 }',
    'Using typeof null === "object" without a null guard, causing crashes on null.keys()',
    'Not handling Date and RegExp as special cases (they need value-based comparison)',
  ],

  followUps: [
    'How would you handle circular references in deep equality?',
    'How does React.memo\'s shallow comparison differ from deep equality?',
    'How would you implement a "diff" function that returns the paths where two objects differ?',
  ],
};
