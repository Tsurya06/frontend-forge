import type { Topic } from "../../types";

export const dataStructuresTopics: Topic[] = [
  {
    id: "js-data-structures",
    title: "Advanced Data Structures",
    description:
      "Deep dive into JavaScript's built-in data structures including Map, Set, WeakMap, and WeakSet — their APIs, performance characteristics, garbage collection implications, and real-world use cases.",
    category: "JavaScript",
    subcategory: "Data Structures",
    difficulty: "Intermediate",
    tags: [
      "Map",
      "Set",
      "WeakMap",
      "WeakSet",
      "data structures",
      "garbage collection",
      "collections",
      "ES6",
    ],
    overview:
      "ES6 introduced four keyed collection types — Map, Set, WeakMap, and WeakSet — that address long-standing limitations of plain objects and arrays. Map provides a true key-value store that accepts any value as a key, Set offers unique-value semantics, and the Weak variants enable patterns that cooperate with the garbage collector instead of fighting it. Understanding when and why to reach for each collection is a common senior-level interview topic.",
    concepts: [
      "Map vs plain object for key-value storage",
      "Set vs array for unique-value collections",
      "WeakMap and WeakSet weak reference semantics",
      "Garbage collection and memory leak prevention",
      "Iteration protocols on Map and Set",
      "Key equality semantics (SameValueZero)",
      "Performance characteristics of each collection",
      "Private data and metadata patterns with WeakMap",
    ],
    relatedTopicIds: [
      "js-closures",
      "js-prototypes",
      "js-iterators-generators",
      "js-memory-management",
    ],
    questions: [
      {
        id: "js-ds-1",
        question:
          "What are Map and Set? How do they differ from plain objects and arrays?",
        shortAnswer:
          "Map is a keyed collection that allows any value (including objects and functions) as a key and maintains insertion order. Set is an ordered collection of unique values. Unlike plain objects, Map keys are not coerced to strings, and unlike arrays, Set automatically enforces uniqueness and provides O(1) lookups.",
        answer:
          'Map is a collection of key-value pairs where both the key and the value can be of any type. This is fundamentally different from plain objects where keys are always coerced to strings (or Symbols). A Map remembers the original insertion order of its entries, provides a .size property for O(1) length checks, and is directly iterable with for...of. Its key-comparison algorithm uses SameValueZero, which treats NaN as equal to NaN — unlike the === operator.\n\nSet is a collection of unique values of any type. While you can approximate uniqueness with an array and indexOf/includes, Set guarantees O(1) has-checks and automatic deduplication. Like Map, it preserves insertion order and is directly iterable. Under the hood most engines implement Set with a hash table, so add, has, and delete are all constant-time on average.\n\nPlain objects have several drawbacks as general-purpose dictionaries: keys are limited to strings and Symbols, there is no built-in size property (you must call Object.keys(obj).length), and they inherit properties from Object.prototype which can collide with user keys (e.g. "constructor", "toString"). Map avoids all of these issues and also performs better in scenarios that involve frequent additions and deletions of key-value pairs, according to the spec\'s performance notes.\n\nArrays are ordered and indexable but do not enforce uniqueness, and searching for a value is O(n). Set trades away index-based access in exchange for guaranteed uniqueness and constant-time membership tests. If you need both ordering and uniqueness, Set is the idiomatic choice.\n\nIn practice, plain objects remain the best choice for static, string-keyed records (like configuration or JSON shapes), while Map shines for dynamic dictionaries, caches, and any situation where non-string keys are needed. Similarly, arrays are ideal for ordered, possibly-duplicate collections, whereas Set is preferred when you need a mathematical set of distinct items.',
        code: `// --- Map vs plain object ---
const map = new Map<string, number>();
map.set('a', 1);
map.set('b', 2);
console.log(map.size); // 2
console.log(map.get('a')); // 1

// Any value as key — objects, functions, even NaN
const objKey = { id: 1 };
const fnKey = () => {};
map.set(objKey as unknown as string, 10); // type-safe version below
const flexMap = new Map<unknown, number>();
flexMap.set(objKey, 10);
flexMap.set(fnKey, 20);
flexMap.set(NaN, 30);
console.log(flexMap.get(NaN)); // 30  (NaN === NaN is false, but Map uses SameValueZero)

// Iteration preserves insertion order
for (const [key, value] of flexMap) {
  console.log(key, value);
}

// --- Set vs array ---
const set = new Set<number>([1, 2, 3, 2, 1]);
console.log(set.size); // 3  (duplicates removed)
console.log(set.has(2)); // true  — O(1)

// Quick array dedup
const nums = [4, 1, 2, 4, 3, 2];
const unique = [...new Set(nums)]; // [4, 1, 2, 3]

// Set operations (ES2025+ or manual)
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);

// Union
const union = new Set([...a, ...b]); // {1,2,3,4}

// Intersection
const intersection = new Set([...a].filter(x => b.has(x))); // {2,3}

// Difference
const difference = new Set([...a].filter(x => !b.has(x))); // {1}`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-data-structures",
        tags: ["Map", "Set", "objects", "arrays", "ES6"],
        commonMistakes: [
          'Using plain objects as maps with user-supplied keys — prototype pollution or key collision with inherited properties like "constructor" can cause subtle bugs.',
          "Assuming Set uses strict equality for comparison — it actually uses SameValueZero, so NaN is considered equal to NaN inside a Set.",
          "Forgetting that Map.prototype.size is a getter property, not a method — calling map.size() throws a TypeError.",
        ],
        followUps: [
          "How does SameValueZero differ from strict equality (===) and Object.is?",
          "What are the performance implications of using Map vs Object for very large collections?",
          "How would you serialize a Map to JSON and deserialize it back?",
        ],
        interviewTips: [
          "When comparing Map to Object, mention concrete pain points: non-string keys, prototype pollution, missing .size, and poor iteration ergonomics on objects.",
          "Show you understand time-complexity: Map and Set provide O(1) average for get/set/has/delete, while Object property access is also O(1) on average but with caveats around hidden classes in V8.",
        ],
      },
      {
        id: "js-ds-2",
        question: "Explain WeakMap and WeakSet. What problems do they solve?",
        shortAnswer:
          'WeakMap and WeakSet hold "weak" references to their object keys (or values, in WeakSet\'s case), meaning those references do not prevent garbage collection. They solve the problem of associating metadata with objects without causing memory leaks when those objects are no longer needed elsewhere in the program.',
        answer:
          'WeakMap is a collection of key-value pairs where the keys must be objects (or non-registered symbols as of ES2023) and are held weakly. "Weakly" means the garbage collector does not consider the WeakMap\'s reference to the key when determining whether the key object is reachable. If no other reference to the key exists, it — along with its associated value — can be garbage collected, and the entry silently disappears from the WeakMap.\n\nWeakSet works the same way but for a set of objects: if an object in a WeakSet has no other references, it becomes eligible for garbage collection and is automatically removed from the WeakSet. Both WeakMap and WeakSet are not iterable, have no .size property, and do not support clear(). These restrictions exist because their contents are non-deterministic — entries can vanish at any time depending on GC behavior.\n\nThe primary problem they solve is memory leaks in metadata-association patterns. Imagine you want to attach extra data to DOM nodes, third-party objects, or class instances without modifying them. With a regular Map you would keep those objects alive in the Map\'s key set forever, even after the rest of your application has moved on. A WeakMap lets the metadata be automatically cleaned up when the original object is garbage collected.\n\nA classic example is storing private instance data. Before the # private fields syntax, library authors used a module-scoped WeakMap keyed by the instance to hold truly private data. Because the WeakMap holds the instance weakly, disposing of the instance also releases the private data — no manual cleanup required.\n\nWeakSet is useful for "tagging" objects — for instance, tracking which objects have already been processed, visited, or validated. Since the tag disappears once the object is collected, there is zero risk of an ever-growing bookkeeping set. In frameworks, WeakSet is sometimes used to track which reactive objects have already been proxied, preventing double-wrapping.',
        code: `// --- WeakMap: associating metadata without memory leaks ---
const metadata = new WeakMap<object, Record<string, unknown>>();

function process(obj: object) {
  if (!metadata.has(obj)) {
    metadata.set(obj, { processedAt: Date.now() });
  }
  return metadata.get(obj);
}

let element: object | null = { id: 'btn-1' };
process(element);
console.log(metadata.has(element)); // true

element = null;
// The { id: 'btn-1' } object is now eligible for GC.
// Its entry in \`metadata\` will be cleaned up automatically.

// --- WeakMap for private data (pre-# syntax pattern) ---
const _private = new WeakMap<InstanceType<typeof Person>, { age: number }>();

class Person {
  constructor(public name: string, age: number) {
    _private.set(this, { age });
  }

  getAge(): number {
    return _private.get(this)!.age;
  }
}

const p = new Person('Alice', 30);
console.log(p.getAge()); // 30
console.log((p as Record<string, unknown>)['age']); // undefined — truly private

// --- WeakSet: tagging objects ---
const visited = new WeakSet<object>();

function traverse(node: { children?: object[] }) {
  if (visited.has(node)) return; // already seen, skip
  visited.add(node);
  node.children?.forEach(child => traverse(child as { children?: object[] }));
}`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-data-structures",
        tags: ["WeakMap", "WeakSet", "garbage collection", "memory leaks"],
        commonMistakes: [
          "Trying to use primitive values as WeakMap keys — only objects (and non-registered symbols in ES2023+) are valid keys; primitives will throw a TypeError.",
          "Expecting WeakMap or WeakSet to be iterable or to have a .size property — they intentionally lack these because their contents are non-deterministic.",
          "Assuming entries are removed immediately when the key is dereferenced — cleanup depends on the engine's GC schedule, which is non-deterministic.",
        ],
        followUps: [
          "How would you implement a simple cache with automatic eviction using WeakMap?",
          "Can you use WeakRef and FinalizationRegistry together with WeakMap for advanced GC-aware patterns?",
          "Why can't WeakMap keys be primitives from a garbage collection perspective?",
        ],
        interviewTips: [
          'Emphasize that "weak" refers to the reference strength from the GC\'s perspective, not to the data structure being somehow inferior.',
          "Mention real-world usage: frameworks like Vue use WeakMap/WeakSet internally for reactivity tracking.",
        ],
      },
      {
        id: "js-ds-3",
        question: "How does garbage collection work with WeakMap and WeakSet?",
        shortAnswer:
          "WeakMap and WeakSet hold weak references to their keys (or members). The garbage collector ignores these references when determining reachability, so if no strong reference to the key object exists elsewhere, the GC can reclaim it and the entry is silently removed from the collection.",
        answer:
          'JavaScript engines typically use a mark-and-sweep garbage collection algorithm. Starting from a set of "roots" (global object, call stack, active closures), the collector traverses all reachable objects and marks them as alive. Any object not marked is swept and its memory reclaimed. A regular Map or Set entry counts as a strong reference — the collector treats the Map\'s internal slot pointing to the key as a valid path from root, keeping the key alive.\n\nWeakMap and WeakSet use a different internal reference type that the GC is free to ignore during the mark phase. If the only remaining reference to an object is inside a WeakMap key slot (or a WeakSet value slot), the collector will not mark it. On the next sweep, the object is reclaimed and the engine removes the corresponding entry from the WeakMap/WeakSet. The timing of this cleanup is entirely up to the engine — it may happen immediately, on the next GC cycle, or be deferred.\n\nThis is precisely why WeakMap and WeakSet are not enumerable: the set of live entries is unpredictable and can change between any two lines of synchronous code if the engine performs an opportunistic GC. Providing .size or iteration methods would expose GC internals to userland code, which could lead to non-deterministic program behavior and security concerns (GC-based side channels).\n\nIn V8 (Chrome/Node), weak references are managed through an ephemeron table. An ephemeron is a key-value pair where the value is only considered reachable if the key is reachable through non-weak paths. This requires a special fixpoint iteration during the mark phase: the collector repeatedly scans ephemerons until no new keys become reachable. This makes WeakMap GC slightly more expensive per-cycle than regular Map, but the memory savings from automatic cleanup more than compensate in long-lived applications.\n\nES2021 further expanded the weak-reference toolkit with WeakRef and FinalizationRegistry. WeakRef provides a weak reference to a single object (with .deref() to access it), while FinalizationRegistry lets you register a callback to run after an object is collected. These lower-level primitives are useful for building caches and resource managers but are harder to use correctly than WeakMap/WeakSet.',
        code: `// Demonstrating GC behavior (conceptual — GC timing is non-deterministic)
const cache = new WeakMap<object, string>();

function expensiveComputation(input: object): string {
  if (cache.has(input)) {
    return cache.get(input)!;
  }
  const result = JSON.stringify(input); // simulate work
  cache.set(input, result);
  return result;
}

let config: object | null = { theme: 'dark', lang: 'en' };
expensiveComputation(config);
console.log(cache.has(config)); // true

// Remove the only strong reference
config = null;

// At some future point, GC runs:
// - \`config\` object is unreachable (no strong refs)
// - WeakMap entry { key: config, value: '...' } is cleaned up
// - Memory for both key and value is reclaimed

// --- WeakRef + FinalizationRegistry (ES2021) ---
const registry = new FinalizationRegistry<string>((heldValue) => {
  console.log(\`Object associated with "\${heldValue}" was collected\`);
});

function createTracked(label: string) {
  const obj = { label };
  registry.register(obj, label);
  return new WeakRef(obj);
}

let ref = createTracked('my-object');
console.log(ref.deref()); // { label: 'my-object' }

// Later, if no strong reference exists:
// ref.deref() returns undefined
// registry callback fires with 'my-object'`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-data-structures",
        tags: [
          "garbage collection",
          "WeakMap",
          "WeakSet",
          "WeakRef",
          "FinalizationRegistry",
          "memory",
        ],
        commonMistakes: [
          "Relying on FinalizationRegistry callbacks for critical cleanup logic — the spec does not guarantee callbacks will ever run (e.g. if the program exits first).",
          "Calling WeakRef.deref() and storing the result in a long-lived variable — this recreates a strong reference and defeats the purpose of the weak reference.",
          "Assuming WeakMap entries are removed synchronously when the last strong reference is dropped — GC timing is engine-specific and non-deterministic.",
        ],
        followUps: [
          "What is an ephemeron and how does it affect garbage collection performance?",
          "How do WeakRef and FinalizationRegistry relate to WeakMap under the hood?",
          "Can garbage collection behavior differ between V8, SpiderMonkey, and JavaScriptCore?",
        ],
        interviewTips: [
          'Knowing the term "ephemeron" and being able to explain mark-and-sweep at a high level signals deep understanding — interviewers notice this.',
          "Mention that WeakRef should be a last resort; WeakMap covers most real-world use cases more safely.",
        ],
      },
      {
        id: "js-ds-4",
        question: "When would you use Map over a plain object?",
        shortAnswer:
          "Use Map when you need non-string keys, frequent additions/deletions, guaranteed insertion-order iteration, a reliable .size property, or when user-supplied keys could collide with Object.prototype properties. Plain objects are better for static, string-keyed records like configuration or serialized data.",
        answer:
          'The most obvious reason to choose Map is when you need keys that are not strings or Symbols. Map accepts any value — objects, functions, DOM elements, numbers, even NaN — as a key. With a plain object, every key is coerced to a string, so using an object as a key yields the infamous "[object Object]" collision.\n\nPerformance is another consideration. The ECMAScript specification explicitly states that Maps "must be implemented using either hash tables or other mechanisms that, on average, provide access times that are sublinear on the number of elements." In practice, V8\'s Map implementation is optimized for frequent insertions and deletions, whereas plain objects use hidden classes and inline caches that are optimized for a fixed shape. If your collection grows and shrinks dynamically, Map avoids the hidden-class transition overhead that objects incur.\n\nMap also provides a reliable .size getter, direct iteration via for...of, and built-in methods like forEach, entries, keys, and values. With objects you need Object.keys(obj).length for size (which creates a temporary array) and Object.entries(obj) for iteration. Map\'s iteration is inherently ordered by insertion time and includes all entries — objects technically maintain insertion order for string keys too (since ES2015), but integer-like keys are sorted numerically first, which can be surprising.\n\nSecurity and correctness matter as well. Plain objects inherit from Object.prototype, so keys like "constructor", "toString", or "__proto__" can shadow built-in properties or, worse, enable prototype pollution attacks when user input is used as keys. Object.create(null) mitigates this but loses all object conveniences. Map has no prototype chain issues — every key is just data.\n\nThat said, plain objects remain the right tool for structured records with known, fixed keys — configuration objects, function options, parsed JSON, and similar shapes. They integrate seamlessly with TypeScript interfaces, JSON serialization, and destructuring. Use Map for dynamic dictionaries; use objects for static records.',
        code: `// 1. Non-string keys
const componentState = new Map<HTMLElement, { clicks: number }>();
const btn = document.createElement('button');
componentState.set(btn, { clicks: 0 });

// With a plain object this silently fails:
const badCache: Record<string, number> = {};
const keyA = { id: 1 };
const keyB = { id: 2 };
badCache[keyA as unknown as string] = 1;
badCache[keyB as unknown as string] = 2;
console.log(Object.keys(badCache)); // ['[object Object]'] — collision!

// 2. Frequent additions/deletions
function frequentUpdates() {
  const map = new Map<string, number>();
  for (let i = 0; i < 100_000; i++) {
    map.set(\`key-\${i}\`, i);
  }
  for (let i = 0; i < 50_000; i++) {
    map.delete(\`key-\${i}\`);
  }
  return map.size; // 50000 — O(1)
}

// 3. Safe from prototype pollution
const userInput = '__proto__';
const safeMap = new Map<string, string>();
safeMap.set(userInput, 'safe value');
console.log(safeMap.get('__proto__')); // 'safe value' — no prototype issues

// Contrast with object:
const unsafeObj: Record<string, string> = {};
// unsafeObj[userInput] = 'oops'; // can trigger prototype pollution in older engines

// 4. Reliable size and iteration
const inventory = new Map<string, number>([
  ['apples', 50],
  ['bananas', 30],
  ['cherries', 100],
]);
console.log(inventory.size); // 3

for (const [fruit, count] of inventory) {
  console.log(\`\${fruit}: \${count}\`);
}`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-data-structures",
        tags: ["Map", "Object", "performance", "prototype pollution", "ES6"],
        commonMistakes: [
          "Defaulting to Map for every key-value need — plain objects are still better for static, string-keyed records and have superior TypeScript integration and JSON support.",
          "Using JSON.stringify on a Map and expecting it to work — Map serializes to an empty object by default; you must convert to entries first.",
          "Forgetting that Map keys use SameValueZero comparison, so two different object references that look identical are treated as different keys.",
        ],
        followUps: [
          "How would you implement a LRU cache using Map's insertion-order semantics?",
          "What hidden-class optimizations does V8 apply to plain objects but not to Maps?",
          "How do you convert between Map and plain object idiomatically?",
        ],
        interviewTips: [
          "Structure your answer around categories — key types, performance, safety, ergonomics — rather than listing random facts. This shows organized thinking.",
        ],
      },
      {
        id: "js-ds-5",
        question: "What are the practical use cases for WeakMap?",
        shortAnswer:
          "WeakMap is commonly used for storing private instance data, caching computed results tied to object lifetimes, associating metadata with DOM elements without causing leaks, and tracking memoization entries that should be cleaned up automatically when the source objects are garbage collected.",
        answer:
          "The most classic use case for WeakMap is storing private data for class instances. Before the # private fields syntax landed, library authors stored truly private data in a module-scoped WeakMap keyed by this. Since external code cannot access the WeakMap, the data is encapsulated, and because the reference is weak, destroying the instance also releases the private data. Some codebases still prefer this pattern for its flexibility — for example, you can share a private store between multiple classes in the same module.\n\nDOM metadata association is another everyday scenario. Suppose you need to attach state (scroll positions, event counts, animation timers) to DOM nodes managed by a framework. Using a regular Map or an expando property keeps the node alive even after it has been removed from the document. A WeakMap lets the node — and its associated metadata — be collected once the framework releases it. Libraries like jQuery historically struggled with this exact problem; WeakMap is the modern, leak-free solution.\n\nCaching and memoization keyed by object identity also benefit from WeakMap. Consider a function that performs expensive computation on an object and caches the result. With a Map the cache grows indefinitely; with a WeakMap, cache entries are evicted as the input objects become unreachable. This is particularly valuable in server-side rendering or long-running Node processes where unbounded caches can cause memory exhaustion.\n\nReactive frameworks use WeakMap extensively. Vue 3's reactivity system stores reactive proxies in a WeakMap keyed by the original target object. This prevents double-proxying (the same object is always mapped to the same proxy) and ensures that if the original object goes out of scope, both the proxy and its dependency-tracking metadata are cleaned up.\n\nFinally, WeakMap is useful in branding/tagging patterns — verifying that an object was created by a specific factory or has passed through a validation step. Since the WeakMap is module-private and non-iterable, external code cannot forge or enumerate the tags.",
        code: `// 1. Private instance data
const _internals = new WeakMap<InstanceType<typeof Timer>, { startTime: number }>();

class Timer {
  constructor() {
    _internals.set(this, { startTime: Date.now() });
  }

  elapsed(): number {
    return Date.now() - _internals.get(this)!.startTime;
  }
}

// 2. DOM metadata without memory leaks
const nodeData = new WeakMap<Element, { clickCount: number }>();

function trackClicks(el: Element) {
  if (!nodeData.has(el)) {
    nodeData.set(el, { clickCount: 0 });
  }
  el.addEventListener('click', () => {
    const data = nodeData.get(el)!;
    data.clickCount++;
  });
}
// When \`el\` is removed from DOM and dereferenced, its entry is GC'd.

// 3. Object-keyed memoization cache
const computeCache = new WeakMap<object, number>();

function expensiveHash(obj: object): number {
  if (computeCache.has(obj)) {
    return computeCache.get(obj)!;
  }
  const str = JSON.stringify(obj);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  computeCache.set(obj, hash);
  return hash;
}

// 4. Branding / validation tagging
const validated = new WeakMap<object, true>();

function validate(input: object): void {
  // ... validation logic ...
  validated.set(input, true);
}

function processValidated(input: object): void {
  if (!validated.has(input)) {
    throw new Error('Input must be validated first');
  }
  // safe to process
}`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Scenario",
        category: "JavaScript",
        topicId: "js-data-structures",
        tags: ["WeakMap", "private data", "DOM", "memoization", "caching"],
        commonMistakes: [
          "Using WeakMap for data you need to enumerate or persist — since WeakMap is not iterable and entries can vanish, it is unsuitable for data that must be listed, serialized, or guaranteed to exist.",
          "Creating a WeakMap keyed by short-lived primitives wrapped in objects just to use WeakMap — this adds complexity without benefit; a regular Map with manual cleanup is simpler.",
          "Forgetting to handle the case where WeakMap.get() returns undefined because the entry has been garbage-collected between a .has() check and a .get() call in async code.",
        ],
        followUps: [
          "How does Vue 3 use WeakMap in its reactivity system?",
          "What is the difference between using WeakMap for private data vs using # private fields?",
          "Can you use WeakMap in a cross-realm (iframe) scenario?",
        ],
        interviewTips: [
          "Give at least two concrete use cases (private data + DOM metadata is a strong pair) and explain why a regular Map would cause a memory leak in each.",
        ],
      },
      {
        id: "js-ds-6",
        question:
          "Compare Map, Set, WeakMap, and WeakSet in terms of functionality and use cases.",
        shortAnswer:
          'Map stores key-value pairs with any key type and is iterable. Set stores unique values and is iterable. WeakMap stores key-value pairs with weakly-held object keys and is not iterable. WeakSet stores unique objects with weak references and is not iterable. The "Weak" variants cooperate with garbage collection and are suited for metadata-association and tagging patterns where automatic memory cleanup is desired.',
        answer:
          'Map is the most feature-rich of the four. It supports any key type, preserves insertion order, exposes .size, and provides full iteration (keys, values, entries, forEach, for...of). Use it when you need a dynamic dictionary with non-string keys, ordered iteration, or a size count. Common scenarios include lookup tables, caches with bounded lifetimes (using manual eviction), and bidirectional mappings.\n\nSet provides unique-value semantics with O(1) add/has/delete and insertion-order iteration. It is ideal for deduplication, membership checks, and implementing mathematical set operations (union, intersection, difference). ES2025 is adding Set methods like .union(), .intersection(), .difference(), and .symmetricDifference() directly on the prototype, making Set even more practical.\n\nWeakMap trades iteration, .size, and clear() for garbage-collection-friendly storage. Keys must be objects, and entries are automatically removed when their key is collected. This makes WeakMap the right tool for associating metadata with objects you do not own (DOM nodes, third-party instances) and for private-data patterns. The inability to iterate is a feature, not a limitation — it ensures you cannot accidentally depend on GC-sensitive data.\n\nWeakSet is the simplest of the four: a non-iterable set of weakly-held objects. It answers one question efficiently: "has this object been seen before?" Use it for tagging, cycle detection in graph traversals, and deduplication guards in reactive systems. Since it cannot be enumerated, it has a very narrow API: add, has, delete.\n\nA useful mental model is a 2×2 matrix: strong vs weak references on one axis, key-value vs value-only on the other. Map and Set are strong (entries stay as long as the collection exists); WeakMap and WeakSet are weak (entries live only as long as the key/value is externally reachable). Map and WeakMap are key-value; Set and WeakSet are value-only. Choose the combination that fits your data-lifetime and access-pattern requirements.',
        code: `// --- Side-by-side API comparison ---

// Map: full-featured key-value store
const map = new Map<string, number>([['x', 1], ['y', 2]]);
map.set('z', 3);
map.get('x');          // 1
map.has('y');          // true
map.delete('y');       // true
map.size;              // 2
[...map.keys()];       // ['x', 'z']
[...map.values()];     // [1, 3]
[...map.entries()];    // [['x', 1], ['z', 3]]

// Set: unique values, iterable
const set = new Set<number>([1, 2, 3, 2]);
set.add(4);
set.has(2);            // true
set.delete(2);         // true
set.size;              // 3
[...set];              // [1, 3, 4]

// WeakMap: weak keys, NOT iterable
const wm = new WeakMap<object, string>();
let key = { id: 1 };
wm.set(key, 'data');
wm.get(key);           // 'data'
wm.has(key);           // true
// wm.size             — undefined (no size property)
// [...wm]             — TypeError (not iterable)
// wm.clear()          — TypeError (no clear method)

// WeakSet: weak values, NOT iterable
const ws = new WeakSet<object>();
let obj = { id: 2 };
ws.add(obj);
ws.has(obj);           // true
ws.delete(obj);        // true
// ws.size             — undefined
// [...ws]             — TypeError

// --- Choosing the right collection ---
interface CollectionGuide {
  needNonStringKeys: 'Map or WeakMap';
  needIteration: 'Map or Set';
  needAutoGC: 'WeakMap or WeakSet';
  needUniqueValues: 'Set or WeakSet';
  needKeyValuePairs: 'Map or WeakMap';
  staticStringKeys: 'Plain object';
  orderedWithDuplicates: 'Array';
}`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-data-structures",
        tags: ["Map", "Set", "WeakMap", "WeakSet", "comparison"],
        commonMistakes: [
          "Using WeakMap/WeakSet when you need to iterate over entries — they are intentionally non-iterable; use Map/Set with manual cleanup instead.",
          "Assuming Map and Set have identical performance characteristics — Set operations are generally slightly faster because there is no value slot to manage.",
          "Overlooking that WeakMap values (not just keys) are also released when the key is collected — if the value holds expensive resources, this automatic cleanup is significant.",
        ],
        followUps: [
          "How would you implement a bidirectional map (BiMap) using two Maps?",
          "What new Set methods are being added in ES2025 and how do they work?",
          "Can you combine Map and WeakMap to build a cache with both enumeration and automatic eviction?",
        ],
        interviewTips: [
          "Frame your comparison around a 2×2 matrix (strong/weak × key-value/value-only) — this shows structured thinking and makes the answer easy to follow.",
          "Mention that choosing the right collection is about data lifetime management, not just API convenience.",
        ],
      },
    ],
  },
];
