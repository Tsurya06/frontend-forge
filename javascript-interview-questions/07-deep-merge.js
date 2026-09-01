/**
 * ============================================
 * DEEP MERGE OBJECTS - Complete Guide
 * ============================================
 * 
 * Topic: Implement a function that merges two objects together
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * SHALLOW MERGE VS DEEP MERGE:
 * ----------------------------
 * 
 * SHALLOW MERGE (Object.assign, spread):
 * const merged = { ...obj1, ...obj2 };
 * - Only merges top-level properties
 * - Nested objects are replaced, not merged
 * 
 * Example:
 * obj1 = { a: { x: 1, y: 2 } }
 * obj2 = { a: { z: 3 } }
 * Shallow: { a: { z: 3 } }      // obj1.a is lost!
 * Deep:    { a: { x: 1, y: 2, z: 3 } }  // Merged!
 * 
 * USE CASES:
 * ----------
 * 1. Configuration objects (defaults + user config)
 * 2. State management (partial updates)
 * 3. API response merging
 * 4. Theme customization
 */

/**
 * KEY CONSIDERATIONS:
 * -------------------
 * 1. How to handle arrays? (Replace, concat, merge by index)
 * 2. How to handle null/undefined? (Replace or skip)
 * 3. How to handle circular references?
 * 4. Mutate original or return new object?
 */

// ============================================
// BEGINNER LEVEL
// ============================================

/**
 * Beginner: Simple deep merge (mutates target)
 * Only handles plain objects and primitives
 */
function deepMergeBeginner(target, source) {
  // Loop through source properties
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = target[key];
      
      // If both are plain objects, recurse
      if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
        deepMergeBeginner(targetValue, sourceValue);
      } else {
        // Otherwise, overwrite
        target[key] = sourceValue;
      }
    }
  }
  
  return target;
}

// Helper: Check if value is a plain object
function isPlainObject(value) {
  return value !== null && 
         typeof value === 'object' && 
         !Array.isArray(value);
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const config1 = {
  database: { host: 'localhost', port: 5432 },
  logging: true
};

const config2 = {
  database: { port: 3306, name: 'mydb' },
  cache: true
};

const merged = deepMergeBeginner({ ...config1 }, config2);
console.log('Merged:', JSON.stringify(merged, null, 2));
// { database: { host: 'localhost', port: 3306, name: 'mydb' }, logging: true, cache: true }


// ============================================
// INTERMEDIATE LEVEL
// ============================================

/**
 * Intermediate: Immutable deep merge with array handling
 * Returns new object, doesn't mutate originals
 */
function deepMergeIntermediate(target, source, options = {}) {
  const {
    arrayStrategy = 'replace' // 'replace' | 'concat' | 'merge'
  } = options;
  
  // Handle non-objects
  if (!isPlainObject(source)) {
    return source;
  }
  
  if (!isPlainObject(target)) {
    return deepClone(source);
  }
  
  // Create new object (immutable)
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = target[key];
      
      // Both are plain objects - recurse
      if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
        result[key] = deepMergeIntermediate(targetValue, sourceValue, options);
      }
      // Both are arrays - apply strategy
      else if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
        switch (arrayStrategy) {
          case 'concat':
            result[key] = [...targetValue, ...sourceValue];
            break;
          case 'merge':
            // Merge by index
            result[key] = sourceValue.map((item, index) => {
              if (isPlainObject(item) && isPlainObject(targetValue[index])) {
                return deepMergeIntermediate(targetValue[index], item, options);
              }
              return item;
            });
            // Include any extra items from target
            if (targetValue.length > sourceValue.length) {
              result[key] = [...result[key], ...targetValue.slice(sourceValue.length)];
            }
            break;
          case 'replace':
          default:
            result[key] = [...sourceValue];
        }
      }
      // Otherwise, use source value
      else {
        result[key] = deepClone(sourceValue);
      }
    }
  }
  
  return result;
}

