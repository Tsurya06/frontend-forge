import type { CodingProblem } from "../../types";

export const deepCopyProblem: CodingProblem = {
  id: "coding-deep-copy",
  title: "Deep Copy with Circular Reference Handling",
  difficulty: "Advanced",
  category: "Coding",
  tags: [
    "deep-clone",
    "recursion",
    "WeakMap",
    "circular-references",
    "data-structures",
  ],

  problem: `Implement a deep copy function that creates a completely independent clone of any JavaScript value, including nested objects, arrays, Dates, RegExps, Maps, Sets, and most importantly — objects with circular references.

A shallow copy (Object.assign or spread) only copies the top-level properties, meaning nested objects still share references with the original. A true deep copy must recursively clone every nested structure so that modifying the clone never affects the original. The critical challenge is handling circular references: if an object references itself (directly or indirectly), a naive recursive clone will enter infinite recursion.

Your solution must use a WeakMap to track already-cloned objects. When a previously-seen object is encountered during traversal, return the already-created clone instead of recursing into it again. This breaks the cycle and correctly preserves the circular structure in the clone.`,

  requirements: [
    "Clone primitive values (string, number, boolean, null, undefined) by direct return",
    "Deep clone nested objects preserving all enumerable properties",
    "Deep clone arrays preserving order and nested structures",
    "Handle circular references without infinite recursion using a WeakMap",
    "Clone Date objects preserving the timestamp",
    "Clone RegExp objects preserving pattern and flags",
    "Clone Map and Set instances with deep-cloned entries",
    "Preserve prototype chain of cloned objects",
  ],

  examples: [
    {
      input: `const obj = { a: 1, b: { c: 2, d: [3, 4] } };\nconst clone = deepCopy(obj);\nclone.b.c = 99;`,
      output: "obj.b.c is still 2 (original unaffected)",
      explanation:
        "The nested object is independently cloned, so mutations to the clone do not affect the original.",
    },
    {
      input: `const obj = { name: "test" };\nobj.self = obj;\nconst clone = deepCopy(obj);`,
      output: "clone.self === clone (circular ref preserved, no infinite loop)",
      explanation:
        "The WeakMap detects the circular reference and returns the already-created clone object.",
    },
    {
      input: `const original = { date: new Date("2024-01-01"), regex: /abc/gi };\nconst clone = deepCopy(original);`,
      output:
        "clone.date instanceof Date === true, clone.regex instanceof RegExp === true",
      explanation:
        "Special built-in objects are cloned using their constructors with the original values.",
    },
  ],

  edgeCases: [
    "Self-referencing objects (obj.self = obj)",
    "Mutually referencing objects (a.ref = b; b.ref = a)",
    "Nested arrays containing objects with circular refs",
    "Date, RegExp, Map, Set instances inside deeply nested structures",
    "Null and undefined values within nested objects",
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

  theoryAndConcepts:
    "SHALLOW COPY VS DEEP COPY:\n--------------------------\n\nSHALLOW COPY:\n- Creates a new object\n- Copies only the first level properties\n- Nested objects share the same reference\n- Methods: Object.assign(), spread operator {...}\n\nDEEP COPY:\n- Creates a completely independent copy\n- All nested objects are also cloned\n- No shared references\n- Methods: JSON.parse(JSON.stringify()), structuredClone(), custom function\n\nVISUAL EXAMPLE:\n---------------\nOriginal: { a: 1, b: { c: 2 } }\n\nShallow Copy:\n- new.a = 1 (copied)\n- new.b === original.b (SAME reference)\n\nDeep Copy:\n- new.a = 1 (copied)\n- new.b !== original.b (DIFFERENT reference)\n- new.b.c = 2 (copied)\n\n\n\nCIRCULAR REFERENCE:\n-------------------\nWhen an object references itself directly or through a chain:\n\nDirect:   obj.self = obj\nIndirect: obj.a.b.parent = obj\n\nWithout handling, this causes infinite recursion!\n\n\n\nCOMMON APPROACHES:\n------------------\n1. JSON.parse(JSON.stringify(obj))\n   - Simple but limited\n   - Loses: functions, undefined, Symbols, Date (becomes string), RegExp, Map, Set\n   - Throws on circular references\n\n2. structuredClone(obj) - Modern browsers\n   - Handles most cases\n   - Handles circular references\n   - Still loses: functions, DOM elements\n\n3. Custom recursive function with WeakMap\n   - Full control\n   - Can handle any type\n   - Can handle circular references",
  beginnerApproach:
    "Beginner: Simple deep copy using JSON\nLimitations: No functions, undefined, circular refs",
  beginnerImplementation:
    "function deepCopyBeginner(obj) {\n  return JSON.parse(JSON.stringify(obj));\n}\n\n// Test Beginner Level\nconsole.log('=== BEGINNER LEVEL ===');\n\nconst simpleObj = { a: 1, b: { c: 2 } };\nconst copiedSimple = deepCopyBeginner(simpleObj);\n\nconsole.log('Original:', simpleObj);\nconsole.log('Copy:', copiedSimple);\nconsole.log('Are equal?', JSON.stringify(simpleObj) === JSON.stringify(copiedSimple)); // true\nconsole.log('Same reference?', simpleObj === copiedSimple); // false\nconsole.log('Nested same ref?', simpleObj.b === copiedSimple.b); // false\n\n// Show limitations\nconsole.log('\\n--- BEGINNER LIMITATIONS ---');\nconst objWithFunction = { fn: () => 'hello', value: 1 };\nconsole.log('With function:', deepCopyBeginner(objWithFunction)); // { value: 1 } - function lost!\n\nconst objWithUndefined = { a: undefined, b: 1 };\nconsole.log('With undefined:', deepCopyBeginner(objWithUndefined)); // { b: 1 } - undefined lost!\n\nconst objWithDate = { date: new Date() };\nconsole.log('With Date:', deepCopyBeginner(objWithDate)); // date becomes string!",
  intermediateApproach:
    "Intermediate: Handle special types + circular references\n- Date, RegExp\n- Arrays\n- Circular reference detection with WeakMap",
  intermediateImplementation:
    "function deepCopyIntermediate(obj, seen = new WeakMap()) {\n  // Handle primitives and null\n  if (obj === null || typeof obj !== 'object') {\n    return obj;\n  }\n  \n  // Handle circular references\n  if (seen.has(obj)) {\n    return seen.get(obj);\n  }\n  \n  // Handle Date\n  if (obj instanceof Date) {\n    return new Date(obj.getTime());\n  }\n  \n  // Handle RegExp\n  if (obj instanceof RegExp) {\n    return new RegExp(obj.source, obj.flags);\n  }\n  \n  // Handle Array\n  if (Array.isArray(obj)) {\n    const clonedArray = [];\n    seen.set(obj, clonedArray); // Store before recursion to handle circular refs\n    \n    for (let i = 0; i < obj.length; i++) {\n      clonedArray[i] = deepCopyIntermediate(obj[i], seen);\n    }\n    return clonedArray;\n  }\n  \n  // Handle Object\n  const clonedObj = {};\n  seen.set(obj, clonedObj); // Store before recursion\n  \n  for (const key in obj) {\n    if (Object.prototype.hasOwnProperty.call(obj, key)) {\n      clonedObj[key] = deepCopyIntermediate(obj[key], seen);\n    }\n  }\n  \n  return clonedObj;\n}\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL ===');\n\n// Test Date\nconst objWithDateInt = { date: new Date('2024-01-15'), value: 42 };\nconst copiedDate = deepCopyIntermediate(objWithDateInt);\nconsole.log('Date preserved:', copiedDate.date instanceof Date); // true\nconsole.log('Date value:', copiedDate.date.toISOString());\n\n// Test RegExp\nconst objWithRegex = { pattern: /test/gi, name: 'regex test' };\nconst copiedRegex = deepCopyIntermediate(objWithRegex);\nconsole.log('RegExp preserved:', copiedRegex.pattern instanceof RegExp); // true\nconsole.log('RegExp flags:', copiedRegex.pattern.flags); // 'gi'\n\n// Test Circular Reference\nconsole.log('\\n--- CIRCULAR REFERENCE TEST ---');\nconst circularObj = { a: 1, b: { c: 2 } };\ncircularObj.self = circularObj;           // Direct circular\ncircularObj.b.parent = circularObj;       // Indirect circular\n\nconst copiedCircular = deepCopyIntermediate(circularObj);\nconsole.log('Circular handled:', copiedCircular.self === copiedCircular); // true\nconsole.log('Nested circular:', copiedCircular.b.parent === copiedCircular); // true\nconsole.log('Original not affected:', circularObj !== copiedCircular); // true",
  expertApproach:
    "Expert: Full implementation handling ALL types\n- Map, Set\n- TypedArrays (ArrayBuffer, Uint8Array, etc.)\n- Symbol keys\n- Property descriptors (getters/setters, non-enumerable)\n- Prototype chain\n- Functions (by reference - cannot truly clone)",
  expertImplementation:
    "function deepCopyExpert(obj, seen = new WeakMap()) {\n  // Handle primitives and null\n  if (obj === null) return null;\n  if (typeof obj !== 'object' && typeof obj !== 'function') {\n    return obj;\n  }\n  \n  // Handle functions (return reference - can't truly clone)\n  if (typeof obj === 'function') {\n    return obj;\n  }\n  \n  // Handle circular references\n  if (seen.has(obj)) {\n    return seen.get(obj);\n  }\n  \n  // Handle Date\n  if (obj instanceof Date) {\n    return new Date(obj.getTime());\n  }\n  \n  // Handle RegExp\n  if (obj instanceof RegExp) {\n    return new RegExp(obj.source, obj.flags);\n  }\n  \n  // Handle Map\n  if (obj instanceof Map) {\n    const clonedMap = new Map();\n    seen.set(obj, clonedMap);\n    \n    obj.forEach((value, key) => {\n      // Clone both key and value (keys can be objects too!)\n      clonedMap.set(\n        deepCopyExpert(key, seen),\n        deepCopyExpert(value, seen)\n      );\n    });\n    return clonedMap;\n  }\n  \n  // Handle Set\n  if (obj instanceof Set) {\n    const clonedSet = new Set();\n    seen.set(obj, clonedSet);\n    \n    obj.forEach(value => {\n      clonedSet.add(deepCopyExpert(value, seen));\n    });\n    return clonedSet;\n  }\n  \n  // Handle ArrayBuffer\n  if (obj instanceof ArrayBuffer) {\n    const clonedBuffer = obj.slice(0);\n    seen.set(obj, clonedBuffer);\n    return clonedBuffer;\n  }\n  \n  // Handle TypedArrays (Uint8Array, Int32Array, etc.)\n  if (ArrayBuffer.isView(obj) && !(obj instanceof DataView)) {\n    const clonedTypedArray = new obj.constructor(\n      deepCopyExpert(obj.buffer, seen),\n      obj.byteOffset,\n      obj.length\n    );\n    seen.set(obj, clonedTypedArray);\n    return clonedTypedArray;\n  }\n  \n  // Handle DataView\n  if (obj instanceof DataView) {\n    const clonedDataView = new DataView(\n      deepCopyExpert(obj.buffer, seen),\n      obj.byteOffset,\n      obj.byteLength\n    );\n    seen.set(obj, clonedDataView);\n    return clonedDataView;\n  }\n  \n  // Handle Error objects\n  if (obj instanceof Error) {\n    const clonedError = new obj.constructor(obj.message);\n    clonedError.stack = obj.stack;\n    seen.set(obj, clonedError);\n    return clonedError;\n  }\n  \n  // Handle Array\n  if (Array.isArray(obj)) {\n    const clonedArray = [];\n    seen.set(obj, clonedArray);\n    \n    for (let i = 0; i < obj.length; i++) {\n      clonedArray[i] = deepCopyExpert(obj[i], seen);\n    }\n    return clonedArray;\n  }\n  \n  // Handle plain objects and class instances\n  // Preserve prototype chain\n  const clonedObj = Object.create(Object.getPrototypeOf(obj));\n  seen.set(obj, clonedObj);\n  \n  // Get all keys including Symbols\n  const allKeys = [\n    ...Object.keys(obj),\n    ...Object.getOwnPropertySymbols(obj)\n  ];\n  \n  for (const key of allKeys) {\n    // Get property descriptor to preserve getters/setters\n    const descriptor = Object.getOwnPropertyDescriptor(obj, key);\n    \n    if (descriptor) {\n      if ('value' in descriptor) {\n        // Regular property with value\n        descriptor.value = deepCopyExpert(descriptor.value, seen);\n      }\n      // Getter/setter are functions - keep as reference\n      \n      Object.defineProperty(clonedObj, key, descriptor);\n    }\n  }\n  \n  return clonedObj;\n}\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL ===');\n\n// Test Map\nconsole.log('--- Map Test ---');\nconst originalMap = new Map([\n  ['key1', { nested: 'value1' }],\n  [{ objKey: 1 }, 'objectKey']\n]);\nconst clonedMap = deepCopyExpert(originalMap);\nconsole.log('Map cloned:', clonedMap instanceof Map); // true\nconsole.log('Map size:', clonedMap.size); // 2\nconsole.log('Map value cloned:', clonedMap.get('key1') !== originalMap.get('key1')); // true\n\n// Test Set\nconsole.log('\\n--- Set Test ---');\nconst originalSet = new Set([1, { a: 2 }, [3, 4]]);\nconst clonedSet = deepCopyExpert(originalSet);\nconsole.log('Set cloned:', clonedSet instanceof Set); // true\nconsole.log('Set size:', clonedSet.size); // 3\n\n// Test Symbol keys\nconsole.log('\\n--- Symbol Keys Test ---');\nconst sym = Symbol('mySymbol');\nconst objWithSymbol = { [sym]: 'symbolValue', regular: 'regularValue' };\nconst clonedWithSymbol = deepCopyExpert(objWithSymbol);\nconsole.log('Symbol preserved:', clonedWithSymbol[sym]); // 'symbolValue'\n\n// Test class instance\nconsole.log('\\n--- Class Instance Test ---');\nclass Person {\n  constructor(name) {\n    this.name = name;\n  }\n  greet() {\n    return `Hello, ${this.name}`;\n  }\n}\nconst person = new Person('John');\nconst clonedPerson = deepCopyExpert(person);\nconsole.log('Prototype preserved:', clonedPerson instanceof Person); // true\nconsole.log('Method works:', clonedPerson.greet()); // 'Hello, John'\n\n// Test property descriptors\nconsole.log('\\n--- Property Descriptors Test ---');\nconst objWithDescriptors = {};\nObject.defineProperty(objWithDescriptors, 'readonly', {\n  value: 42,\n  writable: false,\n  enumerable: true,\n  configurable: false\n});\nObject.defineProperty(objWithDescriptors, 'computed', {\n  get() { return this._value * 2; },\n  set(v) { this._value = v; },\n  enumerable: true\n});\nobjWithDescriptors._value = 10;\n\nconst clonedWithDescriptors = deepCopyExpert(objWithDescriptors);\nconsole.log('Readonly preserved:', Object.getOwnPropertyDescriptor(clonedWithDescriptors, 'readonly').writable === false);\nconsole.log('Getter works:', clonedWithDescriptors.computed); // 20\n\n// Complex circular reference test\nconsole.log('\\n--- Complex Circular Test ---');\nconst complexCircular = {\n  a: 1,\n  arr: [1, 2, 3],\n  map: new Map(),\n  set: new Set()\n};\ncomplexCircular.self = complexCircular;\ncomplexCircular.arr.push(complexCircular);\ncomplexCircular.map.set('circular', complexCircular);\ncomplexCircular.set.add(complexCircular);\n\nconst clonedComplex = deepCopyExpert(complexCircular);\nconsole.log('Direct circular:', clonedComplex.self === clonedComplex); // true\nconsole.log('Array circular:', clonedComplex.arr[3] === clonedComplex); // true\nconsole.log('Map circular:', clonedComplex.map.get('circular') === clonedComplex); // true",
  interviewTraps: [
    "console.log('\\n=== EDGE CASES ===');",
    "EDGE CASE 1: null vs undefined",
    "console.log('null:', deepCopyExpert(null)); // null",
    "console.log('undefined:', deepCopyExpert(undefined)); // undefined",
    "EDGE CASE 2: Primitives",
    "console.log('string:', deepCopyExpert('hello')); // 'hello'",
    "console.log('number:', deepCopyExpert(42)); // 42",
    "console.log('boolean:', deepCopyExpert(true)); // true",
  ],
  practiceExercises: [
    "EXERCISE 1: Implement shallow copy for comparison",
    "EXERCISE 2: Add option to exclude certain keys",
    "EXERCISE 3: Add option to transform values during copy",
    "EXERCISE 4: Implement copy with depth limit",
    "EXERCISE 5: Add support for WeakMap and WeakSet",
    "Exercise 1: Shallow copy for comparison",
    "function shallowCopy(obj) {",
    "if (Array.isArray(obj)) return [...obj];",
  ],
  stepByStep: [
    "Check if the value is a primitive (null or non-object typeof) — return it directly.",
    "Check the WeakMap cache — if the object was already cloned, return the cached clone.",
    "Handle special built-in types: Date (new Date with same time), RegExp (new RegExp with source/flags).",
    "Handle Map and Set: create empty instance, cache it, then iterate and deep-clone each entry.",
    "For arrays and plain objects, create an empty clone ([] or Object.create(proto)).",
    "Immediately store the empty clone in the WeakMap cache BEFORE recursing into properties.",
    "Iterate all keys (including Symbols) and recursively deep-copy each value into the clone.",
    "Return the fully populated clone.",
  ],

  timeComplexity:
    "O(n) where n is the total number of properties/elements across all nested structures.",
  spaceComplexity:
    "O(n) for the cloned structure plus O(d) recursion stack depth, plus O(n) for the WeakMap cache.",

  commonMistakes: [
    "Not caching the clone BEFORE recursing — the clone must be in the cache before processing children to break cycles",
    "Using a regular Map or object instead of WeakMap (prevents garbage collection of cloned objects)",
    "Forgetting to handle Date, RegExp, Map, or Set (they need constructor-based cloning)",
    "Using JSON.parse(JSON.stringify()) which fails on circular refs, Dates, and undefined",
  ],

  followUps: [
    "How would you handle cloning of functions or class instances with methods?",
    "What are the trade-offs of structuredClone() vs a manual deep copy?",
    "How would you deep copy objects with non-enumerable or getter/setter properties?",
  ],
};
