/**
 * ============================================
 * DEEP EQUAL - Complete Guide
 * ============================================
 * 
 * Topic: Implement a function that determines if two values are deep equal
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * SHALLOW VS DEEP EQUALITY:
 * -------------------------
 * 
 * SHALLOW (===):
 * - Primitives: Compare by value
 * - Objects: Compare by reference (same memory location)
 * 
 * DEEP EQUALITY:
 * - Compare structure and values recursively
 * - Two different objects with same content are equal
 * 
 * EXAMPLE:
 * const a = { x: { y: 1 } };
 * const b = { x: { y: 1 } };
 * a === b           // false (different references)
 * deepEqual(a, b)   // true (same structure and values)
 * 
 * SPECIAL CASES:
 * --------------
 * NaN === NaN       // false (!)
 * +0 === -0         // true (but Object.is says false)
 * null === null     // true
 * undefined === undefined // true
 */

/**
 * COMPARISON APPROACHES:
 * ----------------------
 * 1. JSON.stringify() - Simple but loses functions, order-dependent
 * 2. Object.is() - Better than === for NaN and ±0
 * 3. Recursive comparison - Full control, handles all types
 */

// ============================================
// BEGINNER LEVEL
// ============================================

/**
 * Beginner: Basic deep equal for simple objects and arrays
 */
function deepEqualBeginner(a, b) {
  // Same reference or same primitive
  if (a === b) return true;
  
  // Different types
  if (typeof a !== typeof b) return false;
  
  // Handle null (typeof null === 'object')
  if (a === null || b === null) return false;
  
  // Not objects? (primitives that are !== already)
  if (typeof a !== 'object') return false;
  
  // Both are objects/arrays
  
  // Different constructors (Array vs Object)
  if (a.constructor !== b.constructor) return false;
  
  // Compare arrays
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    
    for (let i = 0; i < a.length; i++) {
      if (!deepEqualBeginner(a[i], b[i])) return false;
    }
    return true;
  }
  
  // Compare objects
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqualBeginner(a[key], b[key])) return false;
  }
  
  return true;
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

console.log(deepEqualBeginner(1, 1));                      // true
console.log(deepEqualBeginner('a', 'a'));                  // true
console.log(deepEqualBeginner({ a: 1 }, { a: 1 }));        // true
console.log(deepEqualBeginner([1, 2], [1, 2]));            // true
console.log(deepEqualBeginner({ a: { b: 1 } }, { a: { b: 1 } })); // true
console.log(deepEqualBeginner({ a: 1 }, { a: 2 }));        // false
console.log(deepEqualBeginner([1, 2], [1, 2, 3]));         // false


// ============================================
// INTERMEDIATE LEVEL
// ============================================

/**
 * Intermediate: Handle special values (NaN, Date, RegExp)
 * Add circular reference detection
 */
function deepEqualIntermediate(a, b, seen = new WeakMap()) {
  // Same reference
  if (a === b) return true;
  
  // Handle NaN (NaN !== NaN, but should be equal)
  if (Number.isNaN(a) && Number.isNaN(b)) return true;
  
  // Null or non-objects
  if (a === null || b === null) return a === b;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  
  // Different constructors
  if (a.constructor !== b.constructor) return false;
  
  // Circular reference check
  if (seen.has(a)) {
    return seen.get(a) === b;
  }
  seen.set(a, b);
  
  // Date comparison
  if (a instanceof Date) {
    return a.getTime() === b.getTime();
  }
  
  // RegExp comparison
  if (a instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }
  
  // Array comparison
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqualIntermediate(a[i], b[i], seen)) return false;
    }
    return true;
  }
  
  // Object comparison
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEqualIntermediate(a[key], b[key], seen)) return false;
  }
  
  return true;
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');

// NaN
console.log('NaN:', deepEqualIntermediate(NaN, NaN)); // true

// Date
const date1 = new Date('2024-01-01');
const date2 = new Date('2024-01-01');
console.log('Date:', deepEqualIntermediate(date1, date2)); // true

// RegExp
console.log('RegExp:', deepEqualIntermediate(/test/gi, /test/gi)); // true
console.log('RegExp diff:', deepEqualIntermediate(/test/g, /test/i)); // false

