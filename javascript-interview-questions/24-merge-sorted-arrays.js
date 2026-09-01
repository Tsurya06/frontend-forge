/**
 * ============================================
 * MERGE SORTED ARRAYS IN-PLACE - Complete Guide
 * ============================================
 * 
 * Topic: Merge two sorted arrays in place of the first array
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * PROBLEM STATEMENT:
 * ------------------
 * Given two sorted arrays nums1 and nums2, merge nums2 into nums1
 * as one sorted array IN-PLACE.
 * 
 * nums1 has enough space (zeros at the end) to hold all elements.
 * 
 * CONSTRAINTS:
 * ------------
 * - nums1.length = m + n (m actual elements + n zeros)
 * - nums2.length = n
 * - Both arrays are sorted in ascending order
 * - Must be done in O(1) extra space (in-place)
 * 
 * KEY INSIGHT:
 * ------------
 * Merge from the END to avoid overwriting elements!
 * If you merge from the start, you'd overwrite nums1 elements.
 * 
 * VISUAL:
 * -------
 * nums1 = [1, 3, 5, 0, 0, 0], m = 3
 * nums2 = [2, 4, 6], n = 3
 * 
 * Start from end:
 * Compare 5 and 6: 6 > 5, place 6 at position 5
 * Compare 5 and 4: 5 > 4, place 5 at position 4
 * Compare 3 and 4: 4 > 3, place 4 at position 3
 * And so on...
 */

// ============================================
// BEGINNER LEVEL
// ============================================

/**
 * Beginner: Simple approach (not in-place)
 * Creates new array - easy to understand
 */
function mergeSortedBeginner(nums1, nums2) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] <= nums2[j]) {
      result.push(nums1[i]);
      i++;
    } else {
      result.push(nums2[j]);
      j++;
    }
  }
  
  // Add remaining elements
  while (i < nums1.length) {
    result.push(nums1[i]);
    i++;
  }
  
  while (j < nums2.length) {
    result.push(nums2[j]);
    j++;
  }
  
  return result;
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

console.log('Merge [1,3,5] and [2,4,6]:');
console.log(mergeSortedBeginner([1, 3, 5], [2, 4, 6]));
// [1, 2, 3, 4, 5, 6]


// ============================================
// INTERMEDIATE LEVEL (The Actual Problem)
// ============================================

/**
 * Intermediate: In-place merge (LeetCode 88)
 * Merge from the end to avoid overwriting
 */
function mergeSortedInPlace(nums1, m, nums2, n) {
  // Start from the end of both arrays
  let i = m - 1;      // Last actual element in nums1
  let j = n - 1;      // Last element in nums2
  let k = m + n - 1;  // Last position in nums1
  
  // Merge from the end
  while (i >= 0 && j >= 0) {
    if (nums1[i] > nums2[j]) {
      nums1[k] = nums1[i];
      i--;
    } else {
      nums1[k] = nums2[j];
      j--;
    }
    k--;
  }
  
  // If nums2 has remaining elements, copy them
  // (No need to copy remaining nums1 - they're already in place)
  while (j >= 0) {
    nums1[k] = nums2[j];
    j--;
    k--;
  }
  
  return nums1;
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');

const nums1 = [1, 3, 5, 0, 0, 0];
const m = 3;
const nums2 = [2, 4, 6];
const n = 3;

console.log('Before:', [...nums1]);
mergeSortedInPlace(nums1, m, nums2, n);
console.log('After:', nums1);
// [1, 2, 3, 4, 5, 6]

// Another example
const arr1 = [1, 2, 3, 0, 0, 0];
const arr2 = [2, 5, 6];
mergeSortedInPlace(arr1, 3, arr2, 3);
console.log('Example 2:', arr1);
// [1, 2, 2, 3, 5, 6]


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: Handle edge cases and variations
 */
function mergeSortedExpert(nums1, m, nums2, n) {
  // Edge cases
  if (n === 0) return nums1;
  if (m === 0) {
    for (let i = 0; i < n; i++) {
      nums1[i] = nums2[i];
    }
    return nums1;
  }
  
  let i = m - 1;
  let j = n - 1;
  let k = m + n - 1;
  
  while (j >= 0) {
    // Use short-circuit: if i < 0, just copy from nums2
    if (i >= 0 && nums1[i] > nums2[j]) {
      nums1[k--] = nums1[i--];
    } else {
      nums1[k--] = nums2[j--];
    }
  }
  
  return nums1;
}

/**
 * Expert: Merge K sorted arrays
 */
function mergeKSorted(arrays) {
  if (arrays.length === 0) return [];
  if (arrays.length === 1) return arrays[0];
  
  // Divide and conquer approach
  while (arrays.length > 1) {
    const merged = [];
    
    for (let i = 0; i < arrays.length; i += 2) {
      if (i + 1 < arrays.length) {
        merged.push(mergeSortedBeginner(arrays[i], arrays[i + 1]));
      } else {
        merged.push(arrays[i]);
      }
    }
    
    arrays = merged;
  }
  
  return arrays[0];
}

/**
 * Expert: Merge with duplicates handling
 */
function mergeSortedUnique(nums1, nums2) {
  const merged = mergeSortedBeginner(nums1, nums2);
  return [...new Set(merged)];
}

/**
 * Expert: Merge sorted arrays maintaining original positions (stable)
 */
function mergeWithIndices(nums1, nums2) {
  const result = [];
  const indices = [];  // Track which array each element came from
  let i = 0, j = 0;
  
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] <= nums2[j]) {
      result.push(nums1[i]);
      indices.push({ value: nums1[i], source: 1, originalIndex: i });
      i++;
    } else {
      result.push(nums2[j]);
      indices.push({ value: nums2[j], source: 2, originalIndex: j });
      j++;
    }
  }
  
  while (i < nums1.length) {
    result.push(nums1[i]);
    indices.push({ value: nums1[i], source: 1, originalIndex: i });
    i++;
  }
  
  while (j < nums2.length) {
    result.push(nums2[j]);
    indices.push({ value: nums2[j], source: 2, originalIndex: j });
    j++;
  }
  
  return { merged: result, indices };
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');

