/**
 * ============================================
 * ARRAY FLATTEN - Complete Guide
 * ============================================
 * 
 * Topic: Implement array flattening with customized depth (Array.flat polyfill)
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * WHAT IS ARRAY FLATTENING?
 * -------------------------
 * Flattening reduces array nesting by concatenating sub-arrays into
 * the parent array up to a specified depth.
 * 
 * EXAMPLE:
 * [1, [2, [3, [4]]]]
 * flat(1): [1, 2, [3, [4]]]
 * flat(2): [1, 2, 3, [4]]
 * flat(Infinity): [1, 2, 3, 4]
 * 
 * NATIVE METHOD (ES2019):
 * Array.prototype.flat(depth = 1)
 * Array.prototype.flatMap(callback) = map + flat(1)
 * 
 * USE CASES:
 * ----------
 * 1. Normalizing data from APIs
 * 2. Processing nested structures
 * 3. Combining results from multiple sources
 * 4. Simplifying recursive data
 */

/**
 * APPROACHES:
 * -----------
 * 1. Recursive - Simple, natural for trees
 * 2. Iterative with stack - Avoids recursion limit
 * 3. reduce + concat - Functional style
 * 4. Generator - Memory efficient for large arrays
 */

// ============================================
// BEGINNER LEVEL
// ============================================

/**
 * Beginner: Flatten one level (depth = 1)
 */
function flattenOnce(arr) {
  const result = [];
  
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      // Spread nested array
      for (let j = 0; j < arr[i].length; j++) {
        result.push(arr[i][j]);
      }
    } else {
      result.push(arr[i]);
    }
  }
  
  return result;
}

// Using concat
function flattenOnceConcat(arr) {
  return [].concat(...arr);
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const nested1 = [1, [2, 3], [4, 5]];
console.log('flattenOnce:', flattenOnce(nested1)); // [1, 2, 3, 4, 5]
console.log('flattenOnceConcat:', flattenOnceConcat(nested1)); // [1, 2, 3, 4, 5]

const nested2 = [1, [2, [3, 4]]];
console.log('One level only:', flattenOnce(nested2)); // [1, 2, [3, 4]]


// ============================================
// INTERMEDIATE LEVEL - With Depth
// ============================================

/**
 * Intermediate: Recursive flatten with configurable depth
 */
function flatten(arr, depth = 1) {
  // Base case: no more flattening needed
  if (depth < 1) {
    return arr.slice(); // Return copy
  }
  
  const result = [];
  
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    
    if (Array.isArray(item)) {
      // Recursively flatten with reduced depth
      const flattened = flatten(item, depth - 1);
      result.push(...flattened);
    } else {
      result.push(item);
    }
  }
  
  return result;
}

// Using reduce (functional style)
function flattenReduce(arr, depth = 1) {
  return depth > 0
    ? arr.reduce((acc, val) => {
        return acc.concat(
          Array.isArray(val) ? flattenReduce(val, depth - 1) : val
        );
      }, [])
    : arr.slice();
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');

const deepNested = [1, [2, [3, [4, [5]]]]];
console.log('depth 1:', flatten(deepNested, 1));          // [1, 2, [3, [4, [5]]]]
console.log('depth 2:', flatten(deepNested, 2));          // [1, 2, 3, [4, [5]]]
console.log('depth 3:', flatten(deepNested, 3));          // [1, 2, 3, 4, [5]]
console.log('depth Infinity:', flatten(deepNested, Infinity)); // [1, 2, 3, 4, 5]


// ============================================
// INTERMEDIATE LEVEL - Deep Flatten
// ============================================

/**
 * Flatten completely (any depth)
 */
function flattenDeep(arr) {
  const result = [];
  
  function flattenHelper(item) {
    if (Array.isArray(item)) {
      for (let i = 0; i < item.length; i++) {
        flattenHelper(item[i]);
      }
    } else {
      result.push(item);
    }
  }
  
  flattenHelper(arr);
  return result;
}

// One-liner with recursion
const flattenDeepRecursive = arr =>
  arr.reduce((acc, val) =>
    Array.isArray(val) ? acc.concat(flattenDeepRecursive(val)) : [...acc, val],
  []);

console.log('\n=== DEEP FLATTEN ===');
console.log('flattenDeep:', flattenDeep([1, [2, [3, [4, [5]]]]])); // [1, 2, 3, 4, 5]


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: Iterative flatten (avoids stack overflow for very deep arrays)
 */
function flattenIterative(arr, depth = 1) {
  // Stack holds [item, currentDepth]
  const stack = arr.map(item => [item, depth]);
  const result = [];
  
  while (stack.length > 0) {
    const [item, d] = stack.pop();
    
    if (Array.isArray(item) && d > 0) {
      // Add items in reverse order (to maintain original order)
      for (let i = item.length - 1; i >= 0; i--) {
        stack.push([item[i], d - 1]);
      }
    } else {
      result.push(item);
    }
  }
  
  return result.reverse(); // Reverse because we popped
}

/**
 * Expert: Generator-based flatten (memory efficient)
 */
function* flattenGenerator(arr, depth = 1) {
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      yield* flattenGenerator(item, depth - 1);
    } else {
      yield item;
    }
  }
}

/**
 * Expert: Polyfill for Array.prototype.flat
 */
if (!Array.prototype.flat) {
  Array.prototype.flat = function(depth = 1) {
    // Convert depth to number
    const d = Math.floor(Number(depth)) || 0;
    
    if (d < 1) {
      return this.slice();
    }
    
    return this.reduce((acc, val) => {
      if (Array.isArray(val)) {
        return acc.concat(val.flat(d - 1));
      }
      return acc.concat(val);
    }, []);
  };
}

