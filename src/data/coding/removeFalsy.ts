import type { CodingProblem } from '../../types';

export const removeFalsyProblem: CodingProblem = {
  id: 'coding-remove-falsy',
  title: 'Remove Falsy Values from Nested Object',
  difficulty: 'Intermediate',
  category: 'Coding',
  tags: ['recursion', 'objects', 'filtering', 'data-cleaning', 'nested-structures'],

  problem: `Implement a function that recursively removes all falsy values from a deeply nested object. Falsy values in JavaScript are: false, 0, -0, 0n, "", null, undefined, and NaN. The function should traverse objects and arrays at every level, removing falsy entries.

For objects, remove keys whose values are falsy. For arrays, filter out falsy elements. For nested objects and arrays, recurse into them first, then check if the resulting object/array is empty — if so, remove it too (since an empty object or array after cleaning provides no useful data).

This is a practical data-cleaning utility used in form processing (removing empty fields before submission), API payload optimization (reducing transfer size), configuration merging (stripping unset values), and database query building (omitting null parameters). It tests recursive traversal, type checking, and the nuanced definition of "falsy" in JavaScript.`,

  requirements: [
    'Remove all falsy values (false, 0, "", null, undefined, NaN) from objects',
    'Filter falsy values from arrays',
    'Recursively process nested objects and arrays',
    'Remove empty objects ({}) and empty arrays ([]) that result from cleaning',
    'Preserve truthy values including objects, arrays, strings, numbers',
    'Return a new structure without mutating the original',
    'Handle the root value being falsy (return undefined or empty object)',
  ],

  examples: [
    {
      input: `removeFalsy({ a: 1, b: null, c: { d: "", e: 2, f: undefined }, g: false })`,
      output: `{ a: 1, c: { e: 2 } }`,
      explanation: 'null, empty string, undefined, and false are removed. The nested object c retains only its truthy value e.',
    },
    {
      input: `removeFalsy({ a: [1, 0, null, 2, "", 3], b: { c: { d: null } } })`,
      output: `{ a: [1, 2, 3] }`,
      explanation: 'Array is filtered. Nested object b.c becomes empty after removing d:null, then b becomes empty, so both are removed.',
    },
    {
      input: `removeFalsy({ x: 0, y: "hello", z: { nested: NaN } })`,
      output: `{ y: "hello" }`,
      explanation: '0 and NaN are falsy. The nested object with only NaN becomes empty and is removed.',
    },
  ],

  edgeCases: [
    'All values are falsy (should return empty object or undefined)',
    'Deeply nested structure where cleaning propagates upward',
    'Arrays containing objects that become empty after cleaning',
    'Value 0 is falsy — important distinction from "zero is valid data" use cases',
    'Empty string "" is falsy — may need a custom predicate for form data',
  ],

  naiveApproach: `A naive approach only removes top-level falsy values using Object.entries and filter, ignoring nested structures. Another common mistake is removing falsy values but not cleaning up the resulting empty objects/arrays, leading to hollow structures like { a: {}, b: [] } that are effectively empty but still present. A third mistake is mutating the original object instead of creating a clean copy.`,

  optimalApproach: `The optimal approach uses a recursive function with bottom-up cleaning. For arrays: map each element through the function recursively, then filter out falsy values and empty containers. For objects: iterate keys, recursively clean each value, and only include the key in the result if the cleaned value is truthy and not an empty container.

The "bottom-up" strategy is key: clean the deepest levels first, then check if the resulting container is empty. This naturally handles cases where nested objects become empty after their children are removed. A helper function isEmptyContainer checks if a value is {} or [], and is used after recursive cleaning to decide whether to include the value.

For flexibility, accepting a custom predicate instead of the default Boolean check allows users to customize what counts as "falsy" (e.g., keeping 0 but removing null).`,

  implementation: `function removeFalsy(value, predicate) {
  const shouldRemove = predicate || ((v) => !v && v !== undefined);

  function isEmptyContainer(v) {
    if (Array.isArray(v)) return v.length === 0;
    if (v && typeof v === 'object') return Object.keys(v).length === 0;
    return false;
  }

  function clean(val) {
    if (Array.isArray(val)) {
      const cleaned = val
        .map(item => clean(item))
        .filter(item => {
          if (isEmptyContainer(item)) return false;
          return !!item || item === 0 || item === false;
        });
      return cleaned;
    }

    if (val !== null && typeof val === 'object') {
      const result = {};
      for (const key of Object.keys(val)) {
        const cleaned = clean(val[key]);
        if (isEmptyContainer(cleaned)) continue;
        if (!cleaned && cleaned !== 0 && cleaned !== false) continue;
        result[key] = cleaned;
      }
      return result;
    }

    return val;
  }

  const result = clean(value);
  if (isEmptyContainer(result)) return Array.isArray(value) ? [] : {};
  return result;
}

// Stricter version that removes all JS falsy values
function removeFalsyStrict(value) {
  function isEmptyContainer(v) {
    if (Array.isArray(v)) return v.length === 0;
    if (v && typeof v === 'object') return Object.keys(v).length === 0;
    return false;
  }

  function clean(val) {
    if (Array.isArray(val)) {
      return val
        .map(item => clean(item))
        .filter(item => !isEmptyContainer(item) && Boolean(item));
    }

    if (val !== null && typeof val === 'object') {
      const result = {};
      for (const key of Object.keys(val)) {
        const cleaned = clean(val[key]);
        if (!Boolean(cleaned) || isEmptyContainer(cleaned)) continue;
        result[key] = cleaned;
      }
      return result;
    }

    return val;
  }

  const result = clean(value);
  return isEmptyContainer(result) ? (Array.isArray(value) ? [] : {}) : result;
}

// Usage
const formData = {
  name: 'Alice',
  age: 0,
  email: '',
  address: {
    street: '123 Main St',
    apt: null,
    city: '',
    state: 'CA',
    details: { floor: undefined, notes: '' },
  },
  tags: ['dev', '', null, 'admin'],
  preferences: { theme: null, lang: undefined },
};

console.log(removeFalsyStrict(formData));
// {
//   name: 'Alice',
//   address: { street: '123 Main St', state: 'CA' },
//   tags: ['dev', 'admin']
// }`,

  implementationTS: `function removeFalsyStrict(value: unknown): unknown {
  function isEmptyContainer(v: unknown): boolean {
    if (Array.isArray(v)) return v.length === 0;
    if (v && typeof v === 'object') return Object.keys(v).length === 0;
    return false;
  }

  function clean(val: unknown): unknown {
    if (Array.isArray(val)) {
      return val
        .map(item => clean(item))
        .filter(item => !isEmptyContainer(item) && Boolean(item));
    }

    if (val !== null && typeof val === 'object') {
      const result: Record<string, unknown> = {};
      const obj = val as Record<string, unknown>;
      for (const key of Object.keys(obj)) {
        const cleaned = clean(obj[key]);
        if (!Boolean(cleaned) || isEmptyContainer(cleaned)) continue;
        result[key] = cleaned;
      }
      return result;
    }

    return val;
  }

  const result = clean(value);
  return isEmptyContainer(result)
    ? (Array.isArray(value) ? [] : {})
    : result;
}`,

  stepByStep: [
    'Define a helper isEmptyContainer to check if a value is an empty array or empty object.',
    'For arrays: recursively clean each element via map, then filter out falsy values and empty containers.',
    'For objects: iterate keys, recursively clean each value, skip falsy or empty container results.',
    'For primitives: return the value as-is (the parent will decide whether to include it).',
    'The bottom-up approach ensures nested empty containers are detected after their children are cleaned.',
    'After the root-level clean, check if the result itself is an empty container.',
  ],

  timeComplexity: 'O(n) where n is the total number of values in the nested structure.',
  spaceComplexity: 'O(n) for the new cleaned structure, plus O(d) recursion depth.',

  commonMistakes: [
    'Not handling the typeof null === "object" gotcha, causing crashes when recursing into null',
    'Removing 0 or false when they should be treated as valid data (depends on use case)',
    'Not cleaning up empty containers after removing their children',
    'Mutating the original object instead of building a new one',
  ],

  followUps: [
    'How would you make this configurable — e.g., keep 0 and false but remove null and undefined?',
    'How would you implement the inverse: extract all paths with falsy values for validation errors?',
    'How would you handle this with immutable data structures (e.g., Immer)?',
  ],
};
