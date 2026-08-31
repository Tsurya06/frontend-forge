import type { CodingProblem } from '../../types';

export const removeCircularProblem: CodingProblem = {
  id: 'coding-remove-circular',
  title: 'Remove Circular References from JavaScript Objects',
  difficulty: 'Intermediate',
  category: 'Coding',
  tags: ['javascript', 'circular-reference', 'recursion', 'serialization', 'cloning', 'weakset'],

  problem: `Implement a function \`removeCircular(obj)\` (or \`censorCircular(obj)\`) that takes an arbitrary JavaScript object or array that may contain circular references and returns a clean, sanitized deep copy with all circular back-references removed or replaced.

Requirements:
1. Return a new deep clone where circular references are replaced with \`undefined\` (omitted from output / JSON), \`null\`, or a marker string (e.g. \`"[Circular]"\`).
2. Do not mutate the original input object.
3. Handle multiple non-circular shared references correctly (DAGs / Diamond dependencies) — if two different properties point to the same object instance without forming a cycle, preserve the data without falsely flagging it as circular.
4. Support nested objects, arrays, primitives, and null.
5. Provide a serializer polyfill: \`safeStringify(obj, replacer, space)\` that never throws \`TypeError: Converting circular structure to JSON\`.`,

  requirements: [
    'Detect and remove cyclic/circular references',
    'Do not mutate the original object',
    'Distinguish genuine cycles from shared non-circular references (DAG)',
    'Handle arrays and objects recursively',
    'Return valid JSON-serializable structure',
  ],

  examples: [
    {
      input: `const obj = { a: 1 };\nobj.self = obj;\nremoveCircular(obj)`,
      output: '{ a: 1, self: undefined } (or "[Circular]")',
      explanation: 'The self-referential cycle is removed, making the object safely serializable with JSON.stringify().',
    },
    {
      input: `const shared = { x: 10 };\nconst obj = { first: shared, second: shared };\nremoveCircular(obj)`,
      output: '{ first: { x: 10 }, second: { x: 10 } }',
      explanation: 'Shared reference (DAG) is not a cycle and is properly cloned without being removed.',
    },
  ],

  edgeCases: [
    'Direct cycle (obj.self = obj)',
    'Indirect cycle (obj.a.b.c = obj)',
    'Array containing itself (arr[0] = arr)',
    'Shared references (diamond dependency): should not be treated as circular',
    'Primitives, null, and undefined values',
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

  stepByStep: [
    'Define ancestors Set tracking the active depth-first traversal path.',
    'Check if value is null or primitive; return as-is.',
    'If ancestors.has(val), cycle is detected: return replacement placeholder.',
    'Add val to ancestors Set.',
    'Recursively process array elements or object properties in a try block.',
    'In finally block, delete val from ancestors Set (backtracking).',
    'Return clean cloned structure.',
  ],

  timeComplexity: 'O(N) where N is the total count of properties in the object graph.',
  spaceComplexity: 'O(D) where D is the maximum recursion depth stored in the ancestors Set.',

  alternativeSolutions: [
    'JSON.stringify with replacer function tracking WeakSet of visited objects',
    'Structured Clone algorithm / MessageChannel serialization',
  ],

  commonMistakes: [
    'Using a permanent Set without backtracking, breaking legitimate shared DAG references.',
    'Mutating the input object (e.g. deleting keys directly on the input).',
    'Forgetting array iteration vs object key iteration.',
  ],

  followUps: [
    'How does structuredClone in modern browsers handle circular references compared to JSON.stringify?',
    'How would you preserve circular references using JSONPath or $ref pointers (like JSON-LD / Flatted)?',
    'How would you implement deep equality for objects with circular references?',
  ],
};
