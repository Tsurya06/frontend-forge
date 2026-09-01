/**
 * ============================================
 * BFS & DFS TRAVERSAL OF OBJECTS - Complete Guide
 * ============================================
 * 
 * Topic: Implement BFS and DFS traversal for JavaScript objects
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * WHAT IS BFS & DFS?
 * ------------------
 * 
 * DFS (Depth-First Search):
 * - Go as deep as possible before backtracking
 * - Uses STACK (LIFO) or recursion
 * - Memory efficient for wide structures
 * 
 * BFS (Breadth-First Search):
 * - Visit all nodes at current level before going deeper
 * - Uses QUEUE (FIFO)
 * - Finds shortest path
 * 
 * VISUAL:
 * -------
 *        A
 *       / \
 *      B   C
 *     / \   \
 *    D   E   F
 * 
 * DFS (pre-order): A -> B -> D -> E -> C -> F
 * BFS:             A -> B -> C -> D -> E -> F
 */

/**
 * OBJECT TRAVERSAL:
 * -----------------
 * Objects can be viewed as trees:
 * - Root = the object itself
 * - Nodes = nested objects/arrays
 * - Leaves = primitive values
 * 
 * USE CASES:
 * ----------
 * 1. Finding values by key
 * 2. Transforming nested data
 * 3. Detecting circular references
 * 4. Calculating depth
 * 5. Serialization
 */

// ============================================
// BEGINNER LEVEL - DFS
// ============================================

/**
 * Beginner: Simple recursive DFS
 */
function dfsRecursiveBeginner(obj, callback) {
  // Visit current node
  callback(obj);
  
  // If object/array, visit children
  if (obj !== null && typeof obj === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        dfsRecursiveBeginner(obj[key], callback);
      }
    }
  }
}

// Test Beginner DFS
console.log('=== BEGINNER DFS ===');

const simpleObj = {
  a: 1,
  b: {
    c: 2,
    d: 3
  }
};

console.log('DFS Order:');
dfsRecursiveBeginner(simpleObj, (value) => {
  console.log(typeof value === 'object' ? '{...}' : value);
});


// ============================================
// BEGINNER LEVEL - BFS
// ============================================

/**
 * Beginner: Simple BFS using queue
 */
function bfsBeginner(obj, callback) {
  const queue = [obj];
  
  while (queue.length > 0) {
    const current = queue.shift(); // Dequeue
    
    // Visit current node
    callback(current);
    
    // Enqueue children
    if (current !== null && typeof current === 'object') {
      for (const key in current) {
        if (current.hasOwnProperty(key)) {
          queue.push(current[key]);
        }
      }
    }
  }
}

// Test Beginner BFS
console.log('\n=== BEGINNER BFS ===');
console.log('BFS Order:');
bfsBeginner(simpleObj, (value) => {
  console.log(typeof value === 'object' ? '{...}' : value);
});


// ============================================
// INTERMEDIATE LEVEL
// ============================================

/**
 * Intermediate: DFS with path tracking and key info
 */
function dfsWithPath(obj, callback, path = []) {
  // Visit with path context
  callback(obj, path);
  
  if (obj !== null && typeof obj === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        dfsWithPath(obj[key], callback, [...path, key]);
      }
    }
  }
}

/**
 * Intermediate: DFS iterative (using stack)
 */
function dfsIterative(obj, callback) {
  const stack = [{ value: obj, path: [] }];
  
  while (stack.length > 0) {
    const { value, path } = stack.pop();
    
    callback(value, path);
    
    if (value !== null && typeof value === 'object') {
      // Push in reverse order to maintain left-to-right traversal
      const keys = Object.keys(value).reverse();
      for (const key of keys) {
        stack.push({ value: value[key], path: [...path, key] });
      }
    }
  }
}

/**
 * Intermediate: BFS with level tracking
 */
function bfsWithLevel(obj, callback) {
  const queue = [{ value: obj, path: [], level: 0 }];
  
  while (queue.length > 0) {
    const { value, path, level } = queue.shift();
    
    callback(value, path, level);
    
    if (value !== null && typeof value === 'object') {
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          queue.push({
            value: value[key],
            path: [...path, key],
            level: level + 1
          });
        }
      }
    }
  }
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');