/**
 * Expert: Polyfill for Array.prototype.flatMap
 */
if (!Array.prototype.flatMap) {
  Array.prototype.flatMap = function(callback, thisArg) {
    return this.map(callback, thisArg).flat(1);
  };
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');

// Iterative (handles very deep nesting)
console.log('Iterative:', flattenIterative([1, [2, [3, [4]]]], 2)); // [1, 2, 3, [4]]

// Generator
const gen = flattenGenerator([1, [2, [3, [4]]]], 2);
console.log('Generator:', [...gen]); // [1, 2, 3, [4]]

// FlatMap example
const sentences = ['Hello World', 'How are you'];
console.log('FlatMap:', sentences.flatMap(s => s.split(' '))); // ['Hello', 'World', 'How', 'are', 'you']


// ============================================
// VARIANTS
// ============================================

console.log('\n=== VARIANTS ===');

/**
 * VARIANT 1: Flatten with filter (remove falsy values)
 */
function flattenCompact(arr, depth = Infinity) {
  return flatten(arr, depth).filter(Boolean);
}

console.log('Flatten + compact:', flattenCompact([1, [2, null, [3, undefined, 4]]])); // [1, 2, 3, 4]

/**
 * VARIANT 2: Flatten with unique (remove duplicates)
 */
function flattenUnique(arr, depth = Infinity) {
  return [...new Set(flatten(arr, depth))];
}

console.log('Flatten + unique:', flattenUnique([1, [1, 2, [2, 3]]])); // [1, 2, 3]

/**
 * VARIANT 3: Flatten objects (get all nested values)
 */
function flattenObject(obj, prefix = '') {
  const result = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(result, flattenObject(obj[key], newKey));
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  
  return result;
}

console.log('Flatten object:', flattenObject({ a: { b: { c: 1 } }, d: 2 }));
// { 'a.b.c': 1, d: 2 }

/**
 * VARIANT 4: Unflatten (reverse of flatten object)
 */
function unflattenObject(obj) {
  const result = {};
  
  for (const key in obj) {
    const keys = key.split('.');
    let current = result;
    
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (i === keys.length - 1) {
        current[k] = obj[key];
      } else {
        current[k] = current[k] || {};
        current = current[k];
      }
    }
  }
  
  return result;
}

console.log('Unflatten:', unflattenObject({ 'a.b.c': 1, d: 2 }));
// { a: { b: { c: 1 } }, d: 2 }


// ============================================
// EDGE CASES & GOTCHAS
// ============================================

console.log('\n=== EDGE CASES ===');

/**
 * EDGE CASE 1: Empty arrays
 */
console.log('Empty:', flatten([])); // []
console.log('Nested empty:', flatten([[], [[]]])); // [[]]

/**
 * EDGE CASE 2: Sparse arrays (holes)
 */
const sparse = [1, , 3, , 5];
console.log('Sparse:', flatten([sparse])); // [1, 3, 5] - holes removed!

/**
 * EDGE CASE 3: Non-array items that look like arrays
 */
const arrayLike = { 0: 'a', 1: 'b', length: 2 };
console.log('Array-like:', flatten([arrayLike])); // [{ 0: 'a', 1: 'b', length: 2 }]

/**
 * EDGE CASE 4: Very deep nesting (recursion limit)
 */
// Use iterative version for very deep arrays

/**
 * EDGE CASE 5: Non-integer depth
 */
console.log('Float depth:', flatten([1, [2, [3]]], 1.5)); // [1, 2, [3]] (floored to 1)

/**
 * EDGE CASE 6: Negative depth
 */
console.log('Negative depth:', flatten([1, [2]], -1)); // [1, [2]] (no flattening)

/**
 * EDGE CASE 7: Strings (iterable but not array)
 */
console.log('With strings:', flatten(['abc', ['def']])); // ['abc', 'def'] - strings not split


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * 1. Default depth is 1
 * 2. Infinity for complete flattening
 * 3. Sparse arrays lose holes
 * 4. Use iterative for very deep arrays
 * 5. flatMap = map + flat(1)
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Start with simple one-level flatten
 * 2. Add depth parameter
 * 3. Mention reduce approach
 * 4. Discuss recursion vs iteration
 * 5. Cover edge cases (empty, sparse, depth)
 * 
 * TIME COMPLEXITY: O(n) where n is total elements
 * SPACE COMPLEXITY: O(n) for result + O(d) for recursion depth
 */


// ============================================
// COMMON MISTAKES TO AVOID
// ============================================

/**
 * MISTAKE 1: Modifying original array
 * Always return new array
 * 
 * MISTAKE 2: Forgetting depth = 0 case
 * Should return copy, not original
 * 
 * MISTAKE 3: Not handling Infinity
 * Common case for full flattening
 * 
 * MISTAKE 4: Using spread in loop (performance)
 * [...acc, ...arr] creates new array each time
 * Better: acc.push(...arr) then return acc
 * 
 * MISTAKE 5: Checking Array.isArray inside tight loop
 * Can be slow; consider caching
 */


// ============================================
// PERFORMANCE COMPARISON
// ============================================

console.log('\n=== PERFORMANCE NOTES ===');
console.log('Recursive: Simple, O(d) stack space');
console.log('Iterative: Better for deep arrays, O(n) space');
console.log('Generator: Memory efficient, lazy evaluation');
console.log('reduce + concat: Clean but creates many temp arrays');


module.exports = {
  flattenOnce,
  flatten,
  flattenDeep,
  flattenIterative,
  flattenGenerator,
  flattenCompact,
  flattenUnique,
  flattenObject,
  unflattenObject
};
