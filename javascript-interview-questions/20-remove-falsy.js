/**
 * ============================================
 * REMOVE FALSY VALUES - Complete Guide
 * ============================================
 * 
 * Topic: Implement a function that returns an object with all falsy values removed
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * WHAT ARE FALSY VALUES IN JAVASCRIPT?
 * ------------------------------------
 * Values that evaluate to false in boolean context:
 * 
 * 1. false        - boolean false
 * 2. 0            - zero
 * 3. -0           - negative zero
 * 4. 0n           - BigInt zero
 * 5. ""           - empty string
 * 6. null         - null
 * 7. undefined    - undefined
 * 8. NaN          - Not a Number
 * 
 * TRUTHY VALUES (NOT falsy):
 * - true
 * - Any non-zero number
 * - Non-empty string
 * - Objects {} (even empty!)
 * - Arrays [] (even empty!)
 * - Functions
 * 
 * USE CASES:
 * ----------
 * 1. Cleaning API responses
 * 2. Form data sanitization
 * 3. Removing optional empty fields
 * 4. Preparing data for storage
 */

// ============================================
// BEGINNER LEVEL
// ============================================

/**
 * Beginner: Remove falsy values from array
 */
function compactArrayBeginner(arr) {
  return arr.filter(Boolean);
  // Same as: arr.filter(item => Boolean(item))
  // Same as: arr.filter(item => !!item)
}

/**
 * Beginner: Remove falsy values from object (shallow)
 */
function compactObjectBeginner(obj) {
  const result = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key]) {
      result[key] = obj[key];
    }
  }
  
  return result;
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

// Array
const arr = [0, 1, false, 2, '', 3, null, undefined, NaN, 4];
console.log('Compact array:', compactArrayBeginner(arr));
// [1, 2, 3, 4]

// Object
const obj = {
  name: 'John',
  age: 0,
  email: '',
  active: false,
  address: null,
  phone: undefined
};
console.log('Compact object:', compactObjectBeginner(obj));
// { name: 'John' }


// ============================================
// INTERMEDIATE LEVEL
// ============================================

/**
 * Intermediate: Deep compact with options
 */
function compactIntermediate(value, options = {}) {
  const {
    deep = true,              // Recursively compact nested objects
    removeEmptyArrays = false,// Remove [] as falsy
    removeEmptyObjects = false,// Remove {} as falsy
    removeZero = false,       // Treat 0 as falsy (it is by default)
    keepZero = false,         // Explicitly keep 0 (override default)
    keepEmptyString = false   // Keep empty strings
  } = options;
  
  function isFalsy(val) {
    if (val === null || val === undefined || Number.isNaN(val)) {
      return true;
    }
    if (val === false) return true;
    if (val === 0 && !keepZero) return true;
    if (val === '' && !keepEmptyString) return true;
    if (removeEmptyArrays && Array.isArray(val) && val.length === 0) return true;
    if (removeEmptyObjects && isPlainObject(val) && Object.keys(val).length === 0) return true;
    return false;
  }
  
  function isPlainObject(val) {
    return val !== null && typeof val === 'object' && !Array.isArray(val);
  }
  
  function compact(val) {
    // Handle arrays
    if (Array.isArray(val)) {
      const result = val
        .map(item => deep ? compact(item) : item)
        .filter(item => !isFalsy(item));
      
      return removeEmptyArrays && result.length === 0 ? undefined : result;
    }
    
    // Handle plain objects
    if (isPlainObject(val)) {
      const result = {};
      
      for (const key in val) {
        if (val.hasOwnProperty(key)) {
          const processed = deep ? compact(val[key]) : val[key];
          
          if (!isFalsy(processed)) {
            result[key] = processed;
          }
        }
      }
      
      return removeEmptyObjects && Object.keys(result).length === 0 ? undefined : result;
    }
    
    // Return primitives as-is (filtering happens at parent level)
    return val;
  }
  
  return compact(value);
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');

const nestedData = {
  user: {
    name: 'John',
    age: 0,
    profile: {
      bio: '',
      avatar: null,
      social: {
        twitter: '@john',
        facebook: ''
      }
    }
  },
  items: [1, 0, null, '', 'valid', { empty: '' }],
  empty: {},
  emptyArr: []
};

console.log('Deep compact:');
console.log(JSON.stringify(compactIntermediate(nestedData), null, 2));

console.log('\nWith options (keep zero, remove empty):');
console.log(JSON.stringify(compactIntermediate(nestedData, {
  keepZero: true,
  removeEmptyArrays: true,
  removeEmptyObjects: true
}), null, 2));


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: Highly configurable compactor
 */
class DataCompactor {
  constructor(options = {}) {
    this.options = {
      deep: true,
      customFalsyCheck: null,  // Custom function to determine falsy
      preserveKeys: [],        // Keys to never remove
      removeKeys: [],          // Keys to always remove
      transformers: {},        // Transform values before checking
      maxDepth: Infinity,
      ...options
    };
  }
  
  isFalsy(value, key, depth) {
    // Custom check
    if (this.options.customFalsyCheck) {
      return this.options.customFalsyCheck(value, key, depth);
    }
    
    // Standard falsy check
    if (value === null || value === undefined) return true;
    if (value === false) return true;
    if (value === '') return true;
    if (typeof value === 'number' && (value === 0 || Number.isNaN(value))) return true;
    
    return false;
  }
  
  shouldRemoveKey(key) {
    return this.options.removeKeys.includes(key);
  }
  
  shouldPreserveKey(key) {
    return this.options.preserveKeys.includes(key);
  }
  
  compact(value, currentDepth = 0, parentKey = null) {
    // Max depth reached
    if (currentDepth > this.options.maxDepth) {
      return value;
    }
    
    // Apply transformer
    if (parentKey && this.options.transformers[parentKey]) {
      value = this.options.transformers[parentKey](value);
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
      const result = [];
      
      for (let i = 0; i < value.length; i++) {
        const item = this.options.deep 
          ? this.compact(value[i], currentDepth + 1, null)
          : value[i];
        
        if (!this.isFalsy(item, i, currentDepth)) {
          result.push(item);
        }
      }
      
      return result;
    }
    
    // Handle objects
    if (value !== null && typeof value === 'object') {
      const result = {};
      
      for (const key of Object.keys(value)) {
        // Always remove certain keys
        if (this.shouldRemoveKey(key)) continue;
        
        const processed = this.options.deep
          ? this.compact(value[key], currentDepth + 1, key)
          : value[key];
        
        // Preserve certain keys regardless of value
        if (this.shouldPreserveKey(key)) {
          result[key] = processed;
          continue;
        }
        
        if (!this.isFalsy(processed, key, currentDepth)) {
          result[key] = processed;
        }
      }
      
      return result;
    }
    
    return value;
  }
  
  // Fluent API
  preserveKey(...keys) {
    this.options.preserveKeys.push(...keys);
    return this;
  }
  
  removeKey(...keys) {
    this.options.removeKeys.push(...keys);
    return this;
  }
  
  transform(key, fn) {
    this.options.transformers[key] = fn;
    return this;
  }
  
  setFalsyCheck(fn) {
    this.options.customFalsyCheck = fn;
    return this;
  }
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');

const compactor = new DataCompactor()
  .preserveKey('id', 'version')      // Never remove these
  .removeKey('_internal', 'debug')   // Always remove these
  .transform('name', v => v?.trim()) // Trim names
  .setFalsyCheck((value, key, depth) => {
    // Custom: Keep 0 for 'count' fields
    if (key === 'count' && value === 0) return false;
    // Standard check
    return value === null || value === undefined || value === '' || value === false;
  });

const complexData = {
  id: 0,                    // Preserved (even though 0)
  version: '',              // Preserved (even though empty)
  name: '  John  ',         // Transformed (trimmed)
  _internal: 'secret',      // Removed
  debug: true,              // Removed
  count: 0,                 // Kept (custom check)
  status: null,             // Removed
  nested: {
    value: '',              // Removed
    count: 0                // Kept
  }
};

console.log('Expert compacted:', compactor.compact(complexData));


// ============================================
// UTILITY FUNCTIONS
// ============================================

console.log('\n=== UTILITY FUNCTIONS ===');

// Remove only null/undefined (keep other falsy)
function removeNullish(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null)
  );
}