// Circular reference
const obj1 = { a: 1 };
obj1.self = obj1;
const obj2 = { a: 1 };
obj2.self = obj2;
console.log('Circular:', deepEqualIntermediate(obj1, obj2)); // true


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: Full implementation handling all types
 * - Map, Set
 * - Symbol keys
 * - Functions
 * - ArrayBuffer, TypedArray
 * - Error objects
 * - Property descriptors (optional)
 */
function deepEqual(a, b, options = {}) {
  const {
    strict = true,           // Use Object.is for -0/+0
    compareFunctions = false, // Compare function references
    compareSymbols = true,    // Compare Symbol properties
    seen = new WeakMap()
  } = options;
  
  // Same reference
  if (a === b) return true;
  
  // Strict comparison using Object.is
  if (strict && Object.is(a, b)) return true;
  
  // Handle NaN
  if (Number.isNaN(a) && Number.isNaN(b)) return true;
  
  // Handle -0 and +0 in strict mode
  if (strict && a === 0 && b === 0) {
    return Object.is(a, b);
  }
  
  // Null or undefined
  if (a === null || b === null || a === undefined || b === undefined) {
    return a === b;
  }
  
  // Different types
  const typeA = typeof a;
  const typeB = typeof b;
  
  if (typeA !== typeB) return false;
  
  // Functions
  if (typeA === 'function') {
    if (!compareFunctions) return a === b;
    return a.toString() === b.toString();
  }
  
  // Not objects (primitive that are !== already)
  if (typeA !== 'object') return false;
  
  // Different constructors
  if (a.constructor !== b.constructor) return false;
  
  // Circular reference detection
  if (seen.has(a)) {
    return seen.get(a) === b;
  }
  seen.set(a, b);
  
  // Date
  if (a instanceof Date) {
    return a.getTime() === b.getTime();
  }
  
  // RegExp
  if (a instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }
  
  // Error
  if (a instanceof Error) {
    return a.name === b.name && 
           a.message === b.message && 
           a.stack === b.stack;
  }
  
  // Map
  if (a instanceof Map) {
    if (a.size !== b.size) return false;
    
    for (const [key, value] of a) {
      // Check if key exists in b (need to find matching key for objects)
      let found = false;
      for (const [bKey, bValue] of b) {
        if (deepEqual(key, bKey, { ...options, seen })) {
          if (!deepEqual(value, bValue, { ...options, seen })) {
            return false;
          }
          found = true;
          break;
        }
      }
      if (!found) return false;
    }
    return true;
  }
  
  // Set
  if (a instanceof Set) {
    if (a.size !== b.size) return false;
    
    for (const value of a) {
      // For primitives, simple check
      if (typeof value !== 'object' || value === null) {
        if (!b.has(value)) return false;
      } else {
        // For objects, need deep comparison
        let found = false;
        for (const bValue of b) {
          if (deepEqual(value, bValue, { ...options, seen })) {
            found = true;
            break;
          }
        }
        if (!found) return false;
      }
    }
    return true;
  }
  
  // ArrayBuffer
  if (a instanceof ArrayBuffer) {
    if (a.byteLength !== b.byteLength) return false;
    const viewA = new Uint8Array(a);
    const viewB = new Uint8Array(b);
    for (let i = 0; i < viewA.length; i++) {
      if (viewA[i] !== viewB[i]) return false;
    }
    return true;
  }
  
  // TypedArray
  if (ArrayBuffer.isView(a) && !(a instanceof DataView)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  
  // Array
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i], { ...options, seen })) return false;
    }
    return true;
  }
  
  // Plain object
  // Get all keys including Symbols
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  // Compare string keys
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEqual(a[key], b[key], { ...options, seen })) return false;
  }
  
  // Compare Symbol keys
  if (compareSymbols) {
    const symbolsA = Object.getOwnPropertySymbols(a);
    const symbolsB = Object.getOwnPropertySymbols(b);
    
    if (symbolsA.length !== symbolsB.length) return false;
    
    for (const sym of symbolsA) {
      if (!symbolsB.includes(sym)) return false;
      if (!deepEqual(a[sym], b[sym], { ...options, seen })) return false;
    }
  }
  
  return true;
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');

// Map
const map1 = new Map([[{ id: 1 }, 'one'], [{ id: 2 }, 'two']]);
const map2 = new Map([[{ id: 1 }, 'one'], [{ id: 2 }, 'two']]);
console.log('Map:', deepEqual(map1, map2)); // true

