import type { CodingProblem } from '../../types';

export const recursiveTransformProblem: CodingProblem = {
  id: 'coding-recursive-transform',
  title: 'Recursively Transform Nested Values',
  difficulty: 'Intermediate',
  category: 'Coding',
  tags: ['recursion', 'tree-traversal', 'data-transformation', 'nested-structures', 'functional'],

  problem: `Implement a function that recursively traverses a deeply nested data structure (objects and arrays of arbitrary depth) and applies a transformation function to every leaf value (primitives like strings, numbers, booleans). The structure of the data must be preserved — objects remain objects, arrays remain arrays — but all primitive values are transformed.

A common use case is converting all string values to uppercase, converting all numbers to strings, sanitizing user input, or applying a formatting function across an entire API response payload. The challenge is correctly identifying leaf values vs container values (objects and arrays) and handling edge cases like null, undefined, and empty containers.

This pattern is the foundation for many utilities in data processing libraries and ORMs. It tests recursive thinking, type checking, and the ability to write generic, reusable utility functions.`,

  requirements: [
    'Accept a nested data structure and a transform function',
    'Apply the transform function to all leaf (primitive) values',
    'Preserve the structure: objects stay objects, arrays stay arrays',
    'Handle nested structures of arbitrary depth',
    'Handle null and undefined as leaf values (pass them to transform)',
    'Return a new structure without mutating the original',
    'Handle empty objects and empty arrays',
  ],

  examples: [
    {
      input: `recursiveTransform({ a: 1, b: { c: 2, d: [3, 4] } }, x => x * 2)`,
      output: `{ a: 2, b: { c: 4, d: [6, 8] } }`,
      explanation: 'All numeric leaf values are doubled while the object/array structure is preserved.',
    },
    {
      input: `recursiveTransform({ name: "alice", info: { city: "paris" } }, s => typeof s === 'string' ? s.toUpperCase() : s)`,
      output: `{ name: "ALICE", info: { city: "PARIS" } }`,
      explanation: 'The transform selectively uppercases strings, leaving other types unchanged.',
    },
    {
      input: `recursiveTransform([1, [2, [3, [4]]]], x => x + 10)`,
      output: `[11, [12, [13, [14]]]]`,
      explanation: 'Works with nested arrays as the root container.',
    },
  ],

  edgeCases: [
    'Root value is a primitive (not an object or array)',
    'Empty objects {} and empty arrays []',
    'Null values nested inside objects',
    'Mixed-type arrays containing objects, arrays, and primitives',
    'Very deep nesting (potential stack overflow)',
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

  stepByStep: [
    'Check if the value is an array — if so, return a new array by mapping each element through recursiveTransform.',
    'Check if the value is a non-null object — if so, create a new empty object.',
    'Iterate over the object\'s keys and recursively transform each value, assigning to the new object.',
    'If the value is neither array nor object, it\'s a leaf value — apply the transform function to it.',
    'Return the transformed value (new array, new object, or transformed leaf).',
    'The recursion naturally bottoms out at leaf values, handling any depth of nesting.',
  ],

  timeComplexity: 'O(n) where n is the total number of values (both leaf and container) in the structure.',
  spaceComplexity: 'O(n) for the new cloned structure, plus O(d) recursion stack for maximum nesting depth d.',

  commonMistakes: [
    'Checking typeof before checking for null (typeof null === "object" causes recursion into null)',
    'Mutating the original object/array instead of creating new ones',
    'Not handling arrays separately from objects (arrays should use map, not Object.keys)',
    'Applying the transform to container values instead of only leaf values',
  ],

  followUps: [
    'How would you also provide the key path to the transform function (e.g., "users.0.name")?',
    'How would you handle circular references in the structure?',
    'How would you allow the transform function to skip certain branches (e.g., stop recursing into specific keys)?',
  ],
};
