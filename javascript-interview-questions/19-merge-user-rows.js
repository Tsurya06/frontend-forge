/**
 * ============================================
 * MERGE USER DATA ROWS - Complete Guide
 * ============================================
 * 
 * Topic: Implement a function to merge rows of data from the same user
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * WHAT IS ROW MERGING?
 * --------------------
 * Combining multiple data rows that share a common identifier (like userId)
 * into a single consolidated record.
 * 
 * USE CASES:
 * ----------
 * 1. Combining user activity logs
 * 2. Aggregating metrics from multiple sources
 * 3. De-duplicating records with latest data
 * 4. Merging partial data from different API calls
 * 
 * MERGE STRATEGIES:
 * -----------------
 * - Last wins: Latest value overwrites
 * - First wins: Keep original value
 * - Concat: Combine arrays
 * - Sum: Add numeric values
 * - Max/Min: Keep highest/lowest
 * - Custom: User-defined merge logic
 */

// ============================================
// BEGINNER LEVEL
// ============================================

/**
 * Beginner: Simple merge (last wins)
 */
function mergeUserRowsBeginner(rows, idKey = 'userId') {
  const merged = {};
  
  for (const row of rows) {
    const id = row[idKey];
    
    if (!merged[id]) {
      // First occurrence - copy the row
      merged[id] = { ...row };
    } else {
      // Merge with existing (later values overwrite)
      merged[id] = { ...merged[id], ...row };
    }
  }
  
  // Convert back to array
  return Object.values(merged);
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const userActivities = [
  { userId: 1, name: 'John', visits: 5 },
  { userId: 2, name: 'Jane', visits: 3 },
  { userId: 1, name: 'John Doe', visits: 10, email: 'john@example.com' },
  { userId: 2, visits: 7 }
];

console.log('Merged (last wins):', mergeUserRowsBeginner(userActivities));
// [
//   { userId: 1, name: 'John Doe', visits: 10, email: 'john@example.com' },
//   { userId: 2, name: 'Jane', visits: 7 }
// ]


// ============================================
// INTERMEDIATE LEVEL
// ============================================

/**
 * Intermediate: Merge with strategy per field
 */
function mergeUserRowsIntermediate(rows, options = {}) {
  const {
    idKey = 'userId',
    strategies = {}  // { fieldName: 'lastWins' | 'firstWins' | 'sum' | 'concat' | 'max' | 'min' }
  } = options;
  
  const merged = new Map();
  
  for (const row of rows) {
    const id = row[idKey];
    
    if (!merged.has(id)) {
      merged.set(id, { ...row });
      continue;
    }
    
    const existing = merged.get(id);
    
    for (const key of Object.keys(row)) {
      if (key === idKey) continue;
      
      const strategy = strategies[key] || 'lastWins';
      const existingValue = existing[key];
      const newValue = row[key];
      
      // Skip if new value is undefined
      if (newValue === undefined) continue;
      
      // If no existing value, just use new value
      if (existingValue === undefined) {
        existing[key] = newValue;
        continue;
      }
      
      // Apply strategy
      switch (strategy) {
        case 'firstWins':
          // Keep existing value
          break;
          
        case 'lastWins':
          existing[key] = newValue;
          break;
          
        case 'sum':
          if (typeof existingValue === 'number' && typeof newValue === 'number') {
            existing[key] = existingValue + newValue;
          } else {
            existing[key] = newValue;
          }
          break;
          
        case 'concat':
          if (Array.isArray(existingValue) && Array.isArray(newValue)) {
            existing[key] = [...existingValue, ...newValue];
          } else if (Array.isArray(existingValue)) {
            existing[key] = [...existingValue, newValue];
          } else if (Array.isArray(newValue)) {
            existing[key] = [existingValue, ...newValue];
          } else {
            existing[key] = [existingValue, newValue];
          }
          break;
          
        case 'unique':
          if (Array.isArray(existingValue) && Array.isArray(newValue)) {
            existing[key] = [...new Set([...existingValue, ...newValue])];
          } else {
            existing[key] = newValue;
          }
          break;
          
        case 'max':
          if (typeof existingValue === 'number' && typeof newValue === 'number') {
            existing[key] = Math.max(existingValue, newValue);
          } else {
            existing[key] = newValue;
          }
          break;
          
        case 'min':
          if (typeof existingValue === 'number' && typeof newValue === 'number') {
            existing[key] = Math.min(existingValue, newValue);
          } else {
            existing[key] = newValue;
          }
          break;
          
        default:
          existing[key] = newValue;
      }
    }
  }
  
  return Array.from(merged.values());
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');

const userData = [
  { userId: 1, name: 'John', visits: 5, tags: ['admin'], score: 80 },
  { userId: 2, name: 'Jane', visits: 3, tags: ['user'], score: 90 },
  { userId: 1, visits: 10, tags: ['vip'], score: 95 },
  { userId: 2, visits: 7, tags: ['premium'], score: 85 }
];

const merged = mergeUserRowsIntermediate(userData, {
  strategies: {
    name: 'firstWins',     // Keep original name
    visits: 'sum',         // Add up visits
    tags: 'unique',        // Combine unique tags
    score: 'max'           // Keep highest score
  }
});

console.log('Merged with strategies:', JSON.stringify(merged, null, 2));


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: Full-featured merger with custom functions
 */
class RowMerger {
  constructor(options = {}) {
    this.idKey = options.idKey || 'id';
    this.strategies = options.strategies || {};
    this.defaultStrategy = options.defaultStrategy || 'lastWins';
    this.customMergers = options.customMergers || {};
    this.validators = options.validators || {};
    this.transformers = options.transformers || {};
  }
  
  // Built-in strategies
  static strategies = {
    lastWins: (existing, incoming) => incoming,
    firstWins: (existing, incoming) => existing,
    sum: (a, b) => (typeof a === 'number' && typeof b === 'number') ? a + b : b,
    max: (a, b) => (typeof a === 'number' && typeof b === 'number') ? Math.max(a, b) : b,
    min: (a, b) => (typeof a === 'number' && typeof b === 'number') ? Math.min(a, b) : b,
    concat: (a, b) => [...(Array.isArray(a) ? a : [a]), ...(Array.isArray(b) ? b : [b])],
    unique: (a, b) => [...new Set([...(Array.isArray(a) ? a : [a]), ...(Array.isArray(b) ? b : [b])])],
    average: (a, b, context) => {
      const count = context.mergeCount || 1;
      return (a * count + b) / (count + 1);
    },
    latest: (a, b, context) => {
      const aTime = context.existingRow?.timestamp || 0;
      const bTime = context.incomingRow?.timestamp || 0;
      return bTime >= aTime ? b : a;
    },
    deepMerge: (a, b) => {
      if (typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
        return { ...a, ...b };
      }
      return b;
    }
  };
  
  merge(rows) {
    const merged = new Map();
    const mergeCounts = new Map();
    
    for (const row of rows) {
      // Validate row
      if (!this.validateRow(row)) continue;
      
      // Transform row
      const transformedRow = this.transformRow(row);
      const id = transformedRow[this.idKey];
      
      if (id === undefined) {
        console.warn('Row missing id key:', row);
        continue;
      }
      
      if (!merged.has(id)) {
        merged.set(id, { ...transformedRow });
        mergeCounts.set(id, 1);
        continue;
      }
      
      const existing = merged.get(id);
      const mergeCount = mergeCounts.get(id);
      
      // Merge each field
      for (const key of Object.keys(transformedRow)) {
        if (key === this.idKey) continue;
        
        const incomingValue = transformedRow[key];
        if (incomingValue === undefined) continue;
        
        const existingValue = existing[key];
        
        if (existingValue === undefined) {
          existing[key] = incomingValue;
          continue;
        }
        
        // Context for custom mergers
        const context = {
          existingRow: existing,
          incomingRow: transformedRow,
          mergeCount,
          key,
          id
        };
        
        // Check for custom merger
        if (this.customMergers[key]) {
          existing[key] = this.customMergers[key](existingValue, incomingValue, context);
          continue;
        }
        
        // Get strategy
        const strategyName = this.strategies[key] || this.defaultStrategy;
        const strategy = RowMerger.strategies[strategyName];
        
        if (strategy) {
          existing[key] = strategy(existingValue, incomingValue, context);
        } else {
          existing[key] = incomingValue;
        }
      }
      
      mergeCounts.set(id, mergeCount + 1);
    }
    
    return Array.from(merged.values());
  }
  
  validateRow(row) {
    if (!row || typeof row !== 'object') return false;
    
    for (const [key, validator] of Object.entries(this.validators)) {
      if (row[key] !== undefined && !validator(row[key])) {
        console.warn(`Validation failed for ${key}:`, row[key]);
        return false;
      }
    }
    
    return true;
  }
  
  transformRow(row) {
    const transformed = { ...row };
    
    for (const [key, transformer] of Object.entries(this.transformers)) {
      if (transformed[key] !== undefined) {
        transformed[key] = transformer(transformed[key]);
      }
    }
    
    return transformed;
  }
  
  // Fluent API for configuration
  setIdKey(key) {
    this.idKey = key;
    return this;
  }
  
  setStrategy(field, strategy) {
    this.strategies[field] = strategy;
    return this;
  }
  
  setCustomMerger(field, mergerFn) {
    this.customMergers[field] = mergerFn;
    return this;
  }
  
  setValidator(field, validatorFn) {
    this.validators[field] = validatorFn;
    return this;
  }
  
  setTransformer(field, transformerFn) {
    this.transformers[field] = transformerFn;
    return this;
  }
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');

const merger = new RowMerger({
  idKey: 'userId',
  strategies: {
    visits: 'sum',
    score: 'max',
    tags: 'unique',
    name: 'firstWins'
  },
  customMergers: {
    // Custom: Keep last non-empty email
    email: (existing, incoming) => 
      incoming && incoming.trim() ? incoming : existing
  },
  transformers: {
    // Trim all names
    name: (name) => name?.trim()
  },
  validators: {
    // Score must be between 0-100
    score: (score) => score >= 0 && score <= 100
  }
});

const data = [
  { userId: 1, name: ' John ', visits: 5, score: 80, email: '' },
  { userId: 1, name: 'Johnny', visits: 3, score: 95, email: 'john@example.com' },
  { userId: 1, visits: 2, score: 150 }, // Invalid score - will be skipped
  { userId: 2, name: 'Jane', visits: 10, score: 88 }
];

console.log('Expert merged:', merger.merge(data));


// ============================================
// PRACTICAL EXAMPLES
// ============================================

console.log('\n=== PRACTICAL EXAMPLES ===');

// 1. Merge API responses
function mergeApiResponses(responses, idKey = 'id') {
  const allRows = responses.flat();
  return mergeUserRowsIntermediate(allRows, {
    idKey,
    strategies: { updatedAt: 'max' }
  });
}

// 2. Aggregate user metrics
function aggregateUserMetrics(events, userId) {
  const userEvents = events.filter(e => e.userId === userId);
  
  return userEvents.reduce((acc, event) => ({
    userId,
    totalClicks: (acc.totalClicks || 0) + (event.clicks || 0),
    totalViews: (acc.totalViews || 0) + (event.views || 0),
    sessions: (acc.sessions || 0) + 1,
    lastSeen: Math.max(acc.lastSeen || 0, event.timestamp || 0)
  }), {});
}

// 3. De-duplicate with conflict resolution
function deduplicateRows(rows, idKey, conflictResolver) {
  const seen = new Map();
  
  return rows.filter(row => {
    const id = row[idKey];
    
    if (!seen.has(id)) {
      seen.set(id, row);
      return true;
    }
    
    // Resolve conflict
    const existing = seen.get(id);
    const winner = conflictResolver(existing, row);
    seen.set(id, winner);
    
    return false;
  }).map(row => seen.get(row[idKey]));
}

console.log('Deduplicated:', deduplicateRows(
  [{ id: 1, v: 1 }, { id: 2, v: 2 }, { id: 1, v: 3 }],
  'id',
  (a, b) => b.v > a.v ? b : a // Keep higher value
));


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * 1. Use Map for O(1) lookups by id
 * 2. Handle undefined values explicitly
 * 3. Consider array fields (concat vs replace)
 * 4. Maintain original order if needed
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Ask about merge strategy requirements
 * 2. Start with simple "last wins" approach
 * 3. Discuss handling of arrays and nested objects
 * 4. Mention performance: O(n) with Map
 * 
 * COMMON STRATEGIES:
 * ------------------
 * - lastWins: Most recent value
 * - firstWins: Original value
 * - sum: Add numbers
 * - concat: Combine arrays
 * - unique: Deduplicated array
 * - max/min: Numeric comparison
 */


module.exports = {
  mergeUserRowsBeginner,
  mergeUserRowsIntermediate,
  RowMerger,
  mergeApiResponses,
  aggregateUserMetrics,
  deduplicateRows
};