const nested = {
  a: {
    b: { c: 1 },
    d: 2
  },
  e: [3, 4, { f: 5 }]
};

console.log('DFS with path:');
dfsWithPath(nested, (value, path) => {
  const display = typeof value === 'object' ? JSON.stringify(value).slice(0, 20) + '...' : value;
  console.log(`${path.join('.') || 'root'}: ${display}`);
});

console.log('\nBFS with level:');
bfsWithLevel(nested, (value, path, level) => {
  const display = typeof value === 'object' ? '{...}' : value;
  console.log(`Level ${level} - ${path.join('.') || 'root'}: ${display}`);
});


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: Full-featured traversal with all options
 */
class ObjectTraverser {
  constructor(options = {}) {
    this.options = {
      circular: 'skip', // 'skip' | 'error' | 'mark'
      arrays: 'traverse', // 'traverse' | 'value'
      maxDepth: Infinity,
      ...options
    };
  }
  
  // DFS Pre-order (visit before children)
  dfsPreOrder(obj, callback) {
    const seen = new WeakSet();
    
    const traverse = (value, path, depth) => {
      // Max depth check
      if (depth > this.options.maxDepth) return;
      
      // Circular reference handling
      if (value !== null && typeof value === 'object') {
        if (seen.has(value)) {
          if (this.options.circular === 'error') {
            throw new Error(`Circular reference at ${path.join('.')}`);
          }
          if (this.options.circular === 'mark') {
            callback('[Circular]', path, depth, true);
          }
          return;
        }
        seen.add(value);
      }
      
      // Visit current node
      const shouldContinue = callback(value, path, depth, false);
      if (shouldContinue === false) return;
      
      // Traverse children
      if (value !== null && typeof value === 'object') {
        if (Array.isArray(value) && this.options.arrays === 'value') {
          return; // Treat arrays as values
        }
        
        for (const key in value) {
          if (value.hasOwnProperty(key)) {
            traverse(value[key], [...path, key], depth + 1);
          }
        }
      }
    };
    
    traverse(obj, [], 0);
  }
  
  // DFS Post-order (visit after children)
  dfsPostOrder(obj, callback) {
    const seen = new WeakSet();
    
    const traverse = (value, path, depth) => {
      if (depth > this.options.maxDepth) return;
      
      if (value !== null && typeof value === 'object') {
        if (seen.has(value)) return;
        seen.add(value);
        
        if (!(Array.isArray(value) && this.options.arrays === 'value')) {
          for (const key in value) {
            if (value.hasOwnProperty(key)) {
              traverse(value[key], [...path, key], depth + 1);
            }
          }
        }
      }
      
      // Visit after children
      callback(value, path, depth);
    };
    
    traverse(obj, [], 0);
  }
  
  // BFS
  bfs(obj, callback) {
    const seen = new WeakSet();
    const queue = [{ value: obj, path: [], depth: 0 }];
    
    while (queue.length > 0) {
      const { value, path, depth } = queue.shift();
      
      if (depth > this.options.maxDepth) continue;
      
      // Circular check
      if (value !== null && typeof value === 'object') {
        if (seen.has(value)) {
          if (this.options.circular === 'error') {
            throw new Error(`Circular reference at ${path.join('.')}`);
          }
          if (this.options.circular === 'mark') {
            callback('[Circular]', path, depth, true);
          }
          continue;
        }
        seen.add(value);
      }
      
      // Visit
      const shouldContinue = callback(value, path, depth, false);
      if (shouldContinue === false) continue;
      
      // Enqueue children
      if (value !== null && typeof value === 'object') {
        if (!(Array.isArray(value) && this.options.arrays === 'value')) {
          for (const key in value) {
            if (value.hasOwnProperty(key)) {
              queue.push({
                value: value[key],
                path: [...path, key],
                depth: depth + 1
              });
            }
          }
        }
      }
    }
  }
  
