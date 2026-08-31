import type { CodingProblem } from '../../types';

export const flattenArrayProblem: CodingProblem = {
  id: 'coding-flatten',
  title: 'Flatten Array: Recursive, Depth-Limited, and Iterative',
  difficulty: 'Intermediate',
  category: 'Coding',
  tags: ['arrays', 'recursion', 'iteration', 'stack', 'depth-control'],

  problem: `Implement a function to flatten a deeply nested array into a single-level array. Provide three variations: (1) full recursive flatten that removes all nesting, (2) depth-limited flatten that only flattens up to a specified number of levels (like Array.prototype.flat(depth)), and (3) an iterative version using a stack that avoids recursion entirely.

Array flattening is a fundamental operation in data processing. The native Array.prototype.flat() method was added in ES2019, but implementing it from scratch is a common interview question because it tests recursion, iteration with explicit stacks, and understanding of depth control. The iterative version is especially interesting because it demonstrates how to convert a recursive algorithm to an iterative one using a stack — a technique applicable to many tree/graph problems.

Your implementations should handle mixed-type arrays (elements that are a mix of arrays and non-arrays), empty arrays, and very deeply nested structures (where recursion might hit the call stack limit, making the iterative version necessary).`,

  requirements: [
    'flattenRecursive: Fully flatten nested arrays to a single level',
    'flattenDepth: Flatten only up to a specified depth (depth=1 flattens one level)',
    'flattenIterative: Flatten without recursion using an explicit stack',
    'Preserve non-array elements in their original order',
    'Handle empty arrays at any nesting level',
    'Handle mixed content (arrays and non-arrays at the same level)',
    'Do not mutate the original array',
  ],

  examples: [
    {
      input: 'flattenRecursive([1, [2, [3, [4, [5]]]]])',
      output: '[1, 2, 3, 4, 5]',
      explanation: 'All levels of nesting are removed.',
    },
    {
      input: 'flattenDepth([1, [2, [3, [4]]]], 2)',
      output: '[1, 2, 3, [4]]',
      explanation: 'Only 2 levels are flattened. The innermost [4] remains nested.',
    },
    {
      input: 'flattenIterative([1, [2, 3], [4, [5, 6]]])',
      output: '[1, 2, 3, 4, 5, 6]',
      explanation: 'Same result as recursive but using a stack internally.',
    },
  ],

  edgeCases: [
    'Already flat array (no nesting) — return copy of original',
    'Empty nested arrays: [1, [], [2, [], 3]]',
    'Depth of 0 (should return a shallow copy, no flattening)',
    'Infinity as depth (should fully flatten)',
    'Very deeply nested arrays (1000+ levels) — recursive version may stack overflow',
  ],

  naiveApproach: `A naive approach for the recursive version uses concat in a reduce: arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), []). While correct, creating new arrays with concat at every step is inefficient — O(n^2) in the worst case due to repeated array copying. The naive depth-limited version often passes depth incorrectly (e.g., not decrementing, or decrementing too early).`,

  optimalApproach: `The optimal recursive version uses a result array and pushes to it directly instead of creating intermediate arrays with concat. A helper function takes the input array and the result array, iterates elements, and either pushes non-arrays directly or recurses into nested arrays. This is O(n) where n is the total number of elements.

The depth-limited version adds a depth parameter: if depth > 0 and the element is an array, recurse with depth - 1. If depth is 0, push the element as-is (even if it's an array).

The iterative version uses a stack initialized with the input elements (in reverse order to maintain left-to-right processing). Pop from the stack: if the popped element is not an array, push to result. If it is an array, push its elements onto the stack in reverse order. Continue until the stack is empty. This avoids recursion entirely and handles arbitrary depth without stack overflow.`,

  implementation: `// Recursive full flatten
function flattenRecursive(arr) {
  const result = [];

  function helper(items) {
    for (const item of items) {
      if (Array.isArray(item)) {
        helper(item);
      } else {
        result.push(item);
      }
    }
  }

  helper(arr);
  return result;
}

// Depth-limited flatten
function flattenDepth(arr, depth = 1) {
  const result = [];

  function helper(items, currentDepth) {
    for (const item of items) {
      if (Array.isArray(item) && currentDepth > 0) {
        helper(item, currentDepth - 1);
      } else {
        result.push(item);
      }
    }
  }

  helper(arr, depth);
  return result;
}

// Iterative flatten using stack
function flattenIterative(arr) {
  const stack = [...arr];
  const result = [];

  while (stack.length > 0) {
    const item = stack.pop();

    if (Array.isArray(item)) {
      stack.push(...item);
    } else {
      result.push(item);
    }
  }

  result.reverse();
  return result;
}

// Usage
console.log(flattenRecursive([1, [2, [3, [4, [5]]]]]));
// [1, 2, 3, 4, 5]

console.log(flattenDepth([1, [2, [3, [4]]]], 1));
// [1, 2, [3, [4]]]

console.log(flattenDepth([1, [2, [3, [4]]]], 2));
// [1, 2, 3, [4]]

console.log(flattenIterative([1, [2, 3], [4, [5, [6]]]]));
// [1, 2, 3, 4, 5, 6]

console.log(flattenDepth([1, [2, [3]]], 0));
// [1, [2, [3]]]

console.log(flattenRecursive([1, [], [2, [], [3, []]]]));
// [1, 2, 3]`,

  implementationTS: `function flattenRecursive<T>(arr: (T | T[])[]): T[] {
  const result: T[] = [];

  function helper(items: unknown[]): void {
    for (const item of items) {
      if (Array.isArray(item)) {
        helper(item);
      } else {
        result.push(item as T);
      }
    }
  }

  helper(arr);
  return result;
}

function flattenDepth(arr: unknown[], depth: number = 1): unknown[] {
  const result: unknown[] = [];

  function helper(items: unknown[], currentDepth: number): void {
    for (const item of items) {
      if (Array.isArray(item) && currentDepth > 0) {
        helper(item, currentDepth - 1);
      } else {
        result.push(item);
      }
    }
  }

  helper(arr, depth);
  return result;
}

function flattenIterative<T>(arr: (T | T[])[]): T[] {
  const stack: unknown[] = [...arr];
  const result: T[] = [];

  while (stack.length > 0) {
    const item = stack.pop();

    if (Array.isArray(item)) {
      stack.push(...item);
    } else {
      result.push(item as T);
    }
  }

  result.reverse();
  return result;
}`,

  stepByStep: [
    'Recursive: Create an outer result array and an inner helper that iterates each element.',
    'If the element is an array, recurse into it. If not, push it to the result.',
    'Depth-limited: Add a depth parameter. Only recurse if depth > 0, decrementing each level.',
    'If depth reaches 0, push the element as-is (even if it\'s an array).',
    'Iterative: Initialize a stack with the input array elements.',
    'Pop from the stack: if it\'s an array, push its elements back onto the stack; if not, add to result.',
    'Since stack processes in reverse (LIFO), reverse the result at the end to restore original order.',
  ],

  timeComplexity: 'O(n) for all versions where n is the total number of elements across all nesting levels.',
  spaceComplexity: 'O(n) for the output array. Recursive versions also use O(d) call stack where d is max depth. Iterative uses O(n) for the explicit stack.',

  commonMistakes: [
    'Using concat in a loop creating O(n^2) copies instead of pushing to a shared result array',
    'In the iterative version, forgetting to reverse the result (stack reverses order)',
    'Not decrementing depth correctly in the depth-limited version',
    'Mutating the original array instead of creating a new result',
  ],

  followUps: [
    'How does Array.prototype.flat(Infinity) differ from your implementation?',
    'How would you implement a depth-limited iterative version?',
    'How would you flatten an object\'s nested keys into dot-notation paths?',
  ],
};
