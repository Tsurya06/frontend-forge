import{n as e}from"./rolldown-runtime-CbXtAM7H.js";import{n as t,t as n}from"./monaco-vendor-BgAia2ap.js";import{d as r,t as i}from"./react-vendor-B8VQu9QQ.js";import{a}from"./index-BE00BHrV.js";import{s as o,t as s}from"./data-cb_n338Q.js";import{n as c,r as l}from"./codeRunner-Cuxr0LoG.js";var u=e(t(),1),d={page:`_page_13b91_1`,playgroundContainer:`_playgroundContainer_13b91_16`,fullscreenContainer:`_fullscreenContainer_13b91_32`,toolbar:`_toolbar_13b91_46`,toolbarGroup:`_toolbarGroup_13b91_56`,toolbarLabel:`_toolbarLabel_13b91_62`,toolbarSeparator:`_toolbarSeparator_13b91_69`,select:`_select_13b91_76`,runBtn:`_runBtn_13b91_104`,runBtnRunning:`_runBtnRunning_13b91_131 _runBtn_13b91_104`,formatBtn:`_formatBtn_13b91_138`,fullscreenBtn:`_fullscreenBtn_13b91_168`,toolbarBtn:`_toolbarBtn_13b91_189`,toolbarSpacer:`_toolbarSpacer_13b91_211`,shortcutHint:`_shortcutHint_13b91_215`,editorArea:`_editorArea_13b91_224`,editorPane:`_editorPane_13b91_235`,outputPane:`_outputPane_13b91_242`,paneHeader:`_paneHeader_13b91_249`,paneTitle:`_paneTitle_13b91_261`,editorHeaderActions:`_editorHeaderActions_13b91_267`,langBadge:`_langBadge_13b91_273`,countBadge:`_countBadge_13b91_283`,tabButtons:`_tabButtons_13b91_293`,tabBtn:`_tabBtn_13b91_299`,activeTabBtn:`_activeTabBtn_13b91_316`,previewPane:`_previewPane_13b91_324`,liveIframe:`_liveIframe_13b91_333`,outputActions:`_outputActions_13b91_341`,miniActionBtn:`_miniActionBtn_13b91_347`,editorWrapper:`_editorWrapper_13b91_364`,consoleOutput:`_consoleOutput_13b91_369`,consoleLine:`_consoleLine_13b91_380`,fadeIn:`_fadeIn_13b91_1`,consolePrefix:`_consolePrefix_13b91_404`,consoleText:`_consoleText_13b91_411`,logLine:`_logLine_13b91_417`,warnLine:`_warnLine_13b91_421`,errorLine:`_errorLine_13b91_428`,infoLine:`_infoLine_13b91_435`,resultLine:`_resultLine_13b91_439`,emptyConsole:`_emptyConsole_13b91_444`,emptyIcon:`_emptyIcon_13b91_457`,emptyText:`_emptyText_13b91_463`,emptySub:`_emptySub_13b91_469`,statusBar:`_statusBar_13b91_475`,statusLeft:`_statusLeft_13b91_486`,statusText:`_statusText_13b91_492`,statusDot:`_statusDot_13b91_497`,statusDotRunning:`_statusDotRunning_13b91_505 _statusDot_13b91_497`,pulse:`_pulse_13b91_1`,statusDotError:`_statusDotError_13b91_511 _statusDot_13b91_497`,statusRight:`_statusRight_13b91_525`,executionTime:`_executionTime_13b91_531`,themeIndicator:`_themeIndicator_13b91_538`,snippetsSection:`_snippetsSection_13b91_543`,sectionHeader:`_sectionHeader_13b91_547`,snippetsTitle:`_snippetsTitle_13b91_556`,sectionHint:`_sectionHint_13b91_563`,snippetsGrid:`_snippetsGrid_13b91_568`,snippetCard:`_snippetCard_13b91_574`,snippetTop:`_snippetTop_13b91_594`,snippetName:`_snippetName_13b91_601`,snippetDesc:`_snippetDesc_13b91_608`,snippetFooter:`_snippetFooter_13b91_615`,categoryTag:`_categoryTag_13b91_623`,snippetRunHint:`_snippetRunHint_13b91_632`,snippetBadge:`_snippetBadge_13b91_641`,snippetBeginner:`_snippetBeginner_13b91_652 _snippetBadge_13b91_641`,snippetIntermediate:`_snippetIntermediate_13b91_658 _snippetBadge_13b91_641`,snippetAdvanced:`_snippetAdvanced_13b91_664 _snippetBadge_13b91_641`,snippetSenior:`_snippetSenior_13b91_670 _snippetBadge_13b91_641`,runButton:`_runButton_13b91_716`},f=i(),p=`// 🚀 Welcome to the Frontend Mastery Code Playground!
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
`,m=`<!-- 🌐 HTML & CSS Live Interactive Component Sandbox -->
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
<\/script>
`,h=[{id:`auto`,name:`Auto (Follow App)`},{id:`vs-dark`,name:`VS Dark`},{id:`light`,name:`VS Light`},{id:`one-dark`,name:`One Dark Pro`},{id:`dracula`,name:`Dracula`},{id:`github-dark`,name:`GitHub Dark`},{id:`monokai`,name:`Monokai`},{id:`night-owl`,name:`Night Owl`},{id:`hc-black`,name:`High Contrast Dark`}],g=[{name:`Holy Grail Layout (CSS Grid)`,description:`3-column responsive layout with sticky footer`,difficulty:`Intermediate`,category:`HTML & CSS`,language:`html`,code:`<div class="holy-grail">
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
`},{name:`CSS Shimmer Skeleton`,description:`Smooth 60fps GPU shimmer wave animation`,difficulty:`Beginner`,category:`HTML & CSS`,language:`html`,code:`<div class="card-skeleton">
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
`},{name:`Promise.all Polyfill`,description:`Implement Promise.all from scratch`,difficulty:`Intermediate`,category:`JavaScript`,language:`typescript`,code:`// Implement Promise.all polyfill
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
`},{name:`Debounce with Cancel`,description:`Create a debounce utility with cancel & immediate trigger`,difficulty:`Intermediate`,category:`JavaScript`,language:`typescript`,code:`// Implement debounce with cancel and immediate execution
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
`},{name:`Currying with Placeholders`,description:`Implement flexible curry function`,difficulty:`Advanced`,category:`JavaScript`,language:`typescript`,code:`// Implement function currying
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
`},{name:`Deep Clone with Circular Refs`,description:`Deep copy preserving Maps, Sets, and circular graphs`,difficulty:`Advanced`,category:`JavaScript`,language:`typescript`,code:`// Deep clone with circular reference & built-in type handling
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
`},{name:`Event Emitter`,description:`Full Pub/Sub with once, off, and wildcards`,difficulty:`Intermediate`,category:`JavaScript`,language:`typescript`,code:`// Implement EventEmitter
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
`}];function _(){let{theme:e}=a(),[t]=r(),[i,_]=(0,u.useState)(p),[v,y]=(0,u.useState)(`typescript`),[b,x]=(0,u.useState)(`console`),[S,C]=(0,u.useState)(()=>localStorage.getItem(`feeq-playground-theme`)||`auto`),[w,T]=(0,u.useState)([]),[E,D]=(0,u.useState)(!1),[O,k]=(0,u.useState)(null),[A,j]=(0,u.useState)(!1),[M,N]=(0,u.useState)(`Ready`),[P,F]=(0,u.useState)(!1),I=(0,u.useRef)(null),L=(0,u.useRef)(null),R=(0,u.useRef)(null),z=(0,u.useRef)(null),B=(0,u.useRef)(0),V=(0,u.useRef)(null);(0,u.useEffect)(()=>{let e=sessionStorage.getItem(`feeq-playground-mode`),n=sessionStorage.getItem(`feeq-playground-snippet`);if(n){sessionStorage.removeItem(`feeq-playground-snippet`),sessionStorage.removeItem(`feeq-playground-mode`),(e===`web`||n.includes(`<html`)||n.includes(`<div`)||n.includes(`<style`))&&(y(`html`),x(`preview`)),_(n),V.current=n,I.current&&I.current.setValue(n);return}let r=t.get(`problem`);if(r){let e=o(r);if(e){(e.category===`CSS`||e.category===`HTML & CSS`)&&(y(`html`),x(`preview`));let t=e.implementation.startsWith(`<!--`)?e.implementation:`// 🎯 ${e.title} (${e.difficulty})\n// ${e.problem}\n\n// Solution implementation:\n${e.implementation}\n\n// Try running tests:\nconsole.log('Testing solution for ${e.title}...');\n`;_(t),V.current=t,I.current&&I.current.setValue(t)}}},[t]);let H=e=>{C(e),localStorage.setItem(`feeq-playground-theme`,e)},U=e=>{let t=I.current?.getValue()??i;if(y(e),e===`html`){x(`preview`),!t.includes(`<div`)&&!t.includes(`<style`)&&!t.includes(`<html`)&&(_(m),I.current&&I.current.setValue(m));return}if(e===`javascript`){V.current=t;try{let e=l(t);_(e),I.current&&I.current.setValue(e)}catch(e){console.error(`Failed to convert TS to JS`,e)}}else e===`typescript`&&V.current&&(_(V.current),I.current&&I.current.setValue(V.current))},W=(e,t)=>{I.current=e,L.current=t,t.editor.defineTheme(`dracula`,{base:`vs-dark`,inherit:!0,rules:[{token:`comment`,foreground:`6272a4`,fontStyle:`italic`},{token:`keyword`,foreground:`ff79c6`,fontStyle:`bold`},{token:`string`,foreground:`f1fa8c`},{token:`number`,foreground:`bd93f9`},{token:`type`,foreground:`8be9fd`}],colors:{"editor.background":`#282a36`,"editor.foreground":`#f8f8f2`,"editorLineNumber.foreground":`#6272a4`}}),t.editor.defineTheme(`one-dark`,{base:`vs-dark`,inherit:!0,rules:[{token:`comment`,foreground:`5c6370`,fontStyle:`italic`},{token:`keyword`,foreground:`c678dd`},{token:`string`,foreground:`98c379`},{token:`number`,foreground:`d19a66`}],colors:{"editor.background":`#21252b`,"editor.foreground":`#abb2bf`}}),t.languages.typescript.javascriptDefaults.setDiagnosticsOptions({noSemanticValidation:!0,noSyntaxValidation:!1}),t.languages.typescript.typescriptDefaults.setDiagnosticsOptions({noSemanticValidation:!1,noSyntaxValidation:!1,noSuggestionDiagnostics:!1}),t.languages.typescript.typescriptDefaults.setCompilerOptions({target:t.languages.typescript.ScriptTarget.ES2022,allowNonTextFiles:!0,noLib:!1,alwaysStrict:!1,allowJs:!0})},G=S===`auto`?e===`dark`?`vs-dark`:`light`:S,K=(0,u.useCallback)(()=>{I.current&&I.current.getAction(`editor.action.formatDocument`)?.run()},[]),q=(0,u.useCallback)(e=>{let t=typeof e==`string`?e:I.current?.getValue()??i,n=++B.current;D(!0),j(!1),N(`Executing...`),k(null);let r=performance.now(),a=(e,...t)=>{if(B.current!==n)return;let r=t.map(c).join(` `),i={id:`${Date.now()}-${Math.random().toString(36).slice(2,7)}`,type:e,text:r,timestamp:Date.now()};T(e=>[...e,i])};if(v===`html`||t.includes(`<html`)||t.includes(`<div`)||t.includes(`<style`)){if(x(`preview`),z.current){let e=!t.includes(`<`)&&!t.includes(`</`),n=t;if(e){let e=Array.from(t.matchAll(/\.([a-zA-Z0-9_-]+)/g)).map(e=>e[1]).filter(e=>!!e),r=Array.from(new Set(e)).filter(e=>![`hover`,`focus`,`active`,`before`,`after`,`disabled`,`checked`].includes(e));n=`
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
              ${t}
            </style>
            <div class="demo-canvas">
              ${r.length>0?r.map(e=>`<div class="${e} demo-card-box"><strong>.${e}</strong><p style="margin:4px 0 0;font-size:12px;color:#6b6b6b">CSS styles applied</p></div>`).join(``):`<div class="card demo-card-box"><strong>CSS Live Preview</strong><p style="margin:4px 0 0;font-size:12px;color:#6b6b6b">Styles applied to canvas</p></div>`}
            </div>
          `}let r=`
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
              <\/script>
            </head>
            <body>${n}</body>
          </html>
        `;z.current.srcdoc=r}k(performance.now()-r),D(!1),N(`Preview Updated`);return}T([]);let o={log:(...e)=>a(`log`,...e),warn:(...e)=>a(`warn`,...e),error:(...e)=>a(`error`,...e),info:(...e)=>a(`info`,...e),clear:()=>T([]),table:(...e)=>a(`log`,...e)},s=(e,t,...r)=>window.setTimeout(()=>{if(B.current===n&&typeof e==`function`)try{e(...r)}catch(e){a(`error`,`Async Error: ${e?.message||String(e)}`)}},t),u=(e,t,...r)=>window.setInterval(()=>{if(B.current===n&&typeof e==`function`)try{e(...r)}catch(e){a(`error`,`Interval Error: ${e?.message||String(e)}`)}},t),d=l(t);try{let e=Function(`console`,`setTimeout`,`setInterval`,`clearTimeout`,`clearInterval`,`Promise`,`
        return (async () => {
          ${d}
        })();
        `)(o,s,u,window.clearTimeout.bind(window),window.clearInterval.bind(window),Promise);e&&typeof e.then==`function`?e.then(e=>{B.current===n&&(k(performance.now()-r),D(!1),N(`Success`),e!==void 0&&a(`result`,e))}).catch(e=>{B.current===n&&(a(`error`,`Runtime Error: ${e instanceof Error?e.message:String(e)}`),j(!0),D(!1),N(`Error`),k(performance.now()-r))}):(k(performance.now()-r),D(!1),N(`Success`))}catch(e){a(`error`,`Syntax / Execution Error: ${e instanceof Error?e.message:String(e)}`),j(!0),D(!1),N(`Error`),k(performance.now()-r)}},[i,v]);(0,u.useEffect)(()=>{let e=e=>{if(e.data&&e.data.type===`feeq-log`){let{logType:t,args:n}=e.data,r=n.map(e=>c(e)).join(` `);T(e=>[...e,{id:`${Date.now()}-${Math.random().toString(36).slice(2,7)}`,type:t,text:r,timestamp:Date.now()}])}};return window.addEventListener(`message`,e),()=>window.removeEventListener(`message`,e)},[]),(0,u.useEffect)(()=>{let e=e=>{(e.ctrlKey||e.metaKey)&&e.key===`Enter`&&(e.preventDefault(),q()),e.altKey&&e.shiftKey&&(e.key===`F`||e.key===`f`)&&(e.preventDefault(),K()),e.key===`Escape`&&P&&F(!1)};return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[q,K,P]);let J=(0,u.useCallback)(()=>{T([]),k(null),j(!1),N(`Cleared`)},[]),Y=(0,u.useCallback)(()=>{let e=v===`html`?m:p;_(e),I.current&&I.current.setValue(e),T([]),k(null),j(!1),N(`Reset`)},[v]),X=(0,u.useCallback)(e=>{y(e.language),_(e.code),V.current=e.code,I.current&&I.current.setValue(e.code),e.language===`html`&&x(`preview`),q(e.code)},[q]),Z=(0,u.useCallback)(e=>{e.category===`CSS`||e.category===`HTML & CSS`?(y(`html`),x(`preview`)):(y(`typescript`),x(`console`));let t=e.implementation.startsWith(`<!--`)?e.implementation:`// 🎯 ${e.title} (${e.difficulty})\n// ${e.problem}\n\n// Solution implementation:\n${e.implementation}\n\n// Test invocation:\nconsole.log('Testing solution for ${e.title}...');\n`;_(t),V.current=t,I.current&&I.current.setValue(t),q(t)},[q]),Q=e=>{switch(e){case`Beginner`:return d.snippetBeginner;case`Intermediate`:return d.snippetIntermediate;case`Advanced`:return d.snippetAdvanced;case`Senior`:return d.snippetSenior;default:return d.snippetBadge}},$=(0,u.useCallback)(()=>{let e=w.map(e=>`${e.type.toUpperCase()}: ${e.text}`).join(`
`);navigator.clipboard.writeText(e)},[w]);return(0,f.jsxs)(`div`,{className:d.page,children:[(0,f.jsxs)(`div`,{className:d.header,children:[(0,f.jsxs)(`h1`,{className:d.title,children:[(0,f.jsx)(`span`,{children:`🛠️`}),` Code Playground & Live Component Sandbox`]}),(0,f.jsx)(`p`,{className:d.subtitle,children:`Interactive JavaScript, TypeScript, HTML & Modern CSS sandbox with live iframe component previews, streaming console logs, and real-world interview challenges.`})]}),(0,f.jsxs)(`div`,{className:`${d.playgroundContainer} ${P?d.fullscreenContainer:``}`,children:[(0,f.jsxs)(`div`,{className:d.toolbar,children:[(0,f.jsxs)(`div`,{className:d.toolbarGroup,children:[(0,f.jsx)(`label`,{className:d.toolbarLabel,htmlFor:`lang-select`,children:`Mode / Language:`}),(0,f.jsxs)(`select`,{id:`lang-select`,className:d.select,value:v,onChange:e=>U(e.target.value),"aria-label":`Language`,children:[(0,f.jsx)(`option`,{value:`typescript`,children:`TypeScript`}),(0,f.jsx)(`option`,{value:`javascript`,children:`JavaScript`}),(0,f.jsx)(`option`,{value:`html`,children:`🌐 HTML & CSS (Web Component Preview)`})]})]}),(0,f.jsx)(`div`,{className:d.toolbarSeparator}),(0,f.jsxs)(`div`,{className:d.toolbarGroup,children:[(0,f.jsx)(`label`,{className:d.toolbarLabel,htmlFor:`theme-select`,children:`🎨 Theme:`}),(0,f.jsx)(`select`,{id:`theme-select`,className:d.select,value:S,onChange:e=>H(e.target.value),"aria-label":`Editor Theme`,children:h.map(e=>(0,f.jsx)(`option`,{value:e.id,children:e.name},e.id))})]}),(0,f.jsx)(`div`,{className:d.toolbarSeparator}),(0,f.jsx)(`button`,{className:E?d.runBtnRunning:d.runBtn,onClick:()=>q(),disabled:E,"aria-label":`Run code`,title:`Run code (⌘+Enter / Ctrl+Enter)`,children:E?`⏳ Running...`:v===`html`?`▶ Run & Preview`:`▶ Run`}),(0,f.jsx)(`button`,{className:d.formatBtn,onClick:K,"aria-label":`Auto Format Code`,title:`Auto Format (Shift+Alt+F)`,children:`✨ Format`}),(0,f.jsx)(`button`,{className:d.fullscreenBtn,onClick:()=>F(e=>!e),"aria-label":P?`Exit Fullscreen`:`Open Fullscreen`,title:P?`Exit Fullscreen (Esc)`:`Open Fullscreen`,children:P?`🗗 Exit`:`⛶ Fullscreen`}),(0,f.jsx)(`button`,{className:d.toolbarBtn,onClick:J,"aria-label":`Clear output`,children:`🧹 Clear`}),(0,f.jsx)(`button`,{className:d.toolbarBtn,onClick:Y,"aria-label":`Reset code`,children:`↺ Reset`}),(0,f.jsx)(`div`,{className:d.toolbarSpacer}),(0,f.jsxs)(`div`,{className:d.shortcutHint,children:[(0,f.jsx)(`span`,{children:`⌘+Enter to run`}),(0,f.jsx)(`span`,{children:`•`}),(0,f.jsx)(`span`,{children:`⌥⇧F to format`})]})]}),(0,f.jsxs)(`div`,{className:d.editorArea,children:[(0,f.jsxs)(`div`,{className:d.editorPane,children:[(0,f.jsxs)(`div`,{className:d.paneHeader,children:[(0,f.jsxs)(`div`,{className:d.paneTitle,children:[(0,f.jsx)(`span`,{children:`📝 Editor`}),(0,f.jsx)(`span`,{className:d.langBadge,children:v.toUpperCase()})]}),(0,f.jsxs)(`div`,{className:d.editorHeaderActions,children:[(0,f.jsx)(`button`,{className:d.miniActionBtn,onClick:K,title:`Format Code`,children:`✨ Format`}),(0,f.jsx)(`button`,{className:d.miniActionBtn,onClick:()=>F(e=>!e),title:P?`Exit Fullscreen`:`Fullscreen`,children:P?`🗗`:`⛶`})]})]}),(0,f.jsx)(`div`,{className:d.editorWrapper,children:(0,f.jsx)(n,{height:`100%`,language:v===`html`?`html`:v,value:i,theme:G,onMount:W,onChange:e=>_(e||``),options:{minimap:{enabled:!1},fontSize:14,fontFamily:`var(--font-mono, "JetBrains Mono", monospace)`,lineNumbers:`on`,scrollBeyondLastLine:!1,wordWrap:`on`,tabSize:2,automaticLayout:!0,padding:{top:14,bottom:14}}})})]}),(0,f.jsxs)(`div`,{className:d.outputPane,children:[(0,f.jsxs)(`div`,{className:d.paneHeader,children:[(0,f.jsxs)(`div`,{className:d.tabButtons,children:[v===`html`&&(0,f.jsx)(`button`,{className:`${d.tabBtn} ${b===`preview`?d.activeTabBtn:``}`,onClick:()=>x(`preview`),children:`🌐 Live Web Preview`}),(0,f.jsxs)(`button`,{className:`${d.tabBtn} ${b===`console`?d.activeTabBtn:``}`,onClick:()=>x(`console`),children:[`📟 Console (`,w.length,`)`]})]}),b===`console`&&w.length>0&&(0,f.jsxs)(`div`,{className:d.outputActions,children:[(0,f.jsx)(`button`,{className:d.miniActionBtn,onClick:$,title:`Copy Output`,children:`📋 Copy`}),(0,f.jsx)(`button`,{className:d.miniActionBtn,onClick:J,title:`Clear Console`,children:`✕ Clear`})]})]}),b===`preview`?(0,f.jsx)(`div`,{className:d.previewPane,children:(0,f.jsx)(`iframe`,{ref:z,title:`Live Web Preview`,className:d.liveIframe,sandbox:`allow-scripts allow-modals allow-forms allow-popups`})}):(0,f.jsx)(`div`,{className:d.consoleOutput,ref:R,children:w.length===0?(0,f.jsxs)(`div`,{className:d.emptyConsole,children:[(0,f.jsx)(`span`,{className:d.emptyIcon,children:`💡`}),(0,f.jsxs)(`p`,{className:d.emptyText,children:[`Click `,(0,f.jsx)(`strong`,{children:`"▶ Run"`}),` or press`,` `,(0,f.jsx)(`strong`,{children:`⌘+Enter`}),` to execute`]}),(0,f.jsx)(`span`,{className:d.emptySub,children:`Outputs, return values, errors, and async logs stream here`})]}):w.map(e=>(0,f.jsxs)(`div`,{className:`${d.consoleLine} ${e.type===`error`?d.errorLine:e.type===`warn`?d.warnLine:e.type===`info`?d.infoLine:e.type===`result`?d.resultLine:d.logLine}`,children:[(0,f.jsx)(`span`,{className:d.consolePrefix,children:e.type===`error`?`✗`:e.type===`warn`?`⚠`:e.type===`info`?`ℹ`:e.type===`result`?`→`:`›`}),(0,f.jsx)(`span`,{className:d.consoleText,children:e.text})]},e.id))})]})]}),(0,f.jsxs)(`div`,{className:d.statusBar,children:[(0,f.jsxs)(`div`,{className:d.statusLeft,children:[(0,f.jsx)(`span`,{className:A?d.statusDotError:E?d.statusDotRunning:d.statusDot}),(0,f.jsx)(`span`,{className:d.statusText,children:M})]}),(0,f.jsxs)(`div`,{className:d.statusRight,children:[O!==null&&(0,f.jsxs)(`span`,{className:d.executionTime,children:[`⏱ `,O.toFixed(2),`ms`]}),(0,f.jsxs)(`span`,{className:d.themeIndicator,children:[`Theme: `,h.find(e=>e.id===S)?.name]})]})]})]}),(0,f.jsxs)(`div`,{className:d.snippetsSection,children:[(0,f.jsxs)(`div`,{className:d.sectionHeader,children:[(0,f.jsx)(`h2`,{className:d.snippetsTitle,children:`📚 Practice Snippets (HTML, CSS & JS)`}),(0,f.jsx)(`span`,{className:d.sectionHint,children:`One-click loads code into editor and executes`})]}),(0,f.jsx)(`div`,{className:d.snippetsGrid,children:g.map(e=>(0,f.jsxs)(`button`,{className:d.snippetCard,onClick:()=>X(e),children:[(0,f.jsxs)(`div`,{className:d.snippetTop,children:[(0,f.jsx)(`p`,{className:d.snippetName,children:e.name}),(0,f.jsx)(`span`,{className:Q(e.difficulty),children:e.difficulty})]}),(0,f.jsx)(`p`,{className:d.snippetDesc,children:e.description}),(0,f.jsxs)(`div`,{className:d.snippetFooter,children:[(0,f.jsx)(`span`,{className:d.categoryTag,children:e.category}),(0,f.jsx)(`span`,{className:d.snippetRunHint,children:`▶ Click to load & run`})]})]},e.name))})]}),s.length>0&&(0,f.jsxs)(`div`,{className:d.snippetsSection,children:[(0,f.jsxs)(`div`,{className:d.sectionHeader,children:[(0,f.jsxs)(`h2`,{className:d.snippetsTitle,children:[`🧩 Coding Challenge Implementations (`,s.length,`)`]}),(0,f.jsx)(`span`,{className:d.sectionHint,children:`Load algorithm & CSS layout solutions directly into sandbox`})]}),(0,f.jsx)(`div`,{className:d.snippetsGrid,children:s.slice(0,16).map(e=>(0,f.jsxs)(`button`,{className:d.snippetCard,onClick:()=>Z(e),children:[(0,f.jsxs)(`div`,{className:d.snippetTop,children:[(0,f.jsx)(`p`,{className:d.snippetName,children:e.title}),(0,f.jsx)(`span`,{className:Q(e.difficulty),children:e.difficulty})]}),(0,f.jsxs)(`p`,{className:d.snippetDesc,children:[e.problem.slice(0,90),`…`]}),(0,f.jsxs)(`div`,{className:d.snippetFooter,children:[(0,f.jsx)(`span`,{className:d.categoryTag,children:e.category}),(0,f.jsx)(`span`,{className:d.snippetRunHint,children:`▶ Click to test in editor`})]})]},e.id))})]})]})}export{_ as default};