// Remove empty strings only
function removeEmptyStrings(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== '')
  );
}

// Remove specific values
function removeValues(obj, valuesToRemove) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => !valuesToRemove.includes(v))
  );
}

// Pick truthy values
function pickTruthy(obj, keys) {
  return keys.reduce((result, key) => {
    if (obj[key]) {
      result[key] = obj[key];
    }
    return result;
  }, {});
}

// Omit falsy values
function omitFalsy(obj, keys) {
  const result = { ...obj };
  for (const key of keys) {
    if (!result[key]) {
      delete result[key];
    }
  }
  return result;
}

console.log('removeNullish:', removeNullish({ a: null, b: 0, c: '', d: 1 }));
console.log('removeEmptyStrings:', removeEmptyStrings({ a: '', b: 'hello', c: 0 }));


// ============================================
// EDGE CASES
// ============================================

console.log('\n=== EDGE CASES ===');

// Empty array vs empty object
console.log('Empty array is truthy:', Boolean([]));  // true
console.log('Empty object is truthy:', Boolean({})); // true

// -0 vs 0
console.log('-0 is falsy:', Boolean(-0)); // false
console.log('0 is falsy:', Boolean(0));   // false

// NaN
console.log('NaN is falsy:', Boolean(NaN)); // false

// Whitespace string
console.log('Whitespace is truthy:', Boolean('   ')); // true!

// Document/function
console.log('Function is truthy:', Boolean(() => {})); // true


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * Falsy: false, 0, -0, 0n, "", null, undefined, NaN
 * Truthy: Everything else (including [] and {})
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. List all 8 falsy values
 * 2. Explain [] and {} are truthy
 * 3. Mention NaN !== NaN
 * 4. Discuss deep vs shallow compact
 * 
 * ARRAY: arr.filter(Boolean)
 * OBJECT: Object.fromEntries(Object.entries(obj).filter(([_,v]) => v))
 */


module.exports = {
  compactArrayBeginner,
  compactObjectBeginner,
  compactIntermediate,
  DataCompactor,
  removeNullish,
  removeEmptyStrings,
  removeValues,
  pickTruthy,
  omitFalsy
};
