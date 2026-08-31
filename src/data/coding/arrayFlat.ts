import type { CodingProblem } from '../../types';

export const arrayFlatProblem: CodingProblem = {
  id: 'coding-array-flat',
  title: 'Array.flat Polyfill with Depth',
  difficulty: 'Intermediate',
  category: 'Coding',
  tags: ['arrays', 'recursion', 'polyfill', 'depth', 'flattening'],

  problem: `Implement a polyfill for \`Array.prototype.flat(depth)\` that flattens a nested array up to the specified depth. The default depth is 1, meaning only the first level of nesting is flattened. A depth of Infinity flattens all levels completely.

The native Array.flat was introduced in ES2019 and is not available in older environments. Understanding how to build this polyfill demonstrates mastery of recursion with controlled depth, array manipulation, and handling of sparse arrays (holes). It's a frequently asked interview question because it tests recursive thinking, base case identification, and iterative alternatives.

Your implementation should handle arrays of arbitrary nesting depth, sparse arrays (arrays with holes/empty slots), and should not mutate the original array. It should match the behavior of the native Array.prototype.flat as closely as possible.`,

  requirements: [
    'Flatten a nested array up to the specified depth level',
    'Default depth should be 1 if not provided',
    'Depth of Infinity should flatten all levels completely',
    'Depth of 0 should return a shallow copy (no flattening)',
    'Handle sparse arrays by skipping holes (matching native behavior)',
    'Do not mutate the original array',
    'Handle non-array elements by including them as-is in the result',
  ],

  examples: [
    {
      input: `flat([1, [2, [3, [4]]]], 1)`,
      output: `[1, 2, [3, [4]]]`,
      explanation: 'With depth 1, only the first level of nesting is removed. Inner arrays beyond depth 1 remain as-is.',
    },
    {
      input: `flat([1, [2, [3, [4]]]], Infinity)`,
      output: `[1, 2, 3, 4]`,
      explanation: 'With Infinity depth, all nesting levels are flattened into a single flat array.',
    },
    {
      input: `flat([1, [2, 3], [4, [5, 6]]], 0)`,
      output: `[1, [2, 3], [4, [5, 6]]]`,
      explanation: 'Depth 0 returns a shallow copy of the array without any flattening.',
    },
  ],

  edgeCases: [
    'Empty array should return an empty array',
    'Array with no nested arrays returns a shallow copy',
    'Sparse arrays (holes) — holes should be removed, matching native flat behavior',
    'Depth is a negative number — should behave like depth 0 (no flattening)',
    'Very deeply nested arrays with Infinity depth',
    'Arrays containing mixed types (objects, strings, numbers, null, undefined) alongside nested arrays',
  ],

  naiveApproach: `A naive approach uses toString() or JSON.stringify to flatten and re-parse, but this loses type information and fails on non-primitive values. Another common naive solution recursively flattens without respecting the depth parameter, always flattening completely regardless of the requested depth. This doesn't match the native behavior where depth controls how many levels to unwrap.`,

  optimalApproach: `The optimal recursive approach iterates through each element of the array. For each element, check if it is an array and the current depth is greater than 0. If so, recursively flatten that element with depth - 1 and spread or concat the results. If the element is not an array or depth has reached 0, push the element as-is into the result.

An iterative stack-based approach also works well: use a stack of [element, depth] pairs. Pop from the stack, and if the element is an array and depth > 0, push its children with depth - 1. Otherwise, add to the result. Since stacks are LIFO, push children in reverse order to maintain the original sequence. Both approaches achieve O(n) time where n is the total number of elements in the fully flattened result. The recursive approach is cleaner; the iterative approach avoids stack overflow on extremely deep arrays.`,

  implementation: `function flat(arr, depth = 1) {
  const result = [];

  function flatten(items, currentDepth) {
    for (let i = 0; i < items.length; i++) {
      if (!(i in items)) continue;

      const item = items[i];
      if (Array.isArray(item) && currentDepth > 0) {
        flatten(item, currentDepth - 1);
      } else {
        result.push(item);
      }
    }
  }

  flatten(arr, depth);
  return result;
}

function flatIterative(arr, depth = 1) {
  const stack = arr.map((item) => [item, depth]);
  const result = [];

  while (stack.length > 0) {
    const [item, d] = stack.shift();
    if (Array.isArray(item) && d > 0) {
      for (let i = 0; i < item.length; i++) {
        stack.splice(i, 0, [item[i], d - 1]);
      }
    } else {
      result.push(item);
    }
  }

  return result;
}

function flatReduce(arr, depth = 1) {
  return depth > 0
    ? arr.reduce(
        (acc, item) =>
          acc.concat(Array.isArray(item) ? flatReduce(item, depth - 1) : item),
        []
      )
    : arr.slice();
}

// Usage
console.log(flat([1, [2, [3, [4, [5]]]]], 1));
// [1, 2, [3, [4, [5]]]]

console.log(flat([1, [2, [3, [4, [5]]]]], 2));
// [1, 2, 3, [4, [5]]]

console.log(flat([1, [2, [3, [4, [5]]]]], Infinity));
// [1, 2, 3, 4, 5]

console.log(flat([1, [2, 3], [4, [5, 6]]], 0));
// [1, [2, 3], [4, [5, 6]]]

// Sparse array handling
const sparse = [1, , 3, [4, , 6]];
console.log(flat(sparse, 1));
// [1, 3, 4, 6] — holes are removed

// Reduce approach
console.log(flatReduce([1, [2, [3]]], 1));
// [1, 2, [3]]`,

  stepByStep: [
    'Create a result array to collect flattened elements.',
    'Define an inner recursive function that takes items and currentDepth.',
    'Iterate through each element in items using a for loop (to handle sparse arrays).',
    'Skip holes by checking if the index exists in the array (i in items).',
    'If the element is an array AND currentDepth > 0, recurse with currentDepth - 1.',
    'Otherwise, push the element directly into the result array.',
    'Call the inner function with the original array and the requested depth.',
    'Return the result array.',
  ],

  timeComplexity: 'O(n) where n is the total number of elements after flattening to the requested depth.',
  spaceComplexity: 'O(n) for the result array, plus O(d) recursion stack depth where d is the flattening depth.',

  commonMistakes: [
    'Ignoring the depth parameter and always flattening completely',
    'Not handling sparse arrays — using forEach or for...of skips holes differently than the native flat',
    'Mutating the original array instead of creating a new one',
    'Using concat without recursion, which only flattens one level regardless of depth parameter',
  ],

  followUps: [
    'How would you implement Array.prototype.flatMap as a polyfill?',
    'What are the performance differences between the recursive and iterative approaches?',
    'How would you handle flattening iterables (not just arrays) like Sets and generators?',
    'How does the native Array.flat handle sparse arrays vs. Array.from?',
  ],
};
