import type { CodingProblem } from "../../types";

export const recursiveTransformProblem: CodingProblem = {
  id: "coding-recursive-transform",
  title: "Recursively Transform Nested Values",
  difficulty: "Intermediate",
  category: "Coding",
  tags: [
    "recursion",
    "tree-traversal",
    "data-transformation",
    "nested-structures",
    "functional",
  ],

  problem: `Implement a function that recursively traverses a deeply nested data structure (objects and arrays of arbitrary depth) and applies a transformation function to every leaf value (primitives like strings, numbers, booleans). The structure of the data must be preserved — objects remain objects, arrays remain arrays — but all primitive values are transformed.

A common use case is converting all string values to uppercase, converting all numbers to strings, sanitizing user input, or applying a formatting function across an entire API response payload. The challenge is correctly identifying leaf values vs container values (objects and arrays) and handling edge cases like null, undefined, and empty containers.

This pattern is the foundation for many utilities in data processing libraries and ORMs. It tests recursive thinking, type checking, and the ability to write generic, reusable utility functions.`,

  requirements: [
    "Accept a nested data structure and a transform function",
    "Apply the transform function to all leaf (primitive) values",
    "Preserve the structure: objects stay objects, arrays stay arrays",
    "Handle nested structures of arbitrary depth",
    "Handle null and undefined as leaf values (pass them to transform)",
    "Return a new structure without mutating the original",
    "Handle empty objects and empty arrays",
  ],

  examples: [
    {
      input: `recursiveTransform({ a: 1, b: { c: 2, d: [3, 4] } }, x => x * 2)`,
      output: `{ a: 2, b: { c: 4, d: [6, 8] } }`,
      explanation:
        "All numeric leaf values are doubled while the object/array structure is preserved.",
    },
    {
      input: `recursiveTransform({ name: "alice", info: { city: "paris" } }, s => typeof s === 'string' ? s.toUpperCase() : s)`,
      output: `{ name: "ALICE", info: { city: "PARIS" } }`,
      explanation:
        "The transform selectively uppercases strings, leaving other types unchanged.",
    },
    {
      input: `recursiveTransform([1, [2, [3, [4]]]], x => x + 10)`,
      output: `[11, [12, [13, [14]]]]`,
      explanation: "Works with nested arrays as the root container.",
    },
  ],

  edgeCases: [
    "Root value is a primitive (not an object or array)",
    "Empty objects {} and empty arrays []",
    "Null values nested inside objects",
    "Mixed-type arrays containing objects, arrays, and primitives",
    "Very deep nesting (potential stack overflow)",
  ],

  naiveApproach: `A naive approach handles only one level of nesting using Object.keys and a simple map. It doesn't recurse into nested objects or arrays, so only top-level primitives get transformed. Another common mistake is mutating the original object instead of building a new one, which causes bugs in immutable data patterns.`,

  optimalApproach: `The optimal approach uses a recursive function with clear type dispatch. If the value is an array, map over each element and recursively transform it. If the value is a non-null, non-array object, iterate over its keys and recursively transform each value, building a new object. Otherwise, it's a leaf value — apply the transform function to it directly.

The key insight is the order of checks: first check for null (since typeof null === 'object'), then check for Array.isArray, then check for typeof === 'object'. This ensures correct dispatch. The function naturally handles any depth of nesting because each recursive call handles exactly one level, and the base case (leaf value) terminates the recursion.`,

  implementation: `function recursiveTransform(value, transformFn) {
  if (Array.isArray(value)) {
    return value.map(item => recursiveTransform(item, transformFn));
  }

  if (value !== null && typeof value === 'object') {
    const result = {};
    for (const key of Object.keys(value)) {
      result[key] = recursiveTransform(value[key], transformFn);
    }
    return result;
  }

  return transformFn(value);
}

// Usage: double all numbers
const data = {
  users: [
    { name: 'Alice', scores: { math: 90, science: 85 } },
    { name: 'Bob', scores: { math: 78, science: 92 } },
  ],
  metadata: { count: 2, version: 1 },
};

const doubled = recursiveTransform(data, val =>
  typeof val === 'number' ? val * 2 : val
);
console.log(doubled);
// { users: [
//   { name: 'Alice', scores: { math: 180, science: 170 } },
//   { name: 'Bob', scores: { math: 156, science: 184 } },
// ], metadata: { count: 4, version: 2 } }

// Usage: sanitize all strings
const input = { comment: '<script>alert("xss")</script>', nested: { text: '<b>bold</b>' } };
const sanitized = recursiveTransform(input, val =>
  typeof val === 'string' ? val.replace(/</g, '&lt;').replace(/>/g, '&gt;') : val
);
console.log(sanitized);
// { comment: '&lt;script&gt;alert("xss")&lt;/script&gt;',
//   nested: { text: '&lt;b&gt;bold&lt;/b&gt;' } }`,

  implementationTS: `function recursiveTransform<T>(
  value: unknown,
  transformFn: (leaf: unknown) => T
): unknown {
  if (Array.isArray(value)) {
    return value.map(item => recursiveTransform(item, transformFn));
  }

  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>)) {
      result[key] = recursiveTransform(
        (value as Record<string, unknown>)[key],
        transformFn,
      );
    }
    return result;
  }

  return transformFn(value);
}`,

  theoryAndConcepts:
    "WHAT IS RECURSIVE TRANSFORMATION?\n---------------------------------\nWalking through an object/array structure and applying a\ntransformation function to each value.\n\nUSE CASES:\n----------\n1. Converting all strings to lowercase/uppercase\n2. Transforming dates to ISO strings\n3. Sanitizing user input\n4. Converting types (string numbers to actual numbers)\n5. Redacting sensitive data\n\nKEY CONSIDERATIONS:\n-------------------\n- Handle circular references\n- Transform keys vs values\n- Maintain object structure\n- Handle special types (Date, RegExp, etc.)",
  beginnerApproach: "Beginner: Simple recursive transformer for values",
  beginnerImplementation:
    "function transformValuesBeginner(obj, transformer) {\n  // Handle primitives\n  if (obj === null || typeof obj !== 'object') {\n    return transformer(obj);\n  }\n  \n  // Handle arrays\n  if (Array.isArray(obj)) {\n    return obj.map(item => transformValuesBeginner(item, transformer));\n  }\n  \n  // Handle objects\n  const result = {};\n  for (const key in obj) {\n    if (obj.hasOwnProperty(key)) {\n      result[key] = transformValuesBeginner(obj[key], transformer);\n    }\n  }\n  return result;\n}\n\n// Test Beginner Level\nconsole.log('=== BEGINNER LEVEL ===');\n\nconst data = {\n  name: 'JOHN',\n  details: {\n    email: 'JOHN@EXAMPLE.COM',\n    tags: ['ADMIN', 'USER']\n  }\n};\n\n// Transform all strings to lowercase\nconst lowercased = transformValuesBeginner(data, value =>\n  typeof value === 'string' ? value.toLowerCase() : value\n);\nconsole.log('Lowercased:', lowercased);\n\n// Double all numbers\nconst numbers = { a: 1, b: { c: 2, d: [3, 4] } };\nconst doubled = transformValuesBeginner(numbers, value =>\n  typeof value === 'number' ? value * 2 : value\n);\nconsole.log('Doubled:', doubled);",
  intermediateApproach:
    "Intermediate: Transform with path context and circular handling",
  intermediateImplementation:
    "function transformValuesIntermediate(obj, transformer, options = {}) {\n  const { transformKeys = false, seen = new WeakMap() } = options;\n  \n  function transform(value, path = []) {\n    // Handle primitives\n    if (value === null || typeof value !== 'object') {\n      return transformer(value, path);\n    }\n    \n    // Handle circular references\n    if (seen.has(value)) {\n      return seen.get(value);\n    }\n    \n    // Handle Date\n    if (value instanceof Date) {\n      return transformer(value, path);\n    }\n    \n    // Handle RegExp\n    if (value instanceof RegExp) {\n      return transformer(value, path);\n    }\n    \n    // Handle arrays\n    if (Array.isArray(value)) {\n      const result = [];\n      seen.set(value, result);\n      \n      for (let i = 0; i < value.length; i++) {\n        result[i] = transform(value[i], [...path, i]);\n      }\n      return result;\n    }\n    \n    // Handle objects\n    const result = {};\n    seen.set(value, result);\n    \n    for (const key in value) {\n      if (value.hasOwnProperty(key)) {\n        const newKey = transformKeys ? transformer(key, [...path, key]) : key;\n        result[newKey] = transform(value[key], [...path, key]);\n      }\n    }\n    \n    return result;\n  }\n  \n  return transform(obj);\n}\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL ===');\n\n// Transform with path context\nconst withPaths = transformValuesIntermediate(\n  { user: { name: 'John', age: 30 } },\n  (value, path) => {\n    console.log(`Path: ${path.join('.')} = ${value}`);\n    return value;\n  }\n);\n\n// Transform keys\nconst snakeCase = {\n  firstName: 'John',\n  lastName: 'Doe',\n  contactInfo: { phoneNumber: '123' }\n};\n\nconst transformedKeys = transformValuesIntermediate(\n  snakeCase,\n  (value, path) => {\n    if (typeof value === 'string' && path.length > 0) {\n      // This transforms keys\n      return value;\n    }\n    return value;\n  },\n  { transformKeys: false }\n);\n\n// Handle circular reference\nconst circular = { a: 1 };\ncircular.self = circular;\nconst transformedCircular = transformValuesIntermediate(circular, v => v);\nconsole.log('Circular handled:', transformedCircular.self === transformedCircular);",
  expertApproach:
    "Expert: Full-featured transformer with type-specific handlers",
  expertImplementation:
    "function transformDeep(obj, options = {}) {\n  const {\n    transformers = {},      // Type-specific transformers\n    defaultTransformer = v => v,\n    transformKeys = false,\n    keyTransformer = k => k,\n    maxDepth = Infinity,\n    skipTypes = [],         // Types to skip\n    seen = new WeakMap()\n  } = options;\n  \n  function getType(value) {\n    if (value === null) return 'null';\n    if (Array.isArray(value)) return 'array';\n    if (value instanceof Date) return 'date';\n    if (value instanceof RegExp) return 'regexp';\n    if (value instanceof Map) return 'map';\n    if (value instanceof Set) return 'set';\n    return typeof value;\n  }\n  \n  function transform(value, path = [], depth = 0) {\n    const type = getType(value);\n    \n    // Skip certain types\n    if (skipTypes.includes(type)) {\n      return value;\n    }\n    \n    // Max depth reached\n    if (depth > maxDepth) {\n      return value;\n    }\n    \n    // Apply type-specific transformer or default\n    const transformer = transformers[type] || defaultTransformer;\n    \n    // Handle primitives and special types\n    if (['null', 'undefined', 'boolean', 'number', 'string', 'symbol', 'bigint'].includes(type)) {\n      return transformer(value, path, depth);\n    }\n    \n    // Handle Date\n    if (type === 'date') {\n      return transformer(value, path, depth);\n    }\n    \n    // Handle RegExp\n    if (type === 'regexp') {\n      return transformer(value, path, depth);\n    }\n    \n    // Handle circular references\n    if (seen.has(value)) {\n      return seen.get(value);\n    }\n    \n    // Handle Map\n    if (type === 'map') {\n      const result = new Map();\n      seen.set(value, result);\n      \n      value.forEach((v, k) => {\n        const newKey = transformKeys ? transform(k, [...path, k], depth + 1) : k;\n        result.set(newKey, transform(v, [...path, k], depth + 1));\n      });\n      \n      return transformer(result, path, depth);\n    }\n    \n    // Handle Set\n    if (type === 'set') {\n      const result = new Set();\n      seen.set(value, result);\n      \n      value.forEach(v => {\n        result.add(transform(v, path, depth + 1));\n      });\n      \n      return transformer(result, path, depth);\n    }\n    \n    // Handle Array\n    if (type === 'array') {\n      const result = [];\n      seen.set(value, result);\n      \n      for (let i = 0; i < value.length; i++) {\n        result[i] = transform(value[i], [...path, i], depth + 1);\n      }\n      \n      return transformer(result, path, depth);\n    }\n    \n    // Handle Object\n    const result = {};\n    seen.set(value, result);\n    \n    for (const key of [...Object.keys(value), ...Object.getOwnPropertySymbols(value)]) {\n      const newKey = transformKeys ? keyTransformer(key, path) : key;\n      result[newKey] = transform(value[key], [...path, key], depth + 1);\n    }\n    \n    return transformer(result, path, depth);\n  }\n  \n  return transform(obj);\n}\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL ===');\n\n// Type-specific transformers\nconst complexData = {\n  name: 'John',\n  age: 30,\n  active: true,\n  created: new Date('2024-01-01'),\n  pattern: /test/gi,\n  scores: [85, 90, 95],\n  metadata: new Map([['key', 'value']]),\n  tags: new Set(['a', 'b'])\n};\n\nconst transformed = transformDeep(complexData, {\n  transformers: {\n    string: (v) => v.toUpperCase(),\n    number: (v) => v * 2,\n    date: (v) => v.toISOString(),\n    array: (v) => v.reverse()\n  }\n});\n\nconsole.log('Transformed:', transformed);\n\n// Redact sensitive data based on path\nconst userData = {\n  user: {\n    name: 'John',\n    password: 'secret123',\n    email: 'john@example.com',\n    profile: {\n      ssn: '123-45-6789'\n    }\n  }\n};\n\nconst sensitiveFields = ['password', 'ssn'];\n\nconst redacted = transformDeep(userData, {\n  defaultTransformer: (value, path) => {\n    const lastKey = path[path.length - 1];\n    if (sensitiveFields.includes(lastKey)) {\n      return '[REDACTED]';\n    }\n    return value;\n  }\n});\n\nconsole.log('Redacted:', JSON.stringify(redacted, null, 2));",
  stepByStep: [
    "Check if the value is an array — if so, return a new array by mapping each element through recursiveTransform.",
    "Check if the value is a non-null object — if so, create a new empty object.",
    "Iterate over the object's keys and recursively transform each value, assigning to the new object.",
    "If the value is neither array nor object, it's a leaf value — apply the transform function to it.",
    "Return the transformed value (new array, new object, or transformed leaf).",
    "The recursion naturally bottoms out at leaf values, handling any depth of nesting.",
  ],

  timeComplexity:
    "O(n) where n is the total number of values (both leaf and container) in the structure.",
  spaceComplexity:
    "O(n) for the new cloned structure, plus O(d) recursion stack for maximum nesting depth d.",

  commonMistakes: [
    'Checking typeof before checking for null (typeof null === "object" causes recursion into null)',
    "Mutating the original object/array instead of creating new ones",
    "Not handling arrays separately from objects (arrays should use map, not Object.keys)",
    "Applying the transform to container values instead of only leaf values",
  ],

  followUps: [
    'How would you also provide the key path to the transform function (e.g., "users.0.name")?',
    "How would you handle circular references in the structure?",
    "How would you allow the transform function to skip certain branches (e.g., stop recursing into specific keys)?",
  ],
};