  // Find all paths to a value
  findPaths(obj, predicate) {
    const paths = [];
    
    this.dfsPreOrder(obj, (value, path, depth, isCircular) => {
      if (!isCircular && predicate(value, path)) {
        paths.push([...path]);
      }
    });
    
    return paths;
  }
  
  // Get value at path
  getAtPath(obj, path) {
    return path.reduce((current, key) => 
      current !== null && current !== undefined ? current[key] : undefined, 
      obj
    );
  }
  
  // Level-order with level separation
  levelOrder(obj, callback) {
    const queue = [{ value: obj, path: [] }];
    let level = 0;
    let currentLevelSize = 1;
    let nextLevelSize = 0;
    let levelItems = [];
    
    while (queue.length > 0) {
      const { value, path } = queue.shift();
      currentLevelSize--;
      
      levelItems.push({ value, path });
      
      if (value !== null && typeof value === 'object') {
        for (const key in value) {
          if (value.hasOwnProperty(key)) {
            queue.push({ value: value[key], path: [...path, key] });
            nextLevelSize++;
          }
        }
      }
      
      // Level complete
      if (currentLevelSize === 0) {
        callback(levelItems, level);
        levelItems = [];
        level++;
        currentLevelSize = nextLevelSize;
        nextLevelSize = 0;
      }
    }
  }
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');

const complexObj = {
  users: [
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 }
  ],
  settings: {
    theme: 'dark',
    notifications: { email: true, push: false }
  }
};

const traverser = new ObjectTraverser({ maxDepth: 3 });

console.log('Find paths to "dark":');
const paths = traverser.findPaths(complexObj, value => value === 'dark');
console.log(paths); // [['settings', 'theme']]

console.log('\nLevel order:');
traverser.levelOrder(complexObj, (items, level) => {
  console.log(`Level ${level}:`, items.map(i => i.path.join('.') || 'root'));
});

// Circular reference test
console.log('\nCircular reference handling:');
const circular = { a: 1 };
circular.self = circular;

const safeTraverser = new ObjectTraverser({ circular: 'mark' });
safeTraverser.dfsPreOrder(circular, (value, path, depth, isCircular) => {
  console.log(`${path.join('.') || 'root'}: ${isCircular ? '[CIRCULAR]' : value}`);
});


// ============================================
// PRACTICAL APPLICATIONS
// ============================================

console.log('\n=== PRACTICAL APPLICATIONS ===');

/**
 * Find all keys in object
 */
function getAllKeys(obj) {
  const keys = new Set();
  
  const traverse = (value) => {
    if (value !== null && typeof value === 'object') {
      for (const key in value) {
        keys.add(key);
        traverse(value[key]);
      }
    }
  };
  
  traverse(obj);
  return Array.from(keys);
}

console.log('All keys:', getAllKeys(complexObj));

/**
 * Get max depth
 */
function getMaxDepth(obj) {
  let maxDepth = 0;
  
  const traverse = (value, depth) => {
    maxDepth = Math.max(maxDepth, depth);
    
    if (value !== null && typeof value === 'object') {
      for (const key in value) {
        traverse(value[key], depth + 1);
      }
    }
  };
  
  traverse(obj, 0);
  return maxDepth;
}

console.log('Max depth:', getMaxDepth(complexObj));

/**
 * Count nodes
 */
function countNodes(obj) {
  let count = 0;
  
  dfsRecursiveBeginner(obj, () => count++);
  
  return count;
}

console.log('Node count:', countNodes(complexObj));


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * DFS: Stack (LIFO) or recursion, good for deep trees
 * BFS: Queue (FIFO), good for finding shortest path
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Start with simple recursive DFS
 * 2. Mention stack vs queue difference
 * 3. Handle circular references
 * 4. Discuss time/space complexity
 * 
 * TIME: O(n) for both DFS and BFS
 * SPACE: 
 * - DFS: O(d) where d is max depth (recursion stack)
 * - BFS: O(w) where w is max width (queue size)
 */


module.exports = {
  dfsRecursiveBeginner,
  bfsBeginner,
  dfsWithPath,
  dfsIterative,
  bfsWithLevel,
  ObjectTraverser,
  getAllKeys,
  getMaxDepth,
  countNodes
};
