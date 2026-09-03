import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Editor, { type OnMount } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import { useThemeContext } from "@/context/ThemeContext";
import { allCodingProblems, getCodingProblemById } from "@/data";
import { transpileToJS, formatValue } from "@/utils/codeRunner";
import { transform } from "sucrase";
import styles from "./Playground.module.css";

interface ConsoleLine {
  id: string;
  type: "log" | "warn" | "error" | "info" | "result";
  text: string;
  timestamp: number;
}

interface TemplateItem {
  id: string;
  name: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Senior";
  category: string;
  description: string;
  language: string;
  type: "snippet" | "coding";
  code: string;
}

const DEFAULT_CODE = `// 🚀 Welcome to the Frontend Mastery Code Playground!
// Write your code here and click "Run" (or press Ctrl+Enter / ⌘+Enter)

function greet(name: string) {
  return \`Hello, \${name}! 👋\`;
}

console.log(greet('Developer'));
console.log('Ready to practice coding!');

// Try async code & promises:
setTimeout(() => {
  console.log('⏱️ Async timeout completed after 300ms!');
}, 300);

const numbers = [1, 2, 3, 4, 5];
const squares = numbers.map(n => n ** 2);
console.log('Squares:', squares);
`;

const DEFAULT_HTML_CODE = `<!-- 🌐 HTML & CSS Live Interactive Component Sandbox -->
<div class="component-card">
  <div class="badge">Live Component</div>
  <h2 class="title">Interactive Switch & Button</h2>
  <p class="description">Edit this HTML, CSS, or JavaScript and click "▶ Run" to see live updates!</p>
  
  <div class="controls">
    <label class="toggle-switch">
      <input type="checkbox" id="demo-toggle" checked />
      <span class="slider"></span>
    </label>
    <span id="status-label">Feature Enabled</span>
  </div>

  <button id="action-btn" class="btn">Click to Test Event</button>
</div>

<style>
body {
  font-family: system-ui, -apple-system, sans-serif;
  background-color: #f7f7f8;
  color: #2d2d2d;
  padding: 24px;
  margin: 0;
  display: flex;
  justify-content: center;
}

.component-card {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 24px;
  max-width: 440px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  color: #10a37f;
  background: #e6f7f2;
  padding: 2px 8px;
  border-radius: 999px;
  margin-bottom: 8px;
}

.title {
  margin: 0 0 8px;
  font-size: 18px;
}

.description {
  font-size: 13px;
  color: #6b6b6b;
  line-height: 1.5;
  margin: 0 0 20px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
  display: inline-block;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  inset: 0;
  background-color: #e5e5e5;
  border-radius: 24px;
  transition: 0.2s ease;
  cursor: pointer;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

input:checked + .slider {
  background-color: #10a37f;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.btn {
  background: #10a37f;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: background 0.15s ease;
}

.btn:hover {
  background: #0d8f70;
}
</style>

<script>
const toggle = document.getElementById('demo-toggle');
const label = document.getElementById('status-label');
const btn = document.getElementById('action-btn');

toggle.addEventListener('change', (e) => {
  label.textContent = e.target.checked ? 'Feature Enabled' : 'Feature Disabled';
  console.log('⚡ Toggle state changed:', e.target.checked);
});

btn.addEventListener('click', () => {
  console.log('🎉 Button clicked inside live iframe component!');
  alert('Event fired successfully!');
});
</script>
`;

const DEFAULT_REACT_CODE = `import React, { useState, useEffect } from 'react';

export default function CounterApp() {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState<number[]>([0]);

  const increment = () => {
    setCount((prev) => {
      const next = prev + 1;
      setHistory((h) => [...h, next]);
      return next;
    });
  };

  const decrement = () => {
    setCount((prev) => {
      const next = Math.max(0, prev - 1);
      setHistory((h) => [...h, next]);
      return next;
    });
  };

  const reset = () => {
    setCount(0);
    setHistory([0]);
  };

  useEffect(() => {
    console.log('⚡ React State changed: count =', count);
  }, [count]);

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: 32,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#09090b',
      color: '#fafafa',
    }}>
      <div style={{
        background: '#18181b',
        border: '1px solid #27272a',
        borderRadius: 16,
        padding: 28,
        maxWidth: 420,
        width: '100%',
        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        textAlign: 'center',
      }}>
        <span style={{
          display: 'inline-block',
          fontSize: 12,
          fontWeight: 700,
          color: '#10b981',
          background: 'rgba(16, 185, 129, 0.15)',
          padding: '3px 10px',
          borderRadius: 999,
          marginBottom: 12,
          letterSpacing: '0.05em',
        }}>
          REACT 18 / 19 LIVE SANDBOX
        </span>
        <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700 }}>Interactive State Counter</h2>
        <p style={{ color: '#a1a1aa', fontSize: 13, margin: '0 0 24px' }}>
          Edit this React component with Hooks and click "▶ Run &amp; Preview"!
        </p>

        <div style={{
          fontSize: 56,
          fontWeight: 800,
          fontFamily: 'monospace',
          color: '#ffa116',
          marginBottom: 24,
        }}>
          {count}
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
          <button
            onClick={decrement}
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: 14,
              fontWeight: 600,
              background: '#27272a',
              border: '1px solid #3f3f46',
              borderRadius: 8,
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            − Decrement
          </button>
          <button
            onClick={increment}
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: 14,
              fontWeight: 600,
              background: '#ffa116',
              border: 'none',
              borderRadius: 8,
              color: '#000',
              cursor: 'pointer',
            }}
          >
            + Increment
          </button>
          <button
            onClick={reset}
            style={{
              padding: '10px 14px',
              fontSize: 14,
              fontWeight: 600,
              background: '#27272a',
              border: '1px solid #3f3f46',
              borderRadius: 8,
              color: '#a1a1aa',
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>

        <div style={{
          fontSize: 12,
          color: '#71717a',
          textAlign: 'left',
          borderTop: '1px solid #27272a',
          paddingTop: 12,
        }}>
          <strong>Recent history:</strong> {history.slice(-6).join(' → ')}
        </div>
      </div>
    </div>
  );
}
`;

