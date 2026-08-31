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
