import type { CodingProblem } from '../../types';

export const deepCopyProblem: CodingProblem = {
  id: 'coding-deep-copy',
  title: 'Deep Copy with Circular Reference Handling',
  difficulty: 'Advanced',
  category: 'Coding',
  tags: ['deep-clone', 'recursion', 'WeakMap', 'circular-references', 'data-structures'],

  problem: `Implement a deep copy function that creates a completely independent clone of any JavaScript value, including nested objects, arrays, Dates, RegExps, Maps, Sets, and most importantly — objects with circular references.

A shallow copy (Object.assign or spread) only copies the top-level properties, meaning nested objects still share references with the original. A true deep copy must recursively clone every nested structure so that modifying the clone never affects the original. The critical challenge is handling circular references: if an object references itself (directly or indirectly), a naive recursive clone will enter infinite recursion.

Your solution must use a WeakMap to track already-cloned objects. When a previously-seen object is encountered during traversal, return the already-created clone instead of recursing into it again. This breaks the cycle and correctly preserves the circular structure in the clone.`,

  requirements: [
    'Clone primitive values (string, number, boolean, null, undefined) by direct return',
    'Deep clone nested objects preserving all enumerable properties',
    'Deep clone arrays preserving order and nested structures',
    'Handle circular references without infinite recursion using a WeakMap',
    'Clone Date objects preserving the timestamp',
    'Clone RegExp objects preserving pattern and flags',
    'Clone Map and Set instances with deep-cloned entries',
    'Preserve prototype chain of cloned objects',
  ],

  examples: [
    {
      input: `const obj = { a: 1, b: { c: 2, d: [3, 4] } };\nconst clone = deepCopy(obj);\nclone.b.c = 99;`,
      output: 'obj.b.c is still 2 (original unaffected)',
      explanation: 'The nested object is independently cloned, so mutations to the clone do not affect the original.',
    },
    {
      input: `const obj = { name: "test" };\nobj.self = obj;\nconst clone = deepCopy(obj);`,
      output: 'clone.self === clone (circular ref preserved, no infinite loop)',
      explanation: 'The WeakMap detects the circular reference and returns the already-created clone object.',
    },
    {
      input: `const original = { date: new Date("2024-01-01"), regex: /abc/gi };\nconst clone = deepCopy(original);`,
      output: 'clone.date instanceof Date === true, clone.regex instanceof RegExp === true',
      explanation: 'Special built-in objects are cloned using their constructors with the original values.',
    },
  ],

  edgeCases: [
    'Self-referencing objects (obj.self = obj)',
    'Mutually referencing objects (a.ref = b; b.ref = a)',
    'Nested arrays containing objects with circular refs',
    'Date, RegExp, Map, Set instances inside deeply nested structures',
    'Null and undefined values within nested objects',
  ],

  naiveApproach: `The naive approach is JSON.parse(JSON.stringify(obj)). While simple, it fails on circular references (throws TypeError), loses Date objects (converts to strings), drops undefined and function values, and cannot handle RegExp, Map, or Set. It's only suitable for plain JSON-compatible data without cycles.`,

  optimalApproach: `The optimal approach uses a recursive function with a WeakMap parameter to cache cloned objects. At the start of each call, check if the value is a primitive (return directly) or already in the cache (return the cached clone to break cycles). For objects, create an empty clone first, store it in the cache immediately (before recursing into properties), then recursively clone each property.

Special types are handled with targeted constructors: new Date(original.getTime()) for dates, new RegExp(original.source, original.flags) for regexps. For Maps and Sets, create empty instances, cache them, then iterate and deep-clone each entry. Arrays are handled by creating a new array, caching it, and recursively cloning each element. This cache-before-recurse pattern is the key insight that makes circular reference handling work.`,

  implementation: `function deepCopy(value, cache = new WeakMap()) {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (cache.has(value)) {
    return cache.get(value);
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  if (value instanceof Map) {
    const mapClone = new Map();
    cache.set(value, mapClone);
    value.forEach((val, key) => {
      mapClone.set(deepCopy(key, cache), deepCopy(val, cache));
    });
    return mapClone;
  }

  if (value instanceof Set) {
    const setClone = new Set();
    cache.set(value, setClone);
    value.forEach((val) => {
      setClone.add(deepCopy(val, cache));
    });
    return setClone;
  }

  const clone = Array.isArray(value)
    ? []
    : Object.create(Object.getPrototypeOf(value));

  cache.set(value, clone);

  const keys = [...Object.keys(value), ...Object.getOwnPropertySymbols(value)];
  for (const key of keys) {
    clone[key] = deepCopy(value[key], cache);
  }

  return clone;
}

// Usage
const original = { a: 1, b: { c: [2, 3] }, d: new Date() };
original.self = original;

const cloned = deepCopy(original);
console.log(cloned.b.c);          // [2, 3]
console.log(cloned.self === cloned); // true (circular ref preserved)
console.log(cloned.d instanceof Date); // true
cloned.b.c.push(4);
console.log(original.b.c);        // [2, 3] (original unaffected)`,

  implementationTS: `function deepCopy<T>(value: T, cache: WeakMap<object, unknown> = new WeakMap()): T {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  const obj = value as object;

  if (cache.has(obj)) {
    return cache.get(obj) as T;
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as unknown as T;
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as unknown as T;
  }

  if (value instanceof Map) {
    const mapClone = new Map();
    cache.set(obj, mapClone);
    value.forEach((val, key) => {
      mapClone.set(deepCopy(key, cache), deepCopy(val, cache));
    });
    return mapClone as unknown as T;
  }

  if (value instanceof Set) {
    const setClone = new Set();
    cache.set(obj, setClone);
    value.forEach((val) => {
      setClone.add(deepCopy(val, cache));
    });
    return setClone as unknown as T;
  }

  const clone: Record<string | symbol, unknown> = Array.isArray(value)
    ? []
    : Object.create(Object.getPrototypeOf(obj));

  cache.set(obj, clone);

  const keys: (string | symbol)[] = [
    ...Object.keys(obj),
    ...Object.getOwnPropertySymbols(obj),
  ];
  for (const key of keys) {
    clone[key] = deepCopy((obj as Record<string | symbol, unknown>)[key], cache);
  }

  return clone as T;
}`,

  stepByStep: [
    'Check if the value is a primitive (null or non-object typeof) — return it directly.',
    'Check the WeakMap cache — if the object was already cloned, return the cached clone.',
    'Handle special built-in types: Date (new Date with same time), RegExp (new RegExp with source/flags).',
    'Handle Map and Set: create empty instance, cache it, then iterate and deep-clone each entry.',
    'For arrays and plain objects, create an empty clone ([] or Object.create(proto)).',
    'Immediately store the empty clone in the WeakMap cache BEFORE recursing into properties.',
    'Iterate all keys (including Symbols) and recursively deep-copy each value into the clone.',
    'Return the fully populated clone.',
  ],

  timeComplexity: 'O(n) where n is the total number of properties/elements across all nested structures.',
  spaceComplexity: 'O(n) for the cloned structure plus O(d) recursion stack depth, plus O(n) for the WeakMap cache.',

  commonMistakes: [
    'Not caching the clone BEFORE recursing — the clone must be in the cache before processing children to break cycles',
    'Using a regular Map or object instead of WeakMap (prevents garbage collection of cloned objects)',
    'Forgetting to handle Date, RegExp, Map, or Set (they need constructor-based cloning)',
    'Using JSON.parse(JSON.stringify()) which fails on circular refs, Dates, and undefined',
  ],

  followUps: [
    'How would you handle cloning of functions or class instances with methods?',
    'What are the trade-offs of structuredClone() vs a manual deep copy?',
    'How would you deep copy objects with non-enumerable or getter/setter properties?',
  ],
};