// Helper: Simple deep clone
function deepClone(value) {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  
  if (Array.isArray(value)) {
    return value.map(deepClone);
  }
  
  const result = {};
  for (const key in value) {
    if (value.hasOwnProperty(key)) {
      result[key] = deepClone(value[key]);
    }
  }
  return result;
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');

const base = {
  name: 'App',
  settings: { theme: 'dark', fontSize: 14 },
  plugins: ['plugin1', 'plugin2']
};

const override = {
  settings: { fontSize: 16, language: 'en' },
  plugins: ['plugin3']
};

console.log('Replace arrays:', deepMergeIntermediate(base, override));
console.log('Concat arrays:', deepMergeIntermediate(base, override, { arrayStrategy: 'concat' }));


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: Full-featured deep merge
 * - Custom merge functions per key
 * - Circular reference handling
 * - Symbol keys support
 * - Multiple sources
 * - Skip undefined option
 */
function deepMergeExpert(...args) {
  // Last argument can be options
  let options = {};
  let sources = args;
  
  if (args.length > 0 && args[args.length - 1]?._isOptions) {
    options = args[args.length - 1];
    sources = args.slice(0, -1);
  }
  
  const {
    arrayStrategy = 'replace',
    skipUndefined = false,
    skipNull = false,
    customMerge = {},  // { 'key.path': (target, source) => merged }
    circular = new WeakMap()
  } = options;
  
  if (sources.length === 0) return {};
  if (sources.length === 1) return deepCloneExpert(sources[0], circular);
  
  // Merge all sources from left to right
  return sources.reduce((acc, source) => {
    return mergeTwo(acc, source, '', options, circular);
  });
}

function mergeTwo(target, source, path, options, seen) {
  const { arrayStrategy, skipUndefined, skipNull, customMerge } = options;
  
  // Handle primitives and special values
  if (source === undefined && skipUndefined) return target;
  if (source === null && skipNull) return target;
  if (source === null || typeof source !== 'object') return source;
  if (target === null || typeof target !== 'object') return deepCloneExpert(source, seen);
  
  // Check for circular reference
  if (seen.has(source)) {
    return seen.get(source);
  }
  
  // Handle arrays
  if (Array.isArray(source)) {
    if (!Array.isArray(target)) {
      return deepCloneExpert(source, seen);
    }
    
    let result;
    switch (arrayStrategy) {
      case 'concat':
        result = [...target, ...source.map(s => deepCloneExpert(s, seen))];
        break;
      case 'merge':
        result = source.map((item, i) => {
          if (i < target.length) {
            return mergeTwo(target[i], item, `${path}[${i}]`, options, seen);
          }
          return deepCloneExpert(item, seen);
        });
        if (target.length > source.length) {
          result = [...result, ...target.slice(source.length).map(t => deepCloneExpert(t, seen))];
        }
        break;
      case 'unique':
        // Combine and remove duplicates (for primitives)
        result = [...new Set([...target, ...source])];
        break;
      default:
        result = source.map(s => deepCloneExpert(s, seen));
    }
    seen.set(source, result);
    return result;
  }
  
  // Handle plain objects
  const result = { ...target };
  seen.set(source, result);
  
  // Get all keys including symbols
  const keys = [
    ...Object.keys(source),
    ...Object.getOwnPropertySymbols(source)
  ];
  
  for (const key of keys) {
    const keyPath = path ? `${path}.${String(key)}` : String(key);
    
    // Check for custom merge function
    if (customMerge[keyPath]) {
      result[key] = customMerge[keyPath](target[key], source[key]);
      continue;
    }
    
    const sourceValue = source[key];
    const targetValue = target[key];
    
    // Skip undefined/null if configured
    if (sourceValue === undefined && skipUndefined) continue;
    if (sourceValue === null && skipNull) continue;
    
    // Recursive merge for objects
    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      result[key] = mergeTwo(targetValue, sourceValue, keyPath, options, seen);
    }
    // Array handling
    else if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
      result[key] = mergeTwo(targetValue, sourceValue, keyPath, options, seen);
    }
    // Direct assignment
    else {
      result[key] = deepCloneExpert(sourceValue, seen);
    }
  }
  
  return result;
}

function deepCloneExpert(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);
  
  if (value instanceof Date) return new Date(value);
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);
  if (value instanceof Map) {
    const cloned = new Map();
    seen.set(value, cloned);
    value.forEach((v, k) => cloned.set(deepCloneExpert(k, seen), deepCloneExpert(v, seen)));
    return cloned;
  }
  if (value instanceof Set) {
    const cloned = new Set();
    seen.set(value, cloned);
    value.forEach(v => cloned.add(deepCloneExpert(v, seen)));
    return cloned;
  }
  
  if (Array.isArray(value)) {
    const cloned = [];
    seen.set(value, cloned);
    value.forEach((item, i) => cloned[i] = deepCloneExpert(item, seen));
    return cloned;
  }
  
  const cloned = {};
  seen.set(value, cloned);
  
  for (const key of [...Object.keys(value), ...Object.getOwnPropertySymbols(value)]) {
    cloned[key] = deepCloneExpert(value[key], seen);
  }
  
  return cloned;
}

// Create options helper
deepMergeExpert.options = (opts) => ({ ...opts, _isOptions: true });

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');

// Multiple sources
const defaults = { a: 1, b: { c: 2 } };
const userConfig = { b: { d: 3 } };
const runtimeConfig = { b: { e: 4 }, f: 5 };

console.log('Multiple sources:', deepMergeExpert(defaults, userConfig, runtimeConfig));

