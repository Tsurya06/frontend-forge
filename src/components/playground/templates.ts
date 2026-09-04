import type { ThemeOption } from "./types";
import welcomePlaygroundCode from "./templates/snippets/welcomePlayground.ts?raw";
import interactiveCardHtml from "./templates/snippets/interactiveCard.html?raw";
import counterAppCode from "./templates/snippets/CounterApp.tsx?raw";
import ticTacToeCode from "./templates/snippets/TicTacToe.tsx?raw";
import debounceSearchCode from "./templates/snippets/DebounceSearch.tsx?raw";
import todoAppCode from "./templates/snippets/TodoApp.tsx?raw";

export const DEFAULT_CODE = welcomePlaygroundCode;
export const DEFAULT_HTML_CODE = interactiveCardHtml;
export const DEFAULT_REACT_CODE = counterAppCode;

export const THEMES: readonly ThemeOption[] = [
  { id: "auto", name: "Auto (Follow App)" },
  { id: "vs-dark", name: "VS Dark" },
  { id: "light", name: "VS Light" },
  { id: "one-dark", name: "One Dark Pro" },
  { id: "dracula", name: "Dracula" },
  { id: "github-dark", name: "GitHub Dark" },
  { id: "monokai", name: "Monokai" },
  { id: "night-owl", name: "Night Owl" },
  { id: "hc-black", name: "High Contrast Dark" },
];


