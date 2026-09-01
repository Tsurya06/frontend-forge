import type { Topic } from "../../types";

export const buildToolsTopics: Topic[] = [
  {
    id: "webpack-bundling",
    title: "Webpack & Module Bundling",
    description:
      "Understanding Webpack's module bundling system including loaders, plugins, code splitting, tree shaking, and build optimization.",
    category: "Build Tools",
    difficulty: "Advanced",
    tags: [
      "webpack",
      "bundling",
      "loaders",
      "plugins",
      "code-splitting",
      "tree-shaking",
    ],
    overview:
      "Webpack is the most widely used module bundler for JavaScript applications. It processes your application's dependency graph starting from one or more entry points, combining all modules into optimized bundles. Understanding Webpack's core concepts — entry, output, loaders, plugins, and optimization — is essential for configuring builds, debugging build issues, and optimizing application performance.",
    concepts: [
      "Entry points define where Webpack begins building the dependency graph",
      "Output configures where bundles are emitted and how they are named",
      "Loaders transform non-JavaScript files (CSS, images, TypeScript) into valid modules",
      "Plugins extend Webpack's capabilities at various stages of the build lifecycle",
      "Code splitting divides the bundle into smaller chunks loaded on demand",
      "Tree shaking eliminates unused exports from the final bundle",
    ],
    relatedTopicIds: ["babel-transpilation", "eslint-linting"],
    questions: [
      {
        id: "build-1",
        question:
          "What are Webpack loaders and plugins? How do they differ and what are common examples of each?",
        answer: `Webpack loaders and plugins are the two primary extension mechanisms that make Webpack a powerful and flexible bundler. While both extend Webpack's capabilities, they operate at fundamentally different levels: loaders transform individual files during the module resolution phase, while plugins hook into Webpack's broader build lifecycle to perform operations on entire compilations.

Loaders are transformers that process files as they're imported (required/imported in code). Webpack itself only understands JavaScript and JSON natively. Loaders allow Webpack to process other file types — TypeScript, JSX, CSS, SCSS, images, fonts — by converting them into valid JavaScript modules that Webpack can include in the dependency graph. Loaders are specified in module.rules configuration and match files using test patterns (regex). They execute in reverse order when chained: \`['style-loader', 'css-loader', 'sass-loader']\` processes SCSS → CSS → JavaScript. Common loaders include: babel-loader (transpile modern JS/TS), css-loader (resolve CSS imports), style-loader (inject CSS into DOM), file-loader/asset modules (handle images/fonts), ts-loader or esbuild-loader (TypeScript compilation).

Plugins operate on the compilation level, hooking into Webpack's build lifecycle events to perform broader tasks. They can modify the output bundles, optimize assets, inject environment variables, generate HTML files, extract CSS into separate files, analyze bundle size, and much more. Plugins are instantiated in the plugins configuration array. Common plugins include: HtmlWebpackPlugin (generates HTML with script tags), MiniCssExtractPlugin (extracts CSS into separate files instead of inline), DefinePlugin (defines compile-time constants like process.env.NODE_ENV), BundleAnalyzerPlugin (visualizes bundle contents), CleanWebpackPlugin (cleans output directory before builds).

The distinction is scope and timing. Loaders work on individual files during module processing — they answer "how do I transform this .scss file into something Webpack can understand?" Plugins work on the entire build — they answer "what do I want to do with the compiled output?" A practical example: css-loader (loader) resolves CSS imports and url() references into modules. MiniCssExtractPlugin (plugin) takes all those CSS modules and combines them into separate .css files in the output. Both are needed for production CSS handling, but they operate at different phases of the build.`,
        shortAnswer:
          "Loaders transform individual files during module resolution (e.g., babel-loader converts JSX to JS, css-loader resolves CSS imports). Plugins hook into the build lifecycle for broader tasks (e.g., HtmlWebpackPlugin generates HTML, MiniCssExtractPlugin extracts CSS files). Loaders handle per-file transformation; plugins handle compilation-wide operations.",
        code: `// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
  },

  module: {
    rules: [
      // LOADERS: transform files during module processing
      {
        test: /\\.tsx?$/,
        use: 'babel-loader',  // transforms TS/JSX → JS
        exclude: /node_modules/,
      },
      {
        test: /\\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, // extracts CSS to file (production)
          'css-loader',                 // resolves @import and url()
          'postcss-loader',             // autoprefixer, etc.
          'sass-loader',                // compiles SCSS → CSS
        ],
        // Loaders execute bottom-to-top: sass → postcss → css → extract
      },
      {
        test: /\\.(png|jpg|gif|svg)$/,
        type: 'asset',  // built-in asset module (replaces file-loader)
        parser: { dataUrlCondition: { maxSize: 8 * 1024 } }, // inline < 8KB
      },
    ],
  },

  plugins: [
    // PLUGINS: hook into build lifecycle
    new HtmlWebpackPlugin({
      template: './public/index.html',
      minify: { collapseWhitespace: true },
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
  ],
};`,
        language: "javascript",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "Build Tools",
        topicId: "webpack-bundling",
        tags: ["webpack", "loaders", "plugins", "build-configuration"],
        commonMistakes: [
          "Confusing loaders and plugins — loaders transform files, plugins modify the build",
          "Wrong loader order — loaders execute bottom-to-top (right-to-left in the array)",
          "Not excluding node_modules from babel-loader, dramatically slowing the build",
          "Using style-loader in production instead of MiniCssExtractPlugin for CSS extraction",
        ],
        followUps: [
          "How do Webpack loaders execute when chained?",
          "What is the difference between style-loader and MiniCssExtractPlugin?",
          "How do you write a custom Webpack loader or plugin?",
        ],
        interviewTips: [
          "Clearly distinguish scope: loaders = per-file, plugins = per-build",
          "Give specific examples of common loaders and plugins with their purposes",
          "Mention loader execution order (bottom-to-top) as a common interview gotcha",
        ],
      },
      {
        id: "build-2",
        question:
          "How does Webpack code splitting work? Explain entry points, dynamic imports, and the SplitChunksPlugin.",
        answer: `Code splitting is Webpack's mechanism for dividing the output into multiple bundles (chunks) that can be loaded on demand or in parallel. Without code splitting, a Webpack build produces a single bundle containing all application code, which must be fully downloaded before the page becomes interactive. Code splitting reduces initial load time by ensuring users download only the code needed for the current view.

Webpack supports three approaches to code splitting. Entry point splitting is the simplest: you define multiple entry points in the Webpack configuration, and each entry produces a separate bundle. This is useful for multi-page applications where each page has its own entry file. However, it has a major drawback: shared dependencies (like React or lodash) are duplicated across entry bundles unless you configure SplitChunksPlugin to extract them into a shared chunk.

Dynamic import splitting is the most powerful and commonly used approach. When Webpack encounters a dynamic \`import()\` expression, it automatically creates a separate chunk for the imported module and its dependencies. At runtime, calling the import returns a promise that resolves when the chunk is loaded. This is the mechanism behind React.lazy — React.lazy(() => import('./Dashboard')) tells Webpack to split the Dashboard component into its own chunk. You can name chunks using magic comments: \`import(/* webpackChunkName: "dashboard" */ './Dashboard')\`.

SplitChunksPlugin (built into Webpack 4+) automatically identifies and extracts modules shared between chunks into separate bundles. Its default configuration extracts vendor modules from node_modules into a separate chunk (since they change less frequently and can be cached independently) and extracts shared modules used by multiple chunks. The configuration allows fine-grained control over splitting: minimum chunk size, minimum number of chunks that must share a module, maximum number of parallel requests, and custom cache groups for specific splitting strategies. Combined with contenthash filenames, SplitChunksPlugin enables optimal browser caching — vendor code cached separately from frequently changing application code.

Webpack 5 introduced additional optimizations: module federation for sharing code between independently built applications, improved tree shaking with nested tree shaking and inner module tree shaking, and persistent caching that stores build results on disk to speed up subsequent builds.`,
        shortAnswer:
          "Webpack splits bundles via: entry points (multiple entries = multiple bundles), dynamic imports (import() creates async chunks), and SplitChunksPlugin (extracts shared/vendor code automatically). Dynamic imports with React.lazy enable route-based splitting. SplitChunksPlugin separates vendor code for independent caching. Contenthash filenames ensure cache busting on changes.",
        code: `// webpack.config.js — code splitting configuration
module.exports = {
  entry: {
    app: './src/index.tsx',
    // Multi-entry for MPA (optional)
    // admin: './src/admin/index.tsx',
  },
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\\\/]node_modules[\\\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: 20,
        },
        react: {
          test: /[\\\\/]node_modules[\\\\/](react|react-dom)[\\\\/]/,
          name: 'react-vendor',
          chunks: 'all',
          priority: 30,
        },
        common: {
          minChunks: 2,
          name: 'common',
          chunks: 'all',
          priority: 10,
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: 'single', // extract Webpack runtime for better caching
  },
};

// Dynamic import — creates a separate chunk
const Dashboard = lazy(() =>
  import(/* webpackChunkName: "dashboard" */ './pages/Dashboard')
);

// Prefetch: load during idle time for future navigation
const Settings = lazy(() =>
  import(/* webpackChunkName: "settings", webpackPrefetch: true */ './pages/Settings')
);

// Preload: load immediately (high priority)
const HeroImage = import(
  /* webpackPreload: true */ './components/HeroImage'
);`,
        language: "javascript",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "Build Tools",
        topicId: "webpack-bundling",
        tags: [
          "code-splitting",
          "webpack",
          "chunks",
          "dynamic-import",
          "SplitChunksPlugin",
        ],
        commonMistakes: [
          "Not configuring SplitChunksPlugin, duplicating vendor code across entry bundles",
          "Over-splitting into too many tiny chunks, increasing HTTP request overhead",
          "Not using contenthash in filenames, causing cache invalidation issues",
          "Forgetting the runtime chunk configuration, causing all chunks to invalidate on any change",
        ],
        followUps: [
          "What are Webpack magic comments and how do they affect chunk behavior?",
          "How does webpackPrefetch differ from webpackPreload?",
          "What is module federation in Webpack 5?",
        ],
        interviewTips: [
          "Explain all three splitting mechanisms: entry, dynamic import, SplitChunksPlugin",
          "Mention the caching strategy: contenthash + vendor splitting = optimal cache reuse",
          "Discuss the tradeoff: more chunks = less per request but more requests",
        ],
      },
      {
        id: "build-3",
        question:
          "How does tree shaking work in Webpack? What configuration is needed to enable it?",
        answer: `Tree shaking in Webpack is the process of eliminating dead (unused) code from the final bundle by statically analyzing ES module import/export statements. The term comes from the mental model of shaking a tree to remove dead leaves. When you import only one function from a utility module, tree shaking ensures that only that function — and the code it depends on — is included in the output bundle, not the entire module.

Webpack's tree shaking relies on ES module syntax (import/export) because it's statically analyzable. At build time, Webpack can determine which exports from each module are actually imported elsewhere in the dependency graph. Exports that no other module imports are marked as "unused" and excluded from the generated code. In production mode, the Terser minifier then removes this unused code entirely from the output. This two-phase process (marking + removal) is important: Webpack marks unused exports, and the minifier eliminates them.

Several conditions must be met for tree shaking to work. First, use ES module syntax — CommonJS (require/module.exports) cannot be tree-shaken because its dynamic nature prevents static analysis. Second, set mode: 'production' or manually configure optimization.usedExports: true (Webpack marks unused exports) and optimization.minimize: true (minifier removes dead code). Third, the package.json sideEffects field is crucial: setting \`"sideEffects": false\` tells Webpack that all files in the package are safe to eliminate if their exports are unused. Without this, Webpack conservatively keeps modules that might have import-time side effects.

Common obstacles to tree shaking include: modules with side effects (global variable modifications, polyfills, CSS imports) must be listed in the sideEffects array. Re-export barrels (index.ts files that re-export from many modules) can hinder tree shaking in some configurations. Default exports are less tree-shakeable than named exports because the default export is treated as a single unit. Class declarations resist tree shaking because methods are harder to analyze as used/unused. To verify tree shaking is working, use the BundleAnalyzerPlugin to visualize what ends up in your bundle and compare sizes between production and development builds.`,
        shortAnswer:
          "Tree shaking removes unused exports from bundles using static analysis of ES module import/export syntax. Requirements: ES modules (not CommonJS), production mode, sideEffects field in package.json. Webpack marks unused exports, then the minifier (Terser) eliminates dead code. Use named exports, avoid side effects at module scope, and verify with bundle analysis.",
        code: `// webpack.config.js — tree shaking configuration
module.exports = {
  mode: 'production', // enables tree shaking + minification
  optimization: {
    usedExports: true,  // mark unused exports (default in production)
    minimize: true,      // remove dead code (default in production)
    sideEffects: true,   // respect sideEffects in package.json
  },
};

// package.json — declare side-effect-free modules
{
  "name": "my-app",
  "sideEffects": false
  // OR specify files with side effects:
  // "sideEffects": [
  //   "./src/polyfills.ts",
  //   "*.css",
  //   "*.scss"
  // ]
}

// TREE-SHAKEABLE: named exports
// utils.ts
export function add(a: number, b: number) { return a + b; }
export function multiply(a: number, b: number) { return a * b; }
export function divide(a: number, b: number) { return a / b; }

// consumer.ts — only 'add' ends up in the bundle
import { add } from './utils';
console.log(add(1, 2));

// NOT TREE-SHAKEABLE: CommonJS
const utils = require('./utils');
// Webpack can't statically determine which properties are used

// NOT TREE-SHAKEABLE: side effects
// analytics.ts
window.analyticsLoaded = true; // side effect at module scope!
export function track(event: string) { /* ... */ }

// PARTIALLY TREE-SHAKEABLE: default export
export default {
  add: (a: number, b: number) => a + b,
  multiply: (a: number, b: number) => a * b,
};
// Using MathUtils.add includes multiply too — single default export unit`,
        language: "javascript",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "Build Tools",
        topicId: "webpack-bundling",
        tags: [
          "tree-shaking",
          "webpack",
          "dead-code-elimination",
          "ES-modules",
          "optimization",
        ],
        commonMistakes: [
          "Using CommonJS imports (require) which cannot be tree-shaken",
          "Not setting sideEffects in package.json, causing Webpack to keep unused modules",
          "Expecting tree shaking to work in development mode — it requires production mode",
          "Using barrel files that import everything without checking if it hinders tree shaking",
        ],
        followUps: [
          "How do you verify that tree shaking is working in your build?",
          "What is the difference between usedExports and sideEffects in Webpack?",
          "How does tree shaking work differently in Vite/Rollup vs. Webpack?",
        ],
        interviewTips: [
          "Explain the two-phase process: Webpack marks, minifier removes",
          "Emphasize that ES module syntax is the foundation — no ESM, no tree shaking",
          "Mention the sideEffects field as a key configuration many developers overlook",
        ],
      },
      {
        id: "build-4",
        question:
          "Compare Webpack, Vite, and esbuild. What are the key differences and when would you choose each?",
        answer: `The JavaScript bundler landscape has evolved significantly. Webpack, Vite, and esbuild represent three different generations and philosophies of build tooling, each with distinct architectures, performance characteristics, and use cases. Understanding their differences helps you choose the right tool for your project and articulate that decision in interviews.

Webpack is the established standard, first released in 2012. It's a highly configurable, plugin-based bundler that processes everything through loaders and plugins. Webpack bundles all modules for both development and production, using its own module resolution and hot module replacement (HMR) system. Its strength is ecosystem maturity — thousands of loaders, plugins, and community solutions exist for virtually every use case. Its weakness is speed: even with caching, Webpack's JavaScript-based processing is slow for large projects, and cold starts can take 30-60 seconds. Webpack is the right choice when you need maximum configuration flexibility, have complex build requirements, or are maintaining an existing Webpack-based project.

Vite (created by Evan You in 2020) takes a fundamentally different approach to development. In development, Vite serves source files as native ES modules directly to the browser, using the browser's built-in module system instead of bundling everything upfront. Only the modules needed for the current page are transformed and served on demand. This means development server startup is near-instant regardless of application size, and HMR updates are extremely fast because only the changed module is re-processed. For production builds, Vite uses Rollup as its bundler, which produces highly optimized output. Vite is ideal for new projects, especially with React, Vue, or Svelte — it provides the best development experience with minimal configuration.

esbuild is a Go-based JavaScript bundler focused on raw speed. Written in Go (which compiles to native code and uses parallelism), esbuild is 10-100x faster than Webpack for bundling tasks. It handles TypeScript, JSX, CSS, and code splitting natively. esbuild is used internally by Vite for dependency pre-bundling and TypeScript/JSX transformation. As a standalone bundler, esbuild is excellent for library builds, simple applications, and CI/CD pipelines where build speed is critical. Its limitation is a deliberately minimal plugin system — it doesn't support the breadth of transformations that Webpack loaders provide. For complex applications requiring advanced CSS processing, image optimization, or custom transformations, esbuild alone may not suffice.

The modern recommendation for most frontend projects is Vite. It provides the best developer experience (instant startup, fast HMR), reasonable production builds (via Rollup), excellent framework integration, and minimal configuration. Use Webpack for existing projects with complex configurations or when you need its extensive plugin ecosystem. Use esbuild for library builds, scripts, or situations where raw build speed is the priority.`,
        shortAnswer:
          "Webpack: mature, highly configurable, plugin-rich but slow. Vite: native ESM in dev (instant startup), Rollup for production, best DX for new projects. esbuild: Go-based, 10-100x faster, great for libraries but limited plugin ecosystem. Choose Vite for new apps, Webpack for complex existing projects, esbuild for library builds and speed-critical pipelines.",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "Build Tools",
        topicId: "webpack-bundling",
        tags: [
          "webpack",
          "vite",
          "esbuild",
          "bundler-comparison",
          "build-tools",
        ],
        commonMistakes: [
          "Choosing Webpack for a new project without considering Vite — Vite is faster and simpler for most cases",
          "Assuming esbuild can replace Webpack entirely — it lacks many Webpack plugins",
          "Not understanding Vite's dual architecture: ESM in dev, Rollup bundle in production",
          "Over-configuring Webpack when the defaults or a framework CLI would suffice",
        ],
        followUps: [
          "How does Vite serve files in development without bundling?",
          "What is Turbopack and how does it compare to these tools?",
          "How does module federation work and which bundlers support it?",
        ],
        interviewTips: [
          "Know the architectural difference: Webpack bundles everything, Vite uses native ESM in dev",
          "Give a clear recommendation based on project type",
          "Mention that esbuild is used inside Vite, showing you understand the toolchain relationships",
        ],
      },
      {
        id: "build-5",
        question: "What is Hot Module Replacement (HMR) and how does it work?",
        answer: `Hot Module Replacement (HMR) is a development feature that allows modules to be updated in a running application without a full page reload. When you save a file during development, HMR replaces only the changed module and its dependencies while preserving the application's state — form inputs, scroll position, modal open/close state, and component state all remain intact. This dramatically speeds up the development feedback loop compared to full page reloads.

HMR works through a WebSocket connection between the development server and the browser. When a file changes, the development server detects the change (via file system watchers), recompiles only the affected module, and sends a notification to the browser via WebSocket. The browser-side HMR runtime then downloads the updated module and applies the replacement. The update propagates up the module dependency chain until it reaches a module that knows how to accept updates (an "HMR boundary"). If no boundary is found, the entire page reloads as a fallback.

In React development, frameworks like React Fast Refresh (used by Vite and Create React App) create HMR boundaries at every React component. When you edit a component file, only that component is re-rendered with its new code while preserving the state of its useState hooks. This works by wrapping each component module with code that re-renders the component tree from the updated component downward. Class components and non-component exports typically trigger a full reload because they can't be safely hot-replaced without risking inconsistencies.

Vite's HMR implementation is significantly faster than Webpack's because of its native ESM architecture. When a module changes, Vite only needs to invalidate and re-serve that specific module file — the browser fetches just the updated module via HTTP. Webpack must rebundle the affected chunk (potentially involving many modules) before the update can be delivered. For large applications, this means Vite's HMR is nearly instantaneous while Webpack's can take several seconds. This speed difference is one of the primary reasons teams migrate from Webpack to Vite for development.`,
        shortAnswer:
          "HMR updates changed modules in a running app without full page reload, preserving application state. It uses WebSocket to notify the browser of changes, then downloads and replaces only affected modules. React Fast Refresh creates HMR boundaries at each component for seamless updates. Vite's ESM-based HMR is near-instant vs. Webpack's rebundle-based approach.",
        code: `// Webpack HMR API (low-level)
if (module.hot) {
  module.hot.accept('./module', () => {
    const updatedModule = require('./module');
    render(updatedModule);
  });
}

// Vite HMR API
if (import.meta.hot) {
  import.meta.hot.accept('./module', (newModule) => {
    if (newModule) {
      render(newModule.default);
    }
  });

  // Self-accepting module
  import.meta.hot.accept((newModule) => {
    // This module itself was updated
  });

  // Dispose: cleanup before replacement
  import.meta.hot.dispose(() => {
    clearInterval(timer);
  });
}

// React Fast Refresh handles HMR automatically for components
// No manual HMR code needed — just edit and save:

function Counter() {
  const [count, setCount] = useState(0);
  // Edit this component → HMR updates it → count state preserved!
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  );
}

// vite.config.ts — HMR is enabled by default
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], // includes React Fast Refresh
  server: {
    hmr: {
      overlay: true, // show error overlay
    },
  },
});`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Build Tools",
        topicId: "webpack-bundling",
        tags: [
          "HMR",
          "hot-module-replacement",
          "development",
          "React-Fast-Refresh",
          "DX",
        ],
        commonMistakes: [
          "Assuming HMR preserves all state — some changes (new hooks, changed hook order) trigger full reloads",
          "Not understanding why HMR sometimes falls back to full reload — missing HMR boundary",
          "Relying on HMR state preservation in tests — always test with fresh state",
          "Not cleaning up side effects (intervals, subscriptions) in HMR dispose handlers",
        ],
        followUps: [
          "What changes cause React Fast Refresh to do a full reload vs. hot update?",
          "How does Vite's HMR differ architecturally from Webpack's?",
          "What is the HMR boundary concept?",
        ],
        interviewTips: [
          "Explain the mechanism: file change → server detection → WebSocket → module replacement",
          "Mention React Fast Refresh as the practical React implementation of HMR",
          "Compare Vite vs. Webpack HMR speed to show you understand modern tooling",
        ],
      },
    ],
  },
  {
    id: "babel-transpilation",
    title: "Babel & Transpilation",
    description:
      "Understanding Babel's role in JavaScript transpilation including presets, plugins, polyfills, and browser compatibility strategies.",
    category: "Build Tools",
    difficulty: "Intermediate",
    tags: [
      "babel",
      "transpilation",
      "presets",
      "plugins",
      "polyfills",
      "browser-compatibility",
    ],
    overview:
      "Babel is a JavaScript compiler that transforms modern JavaScript and JSX syntax into backwards-compatible versions that older browsers can execute. Understanding Babel's preset and plugin system, its relationship with browserslist, and how polyfills complement transpilation is essential for building applications that work across all target browsers.",
    concepts: [
      "Transpilation converts modern syntax to older equivalent syntax",
      "Presets are collections of plugins for common transformation needs",
      "Plugins perform individual syntax transformations",
      "Polyfills add missing runtime features (Promise, Array.includes)",
      "Browserslist defines target browser support for transpilation level",
    ],
    relatedTopicIds: ["webpack-bundling", "eslint-linting"],
    questions: [
      {
        id: "build-6",
        question:
          "What is Babel and why is it needed? Explain presets, plugins, and the relationship with browserslist.",
        answer: `Babel is a JavaScript toolchain primarily used to convert ECMAScript 2015+ (ES6+) code into backwards-compatible JavaScript that can run in older browsers and environments. While modern browsers support most ES6+ features, teams often need to support older browser versions, and new syntax proposals (like decorators or pipeline operators) aren't available anywhere yet. Babel bridges this gap by transforming source code at build time.

Babel's architecture is plugin-based. At its core, Babel is a parser that creates an Abstract Syntax Tree (AST), a set of plugins that transform the AST, and a code generator that produces output code. Each plugin handles a specific syntax transformation — one plugin converts arrow functions to regular functions, another converts template literals to string concatenation, another transforms class syntax to prototype-based code. This granular approach means you only apply the transformations you need.

Presets are curated collections of plugins that work together for a common purpose. @babel/preset-env is the most important preset — it determines which transformations to apply based on your target browsers (configured via browserslist). If you target browsers that already support arrow functions, preset-env won't transform them, keeping the output smaller and more readable. @babel/preset-react handles JSX transformation (converting JSX to React.createElement or the modern JSX transform). @babel/preset-typescript strips TypeScript type annotations (without type-checking — that's tsc's job).

Browserslist is a configuration format that specifies target browser/environment versions, shared across tools (Babel, PostCSS/Autoprefixer, ESLint). You define targets like "> 0.5%, last 2 versions, not dead" in package.json or a .browserslistrc file. @babel/preset-env reads this configuration and applies only the transformations needed for browsers that don't support a given feature. This keeps bundle size minimal — there's no point transforming async/await for a target list where all browsers support it natively. The key distinction is that Babel handles syntax transformations (arrow functions → regular functions) but not built-in additions (Promise, Map, Array.prototype.includes). For those, you need polyfills, which @babel/preset-env can automatically inject based on usage with the useBuiltIns: 'usage' option.`,
        shortAnswer:
          "Babel transpiles modern JavaScript to backwards-compatible code using plugins (individual transformations) and presets (plugin collections). @babel/preset-env uses browserslist to apply only necessary transformations for target browsers. Babel handles syntax transformation; polyfills (via core-js) add missing runtime features. @babel/preset-react handles JSX.",
        code: `// babel.config.json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "> 0.5%, last 2 versions, not dead",
      "useBuiltIns": "usage",  // auto-inject polyfills for used features
      "corejs": "3.37",
      "modules": false          // preserve ES modules for tree shaking
    }],
    ["@babel/preset-react", {
      "runtime": "automatic"    // new JSX transform (no React import needed)
    }],
    "@babel/preset-typescript"
  ],
  "plugins": [
    "@babel/plugin-proposal-decorators"
  ]
}

// .browserslistrc
> 0.5%
last 2 versions
not dead
not IE 11

// What Babel transforms (example):
// INPUT (modern)
const greet = (name) => \`Hello, \${name}\`;
const data = await fetch('/api');
class App extends Component { /* ... */ }

// OUTPUT (for older browsers)
var greet = function(name) { return "Hello, " + name; };
// async/await → regenerator runtime
// class → prototype-based code

// package.json browserslist (alternative location)
{
  "browserslist": [
    "> 0.5%",
    "last 2 versions",
    "not dead"
  ]
}`,
        language: "json",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Build Tools",
        topicId: "babel-transpilation",
        tags: ["babel", "presets", "plugins", "browserslist", "transpilation"],
        commonMistakes: [
          "Not configuring browserslist, causing Babel to transpile more than necessary",
          "Confusing transpilation (syntax) with polyfills (runtime features) — Babel alone doesn't add Promise",
          'Setting modules: "commonjs" in preset-env, which breaks Webpack tree shaking',
          "Using Babel for TypeScript type-checking — Babel only strips types, tsc type-checks",
        ],
        followUps: [
          'What is the difference between useBuiltIns: "usage" and "entry"?',
          'How does the new JSX transform (runtime: "automatic") work?',
          "Why is Babel being replaced by SWC and esbuild in some projects?",
        ],
        interviewTips: [
          "Distinguish syntax transformation (Babel) from polyfills (core-js)",
          "Explain preset-env + browserslist as the smart way to minimize output size",
          "Mention that modern bundlers like Vite use esbuild/SWC instead of Babel for speed",
        ],
      },
      {
        id: "build-7",
        question:
          "What is the difference between transpilation and polyfilling? How does @babel/preset-env handle both?",
        answer: `Transpilation and polyfilling are two complementary strategies for making modern JavaScript work in older environments. They address different categories of compatibility issues and are often confused. Understanding the distinction is essential for configuring your build correctly and avoiding unnecessary bundle bloat.

Transpilation converts modern syntax into equivalent older syntax. Arrow functions become regular function expressions. Template literals become string concatenation. Class declarations become prototype-based constructor functions. Destructuring becomes individual variable assignments. The key characteristic is that these are syntactic features — they don't add new runtime capabilities, they're just more concise ways of writing code that was always possible in JavaScript. The older syntax does the same thing; it's just more verbose. Babel's plugins handle transpilation.

Polyfilling adds new built-in functionality that doesn't exist in older environments. Promise, Map, Set, Array.prototype.includes, String.prototype.padStart, Object.entries, fetch, IntersectionObserver — these are runtime features that can't be replicated by syntax transformation alone. They require adding actual implementation code (polyfills) that defines these APIs in the global scope or on prototypes. The core-js library is the standard source of JavaScript polyfills, providing implementations for hundreds of ECMAScript and Web API features.

@babel/preset-env handles both through different mechanisms. For transpilation, it uses its collection of syntax plugins, applying only those needed for the target browsers (determined by browserslist). For polyfills, the \`useBuiltIns\` option controls behavior. With \`useBuiltIns: 'usage'\`, preset-env analyzes your source code, detects which modern features you use, and automatically adds only the polyfills needed for those specific features in your target browsers. With \`useBuiltIns: 'entry'\`, you manually import core-js at your entry point, and preset-env replaces that single import with individual imports for all features not supported by your target browsers. The 'usage' mode produces smaller bundles because it only includes polyfills for features you actually use.

An important nuance: some features require both transpilation AND polyfilling. Async/await requires syntax transpilation (converting to generator functions or state machines) AND a polyfill for the regenerator runtime. For-of loops over custom iterables need syntax transpilation AND a polyfill for the Symbol.iterator protocol. This is why configuring both correctly is essential — missing either piece can cause runtime errors in target browsers.`,
        shortAnswer:
          'Transpilation converts modern syntax to older equivalent syntax (arrow functions → function expressions). Polyfilling adds missing runtime features (Promise, Array.includes) as actual code. @babel/preset-env handles both: syntax plugins for transpilation, useBuiltIns + core-js for polyfills. useBuiltIns: "usage" auto-detects needed polyfills from your source code.',
        code: `// TRANSPILATION: syntax conversion (Babel handles this)
// Modern syntax:
const add = (a, b) => a + b;
const { name, age } = user;
class Animal { constructor(name) { this.name = name; } }

// Transpiled to older syntax:
var add = function(a, b) { return a + b; };
var name = user.name, age = user.age;
function Animal(name) { this.name = name; }

// POLYFILLING: adding missing features (core-js handles this)
// These can NOT be transpiled — they need actual implementations:
Promise.resolve(42);                    // needs Promise polyfill
[1, 2, 3].includes(2);                 // needs Array.prototype.includes
Object.entries({ a: 1 });              // needs Object.entries
'hello'.padStart(10);                  // needs String.prototype.padStart
new Map();                             // needs Map polyfill

// @babel/preset-env with useBuiltIns: 'usage'
// babel.config.json
{
  "presets": [
    ["@babel/preset-env", {
      "useBuiltIns": "usage",
      "corejs": "3.37",
      "targets": "> 0.5%, last 2 versions"
    }]
  ]
}

// Your source code:
async function fetchData() {
  const response = await fetch('/api/data');
  const items = await response.json();
  return items.filter(item => item.active).includes(targetItem);
}

// Babel auto-injects only needed polyfills:
import "core-js/modules/es.promise.js";
import "core-js/modules/es.array.filter.js";
import "core-js/modules/es.array.includes.js";
// + transpiles async/await syntax

// BOTH needed: async/await = syntax transform + runtime polyfill
// Syntax: async function → generator function
// Runtime: regenerator-runtime polyfill to execute generators`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Build Tools",
        topicId: "babel-transpilation",
        tags: [
          "transpilation",
          "polyfills",
          "core-js",
          "babel",
          "browser-compatibility",
        ],
        commonMistakes: [
          "Thinking Babel alone handles everything — polyfills need core-js",
          'Importing all of core-js instead of using useBuiltIns: "usage" for targeted imports',
          "Not specifying the corejs version, causing outdated polyfills to be injected",
          "Polyfilling globally when using a library (use @babel/plugin-transform-runtime instead to avoid global pollution)",
        ],
        followUps: [
          "What is @babel/plugin-transform-runtime and when should you use it?",
          "How does core-js differ from babel-polyfill?",
          "What features require both transpilation and polyfilling?",
        ],
        interviewTips: [
          "Use clear categories: syntax → transpilation, runtime features → polyfills",
          'Explain useBuiltIns: "usage" as the smart, minimal approach',
          "Mention that some features (async/await) need both",
        ],
      },
    ],
  },
  {
    id: "eslint-linting",
    title: "ESLint & Code Linting",
    description:
      "Understanding ESLint's role in code quality including rules, plugins, configuration, and integration with Prettier for consistent code formatting.",
    category: "Build Tools",
    difficulty: "Intermediate",
    tags: ["eslint", "linting", "code-quality", "prettier", "rules", "plugins"],
    overview:
      "ESLint is the standard JavaScript/TypeScript linter that statically analyzes code to find and fix problems. It catches bugs, enforces coding conventions, and improves code quality before code reaches review or production. Understanding ESLint configuration, rules, plugins, and integration with formatters like Prettier is essential for maintaining consistent, high-quality codebases.",
    concepts: [
      "Rules define specific code patterns to enforce or forbid",
      "Plugins extend ESLint with custom rules for frameworks and libraries",
      "Configurations (extends) provide pre-built rule sets",
      "Flat config (eslint.config.js) is the modern configuration format",
      "Prettier handles formatting while ESLint handles logic and patterns",
    ],
    relatedTopicIds: ["webpack-bundling", "babel-transpilation"],
    questions: [
      {
        id: "build-8",
        question:
          "How do you configure ESLint for a TypeScript React project? Explain rules, plugins, and extends.",
        answer: `ESLint configuration for a TypeScript React project involves selecting the right parser, plugins, and rule sets to catch bugs, enforce conventions, and maintain code quality. The modern approach uses flat config (eslint.config.js) introduced in ESLint 9, though many projects still use the legacy .eslintrc format. Understanding the configuration components helps you customize linting for your team's needs.

The parser is the foundation. For TypeScript, you need @typescript-eslint/parser, which can parse TypeScript syntax and create the AST that ESLint rules analyze. This parser also integrates with TypeScript's type system, enabling type-aware lint rules that can catch issues like unsafe any usage, floating promises, and incorrect type assertions. The parser needs your tsconfig.json to perform type checking, configured via the parserOptions.project setting.

Plugins provide domain-specific rules. @typescript-eslint/eslint-plugin adds TypeScript-specific rules like no-explicit-any, no-floating-promises, and consistent-type-imports. eslint-plugin-react adds React rules for hooks usage, component best practices, and JSX conventions. eslint-plugin-react-hooks specifically enforces the Rules of Hooks (no conditional hooks, correct dependency arrays). eslint-plugin-jsx-a11y catches accessibility issues in JSX. Each plugin provides a set of rules you can individually enable, disable, or configure.

The extends property lets you use pre-built configurations that enable recommended rule sets. Extending eslint:recommended enables core ESLint rules that catch common issues. plugin:@typescript-eslint/recommended enables essential TypeScript rules. plugin:react/recommended enables React best practices. Teams often layer these: start with recommended configs, then customize individual rules based on team preferences. The flat config format simplifies this by treating everything as arrays of configuration objects that are merged in order, with later configs overriding earlier ones. Integration with Prettier is handled by eslint-config-prettier, which disables all ESLint rules that conflict with Prettier's formatting, letting each tool focus on what it does best.`,
        shortAnswer:
          "Configure ESLint for TypeScript React with: @typescript-eslint/parser (TS parsing), @typescript-eslint/eslint-plugin (TS rules), eslint-plugin-react and react-hooks (React rules), eslint-plugin-jsx-a11y (accessibility). Use extends for recommended rule sets, customize individual rules, and add eslint-config-prettier to avoid formatting conflicts.",
        code: `// eslint.config.js (flat config — modern ESLint 9+)
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-floating-promises': 'error',

      // React rules
      'react/react-in-jsx-scope': 'off', // not needed with new JSX transform
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Accessibility
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-is-valid': 'error',

      // General
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  prettierConfig, // must be last — disables formatting rules
];

// package.json scripts
{
  "scripts": {
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix"
  }
}`,
        language: "javascript",
        difficulty: "Intermediate",
        type: "Coding",
        category: "Build Tools",
        topicId: "eslint-linting",
        tags: ["eslint", "configuration", "typescript", "react", "linting"],
        commonMistakes: [
          "Not including eslint-config-prettier, causing ESLint and Prettier to fight over formatting",
          "Using the legacy .eslintrc format when starting a new project (use flat config)",
          "Not setting parserOptions.project for type-aware rules, losing powerful TypeScript checks",
          "Disabling too many rules instead of fixing the underlying issues",
        ],
        followUps: [
          "What is the difference between flat config and legacy .eslintrc?",
          "How do you create custom ESLint rules?",
          "How do you integrate ESLint with CI/CD to block merging code with lint errors?",
        ],
        interviewTips: [
          "Show familiarity with the modern flat config format",
          "Explain the ESLint + Prettier integration: ESLint for logic, Prettier for formatting",
          "Mention specific rules that catch real bugs: no-floating-promises, exhaustive-deps",
        ],
      },
      {
        id: "build-9",
        question:
          "How do ESLint and Prettier work together? Why do you need both and how do you prevent conflicts?",
        answer: `ESLint and Prettier are complementary tools that address different aspects of code quality. ESLint is a linter that catches code quality issues — logical errors, potential bugs, bad practices, and convention violations. Prettier is a formatter that enforces consistent code style — indentation, line length, quote style, trailing commas, and bracket spacing. While their concerns overlap slightly in the formatting area, using both together provides the most comprehensive code quality solution.

ESLint has some formatting rules (indent, quotes, semi) that overlap with Prettier's domain. Running both without coordination leads to conflicts: ESLint might want single quotes while Prettier enforces double quotes, creating an infinite loop of conflicting fixes. The solution is eslint-config-prettier, which disables all ESLint rules that would conflict with Prettier. By extending this config last in your ESLint configuration, you ensure ESLint doesn't try to enforce formatting that Prettier will handle differently.

The recommended setup separates concerns cleanly. Prettier handles all formatting: run it on save (via editor integration) and in pre-commit hooks (via lint-staged). ESLint handles code quality: type-checking rules, React hooks rules, accessibility checks, unused variable detection, and team-specific conventions. The developer workflow is: write code → Prettier auto-formats on save → ESLint highlights remaining quality issues → fix quality issues → commit (pre-commit hook runs both Prettier and ESLint).

For the most robust setup, use lint-staged with husky to run both tools on staged files before each commit. This ensures no code enters the repository that doesn't meet both formatting and quality standards. In CI/CD, run \`prettier --check\` (fail if unformatted) and \`eslint --max-warnings 0\` (fail on any warnings or errors). This two-layer approach catches formatting issues locally (fast feedback) and quality issues in CI (comprehensive checking). Some teams also use eslint-plugin-prettier which runs Prettier as an ESLint rule, showing formatting issues as ESLint errors — but this is slower and the separate-tools approach is generally preferred.`,
        shortAnswer:
          "ESLint handles code quality (bugs, patterns, conventions); Prettier handles formatting (indentation, quotes, semicolons). Use eslint-config-prettier to disable conflicting ESLint formatting rules. Run Prettier on save and in pre-commit hooks; run ESLint for quality checks. Use lint-staged + husky for automated pre-commit enforcement of both.",
        code: `// Setup: separate concerns, no conflicts

// 1. Install packages
// npm i -D eslint prettier eslint-config-prettier lint-staged husky

// 2. eslint.config.js — ESLint for quality only
import prettierConfig from 'eslint-config-prettier';

export default [
  // ... your rule configs ...
  prettierConfig, // LAST: disables all ESLint formatting rules
];

// 3. .prettierrc — Prettier for formatting
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always"
}

// 4. .prettierignore
node_modules
dist
coverage
*.min.js

// 5. package.json — scripts and lint-staged
{
  "scripts": {
    "format": "prettier --write src/",
    "format:check": "prettier --check src/",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "prettier --write",
      "eslint --fix --max-warnings 0"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
}

// 6. Setup husky pre-commit hook
// npx husky init
// echo "npx lint-staged" > .husky/pre-commit

// Workflow:
// 1. Developer writes code
// 2. Save → Prettier auto-formats (editor setting)
// 3. ESLint highlights quality issues (editor integration)
// 4. Commit → lint-staged runs Prettier + ESLint on staged files
// 5. CI → prettier --check + eslint --max-warnings 0`,
        language: "json",
        difficulty: "Intermediate",
        type: "Scenario",
        category: "Build Tools",
        topicId: "eslint-linting",
        tags: [
          "eslint",
          "prettier",
          "formatting",
          "lint-staged",
          "husky",
          "pre-commit",
        ],
        commonMistakes: [
          "Not using eslint-config-prettier, causing ESLint and Prettier to conflict",
          "Using eslint-plugin-prettier instead of the separate tools approach (slower)",
          "Not running Prettier in CI, allowing unformatted code to be merged",
          "Configuring formatting rules in ESLint when Prettier should handle them",
        ],
        followUps: [
          "What is lint-staged and how does it improve the pre-commit workflow?",
          "How do you handle ESLint/Prettier in a monorepo?",
          "What is the difference between eslint-config-prettier and eslint-plugin-prettier?",
        ],
        interviewTips: [
          "Clearly separate the concerns: ESLint = quality, Prettier = formatting",
          "Mention eslint-config-prettier as the essential bridge between the tools",
          "Describe the full developer workflow from writing code to committing",
        ],
      },
    ],
  },
];
