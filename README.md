# ⚡ FrontendForge

A production-grade, comprehensive Frontend Architecture, Modern Web Standards, and System Design Reference Platform built with **React 19**, **TypeScript**, and **Vite**.

Designed with clean developer ergonomics, 100% curriculum coverage, interactive component laboratories, and client-side code execution with Monaco Editor.

---

## 🚀 Key Highlights & Features

- **100% Curriculum Coverage**: 85 in-depth topics across 17 engineering domains with 500+ curated conceptual and scenario-based interview questions.
- **Interactive Code Playground**: Embedded Monaco Editor with sandboxed execution, console output stream, performance timing, and quick-load snippets.
- **33 Algorithm & JavaScript Coding Challenges**: Implementations with naive vs. optimal solutions, time/space complexity analysis, edge cases, step-by-step guides, and one-click "Practice in Playground" integration.
- **35 Machine Coding Projects**: Full component architecture, state machines, accessibility attributes, keyboard handlers, and live interactive previews.
- **9 Senior System Design Blueprints**: Scalable frontend architectures covering Search Autocomplete, News Feeds, Video Streaming, Real-Time Chat, Resumable Uploads, and Collaborative Editors.
- **Interview Simulation Engine**: Customizable mock interviews tailored for Junior, Mid-level, Senior, and Staff engineering tiers with timed execution and scoring breakdown.
- **Daily Seeded Challenges**: Daily practice queue curated by date-deterministic pseudo-random algorithms.
- **Spaced Repetition Flashcards**: Flip card interface with active recall tracking and category filters.
- **Progress Tracking & Bookmarks**: Full offline persistence via LocalStorage, daily streak monitoring, and category mastery statistics.
- **Modern Developer UI**: Responsive layout with dark/light themes, keyboard shortcuts (`/` for global search, `⌘+Enter` to run code), glassmorphism, and accessible components.

---

## 📊 Curriculum & Content Overview

| Category | Topics | Questions | Focus Areas |
|:---|:---:|:---:|:---|
| **JavaScript** | 12 | 118 | Engines, V8, Event Loop, Closures, Prototypes, FP, OOP, Promises, Async/Await, Microtasks |
| **HTML & Web APIs** | 12 | 63 | Semantic HTML5, Canvas, Web Workers, Shadow DOM, Microdata, Storage APIs |
| **CSS & Modern Layout** | 8 | 19 | Specificity, Box Model, Stacking Context, Flexbox, Grid, Container Queries, GPU animations |
| **Browser & Networking** | 15 | 78 | CRP, HTTP/2 & HTTP/3, WebSockets, CORS, Cookies, Service Workers, DevTools |
| **React** | 12 | 43 | Fiber reconciler, React 19 Actions, Server Components (RSC), Custom Hooks, SSR/SSG/ISR |
| **Redux & State** | 1 | 15 | Redux Toolkit, RTK Query, middleware, immutability, selectors |
| **TypeScript** | 4 | 36 | Utility types, Generics, Template literals, Conditional types, Type narrowing |
| **Senior & Architecture** | 6 | 48 | Micro-frontends, Web Vitals, Design Systems, Caching, Observability, Team Leadership |
| **Performance** | 2 | 12 | Critical Path, Bundle optimization, Dynamic imports, Web Vitals (LCP, INP, CLS) |
| **Testing & Quality** | 3 | 12 | Vitest, Jest, RTL, MSW, E2E (Playwright/Cypress), Accessibility Auditing |
| **Security** | 2 | 10 | XSS, CSRF, CSP, Clickjacking, CORS, Subresource Integrity (SRI) |
| **Design Patterns** | 1 | 9 | Observer, Singleton, Factory, Module, Pub/Sub, Compound Components |
| **Engineering Tooling** | 7 | 37 | Git workflows, Webpack, Babel, ESLint, npm/Yarn/pnpm, SOLID, A11y / WCAG 2.2 |
| **Total** | **85** | **500** | **17 Disciplines** |

---

## 🛠️ Technology Stack

