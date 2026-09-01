import type { CodingProblem } from "../../types";

export const bfsObjectProblem: CodingProblem = {
  id: "coding-bfs-object",
  title: "BFS Traversal of JavaScript Objects",
  difficulty: "Intermediate",
  category: "Coding",
  tags: [
    "javascript",
    "bfs",
    "queue",
    "tree-traversal",
    "objects",
    "data-structures",
  ],

  problem: `Implement a Breadth-First Search (BFS) traversal function \`bfsTraverse(obj, callback)\` (or \`bfsObject(obj)\`) for deeply nested JavaScript objects and arrays.

The function should:
1. Traverse all keys and values level by level (level-order traversal), starting from the root properties, then their direct child properties, then grandchildren, etc.
2. Handle circular references safely using a \`Set\` or \`WeakSet\` of visited object references so the traversal never enters an infinite loop.
3. Pass \`{ key, value, path, depth, parent }\` to a visitor callback function on each visited property.
4. Support finding a value, transforming values level-by-level, or returning an array of all visited node values in BFS order.`,

  requirements: [
    "Perform level-order (BFS) traversal using an explicit FIFO queue",
    "Track visited objects to prevent infinite loops from circular references",
    'Yield or return full path info (e.g. ["user", "address", "city"])',
    "Support plain objects, arrays, and primitive values",
    "Record depth level for each node",
  ],

  examples: [
    {
      input: `const tree = {\n  a: 1,\n  b: {\n    c: 2,\n    d: {\n      e: 3\n    }\n  },\n  f: 4\n};\nbfsObject(tree);`,
      output: `['a', 'b', 'f', 'c', 'd', 'e'] (keys visited level-by-level)`,
      explanation: "Level 1: a, b, f -> Level 2: c, d -> Level 3: e",
    },
  ],

  edgeCases: [
    "Circular references (obj.self = obj): do not revisit already queued object references",
    "Array children: traverse indices 0, 1, 2, ... in order",
    "Null or non-object roots: handle gracefully without errors",
    "Empty objects or primitives: return empty or single entry",
  ],

  naiveApproach: `A recursive function naturally executes Depth-First Search (DFS) because function call stacks dive to the deepest leaf before returning. Attempting BFS with recursion requires multi-pass depth-limited searches, which is inefficient ($O(N^2)$).`,

  optimalApproach: `The optimal BFS approach uses an explicit **FIFO Queue** and a **Visited Set**:
1. Initialize a queue containing \`[{ value: root, path: [], depth: 0, key: '' }]\`.
2. Maintain \`const visited = new Set()\` (or \`WeakSet\`).
3. While queue is not empty, dequeue the item at the front.
4. Check if \`item.value\` is an object. If already in \`visited\`, skip.
5. If it's an object, mark as visited.
6. Iterate its keys (via \`Object.entries(item.value)\`) and enqueue each child:
   \`queue.push({ value: childVal, path: [...item.path, childKey], depth: item.depth + 1, key: childKey, parent: item.value })\`.
7. Execute callback or accumulate result.`,

  implementation: `function bfsObject(obj, callback) {
  if (obj === null || typeof obj !== 'object') {
    if (callback) callback({ key: '', value: obj, path: [], depth: 0 });
    return [{ key: '', value: obj, path: [], depth: 0 }];
  }

  const results = [];
  const queue = [];
  const visited = new Set();

  // Enqueue direct properties of root
  for (const [key, value] of Object.entries(obj)) {
    queue.push({ key, value, path: [key], depth: 1, parent: obj });
  }
  visited.add(obj);

  while (queue.length > 0) {
    const item = queue.shift();
    results.push(item);

    if (callback) {
      callback(item);
    }

    if (item.value !== null && typeof item.value === 'object') {
      if (!visited.has(item.value)) {
        visited.add(item.value);
        for (const [childKey, childValue] of Object.entries(item.value)) {
          queue.push({
            key: childKey,
            value: childValue,
            path: [...item.path, childKey],
            depth: item.depth + 1,
            parent: item.value,
          });
        }
      }
    }
  }

  return results;
}`,

  implementationTS: `export interface BFSNode {
  key: string;
  value: any;
  path: string[];
  depth: number;
  parent?: any;
}

export function bfsObject(
  obj: unknown,
  callback?: (node: BFSNode) => void
): BFSNode[] {
  if (obj === null || typeof obj !== 'object') {
    const single: BFSNode = { key: '', value: obj, path: [], depth: 0 };
    callback?.(single);
    return [single];
  }

  const results: BFSNode[] = [];
  const queue: BFSNode[] = [];
  const visited = new Set<any>();

  for (const [key, value] of Object.entries(obj)) {
    queue.push({ key, value, path: [key], depth: 1, parent: obj });
  }
  visited.add(obj);

  while (queue.length > 0) {
    const item = queue.shift()!;
    results.push(item);
    callback?.(item);

    if (item.value !== null && typeof item.value === 'object') {
      if (!visited.has(item.value)) {
        visited.add(item.value);
        for (const [childKey, childValue] of Object.entries(item.value)) {
          queue.push({
            key: childKey,
            value: childValue,
            path: [...item.path, childKey],
            depth: item.depth + 1,
            parent: item.value,
          });
        }
      }
    }
  }

  return results;
}`,

  theoryAndConcepts:
    "WHAT IS BFS & DFS?\n------------------\n\nDFS (Depth-First Search):\n- Go as deep as possible before backtracking\n- Uses STACK (LIFO) or recursion\n- Memory efficient for wide structures\n\nBFS (Breadth-First Search):\n- Visit all nodes at current level before going deeper\n- Uses QUEUE (FIFO)\n- Finds shortest path\n\nVISUAL:\n-------\n       A\n      / \\\n     B   C\n    / \\   \\\n   D   E   F\n\nDFS (pre-order): A -> B -> D -> E -> C -> F\nBFS:             A -> B -> C -> D -> E -> F\n\n\n\nOBJECT TRAVERSAL:\n-----------------\nObjects can be viewed as trees:\n- Root = the object itself\n- Nodes = nested objects/arrays\n- Leaves = primitive values\n\nUSE CASES:\n----------\n1. Finding values by key\n2. Transforming nested data\n3. Detecting circular references\n4. Calculating depth\n5. Serialization",
  beginnerApproach: "Beginner: Simple recursive DFS",
  beginnerImplementation:
    "function dfsRecursiveBeginner(obj, callback) {\n  // Visit current node\n  callback(obj);\n  \n  // If object/array, visit children\n  if (obj !== null && typeof obj === 'object') {\n    for (const key in obj) {\n      if (obj.hasOwnProperty(key)) {\n        dfsRecursiveBeginner(obj[key], callback);\n      }\n    }\n  }\n}\n\n// Test Beginner DFS\nconsole.log('=== BEGINNER DFS ===');\n\nconst simpleObj = {\n  a: 1,\n  b: {\n    c: 2,\n    d: 3\n  }\n};\n\nconsole.log('DFS Order:');\ndfsRecursiveBeginner(simpleObj, (value) => {\n  console.log(typeof value === 'object' ? '{...}' : value);\n});",
  intermediateApproach:
    "Intermediate: DFS with path tracking and key info\n\n\nIntermediate: DFS iterative (using stack)\n\n\nIntermediate: BFS with level tracking",
  intermediateImplementation:
    "function dfsWithPath(obj, callback, path = []) {\n  // Visit with path context\n  callback(obj, path);\n  \n  if (obj !== null && typeof obj === 'object') {\n    for (const key in obj) {\n      if (obj.hasOwnProperty(key)) {\n        dfsWithPath(obj[key], callback, [...path, key]);\n      }\n    }\n  }\n}\n\nfunction dfsIterative(obj, callback) {\n  const stack = [{ value: obj, path: [] }];\n  \n  while (stack.length > 0) {\n    const { value, path } = stack.pop();\n    \n    callback(value, path);\n    \n    if (value !== null && typeof value === 'object') {\n      // Push in reverse order to maintain left-to-right traversal\n      const keys = Object.keys(value).reverse();\n      for (const key of keys) {\n        stack.push({ value: value[key], path: [...path, key] });\n      }\n    }\n  }\n}\n\nfunction bfsWithLevel(obj, callback) {\n  const queue = [{ value: obj, path: [], level: 0 }];\n  \n  while (queue.length > 0) {\n    const { value, path, level } = queue.shift();\n    \n    callback(value, path, level);\n    \n    if (value !== null && typeof value === 'object') {\n      for (const key in value) {\n        if (value.hasOwnProperty(key)) {\n          queue.push({\n            value: value[key],\n            path: [...path, key],\n            level: level + 1\n          });\n        }\n      }\n    }\n  }\n}\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL ===');\n\nconst nested = {\n  a: {\n    b: { c: 1 },\n    d: 2\n  },\n  e: [3, 4, { f: 5 }]\n};\n\nconsole.log('DFS with path:');\ndfsWithPath(nested, (value, path) => {\n  const display = typeof value === 'object' ? JSON.stringify(value).slice(0, 20) + '...' : value;\n  console.log(`${path.join('.') || 'root'}: ${display}`);\n});\n\nconsole.log('\\nBFS with level:');\nbfsWithLevel(nested, (value, path, level) => {\n  const display = typeof value === 'object' ? '{...}' : value;\n  console.log(`Level ${level} - ${path.join('.') || 'root'}: ${display}`);\n});",
  expertApproach: "Expert: Full-featured traversal with all options",
  expertImplementation:
    "class ObjectTraverser {\n  constructor(options = {}) {\n    this.options = {\n      circular: 'skip', // 'skip' | 'error' | 'mark'\n      arrays: 'traverse', // 'traverse' | 'value'\n      maxDepth: Infinity,\n      ...options\n    };\n  }\n  \n  // DFS Pre-order (visit before children)\n  dfsPreOrder(obj, callback) {\n    const seen = new WeakSet();\n    \n    const traverse = (value, path, depth) => {\n      // Max depth check\n      if (depth > this.options.maxDepth) return;\n      \n      // Circular reference handling\n      if (value !== null && typeof value === 'object') {\n        if (seen.has(value)) {\n          if (this.options.circular === 'error') {\n            throw new Error(`Circular reference at ${path.join('.')}`);\n          }\n          if (this.options.circular === 'mark') {\n            callback('[Circular]', path, depth, true);\n          }\n          return;\n        }\n        seen.add(value);\n      }\n      \n      // Visit current node\n      const shouldContinue = callback(value, path, depth, false);\n      if (shouldContinue === false) return;\n      \n      // Traverse children\n      if (value !== null && typeof value === 'object') {\n        if (Array.isArray(value) && this.options.arrays === 'value') {\n          return; // Treat arrays as values\n        }\n        \n        for (const key in value) {\n          if (value.hasOwnProperty(key)) {\n            traverse(value[key], [...path, key], depth + 1);\n          }\n        }\n      }\n    };\n    \n    traverse(obj, [], 0);\n  }\n  \n  // DFS Post-order (visit after children)\n  dfsPostOrder(obj, callback) {\n    const seen = new WeakSet();\n    \n    const traverse = (value, path, depth) => {\n      if (depth > this.options.maxDepth) return;\n      \n      if (value !== null && typeof value === 'object') {\n        if (seen.has(value)) return;\n        seen.add(value);\n        \n        if (!(Array.isArray(value) && this.options.arrays === 'value')) {\n          for (const key in value) {\n            if (value.hasOwnProperty(key)) {\n              traverse(value[key], [...path, key], depth + 1);\n            }\n          }\n        }\n      }\n      \n      // Visit after children\n      callback(value, path, depth);\n    };\n    \n    traverse(obj, [], 0);\n  }\n  \n  // BFS\n  bfs(obj, callback) {\n    const seen = new WeakSet();\n    const queue = [{ value: obj, path: [], depth: 0 }];\n    \n    while (queue.length > 0) {\n      const { value, path, depth } = queue.shift();\n      \n      if (depth > this.options.maxDepth) continue;\n      \n      // Circular check\n      if (value !== null && typeof value === 'object') {\n        if (seen.has(value)) {\n          if (this.options.circular === 'error') {\n            throw new Error(`Circular reference at ${path.join('.')}`);\n          }\n          if (this.options.circular === 'mark') {\n            callback('[Circular]', path, depth, true);\n          }\n          continue;\n        }\n        seen.add(value);\n      }\n      \n      // Visit\n      const shouldContinue = callback(value, path, depth, false);\n      if (shouldContinue === false) continue;\n      \n      // Enqueue children\n      if (value !== null && typeof value === 'object') {\n        if (!(Array.isArray(value) && this.options.arrays === 'value')) {\n          for (const key in value) {\n            if (value.hasOwnProperty(key)) {\n              queue.push({\n                value: value[key],\n                path: [...path, key],\n                depth: depth + 1\n              });\n            }\n          }\n        }\n      }\n    }\n  }\n  \n  // Find all paths to a value\n  findPaths(obj, predicate) {\n    const paths = [];\n    \n    this.dfsPreOrder(obj, (value, path, depth, isCircular) => {\n      if (!isCircular && predicate(value, path)) {\n        paths.push([...path]);\n      }\n    });\n    \n    return paths;\n  }\n  \n  // Get value at path\n  getAtPath(obj, path) {\n    return path.reduce((current, key) => \n      current !== null && current !== undefined ? current[key] : undefined, \n      obj\n    );\n  }\n  \n  // Level-order with level separation\n  levelOrder(obj, callback) {\n    const queue = [{ value: obj, path: [] }];\n    let level = 0;\n    let currentLevelSize = 1;\n    let nextLevelSize = 0;\n    let levelItems = [];\n    \n    while (queue.length > 0) {\n      const { value, path } = queue.shift();\n      currentLevelSize--;\n      \n      levelItems.push({ value, path });\n      \n      if (value !== null && typeof value === 'object') {\n        for (const key in value) {\n          if (value.hasOwnProperty(key)) {\n            queue.push({ value: value[key], path: [...path, key] });\n            nextLevelSize++;\n          }\n        }\n      }\n      \n      // Level complete\n      if (currentLevelSize === 0) {\n        callback(levelItems, level);\n        levelItems = [];\n        level++;\n        currentLevelSize = nextLevelSize;\n        nextLevelSize = 0;\n      }\n    }\n  }\n}\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL ===');\n\nconst complexObj = {\n  users: [\n    { name: 'John', age: 30 },\n    { name: 'Jane', age: 25 }\n  ],\n  settings: {\n    theme: 'dark',\n    notifications: { email: true, push: false }\n  }\n};\n\nconst traverser = new ObjectTraverser({ maxDepth: 3 });\n\nconsole.log('Find paths to \"dark\":');\nconst paths = traverser.findPaths(complexObj, value => value === 'dark');\nconsole.log(paths); // [['settings', 'theme']]\n\nconsole.log('\\nLevel order:');\ntraverser.levelOrder(complexObj, (items, level) => {\n  console.log(`Level ${level}:`, items.map(i => i.path.join('.') || 'root'));\n});\n\n// Circular reference test\nconsole.log('\\nCircular reference handling:');\nconst circular = { a: 1 };\ncircular.self = circular;\n\nconst safeTraverser = new ObjectTraverser({ circular: 'mark' });\nsafeTraverser.dfsPreOrder(circular, (value, path, depth, isCircular) => {\n  console.log(`${path.join('.') || 'root'}: ${isCircular ? '[CIRCULAR]' : value}`);\n});",
  interviewTraps: [
    "QUICK REFERENCE:",
    "DFS: Stack (LIFO) or recursion, good for deep trees",
    "BFS: Queue (FIFO), good for finding shortest path",
    "INTERVIEW TIPS:",
    "1. Start with simple recursive DFS",
    "2. Mention stack vs queue difference",
    "3. Handle circular references",
    "4. Discuss time/space complexity",
  ],
  stepByStep: [
    "Verify root input; handle non-objects immediately.",
    "Initialize results list, queue array, and visited Set.",
    "Enqueue all top-level key/value entries of the root object with depth 1.",
    "Add root object to visited Set.",
    "While queue has elements, shift first element from front.",
    "Append element to results and invoke optional visitor callback.",
    "If element value is an unvisited object, add to visited Set and enqueue its entries with depth + 1.",
    "Return full results list after queue drains.",
  ],

  timeComplexity:
    "O(V + E) where V is the total number of properties and E is the number of child links in the object graph.",
  spaceComplexity:
    "O(W) where W is the maximum width (number of nodes in the widest level) stored in the queue, plus O(V) for the visited set.",

  alternativeSolutions: [
    "Generator function (function* bfsGenerator) yielding nodes on demand",
    "Using double-ended queue (deque) or linked list queue for O(1) dequeue operations",
  ],

  commonMistakes: [
    "Omitting visited tracking, causing browser crash / stack overflow on circular references.",
    "Using array.pop() instead of array.shift(), which turns BFS into DFS.",
    "Mutating the path array in place instead of creating a new path array for children.",
  ],

  followUps: [
    "How would you implement a generator that yields each level as a batch array?",
    "How would you search for a specific key and return the shortest path to it?",
    "How does BFS traversal differ when handling Maps, Sets, and custom iterables?",
  ],
};
