import type { CodingProblem } from '../../types';

export const bfsObjectProblem: CodingProblem = {
  id: 'coding-bfs-object',
  title: 'BFS Traversal of JavaScript Objects',
  difficulty: 'Intermediate',
  category: 'Coding',
  tags: ['javascript', 'bfs', 'queue', 'tree-traversal', 'objects', 'data-structures'],

  problem: `Implement a Breadth-First Search (BFS) traversal function \`bfsTraverse(obj, callback)\` (or \`bfsObject(obj)\`) for deeply nested JavaScript objects and arrays.

The function should:
1. Traverse all keys and values level by level (level-order traversal), starting from the root properties, then their direct child properties, then grandchildren, etc.
2. Handle circular references safely using a \`Set\` or \`WeakSet\` of visited object references so the traversal never enters an infinite loop.
3. Pass \`{ key, value, path, depth, parent }\` to a visitor callback function on each visited property.
4. Support finding a value, transforming values level-by-level, or returning an array of all visited node values in BFS order.`,

  requirements: [
    'Perform level-order (BFS) traversal using an explicit FIFO queue',
    'Track visited objects to prevent infinite loops from circular references',
    'Yield or return full path info (e.g. ["user", "address", "city"])',
    'Support plain objects, arrays, and primitive values',
    'Record depth level for each node',
  ],

  examples: [
    {
      input: `const tree = {\n  a: 1,\n  b: {\n    c: 2,\n    d: {\n      e: 3\n    }\n  },\n  f: 4\n};\nbfsObject(tree);`,
      output: `['a', 'b', 'f', 'c', 'd', 'e'] (keys visited level-by-level)`,
      explanation: 'Level 1: a, b, f -> Level 2: c, d -> Level 3: e',
    },
  ],

  edgeCases: [
    'Circular references (obj.self = obj): do not revisit already queued object references',
    'Array children: traverse indices 0, 1, 2, ... in order',
    'Null or non-object roots: handle gracefully without errors',
    'Empty objects or primitives: return empty or single entry',
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

  stepByStep: [
    'Verify root input; handle non-objects immediately.',
    'Initialize results list, queue array, and visited Set.',
    'Enqueue all top-level key/value entries of the root object with depth 1.',
    'Add root object to visited Set.',
    'While queue has elements, shift first element from front.',
    'Append element to results and invoke optional visitor callback.',
    'If element value is an unvisited object, add to visited Set and enqueue its entries with depth + 1.',
    'Return full results list after queue drains.',
  ],

  timeComplexity: 'O(V + E) where V is the total number of properties and E is the number of child links in the object graph.',
  spaceComplexity: 'O(W) where W is the maximum width (number of nodes in the widest level) stored in the queue, plus O(V) for the visited set.',

  alternativeSolutions: [
    'Generator function (function* bfsGenerator) yielding nodes on demand',
    'Using double-ended queue (deque) or linked list queue for O(1) dequeue operations',
  ],

  commonMistakes: [
    'Omitting visited tracking, causing browser crash / stack overflow on circular references.',
    'Using array.pop() instead of array.shift(), which turns BFS into DFS.',
    'Mutating the path array in place instead of creating a new path array for children.',
  ],

  followUps: [
    'How would you implement a generator that yields each level as a batch array?',
    'How would you search for a specific key and return the shortest path to it?',
    'How does BFS traversal differ when handling Maps, Sets, and custom iterables?',
  ],
};