function buildReactIframeSrc(rawSource: string): { html: string; error?: string } {
  try {
    const res = transform(rawSource, {
      transforms: ["typescript", "jsx"],
      production: false,
    });

    const cleanedCode = res.code
      .replace(/import\s+[\s\S]*?\s+from\s+['"][^'"]+['"];?/g, "")
      .replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)/g, "function $1\nwindow.__defaultComponent = $1;")
      .replace(/export\s+default\s+class\s+([A-Za-z0-9_]+)/g, "class $1\nwindow.__defaultComponent = $1;")
      .replace(/export\s+default\s+([A-Za-z0-9_]+);?/g, "window.__defaultComponent = $1;")
      .replace(/export\s+{[^}]+};?/g, "");

    const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://unpkg.com/react@18.3.1/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" crossorigin></script>
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 0;
        background: #09090b;
        color: #f4f4f5;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        min-height: 100vh;
      }
      #root {
        min-height: 100vh;
      }
    </style>
    <script>
      const _log = console.log, _warn = console.warn, _error = console.error;
      console.log = (...args) => { window.parent.postMessage({ type: 'feeq-log', logType: 'log', args }, '*'); _log(...args); };
      console.warn = (...args) => { window.parent.postMessage({ type: 'feeq-log', logType: 'warn', args }, '*'); _warn(...args); };
      console.error = (...args) => { window.parent.postMessage({ type: 'feeq-log', logType: 'error', args }, '*'); _error(...args); };

      window.onerror = function(message, source, lineno, colno, error) {
        const root = document.getElementById('root');
        if (root) {
          root.innerHTML = '<div style="padding:24px;background:#2d1215;color:#fca5a5;border:1px solid #ef4444;border-radius:12px;margin:24px;font-family:monospace;font-size:13px;line-height:1.6;">' +
            '<div style="font-weight:700;font-size:15px;margin-bottom:8px;color:#f87171;">⚠️ React Runtime Error</div>' +
            '<div>' + String(message) + '</div>' +
            (lineno ? '<div style="color:#94a3b8;font-size:11px;margin-top:8px;">Line: ' + lineno + ', Column: ' + colno + '</div>' : '') +
          '</div>';
        }
        window.parent.postMessage({ type: 'feeq-log', logType: 'error', args: [message] }, '*');
        return true;
      };
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script>
      (function() {
        if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
          document.getElementById('root').innerHTML = '<div style="padding:20px;color:#f87171;">Error: React UMD could not be loaded from CDN. Please check network connection.</div>';
          return;
        }

        const {
          useState,
          useEffect,
          useReducer,
          useCallback,
          useMemo,
          useRef,
          useContext,
          createContext,
          useId,
          useTransition,
          useDeferredValue,
          Fragment
        } = React;

        try {
          ${cleanedCode}

          const __Comp = window.__defaultComponent ||
            (typeof App !== 'undefined' ? App :
            (typeof TicTacToe !== 'undefined' ? TicTacToe :
            (typeof CounterApp !== 'undefined' ? CounterApp :
            (typeof Component !== 'undefined' ? Component : null))));

          if (__Comp) {
            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(React.createElement(__Comp));
          } else {
            console.warn("No default component found to mount. Export a component with 'export default function App() { ... }'");
          }
        } catch (err) {
          window.onerror(err.message, "", 0, 0, err);
        }
      })();
    </script>
  </body>
</html>`;
    return { html };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    const errorHtml = `<!DOCTYPE html>
<html>
  <head>
    <style>
      body { margin: 0; padding: 24px; background: #09090b; color: #fca5a5; font-family: monospace; font-size: 13px; }
      .box { background: #2d1215; border: 1px solid #ef4444; border-radius: 12px; padding: 20px; }
    </style>
  </head>
  <body>
    <div class="box">
      <h3 style="margin:0 0 10px;color:#f87171;">⚠️ JSX / TSX Compilation Error</h3>
      <pre style="white-space:pre-wrap;margin:0;">${errorMsg}</pre>
    </div>
  </body>
</html>`;
    return { html: errorHtml, error: errorMsg };
  }
}

const THEMES = [
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

const SNIPPETS: {
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
    code: `import React, { useReducer, useCallback, useMemo } from 'react';

type Player = 'X' | 'O';
type CellValue = Player | null;
type Board = CellValue[];

interface GameState {
  history: Board[];
  currentMove: number;
  scores: { X: number; O: number; draws: number };
}

type GameAction =
  | { type: 'PLAY'; index: number }
  | { type: 'JUMP_TO'; move: number }
  | { type: 'RESTART' }
  | { type: 'NEW_GAME' };

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWinner(board: Board): { winner: Player; line: number[] } | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line };
    }
  }
  return null;
}

const INITIAL_STATE: GameState = {
  history: [Array(9).fill(null)],
  currentMove: 0,
  scores: { X: 0, O: 0, draws: 0 },
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'PLAY': {
      const currentBoard = state.history[state.currentMove];
      if (checkWinner(currentBoard) || currentBoard[action.index]) return state;
      const xIsNext = state.currentMove % 2 === 0;
      const nextBoard = currentBoard.slice();
      nextBoard[action.index] = xIsNext ? 'X' : 'O';
      const newHistory = [...state.history.slice(0, state.currentMove + 1), nextBoard];
      const nextMove = newHistory.length - 1;
      const outcome = checkWinner(nextBoard);
      const isDraw = !outcome && nextBoard.every(Boolean);
      const nextScores = { ...state.scores };
      if (outcome) nextScores[outcome.winner]++;
      else if (isDraw) nextScores.draws++;
      return { history: newHistory, currentMove: nextMove, scores: nextScores };
    }
    case 'JUMP_TO':
      return { ...state, currentMove: action.move };
    case 'RESTART':
      return { ...state, history: [Array(9).fill(null)], currentMove: 0 };
    case 'NEW_GAME':
      return INITIAL_STATE;
    default:
      return state;
  }
}