export const SNIPPETS: {
  name: string;
  description: string;
  difficulty: string;
  category: string;
  language: "typescript" | "javascript" | "react" | "html";
  code: string;
}[] = [
  {
    name: "Holy Grail Layout (CSS Grid)",
    description: "3-column responsive layout with sticky footer",
    difficulty: "Intermediate",
    category: "HTML & CSS",
    language: "html",
    code: `<div class="holy-grail">
  <header class="hg-header">Header & Branding</header>
  <aside class="hg-nav">Navigation Sidebar</aside>
  <main class="hg-main">
    <h2>Main Article Content</h2>
    <p>Flexible center column that expands responsively with CSS Grid areas.</p>
  </main>
  <aside class="hg-ads">Widgets & Side Info</aside>
  <footer class="hg-footer">Footer & Copyright (Pinned to Bottom)</footer>
</div>

<style>
body { margin: 0; font-family: system-ui, sans-serif; }
.holy-grail {
  display: grid;
  min-height: 100vh;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 200px 1fr 180px;
  grid-template-areas:
    "header header header"
    "nav    main   ads"
    "footer footer footer";
  gap: 12px;
  padding: 12px;
  box-sizing: border-box;
}

.hg-header { grid-area: header; background: #202123; color: #fff; padding: 14px; border-radius: 6px; }
.hg-nav { grid-area: nav; background: #f7f7f8; border: 1px solid #e5e5e5; padding: 14px; border-radius: 6px; }
.hg-main { grid-area: main; background: #ffffff; border: 1px solid #e5e5e5; padding: 20px; border-radius: 6px; }
.hg-ads { grid-area: ads; background: #f7f7f8; border: 1px solid #e5e5e5; padding: 14px; border-radius: 6px; }
.hg-footer { grid-area: footer; background: #202123; color: #ececf1; padding: 14px; text-align: center; border-radius: 6px; }

@media (max-width: 700px) {
  .holy-grail {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main"
      "nav"
      "ads"
      "footer";
  }
}
</style>
`,
  },
  {
    name: "CSS Shimmer Skeleton",
    description: "Smooth 60fps GPU shimmer wave animation",
    difficulty: "Beginner",
    category: "HTML & CSS",
    language: "html",
    code: `<div class="card-skeleton">
  <div class="shimmer avatar"></div>
  <div class="content">
    <div class="shimmer title-line"></div>
    <div class="shimmer desc-line"></div>
    <div class="shimmer desc-line short"></div>
  </div>
</div>

<style>
body { background: #f7f7f8; font-family: system-ui; padding: 24px; }
.card-skeleton {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  max-width: 360px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.shimmer {
  background: linear-gradient(90deg, #f0f0f2 0%, #e2e2e6 50%, #f0f0f2 100%);
  background-size: 200% 100%;
  animation: shimmerAnim 1.4s infinite linear;
  border-radius: 4px;
}
@keyframes shimmerAnim {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.avatar { width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0; }
.content { flex: 1; display: flex; flex-direction: column; gap: 10px; }
.title-line { height: 16px; width: 65%; }
.desc-line { height: 12px; width: 100%; }
.desc-line.short { width: 45%; }
</style>
`,
  },
  {
    name: "Promise.all Polyfill",
    description: "Implement Promise.all from scratch",
    difficulty: "Intermediate",
    category: "JavaScript",
    language: "typescript",
    code: `// Implement Promise.all polyfill
function promiseAll<T>(promises: (T | Promise<T>)[]): Promise<T[]> {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'));
    }
    
    if (promises.length === 0) {
      resolve([]);
      return;
    }
    
    const results: T[] = new Array(promises.length);
    let completed = 0;
    
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = value;
          completed++;
          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}

// Test it with immediate values and async promises:
console.log('Starting Promise.all test...');

promiseAll([
  Promise.resolve(10),
  new Promise(res => setTimeout(() => res(20), 200)),
  30,
  new Promise(res => setTimeout(() => res(40), 100)),
]).then(results => {
  console.log('✅ Promise.all Results:', results);
}).catch(err => {
  console.error('❌ Promise.all Error:', err);
});
`,
  },
  {
    name: "Debounce with Cancel",
    description: "Create a debounce utility with cancel & immediate trigger",
    difficulty: "Intermediate",
    category: "JavaScript",
    language: "typescript",
    code: `// Implement debounce with cancel and immediate execution
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  immediate: boolean = false
) {
  let timerId: any = null;
  
  const debounced = function(this: any, ...args: Parameters<T>) {
    const callNow = immediate && !timerId;
    
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
      if (!immediate) {
        fn.apply(this, args);
      }
    }, delay);
    
    if (callNow) {
      fn.apply(this, args);
    }
  };
  
  debounced.cancel = () => {
    clearTimeout(timerId);
    timerId = null;
  };
  
  return debounced;
}

// Demo:
const logMessage = debounce((msg: string) => {
  console.log('⚡ Debounced event fired:', msg);
}, 250);

console.log('Sending rapid calls...');
logMessage('Call 1');
logMessage('Call 2');
logMessage('Call 3 (only this will execute after 250ms)');
`,
  },
  {
    name: "Currying with Placeholders",
    description: "Implement flexible curry function",
    difficulty: "Advanced",
    category: "JavaScript",
    language: "typescript",
    code: `// Implement function currying
function curry(fn: (...args: any[]) => any) {
  return function curried(this: any, ...args: any[]): any {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...moreArgs: any[]) => {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}

// Test curried function:
const add = curry((a: number, b: number, c: number, d: number) => a + b + c + d);

console.log('curry(add)(1)(2)(3)(4) =', add(1)(2)(3)(4));
console.log('curry(add)(1, 2)(3)(4) =', add(1, 2)(3)(4));
console.log('curry(add)(1, 2, 3)(4) =', add(1, 2, 3)(4));
console.log('curry(add)(1, 2, 3, 4) =', add(1, 2, 3, 4));
`,
  },
  {
    name: "Deep Clone with Circular Refs",
    description: "Deep copy preserving Maps, Sets, and circular graphs",
    difficulty: "Advanced",
    category: "JavaScript",
    language: "typescript",
    code: `// Deep clone with circular reference & built-in type handling
function deepClone(obj: any, seen = new WeakMap()): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);
  if (obj instanceof Set) {
    const copySet = new Set();
    obj.forEach(val => copySet.add(deepClone(val, seen)));
    return copySet;
  }
  if (obj instanceof Map) {
    const copyMap = new Map();
    obj.forEach((val, key) => copyMap.set(key, deepClone(val, seen)));
    return copyMap;
  }
  
  if (seen.has(obj)) return seen.get(obj);
  
  const clone = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
  seen.set(obj, clone);
  
  for (const key of Reflect.ownKeys(obj)) {
    clone[key] = deepClone(obj[key], seen);
  }
  
  return clone;
}

// Test with nested and circular structure:
const original: any = {
  name: 'Antigravity',
  skills: ['React', 'TypeScript', 'System Design'],
  nested: { count: 42, active: true },
};
original.self = original; // circular!

const cloned = deepClone(original);
console.log('Cloned name:', cloned.name);
console.log('Cloned skills:', cloned.skills);
console.log('Is circular preserved?', cloned.self === cloned);
console.log('Is clone detached from original?', cloned !== original);
`,
  },
  {
    name: "Event Emitter",
    description: "Full Pub/Sub with once, off, and wildcards",
    difficulty: "Intermediate",
    category: "JavaScript",
    language: "typescript",
    code: `// Implement EventEmitter
class EventEmitter {
  private events: Record<string, Function[]> = {};
  
  on(event: string, listener: Function) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
    return () => this.off(event, listener);
  }
  
  off(event: string, listener: Function) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(l => l !== listener);
  }
  
  emit(event: string, ...args: any[]) {
    if (!this.events[event]) return false;
    this.events[event].forEach(listener => {
      try {
        listener(...args);
      } catch (err) {
        console.error(\`Error in \${event} listener:\`, err);
      }
    });
    return true;
  }
  
  once(event: string, listener: Function) {
    const wrapper = (...args: any[]) => {
      listener(...args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }
}

// Demo:
const emitter = new EventEmitter();

const unsubscribe = emitter.on('login', (user: string) => {
  console.log(\`👤 User logged in: \${user}\`);
});

emitter.once('welcome', () => {
  console.log('🎉 First time welcome gift delivered!');
});

emitter.emit('login', 'Alice');
emitter.emit('welcome');
emitter.emit('welcome'); // won't fire again
unsubscribe();
  emitter.emit('login', 'Bob'); // won't fire because unsubscribed
  console.log('Done with EventEmitter demo.');
`,
  },
  {
    name: "Tic-Tac-Toe Game (React 18 / 19)",
    description:
      "Complete state-machine game with useReducer, winning line detection & time travel history",
    difficulty: "Intermediate",
    category: "React Components",
    language: "react",
    code: ticTacToeCode,
  },
  {
    name: "Debounced Search with Custom Hook",
    description:
      "useDebounce hook with live search simulation, loading state, and highlighted results",
    difficulty: "Intermediate",
    category: "React Hooks",
    language: "react",
    code: debounceSearchCode,
  },
  {
    name: "Interactive Todo List with Filter",
    description:
      "Complete CRUD todo application with active/completed filters and local state",
    difficulty: "Beginner",
    category: "React State",
    language: "react",
    code: todoAppCode,
  },
];

