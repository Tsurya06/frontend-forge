/**
 * ============================================
 * DEEP COPY WITH CIRCULAR REFERENCE - Complete Guide
 * ============================================
 * 
 * Topic: Implement a function that performs a deep copy of a value,
 * but also handles circular references.
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * SHALLOW COPY VS DEEP COPY:
 * --------------------------
 * 
 * SHALLOW COPY:
 * - Creates a new object
 * - Copies only the first level properties
 * - Nested objects share the same reference
 * - Methods: Object.assign(), spread operator {...}
 * 
 * DEEP COPY:
 * - Creates a completely independent copy
 * - All nested objects are also cloned
 * - No shared references
 * - Methods: JSON.parse(JSON.stringify()), structuredClone(), custom function
 * 
 * VISUAL EXAMPLE:
 * ---------------
 * Original: { a: 1, b: { c: 2 } }
 * 
 * Shallow Copy:
 * - new.a = 1 (copied)
 * - new.b === original.b (SAME reference)
 * 
 * Deep Copy:
 * - new.a = 1 (copied)
 * - new.b !== original.b (DIFFERENT reference)
 * - new.b.c = 2 (copied)
 */

/**
 * CIRCULAR REFERENCE:
 * -------------------
 * When an object references itself directly or through a chain:
 * 
 * Direct:   obj.self = obj
 * Indirect: obj.a.b.parent = obj
 * 
 * Without handling, this causes infinite recursion!
 */

/**
 * COMMON APPROACHES:
 * ------------------
 * 1. JSON.parse(JSON.stringify(obj))
 *    - Simple but limited
 *    - Loses: functions, undefined, Symbols, Date (becomes string), RegExp, Map, Set
 *    - Throws on circular references
 * 
 * 2. structuredClone(obj) - Modern browsers
 *    - Handles most cases
 *    - Handles circular references
 *    - Still loses: functions, DOM elements
 * 
 * 3. Custom recursive function with WeakMap
 *    - Full control
 *    - Can handle any type
 *    - Can handle circular references
 */

// ============================================
// BEGINNER LEVEL
// ============================================

/**
 * Beginner: Simple deep copy using JSON
 * Limitations: No functions, undefined, circular refs
 */
function deepCopyBeginner(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const simpleObj = { a: 1, b: { c: 2 } };
const copiedSimple = deepCopyBeginner(simpleObj);

console.log('Original:', simpleObj);
console.log('Copy:', copiedSimple);
console.log('Are equal?', JSON.stringify(simpleObj) === JSON.stringify(copiedSimple)); // true
console.log('Same reference?', simpleObj === copiedSimple); // false
console.log('Nested same ref?', simpleObj.b === copiedSimple.b); // false

// Show limitations
console.log('\n--- BEGINNER LIMITATIONS ---');
const objWithFunction = { fn: () => 'hello', value: 1 };
console.log('With function:', deepCopyBeginner(objWithFunction)); // { value: 1 } - function lost!

const objWithUndefined = { a: undefined, b: 1 };
console.log('With undefined:', deepCopyBeginner(objWithUndefined)); // { b: 1 } - undefined lost!

const objWithDate = { date: new Date() };
console.log('With Date:', deepCopyBeginner(objWithDate)); // date becomes string!


// ============================================
// INTERMEDIATE LEVEL
// ============================================

/**
 * Intermediate: Handle special types + circular references
 * - Date, RegExp
 * - Arrays
 * - Circular reference detection with WeakMap
 */
function deepCopyIntermediate(obj, seen = new WeakMap()) {
  // Handle primitives and null
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Handle circular references
  if (seen.has(obj)) {
    return seen.get(obj);
  }
  
  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }
  
  // Handle Array
  if (Array.isArray(obj)) {
    const clonedArray = [];
    seen.set(obj, clonedArray); // Store before recursion to handle circular refs
    
    for (let i = 0; i < obj.length; i++) {
      clonedArray[i] = deepCopyIntermediate(obj[i], seen);
    }
    return clonedArray;
  }
  
  // Handle Object
  const clonedObj = {};
  seen.set(obj, clonedObj); // Store before recursion
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = deepCopyIntermediate(obj[key], seen);
    }
  }
  
  return clonedObj;
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');

// Test Date
const objWithDateInt = { date: new Date('2024-01-15'), value: 42 };
const copiedDate = deepCopyIntermediate(objWithDateInt);
console.log('Date preserved:', copiedDate.date instanceof Date); // true
console.log('Date value:', copiedDate.date.toISOString());

// Test RegExp
const objWithRegex = { pattern: /test/gi, name: 'regex test' };
const copiedRegex = deepCopyIntermediate(objWithRegex);
console.log('RegExp preserved:', copiedRegex.pattern instanceof RegExp); // true
console.log('RegExp flags:', copiedRegex.pattern.flags); // 'gi'

