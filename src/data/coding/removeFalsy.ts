import type { CodingProblem } from "../../types";

export const removeFalsyProblem: CodingProblem = {
  id: "coding-remove-falsy",
  title: "Remove Falsy Values from Nested Object",
  difficulty: "Intermediate",
  category: "Coding",
  tags: [
    "recursion",
    "objects",
    "filtering",
    "data-cleaning",
    "nested-structures",
  ],

  problem: `Implement a function that recursively removes all falsy values from a deeply nested object. Falsy values in JavaScript are: false, 0, -0, 0n, "", null, undefined, and NaN. The function should traverse objects and arrays at every level, removing falsy entries.

For objects, remove keys whose values are falsy. For arrays, filter out falsy elements. For nested objects and arrays, recurse into them first, then check if the resulting object/array is empty — if so, remove it too (since an empty object or array after cleaning provides no useful data).

This is a practical data-cleaning utility used in form processing (removing empty fields before submission), API payload optimization (reducing transfer size), configuration merging (stripping unset values), and database query building (omitting null parameters). It tests recursive traversal, type checking, and the nuanced definition of "falsy" in JavaScript.`,

  requirements: [
    'Remove all falsy values (false, 0, "", null, undefined, NaN) from objects',
    "Filter falsy values from arrays",
    "Recursively process nested objects and arrays",
    "Remove empty objects ({}) and empty arrays ([]) that result from cleaning",
    "Preserve truthy values including objects, arrays, strings, numbers",
    "Return a new structure without mutating the original",
    "Handle the root value being falsy (return undefined or empty object)",
  ],

  examples: [
    {
      input: `removeFalsy({ a: 1, b: null, c: { d: "", e: 2, f: undefined }, g: false })`,
      output: `{ a: 1, c: { e: 2 } }`,
      explanation:
        "null, empty string, undefined, and false are removed. The nested object c retains only its truthy value e.",
    },
    {
      input: `removeFalsy({ a: [1, 0, null, 2, "", 3], b: { c: { d: null } } })`,
      output: `{ a: [1, 2, 3] }`,
      explanation:
        "Array is filtered. Nested object b.c becomes empty after removing d:null, then b becomes empty, so both are removed.",
    },
    {
      input: `removeFalsy({ x: 0, y: "hello", z: { nested: NaN } })`,
      output: `{ y: "hello" }`,
      explanation:
        "0 and NaN are falsy. The nested object with only NaN becomes empty and is removed.",
    },
  ],

  edgeCases: [
    "All values are falsy (should return empty object or undefined)",
    "Deeply nested structure where cleaning propagates upward",
    "Arrays containing objects that become empty after cleaning",
    'Value 0 is falsy — important distinction from "zero is valid data" use cases',
    'Empty string "" is falsy — may need a custom predicate for form data',
  ],

  naiveApproach: `A naive approach only removes top-level falsy values using Object.entries and filter, ignoring nested structures. Another common mistake is removing falsy values but not cleaning up the resulting empty objects/arrays, leading to hollow structures like { a: {}, b: [] } that are effectively empty but still present. A third mistake is mutating the original object instead of creating a clean copy.`,

  optimalApproach: `The optimal approach uses a recursive function with bottom-up cleaning. For arrays: map each element through the function recursively, then filter out falsy values and empty containers. For objects: iterate keys, recursively clean each value, and only include the key in the result if the cleaned value is truthy and not an empty container.

The "bottom-up" strategy is key: clean the deepest levels first, then check if the resulting container is empty. This naturally handles cases where nested objects become empty after their children are removed. A helper function isEmptyContainer checks if a value is {} or [], and is used after recursive cleaning to decide whether to include the value.

For flexibility, accepting a custom predicate instead of the default Boolean check allows users to customize what counts as "falsy" (e.g., keeping 0 but removing null).`,

  implementation: `function removeFalsy(value, predicate) {
  const shouldRemove = predicate || ((v) => !v && v !== undefined);

  function isEmptyContainer(v) {
    if (Array.isArray(v)) return v.length === 0;
    if (v && typeof v === 'object') return Object.keys(v).length === 0;
    return false;
  }

  function clean(val) {
    if (Array.isArray(val)) {
      const cleaned = val
        .map(item => clean(item))
        .filter(item => {
          if (isEmptyContainer(item)) return false;
          return !!item || item === 0 || item === false;
        });
      return cleaned;
    }

    if (val !== null && typeof val === 'object') {
      const result = {};
      for (const key of Object.keys(val)) {
        const cleaned = clean(val[key]);
        if (isEmptyContainer(cleaned)) continue;
        if (!cleaned && cleaned !== 0 && cleaned !== false) continue;
        result[key] = cleaned;
      }
      return result;
    }

    return val;
  }

  const result = clean(value);
  if (isEmptyContainer(result)) return Array.isArray(value) ? [] : {};
  return result;
}

// Stricter version that removes all JS falsy values
function removeFalsyStrict(value) {
  function isEmptyContainer(v) {
    if (Array.isArray(v)) return v.length === 0;
    if (v && typeof v === 'object') return Object.keys(v).length === 0;
    return false;
  }

  function clean(val) {
    if (Array.isArray(val)) {
      return val
        .map(item => clean(item))
        .filter(item => !isEmptyContainer(item) && Boolean(item));
    }

    if (val !== null && typeof val === 'object') {
      const result = {};
      for (const key of Object.keys(val)) {
        const cleaned = clean(val[key]);
        if (!Boolean(cleaned) || isEmptyContainer(cleaned)) continue;
        result[key] = cleaned;
      }
      return result;
    }

    return val;
  }

  const result = clean(value);
  return isEmptyContainer(result) ? (Array.isArray(value) ? [] : {}) : result;
}

// Usage
const formData = {
  name: 'Alice',
  age: 0,
  email: '',
  address: {
    street: '123 Main St',
    apt: null,
    city: '',
    state: 'CA',
    details: { floor: undefined, notes: '' },
  },
  tags: ['dev', '', null, 'admin'],
  preferences: { theme: null, lang: undefined },
};

console.log(removeFalsyStrict(formData));
// {
//   name: 'Alice',
//   address: { street: '123 Main St', state: 'CA' },
//   tags: ['dev', 'admin']
// }`,

  implementationTS: `function removeFalsyStrict(value: unknown): unknown {
  function isEmptyContainer(v: unknown): boolean {
    if (Array.isArray(v)) return v.length === 0;
    if (v && typeof v === 'object') return Object.keys(v).length === 0;
    return false;
  }

  function clean(val: unknown): unknown {
    if (Array.isArray(val)) {
      return val
        .map(item => clean(item))
        .filter(item => !isEmptyContainer(item) && Boolean(item));
    }

    if (val !== null && typeof val === 'object') {
      const result: Record<string, unknown> = {};
      const obj = val as Record<string, unknown>;
      for (const key of Object.keys(obj)) {
        const cleaned = clean(obj[key]);
        if (!Boolean(cleaned) || isEmptyContainer(cleaned)) continue;
        result[key] = cleaned;
      }
      return result;
    }

    return val;
  }

  const result = clean(value);
  return isEmptyContainer(result)
    ? (Array.isArray(value) ? [] : {})
    : result;
}`,

  theoryAndConcepts:
    'WHAT ARE FALSY VALUES IN JAVASCRIPT?\n------------------------------------\nValues that evaluate to false in boolean context:\n\n1. false        - boolean false\n2. 0            - zero\n3. -0           - negative zero\n4. 0n           - BigInt zero\n5. ""           - empty string\n6. null         - null\n7. undefined    - undefined\n8. NaN          - Not a Number\n\nTRUTHY VALUES (NOT falsy):\n- true\n- Any non-zero number\n- Non-empty string\n- Objects {} (even empty!)\n- Arrays [] (even empty!)\n- Functions\n\nUSE CASES:\n----------\n1. Cleaning API responses\n2. Form data sanitization\n3. Removing optional empty fields\n4. Preparing data for storage',
  beginnerApproach:
    "Beginner: Remove falsy values from array\n\n\nBeginner: Remove falsy values from object (shallow)",
  beginnerImplementation:
    "function compactArrayBeginner(arr) {\n  return arr.filter(Boolean);\n  // Same as: arr.filter(item => Boolean(item))\n  // Same as: arr.filter(item => !!item)\n}\n\nfunction compactObjectBeginner(obj) {\n  const result = {};\n  \n  for (const key in obj) {\n    if (obj.hasOwnProperty(key) && obj[key]) {\n      result[key] = obj[key];\n    }\n  }\n  \n  return result;\n}\n\n// Test Beginner Level\nconsole.log('=== BEGINNER LEVEL ===');\n\n// Array\nconst arr = [0, 1, false, 2, '', 3, null, undefined, NaN, 4];\nconsole.log('Compact array:', compactArrayBeginner(arr));\n// [1, 2, 3, 4]\n\n// Object\nconst obj = {\n  name: 'John',\n  age: 0,\n  email: '',\n  active: false,\n  address: null,\n  phone: undefined\n};\nconsole.log('Compact object:', compactObjectBeginner(obj));\n// { name: 'John' }",
  intermediateApproach: "Intermediate: Deep compact with options",
  intermediateImplementation:
    "function compactIntermediate(value, options = {}) {\n  const {\n    deep = true,              // Recursively compact nested objects\n    removeEmptyArrays = false,// Remove [] as falsy\n    removeEmptyObjects = false,// Remove {} as falsy\n    removeZero = false,       // Treat 0 as falsy (it is by default)\n    keepZero = false,         // Explicitly keep 0 (override default)\n    keepEmptyString = false   // Keep empty strings\n  } = options;\n  \n  function isFalsy(val) {\n    if (val === null || val === undefined || Number.isNaN(val)) {\n      return true;\n    }\n    if (val === false) return true;\n    if (val === 0 && !keepZero) return true;\n    if (val === '' && !keepEmptyString) return true;\n    if (removeEmptyArrays && Array.isArray(val) && val.length === 0) return true;\n    if (removeEmptyObjects && isPlainObject(val) && Object.keys(val).length === 0) return true;\n    return false;\n  }\n  \n  function isPlainObject(val) {\n    return val !== null && typeof val === 'object' && !Array.isArray(val);\n  }\n  \n  function compact(val) {\n    // Handle arrays\n    if (Array.isArray(val)) {\n      const result = val\n        .map(item => deep ? compact(item) : item)\n        .filter(item => !isFalsy(item));\n      \n      return removeEmptyArrays && result.length === 0 ? undefined : result;\n    }\n    \n    // Handle plain objects\n    if (isPlainObject(val)) {\n      const result = {};\n      \n      for (const key in val) {\n        if (val.hasOwnProperty(key)) {\n          const processed = deep ? compact(val[key]) : val[key];\n          \n          if (!isFalsy(processed)) {\n            result[key] = processed;\n          }\n        }\n      }\n      \n      return removeEmptyObjects && Object.keys(result).length === 0 ? undefined : result;\n    }\n    \n    // Return primitives as-is (filtering happens at parent level)\n    return val;\n  }\n  \n  return compact(value);\n}\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL ===');\n\nconst nestedData = {\n  user: {\n    name: 'John',\n    age: 0,\n    profile: {\n      bio: '',\n      avatar: null,\n      social: {\n        twitter: '@john',\n        facebook: ''\n      }\n    }\n  },\n  items: [1, 0, null, '', 'valid', { empty: '' }],\n  empty: {},\n  emptyArr: []\n};\n\nconsole.log('Deep compact:');\nconsole.log(JSON.stringify(compactIntermediate(nestedData), null, 2));\n\nconsole.log('\\nWith options (keep zero, remove empty):');\nconsole.log(JSON.stringify(compactIntermediate(nestedData, {\n  keepZero: true,\n  removeEmptyArrays: true,\n  removeEmptyObjects: true\n}), null, 2));",
  expertApproach: "Expert: Highly configurable compactor",
  expertImplementation:
    "class DataCompactor {\n  constructor(options = {}) {\n    this.options = {\n      deep: true,\n      customFalsyCheck: null,  // Custom function to determine falsy\n      preserveKeys: [],        // Keys to never remove\n      removeKeys: [],          // Keys to always remove\n      transformers: {},        // Transform values before checking\n      maxDepth: Infinity,\n      ...options\n    };\n  }\n  \n  isFalsy(value, key, depth) {\n    // Custom check\n    if (this.options.customFalsyCheck) {\n      return this.options.customFalsyCheck(value, key, depth);\n    }\n    \n    // Standard falsy check\n    if (value === null || value === undefined) return true;\n    if (value === false) return true;\n    if (value === '') return true;\n    if (typeof value === 'number' && (value === 0 || Number.isNaN(value))) return true;\n    \n    return false;\n  }\n  \n  shouldRemoveKey(key) {\n    return this.options.removeKeys.includes(key);\n  }\n  \n  shouldPreserveKey(key) {\n    return this.options.preserveKeys.includes(key);\n  }\n  \n  compact(value, currentDepth = 0, parentKey = null) {\n    // Max depth reached\n    if (currentDepth > this.options.maxDepth) {\n      return value;\n    }\n    \n    // Apply transformer\n    if (parentKey && this.options.transformers[parentKey]) {\n      value = this.options.transformers[parentKey](value);\n    }\n    \n    // Handle arrays\n    if (Array.isArray(value)) {\n      const result = [];\n      \n      for (let i = 0; i < value.length; i++) {\n        const item = this.options.deep \n          ? this.compact(value[i], currentDepth + 1, null)\n          : value[i];\n        \n        if (!this.isFalsy(item, i, currentDepth)) {\n          result.push(item);\n        }\n      }\n      \n      return result;\n    }\n    \n    // Handle objects\n    if (value !== null && typeof value === 'object') {\n      const result = {};\n      \n      for (const key of Object.keys(value)) {\n        // Always remove certain keys\n        if (this.shouldRemoveKey(key)) continue;\n        \n        const processed = this.options.deep\n          ? this.compact(value[key], currentDepth + 1, key)\n          : value[key];\n        \n        // Preserve certain keys regardless of value\n        if (this.shouldPreserveKey(key)) {\n          result[key] = processed;\n          continue;\n        }\n        \n        if (!this.isFalsy(processed, key, currentDepth)) {\n          result[key] = processed;\n        }\n      }\n      \n      return result;\n    }\n    \n    return value;\n  }\n  \n  // Fluent API\n  preserveKey(...keys) {\n    this.options.preserveKeys.push(...keys);\n    return this;\n  }\n  \n  removeKey(...keys) {\n    this.options.removeKeys.push(...keys);\n    return this;\n  }\n  \n  transform(key, fn) {\n    this.options.transformers[key] = fn;\n    return this;\n  }\n  \n  setFalsyCheck(fn) {\n    this.options.customFalsyCheck = fn;\n    return this;\n  }\n}\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL ===');\n\nconst compactor = new DataCompactor()\n  .preserveKey('id', 'version')      // Never remove these\n  .removeKey('_internal', 'debug')   // Always remove these\n  .transform('name', v => v?.trim()) // Trim names\n  .setFalsyCheck((value, key, depth) => {\n    // Custom: Keep 0 for 'count' fields\n    if (key === 'count' && value === 0) return false;\n    // Standard check\n    return value === null || value === undefined || value === '' || value === false;\n  });\n\nconst complexData = {\n  id: 0,                    // Preserved (even though 0)\n  version: '',              // Preserved (even though empty)\n  name: '  John  ',         // Transformed (trimmed)\n  _internal: 'secret',      // Removed\n  debug: true,              // Removed\n  count: 0,                 // Kept (custom check)\n  status: null,             // Removed\n  nested: {\n    value: '',              // Removed\n    count: 0                // Kept\n  }\n};\n\nconsole.log('Expert compacted:', compactor.compact(complexData));",
  interviewTraps: [
    "QUICK REFERENCE:",
    'Falsy: false, 0, -0, 0n, "", null, undefined, NaN',
    "Truthy: Everything else (including [] and {})",
    "INTERVIEW TIPS:",
    "1. List all 8 falsy values",
    "2. Explain [] and {} are truthy",
    "3. Mention NaN !== NaN",
    "4. Discuss deep vs shallow compact",
  ],
  stepByStep: [
    "Define a helper isEmptyContainer to check if a value is an empty array or empty object.",
    "For arrays: recursively clean each element via map, then filter out falsy values and empty containers.",
    "For objects: iterate keys, recursively clean each value, skip falsy or empty container results.",
    "For primitives: return the value as-is (the parent will decide whether to include it).",
    "The bottom-up approach ensures nested empty containers are detected after their children are cleaned.",
    "After the root-level clean, check if the result itself is an empty container.",
  ],

  timeComplexity:
    "O(n) where n is the total number of values in the nested structure.",
  spaceComplexity:
    "O(n) for the new cleaned structure, plus O(d) recursion depth.",

  commonMistakes: [
    'Not handling the typeof null === "object" gotcha, causing crashes when recursing into null',
    "Removing 0 or false when they should be treated as valid data (depends on use case)",
    "Not cleaning up empty containers after removing their children",
    "Mutating the original object instead of building a new one",
  ],

  followUps: [
    "How would you make this configurable — e.g., keep 0 and false but remove null and undefined?",
    "How would you implement the inverse: extract all paths with falsy values for validation errors?",
    "How would you handle this with immutable data structures (e.g., Immer)?",
  ],
};
