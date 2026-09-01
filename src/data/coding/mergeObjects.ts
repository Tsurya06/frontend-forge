import type { CodingProblem } from "../../types";

export const mergeObjectsProblem: CodingProblem = {
  id: "coding-merge-objects",
  title: "Deep Merge Two Objects",
  difficulty: "Intermediate",
  category: "Coding",
  tags: ["recursion", "objects", "deep-merge", "utility", "data-structures"],

  problem: `Implement a deep merge function that combines two objects into one. Unlike Object.assign or the spread operator which only perform a shallow merge (overwriting nested objects entirely), a deep merge should recursively merge nested objects so that properties from both sources are preserved at every level.

For example, merging { a: { b: 1, c: 2 } } with { a: { c: 3, d: 4 } } should produce { a: { b: 1, c: 3, d: 4 } }. A shallow merge would replace the entire 'a' object. The function must handle arrays (with a configurable strategy — concatenation or replacement), null values, and mixed types where one side has a primitive and the other has an object.

Deep merging is used extensively in configuration management (merging default configs with overrides), state management (Redux reducers), and API response normalization.`,

  requirements: [
    "Recursively merge nested plain objects from both sources",
    "Values in the second object (source) take precedence for non-object values",
    "When both values are plain objects, recurse into them instead of replacing",
    "Handle arrays — default strategy: source array replaces target array",
    "Handle null values correctly (null is not an object to recurse into)",
    "Return a new object without mutating either input",
    "Handle properties that exist in only one of the two objects",
  ],

  examples: [
    {
      input: `deepMerge({ a: 1, b: { c: 2, d: 3 } }, { b: { c: 10, e: 5 }, f: 6 })`,
      output: `{ a: 1, b: { c: 10, d: 3, e: 5 }, f: 6 }`,
      explanation:
        'Top-level keys are merged. Nested object "b" is recursively merged: c is overwritten, d is preserved, e is added.',
    },
    {
      input: `deepMerge({ arr: [1, 2], x: { y: 1 } }, { arr: [3, 4], x: null })`,
      output: `{ arr: [3, 4], x: null }`,
      explanation:
        "Arrays are replaced (not merged). Null in source overwrites the nested object.",
    },
    {
      input: `deepMerge({ a: { b: { c: 1 } } }, { a: { b: { d: 2 } } })`,
      output: `{ a: { b: { c: 1, d: 2 } } }`,
      explanation:
        "Deep nesting is handled correctly — all levels are recursively merged.",
    },
  ],

  edgeCases: [
    "One or both inputs are null or undefined",
    "Merging a primitive value with an object at the same key",
    "Deeply nested structures with 5+ levels",
    "Keys with undefined values (should they be preserved or omitted?)",
    "Arrays containing objects (merge by index vs concatenate)",
  ],

  naiveApproach: `A naive approach uses Object.assign or spread at each level. You iterate the source keys and for each one, check if both target and source have object values — if so, recursively merge. But a common mistake is mutating the target object directly instead of creating a new one, or not checking for null (since typeof null === 'object').`,

  optimalApproach: `The optimal approach creates a helper function isPlainObject that checks if a value is a non-null, non-array object (using typeof and constructor checks). The merge function creates a new result object, copies all keys from the target, then iterates source keys. For each source key, if both the existing result value and the source value are plain objects, recursively merge them. Otherwise, the source value overwrites.

This produces a clean, immutable merge that never mutates the inputs. By starting with a shallow clone of the target and then layering source properties, we ensure all target-only keys are preserved while source keys take precedence. The recursion only activates when both sides are plain objects, preventing bugs with arrays, dates, or null values.`,

  implementation: `function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function deepMerge(target, source) {
  if (!isPlainObject(target) || !isPlainObject(source)) {
    return source;
  }

  const result = {};

  const allKeys = new Set([
    ...Object.keys(target),
    ...Object.keys(source),
  ]);

  for (const key of allKeys) {
    const targetVal = target[key];
    const sourceVal = source[key];

    if (key in source && key in target) {
      if (isPlainObject(targetVal) && isPlainObject(sourceVal)) {
        result[key] = deepMerge(targetVal, sourceVal);
      } else {
        result[key] = sourceVal;
      }
    } else if (key in source) {
      result[key] = sourceVal;
    } else {
      result[key] = targetVal;
    }
  }

  return result;
}

// Usage
const defaults = {
  theme: { color: 'blue', fontSize: 14, font: { family: 'Arial' } },
  debug: false,
  features: ['basic'],
};

const userConfig = {
  theme: { color: 'red', font: { weight: 'bold' } },
  debug: true,
};

const merged = deepMerge(defaults, userConfig);
console.log(merged);
// {
//   theme: { color: 'red', fontSize: 14, font: { family: 'Arial', weight: 'bold' } },
//   debug: true,
//   features: ['basic']
// }`,

  implementationTS: `function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function deepMerge<
  T extends Record<string, unknown>,
  S extends Record<string, unknown>,
>(target: T, source: S): T & S {
  if (!isPlainObject(target) || !isPlainObject(source)) {
    return source as T & S;
  }

  const result: Record<string, unknown> = {};

  const allKeys = new Set([
    ...Object.keys(target),
    ...Object.keys(source),
  ]);

  for (const key of allKeys) {
    const targetVal = target[key];
    const sourceVal = source[key];

    if (key in source && key in target) {
      if (isPlainObject(targetVal) && isPlainObject(sourceVal)) {
        result[key] = deepMerge(
          targetVal as Record<string, unknown>,
          sourceVal as Record<string, unknown>,
        );
      } else {
        result[key] = sourceVal;
      }
    } else if (key in source) {
      result[key] = sourceVal;
    } else {
      result[key] = targetVal;
    }
  }

  return result as T & S;
}`,

  theoryAndConcepts:
    "SHALLOW MERGE VS DEEP MERGE:\n----------------------------\n\nSHALLOW MERGE (Object.assign, spread):\nconst merged = { ...obj1, ...obj2 };\n- Only merges top-level properties\n- Nested objects are replaced, not merged\n\nExample:\nobj1 = { a: { x: 1, y: 2 } }\nobj2 = { a: { z: 3 } }\nShallow: { a: { z: 3 } }      // obj1.a is lost!\nDeep:    { a: { x: 1, y: 2, z: 3 } }  // Merged!\n\nUSE CASES:\n----------\n1. Configuration objects (defaults + user config)\n2. State management (partial updates)\n3. API response merging\n4. Theme customization\n\n\n\nKEY CONSIDERATIONS:\n-------------------\n1. How to handle arrays? (Replace, concat, merge by index)\n2. How to handle null/undefined? (Replace or skip)\n3. How to handle circular references?\n4. Mutate original or return new object?",
  beginnerApproach:
    "Beginner: Simple deep merge (mutates target)\nOnly handles plain objects and primitives",
  beginnerImplementation:
    "function deepMergeBeginner(target, source) {\n  // Loop through source properties\n  for (const key in source) {\n    if (source.hasOwnProperty(key)) {\n      const sourceValue = source[key];\n      const targetValue = target[key];\n      \n      // If both are plain objects, recurse\n      if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {\n        deepMergeBeginner(targetValue, sourceValue);\n      } else {\n        // Otherwise, overwrite\n        target[key] = sourceValue;\n      }\n    }\n  }\n  \n  return target;\n}\n\n// Helper: Check if value is a plain object\nfunction isPlainObject(value) {\n  return value !== null && \n         typeof value === 'object' && \n         !Array.isArray(value);\n}\n\n// Test Beginner Level\nconsole.log('=== BEGINNER LEVEL ===');\n\nconst config1 = {\n  database: { host: 'localhost', port: 5432 },\n  logging: true\n};\n\nconst config2 = {\n  database: { port: 3306, name: 'mydb' },\n  cache: true\n};\n\nconst merged = deepMergeBeginner({ ...config1 }, config2);\nconsole.log('Merged:', JSON.stringify(merged, null, 2));\n// { database: { host: 'localhost', port: 3306, name: 'mydb' }, logging: true, cache: true }",
  intermediateApproach:
    "Intermediate: Immutable deep merge with array handling\nReturns new object, doesn't mutate originals",
  intermediateImplementation:
    "function deepMergeIntermediate(target, source, options = {}) {\n  const {\n    arrayStrategy = 'replace' // 'replace' | 'concat' | 'merge'\n  } = options;\n  \n  // Handle non-objects\n  if (!isPlainObject(source)) {\n    return source;\n  }\n  \n  if (!isPlainObject(target)) {\n    return deepClone(source);\n  }\n  \n  // Create new object (immutable)\n  const result = { ...target };\n  \n  for (const key in source) {\n    if (source.hasOwnProperty(key)) {\n      const sourceValue = source[key];\n      const targetValue = target[key];\n      \n      // Both are plain objects - recurse\n      if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {\n        result[key] = deepMergeIntermediate(targetValue, sourceValue, options);\n      }\n      // Both are arrays - apply strategy\n      else if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {\n        switch (arrayStrategy) {\n          case 'concat':\n            result[key] = [...targetValue, ...sourceValue];\n            break;\n          case 'merge':\n            // Merge by index\n            result[key] = sourceValue.map((item, index) => {\n              if (isPlainObject(item) && isPlainObject(targetValue[index])) {\n                return deepMergeIntermediate(targetValue[index], item, options);\n              }\n              return item;\n            });\n            // Include any extra items from target\n            if (targetValue.length > sourceValue.length) {\n              result[key] = [...result[key], ...targetValue.slice(sourceValue.length)];\n            }\n            break;\n          case 'replace':\n          default:\n            result[key] = [...sourceValue];\n        }\n      }\n      // Otherwise, use source value\n      else {\n        result[key] = deepClone(sourceValue);\n      }\n    }\n  }\n  \n  return result;\n}\n\n// Helper: Simple deep clone\nfunction deepClone(value) {\n  if (value === null || typeof value !== 'object') {\n    return value;\n  }\n  \n  if (Array.isArray(value)) {\n    return value.map(deepClone);\n  }\n  \n  const result = {};\n  for (const key in value) {\n    if (value.hasOwnProperty(key)) {\n      result[key] = deepClone(value[key]);\n    }\n  }\n  return result;\n}\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL ===');\n\nconst base = {\n  name: 'App',\n  settings: { theme: 'dark', fontSize: 14 },\n  plugins: ['plugin1', 'plugin2']\n};\n\nconst override = {\n  settings: { fontSize: 16, language: 'en' },\n  plugins: ['plugin3']\n};\n\nconsole.log('Replace arrays:', deepMergeIntermediate(base, override));\nconsole.log('Concat arrays:', deepMergeIntermediate(base, override, { arrayStrategy: 'concat' }));",
  expertApproach:
    "Expert: Full-featured deep merge\n- Custom merge functions per key\n- Circular reference handling\n- Symbol keys support\n- Multiple sources\n- Skip undefined option",
  expertImplementation:
    "function deepMergeExpert(...args) {\n  // Last argument can be options\n  let options = {};\n  let sources = args;\n  \n  if (args.length > 0 && args[args.length - 1]?._isOptions) {\n    options = args[args.length - 1];\n    sources = args.slice(0, -1);\n  }\n  \n  const {\n    arrayStrategy = 'replace',\n    skipUndefined = false,\n    skipNull = false,\n    customMerge = {},  // { 'key.path': (target, source) => merged }\n    circular = new WeakMap()\n  } = options;\n  \n  if (sources.length === 0) return {};\n  if (sources.length === 1) return deepCloneExpert(sources[0], circular);\n  \n  // Merge all sources from left to right\n  return sources.reduce((acc, source) => {\n    return mergeTwo(acc, source, '', options, circular);\n  });\n}\n\nfunction mergeTwo(target, source, path, options, seen) {\n  const { arrayStrategy, skipUndefined, skipNull, customMerge } = options;\n  \n  // Handle primitives and special values\n  if (source === undefined && skipUndefined) return target;\n  if (source === null && skipNull) return target;\n  if (source === null || typeof source !== 'object') return source;\n  if (target === null || typeof target !== 'object') return deepCloneExpert(source, seen);\n  \n  // Check for circular reference\n  if (seen.has(source)) {\n    return seen.get(source);\n  }\n  \n  // Handle arrays\n  if (Array.isArray(source)) {\n    if (!Array.isArray(target)) {\n      return deepCloneExpert(source, seen);\n    }\n    \n    let result;\n    switch (arrayStrategy) {\n      case 'concat':\n        result = [...target, ...source.map(s => deepCloneExpert(s, seen))];\n        break;\n      case 'merge':\n        result = source.map((item, i) => {\n          if (i < target.length) {\n            return mergeTwo(target[i], item, `${path}[${i}]`, options, seen);\n          }\n          return deepCloneExpert(item, seen);\n        });\n        if (target.length > source.length) {\n          result = [...result, ...target.slice(source.length).map(t => deepCloneExpert(t, seen))];\n        }\n        break;\n      case 'unique':\n        // Combine and remove duplicates (for primitives)\n        result = [...new Set([...target, ...source])];\n        break;\n      default:\n        result = source.map(s => deepCloneExpert(s, seen));\n    }\n    seen.set(source, result);\n    return result;\n  }\n  \n  // Handle plain objects\n  const result = { ...target };\n  seen.set(source, result);\n  \n  // Get all keys including symbols\n  const keys = [\n    ...Object.keys(source),\n    ...Object.getOwnPropertySymbols(source)\n  ];\n  \n  for (const key of keys) {\n    const keyPath = path ? `${path}.${String(key)}` : String(key);\n    \n    // Check for custom merge function\n    if (customMerge[keyPath]) {\n      result[key] = customMerge[keyPath](target[key], source[key]);\n      continue;\n    }\n    \n    const sourceValue = source[key];\n    const targetValue = target[key];\n    \n    // Skip undefined/null if configured\n    if (sourceValue === undefined && skipUndefined) continue;\n    if (sourceValue === null && skipNull) continue;\n    \n    // Recursive merge for objects\n    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {\n      result[key] = mergeTwo(targetValue, sourceValue, keyPath, options, seen);\n    }\n    // Array handling\n    else if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {\n      result[key] = mergeTwo(targetValue, sourceValue, keyPath, options, seen);\n    }\n    // Direct assignment\n    else {\n      result[key] = deepCloneExpert(sourceValue, seen);\n    }\n  }\n  \n  return result;\n}\n\nfunction deepCloneExpert(value, seen = new WeakMap()) {\n  if (value === null || typeof value !== 'object') return value;\n  if (seen.has(value)) return seen.get(value);\n  \n  if (value instanceof Date) return new Date(value);\n  if (value instanceof RegExp) return new RegExp(value.source, value.flags);\n  if (value instanceof Map) {\n    const cloned = new Map();\n    seen.set(value, cloned);\n    value.forEach((v, k) => cloned.set(deepCloneExpert(k, seen), deepCloneExpert(v, seen)));\n    return cloned;\n  }\n  if (value instanceof Set) {\n    const cloned = new Set();\n    seen.set(value, cloned);\n    value.forEach(v => cloned.add(deepCloneExpert(v, seen)));\n    return cloned;\n  }\n  \n  if (Array.isArray(value)) {\n    const cloned = [];\n    seen.set(value, cloned);\n    value.forEach((item, i) => cloned[i] = deepCloneExpert(item, seen));\n    return cloned;\n  }\n  \n  const cloned = {};\n  seen.set(value, cloned);\n  \n  for (const key of [...Object.keys(value), ...Object.getOwnPropertySymbols(value)]) {\n    cloned[key] = deepCloneExpert(value[key], seen);\n  }\n  \n  return cloned;\n}\n\n// Create options helper\ndeepMergeExpert.options = (opts) => ({ ...opts, _isOptions: true });\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL ===');\n\n// Multiple sources\nconst defaults = { a: 1, b: { c: 2 } };\nconst userConfig = { b: { d: 3 } };\nconst runtimeConfig = { b: { e: 4 }, f: 5 };\n\nconsole.log('Multiple sources:', deepMergeExpert(defaults, userConfig, runtimeConfig));\n\n// Custom merge function\nconst result = deepMergeExpert(\n  { score: 10, items: [1, 2] },\n  { score: 5, items: [3] },\n  deepMergeExpert.options({\n    customMerge: {\n      'score': (target, source) => target + source,  // Sum scores\n    },\n    arrayStrategy: 'concat'\n  })\n);\nconsole.log('Custom merge:', result); // { score: 15, items: [1, 2, 3] }\n\n// Skip undefined\nconst withUndefined = deepMergeExpert(\n  { a: 1, b: 2 },\n  { a: undefined, b: 3 },\n  deepMergeExpert.options({ skipUndefined: true })\n);\nconsole.log('Skip undefined:', withUndefined); // { a: 1, b: 3 }",
  interviewTraps: [
    "console.log('\\n=== EDGE CASES ===');",
    "EDGE CASE 1: Prototype pollution",
    "Never merge __proto__ or constructor",
    "function safeMerge(target, source) {",
    "const dangerousKeys = ['__proto__', 'constructor', 'prototype'];",
    "for (const key in source) {",
    "if (dangerousKeys.includes(key)) continue; // Skip dangerous keys",
    "if (source.hasOwnProperty(key)) {",
  ],
  stepByStep: [
    "Create a helper isPlainObject to check if a value is a non-null, non-array object with Object.prototype.",
    "If either target or source is not a plain object, return source (source wins for primitives).",
    "Create an empty result object and collect all unique keys from both target and source.",
    "For each key, check if it exists in both objects.",
    "If both values are plain objects, recursively deepMerge them.",
    "If not both plain objects, use the source value (source takes precedence).",
    "If the key exists only in target or only in source, copy that value directly.",
    "Return the new result object.",
  ],

  timeComplexity:
    "O(n) where n is the total number of keys across all nested levels of both objects.",
  spaceComplexity:
    "O(n) for the new merged object, plus O(d) recursion stack for nesting depth d.",

  commonMistakes: [
    'Not checking for null before recursing (typeof null === "object" is a classic JS gotcha)',
    "Mutating the target object instead of creating a new result (breaks immutability)",
    "Treating arrays as plain objects and merging by index instead of replacing",
    "Forgetting to handle keys that only exist in one of the two inputs",
  ],

  followUps: [
    "How would you implement an array merge strategy option (concat, replace, merge-by-index)?",
    "How would you merge more than two objects (variadic deep merge)?",
    "How does this compare to lodash.merge or lodash.defaultsDeep?",
  ],
};