// Test Circular Reference
console.log('\n--- CIRCULAR REFERENCE TEST ---');
const circularObj = { a: 1, b: { c: 2 } };
circularObj.self = circularObj;           // Direct circular
circularObj.b.parent = circularObj;       // Indirect circular

const copiedCircular = deepCopyIntermediate(circularObj);
console.log('Circular handled:', copiedCircular.self === copiedCircular); // true
console.log('Nested circular:', copiedCircular.b.parent === copiedCircular); // true
console.log('Original not affected:', circularObj !== copiedCircular); // true


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: Full implementation handling ALL types
 * - Map, Set
 * - TypedArrays (ArrayBuffer, Uint8Array, etc.)
 * - Symbol keys
 * - Property descriptors (getters/setters, non-enumerable)
 * - Prototype chain
 * - Functions (by reference - cannot truly clone)
 */
function deepCopyExpert(obj, seen = new WeakMap()) {
  // Handle primitives and null
  if (obj === null) return null;
  if (typeof obj !== 'object' && typeof obj !== 'function') {
    return obj;
  }
  
  // Handle functions (return reference - can't truly clone)
  if (typeof obj === 'function') {
    return obj;
  }
  
  // Handle circular references
  if (seen.has(obj)) {
    return seen.get(obj);
  }
  
  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }
  
  // Handle Map
  if (obj instanceof Map) {
    const clonedMap = new Map();
    seen.set(obj, clonedMap);
    
    obj.forEach((value, key) => {
      // Clone both key and value (keys can be objects too!)
      clonedMap.set(
        deepCopyExpert(key, seen),
        deepCopyExpert(value, seen)
      );
    });
    return clonedMap;
  }
  
  // Handle Set
  if (obj instanceof Set) {
    const clonedSet = new Set();
    seen.set(obj, clonedSet);
    
    obj.forEach(value => {
      clonedSet.add(deepCopyExpert(value, seen));
    });
    return clonedSet;
  }
  
  // Handle ArrayBuffer
  if (obj instanceof ArrayBuffer) {
    const clonedBuffer = obj.slice(0);
    seen.set(obj, clonedBuffer);
    return clonedBuffer;
  }
  
  // Handle TypedArrays (Uint8Array, Int32Array, etc.)
  if (ArrayBuffer.isView(obj) && !(obj instanceof DataView)) {
    const clonedTypedArray = new obj.constructor(
      deepCopyExpert(obj.buffer, seen),
      obj.byteOffset,
      obj.length
    );
    seen.set(obj, clonedTypedArray);
    return clonedTypedArray;
  }
  
  // Handle DataView
  if (obj instanceof DataView) {
    const clonedDataView = new DataView(
      deepCopyExpert(obj.buffer, seen),
      obj.byteOffset,
      obj.byteLength
    );
    seen.set(obj, clonedDataView);
    return clonedDataView;
  }
  
  // Handle Error objects
  if (obj instanceof Error) {
    const clonedError = new obj.constructor(obj.message);
    clonedError.stack = obj.stack;
    seen.set(obj, clonedError);
    return clonedError;
  }
  
  // Handle Array
  if (Array.isArray(obj)) {
    const clonedArray = [];
    seen.set(obj, clonedArray);
    
    for (let i = 0; i < obj.length; i++) {
      clonedArray[i] = deepCopyExpert(obj[i], seen);
    }
    return clonedArray;
  }
  
  // Handle plain objects and class instances
  // Preserve prototype chain
  const clonedObj = Object.create(Object.getPrototypeOf(obj));
  seen.set(obj, clonedObj);
  
  // Get all keys including Symbols
  const allKeys = [
    ...Object.keys(obj),
    ...Object.getOwnPropertySymbols(obj)
  ];
  
  for (const key of allKeys) {
    // Get property descriptor to preserve getters/setters
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    
    if (descriptor) {
      if ('value' in descriptor) {
        // Regular property with value
        descriptor.value = deepCopyExpert(descriptor.value, seen);
      }
      // Getter/setter are functions - keep as reference
      
      Object.defineProperty(clonedObj, key, descriptor);
    }
  }
  
  return clonedObj;
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');

// Test Map
console.log('--- Map Test ---');
const originalMap = new Map([
  ['key1', { nested: 'value1' }],
  [{ objKey: 1 }, 'objectKey']
]);
const clonedMap = deepCopyExpert(originalMap);
console.log('Map cloned:', clonedMap instanceof Map); // true
console.log('Map size:', clonedMap.size); // 2
console.log('Map value cloned:', clonedMap.get('key1') !== originalMap.get('key1')); // true