// Edge case: one array empty
const e1 = [1, 2, 3, 0, 0];
mergeSortedExpert(e1, 3, [4, 5], 2);
console.log('One empty:', e1);

const e2 = [0, 0, 0];
mergeSortedExpert(e2, 0, [1, 2, 3], 3);
console.log('First empty:', e2);

// Merge K sorted
console.log('Merge K:', mergeKSorted([[1, 4, 7], [2, 5, 8], [3, 6, 9]]));
// [1, 2, 3, 4, 5, 6, 7, 8, 9]

// Merge unique
console.log('Merge unique:', mergeSortedUnique([1, 2, 2, 3], [2, 3, 4, 5]));
// [1, 2, 3, 4, 5]

// With indices
console.log('With indices:', mergeWithIndices([1, 3, 5], [2, 4]));


// ============================================
// COMPLEXITY ANALYSIS
// ============================================

/**
 * TIME COMPLEXITY:
 * ----------------
 * - In-place merge: O(m + n) - single pass through both arrays
 * - Merge K arrays: O(N log K) where N is total elements
 * 
 * SPACE COMPLEXITY:
 * -----------------
 * - In-place merge: O(1) - no extra space (excluding result)
 * - Simple merge: O(m + n) - creates new array
 * - Merge K: O(N) for the result
 */


// ============================================
// RELATED PROBLEMS
// ============================================

console.log('\n=== RELATED PROBLEMS ===');

/**
 * 1. Merge sort (divide and conquer)
 */
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return mergeSortedBeginner(left, right);
}

console.log('Merge sort:', mergeSort([5, 2, 8, 1, 9, 3]));

/**
 * 2. Find median of two sorted arrays
 */
function findMedianSortedArrays(nums1, nums2) {
  const merged = mergeSortedBeginner(nums1, nums2);
  const mid = Math.floor(merged.length / 2);
  
  if (merged.length % 2 === 0) {
    return (merged[mid - 1] + merged[mid]) / 2;
  }
  return merged[mid];
}

console.log('Median:', findMedianSortedArrays([1, 3], [2])); // 2

/**
 * 3. Intersection of two sorted arrays
 */
function intersectionSorted(nums1, nums2) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] === nums2[j]) {
      result.push(nums1[i]);
      i++;
      j++;
    } else if (nums1[i] < nums2[j]) {
      i++;
    } else {
      j++;
    }
  }
  
  return result;
}

console.log('Intersection:', intersectionSorted([1, 2, 3, 4, 5], [2, 4, 6])); // [2, 4]


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * 1. Merge from END to avoid overwriting
 * 2. i = m-1, j = n-1, k = m+n-1
 * 3. Only need to copy remaining nums2 (nums1 already in place)
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Clarify: is nums1 large enough?
 * 2. Ask about edge cases (empty arrays)
 * 3. Explain why merge from end
 * 4. Mention time/space complexity
 * 
 * KEY INSIGHT:
 * Merging from the end ensures we never overwrite
 * elements in nums1 that we haven't processed yet.
 */


module.exports = {
  mergeSortedBeginner,
  mergeSortedInPlace,
  mergeSortedExpert,
  mergeKSorted,
  mergeSortedUnique,
  mergeWithIndices,
  mergeSort,
  findMedianSortedArrays,
  intersectionSorted
};