- **Framework**: React 19
- **Language**: TypeScript 5.9 (Strict mode enabled)
- **Bundler**: Vite 7
- **Code Editor**: Monaco Editor (`@monaco-editor/react`)
- **Syntax Highlighting**: PrismJS
- **Styling**: Vanilla CSS Modules + CSS Custom Properties Design Tokens
- **Testing**: Vitest + Testing Library + jsdom
- **Linting**: Oxlint

---

## 📁 Repository Architecture

```text
src/
├── app/                  # Application bootstrap, routing & layout shell
│   ├── routes.tsx        # React Router 7 route definitions
│   └── layout/           # Header, Sidebar, and Breadcrumb wrappers
├── components/           # Reusable UI component library
│   ├── code/             # CodeBlock with syntax highlighting and copy
│   ├── common/           # Button, Card, Badge, Modal, Tabs, ProgressBar, Skeleton
│   ├── layout/           # Header, Sidebar, NavSection
│   ├── questions/        # QuestionCard, AnswerAccordion, DifficultyTag
│   └── quiz/             # QuizController, ScoreCard, FlashcardViewer
├── context/              # React Context Providers
│   ├── BookmarkContext.tsx
│   ├── NotesContext.tsx
│   ├── ProgressContext.tsx
│   └── ThemeContext.tsx
├── data/                 # Canonical Question Bank & Problem Data
│   ├── accessibility/    # WCAG, ARIA, Keyboard navigation
│   ├── browser/          # Rendering cycle, Networking, Storage, Web Vitals
│   ├── build-tools/      # Webpack, Babel, Linters
│   ├── code-quality/     # SOLID, DRY, Clean Code
│   ├── coding/           # 33 Algorithm and JavaScript problem implementations
│   ├── css/              # Deep-dive CSS topics
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
│   ├── senior/           # Senior interview and architectural problems
│   ├── system-design/    # 9 System Design problem blueprints
│   ├── testing/          # Unit, integration, and E2E testing
│   └── typescript/       # Fundamentals, Advanced types, React+TS
├── hooks/                # 9 Custom React Hooks
│   ├── useBookmarks.ts
│   ├── useFlashcards.ts
│   ├── useKeyboardShortcuts.ts
│   ├── useLocalStorage.ts
│   ├── useNotes.ts
│   ├── useProgress.ts
│   ├── useQuiz.ts
│   ├── useSearch.ts
│   └── useTheme.ts
├── pages/                # Routed views
│   ├── Dashboard.tsx     # Overview, progress rings, category cards
│   ├── Playground.tsx    # Live Monaco Editor sandbox
│   ├── Coding.tsx        # Algorithm & JS coding challenges listing
│   ├── CodingDetail.tsx  # Problem statement, approach & solution
│   ├── MachineCoding.tsx # UI Machine Coding challenge directory
│   ├── MachineCodingDetail.tsx
│   ├── SystemDesign.tsx  # Frontend System Design problems
│   ├── SystemDesignDetail.tsx
│   ├── Senior.tsx        # Senior/Staff interview preparation
│   ├── Quiz.tsx          # Interactive quiz mode
│   ├── Flashcards.tsx    # Flashcards review mode
│   ├── Interview.tsx     # Timed Mock Interview Simulator
│   ├── Daily.tsx         # Daily practice routine
│   ├── Progress.tsx      # Detailed stats & category breakdown
│   ├── Bookmarks.tsx     # Saved questions & problems
│   ├── Search.tsx        # Instant global search
│   └── Settings.tsx      # Theme & data management
├── styles/               # Global CSS variables and design tokens
│   ├── variables.css     # Colors, spacing, typography, radii, shadows
│   └── global.css        # Base styling and resets
└── test/                 # Test suites
    ├── dataIntegrity.test.ts # Data structure integrity tests
    ├── helpers.test.ts       # Utility unit tests
    ├── hooks.test.ts         # Custom hooks tests
    └── storage.test.ts       # LocalStorage wrapper tests
```

---

## ⚡ Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/frequency/feeq.git
cd feeq

# Install dependencies
npm install

# Start development server
npm run dev
```

### Running Tests

```bash
# Run unit & data integrity tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Production Build

```bash
# Typecheck and bundle for production
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

MIT License. Designed for interview preparation and educational use.
