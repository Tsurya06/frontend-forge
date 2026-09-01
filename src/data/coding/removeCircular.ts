import type { CodingProblem } from "../../types";

export const removeCircularProblem: CodingProblem = {
  id: "coding-remove-circular",
  title: "Remove Circular References from JavaScript Objects",
  difficulty: "Intermediate",
  category: "Coding",
  tags: [
    "javascript",
    "circular-reference",
    "recursion",
    "serialization",
    "cloning",
    "weakset",
  ],

  problem: `Implement a function \`removeCircular(obj)\` (or \`censorCircular(obj)\`) that takes an arbitrary JavaScript object or array that may contain circular references and returns a clean, sanitized deep copy with all circular back-references removed or replaced.

Requirements:
1. Return a new deep clone where circular references are replaced with \`undefined\` (omitted from output / JSON), \`null\`, or a marker string (e.g. \`"[Circular]"\`).
2. Do not mutate the original input object.
3. Handle multiple non-circular shared references correctly (DAGs / Diamond dependencies) — if two different properties point to the same object instance without forming a cycle, preserve the data without falsely flagging it as circular.
4. Support nested objects, arrays, primitives, and null.
5. Provide a serializer polyfill: \`safeStringify(obj, replacer, space)\` that never throws \`TypeError: Converting circular structure to JSON\`.`,

  requirements: [
    "Detect and remove cyclic/circular references",
    "Do not mutate the original object",
    "Distinguish genuine cycles from shared non-circular references (DAG)",
    "Handle arrays and objects recursively",
    "Return valid JSON-serializable structure",
  ],

  examples: [
    {
      input: `const obj = { a: 1 };\nobj.self = obj;\nremoveCircular(obj)`,
      output: '{ a: 1, self: undefined } (or "[Circular]")',
      explanation:
        "The self-referential cycle is removed, making the object safely serializable with JSON.stringify().",
    },
    {
      input: `const shared = { x: 10 };\nconst obj = { first: shared, second: shared };\nremoveCircular(obj)`,
      output: "{ first: { x: 10 }, second: { x: 10 } }",
      explanation:
        "Shared reference (DAG) is not a cycle and is properly cloned without being removed.",
    },
  ],

  edgeCases: [
    "Direct cycle (obj.self = obj)",
    "Indirect cycle (obj.a.b.c = obj)",
    "Array containing itself (arr[0] = arr)",
    "Shared references (diamond dependency): should not be treated as circular",
    "Primitives, null, and undefined values",
  ],

  naiveApproach: `A naive approach puts every visited object into a global \`Set\`. If an object is in the Set, it is skipped. This is incorrect because it falsely breaks shared sub-objects in a Directed Acyclic Graph (DAG) that are not cycles:
\`\`\`js
// Buggy naive approach:
const shared = { name: 'Shared' };
const data = { a: shared, b: shared }; // b would be falsely stripped!
\`\`\``,

  optimalApproach: `To correctly distinguish true cycles from shared DAG references:
Use an **Active Ancestor Stack / Set** (tracking objects currently on the active recursion path from root to current node):
1. Maintain \`const ancestors = new Set()\` (or an array).
2. When entering an object, check \`ancestors.has(current)\`.
   - If \`true\`, a circular back-edge is detected! Return \`undefined\` or \`"[Circular]"\`.
3. Add \`current\` to \`ancestors\`.
4. Create cloned object or array.
5. Recursively clone each key/value pair.
6. **Backtrack**: Remove \`current\` from \`ancestors\` before returning so sibling branches can reference the same sub-object safely.
7. Return cloned object.`,

  implementation: `function removeCircular(obj, placeholder = undefined) {
  const ancestors = new Set();

  function clone(val) {
    // 1. Handle primitives and null
    if (val === null || typeof val !== 'object') {
      return val;
    }

    // 2. Detect cycle in active recursion stack
    if (ancestors.has(val)) {
      return placeholder;
    }

    // 3. Mark current in active ancestor stack
    ancestors.add(val);

    try {
      if (Array.isArray(val)) {
        const arrCopy = [];
        for (let i = 0; i < val.length; i++) {
          const item = clone(val[i]);
          arrCopy.push(item);
        }
        return arrCopy;
      }

      const objCopy = {};
      for (const [k, v] of Object.entries(val)) {
        const clonedVal = clone(v);
        if (clonedVal !== undefined) {
          objCopy[k] = clonedVal;
        }
      }
      return objCopy;
    } finally {
      // 4. Backtrack: remove from active ancestor stack
      ancestors.delete(val);
    }
  }

  return clone(obj);
}

// Safe JSON stringify helper
function safeStringify(obj, replacer, space) {
  const seen = new WeakSet();

  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      return replacer ? replacer(key, value) : value;
    },
    space
  );
}`,

  implementationTS: `export function removeCircular<T = any>(
  obj: T,
  placeholder: any = undefined
): T {
  const ancestors = new Set<any>();

  function clone(val: any): any {
    if (val === null || typeof val !== 'object') {
      return val;
    }

    if (ancestors.has(val)) {
      return placeholder;
    }

    ancestors.add(val);

    try {
      if (Array.isArray(val)) {
        const arrCopy: any[] = [];
        for (let i = 0; i < val.length; i++) {
          arrCopy.push(clone(val[i]));
        }
        return arrCopy;
      }

      const objCopy: Record<string, any> = {};
      for (const [k, v] of Object.entries(val)) {
        const clonedVal = clone(v);
        if (clonedVal !== undefined) {
          objCopy[k] = clonedVal;
        }
      }
      return objCopy;
    } finally {
      ancestors.delete(val);
    }
  }

  return clone(obj);
}

export function safeStringify(
  obj: unknown,
  replacer?: (key: string, value: any) => any,
  space?: string | number
): string {
  const seen = new WeakSet();

  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      return replacer ? replacer(key, value) : value;
    },
    space
  );
}`,

  theoryAndConcepts:
    "WHAT IS A CIRCULAR REFERENCE?\n-----------------------------\nWhen an object references itself, directly or indirectly.\n\nDIRECT: obj.self = obj\nINDIRECT: a.b = b; b.a = a (cycle: a \u2192 b \u2192 a)\n\nWHY IS IT A PROBLEM?\n--------------------\n1. JSON.stringify() throws error\n2. Deep copy fails (infinite loop)\n3. Memory leaks possible\n4. Serialization fails\n\nDETECTION STRATEGY:\n-------------------\nKeep track of visited objects using WeakSet/WeakMap\nIf we encounter an object we've seen, it's circular",
  beginnerApproach:
    "Beginner: Detect circular references\n\n\nBeginner: Simple circular removal (replace with null)",
  beginnerImplementation:
    "function hasCircularReference(obj) {\n  const seen = new WeakSet();\n  \n  function detect(value) {\n    if (value === null || typeof value !== 'object') {\n      return false;\n    }\n    \n    if (seen.has(value)) {\n      return true; // Found circular!\n    }\n    \n    seen.add(value);\n    \n    for (const key in value) {\n      if (value.hasOwnProperty(key)) {\n        if (detect(value[key])) {\n          return true;\n        }\n      }\n    }\n    \n    return false;\n  }\n  \n  return detect(obj);\n}\n\nfunction removeCircularBeginner(obj) {\n  const seen = new WeakSet();\n  \n  function process(value) {\n    if (value === null || typeof value !== 'object') {\n      return value;\n    }\n    \n    if (seen.has(value)) {\n      return null; // Replace circular with null\n    }\n    \n    seen.add(value);\n    \n    if (Array.isArray(value)) {\n      return value.map(process);\n    }\n    \n    const result = {};\n    for (const key in value) {\n      if (value.hasOwnProperty(key)) {\n        result[key] = process(value[key]);\n      }\n    }\n    \n    return result;\n  }\n  \n  return process(obj);\n}\n\n// Test Beginner Level\nconsole.log('=== BEGINNER LEVEL ===');\n\n// Direct circular reference\nconst direct = { name: 'obj' };\ndirect.self = direct;\n\nconsole.log('Has circular (direct):', hasCircularReference(direct)); // true\n\n// Indirect circular reference\nconst a = { name: 'a' };\nconst b = { name: 'b' };\na.ref = b;\nb.ref = a;\n\nconsole.log('Has circular (indirect):', hasCircularReference(a)); // true\n\n// No circular\nconst normal = { a: 1, b: { c: 2 } };\nconsole.log('Has circular (normal):', hasCircularReference(normal)); // false\n\n// Remove circular\nconst cleaned = removeCircularBeginner(direct);\nconsole.log('Cleaned:', cleaned); // { name: 'obj', self: null }\nconsole.log('Can stringify:', JSON.stringify(cleaned));",
  intermediateApproach:
    "Intermediate: Remove with path information\n\n\nIntermediate: JSON.stringify replacer for circular references",
  intermediateImplementation:
    "function removeCircularIntermediate(obj, options = {}) {\n  const {\n    replacement = '[Circular]',  // What to replace with\n    keepPath = false             // Include path to circular ref\n  } = options;\n  \n  const seen = new WeakMap();\n  \n  function process(value, path = 'root') {\n    if (value === null || typeof value !== 'object') {\n      return value;\n    }\n    \n    if (seen.has(value)) {\n      const originalPath = seen.get(value);\n      return keepPath ? `${replacement}: ${originalPath}` : replacement;\n    }\n    \n    seen.set(value, path);\n    \n    if (Array.isArray(value)) {\n      return value.map((item, index) => process(item, `${path}[${index}]`));\n    }\n    \n    const result = {};\n    for (const key in value) {\n      if (value.hasOwnProperty(key)) {\n        result[key] = process(value[key], `${path}.${key}`);\n      }\n    }\n    \n    return result;\n  }\n  \n  return process(obj);\n}\n\nfunction getCircularReplacer(replacement = '[Circular]') {\n  const seen = new WeakSet();\n  \n  return function(key, value) {\n    if (typeof value === 'object' && value !== null) {\n      if (seen.has(value)) {\n        return replacement;\n      }\n      seen.add(value);\n    }\n    return value;\n  };\n}\n\n// Safe JSON stringify\nfunction safeStringify(obj, space = 2) {\n  return JSON.stringify(obj, getCircularReplacer(), space);\n}\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL ===');\n\nconst complex = {\n  name: 'root',\n  child: {\n    name: 'child',\n    parent: null // will be circular\n  }\n};\ncomplex.child.parent = complex;\n\nconsole.log('With path:', removeCircularIntermediate(complex, { \n  keepPath: true,\n  replacement: '[Circular Reference]'\n}));\n\nconsole.log('Safe stringify:', safeStringify(complex));",
  expertApproach:
    "Expert: Full-featured circular handler\n\n\nExpert: Break circular by replacing with reference IDs",
  expertImplementation:
    "class CircularHandler {\n  constructor(options = {}) {\n    this.options = {\n      replacement: '[Circular]',\n      keepPath: false,\n      detectOnly: false,\n      onCircular: null,        // Callback when circular found\n      maxDepth: Infinity,\n      handleSpecialTypes: true, // Handle Map, Set, etc.\n      ...options\n    };\n  }\n  \n  // Find all circular references\n  findCirculars(obj) {\n    const circulars = [];\n    const seen = new WeakMap();\n    \n    const find = (value, path = []) => {\n      if (value === null || typeof value !== 'object') {\n        return;\n      }\n      \n      if (seen.has(value)) {\n        circulars.push({\n          path: path.join('.'),\n          referencesPath: seen.get(value).join('.')\n        });\n        return;\n      }\n      \n      seen.set(value, [...path]);\n      \n      if (Array.isArray(value)) {\n        value.forEach((item, index) => find(item, [...path, `[${index}]`]));\n      } else if (value instanceof Map) {\n        value.forEach((v, k) => find(v, [...path, `Map(${k})`]));\n      } else if (value instanceof Set) {\n        let i = 0;\n        value.forEach(v => find(v, [...path, `Set[${i++}]`]));\n      } else {\n        for (const key of Object.keys(value)) {\n          find(value[key], [...path, key]);\n        }\n      }\n    };\n    \n    find(obj, ['root']);\n    return circulars;\n  }\n  \n  // Remove circular references\n  remove(obj) {\n    const seen = new WeakMap();\n    const { replacement, keepPath, onCircular, maxDepth, handleSpecialTypes } = this.options;\n    \n    const process = (value, path = [], depth = 0) => {\n      // Primitive or null\n      if (value === null || typeof value !== 'object') {\n        return value;\n      }\n      \n      // Max depth\n      if (depth > maxDepth) {\n        return '[Max Depth]';\n      }\n      \n      // Circular detection\n      if (seen.has(value)) {\n        const originalPath = seen.get(value);\n        onCircular?.(path.join('.'), originalPath.join('.'));\n        return keepPath ? `${replacement}: ${originalPath.join('.')}` : replacement;\n      }\n      \n      seen.set(value, [...path]);\n      \n      // Date\n      if (value instanceof Date) {\n        return new Date(value.getTime());\n      }\n      \n      // RegExp\n      if (value instanceof RegExp) {\n        return new RegExp(value.source, value.flags);\n      }\n      \n      // Map\n      if (handleSpecialTypes && value instanceof Map) {\n        const result = new Map();\n        value.forEach((v, k) => {\n          result.set(k, process(v, [...path, `Map(${k})`], depth + 1));\n        });\n        return result;\n      }\n      \n      // Set\n      if (handleSpecialTypes && value instanceof Set) {\n        const result = new Set();\n        let i = 0;\n        value.forEach(v => {\n          result.add(process(v, [...path, `Set[${i++}]`], depth + 1));\n        });\n        return result;\n      }\n      \n      // Array\n      if (Array.isArray(value)) {\n        return value.map((item, index) => \n          process(item, [...path, `[${index}]`], depth + 1)\n        );\n      }\n      \n      // Object\n      const result = {};\n      \n      // Handle Symbol keys\n      const keys = [\n        ...Object.keys(value),\n        ...Object.getOwnPropertySymbols(value)\n      ];\n      \n      for (const key of keys) {\n        const keyStr = typeof key === 'symbol' ? key.toString() : key;\n        result[key] = process(value[key], [...path, keyStr], depth + 1);\n      }\n      \n      return result;\n    };\n    \n    return process(obj, ['root']);\n  }\n  \n  // Check if has circular (faster than findCirculars)\n  hasCircular(obj) {\n    const seen = new WeakSet();\n    \n    const check = (value) => {\n      if (value === null || typeof value !== 'object') return false;\n      if (seen.has(value)) return true;\n      seen.add(value);\n      \n      if (Array.isArray(value)) {\n        return value.some(check);\n      }\n      \n      return Object.values(value).some(check);\n    };\n    \n    return check(obj);\n  }\n  \n  // Safe stringify\n  stringify(obj, space) {\n    return JSON.stringify(this.remove(obj), null, space);\n  }\n}\n\nfunction serializeWithRefs(obj) {\n  const seen = new Map();\n  let idCounter = 0;\n  \n  // First pass: assign IDs to all objects\n  function assignIds(value) {\n    if (value === null || typeof value !== 'object') return;\n    if (seen.has(value)) return;\n    \n    seen.set(value, idCounter++);\n    \n    if (Array.isArray(value)) {\n      value.forEach(assignIds);\n    } else {\n      Object.values(value).forEach(assignIds);\n    }\n  }\n  \n  assignIds(obj);\n  \n  // Second pass: serialize with refs\n  const serialized = new Map();\n  \n  function serialize(value) {\n    if (value === null || typeof value !== 'object') {\n      return value;\n    }\n    \n    const id = seen.get(value);\n    \n    if (serialized.has(id)) {\n      return { $ref: id };\n    }\n    \n    if (Array.isArray(value)) {\n      const arr = [];\n      serialized.set(id, arr);\n      value.forEach((item, i) => arr[i] = serialize(item));\n      return arr;\n    }\n    \n    const result = { $id: id };\n    serialized.set(id, result);\n    \n    for (const key in value) {\n      if (value.hasOwnProperty(key)) {\n        result[key] = serialize(value[key]);\n      }\n    }\n    \n    return result;\n  }\n  \n  return serialize(obj);\n}\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL ===');\n\nconst handler = new CircularHandler({\n  keepPath: true,\n  onCircular: (path, refPath) => {\n    console.log(`Circular at \"${path}\" referencing \"${refPath}\"`);\n  }\n});\n\n// Complex structure with multiple circulars\nconst root = {\n  a: { name: 'a' },\n  b: { name: 'b' },\n  deep: {\n    nested: {\n      back: null\n    }\n  }\n};\nroot.a.toB = root.b;\nroot.b.toA = root.a;\nroot.deep.nested.back = root;\n\nconsole.log('Find all circulars:', handler.findCirculars(root));\nconsole.log('Removed:', handler.remove(root));\n\n// With reference IDs\nconsole.log('\\nWith refs:', JSON.stringify(serializeWithRefs(root), null, 2));",
  interviewTraps: [
    "QUICK REFERENCE:",
    "- Use WeakSet/WeakMap to track seen objects",
    "- WeakSet for detection only",
    "- WeakMap to store path/info",
    "- JSON.stringify throws on circular",
    "INTERVIEW TIPS:",
    "1. Explain what circular reference is",
    "2. Show WeakSet for detection",
  ],
  stepByStep: [
    "Define ancestors Set tracking the active depth-first traversal path.",
    "Check if value is null or primitive; return as-is.",
    "If ancestors.has(val), cycle is detected: return replacement placeholder.",
    "Add val to ancestors Set.",
    "Recursively process array elements or object properties in a try block.",
    "In finally block, delete val from ancestors Set (backtracking).",
    "Return clean cloned structure.",
  ],

  timeComplexity:
    "O(N) where N is the total count of properties in the object graph.",
  spaceComplexity:
    "O(D) where D is the maximum recursion depth stored in the ancestors Set.",

  alternativeSolutions: [
    "JSON.stringify with replacer function tracking WeakSet of visited objects",
    "Structured Clone algorithm / MessageChannel serialization",
  ],

  commonMistakes: [
    "Using a permanent Set without backtracking, breaking legitimate shared DAG references.",
    "Mutating the input object (e.g. deleting keys directly on the input).",
    "Forgetting array iteration vs object key iteration.",
  ],

  followUps: [
    "How does structuredClone in modern browsers handle circular references compared to JSON.stringify?",
    "How would you preserve circular references using JSONPath or $ref pointers (like JSON-LD / Flatted)?",
    "How would you implement deep equality for objects with circular references?",
  ],
};