export default function TicTacToe() {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  const currentBoard = state.history[state.currentMove];
  const winInfo = useMemo(() => checkWinner(currentBoard), [currentBoard]);
  const isDraw = !winInfo && currentBoard.every(Boolean);
  const xIsNext = state.currentMove % 2 === 0;

  const handleCellClick = useCallback((index: number) => {
    dispatch({ type: 'PLAY', index });
  }, []);

  const status = winInfo
    ? \`🎉 Winner: \${winInfo.winner}!\`
    : isDraw
    ? "🤝 It's a draw!"
    : \`Next player: \${xIsNext ? 'X' : 'O'}\`;

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: 24,
      background: '#09090b',
      color: '#f4f4f5',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{ maxWidth: 440, width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontSize: 24, margin: '0 0 6px', fontWeight: 800 }}>Tic-Tac-Toe in React</h1>
        <p style={{ color: '#a1a1aa', fontSize: 13, margin: '0 0 16px' }}>Built with useReducer, useMemo & useCallback</p>

        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: 12,
          padding: 12,
          marginBottom: 16,
        }}>
          <div><strong>X:</strong> {state.scores.X}</div>
          <div><strong>Draws:</strong> {state.scores.draws}</div>
          <div><strong>O:</strong> {state.scores.O}</div>
        </div>

        <div style={{
          fontSize: 16,
          fontWeight: 700,
          color: winInfo ? '#10b981' : isDraw ? '#eab308' : '#ffa116',
          marginBottom: 16,
        }}>
          {status}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
          maxWidth: 260,
          margin: '0 auto 20px',
        }}>
          {currentBoard.map((cell, index) => {
            const isWinningCell = winInfo?.line.includes(index);
            return (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={Boolean(winInfo || cell)}
                style={{
                  height: 80,
                  fontSize: 32,
                  fontWeight: 800,
                  border: isWinningCell ? '2px solid #10b981' : '1px solid #3f3f46',
                  borderRadius: 10,
                  background: isWinningCell ? 'rgba(16, 185, 129, 0.2)' : '#18181b',
                  color: cell === 'X' ? '#38bdf8' : '#f43f5e',
                  cursor: cell || winInfo ? 'default' : 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {cell}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
          <button
            onClick={() => dispatch({ type: 'RESTART' })}
            style={{ padding: '8px 16px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: 6, color: '#fff', cursor: 'pointer' }}
          >
            Restart Round
          </button>
          <button
            onClick={() => dispatch({ type: 'NEW_GAME' })}
            style={{ padding: '8px 16px', background: '#ffa116', border: 'none', borderRadius: 6, color: '#000', fontWeight: 600, cursor: 'pointer' }}
          >
            Reset Scores
          </button>
        </div>

        <div style={{ textAlign: 'left', background: '#121214', border: '1px solid #27272a', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#a1a1aa', marginBottom: 8 }}>Time-Travel History:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {state.history.map((_, move) => (
              <button
                key={move}
                onClick={() => dispatch({ type: 'JUMP_TO', move })}
                style={{
                  fontSize: 11,
                  padding: '4px 8px',
                  borderRadius: 4,
                  border: move === state.currentMove ? '1px solid #ffa116' : '1px solid #27272a',
                  background: move === state.currentMove ? '#ffa116' : '#18181b',
                  color: move === state.currentMove ? '#000' : '#d4d4d8',
                  cursor: 'pointer',
                }}
              >
                {move === 0 ? 'Start' : \`#\${move}\`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
`,
  },
  {
    name: "Debounced Search with Custom Hook",
    description:
      "useDebounce hook with live search simulation, loading state, and highlighted results",
    difficulty: "Intermediate",
    category: "React Hooks",
    language: "react",
    code: `import React, { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const FRAMEWORKS = [
  'React.js', 'Next.js', 'Vue.js', 'Nuxt.js', 'Svelte', 'SvelteKit',
  'Angular', 'Solid.js', 'Astro', 'Remix', 'Qwik', 'Preact', 'Gatsby'
];

export default function DebounceSearch() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  const results = FRAMEWORKS.filter(f =>
    f.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  useEffect(() => {
    if (query !== debouncedQuery) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
      console.log('🔍 Executing search query for:', debouncedQuery);
    }
  }, [query, debouncedQuery]);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 32, background: '#09090b', color: '#f4f4f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: 440, width: '100%', background: '#18181b', border: '1px solid #27272a', borderRadius: 16, padding: 24 }}>
        <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>Debounced Autocomplete</h2>
        <p style={{ color: '#a1a1aa', fontSize: 13, margin: '0 0 16px' }}>Typing updates instantly; search triggers after 400ms pause.</p>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search frontend frameworks..."
          style={{
            width: '100%',
            padding: '12px 14px',
            background: '#27272a',
            border: '1px solid #3f3f46',
            borderRadius: 8,
            color: '#fff',
            fontSize: 14,
            outline: 'none',
            boxSizing: 'border-box',
            marginBottom: 16
          }}
        />

        <div style={{ fontSize: 12, color: '#a1a1aa', marginBottom: 12 }}>
          {isSearching ? '⏳ Waiting for typing pause...' : \`Found \${results.length} frameworks for "\${debouncedQuery}":\`}
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {results.map((item) => (
            <li key={item} style={{ padding: '10px 14px', background: '#212124', borderRadius: 6, border: '1px solid #2f2f32', fontSize: 14 }}>
              ⚡ {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
`,
  },
  {
    name: "Interactive Todo List with Filter",
    description:
      "Complete CRUD todo application with active/completed filters and local state",
    difficulty: "Beginner",
    category: "React State",
    language: "react",
    code: `import React, { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Master JavaScript Event Loop', completed: true },
    { id: 2, text: 'Build React Playground sandbox', completed: true },
    { id: 3, text: 'Ace Senior Frontend Interview', completed: false },
  ]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input.trim(), completed: false }]);
    setInput('');
  };

  const toggle = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const remove = (id: number) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 32, background: '#09090b', color: '#f4f4f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: 440, width: '100%', background: '#18181b', border: '1px solid #27272a', borderRadius: 16, padding: 24 }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 22 }}>Interactive Todo List</h2>
        <form onSubmit={addTodo} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add new task..."
            style={{ flex: 1, padding: '10px 14px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: 8, color: '#fff', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '10px 16px', background: '#ffa116', border: 'none', borderRadius: 8, fontWeight: 700, color: '#000', cursor: 'pointer' }}>
            Add
          </button>
        </form>

        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {(['all', 'active', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: 'none',
                background: filter === f ? '#ffa116' : '#27272a',
                color: filter === f ? '#000' : '#a1a1aa',
                textTransform: 'capitalize',
                fontWeight: 600,
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(t => (
            <li key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#212124', borderRadius: 8, border: '1px solid #2f2f32' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={t.completed} onChange={() => toggle(t.id)} />
                <span style={{ textDecoration: t.completed ? 'line-through' : 'none', color: t.completed ? '#71717a' : '#f4f4f5' }}>{t.text}</span>
              </label>
              <button onClick={() => remove(t.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
`,
  },
];

