import type { CodingProblem } from '../../types';

export const dfsObjectProblem: CodingProblem = {
  id: 'coding-dfs-object',
  title: 'DFS Traversal of JavaScript Objects',
  difficulty: 'Intermediate',
  category: 'Coding',
  tags: ['javascript', 'dfs', 'recursion', 'stack', 'tree-traversal', 'objects'],

  problem: `Implement a Depth-First Search (DFS) traversal function \`dfsTraverse(obj, callback)\` (or \`dfsObject(obj)\`) for arbitrary nested JavaScript objects and arrays.

The function should:
1. Traverse down each branch to its leaf nodes before backtracking and exploring sibling branches.
2. Support both **pre-order** (visiting parent before its children) and **post-order** (visiting children before parent) modes.
3. Prevent infinite recursion caused by circular object references using a visited set.
4. Pass node details \`{ key, value, path, depth, isLeaf, parent }\` to the visitor callback function.
5. Provide both recursive and iterative (stack-based) implementations.`,

  requirements: [
    'Perform depth-first traversal (pre-order by default)',
    'Handle circular references safely without infinite recursion',
    'Track path hierarchy from root to current node',
    'Differentiate leaf values from internal object nodes',
    'Support deep objects, nested arrays, and primitives',
  ],

  examples: [
    {
      input: `const tree = {\n  a: 1,\n  b: {\n    c: 2,\n    d: 3\n  },\n  e: 4\n};\nconst visited = [];\ndfsObject(tree, n => visited.push(n.key));`,
      output: `['a', 'b', 'c', 'd', 'e'] (descends deeply into b before visiting e)`,
      explanation: 'Pre-order DFS visits a, enters branch b, visits c, d, then visits e.',
    },
  ],

  edgeCases: [
    'Circular links: skip previously visited object references',
    'Arrays: traverse items in index order 0, 1, 2...',
    'Null values: typeof null === "object", handle as primitive leaf',
    'Functions, Dates, RegExps: treat as leaf values or inspect as needed',
  ],

  naiveApproach: `A simple recursive function without a \`visited\` set will immediately trigger \`RangeError: Maximum call stack size exceeded\` when traversing objects with back-references or circular links (e.g. parent-child references).`,

  optimalApproach: `The optimal approach uses recursive DFS with a \`WeakSet\` / \`Set\` of active ancestors or visited references:
1. If the node is primitive, \`null\`, or a non-plain object (e.g. RegExp, Date), invoke callback with \`isLeaf: true\` and return.
2. If already in \`visited\`, return immediately to avoid cyclic loops.
3. Mark node in \`visited\`.
4. If in \`pre-order\` mode, invoke callback on the object node.
5. Iterate each \`[key, value]\` pair:
   - Construct \`newPath = [...path, key]\`.
   - Recursively call \`dfs(value, newPath, depth + 1)\`.
6. If in \`post-order\` mode, invoke callback on the object node after children finish.`,

  implementation: `function dfsObject(obj, callback, options = {}) {
  const { order = 'pre', visited = new Set() } = options;
  const results = [];

  function traverse(current, path, depth, key, parent) {
    const isObject = current !== null && typeof current === 'object';
    const isLeaf = !isObject;

    const nodeInfo = {
      key,
      value: current,
      path,
      depth,
      isLeaf,
      parent,
    };

    if (isLeaf) {
      if (callback) callback(nodeInfo);
      results.push(nodeInfo);
      return;
    }

    // Circular reference guard
    if (visited.has(current)) {
      return;
    }
    visited.add(current);

    if (order === 'pre') {
      if (callback) callback(nodeInfo);
      results.push(nodeInfo);
    }

    for (const [childKey, childVal] of Object.entries(current)) {
      traverse(childVal, [...path, childKey], depth + 1, childKey, current);
    }

    if (order === 'post') {
      if (callback) callback(nodeInfo);
      results.push(nodeInfo);
    }
  }

  // Handle top-level keys
  if (obj !== null && typeof obj === 'object') {
    visited.add(obj);
    for (const [k, v] of Object.entries(obj)) {
      traverse(v, [k], 1, k, obj);
    }
  } else {
    traverse(obj, [], 0, '', null);
  }

  return results;
}`,

  implementationTS: `export interface DFSNode {
  key: string;
  value: any;
  path: string[];
  depth: number;
  isLeaf: boolean;
  parent?: any;
}

export interface DFSOptions {
  order?: 'pre' | 'post';
}

export function dfsObject(
  obj: unknown,
  callback?: (node: DFSNode) => void,
  options: DFSOptions = {}
): DFSNode[] {
  const { order = 'pre' } = options;
  const visited = new Set<any>();
  const results: DFSNode[] = [];

  function traverse(current: any, path: string[], depth: number, key: string, parent: any) {
    const isObject = current !== null && typeof current === 'object';
    const isLeaf = !isObject;

    const nodeInfo: DFSNode = {
      key,
      value: current,
      path,
      depth,
      isLeaf,
      parent,
    };

    if (isLeaf) {
      callback?.(nodeInfo);
      results.push(nodeInfo);
      return;
    }

    if (visited.has(current)) {
      return;
    }
    visited.add(current);

    if (order === 'pre') {
      callback?.(nodeInfo);
      results.push(nodeInfo);
    }

    for (const [childKey, childVal] of Object.entries(current)) {
      traverse(childVal, [...path, childKey], depth + 1, childKey, current);
    }

    if (order === 'post') {
      callback?.(nodeInfo);
      results.push(nodeInfo);
    }
  }

  if (obj !== null && typeof obj === 'object') {
    visited.add(obj);
    for (const [k, v] of Object.entries(obj)) {
      traverse(v, [k], 1, k, obj);
    }
  } else {
    traverse(obj, [], 0, '', null);
  }

  return results;
}`,

  stepByStep: [
    'Check if current node is object or primitive leaf.',
    'If leaf, invoke callback and return.',
    'Check visited Set to avoid circular loops.',
    'If pre-order, process parent node.',
    'Iterate child properties and recursively traverse down each branch.',
    'If post-order, process parent node after subtrees finish.',
    'Return aggregated traversal list.',
  ],

  timeComplexity: 'O(N) where N is the total number of keys and values in the object tree.',
  spaceComplexity: 'O(D) call stack space where D is the maximum nesting depth of the tree.',

  alternativeSolutions: [
    'Iterative DFS using an explicit LIFO Stack (stack.pop() pattern)',
    'Generator implementation yielding DFS nodes step by step',
  ],

  commonMistakes: [
    'Failing to treat null as a primitive (null is typeof "object").',
    'Calling Object.entries on circular references without visited checks.',
    'Confusing pre-order with post-order traversal timing.',
  ],

  followUps: [
    'How would you flatten an object into a single-level dot-notated map using DFS (e.g. {"a.b.c": 1})?',
    'How would you implement an iterative DFS with an explicit stack to avoid call stack limits on 10,000-deep objects?',
    'How does DFS compare to BFS for memory consumption in deep vs wide trees?',
  ],
};
