import type { CodingProblem } from '../../types';

export const mergeSortedArraysProblem: CodingProblem = {
  id: 'coding-merge-sorted',
  title: 'Merge Two Sorted Arrays In Place',
  difficulty: 'Intermediate',
  category: 'Coding',
  tags: ['arrays', 'two-pointers', 'sorting', 'in-place', 'algorithms'],

  problem: `Implement a function that merges two sorted arrays into a single sorted array. The first array has enough trailing space (filled with zeros or empty slots) to accommodate all elements from the second array. The merge must happen in-place in the first array, without creating a new array.

This is a classic algorithm question (LeetCode 88) that tests understanding of the two-pointer technique. The key insight is to fill the first array from the end rather than the beginning — this avoids overwriting elements that haven't been processed yet. Starting from the back, compare the largest remaining elements from both arrays and place the larger one at the current end position.

The function takes: arr1 (the first sorted array with trailing space), m (number of valid elements in arr1), arr2 (the second sorted array), and n (number of elements in arr2). After merging, arr1 should contain all m + n elements in sorted order.`,

  requirements: [
    'Merge arr2 into arr1 in-place without creating a new array',
    'Maintain sorted order in the final merged array',
    'arr1 has length m + n with the last n positions available for merging',
    'Handle cases where all elements of one array are larger than the other',
    'Handle empty arr2 (n = 0) — arr1 remains unchanged',
    'Handle empty valid portion of arr1 (m = 0) — copy all of arr2 into arr1',
    'Both input arrays are already sorted in ascending order',
  ],

  examples: [
    {
      input: `merge([1, 3, 5, 0, 0, 0], 3, [2, 4, 6], 3)`,
      output: `arr1 becomes [1, 2, 3, 4, 5, 6]`,
      explanation: 'Starting from the end, compare 5 vs 6 → place 6, then 5 vs 4 → place 5, continue until all elements are placed.',
    },
    {
      input: `merge([4, 5, 6, 0, 0, 0], 3, [1, 2, 3], 3)`,
      output: `arr1 becomes [1, 2, 3, 4, 5, 6]`,
      explanation: 'All elements of arr2 are smaller, so they fill the front while arr1 elements shift to the back.',
    },
    {
      input: `merge([1, 0], 1, [2], 1)`,
      output: `arr1 becomes [1, 2]`,
      explanation: 'Simple case: 2 > 1, so 2 goes at index 1. Then 1 stays at index 0.',
    },
  ],

  edgeCases: [
    'arr2 is empty (n = 0) — arr1 should remain unchanged',
    'arr1 has no valid elements (m = 0) — all arr2 elements are copied in',
    'All arr2 elements are smaller than all arr1 elements',
    'All arr2 elements are larger than all arr1 elements',
    'Duplicate values across both arrays',
    'Single element arrays',
  ],

  naiveApproach: `The naive approach concatenates both arrays, sorts the result, and copies it back into arr1. This works but has O((m+n) log(m+n)) time complexity instead of O(m+n). Another naive approach tries to merge from the front, which requires shifting elements right to make room for smaller arr2 elements, resulting in O(m*n) time in the worst case.`,

  optimalApproach: `The optimal approach uses three pointers and works from right to left. Pointer p1 starts at index m - 1 (last valid element in arr1), pointer p2 starts at index n - 1 (last element in arr2), and pointer write starts at index m + n - 1 (last position in arr1). At each step, compare arr1[p1] and arr2[p2], place the larger value at arr1[write], and decrement the corresponding pointer and write.

This right-to-left strategy is the key insight: since we're filling from the end of arr1's available space, we never overwrite elements that still need to be compared. When p1 goes below 0, copy remaining arr2 elements. When p2 goes below 0, the remaining arr1 elements are already in place. This achieves O(m + n) time with O(1) extra space — truly in-place with no auxiliary array.`,

  implementation: `function merge(arr1, m, arr2, n) {
  let p1 = m - 1;
  let p2 = n - 1;
  let write = m + n - 1;

  while (p1 >= 0 && p2 >= 0) {
    if (arr1[p1] > arr2[p2]) {
      arr1[write] = arr1[p1];
      p1--;
    } else {
      arr1[write] = arr2[p2];
      p2--;
    }
    write--;
  }

  while (p2 >= 0) {
    arr1[write] = arr2[p2];
    p2--;
    write--;
  }
}

// Usage
const nums1 = [1, 3, 5, 7, 0, 0, 0, 0];
merge(nums1, 4, [2, 4, 6, 8], 4);
console.log(nums1);
// [1, 2, 3, 4, 5, 6, 7, 8]

const nums2 = [4, 5, 6, 0, 0, 0];
merge(nums2, 3, [1, 2, 3], 3);
console.log(nums2);
// [1, 2, 3, 4, 5, 6]

const nums3 = [0];
merge(nums3, 0, [1], 1);
console.log(nums3);
// [1]

const nums4 = [1];
merge(nums4, 1, [], 0);
console.log(nums4);
// [1]

// Also provide a version that returns a new array for comparison
function mergeSorted(arr1, arr2) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] <= arr2[j]) {
      result.push(arr1[i]);
      i++;
    } else {
      result.push(arr2[j]);
      j++;
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }

  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

console.log(mergeSorted([1, 3, 5], [2, 4, 6]));
// [1, 2, 3, 4, 5, 6]

console.log(mergeSorted([1, 1, 2], [1, 3, 3]));
// [1, 1, 1, 2, 3, 3]`,



  theoryAndConcepts: "PROBLEM STATEMENT:\n------------------\nGiven two sorted arrays nums1 and nums2, merge nums2 into nums1\nas one sorted array IN-PLACE.\n\nnums1 has enough space (zeros at the end) to hold all elements.\n\nCONSTRAINTS:\n------------\n- nums1.length = m + n (m actual elements + n zeros)\n- nums2.length = n\n- Both arrays are sorted in ascending order\n- Must be done in O(1) extra space (in-place)\n\nKEY INSIGHT:\n------------\nMerge from the END to avoid overwriting elements!\nIf you merge from the start, you'd overwrite nums1 elements.\n\nVISUAL:\n-------\nnums1 = [1, 3, 5, 0, 0, 0], m = 3\nnums2 = [2, 4, 6], n = 3\n\nStart from end:\nCompare 5 and 6: 6 > 5, place 6 at position 5\nCompare 5 and 4: 5 > 4, place 5 at position 4\nCompare 3 and 4: 4 > 3, place 4 at position 3\nAnd so on...",
  beginnerApproach: "Beginner: Simple approach (not in-place)\nCreates new array - easy to understand",
  beginnerImplementation: "function mergeSortedBeginner(nums1, nums2) {\n  const result = [];\n  let i = 0, j = 0;\n  \n  while (i < nums1.length && j < nums2.length) {\n    if (nums1[i] <= nums2[j]) {\n      result.push(nums1[i]);\n      i++;\n    } else {\n      result.push(nums2[j]);\n      j++;\n    }\n  }\n  \n  // Add remaining elements\n  while (i < nums1.length) {\n    result.push(nums1[i]);\n    i++;\n  }\n  \n  while (j < nums2.length) {\n    result.push(nums2[j]);\n    j++;\n  }\n  \n  return result;\n}\n\n// Test Beginner Level\nconsole.log('=== BEGINNER LEVEL ===');\n\nconsole.log('Merge [1,3,5] and [2,4,6]:');\nconsole.log(mergeSortedBeginner([1, 3, 5], [2, 4, 6]));\n// [1, 2, 3, 4, 5, 6]",
  intermediateApproach: "Intermediate: In-place merge (LeetCode 88)\nMerge from the end to avoid overwriting",
  intermediateImplementation: "function mergeSortedInPlace(nums1, m, nums2, n) {\n  // Start from the end of both arrays\n  let i = m - 1;      // Last actual element in nums1\n  let j = n - 1;      // Last element in nums2\n  let k = m + n - 1;  // Last position in nums1\n  \n  // Merge from the end\n  while (i >= 0 && j >= 0) {\n    if (nums1[i] > nums2[j]) {\n      nums1[k] = nums1[i];\n      i--;\n    } else {\n      nums1[k] = nums2[j];\n      j--;\n    }\n    k--;\n  }\n  \n  // If nums2 has remaining elements, copy them\n  // (No need to copy remaining nums1 - they're already in place)\n  while (j >= 0) {\n    nums1[k] = nums2[j];\n    j--;\n    k--;\n  }\n  \n  return nums1;\n}\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL ===');\n\nconst nums1 = [1, 3, 5, 0, 0, 0];\nconst m = 3;\nconst nums2 = [2, 4, 6];\nconst n = 3;\n\nconsole.log('Before:', [...nums1]);\nmergeSortedInPlace(nums1, m, nums2, n);\nconsole.log('After:', nums1);\n// [1, 2, 3, 4, 5, 6]\n\n// Another example\nconst arr1 = [1, 2, 3, 0, 0, 0];\nconst arr2 = [2, 5, 6];\nmergeSortedInPlace(arr1, 3, arr2, 3);\nconsole.log('Example 2:', arr1);\n// [1, 2, 2, 3, 5, 6]",
  expertApproach: "Expert: Handle edge cases and variations\n\n\nExpert: Merge K sorted arrays\n\n\nExpert: Merge with duplicates handling\n\n\nExpert: Merge sorted arrays maintaining original positions (stable)",
  expertImplementation: "function mergeSortedExpert(nums1, m, nums2, n) {\n  // Edge cases\n  if (n === 0) return nums1;\n  if (m === 0) {\n    for (let i = 0; i < n; i++) {\n      nums1[i] = nums2[i];\n    }\n    return nums1;\n  }\n  \n  let i = m - 1;\n  let j = n - 1;\n  let k = m + n - 1;\n  \n  while (j >= 0) {\n    // Use short-circuit: if i < 0, just copy from nums2\n    if (i >= 0 && nums1[i] > nums2[j]) {\n      nums1[k--] = nums1[i--];\n    } else {\n      nums1[k--] = nums2[j--];\n    }\n  }\n  \n  return nums1;\n}\n\nfunction mergeKSorted(arrays) {\n  if (arrays.length === 0) return [];\n  if (arrays.length === 1) return arrays[0];\n  \n  // Divide and conquer approach\n  while (arrays.length > 1) {\n    const merged = [];\n    \n    for (let i = 0; i < arrays.length; i += 2) {\n      if (i + 1 < arrays.length) {\n        merged.push(mergeSortedBeginner(arrays[i], arrays[i + 1]));\n      } else {\n        merged.push(arrays[i]);\n      }\n    }\n    \n    arrays = merged;\n  }\n  \n  return arrays[0];\n}\n\nfunction mergeSortedUnique(nums1, nums2) {\n  const merged = mergeSortedBeginner(nums1, nums2);\n  return [...new Set(merged)];\n}\n\nfunction mergeWithIndices(nums1, nums2) {\n  const result = [];\n  const indices = [];  // Track which array each element came from\n  let i = 0, j = 0;\n  \n  while (i < nums1.length && j < nums2.length) {\n    if (nums1[i] <= nums2[j]) {\n      result.push(nums1[i]);\n      indices.push({ value: nums1[i], source: 1, originalIndex: i });\n      i++;\n    } else {\n      result.push(nums2[j]);\n      indices.push({ value: nums2[j], source: 2, originalIndex: j });\n      j++;\n    }\n  }\n  \n  while (i < nums1.length) {\n    result.push(nums1[i]);\n    indices.push({ value: nums1[i], source: 1, originalIndex: i });\n    i++;\n  }\n  \n  while (j < nums2.length) {\n    result.push(nums2[j]);\n    indices.push({ value: nums2[j], source: 2, originalIndex: j });\n    j++;\n  }\n  \n  return { merged: result, indices };\n}\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL ===');\n\n// Edge case: one array empty\nconst e1 = [1, 2, 3, 0, 0];\nmergeSortedExpert(e1, 3, [4, 5], 2);\nconsole.log('One empty:', e1);\n\nconst e2 = [0, 0, 0];\nmergeSortedExpert(e2, 0, [1, 2, 3], 3);\nconsole.log('First empty:', e2);\n\n// Merge K sorted\nconsole.log('Merge K:', mergeKSorted([[1, 4, 7], [2, 5, 8], [3, 6, 9]]));\n// [1, 2, 3, 4, 5, 6, 7, 8, 9]\n\n// Merge unique\nconsole.log('Merge unique:', mergeSortedUnique([1, 2, 2, 3], [2, 3, 4, 5]));\n// [1, 2, 3, 4, 5]\n\n// With indices\nconsole.log('With indices:', mergeWithIndices([1, 3, 5], [2, 4]));",
  interviewTraps: [
      "QUICK REFERENCE:",
      "1. Merge from END to avoid overwriting",
      "2. i = m-1, j = n-1, k = m+n-1",
      "3. Only need to copy remaining nums2 (nums1 already in place)",
      "INTERVIEW TIPS:",
      "1. Clarify: is nums1 large enough?",
      "2. Ask about edge cases (empty arrays)",
      "3. Explain why merge from end"
  ],
  stepByStep: [
    'Initialize pointer p1 at the last valid element of arr1 (index m - 1).',
    'Initialize pointer p2 at the last element of arr2 (index n - 1).',
    'Initialize write pointer at the last position of arr1 (index m + n - 1).',
    'While both p1 and p2 are valid (>= 0), compare arr1[p1] and arr2[p2].',
    'Place the larger value at arr1[write], decrement the source pointer and write pointer.',
    'After the main loop, if p2 >= 0 still, copy remaining arr2 elements into arr1.',
    'No need to copy remaining arr1 elements — they are already in the correct positions.',
  ],

  timeComplexity: 'O(m + n) — each element is visited and placed exactly once.',
  spaceComplexity: 'O(1) — the merge is done in-place using only pointer variables.',

  commonMistakes: [
    'Merging from left to right — this overwrites arr1 elements that have not been compared yet',
    'Forgetting to handle remaining arr2 elements after the main loop exits',
    'Not realizing that remaining arr1 elements are already in place (no copy needed)',
    'Off-by-one errors on pointer initialization — p1 starts at m-1, not m',
  ],

  followUps: [
    'How would you merge K sorted arrays efficiently?',
    'How does this relate to the merge step in merge sort?',
    'How would you merge two sorted linked lists in place?',
    'What if the arrays contain duplicates — how would you merge and deduplicate?',
  ],
};
