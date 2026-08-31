<div align="center">

# ⚡ FrontendForge

**The Definitive Modern Frontend Architecture, System Design & Engineering Reference Platform**

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript 5.9](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite 8](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tests Passing](https://img.shields.io/badge/Tests-19%2F19%20Passed-10A37F?logo=vitest&logoColor=white)](https://vitest.dev)
[![Topics](https://img.shields.io/badge/Curriculum-85%20Topics%20%7C%20500%2B%20QA-3B82F6)](https://github.com/Tsurya06/frontend-forge)
[![License: MIT](https://img.shields.io/badge/License-MIT-F59E0B.svg)](https://opensource.org/licenses/MIT)

</div>

---

## 📖 Overview

**FrontendForge** is an open-source, production-grade frontend engineering reference, interactive component laboratory, and system design handbook built for Junior, Mid-Level, Senior, and Staff Engineers.

Designed with clean developer ergonomics, **100% curriculum coverage across 17 engineering domains**, and client-side code execution with Monaco Editor.

---

## 🚀 Key Highlights & Features

- 📚 **100% Curriculum Coverage**: 85 in-depth topics across 17 engineering disciplines with 500+ curated conceptual and scenario-based technical deep-dives.
- 🛠️ **Interactive Code & Live Component Sandbox**: Embedded Monaco Editor with sandboxed JavaScript/TypeScript execution, console stream, performance timing, and live HTML/CSS web component iframe rendering.
- 💻 **37 Core JavaScript & Layout Coding Challenges**: Implementations with naive vs. optimal solutions, time/space complexity analysis, edge cases, step-by-step guides, and one-click "Practice in Playground" integration.
- 🏗️ **35 Machine Coding UI Projects**: Full component architecture, state machines, accessibility attributes (ARIA), keyboard navigation, and live interactive previews.
- 📐 **9 Large-Scale System Design Blueprints**: Scalable frontend architectures covering Search Autocomplete, News Feeds, Video Streaming, Real-Time Chat, Resumable Uploads, and Collaborative Editors.
- 🎯 **Technical Skill Assessment Simulator**: Customizable benchmark simulations tailored for Junior, Mid-level, Senior, and Staff engineering tiers with timed execution and scoring analytics.
- 📅 **Daily Seeded Challenges**: Daily practice queue curated by date-deterministic pseudo-random algorithms.
- 🧠 **Spaced Repetition Flashcards**: 3D flip card interface with active recall rating and category filters.
- 📊 **Progress Tracking & Bookmarks**: Full offline persistence via LocalStorage, daily streak monitoring, and category mastery statistics.
- 🎨 **Minimal AI-Inspired UI**: Clean neutral aesthetic inspired by modern AI interfaces, with dark sidebar, subtle green accents, accessible high-contrast typography, and smooth micro-interactions.

---

## 📊 Curriculum & Content Overview

| Category | Topics | Questions | Core Focus Areas |
|:---|:---:|:---:|:---|
| **JavaScript** | 12 | 118 | Engines (V8), Event Loop, Closures, Prototypes, FP, OOP, Promises, Async/Await, Microtasks |
| **HTML & Web APIs** | 12 | 63 | Semantic HTML5, Dialog, Canvas, Web Workers, Shadow DOM, Microdata, Storage APIs |
| **CSS & Modern Layout** | 8 | 19 | Specificity, Box Model, Stacking Context, Flexbox, Grid, Container Queries, GPU animations |
| **Browser & Networking** | 15 | 78 | CRP, HTTP/2 & HTTP/3, WebSockets, CORS, Cookies, Service Workers, DevTools |
| **React** | 12 | 43 | Fiber Reconciler, React 19 Actions, Server Components (RSC), Custom Hooks, SSR/SSG/ISR |
| **Redux & State** | 1 | 15 | Redux Toolkit, RTK Query, middleware, immutability, memoized selectors |
| **TypeScript** | 4 | 36 | Utility types, Generics, Template literals, Conditional types, Type narrowing |
| **Senior & Architecture** | 6 | 48 | Micro-frontends, Web Vitals, Design Systems, Caching, Observability, Technical Leadership |
| **Performance** | 2 | 12 | Critical Path, Bundle optimization, Dynamic imports, Web Vitals (LCP, INP, CLS) |
| **Testing & Quality** | 3 | 12 | Vitest, Jest, RTL, MSW, E2E (Playwright/Cypress), Accessibility Auditing |
| **Security** | 2 | 10 | XSS, CSRF, CSP, Clickjacking, CORS, Subresource Integrity (SRI) |
| **Design Patterns** | 1 | 9 | Observer, Singleton, Factory, Module, Pub/Sub, Compound Components |
| **Engineering Tooling** | 7 | 37 | Git workflows, Webpack, Babel, ESLint, npm/Yarn/pnpm, SOLID, A11y / WCAG 2.2 |
| **Total** | **85** | **500+** | **17 Disciplines** |

---

## 🛠️ Technology Stack

- **Framework**: React 19.2
- **Language**: TypeScript 5.9 (Strict mode enabled)
- **Bundler & Tooling**: Vite 8
- **Code Editor**: Monaco Editor (`@monaco-editor/react`)
- **Syntax Highlighting**: PrismJS
- **Transpiler**: Sucrase (Client-side fast JS execution)
- **Styling**: Vanilla CSS Modules + CSS Custom Properties Design Tokens
- **Testing**: Vitest + Testing Library + JSDOM
- **Linting**: Oxlint

---

## 📁 Repository Architecture

```text
src/
├── app/                  # Application bootstrap, routing & layout shell
│   ├── routes.tsx        # React Router definitions & lazy-loaded views
│   └── layout/           # Header, Sidebar, and Breadcrumb wrappers
├── components/           # Reusable UI component library
│   ├── code/             # CodeBlock with syntax highlighting, copy & live preview
│   ├── common/           # Button, Card, Badge, Modal, Tabs, ProgressBar, Skeleton
│   ├── layout/           # Header, Sidebar, NavSection
│   └── questions/        # QuestionCard, AnswerAccordion, DifficultyTag
├── context/              # React Context Providers (Progress, Bookmarks, Notes, Theme)
├── data/                 # Canonical Question Bank & Problem Data
│   ├── accessibility/    # WCAG, ARIA, Keyboard navigation
│   ├── browser/          # Rendering cycle, Networking, Storage, Web Vitals
│   ├── build-tools/      # Webpack, Babel, Linters
│   ├── code-quality/     # SOLID, DRY, Clean Code
│   ├── coding/           # 37 Algorithm, JS, and HTML/CSS problem implementations
│   ├── css/              # Deep-dive CSS topics & layouts
│   ├── design-patterns/  # Software and frontend design patterns
│   ├── git/              # Branching strategies and internals
│   ├── html/             # Semantic HTML5, APIs, and Templates
│   ├── javascript/       # 12 core JS modules
│   ├── machine-coding/   # 35 UI Component Machine Coding projects
│   ├── package-management/# npm, Yarn, pnpm, semver
│   ├── performance/      # Performance optimization, Web Vitals
│   ├── react/            # 10 React deep-dive modules
│   ├── redux/            # Redux Toolkit and State Management
│   ├── security/         # Web security attack vectors and mitigations
│   ├── senior/           # Senior & Staff architectural dilemmas
│   ├── system-design/    # 9 System Design problem blueprints
│   ├── testing/          # Unit, integration, and E2E testing
│   └── typescript/       # Fundamentals, Advanced types, React+TS
├── hooks/                # Custom React Hooks (useQuiz, useFlashcards, useProgress...)
├── pages/                # Routed views (Dashboard, Playground, Coding, MachineCoding...)
├── styles/               # Global CSS variables, design tokens & resets
└── test/                 # Vitest test suites (storage, helpers, hooks, data integrity)
```

---

## ⚡ Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Tsurya06/frontend-forge.git
cd frontend-forge

# 2. Install dependencies
npm install

# 3. Start the local development server
npm run dev
```

The application will be running at `http://localhost:5173`.

---

## 🧪 Running Tests & Build

```bash
# Run unit & data integrity tests
npm test

# Run tests in watch mode
npm run test:watch

# Typecheck and build for production
npm run build

# Preview production build locally
npm run preview
```

---

## ⌨️ Global Keyboard Shortcuts

| Shortcut | Action |
|:---|:---|
| `/` | Focus global search |
| `Escape` | Close search / modal overlays |
| `⌘ + Enter` / `Ctrl + Enter` | Run code in Playground |
| `D` | Toggle Dark / Light theme |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
