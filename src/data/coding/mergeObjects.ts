import type { CodingProblem } from '../../types';

export const mergeObjectsProblem: CodingProblem = {
  id: 'coding-merge-objects',
  title: 'Deep Merge Two Objects',
  difficulty: 'Intermediate',
  category: 'Coding',
  tags: ['recursion', 'objects', 'deep-merge', 'utility', 'data-structures'],

  problem: `Implement a deep merge function that combines two objects into one. Unlike Object.assign or the spread operator which only perform a shallow merge (overwriting nested objects entirely), a deep merge should recursively merge nested objects so that properties from both sources are preserved at every level.

For example, merging { a: { b: 1, c: 2 } } with { a: { c: 3, d: 4 } } should produce { a: { b: 1, c: 3, d: 4 } }. A shallow merge would replace the entire 'a' object. The function must handle arrays (with a configurable strategy — concatenation or replacement), null values, and mixed types where one side has a primitive and the other has an object.

Deep merging is used extensively in configuration management (merging default configs with overrides), state management (Redux reducers), and API response normalization.`,

  requirements: [
    'Recursively merge nested plain objects from both sources',
    'Values in the second object (source) take precedence for non-object values',
    'When both values are plain objects, recurse into them instead of replacing',
    'Handle arrays — default strategy: source array replaces target array',
    'Handle null values correctly (null is not an object to recurse into)',
    'Return a new object without mutating either input',
    'Handle properties that exist in only one of the two objects',
  ],

  examples: [
    {
      input: `deepMerge({ a: 1, b: { c: 2, d: 3 } }, { b: { c: 10, e: 5 }, f: 6 })`,
      output: `{ a: 1, b: { c: 10, d: 3, e: 5 }, f: 6 }`,
      explanation: 'Top-level keys are merged. Nested object "b" is recursively merged: c is overwritten, d is preserved, e is added.',
    },
    {
      input: `deepMerge({ arr: [1, 2], x: { y: 1 } }, { arr: [3, 4], x: null })`,
      output: `{ arr: [3, 4], x: null }`,
      explanation: 'Arrays are replaced (not merged). Null in source overwrites the nested object.',
    },
    {
      input: `deepMerge({ a: { b: { c: 1 } } }, { a: { b: { d: 2 } } })`,
      output: `{ a: { b: { c: 1, d: 2 } } }`,
      explanation: 'Deep nesting is handled correctly — all levels are recursively merged.',
    },
  ],

  edgeCases: [
    'One or both inputs are null or undefined',
    'Merging a primitive value with an object at the same key',
    'Deeply nested structures with 5+ levels',
    'Keys with undefined values (should they be preserved or omitted?)',
    'Arrays containing objects (merge by index vs concatenate)',
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

  stepByStep: [
    'Create a helper isPlainObject to check if a value is a non-null, non-array object with Object.prototype.',
    'If either target or source is not a plain object, return source (source wins for primitives).',
    'Create an empty result object and collect all unique keys from both target and source.',
    'For each key, check if it exists in both objects.',
    'If both values are plain objects, recursively deepMerge them.',
    'If not both plain objects, use the source value (source takes precedence).',
    'If the key exists only in target or only in source, copy that value directly.',
    'Return the new result object.',
  ],

  timeComplexity: 'O(n) where n is the total number of keys across all nested levels of both objects.',
  spaceComplexity: 'O(n) for the new merged object, plus O(d) recursion stack for nesting depth d.',

  commonMistakes: [
    'Not checking for null before recursing (typeof null === "object" is a classic JS gotcha)',
    'Mutating the target object instead of creating a new result (breaks immutability)',
    'Treating arrays as plain objects and merging by index instead of replacing',
    'Forgetting to handle keys that only exist in one of the two inputs',
  ],

  followUps: [
    'How would you implement an array merge strategy option (concat, replace, merge-by-index)?',
    'How would you merge more than two objects (variadic deep merge)?',
    'How does this compare to lodash.merge or lodash.defaultsDeep?',
  ],
};