// Set
const set1 = new Set([{ a: 1 }, { b: 2 }]);
const set2 = new Set([{ a: 1 }, { b: 2 }]);
console.log('Set:', deepEqual(set1, set2)); // true

// Symbol keys
const sym = Symbol('test');
const withSym1 = { [sym]: 'value', regular: 1 };
const withSym2 = { [sym]: 'value', regular: 1 };
console.log('Symbol keys:', deepEqual(withSym1, withSym2)); // true

// Error
const err1 = new Error('test');
const err2 = new Error('test');
err2.stack = err1.stack; // Match stack
console.log('Error:', deepEqual(err1, err2)); // true

// +0 vs -0
console.log('+0 vs -0 (strict):', deepEqual(+0, -0, { strict: true })); // false
console.log('+0 vs -0 (loose):', deepEqual(+0, -0, { strict: false })); // true

// ArrayBuffer
const buf1 = new Uint8Array([1, 2, 3]).buffer;
const buf2 = new Uint8Array([1, 2, 3]).buffer;
console.log('ArrayBuffer:', deepEqual(buf1, buf2)); // true


// ============================================
// EDGE CASES & GOTCHAS
// ============================================

console.log('\n=== EDGE CASES ===');

/**
 * EDGE CASE 1: NaN
 */
console.log('NaN === NaN:', NaN === NaN); // false
console.log('deepEqual(NaN, NaN):', deepEqual(NaN, NaN)); // true

/**
 * EDGE CASE 2: +0 and -0
 */
console.log('+0 === -0:', +0 === -0); // true
console.log('Object.is(+0, -0):', Object.is(+0, -0)); // false

/**
 * EDGE CASE 3: Object with null prototype
 */
const nullProto1 = Object.create(null);
nullProto1.a = 1;
const nullProto2 = Object.create(null);
nullProto2.a = 1;
console.log('Null prototype:', deepEqual(nullProto1, nullProto2)); // true

/**
 * EDGE CASE 4: Objects with same keys, different order
 */
const order1 = { a: 1, b: 2 };
const order2 = { b: 2, a: 1 };
console.log('Different order:', deepEqual(order1, order2)); // true

/**
 * EDGE CASE 5: Sparse arrays
 */
const sparse1 = [1, , 3];
const sparse2 = [1, , 3];
console.log('Sparse arrays:', deepEqual(sparse1, sparse2)); // true

/**
 * EDGE CASE 6: Functions
 */
const fn1 = () => 1;
const fn2 = () => 1;
console.log('Functions (ref):', deepEqual(fn1, fn2)); // false (different refs)
console.log('Functions (compare):', deepEqual(fn1, fn2, { compareFunctions: true })); // true


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * 1. Handle NaN specially (NaN !== NaN)
 * 2. Use Object.is for strict -0/+0 comparison
 * 3. Track seen objects for circular refs
 * 4. Compare constructors before values
 * 5. Don't forget Symbol keys
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Start with primitives and basic objects
 * 2. Handle NaN case (common gotcha)
 * 3. Mention circular reference handling
 * 4. Discuss special types (Date, RegExp, Map, Set)
 * 5. Explain === vs Object.is
 * 
 * TYPE COMPARISON ORDER:
 * ----------------------
 * 1. Same reference (===)
 * 2. NaN check
 * 3. Type check (typeof)
 * 4. Constructor check
 * 5. Circular reference check
 * 6. Type-specific comparison
 */


// ============================================
// COMMON MISTAKES TO AVOID
// ============================================

/**
 * MISTAKE 1: Forgetting NaN !== NaN
 * Always check with Number.isNaN()
 * 
 * MISTAKE 2: Using typeof for null
 * typeof null === 'object', check explicitly
 * 
 * MISTAKE 3: Not handling circular references
 * Will cause stack overflow
 * 
 * MISTAKE 4: Using Object.keys only
 * Misses Symbol properties
 * 
 * MISTAKE 5: Comparing arrays with object comparison
 * Arrays need index-based comparison
 * 
 * MISTAKE 6: Not checking hasOwnProperty
 * Could compare inherited properties
 */


module.exports = {
  deepEqualBeginner,
  deepEqualIntermediate,
  deepEqual
};
