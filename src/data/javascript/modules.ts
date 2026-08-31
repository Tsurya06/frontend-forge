import type { Topic } from '../../types';

export const modulesTopics: Topic[] = [
  {
    id: 'js-modules',
    title: 'JavaScript Modules',
    description:
      'ES modules, CommonJS, import/export syntax, dynamic imports, module resolution, tree shaking, and interoperability between module systems.',
    category: 'JavaScript',
    difficulty: 'Intermediate',
    tags: [
      'modules',
      'ES modules',
      'CommonJS',
      'import',
      'export',
      'dynamic imports',
      'tree shaking',
      'require',
      'module resolution',
    ],
    overview:
      'JavaScript modules are a mechanism for splitting code into reusable, self-contained units that expose explicit interfaces. The two dominant module systems are ES Modules (ESM), which are part of the ECMAScript specification and use import/export syntax, and CommonJS (CJS), which originated in Node.js and uses require/module.exports. Understanding how these systems work, their differences, and how they interoperate is essential for modern JavaScript development. Topics like dynamic imports enable code splitting and lazy loading, while tree shaking leverages the static structure of ESM to eliminate dead code during bundling.',
    concepts: [
      'ES Module syntax (import / export)',
      'Named exports vs default exports',
      'Dynamic import() expressions',
      'CommonJS require() and module.exports',
      'ESM vs CJS key differences',
      'Module resolution algorithms (Node, bundlers)',
      'Tree shaking and dead-code elimination',
      'Circular dependencies',
      'Module scope and encapsulation',
      'Interoperability between ESM and CJS',
    ],
    relatedTopicIds: [
      'js-closures',
      'js-async',
      'js-bundlers',
      'js-performance',
    ],
    questions: [
      {
        id: 'js-modules-1',
        question: 'What are ES modules? How do import/export work?',
        answer:
          'ES Modules (ESM) are the official, standardized module system introduced in ECMAScript 2015 (ES6). They allow developers to split JavaScript code into independent files that explicitly declare their dependencies and public API through `import` and `export` statements. Unlike earlier ad-hoc patterns such as the Revealing Module Pattern or IIFEs, ES modules are a language-level feature understood natively by browsers and JavaScript runtimes.\n\nThe `export` keyword makes bindings available to other modules. You can export at the declaration site — for example, `export function add(a, b) { return a + b; }` — or group exports at the bottom of a file with `export { add, subtract };`. A file may also have a single `export default` expression, which provides a convenient shorthand for the primary value a module exposes.\n\nThe `import` keyword brings those bindings into the consuming module. Named imports use destructuring-like syntax: `import { add, subtract } from "./math.js";`. Default imports can use any local name: `import myMath from "./math.js";`. You can also combine both: `import myMath, { add } from "./math.js";`. Namespace imports gather everything into one object: `import * as math from "./math.js";`.\n\nA critical property of ESM is that imports and exports are statically analyzable. The module specifiers must be string literals (not variables), and import/export statements must appear at the top level — they cannot be nested inside conditionals or functions. This static structure enables bundlers to perform tree shaking, eliminating exports that are never imported anywhere, and it allows engines to resolve the dependency graph before execution begins.\n\nES modules also create live bindings rather than value copies. When module A exports a variable and later mutates it, module B — which imported that variable — sees the updated value. This contrasts sharply with CommonJS, where `require` returns a snapshot copy. ES modules run in strict mode automatically, have their own scope (no global pollution), and support top-level `await` in modern environments.',
        shortAnswer:
          'ES Modules are the standard JavaScript module system using `import` and `export` statements. They are statically analyzable, support named and default exports, create live bindings, and run in strict mode automatically.',
        code: '// math.js — named exports\nexport function add(a, b) {\n  return a + b;\n}\n\nexport function subtract(a, b) {\n  return a - b;\n}\n\n// logger.js — default export\nexport default function log(message) {\n  console.log(`[LOG]: ${message}`);\n}\n\n// app.js — importing\nimport log, { add, subtract } from \'./math.js\';\nimport * as math from \'./math.js\';\n\nconsole.log(add(2, 3));        // 5\nconsole.log(math.subtract(5, 2)); // 3',
        language: 'javascript',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-modules',
        tags: ['ES modules', 'import', 'export', 'ESM'],
        commonMistakes: [
          'Trying to use import/export inside a function or conditional block — they must be top-level statements.',
          'Forgetting to add type="module" in the script tag when running ESM directly in the browser.',
          'Confusing namespace imports (import * as X) with default imports — they are different bindings.',
        ],
        followUps: [
          'How do live bindings work in ES modules compared to CommonJS value copies?',
          'What happens if you have circular dependencies between ES modules?',
          'How does top-level await change module evaluation order?',
        ],
        interviewTips: [
          'Emphasize that ESM is statically analyzable, which enables tree shaking — this shows you understand the practical impact, not just syntax.',
          'Mention live bindings vs. value copies as a key distinction from CommonJS to demonstrate deeper knowledge.',
        ],
      },
      {
        id: 'js-modules-2',
        question:
          'What is the difference between named exports and default exports?',
        answer:
          'Named exports and default exports are the two ways ES modules expose values, and they differ in syntax, semantics, and intended usage. Understanding these differences is important for writing clean, maintainable module APIs.\n\nNamed exports are created by prefixing declarations with `export` or by using an export list: `export { foo, bar };`. A module can have as many named exports as it wants. When importing, consumers must use the exact exported name inside curly braces — `import { foo } from "./mod.js"` — or rename with `as`: `import { foo as myFoo } from "./mod.js"`. Because the names must match, tooling can provide auto-complete, refactoring support, and compile-time error checks when a name is misspelled.\n\nA default export is declared with `export default`. Each module may have at most one default export. The consumer imports it without curly braces and can give it any local name: `import whatever from "./mod.js"`. Under the hood, the default export is stored under the special name `default`, so `import whatever from "./mod.js"` is roughly equivalent to `import { default as whatever } from "./mod.js"`.\n\nThe practical trade-off centers on discoverability versus convenience. Named exports are more explicit — you know the exact interface a module provides, and IDEs can auto-import them precisely. Default exports are slightly more concise for modules that expose a single primary value (a class, a React component, a function), but they sacrifice discoverability: the consuming code can name the import anything, which can lead to inconsistent naming across a codebase. For instance, one file may `import Button from "./Button"` while another writes `import Btn from "./Button"`, making grep-style searches harder.\n\nMost modern style guides (including the Airbnb guide and many TypeScript projects) prefer named exports because they play better with tree shaking, refactoring tools, and explicit APIs. Default exports remain common in React codebases (one component per file) and library entry points. You can mix both in a single module, though overuse of this pattern can be confusing.',
        shortAnswer:
          'Named exports use `export { name }` and require the consumer to import by exact name with curly braces. Default exports use `export default`, allow any import name, and are limited to one per module. Named exports are generally preferred for discoverability and tooling support.',
        code: '// --- Named exports ---\n// utils.js\nexport const PI = 3.14159;\nexport function double(x) {\n  return x * 2;\n}\n\n// consumer.js\nimport { PI, double } from \'./utils.js\';\nimport { PI as myPI } from \'./utils.js\'; // renaming\n\n// --- Default export ---\n// Button.js\nexport default function Button({ label }) {\n  return `<button>${label}</button>`;\n}\n\n// consumer.js\nimport Button from \'./Button.js\';   // any name works\nimport Btn from \'./Button.js\';      // also valid\n\n// --- Mixing both ---\n// api.js\nexport default class ApiClient { /* ... */ }\nexport function createHeaders() { /* ... */ }\n\nimport ApiClient, { createHeaders } from \'./api.js\';',
        language: 'javascript',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-modules',
        tags: ['named exports', 'default exports', 'import', 'export'],
        commonMistakes: [
          'Using curly braces when importing a default export — `import { Button }` actually imports a named export called Button, not the default.',
          'Exporting multiple default exports from one module — only one is allowed and the second will cause a syntax error.',
          'Assuming renaming a named export at the import site also renames it elsewhere — the rename is local only.',
        ],
        followUps: [
          'Why do some style guides discourage default exports?',
          'How does re-exporting work with named vs default exports?',
          'Can a module have both a default and named exports with the same conceptual value?',
        ],
        interviewTips: [
          'Mention that default exports are syntactic sugar over a special named export called "default" — it shows you understand the spec rather than just the syntax.',
        ],
      },
      {
        id: 'js-modules-3',
        question:
          'How do dynamic imports work? When would you use them?',
        answer:
          'Dynamic imports use the `import()` expression (note the function-call syntax, not the declaration keyword) to load modules at runtime. Unlike static `import` declarations, `import()` can appear anywhere in your code — inside functions, conditionals, event handlers, or loops — and it returns a Promise that resolves to the module\'s namespace object.\n\nThe primary motivation for dynamic imports is code splitting. In a large application, shipping all JavaScript in a single bundle forces users to download code they may never need. By replacing static imports with `import()` at strategic boundaries — route components, modals, admin panels, feature flags — bundlers like Webpack, Rollup, and Vite automatically split the output into smaller chunks that are loaded on demand. This dramatically improves initial page load time and reduces time-to-interactive.\n\nDynamic imports are also essential for conditional loading. Suppose a feature depends on a heavy charting library, but only 10 % of users visit the analytics page. With `import("chart-lib")` guarded behind a route or button click, the 90 % who never visit that page never download that code. Similarly, polyfills can be loaded conditionally: `if (!window.IntersectionObserver) { await import("intersection-observer"); }`. This pattern keeps the baseline bundle lean while still supporting older environments.\n\nBecause `import()` returns a Promise, it integrates naturally with async/await: `const { render } = await import("./renderer.js");`. For default exports, you destructure the `default` property: `const { default: Chart } = await import("./Chart.js");`. Error handling follows normal Promise patterns — wrap in try/catch or chain `.catch()` — which is important for graceful degradation when a chunk fails to load over a flaky network.\n\nFrameworks like React provide abstractions on top of dynamic imports. `React.lazy()` accepts a function that returns an `import()` call and yields a component you can render inside a `<Suspense>` boundary. Next.js uses `next/dynamic` for the same purpose. Under the hood, they all rely on the `import()` expression and the bundler\'s ability to recognize it as a split point.',
        shortAnswer:
          'Dynamic imports use `import()` to load modules at runtime, returning a Promise. They enable code splitting, conditional loading, and lazy loading of routes or heavy libraries, reducing initial bundle size and improving performance.',
        code: '// Basic dynamic import\nasync function loadEditor() {\n  const { Editor } = await import(\'./Editor.js\');\n  return new Editor();\n}\n\n// Conditional loading\nasync function initAnalytics() {\n  if (document.querySelector(\'#analytics\')) {\n    const { default: Chart } = await import(\'chart.js\');\n    const chart = new Chart(/* config */);\n  }\n}\n\n// React.lazy with Suspense\nimport { lazy, Suspense } from \'react\';\n\nconst Dashboard = lazy(() => import(\'./Dashboard\'));\n\nfunction App() {\n  return (\n    <Suspense fallback={<div>Loading...</div>}>\n      <Dashboard />\n    </Suspense>\n  );\n}\n\n// Error handling\nasync function safeLoad(modulePath) {\n  try {\n    return await import(modulePath);\n  } catch (err) {\n    console.error(`Failed to load module: ${modulePath}`, err);\n    return null;\n  }\n}',
        language: 'javascript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-modules',
        tags: ['dynamic imports', 'code splitting', 'lazy loading', 'import()'],
        commonMistakes: [
          'Forgetting that import() returns a Promise and trying to use the module synchronously without await.',
          'Using a fully dynamic string variable as the specifier — bundlers cannot statically analyze it, so no chunk is created. Use partial paths like import(`./locales/${lang}.js`).',
          'Not handling the error case — if the network request for a chunk fails, the Promise rejects and can crash the app without a catch handler.',
        ],
        followUps: [
          'How does Webpack magic comments (webpackChunkName, webpackPrefetch) work with dynamic imports?',
          'What is the difference between React.lazy and next/dynamic?',
          'How can you prefetch or preload dynamic chunks before the user needs them?',
        ],
        interviewTips: [
          'Tie dynamic imports back to user experience — mention metrics like Time-to-Interactive and First Contentful Paint to show you understand the real-world impact.',
          'If interviewing for a React role, mention React.lazy and Suspense as the idiomatic wrapper around import().',
        ],
      },
      {
        id: 'js-modules-4',
        question:
          'Explain CommonJS modules (require/module.exports).',
        answer:
          'CommonJS (CJS) is the module system that Node.js adopted from its earliest versions. Before ES modules existed, CommonJS was the de facto standard for server-side JavaScript and was widely used in build-tool ecosystems. It uses `require()` to load dependencies and `module.exports` (or the shorthand `exports`) to expose a module\'s public interface.\n\nWhen you call `require("./math")`, Node.js synchronously reads and executes the target file, wraps its contents in a function that provides `module`, `exports`, `require`, `__dirname`, and `__filename` as local variables, and then caches the result. On subsequent `require` calls for the same path, the cached `module.exports` object is returned without re-executing the file. This caching behavior means modules are effectively singletons within a process.\n\nExporting values is done by assigning to `module.exports`. You can export an object with multiple properties — `module.exports = { add, subtract };` — or a single function/class: `module.exports = function add(a, b) { return a + b; };`. The `exports` variable is initially a reference to `module.exports`, so `exports.add = add;` works for adding properties, but reassigning `exports = something` breaks the reference and the new value is not actually exported. This is a common source of bugs.\n\nBecause `require` is a regular function, it can be called anywhere — inside conditionals, loops, or other functions. This flexibility means CJS modules are evaluated eagerly and synchronously at the point of the `require` call, which works well for file-system-based loading in Node.js but makes static analysis difficult. Bundlers and tools cannot reliably determine which modules are used just by reading the source, which limits tree-shaking opportunities.\n\nDespite the rise of ES modules, CommonJS remains extremely prevalent. Thousands of npm packages still publish only CJS, Node.js still supports it natively, and many build tools and test runners use it internally. Understanding CJS is essential for working with existing Node.js codebases, configuring tools like Jest (which defaults to CJS), and debugging interoperability issues when mixing CJS and ESM.',
        shortAnswer:
          'CommonJS is Node.js\'s original module system. It uses `require()` to synchronously load modules and `module.exports` to expose values. Modules are cached after first load, making them singletons. It remains widely used in Node.js and npm packages.',
        code: '// math.js — exporting with module.exports\nfunction add(a, b) {\n  return a + b;\n}\n\nfunction subtract(a, b) {\n  return a - b;\n}\n\nmodule.exports = { add, subtract };\n\n// logger.js — exporting a single function\nmodule.exports = function log(msg) {\n  console.log(`[LOG] ${msg}`);\n};\n\n// app.js — requiring modules\nconst { add, subtract } = require(\'./math\');\nconst log = require(\'./logger\');\n\nlog(add(2, 3)); // [LOG] 5\n\n// Conditional require (valid in CJS, not in ESM)\nif (process.env.NODE_ENV === \'development\') {\n  const debug = require(\'./debug-tools\');\n  debug.init();\n}\n\n// CAUTION: exports shorthand pitfall\nexports.foo = \'works\';          // ✅ adds to module.exports\nexports = { bar: \'broken\' };    // ❌ breaks the reference',
        language: 'javascript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-modules',
        tags: ['CommonJS', 'require', 'module.exports', 'Node.js'],
        commonMistakes: [
          'Reassigning `exports` directly instead of `module.exports` — this severs the reference and the new value is silently ignored.',
          'Assuming require() is asynchronous — it is synchronous and blocks execution until the file is fully loaded and evaluated.',
          'Not realizing that require caches modules, so mutating a returned object in one file affects all other files that require the same module.',
        ],
        followUps: [
          'How does the module caching mechanism work and how can you bust the cache?',
          'What happens with circular dependencies in CommonJS?',
          'Why can\'t bundlers tree-shake CommonJS modules as effectively as ES modules?',
        ],
        interviewTips: [
          'Highlight the exports vs module.exports pitfall — it\'s a classic interview trick question and shows you\'ve worked with CJS in practice.',
        ],
      },
      {
        id: 'js-modules-5',
        question:
          'What are the key differences between ES modules and CommonJS?',
        answer:
          'ES Modules (ESM) and CommonJS (CJS) are fundamentally different module systems with distinct execution models, syntax, and capabilities. These differences have significant practical implications for bundling, tree shaking, and cross-environment compatibility.\n\nThe most visible difference is syntax: ESM uses `import`/`export` declarations while CJS uses `require()`/`module.exports`. But the deeper difference is timing. ESM has a multi-phase lifecycle: first the engine parses import/export declarations to build a dependency graph (without executing code), then it fetches and links all modules, and finally it evaluates them. CJS is much simpler — `require()` synchronously loads and executes the file on the spot, returning the exports object immediately. This means CJS module resolution happens at runtime while ESM resolution happens before execution.\n\nThis static structure of ESM is what enables tree shaking. Because the engine (and bundlers) can see every import and export at parse time without running the code, they can determine which exports are never imported anywhere and eliminate them from the final bundle. CJS, being dynamic, does not offer this guarantee — `require` can be called with computed strings or inside conditionals, so a bundler cannot safely remove unused code.\n\nAnother critical difference is binding semantics. ESM creates live bindings: if module A exports `let count = 0` and later increments it, module B, which imported `count`, will see the updated value. CJS creates value copies: when you `require` a module, you get a snapshot of `module.exports` at that moment. Subsequent mutations to the original variable inside the exporting module are not reflected in the consumer.\n\nESM always runs in strict mode; CJS does not. ESM files have their own scope; CJS files are wrapped in a function but can leak globals if not careful. ESM supports top-level `await`; CJS does not. ESM uses URL-based resolution (important for browsers); CJS uses file-path-based resolution with the `node_modules` lookup algorithm. Finally, ESM is the standard endorsed by the ECMAScript specification and increasingly by Node.js, while CJS is Node-specific and considered legacy for new projects, though it remains deeply entrenched in the ecosystem.',
        shortAnswer:
          'ESM uses import/export with static analysis enabling tree shaking; CJS uses require/module.exports evaluated dynamically at runtime. ESM creates live bindings while CJS copies values. ESM is strict mode by default and supports top-level await. ESM is the standard; CJS is Node-specific legacy.',
        code: '// === ES Modules ===\n// Static — must be top-level, string literal specifiers\nimport { readFile } from \'fs/promises\';  // parsed before execution\nexport const version = \'1.0.0\';\n\n// Live binding demonstration\n// counter.mjs\nexport let count = 0;\nexport function increment() { count++; }\n\n// consumer.mjs\nimport { count, increment } from \'./counter.mjs\';\nconsole.log(count); // 0\nincrement();\nconsole.log(count); // 1  (live binding — sees the update)\n\n// === CommonJS ===\n// Dynamic — can appear anywhere, computed specifiers\nconst fs = require(\'fs\');  // executed at this line\nmodule.exports = { version: \'1.0.0\' };\n\n// Value copy demonstration\n// counter.cjs\nlet count = 0;\nmodule.exports = { count, increment() { count++; } };\n\n// consumer.cjs\nconst counter = require(\'./counter.cjs\');\nconsole.log(counter.count); // 0\ncounter.increment();\nconsole.log(counter.count); // 0  (value copy — does NOT update)\n\n// === Key comparison ===\n// ESM: top-level await is allowed\nconst data = await fetch(\'/api/config\').then(r => r.json());\n\n// CJS: top-level await is a syntax error\n// const data = await fetch(\'/api\'); // ❌ SyntaxError',
        language: 'javascript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-modules',
        tags: ['ES modules', 'CommonJS', 'comparison', 'live bindings', 'tree shaking'],
        commonMistakes: [
          'Assuming require() works inside ES modules — in Node.js ESM, require is not defined; you must use import or createRequire().',
          'Thinking tree shaking works equally well with CJS — it does not, because CJS is dynamically evaluated and not statically analyzable.',
          'Mixing .mjs and .cjs files without understanding how Node.js resolves the module type (file extension or package.json "type" field).',
        ],
        followUps: [
          'How does Node.js determine whether a file is ESM or CJS?',
          'What is createRequire() and when would you use it?',
          'How do circular dependencies behave differently in ESM vs CJS?',
        ],
        interviewTips: [
          'Structure your answer around three pillars — syntax, binding semantics, and static vs. dynamic analysis — to show organized thinking.',
          'The live binding vs. value copy distinction is often the differentiator between a surface-level and a deep answer.',
        ],
      },
      {
        id: 'js-modules-6',
        question: 'How does module resolution work?',
        answer:
          'Module resolution is the algorithm a runtime or bundler uses to translate a module specifier (the string in `import "foo"` or `require("foo")`) into an actual file path. The rules differ between Node.js CJS, Node.js ESM, and bundlers like Webpack or Vite, but the core concepts overlap.\n\nIn Node.js CommonJS resolution, specifiers fall into three categories. Bare specifiers like `require("lodash")` trigger the `node_modules` lookup: Node starts from the directory of the requiring file, looks for `node_modules/lodash`, and if not found, walks up the directory tree until it reaches the filesystem root. Relative specifiers like `require("./utils")` resolve against the current file\'s directory, and Node tries appending `.js`, `.json`, and `.node` extensions in order, then checks for a directory with an `index.js`. Core modules like `require("fs")` are resolved from Node\'s built-in module cache and always take priority.\n\nNode.js ESM resolution is stricter. It requires explicit file extensions — `import "./utils.js"` works but `import "./utils"` does not (without additional configuration). This is because ESM was designed with URL-based resolution in mind, matching browser behavior where the server must know the exact resource to fetch. The `node_modules` lookup still works for bare specifiers, but Node consults the `exports` field in the dependency\'s `package.json` first, which lets library authors define entry points, conditional exports (different files for `import` vs. `require`), and subpath patterns.\n\nBundlers add their own resolution enhancements. Webpack supports `resolve.alias` to remap specifiers, `resolve.extensions` to try additional suffixes like `.ts` or `.tsx`, and `resolve.modules` to specify custom lookup directories. TypeScript uses `paths` and `baseUrl` in `tsconfig.json` for similar path aliasing. Vite uses `resolve.alias` and relies on the `exports` field in `package.json`. These tools essentially extend the base Node.js algorithm with project-specific rules, which is why a module that resolves correctly under one tool may fail under another.\n\nUnderstanding resolution is crucial for debugging "module not found" errors, configuring monorepo setups, and optimizing bundle output. Misconfigured resolution can lead to duplicate copies of the same library in a bundle, version conflicts, or runtime crashes.',
        shortAnswer:
          'Module resolution translates a specifier string into a file path. Node.js CJS walks up node_modules directories and tries extensions automatically. Node.js ESM requires explicit extensions and consults the package.json "exports" field. Bundlers extend these algorithms with aliases, custom extensions, and path mapping.',
        code: '// Node.js CJS resolution examples\nconst fs = require(\'fs\');            // built-in module (highest priority)\nconst lodash = require(\'lodash\');    // bare specifier → node_modules lookup\nconst utils = require(\'./utils\');    // relative → ./utils.js, ./utils/index.js\n\n// Node.js ESM — explicit extensions required\nimport { readFile } from \'fs/promises\';    // built-in\nimport lodash from \'lodash\';               // bare → package.json "exports"\nimport { helper } from \'./utils.js\';       // explicit .js required\n\n// package.json "exports" field (library side)\n// {\n//   "name": "my-lib",\n//   "exports": {\n//     ".": {\n//       "import": "./dist/esm/index.js",\n//       "require": "./dist/cjs/index.js"\n//     },\n//     "./utils": {\n//       "import": "./dist/esm/utils.js",\n//       "require": "./dist/cjs/utils.js"\n//     }\n//   }\n// }\n\n// Webpack resolve configuration\n// webpack.config.js\nmodule.exports = {\n  resolve: {\n    extensions: [\'.ts\', \'.tsx\', \'.js\'],\n    alias: {\n      \'@components\': path.resolve(__dirname, \'src/components\'),\n      \'@utils\': path.resolve(__dirname, \'src/utils\'),\n    },\n  },\n};',
        language: 'javascript',
        difficulty: 'Advanced',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-modules',
        tags: ['module resolution', 'node_modules', 'package.json', 'exports field'],
        commonMistakes: [
          'Omitting file extensions in Node.js ESM imports — unlike CJS, ESM does not auto-resolve extensions by default.',
          'Confusing the "main" field with the "exports" field in package.json — "exports" takes precedence and is more powerful but has different syntax.',
          'Not realizing that TypeScript path aliases (tsconfig paths) are only for type checking — you still need bundler or runtime alias configuration for actual resolution.',
        ],
        followUps: [
          'What is the difference between the "main", "module", and "exports" fields in package.json?',
          'How do import maps work in browsers and how do they relate to module resolution?',
          'How does pnpm\'s node_modules structure affect module resolution compared to npm?',
        ],
        interviewTips: [
          'Mention the three specifier categories (bare, relative, absolute/built-in) to show you have a systematic mental model rather than ad-hoc knowledge.',
        ],
      },
      {
        id: 'js-modules-7',
        question:
          'What is tree shaking and how does it relate to modules?',
        answer:
          'Tree shaking is a dead-code elimination technique used by JavaScript bundlers (Webpack, Rollup, esbuild, Vite) to remove exported code that is never imported by any consumer. The term originates from the idea of "shaking" a dependency tree so that unused leaves fall off, resulting in a smaller production bundle.\n\nTree shaking relies fundamentally on the static structure of ES modules. Because `import` and `export` declarations must appear at the top level with string-literal specifiers, the bundler can build a complete graph of which exports are consumed before executing any code. If module A exports `foo` and `bar` but the application only imports `foo`, the bundler marks `bar` as unused and excludes it (and any code reachable only from `bar`) from the final output. This is only possible because ESM guarantees that the dependency graph is deterministic at parse time.\n\nCommonJS modules are largely opaque to tree shaking. Since `require()` is a runtime function that can be called conditionally or with computed strings, and since `module.exports` is a mutable object, a bundler cannot safely determine which properties are unused. Some bundlers attempt heuristic CJS tree shaking, but it is far less effective. This is one of the strongest practical arguments for authoring and publishing libraries in ESM format.\n\nFor tree shaking to work well, code must be free of side effects. A side effect is any operation that affects state outside its own scope — for example, modifying a global variable, writing to the DOM, or calling a function at the module\'s top level. If a module has side effects, the bundler cannot safely remove it even if none of its exports are imported, because removing it would change program behavior. The `"sideEffects"` field in `package.json` lets library authors declare that their modules are side-effect-free, giving the bundler explicit permission to prune unused files.\n\nPractical tips for maximizing tree-shaking effectiveness include: prefer named exports over default exports (some bundlers handle them better), avoid barrel files (`index.js` that re-exports everything) unless the bundler has advanced scope analysis, mark packages as `sideEffects: false`, avoid top-level code with side effects in library modules, and use ESM output for library builds. Tools like `webpack-bundle-analyzer` or `source-map-explorer` help visualize what made it into the bundle and identify tree-shaking failures.',
        shortAnswer:
          'Tree shaking is dead-code elimination that removes unused exports from the final bundle. It depends on the static structure of ES modules to determine which exports are imported. Code must be side-effect-free for optimal results. The package.json "sideEffects" field helps bundlers prune safely.',
        code: '// math.js — library with named exports\nexport function add(a, b) {\n  return a + b;\n}\n\nexport function subtract(a, b) {\n  return a - b;\n}\n\nexport function multiply(a, b) {\n  return a * b;\n}\n\n// app.js — only imports add\nimport { add } from \'./math.js\';\nconsole.log(add(1, 2));\n// After tree shaking: subtract and multiply are removed from the bundle\n\n// package.json — marking a package as side-effect-free\n// {\n//   "name": "my-utils",\n//   "sideEffects": false\n// }\n\n// Or specify files that DO have side effects:\n// {\n//   "sideEffects": ["./src/polyfills.js", "*.css"]\n// }\n\n// ❌ Anti-pattern: barrel file that defeats tree shaking\n// index.js\nexport { Chart } from \'./Chart.js\';          // 50 KB\nexport { DataGrid } from \'./DataGrid.js\';    // 80 KB\nexport { Calendar } from \'./Calendar.js\';    // 40 KB\n// Importing just Chart may still pull in DataGrid and Calendar\n// if the bundler cannot prove the re-exports are side-effect-free\n\n// ✅ Better: import directly from the source module\nimport { Chart } from \'my-lib/Chart\';',
        language: 'javascript',
        difficulty: 'Advanced',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-modules',
        tags: ['tree shaking', 'dead code elimination', 'bundling', 'sideEffects'],
        commonMistakes: [
          'Assuming tree shaking works with CommonJS — it is far less effective because require() is dynamic and module.exports is mutable.',
          'Forgetting to set "sideEffects": false in package.json, causing bundlers to conservatively keep all modules.',
          'Using barrel index files that re-export large modules — some bundlers pull in the entire barrel even if only one export is used.',
        ],
        followUps: [
          'How do you debug tree-shaking failures in a Webpack or Rollup build?',
          'What role does the "module" field in package.json play for tree shaking?',
          'How does scope hoisting (module concatenation) complement tree shaking?',
        ],
        interviewTips: [
          'Connect tree shaking to real bundle-size impact — mention that it can shave tens or hundreds of kilobytes off production builds, directly improving load time.',
          'Mention the sideEffects field and barrel-file pitfalls to show you\'ve dealt with tree shaking in real projects, not just read about it.',
        ],
      },
    ],
  },
];