// Custom merge function
const result = deepMergeExpert(
  { score: 10, items: [1, 2] },
  { score: 5, items: [3] },
  deepMergeExpert.options({
    customMerge: {
      'score': (target, source) => target + source,  // Sum scores
    },
    arrayStrategy: 'concat'
  })
);
console.log('Custom merge:', result); // { score: 15, items: [1, 2, 3] }

// Skip undefined
const withUndefined = deepMergeExpert(
  { a: 1, b: 2 },
  { a: undefined, b: 3 },
  deepMergeExpert.options({ skipUndefined: true })
);
console.log('Skip undefined:', withUndefined); // { a: 1, b: 3 }


// ============================================
// LODASH-STYLE mergeWith
// ============================================

/**
 * Customizable merge with callback for each value
 */
function mergeWith(target, source, customizer) {
  if (!isPlainObject(source)) return source;
  if (!isPlainObject(target)) return deepClone(source);
  
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = target[key];
      
      // Call customizer
      const customResult = customizer?.(targetValue, sourceValue, key, target, source);
      
      if (customResult !== undefined) {
        result[key] = customResult;
      } else if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
        result[key] = mergeWith(targetValue, sourceValue, customizer);
      } else {
        result[key] = deepClone(sourceValue);
      }
    }
  }
  
  return result;
}

console.log('\n=== MERGE WITH CUSTOMIZER ===');

const merged2 = mergeWith(
  { a: [1, 2], b: { x: 1 } },
  { a: [3, 4], b: { y: 2 } },
  (target, source, key) => {
    // Concat arrays
    if (Array.isArray(target) && Array.isArray(source)) {
      return [...target, ...source];
    }
    // Return undefined to use default behavior
  }
);
console.log('mergeWith:', merged2);


// ============================================
// EDGE CASES & GOTCHAS
// ============================================

console.log('\n=== EDGE CASES ===');

/**
 * EDGE CASE 1: Prototype pollution
 * Never merge __proto__ or constructor
 */
function safeMerge(target, source) {
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  
  for (const key in source) {
    if (dangerousKeys.includes(key)) continue; // Skip dangerous keys
    
    if (source.hasOwnProperty(key)) {
      if (isPlainObject(source[key]) && isPlainObject(target[key])) {
        safeMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

/**
 * EDGE CASE 2: Circular references
 */
const circular1 = { a: 1 };
circular1.self = circular1;
const circular2 = { b: 2 };
circular2.self = circular2;

// Our expert merge handles this with WeakMap
console.log('Circular handled:', deepMergeExpert(circular1, circular2));

/**
 * EDGE CASE 3: null vs undefined
 */
const withNull = deepMergeIntermediate(
  { a: 1, b: 2 },
  { a: null, c: 3 }
);
console.log('null handling:', withNull); // { a: null, b: 2, c: 3 }

/**
 * EDGE CASE 4: Arrays with objects
 */
const arrMerge = deepMergeIntermediate(
  { items: [{ id: 1, name: 'A' }] },
  { items: [{ id: 1, value: 100 }] },
  { arrayStrategy: 'merge' }
);
console.log('Array of objects:', arrMerge);

/**
 * EDGE CASE 5: Empty objects
 */
console.log('Empty target:', deepMergeIntermediate({}, { a: 1 }));
console.log('Empty source:', deepMergeIntermediate({ a: 1 }, {}));
console.log('Both empty:', deepMergeIntermediate({}, {}));


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * 1. Check if values are plain objects before recursing
 * 2. Handle arrays separately with strategy
 * 3. Clone values to avoid mutation
 * 4. Watch for prototype pollution
 * 5. Handle circular references with WeakMap
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Start with simple recursive solution
 * 2. Discuss mutation vs immutability
 * 3. Explain array handling strategies
 * 4. Mention security (prototype pollution)
 * 5. Discuss use cases (config objects)
 * 
 * TIME COMPLEXITY: O(n) where n is total properties
 * SPACE COMPLEXITY: O(d) recursion depth + O(n) for result
 */


// ============================================
// COMMON MISTAKES TO AVOID
// ============================================

/**
 * MISTAKE 1: Mutating the original objects
 * Always clone or create new objects
 * 
 * MISTAKE 2: Not checking hasOwnProperty
 * Can merge inherited properties unintentionally
 * 
 * MISTAKE 3: Forgetting array handling
 * Arrays are objects but need different treatment
 * 
 * MISTAKE 4: Prototype pollution vulnerability
 * Always filter __proto__, constructor
 * 
 * MISTAKE 5: Not handling null correctly
 * typeof null === 'object' is a gotcha
 */


module.exports = {
  deepMergeBeginner,
  deepMergeIntermediate,
  deepMergeExpert,
  mergeWith,
  safeMerge,
  isPlainObject,
  deepClone
};