// Test Set
console.log('\n--- Set Test ---');
const originalSet = new Set([1, { a: 2 }, [3, 4]]);
const clonedSet = deepCopyExpert(originalSet);
console.log('Set cloned:', clonedSet instanceof Set); // true
console.log('Set size:', clonedSet.size); // 3

// Test Symbol keys
console.log('\n--- Symbol Keys Test ---');
const sym = Symbol('mySymbol');
const objWithSymbol = { [sym]: 'symbolValue', regular: 'regularValue' };
const clonedWithSymbol = deepCopyExpert(objWithSymbol);
console.log('Symbol preserved:', clonedWithSymbol[sym]); // 'symbolValue'

// Test class instance
console.log('\n--- Class Instance Test ---');
class Person {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return `Hello, ${this.name}`;
  }
}
const person = new Person('John');
const clonedPerson = deepCopyExpert(person);
console.log('Prototype preserved:', clonedPerson instanceof Person); // true
console.log('Method works:', clonedPerson.greet()); // 'Hello, John'

// Test property descriptors
console.log('\n--- Property Descriptors Test ---');
const objWithDescriptors = {};
Object.defineProperty(objWithDescriptors, 'readonly', {
  value: 42,
  writable: false,
  enumerable: true,
  configurable: false
});
Object.defineProperty(objWithDescriptors, 'computed', {
  get() { return this._value * 2; },
  set(v) { this._value = v; },
  enumerable: true
});
objWithDescriptors._value = 10;

const clonedWithDescriptors = deepCopyExpert(objWithDescriptors);
console.log('Readonly preserved:', Object.getOwnPropertyDescriptor(clonedWithDescriptors, 'readonly').writable === false);
console.log('Getter works:', clonedWithDescriptors.computed); // 20

// Complex circular reference test
console.log('\n--- Complex Circular Test ---');
const complexCircular = {
  a: 1,
  arr: [1, 2, 3],
  map: new Map(),
  set: new Set()
};
complexCircular.self = complexCircular;
complexCircular.arr.push(complexCircular);
complexCircular.map.set('circular', complexCircular);
complexCircular.set.add(complexCircular);

const clonedComplex = deepCopyExpert(complexCircular);
console.log('Direct circular:', clonedComplex.self === clonedComplex); // true
console.log('Array circular:', clonedComplex.arr[3] === clonedComplex); // true
console.log('Map circular:', clonedComplex.map.get('circular') === clonedComplex); // true


// ============================================
// EDGE CASES & GOTCHAS
// ============================================

console.log('\n=== EDGE CASES ===');

/**
 * EDGE CASE 1: null vs undefined
 */
console.log('null:', deepCopyExpert(null)); // null
console.log('undefined:', deepCopyExpert(undefined)); // undefined

/**
 * EDGE CASE 2: Primitives
 */
console.log('string:', deepCopyExpert('hello')); // 'hello'
console.log('number:', deepCopyExpert(42)); // 42
console.log('boolean:', deepCopyExpert(true)); // true
console.log('bigint:', deepCopyExpert(BigInt(123))); // 123n

/**
 * EDGE CASE 3: Empty structures
 */
console.log('empty object:', deepCopyExpert({})); // {}
console.log('empty array:', deepCopyExpert([])); // []
console.log('empty Map:', deepCopyExpert(new Map())); // Map(0) {}
console.log('empty Set:', deepCopyExpert(new Set())); // Set(0) {}

/**
 * EDGE CASE 4: Sparse arrays
 */
const sparseArray = [1, , , 4]; // Note the holes
const clonedSparse = deepCopyExpert(sparseArray);
console.log('sparse array:', clonedSparse); // [1, <2 empty items>, 4]
console.log('sparse length:', clonedSparse.length); // 4

/**
 * EDGE CASE 5: Very deep nesting
 */
let deepObj = { value: 'bottom' };
for (let i = 0; i < 100; i++) {
  deepObj = { nested: deepObj };
}
const clonedDeep = deepCopyExpert(deepObj);
console.log('Deep nesting handled:', typeof clonedDeep.nested); // 'object'

/**
 * EDGE CASE 6: Object with null prototype
 */
const nullProto = Object.create(null);
nullProto.a = 1;
const clonedNullProto = deepCopyExpert(nullProto);
console.log('Null proto preserved:', Object.getPrototypeOf(clonedNullProto) === null); // true


// ============================================
// COMMON MISTAKES TO AVOID
// ============================================