export default function Playground() {
  const { resolvedTheme: appTheme } = useThemeContext();
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState<
    "typescript" | "javascript" | "react" | "html"
  >("typescript");
  const [activeTab, setActiveTab] = useState<"preview" | "console">("console");
  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem("feeq-playground-theme") || "auto";
  });
  const [output, setOutput] = useState<ConsoleLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [hasError, setHasError] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("Ready");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [templateSearch, setTemplateSearch] = useState("");
  const [templateCategory, setTemplateCategory] = useState("all");

  // Unified list of all 45+ snippets & challenge solutions
  const allTemplates: TemplateItem[] = useMemo(() => {
    const snippetItems: TemplateItem[] = SNIPPETS.map((s) => ({
      id: `snippet-${s.name}`,
      name: s.name,
      difficulty: s.difficulty as any,
      category: s.category,
      description: s.description,
      language: s.language,
      type: "snippet",
      code: s.code,
    }));

    const codingItems: TemplateItem[] = allCodingProblems.map((p) => ({
      id: `coding-${p.id}`,
      name: p.title,
      difficulty: p.difficulty,
      category: p.category || "JavaScript",
      description: p.problem.slice(0, 110) + "…",
      language:
        p.category === "CSS" || p.category === "HTML & CSS"
          ? "html"
          : "javascript",
      type: "coding",
      code: p.implementation,
    }));

    return [...snippetItems, ...codingItems];
  }, []);

  const filteredTemplates = useMemo(() => {
    return allTemplates.filter((t) => {
      if (templateSearch.trim()) {
        const q = templateSearch.toLowerCase();
        const matches =
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (templateCategory === "all") return true;
      if (templateCategory === "react")
        return (
          t.language === "react" ||
          t.category.toLowerCase().includes("react")
        );
      if (templateCategory === "snippets") return t.type === "snippet";
      if (templateCategory === "polyfills")
        return t.type === "coding" && t.category !== "CSS";
      if (templateCategory === "html-css")
        return (
          t.language === "html" ||
          t.category.toLowerCase().includes("css") ||
          t.category.toLowerCase().includes("html")
        );
      if (templateCategory === "algorithms")
        return (
          t.category.toLowerCase().includes("algorithm") ||
          t.category.toLowerCase().includes("object")
        );
      return true;
    });
  }, [allTemplates, templateSearch, templateCategory]);

  const loadTemplateItem = useCallback(
    (item: TemplateItem) => {
      const isHtml =
        item.language === "html" ||
        item.category.includes("CSS") ||
        item.code.startsWith("<!--");
      const isReact =
        item.language === "react" ||
        item.category.toLowerCase().includes("react");

      if (isReact) {
        setLanguage("react");
        setActiveTab("preview");
      } else if (isHtml) {
        setLanguage("html");
        setActiveTab("preview");
      } else {
        setLanguage(
          item.language === "typescript" ? "typescript" : "javascript",
        );
      }
      setCode(item.code);
      tsCacheRef.current = item.code;
      if (editorRef.current) {
        editorRef.current.setValue(item.code);
      }
      setIsTemplatesOpen(false);
      setStatusMessage(`Loaded: ${item.name}`);
    },
    [],
  );

  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const activeRunIdRef = useRef<number>(0);
  const tsCacheRef = useRef<string | null>(null);

  // Load problem or snippet from URL search params or sessionStorage
  useEffect(() => {
    const sessionMode = sessionStorage.getItem("feeq-playground-mode");
    const sessionSnippet = sessionStorage.getItem("feeq-playground-snippet");

    if (sessionSnippet) {
      sessionStorage.removeItem("feeq-playground-snippet");
      sessionStorage.removeItem("feeq-playground-mode");

      if (
        sessionMode === "web" ||
        sessionSnippet.includes("<html") ||
        sessionSnippet.includes("<div") ||
        sessionSnippet.includes("<style")
      ) {
        setLanguage("html");
        setActiveTab("preview");
      }

      setCode(sessionSnippet);
      tsCacheRef.current = sessionSnippet;
      if (editorRef.current) {
        editorRef.current.setValue(sessionSnippet);
      }
      return;
    }

    const problemId = searchParams.get("problem");
    if (problemId) {
      const p = getCodingProblemById(problemId);
      if (p) {
        if (p.category === "CSS" || p.category === "HTML & CSS") {
          setLanguage("html");
          setActiveTab("preview");
        }
        const starterCode = p.implementation.startsWith("<!--")
          ? p.implementation
          : `// 🎯 ${p.title} (${p.difficulty})\n// ${p.problem}\n\n// Solution implementation:\n${p.implementation}\n\n// Try running tests:\nconsole.log('Testing solution for ${p.title}...');\n`;
        setCode(starterCode);
        tsCacheRef.current = starterCode;
        if (editorRef.current) {
          editorRef.current.setValue(starterCode);
        }
      }
    }
  }, [searchParams]);

  const handleThemeChange = (newTheme: string) => {
    setSelectedTheme(newTheme);
    localStorage.setItem("feeq-playground-theme", newTheme);
  };

  // Convert TypeScript to pure JavaScript on switch, restore on switch back, or setup HTML/React template
  const handleLanguageChange = (
    newLang: "javascript" | "typescript" | "react" | "html",
  ) => {
    const currentCode = editorRef.current?.getValue() ?? code;
    setLanguage(newLang);

    if (newLang === "react") {
      setActiveTab("preview");
      if (
        !currentCode.includes("import React") &&
        !currentCode.includes("useState") &&
        !currentCode.includes("useReducer") &&
        !currentCode.includes("export default")
      ) {
        setCode(DEFAULT_REACT_CODE);
        if (editorRef.current) {
          editorRef.current.setValue(DEFAULT_REACT_CODE);
        }
      }
      return;
    }

    if (newLang === "html") {
      setActiveTab("preview");
      if (
        !currentCode.includes("<div") &&
        !currentCode.includes("<style") &&
        !currentCode.includes("<html")
      ) {
        setCode(DEFAULT_HTML_CODE);
        if (editorRef.current) {
          editorRef.current.setValue(DEFAULT_HTML_CODE);
        }
      }
      return;
    }

    if (newLang === "javascript") {
      tsCacheRef.current = currentCode;
      try {
        const pureJS = transpileToJS(currentCode);
        setCode(pureJS);
        if (editorRef.current) {
          editorRef.current.setValue(pureJS);
        }
      } catch (err) {
        console.error("Failed to convert TS to JS", err);
      }
    } else if (newLang === "typescript") {
      if (tsCacheRef.current) {
        setCode(tsCacheRef.current);
        if (editorRef.current) {
          editorRef.current.setValue(tsCacheRef.current);
        }
      }
    }
  };

  // Setup custom Monaco themes on mount
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.editor.defineTheme("dracula", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6272a4", fontStyle: "italic" },
        { token: "keyword", foreground: "ff79c6", fontStyle: "bold" },
        { token: "string", foreground: "f1fa8c" },
        { token: "number", foreground: "bd93f9" },
        { token: "type", foreground: "8be9fd" },
      ],
      colors: {
        "editor.background": "#282a36",
        "editor.foreground": "#f8f8f2",
        "editorLineNumber.foreground": "#6272a4",
      },
    });

    monaco.editor.defineTheme("one-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "5c6370", fontStyle: "italic" },
        { token: "keyword", foreground: "c678dd" },
        { token: "string", foreground: "98c379" },
        { token: "number", foreground: "d19a66" },
      ],
      colors: {
        "editor.background": "#21252b",
        "editor.foreground": "#abb2bf",
      },
    });

    // Configure JavaScript compiler options to avoid false semantic linting errors
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    });

    // Configure TypeScript diagnostics
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      noSuggestionDiagnostics: false,
    });

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2022,
      allowNonTextFiles: true,
      noLib: false,
      alwaysStrict: false,
      allowJs: true,
    });
  };

  const effectiveTheme =
    selectedTheme === "auto"
      ? appTheme === "dark"
        ? "vs-dark"
        : "light"
      : selectedTheme;

  const handleFormat = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument")?.run();
    }
  }, []);

  // Execution engine supporting JS, TS, and Live HTML/CSS Component Previews
  const runCode = useCallback(
    (codeToRun?: string) => {
      const rawSource =
        typeof codeToRun === "string"
          ? codeToRun
          : (editorRef.current?.getValue() ?? code);
      const runId = ++activeRunIdRef.current;

      setIsRunning(true);
      setHasError(false);
      setStatusMessage("Executing...");
      setExecutionTime(null);

      const startTime = performance.now();

      const appendLine = (type: ConsoleLine["type"], ...args: unknown[]) => {
        if (activeRunIdRef.current !== runId) return;
        const text = args.map(formatValue).join(" ");
        const line: ConsoleLine = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          type,
          text,
          timestamp: Date.now(),
        };
        setOutput((prev) => [...prev, line]);
      };

      // 1. Detect if code is React JSX/TSX
      const isReact =
        language === "react" ||
        rawSource.includes("import React") ||
        rawSource.includes("from 'react'") ||
        rawSource.includes('from "react"') ||
        (rawSource.includes("function") && /<[A-Z][a-zA-Z0-9]*\b/.test(rawSource)) ||
        (/export\s+default\s+function/.test(rawSource) && /<[a-zA-Z]/.test(rawSource));

      if (isReact) {
        setActiveTab("preview");
        if (iframeRef.current) {
          const { html, error } = buildReactIframeSrc(rawSource);
          iframeRef.current.srcdoc = html;
          if (error) {
            setHasError(true);
            appendLine("error", `Compilation Error: ${error}`);
            setStatusMessage("Compilation Error");
          } else {
            setHasError(false);
            setStatusMessage("React App Mounted");
          }
        }
        setExecutionTime(performance.now() - startTime);
        setIsRunning(false);
        return;
      }

      // If in HTML/CSS mode, update the live iframe preview
      if (
        language === "html" ||
        rawSource.includes("<html") ||
        rawSource.includes("<div") ||
        rawSource.includes("<style")
      ) {
        setActiveTab("preview");
        if (iframeRef.current) {
          const isPureCSS =
            !rawSource.includes("<") && !rawSource.includes("</");
          let injectedContent = rawSource;

          if (isPureCSS) {
            const classMatches = Array.from(
              rawSource.matchAll(/\.([a-zA-Z0-9_-]+)/g),
            )
              .map((m) => m[1])
              .filter((c): c is string => Boolean(c));
            const uniqueClasses = Array.from(new Set(classMatches)).filter(
              (c) =>
                ![
                  "hover",
                  "focus",
                  "active",
                  "before",
                  "after",
                  "disabled",
                  "checked",
                ].includes(c),
            );

            injectedContent = `
            <style>
              *, *::before, *::after { box-sizing: border-box; }
              body {
                font-family: system-ui, -apple-system, sans-serif;
                padding: 24px;
                margin: 0;
                background: #f7f7f8;
                color: #2d2d2d;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
              }
              .demo-canvas {
                display: flex;
                flex-direction: column;
                gap: 16px;
                align-items: center;
                width: 100%;
                max-width: 480px;
              }
              .demo-card-box {
                background: #ffffff;
                border: 1px solid #e5e5e5;
                border-radius: 12px;
                padding: 20px;
                width: 100%;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                text-align: center;
              }
              /* Injected User CSS */
              ${rawSource}
            </style>
            <div class="demo-canvas">
              ${
                uniqueClasses.length > 0
                  ? uniqueClasses
                      .map(
                        (cls) =>
                          `<div class="${cls} demo-card-box"><strong>.${cls}</strong><p style="margin:4px 0 0;font-size:12px;color:#6b6b6b">CSS styles applied</p></div>`,
                      )
                      .join("")
                  : `<div class="card demo-card-box"><strong>CSS Live Preview</strong><p style="margin:4px 0 0;font-size:12px;color:#6b6b6b">Styles applied to canvas</p></div>`
              }
            </div>
          `;
          }

          const injectedHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8" />
              <script>
                // Intercept console inside iframe
                const _log = console.log, _warn = console.warn, _error = console.error;
                console.log = (...args) => { window.parent.postMessage({ type: 'feeq-log', logType: 'log', args }, '*'); _log(...args); };
                console.warn = (...args) => { window.parent.postMessage({ type: 'feeq-log', logType: 'warn', args }, '*'); _warn(...args); };
                console.error = (...args) => { window.parent.postMessage({ type: 'feeq-log', logType: 'error', args }, '*'); _error(...args); };
              </script>
            </head>
            <body>${injectedContent}</body>
          </html>
        `;
          iframeRef.current.srcdoc = injectedHtml;
        }
        setExecutionTime(performance.now() - startTime);
        setIsRunning(false);
        setStatusMessage("Preview Updated");
        return;
      }

      // JavaScript / TypeScript console execution
      setOutput([]);
      const sandboxConsole = {
        log: (...args: unknown[]) => appendLine("log", ...args),
        warn: (...args: unknown[]) => appendLine("warn", ...args),
        error: (...args: unknown[]) => appendLine("error", ...args),
        info: (...args: unknown[]) => appendLine("info", ...args),
        clear: () => setOutput([]),
        table: (...args: unknown[]) => appendLine("log", ...args),
      };

      const sandboxSetTimeout = (
        handler: TimerHandler,
        timeout?: number,
        ...args: any[]
      ) => {
        return window.setTimeout(() => {
          if (activeRunIdRef.current === runId) {
            if (typeof handler === "function") {
              try {
                handler(...args);
              } catch (err: any) {
                appendLine(
                  "error",
                  `Async Error: ${err?.message || String(err)}`,
                );
              }
            }
          }
        }, timeout);
      };

      const sandboxSetInterval = (
        handler: TimerHandler,
        timeout?: number,
        ...args: any[]
      ) => {
        return window.setInterval(() => {
          if (activeRunIdRef.current === runId) {
            if (typeof handler === "function") {
              try {
                handler(...args);
              } catch (err: any) {
                appendLine(
                  "error",
                  `Interval Error: ${err?.message || String(err)}`,
                );
              }
            }
          }
        }, timeout);
      };

      const jsExecutable = transpileToJS(rawSource);

      try {
        const runner = new Function(
          "console",
          "setTimeout",
          "setInterval",
          "clearTimeout",
          "clearInterval",
          "Promise",
          `
        return (async () => {
          ${jsExecutable}
        })();
        `,
        );

        const promiseResult = runner(
          sandboxConsole,
          sandboxSetTimeout,
          sandboxSetInterval,
          window.clearTimeout.bind(window),
          window.clearInterval.bind(window),
          Promise,
        );

        if (promiseResult && typeof promiseResult.then === "function") {
          promiseResult
            .then((res: unknown) => {
              if (activeRunIdRef.current === runId) {
                setExecutionTime(performance.now() - startTime);
                setIsRunning(false);
                setStatusMessage("Success");
                if (res !== undefined) appendLine("result", res);
              }
            })
            .catch((err: unknown) => {
              if (activeRunIdRef.current === runId) {
                appendLine(
                  "error",
                  `Runtime Error: ${err instanceof Error ? err.message : String(err)}`,
                );
                setHasError(true);
                setIsRunning(false);
                setStatusMessage("Error");
                setExecutionTime(performance.now() - startTime);
              }
            });
        } else {
          setExecutionTime(performance.now() - startTime);
          setIsRunning(false);
          setStatusMessage("Success");
        }
      } catch (err: unknown) {
        appendLine(
          "error",
          `Syntax / Execution Error: ${err instanceof Error ? err.message : String(err)}`,
        );
        setHasError(true);
        setIsRunning(false);
        setStatusMessage("Error");
        setExecutionTime(performance.now() - startTime);
      }
    },
    [code, language],
  );

  // Listen to messages from live iframe
  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "feeq-log") {
        const { logType, args } = event.data;
        const text = args.map((a: unknown) => formatValue(a)).join(" ");
        setOutput((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            type: logType,
            text,
            timestamp: Date.now(),
          },
        ]);
      }
    };
    window.addEventListener("message", handleIframeMessage);
    return () => window.removeEventListener("message", handleIframeMessage);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runCode();
      }
      if (e.altKey && e.shiftKey && (e.key === "F" || e.key === "f")) {
        e.preventDefault();
        handleFormat();
      }
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [runCode, handleFormat, isFullscreen]);

  const clearOutput = useCallback(() => {
    setOutput([]);
    setExecutionTime(null);
    setHasError(false);
    setStatusMessage("Cleared");
  }, []);

  const resetCode = useCallback(() => {
    const defaultVal = language === "html" ? DEFAULT_HTML_CODE : DEFAULT_CODE;
    setCode(defaultVal);
    if (editorRef.current) {
      editorRef.current.setValue(defaultVal);
    }
    setOutput([]);
    setExecutionTime(null);
    setHasError(false);
    setStatusMessage("Reset");
  }, [language]);

  const difficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return styles.snippetBeginner;
      case "Intermediate":
        return styles.snippetIntermediate;
      case "Advanced":
        return styles.snippetAdvanced;
      case "Senior":
        return styles.snippetSenior;
      default:
        return styles.snippetBadge;
    }
  };

  const copyConsoleOutput = useCallback(() => {
    const text = output
      .map((l) => `${l.type.toUpperCase()}: ${l.text}`)
      .join("\n");
    navigator.clipboard.writeText(text);
  }, [output]);

  return (
    <div className={styles.page}>
      <div
        className={`${styles.playgroundContainer} ${isFullscreen ? styles.fullscreenContainer : ""}`}
      >
        {/* Toolbar */}
        <div className={styles.toolbar}>
          {/* Language Selector */}
          <div className={styles.toolbarGroup}>
            <label className={styles.toolbarLabel} htmlFor="lang-select">
              Mode / Language:
            </label>
            <select
              id="lang-select"
              className={styles.select}
              value={language}
              onChange={(e) =>
                handleLanguageChange(
                  e.target.value as "javascript" | "typescript" | "react" | "html",
                )
              }
              aria-label="Language"
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="react">⚛️ React 18 / 19 (JSX &amp; TSX Live)</option>
              <option value="html">
                🌐 HTML &amp; CSS (Web Component Preview)
              </option>
            </select>
          </div>

          <div className={styles.toolbarSeparator} />

          {/* Theme Selector */}
          <div className={styles.toolbarGroup}>
            <label className={styles.toolbarLabel} htmlFor="theme-select">
              🎨 Theme:
            </label>
            <select
              id="theme-select"
              className={styles.select}
              value={selectedTheme}
              onChange={(e) => handleThemeChange(e.target.value)}
              aria-label="Editor Theme"
            >
              {THEMES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.toolbarSeparator} />

          {/* Templates & Snippets Modal Trigger Button */}
          <button
            type="button"
            className={styles.templatesToolbarBtn}
            onClick={() => setIsTemplatesOpen(true)}
            title="Open Templates, Polyfills & Practice Snippets"
          >
            <span>📑 Snippets & Templates</span>
            <span className={styles.templatesBadge}>
              {allTemplates.length}
            </span>
          </button>

          {/* Run Button */}
          <button
            className={isRunning ? styles.runBtnRunning : styles.runBtn}
            onClick={() => runCode()}
            disabled={isRunning}
            aria-label="Run code"
            title="Run code (⌘+Enter / Ctrl+Enter)"
          >
            {isRunning
              ? "⏳ Running..."
              : language === "html" || language === "react"
                ? "▶ Run & Preview"
                : "▶ Run"}
          </button>

          {/* Format Button */}
          <button
            className={styles.formatBtn}
            onClick={handleFormat}
            aria-label="Auto Format Code"
            title="Auto Format (Shift+Alt+F)"
          >
            ✨ Format
          </button>

          {/* Fullscreen Button */}
          <button
            className={styles.fullscreenBtn}
            onClick={() => setIsFullscreen((prev) => !prev)}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Open Fullscreen"}
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "Open Fullscreen"}
          >
            {isFullscreen ? "🗗 Exit" : "⛶ Fullscreen"}
          </button>

          <button
            className={styles.toolbarBtn}
            onClick={clearOutput}
            aria-label="Clear output"
          >
            🧹 Clear
          </button>

          <button
            className={styles.toolbarBtn}
            onClick={resetCode}
            aria-label="Reset code"
          >
            ↺ Reset
          </button>

          <div className={styles.toolbarSpacer} />

          <div className={styles.shortcutHint}>
            <span>⌘+Enter to run</span>
            <span>•</span>
            <span>⌥⇧F to format</span>
          </div>
        </div>

        {/* Editor + Output Area */}
        <div className={styles.editorArea}>
          <div className={styles.editorPane}>
            <div className={styles.paneHeader}>
              <div className={styles.paneTitle}>
                <span>📝 Editor</span>
                <span className={styles.langBadge}>
                  {language === "react"
                    ? "REACT (JSX/TSX)"
                    : language.toUpperCase()}
                </span>
              </div>
            </div>
            <div className={styles.editorWrapper}>
              <Editor
                height="100%"
                language={
                  language === "html"
                    ? "html"
                    : language === "react"
                      ? "typescript"
                      : language
                }
                value={code}
                theme={effectiveTheme}
                onMount={handleEditorDidMount}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  tabSize: 2,
                  automaticLayout: true,
                  padding: { top: 14, bottom: 14 },
                }}
              />
            </div>
          </div>

          <div className={styles.outputPane}>
            <div className={styles.paneHeader}>
              <div className={styles.tabButtons}>
                {(language === "html" || language === "react") && (
                  <button
                    className={`${styles.tabBtn} ${activeTab === "preview" ? styles.activeTabBtn : ""}`}
                    onClick={() => setActiveTab("preview")}
                  >
                    {language === "react"
                      ? "⚛️ React Live Preview"
                      : "🌐 Live Web Preview"}
                  </button>
                )}
                <button
                  className={`${styles.tabBtn} ${activeTab === "console" ? styles.activeTabBtn : ""}`}
                  onClick={() => setActiveTab("console")}
                >
                  📟 Console ({output.length})
                </button>
              </div>

              {activeTab === "console" && output.length > 0 && (
                <div className={styles.outputActions}>
                  <button
                    className={styles.miniActionBtn}
                    onClick={copyConsoleOutput}
                    title="Copy Output"
                  >
                    📋 Copy
                  </button>
                  <button
                    className={styles.miniActionBtn}
                    onClick={clearOutput}
                    title="Clear Console"
                  >
                    ✕ Clear
                  </button>
                </div>
              )}
            </div>

            {/* Live Web Component Iframe View */}
            {activeTab === "preview" ? (
              <div className={styles.previewPane}>
                <iframe
                  ref={iframeRef}
                  title="Live Web Preview"
                  className={styles.liveIframe}
                  sandbox="allow-scripts allow-modals allow-forms allow-popups"
                />
              </div>
            ) : (
              <div className={styles.consoleOutput} ref={consoleRef}>
                {output.length === 0 ? (
                  <div className={styles.emptyConsole}>
                    <span className={styles.emptyIcon}>💡</span>
                    <p className={styles.emptyText}>
                      Click <strong>"▶ Run"</strong> or press{" "}
                      <strong>⌘+Enter</strong> to execute
                    </p>
                    <span className={styles.emptySub}>
                      Outputs, return values, errors, and async logs stream here
                    </span>
                  </div>
                ) : (
                  output.map((line) => (
                    <div
                      key={line.id}
                      className={`${styles.consoleLine} ${
                        line.type === "error"
                          ? styles.errorLine
                          : line.type === "warn"
                            ? styles.warnLine
                            : line.type === "info"
                              ? styles.infoLine
                              : line.type === "result"
                                ? styles.resultLine
                                : styles.logLine
                      }`}
                    >
                      <span className={styles.consolePrefix}>
                        {line.type === "error"
                          ? "✗"
                          : line.type === "warn"
                            ? "⚠"
                            : line.type === "info"
                              ? "ℹ"
                              : line.type === "result"
                                ? "→"
                                : "›"}
                      </span>
                      <span className={styles.consoleText}>{line.text}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className={styles.statusBar}>
          <div className={styles.statusLeft}>
            <span
              className={
                hasError
                  ? styles.statusDotError
                  : isRunning
                    ? styles.statusDotRunning
                    : styles.statusDot
              }
            />
            <span className={styles.statusText}>{statusMessage}</span>
          </div>

          <div className={styles.statusRight}>
            {executionTime !== null && (
              <span className={styles.executionTime}>
                ⏱ {executionTime.toFixed(2)}ms
              </span>
            )}
            <span className={styles.themeIndicator}>
              Theme: {THEMES.find((t) => t.id === selectedTheme)?.name}
            </span>
          </div>
        </div>
      </div>

      {/* ── Templates & Snippets Modal Drawer ── */}
      {isTemplatesOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsTemplatesOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="templates-modal-title"
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <span className={styles.modalIcon}>📑</span>
                <div>
                  <h2 id="templates-modal-title" className={styles.modalTitle}>
                    Templates & Practice Snippets
                  </h2>
                  <p className={styles.modalSubtitle}>
                    1-click loads algorithm solutions or HTML components into sandbox
                  </p>
                </div>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsTemplatesOpen(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Search & Category Filter */}
            <div className={styles.modalFilterArea}>
              <div className={styles.modalSearchBox}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="search"
                  className={styles.modalSearchInput}
                  placeholder="Search templates, polyfills, algorithms, HTML layouts..."
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  autoFocus
                />
                {templateSearch && (
                  <button
                    type="button"
                    className={styles.clearSearchBtn}
                    onClick={() => setTemplateSearch("")}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className={styles.modalCategoryRow}>
                {[
                  { id: "all", label: "All", count: allTemplates.length },
                  { id: "react", label: "React Components", count: 4 },
                  { id: "snippets", label: "Core Snippets", count: 8 },
                  { id: "polyfills", label: "Polyfills", count: 28 },
                  { id: "html-css", label: "HTML & CSS", count: 6 },
                  { id: "algorithms", label: "Algorithms", count: 5 },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`${styles.modalCatPill} ${templateCategory === cat.id ? styles.modalCatPillActive : ""}`}
                    onClick={() => setTemplateCategory(cat.id)}
                  >
                    <span>{cat.label}</span>
                    <span className={styles.pillBadge}>{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* List Grid */}
            <div className={styles.modalGrid}>
              {filteredTemplates.length === 0 ? (
                <div className={styles.emptyTemplates}>
                  <p>No snippets or templates match your search.</p>
                  <button
                    type="button"
                    className={styles.resetSearchBtn}
                    onClick={() => {
                      setTemplateSearch("");
                      setTemplateCategory("all");
                    }}
                  >
                    Clear Search Filters
                  </button>
                </div>
              ) : (
                filteredTemplates.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={styles.templateCard}
                    onClick={() => loadTemplateItem(item)}
                  >
                    <div className={styles.templateCardTop}>
                      <span className={styles.templateCardName}>
                        {item.name}
                      </span>
                      <span className={difficultyStyle(item.difficulty)}>
                        {item.difficulty}
                      </span>
                    </div>
                    <p className={styles.templateCardDesc}>{item.description}</p>
                    <div className={styles.templateCardFooter}>
                      <span className={styles.categoryTag}>{item.category}</span>
                      <span className={styles.templateLoadHint}>
                        ▶ Load into Sandbox
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