/**
 * MISTAKE 1: Using == instead of === for null check
 * null == undefined is true, but they should be handled differently
 * 
 * MISTAKE 2: Not handling circular references
 * Will cause "Maximum call stack size exceeded" error
 * 
 * MISTAKE 3: Using Set instead of WeakMap for seen objects
 * Set prevents garbage collection, WeakMap doesn't
 * 
 * MISTAKE 4: Not cloning Map keys
 * Map keys can be objects and need cloning too
 * 
 * MISTAKE 5: Forgetting Symbol keys
 * Object.keys() doesn't include Symbols
 * 
 * MISTAKE 6: Not preserving property descriptors
 * Getters, setters, and flags like writable get lost
 * 
 * MISTAKE 7: Not preserving prototype chain
 * Class instances lose their methods
 */


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * 1. Use WeakMap to track seen objects (circular refs)
 * 2. Store clone in WeakMap BEFORE recursing
 * 3. Check: null, primitives, Date, RegExp, Map, Set, Array, Object
 * 4. Use Object.getOwnPropertySymbols for Symbol keys
 * 5. Use Object.getOwnPropertyDescriptor to preserve descriptors
 * 6. Use Object.create(Object.getPrototypeOf(obj)) to preserve prototype
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Mention JSON.stringify limitations first
 * 2. Explain why WeakMap (vs Set) - garbage collection
 * 3. Discuss time/space complexity: O(n) for both
 * 4. Mention structuredClone() as modern alternative
 * 
 * TYPE HANDLING PRIORITY:
 * -----------------------
 * 1. null/undefined/primitives (base case)
 * 2. Circular reference check
 * 3. Date, RegExp (immutable wrappers)
 * 4. Map, Set (need special iteration)
 * 5. ArrayBuffer, TypedArray (binary data)
 * 6. Array (ordered collection)
 * 7. Plain object (last, most general)
 */


// ============================================
// PRACTICE EXERCISES
// ============================================

/**
 * EXERCISE 1: Implement shallow copy for comparison
 * EXERCISE 2: Add option to exclude certain keys
 * EXERCISE 3: Add option to transform values during copy
 * EXERCISE 4: Implement copy with depth limit
 * EXERCISE 5: Add support for WeakMap and WeakSet
 */

// Exercise 1: Shallow copy for comparison
function shallowCopy(obj) {
  if (Array.isArray(obj)) return [...obj];
  if (obj instanceof Map) return new Map(obj);
  if (obj instanceof Set) return new Set(obj);
  return { ...obj };
}

// Exercise 4: Copy with depth limit
function deepCopyWithLimit(obj, maxDepth = Infinity, seen = new WeakMap(), depth = 0) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (seen.has(obj)) return seen.get(obj);
  
  // If we've reached max depth, return shallow copy
  if (depth >= maxDepth) {
    return Array.isArray(obj) ? [...obj] : { ...obj };
  }
  
  const clone = Array.isArray(obj) ? [] : {};
  seen.set(obj, clone);
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepCopyWithLimit(obj[key], maxDepth, seen, depth + 1);
    }
  }
  
  return clone;
}

console.log('\n=== EXERCISE SOLUTIONS ===');
const nested = { a: { b: { c: { d: 1 } } } };
console.log('Depth 1:', deepCopyWithLimit(nested, 1));
console.log('Depth 2:', deepCopyWithLimit(nested, 2));


// ============================================
// COMPARISON: Different Clone Methods
// ============================================

console.log('\n=== METHOD COMPARISON ===');

const testObj = {
  primitive: 42,
  string: 'hello',
  date: new Date(),
  regex: /test/gi,
  array: [1, 2, { nested: true }],
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3]),
  func: () => 'hello',
  undef: undefined,
  symbol: Symbol('test')
};

console.log('Original:', Object.keys(testObj));

// JSON method
try {
  const jsonCopy = JSON.parse(JSON.stringify(testObj));
  console.log('JSON keys:', Object.keys(jsonCopy));
  console.log('JSON date type:', typeof jsonCopy.date); // string!
} catch (e) {
  console.log('JSON error:', e.message);
}

// structuredClone (if available)
if (typeof structuredClone === 'function') {
  try {
    const structuredCopy = structuredClone(testObj);
    console.log('structuredClone:', Object.keys(structuredCopy));
  } catch (e) {
    console.log('structuredClone error:', e.message); // Can't clone function
  }
}

// Our expert implementation
const expertCopy = deepCopyExpert(testObj);
console.log('Expert keys:', Object.keys(expertCopy));
console.log('Expert date type:', expertCopy.date instanceof Date); // true!
console.log('Expert map type:', expertCopy.map instanceof Map); // true!


module.exports = {
  deepCopyBeginner,
  deepCopyIntermediate,
  deepCopyExpert,
  shallowCopy,
  deepCopyWithLimit
};
