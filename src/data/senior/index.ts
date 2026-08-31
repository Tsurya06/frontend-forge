import type { Topic } from '../../types';

export const seniorTopics: Topic[] = [
  {
    id: 'senior-arch',
    title: 'Architecture & Scalability',
    description: 'Micro-frontends, monorepo strategies, module federation, state management at scale, code splitting, and build optimization for large-scale frontend applications.',
    category: 'Senior',
    difficulty: 'Senior',
    tags: ['architecture', 'micro-frontends', 'monorepo', 'module-federation', 'scalability', 'code-splitting'],
    questions: [
      {
        id: 'senior-arch-1',
        question: 'Your company has a monolithic React application with 50+ developers contributing to the same codebase. Deployments take 45 minutes, and a bug in one team\'s feature often blocks releases for all teams. How would you architect a migration to micro-frontends?',
        answer: `The migration to micro-frontends should be approached as a gradual, iterative process rather than a big-bang rewrite. I would start by identifying natural domain boundaries in the existing application — areas owned by specific teams with relatively clear interfaces. Common boundaries include: the main navigation shell, the dashboard/home area, user profile/settings, and each major feature vertical (e.g., messaging, analytics, billing). The goal is to enable independent deployment per team without losing the cohesive user experience.

For the technical implementation, I would evaluate three primary approaches: build-time integration via Module Federation (Webpack 5), runtime integration via a shell application that loads micro-frontends as independently deployed bundles, or iframe-based isolation for the most decoupled approach. Module Federation is typically the best balance — it enables sharing of common dependencies (React, design system) to avoid bundle duplication while allowing independent builds and deployments. Each micro-frontend is a separate Webpack build that exposes specific components, and the shell application consumes them at runtime.

The migration strategy follows a strangler fig pattern. Phase 1: Extract the application shell (header, navigation, routing) into a host application that renders the existing monolith as a single "legacy" micro-frontend. This changes nothing for users but establishes the architecture. Phase 2: Extract the first non-critical feature (e.g., settings page) as an independent micro-frontend, proving the architecture end-to-end. Phase 3: Incrementally extract remaining features team by team, prioritizing high-change-frequency areas that benefit most from independent deployment.

Shared concerns must be carefully managed. A shared design system package (published to an internal npm registry) ensures visual consistency. Shared state (authentication, user context) flows through a thin global state layer in the shell — not through shared Redux stores, which would reintroduce coupling. Inter-micro-frontend communication uses custom events or a lightweight pub/sub bus, with a strictly defined event schema. Routing is managed by the shell application, which delegates to micro-frontend-internal routers for sub-routes. The key tradeoff is between team autonomy (each team can choose their own framework, state management) and user experience consistency (shared design system, unified performance budget). I recommend constraining framework choice to avoid complexity explosion — allowing React with different state management libraries is reasonable, but allowing React + Vue + Svelte creates unsustainable maintenance burden.`,
        shortAnswer: 'Use Module Federation with a strangler fig migration pattern: extract shell first, then incrementally extract features team by team, sharing design system and auth state through the shell.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-arch',
        tags: ['micro-frontends', 'module-federation', 'migration', 'architecture'],
        followUps: [
          'How would you handle shared state between micro-frontends?',
          'What testing strategy would you use for micro-frontend integration?',
          'How would you manage CSS isolation between micro-frontends?'
        ],
        interviewTips: [
          'Emphasize the gradual migration strategy — no big-bang rewrites',
          'Discuss both technical and organizational tradeoffs',
          'Mention the importance of team boundary alignment with code boundaries'
        ]
      },
      {
        id: 'senior-arch-2',
        question: 'Your team is debating between a monorepo (Nx/Turborepo) and a polyrepo approach for 8 frontend applications that share a design system and utility libraries. What are the key factors in your decision, and what would you recommend?',
        answer: `This decision depends on several factors: team size and structure, the degree of code sharing, deployment independence requirements, and tooling maturity. I would evaluate both approaches against these dimensions before making a recommendation.

The monorepo approach (using Nx or Turborepo) excels when there is significant code sharing — and with 8 applications sharing a design system and utility libraries, this is clearly the case. In a monorepo, changes to the shared design system are immediately visible to all consuming applications. You can make a breaking change to a shared component and update all consumers in a single commit, with a single CI run verifying that nothing breaks. This atomic change capability eliminates the "dependency hell" of coordinating version bumps across 8+ repositories. Turborepo or Nx provide intelligent task scheduling — when you change the design system, only the 3 applications that actually import the changed component need to rebuild and retest, not all 8. Build caching (both local and remote) means developers rarely rebuild unchanged packages. The monorepo also enables consistent tooling: one ESLint config, one TypeScript config, one test runner, one CI pipeline, reducing configuration drift.

The polyrepo approach has advantages when teams need maximum autonomy — different deployment cadences, different tech stacks, or when the shared code is truly stable and changes infrequently. In a polyrepo, each application has its own CI/CD pipeline, its own version history, and its own dependency management. The shared design system is published as an npm package, and each application pins to a specific version. This provides stability (an application won't break due to an unrelated change in another app) but at the cost of update lag — when the design system publishes a new version, each application must manually bump and test the upgrade.

For 8 applications with active shared code, I would recommend a monorepo with Nx. The key reasons: atomic cross-application refactoring (essential when the design system is actively evolving), intelligent build caching (significant CI time savings), consistent tooling enforcement, and easier onboarding (one repository to clone, one set of commands to learn). To mitigate the monorepo's downsides (repository size, CI complexity, merge conflicts in shared areas), I would implement: strict code ownership rules (CODEOWNERS file), required code reviews from package owners for shared changes, a trunk-based development model with short-lived branches, and deployment pipelines that only deploy affected applications based on Nx's dependency graph analysis.

The tradeoff I'd highlight is that monorepos require upfront investment in tooling and CI infrastructure. Without proper build caching, CI times can balloon as the repository grows. Without code ownership rules, shared code becomes a free-for-all. The tooling investment pays off at 5+ applications but may be premature for 2-3 applications. For the 8-application scenario described, the investment is clearly justified.`,
        shortAnswer: 'Recommend monorepo with Nx for 8 apps sharing code — enables atomic cross-app changes, build caching, and consistent tooling. Mitigate downsides with CODEOWNERS, trunk-based development, and affected-only deployments.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-arch',
        tags: ['monorepo', 'polyrepo', 'nx', 'turborepo', 'architecture'],
        followUps: [
          'How would you handle versioning of shared packages in a monorepo?',
          'What CI/CD strategy would you use for affected-only deployments?',
          'How would you prevent one team from accidentally breaking another team\'s app?'
        ]
      },
      {
        id: 'senior-arch-3',
        question: 'You are designing the state management architecture for a large enterprise application with complex forms, real-time data, and offline support. How would you approach this, and what patterns/libraries would you use?',
        answer: `State management in a large enterprise application requires a multi-layered strategy because different types of state have fundamentally different characteristics. I would categorize state into four distinct layers, each with its own management approach, rather than forcing everything into a single global store.

The first layer is server/remote state — data that originates from APIs and is the source of truth on the server. This includes user profiles, product catalogs, analytics data, and any data shared across users. For this layer, I would use TanStack Query (React Query), which provides caching, background refetching, stale-while-revalidate patterns, and automatic cache invalidation. The key insight is that server state is inherently asynchronous and shared — it needs concepts like staleness, refetch intervals, and optimistic updates that a generic state manager doesn't provide natively. TanStack Query's normalized cache and garbage collection prevent memory leaks from stale query data, which is critical for long-running enterprise applications.

The second layer is client/application state — global UI state like the current user session, theme preference, sidebar collapsed state, and feature flags. This state is synchronous, rarely changes, and is needed by many components. For this, I would use Zustand with a small number of focused stores (authStore, uiStore, featureFlagStore) rather than a single monolithic Redux store. Zustand's simplicity (no boilerplate, no providers, no action types) reduces cognitive load, and its selector-based subscriptions prevent unnecessary re-renders. For very complex state transitions (multi-step wizards, approval workflows), I would use XState (state machines) to model the business logic explicitly, making impossible states unrepresentable.

The third layer is form state — the most complex state category in enterprise applications. Complex forms with conditional fields, cross-field validation, array fields (dynamic rows), and server-side validation need specialized management. I would use React Hook Form with Zod schemas for validation. React Hook Form's uncontrolled approach (using refs instead of state for input values) provides excellent performance for forms with 100+ fields, while Zod schemas provide type-safe validation that can be shared between client and server.

The fourth layer is real-time/collaborative state — data that changes frequently via WebSocket or SSE. This includes live dashboards, notification counts, and presence indicators. This state lives in a separate Zustand store updated by WebSocket event handlers, decoupled from the React rendering cycle using the useSyncExternalStore pattern. For offline support, I would layer IndexedDB persistence underneath the server state cache — TanStack Query can be configured with a persistQueryClient plugin that serializes the query cache to IndexedDB, enabling the application to render cached data immediately on load and sync with the server when online. Write operations performed offline are queued in an IndexedDB outbox and replayed on reconnection.`,
        shortAnswer: 'Use a multi-layered approach: TanStack Query for server state, Zustand for client state, React Hook Form + Zod for forms, and a WebSocket-driven store for real-time data. Layer IndexedDB persistence for offline support.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-arch',
        tags: ['state-management', 'react-query', 'zustand', 'offline', 'enterprise'],
        followUps: [
          'How would you handle optimistic updates that fail?',
          'What strategies would you use for state persistence across sessions?',
          'How do you test complex state management logic?'
        ]
      },
      {
        id: 'senior-arch-4',
        question: 'Your application\'s initial JavaScript bundle has grown to 2.8MB (800KB gzipped). Users on slow connections experience 8+ second load times. Walk me through your approach to analyzing and reducing the bundle size.',
        answer: `I would approach this systematically, starting with analysis to identify the biggest opportunities, then implementing targeted optimizations in order of impact.

Phase 1 — Analysis: First, I would generate a bundle analysis visualization using webpack-bundle-analyzer or @next/bundle-analyzer. This treemap visualization reveals which dependencies consume the most space. Common culprits I've seen include: moment.js (300KB, replace with date-fns or dayjs at 7KB), lodash full import (70KB, switch to per-function imports or lodash-es), chart libraries imported wholesale (200KB, use tree-shaking or lazy load), icon libraries importing the entire set (150KB, import individual icons), and polyfills for browsers you no longer support. I would also check for accidental duplicates — multiple versions of the same library (e.g., two versions of React or two versions of a date library) due to transitive dependency conflicts.

Phase 2 — Code Splitting: After removing obvious waste, I would implement route-based code splitting using React.lazy() and dynamic import(). Each route should be its own chunk, loaded on demand. This alone typically reduces the initial bundle by 50-70% because users only download the code for the current page. Beyond routes, I would identify heavy feature-specific code that can be lazily loaded: the rich text editor (loaded when the user opens the editor), chart libraries (loaded when the dashboard tab is active), PDF generation (loaded when the user clicks "Export"), and admin panels (loaded only for admin users). Each of these becomes a separate chunk loaded on interaction.

Phase 3 — Dependency Optimization: I would audit every dependency using bundlephobia.com to check sizes and find lighter alternatives. Specific optimizations include: using import { debounce } from 'lodash-es/debounce' instead of import { debounce } from 'lodash'; replacing axios (13KB) with the native fetch API (or a tiny wrapper like ky at 3KB); ensuring tree-shaking works (checking sideEffects: false in package.json, using ESM imports); and removing development-only code via DefinePlugin and dead code elimination. For internationalization, loading only the active locale's translations instead of bundling all locales typically saves 100-500KB.

Phase 4 — Advanced Optimizations: After the big wins, I would focus on: configuring Terser for aggressive minification (mangling, dead code elimination, compressing); enabling module/nomodule pattern (serving modern ES2020 bundles to modern browsers, legacy bundles only to IE/old browsers); adding Brotli compression (20-30% smaller than gzip for text); and implementing a performance budget in CI (e.g., "fail build if any chunk exceeds 200KB gzipped") to prevent regression. I would also evaluate whether a framework migration (e.g., adopting RSC with Next.js) could move rendering to the server, reducing the client-side JS required for initial content display.

The target I would set is: initial bundle under 150KB gzipped (critical path for first render), total lazy-loaded budget under 500KB gzipped for a complete user session. These targets ensure sub-3-second LCP even on 3G connections.`,
        shortAnswer: 'Analyze with bundle-analyzer, then: remove/replace heavy dependencies, implement route-based code splitting with React.lazy, optimize imports for tree-shaking, add compression, and set CI performance budgets.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-arch',
        tags: ['bundle-size', 'code-splitting', 'performance', 'optimization'],
        followUps: [
          'How would you set up automated performance budgets in CI?',
          'What tools would you use to monitor bundle size over time?',
          'How do you handle third-party scripts (analytics, chat widgets) that add to page weight?'
        ]
      },
      {
        id: 'senior-arch-5',
        question: 'You need to implement a plugin/extension system that allows third-party developers to add features to your React application. How would you design this architecture?',
        answer: `A plugin system for a React application requires careful balance between extensibility (giving plugins enough power to be useful) and safety (preventing plugins from breaking the host application or accessing unauthorized data). I would design a layered architecture with clear boundaries.

The foundation is a PluginRegistry that manages plugin lifecycle: discovery, loading, initialization, and teardown. Each plugin is defined by a manifest (plugin.json) describing its name, version, required permissions, entry points, and extension slots it targets. The registry loads plugins either at build time (for first-party plugins bundled with the app) or at runtime (for third-party plugins loaded dynamically). Runtime loading uses dynamic import() or script injection, with the plugin's JavaScript bundle hosted on a CDN. The registry validates the manifest, checks permissions, and initializes the plugin by calling its setup() function with a PluginAPI object.

The PluginAPI is the controlled surface that plugins interact with. Rather than giving plugins access to the entire React tree or Redux store, the PluginAPI exposes specific capabilities: registerRoute(path, component) to add new pages, registerMenuItem(config) to add navigation items, registerWidget(slot, component) to add widgets to predefined extension slots, registerHook(event, handler) to listen for application events (e.g., "user.login", "order.created"), and getAPI() to access a subset of the application's data layer. Each capability is gated by permissions declared in the manifest — a plugin that only declares "navigation" permission cannot access registerWidget().

Extension slots are predefined insertion points in the host application where plugins can render content. For example, a DashboardPage might have extension slots for "dashboard.header.actions", "dashboard.sidebar.widgets", and "dashboard.main.panels". The host renders these slots using a <ExtensionSlot name="dashboard.sidebar.widgets" /> component that queries the PluginRegistry for all components registered to that slot and renders them. Each plugin component is wrapped in an ErrorBoundary and a sandboxed context that restricts what React context it can access.

For isolation and security, third-party plugin components run in a restricted environment. Their React components receive a sandboxed subset of context (plugin-specific state, not the full application state). CSS isolation uses Shadow DOM or CSS Modules scoping to prevent style leakage. For maximum isolation (untrusted plugins), I would render them in iframes with postMessage communication, accepting the performance and integration limitations. The tradeoff is a spectrum: same-process rendering (fastest, most integrated, least isolated) vs iframe rendering (slowest, least integrated, most isolated). First-party plugins use same-process rendering; untrusted third-party plugins use iframes. A plugin review/approval process for the "same-process" tier balances security with developer experience.`,
        shortAnswer: 'Design a PluginRegistry with manifest-based permissions, a controlled PluginAPI surface, predefined extension slots in the UI, and sandboxed rendering with ErrorBoundary isolation. Use iframes for untrusted third-party plugins.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-arch',
        tags: ['plugin-system', 'extensibility', 'architecture', 'security'],
        followUps: [
          'How would you version the plugin API to avoid breaking existing plugins?',
          'How would you handle plugins that need to communicate with each other?',
          'What testing infrastructure would you provide for plugin developers?'
        ]
      },
      {
        id: 'senior-arch-6',
        question: 'Your application needs to support white-labeling for enterprise customers — each customer gets their own branding, feature set, and sometimes custom components. How would you architect this?',
        answer: `White-labeling requires a theming and configuration architecture that separates brand identity and feature availability from core application logic. I would design this as a multi-layered customization system that handles visual theming, feature flagging, and component overrides.

The visual theming layer uses CSS custom properties (CSS variables) as the foundation. A theme configuration object defines the customer's brand: { colors: { primary, secondary, background, text, ... }, typography: { fontFamily, headingFont, baseFontSize, ... }, spacing: { borderRadius, ... }, assets: { logo, favicon, loginBackground, ... } }. At application startup, the theme is loaded from the server based on the customer's domain or a subdomain identifier, and applied by setting CSS variables on the :root element. All components reference these variables rather than hardcoded colors, ensuring brand consistency without component-level changes. For more complex theming (different component layouts per customer), I would use a theme context that components can query for layout preferences.

The feature flagging layer controls which features are available per customer. A FeatureConfig object maps feature keys to boolean (enabled/disabled) or more complex configurations (e.g., { enabled: true, maxItems: 50, variant: "compact" }). This configuration is loaded alongside the theme and provided via a FeatureProvider context. Components use a useFeature("feature-key") hook that returns the feature's configuration or null if disabled. Conditional rendering based on feature flags is isolated to top-level page/section components, not scattered throughout leaf components. This keeps the codebase maintainable — you can search for useFeature("advanced-analytics") to find all code paths affected by that feature flag.

The component override layer handles the most complex scenario: customers who need custom components (e.g., a custom checkout flow, a custom report format). I would implement a ComponentRegistry that maps component keys to implementations. The default registry maps every key to the standard component. Customer-specific overrides are loaded dynamically — when customer X's config specifies overrides: { "CheckoutForm": "https://cdn.customerx.com/custom-checkout.js" }, the registry loads and registers the custom component. Host components use <DynamicComponent name="CheckoutForm" fallback={DefaultCheckoutForm} /> which queries the registry and renders the override if available, falling back to the default otherwise.

The deployment model can be either multi-tenant (single deployment serving all customers, with runtime configuration determining branding and features) or per-tenant (dedicated deployment per customer). Multi-tenant is more efficient operationally but requires careful data isolation. For most cases, I recommend multi-tenant with runtime configuration — the application bundle is identical for all customers, and the customer experience is differentiated entirely by configuration loaded at startup. Per-tenant deployments are reserved for customers requiring infrastructure isolation for compliance or regulatory reasons. Build-time customization (generating a separate bundle per customer) should be avoided as it creates an O(n) build problem that doesn't scale.`,
        shortAnswer: 'Use CSS custom properties for visual theming, a FeatureProvider for feature flagging per customer, and a ComponentRegistry for custom component overrides. Deploy as multi-tenant with runtime configuration, not build-time customization.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-arch',
        tags: ['white-labeling', 'theming', 'multi-tenant', 'feature-flags', 'enterprise'],
        followUps: [
          'How would you test the application across 50+ customer configurations?',
          'How do you handle customer-specific CSS that conflicts with the base styles?',
          'What deployment strategy would you use for per-tenant custom components?'
        ]
      },
      {
        id: 'senior-arch-7',
        question: 'You are tasked with implementing a design system that will be used across 5 product teams building different React applications. How would you architect, build, and maintain this design system?',
        answer: `Building a design system that serves 5 product teams requires treating it as a product itself — with its own roadmap, versioning, documentation, and support model. The architecture must balance consistency (enforcing design standards) with flexibility (accommodating diverse use cases across teams).

The technical foundation starts with a component library built in React with TypeScript, using a tool like Storybook for development, documentation, and visual testing. I would structure the library in layers: Tokens (design tokens: colors, typography, spacing, shadows — exported as CSS variables and JS constants), Primitives (foundational components: Box, Text, Stack, Grid — unstyled building blocks with layout props), Components (composed UI elements: Button, Input, Select, Modal, Card — styled with tokens, fully accessible), and Patterns (complex compositions: Form, DataTable, Navigation — opinionated assemblies of components for common use cases). Each layer builds on the previous one, and consuming teams can use any layer depending on their customization needs.

For styling, I would use CSS-in-JS with a token-based approach (styled-components or vanilla-extract, depending on the team's preference for runtime vs build-time CSS). All visual properties reference design tokens rather than hardcoded values, enabling theme customization. The component API design follows a "pit of success" philosophy — the default behavior is correct and accessible, and customization is opt-in. For example, a Button component defaults to type="button" (not "submit"), includes proper focus handling, and meets WCAG contrast requirements without any configuration.

Distribution uses a monorepo containing the design system source, with packages published to an internal npm registry. The package structure separates concerns: @ds/tokens (zero-dependency token package), @ds/primitives (layout primitives), @ds/components (the main component library), and @ds/icons (icon set). This granularity allows teams to adopt incrementally — a team can start with just tokens and primitives and gradually adopt higher-level components. Versioning follows semver strictly, with a detailed changelog and migration guides for breaking changes. A visual regression testing pipeline (using Chromatic or Percy) runs on every PR, catching unintended visual changes before they ship.

The maintenance model is critical for long-term success. I would establish a design system team (2-3 engineers, 1 designer) responsible for core development, reviews, and support. Contributing guidelines enable product teams to submit PRs for new components or enhancements — the design system team reviews for consistency, accessibility, and API design quality. An RFC (Request for Comments) process handles significant additions or changes, giving all consuming teams a voice. Regular "office hours" and a dedicated Slack channel provide support. Adoption metrics (which components are used, which teams have adopted the latest version) inform priorities. The key tradeoff is between moving fast (accepting PRs quickly, releasing frequently) and maintaining quality (thorough reviews, comprehensive testing). I lean toward quality because a broken design system update breaks 5 products simultaneously.`,
        shortAnswer: 'Build in layers (tokens, primitives, components, patterns) with Storybook, distribute via internal npm with strict semver, establish a dedicated team with RFC process for contributions, and use visual regression testing.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-arch',
        tags: ['design-system', 'component-library', 'architecture', 'team-process'],
        followUps: [
          'How would you handle a team that needs a component that doesn\'t fit the design system?',
          'How do you measure the success and adoption of the design system?',
          'What is your strategy for ensuring accessibility across all components?'
        ]
      },
      {
        id: 'senior-arch-8',
        question: 'Your team needs to migrate a large Create React App application to Next.js for SSR and better performance. How would you plan and execute this migration with zero downtime?',
        answer: `Migrating a large CRA application to Next.js is a significant undertaking that touches routing, data fetching, build configuration, and deployment. The key principle is incremental migration — never a big-bang rewrite that risks weeks of integration chaos.

Phase 0 — Assessment and Planning (1-2 weeks): Audit the current application to identify migration complexity zones. Catalog all routes (likely using react-router), data fetching patterns (useEffect, Redux thunks, SWR/React Query), environment variables (CRA uses REACT_APP_ prefix, Next.js uses NEXT_PUBLIC_), and any webpack customizations (via craco or react-app-rewired). Identify pages that benefit most from SSR (SEO-critical pages, performance-sensitive landing pages) and pages that can remain client-side rendered (authenticated dashboards, admin panels). Create a migration priority list: high-value SSR pages first, internal pages last.

Phase 1 — Parallel Setup (1 week): Set up a Next.js project alongside the CRA project (in the same monorepo or a new directory). Configure the Next.js project with the shared design system, authentication, and API client. Create a "catch-all" page in Next.js that loads the existing CRA application — this means the Next.js app can serve all routes from day one, delegating to the CRA bundle for routes that haven't been migrated yet. This hybrid approach is the zero-downtime enabler: the Next.js app goes live serving the exact same experience as CRA, and routes are migrated one at a time.

Phase 2 — Incremental Route Migration (2-8 weeks depending on size): Migrate routes one by one from CRA to Next.js. For each route: create the Next.js page component, convert react-router route patterns to file-based routing (or use the Pages Router), migrate data fetching from useEffect to getServerSideProps (for SSR pages) or keep client-side for authenticated pages, update environment variable references, and test thoroughly. The catch-all route continues to serve non-migrated pages via the CRA bundle. Traffic can be split gradually — use a feature flag or URL-based routing (migrated routes serve from Next.js pages, non-migrated routes fall through to the catch-all).

Phase 3 — Cleanup (1-2 weeks): Once all routes are migrated, remove the CRA catch-all, delete the CRA configuration, and optimize the Next.js setup. This includes: implementing ISR for static content, adding proper Image optimization (next/image), configuring middleware for auth checks, and setting up the deployment pipeline (Vercel, AWS, or self-hosted). Throughout the process, maintain a rollback capability — the CRA deployment remains available and can be reverted to within minutes if critical issues arise.

The biggest risks are: CSS conflicts between CRA and Next.js builds (mitigate with CSS Modules or scoped CSS), routing conflicts during the hybrid phase (mitigate with careful route ordering), and third-party libraries that assume a pure client-side environment (mitigate by wrapping in dynamic imports with ssr: false). I would communicate a realistic timeline to stakeholders — for a 100-route application, expect 2-3 months for full migration, with the hybrid approach delivering incremental improvements throughout.`,
        shortAnswer: 'Use a hybrid approach: set up Next.js alongside CRA with a catch-all page serving unmigrated routes, migrate routes incrementally starting with SEO-critical pages, maintain rollback capability throughout.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-arch',
        tags: ['migration', 'next-js', 'cra', 'ssr', 'incremental'],
        followUps: [
          'How would you handle client-side-only libraries during SSR migration?',
          'What metrics would you track to validate the migration is improving performance?',
          'How would you handle the testing strategy during the hybrid phase?'
        ]
      }
    ]
  },
  {
    id: 'senior-perf',
    title: 'Performance & Optimization',
    description: 'Rendering optimization, bundle analysis, critical path optimization, caching strategies, CDN architecture, and lazy loading patterns for high-performance frontend applications.',
    category: 'Senior',
    difficulty: 'Senior',
    tags: ['performance', 'rendering', 'caching', 'cdn', 'lazy-loading', 'optimization'],
    questions: [
      {
        id: 'senior-perf-1',
        question: 'Your React application has a complex data table component that renders 500 rows with 20 columns, and users report significant lag when sorting, filtering, or scrolling. Walk me through your diagnosis and optimization strategy.',
        answer: `I would approach this with a structured performance investigation, starting with measurement to identify the actual bottleneck before implementing optimizations.

Step 1 — Profiling: I would use React DevTools Profiler to record the sorting/filtering interaction and identify which components are re-rendering unnecessarily. A common finding in data tables is that all 500 rows re-render when a single column is sorted, because the parent table component's state change (sortColumn, sortDirection) triggers a cascade. I would also use Chrome DevTools Performance panel to check for long tasks — a sort operation on 500 rows with complex cell renderers can easily exceed 100ms of scripting, blocking the main thread and causing visible jank. The "Timings" lane in the Performance panel shows React commit phases and helps identify if the bottleneck is in React reconciliation, DOM manipulation, or the sorting algorithm itself.

Step 2 — Virtualization: The most impactful optimization for 500x20 cells is virtual rendering. Instead of mounting 10,000 cells in the DOM, a virtual table (using react-window, @tanstack/react-virtual, or react-virtualized) renders only the cells visible in the viewport — typically 20-30 rows at a time. This reduces the initial render from 10,000 DOM nodes to ~600, and scrolling replaces DOM nodes rather than creating new ones. Virtualization alone typically reduces rendering time by 10-20x for large tables.

Step 3 — Memoization: Each table row should be wrapped in React.memo with a custom comparison function that checks only the row's data and the current sort/filter state — not the entire table state. Cell renderers that perform expensive computations (formatting numbers, rendering mini-charts, computing derived values) should use useMemo with the cell data as the dependency. Column header sort handlers should be stable references (useCallback with appropriate dependencies) to prevent unnecessary re-renders of the header row.

Step 4 — Computation Offloading: If the sorting/filtering logic itself is slow (sorting 500 rows with complex comparator functions), I would move the computation to a Web Worker. The main thread sends the data and sort parameters to the Worker, which performs the sort and returns the sorted IDs. The main thread then updates the display order without blocking user interactions. For filtering, a Web Worker can maintain a search index (using libraries like FlexSearch) that provides sub-millisecond full-text search across all columns.

Step 5 — Incremental Rendering: For the initial render or when applying a new filter that changes many rows, I would use React's startTransition to mark the table update as non-urgent. This allows the browser to process user input (typing in the filter box) without waiting for the table to finish re-rendering. Combined with virtualization, this creates a responsive filter-as-you-type experience even with large datasets. A loading skeleton during the transition prevents the table from appearing frozen.`,
        shortAnswer: 'Profile first, then: virtualize with react-window (only render visible rows), memoize rows and cells, move sort/filter to Web Worker, use startTransition for non-blocking updates.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-perf',
        tags: ['virtualization', 'memoization', 'web-worker', 'data-table', 'react'],
        followUps: [
          'How would you handle variable-height rows in a virtualized table?',
          'What is the tradeoff between virtualization and browser find-in-page functionality?',
          'How would you implement column resizing with virtualization?'
        ]
      },
      {
        id: 'senior-perf-2',
        question: 'Your application\'s Largest Contentful Paint (LCP) is 4.2 seconds on mobile, failing Core Web Vitals. Walk me through your systematic approach to bringing it under 2.5 seconds.',
        answer: `LCP optimization requires understanding what the LCP element is and systematically removing every delay in its rendering pipeline. The target of 2.5s requires optimization across all stages: server response, resource loading, rendering, and hydration.

Phase 1 — Identify the LCP Element: Using Chrome DevTools' Performance tab or Lighthouse, I would identify the LCP element. It's typically the hero image, the main heading text, or a large content block above the fold. The optimization strategy differs significantly based on the element type. For an image LCP (most common on landing pages), the delay has four components: time to first byte (TTFB), resource discovery time, resource download time, and render time. For a text LCP (common in content-heavy apps), the delays are TTFB, CSS loading (text renders when its font is available), and JavaScript hydration (if the text is rendered by React).

Phase 2 — Reduce TTFB: Server response time directly impacts every downstream metric. I would ensure SSR is optimized — no blocking data fetches in the critical path, streaming SSR (renderToPipeableStream) to flush the shell HTML while data loads, and edge caching for static or semi-static pages. Moving SSR execution to the edge (Cloudflare Workers, Vercel Edge Functions) reduces geographic latency. Target TTFB under 200ms on server, 400ms globally.

Phase 3 — Optimize Resource Loading: For image LCP, the image must be discovered by the browser as early as possible. I would add <link rel="preload" as="image" href="..."> in the HTML head for the LCP image, ensuring the browser starts fetching it immediately rather than waiting to discover it in the CSS or HTML body. The image itself must be optimized: modern format (AVIF with WebP fallback), properly sized (not serving a 2000px image for a 400px viewport), and served from a CDN with edge caching. For text LCP, ensure the critical font is preloaded (<link rel="preload" as="font" type="font/woff2" crossorigin href="...">) and use font-display: optional or font-display: swap to prevent font-blocking rendering.

Phase 4 — Minimize Render-Blocking Resources: Audit all CSS and JavaScript in the critical path. Inline critical CSS (above-the-fold styles) directly in the HTML to eliminate the CSS fetch-parse-render waterfall. Defer non-critical CSS using media="print" onload="this.media='all'" pattern. Ensure JavaScript bundles use defer or async attributes and are code-split so only the current page's code is in the critical path. Remove any synchronous third-party scripts (analytics, A/B testing) from the head — these are notorious LCP killers.

Phase 5 — Monitor and Prevent Regression: Set up Real User Monitoring (RUM) using the web-vitals library to track LCP in production. Configure a performance budget in CI: Lighthouse score must be above 90, and LCP must be under 2.5s on simulated 4G. Use WebPageTest for waterfall analysis to catch regressions. I've seen teams achieve LCP improvements from 4.2s to 1.8s through this systematic approach, with the biggest wins typically coming from image optimization (30-40% improvement), preloading (15-20% improvement), and SSR streaming (20-30% improvement).`,
        shortAnswer: 'Identify the LCP element, then: reduce TTFB via edge SSR/streaming, preload the LCP resource, inline critical CSS, optimize images (AVIF, proper sizing, CDN), defer non-critical resources, and set up RUM monitoring.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-perf',
        tags: ['core-web-vitals', 'lcp', 'performance', 'ssr', 'optimization'],
        followUps: [
          'How would you handle CLS caused by dynamically loaded content?',
          'What strategies would you use for FID/INP optimization?',
          'How do you balance performance budgets with feature development velocity?'
        ]
      },
      {
        id: 'senior-perf-3',
        question: 'You need to implement a caching strategy for a React application that serves both anonymous (high-traffic landing pages) and authenticated (personalized dashboard) content. How would you design the caching layers?',
        answer: `This scenario requires a multi-tiered caching architecture because anonymous and authenticated content have fundamentally different caching characteristics. Anonymous content is shared across all users (highly cacheable), while authenticated content is personalized (requires cache isolation or bypass).

Tier 1 — CDN/Edge Cache: For anonymous content (landing pages, product pages, blog posts), I would configure CDN caching with long TTLs (5-60 minutes depending on content freshness requirements). The HTML is SSR-rendered and cached at the CDN edge with Cache-Control: public, s-maxage=300, stale-while-revalidate=3600. The stale-while-revalidate directive means the CDN serves the cached version immediately while refreshing in the background, providing both speed and freshness. For authenticated pages, the CDN serves Cache-Control: private, no-store — these responses must not be cached at the CDN because they contain user-specific data. To handle this split, the SSR server sets different Cache-Control headers based on whether the request includes an authentication cookie.

Tier 2 — Application-Level Cache (Server): For SSR pages that require data fetching, I use a Redis cache on the server side. Anonymous page data (product catalog, blog content) is cached in Redis with appropriate TTLs. The cache key includes the URL, query parameters, and locale (but NOT user-specific parameters). Authenticated page data is cached per-user in Redis with shorter TTLs (30 seconds to 2 minutes) — this absorbs repeated requests from the same user (navigating away and back) without hitting the database. Cache invalidation uses a combination of TTL expiration and event-driven purging (when a product price changes, the relevant Redis keys are invalidated).

Tier 3 — Client-Side Cache: On the client, React Query manages data caching with the stale-while-revalidate pattern. Anonymous data has a longer staleTime (5 minutes) because it changes infrequently. Authenticated data has a shorter staleTime (30 seconds) for freshness. The React Query cache survives client-side navigation, so moving between pages doesn't trigger redundant API calls for recently fetched data. For certain stable data (user preferences, feature flags), I configure an even longer cacheTime (30 minutes) with background refetching.

Tier 4 — Browser Cache: Static assets (JS, CSS, images, fonts) use immutable caching with content-addressed filenames: Cache-Control: public, max-age=31536000, immutable. When the asset changes, the filename hash changes, automatically busting the cache. The HTML document itself uses Cache-Control: no-cache (always revalidate) with ETag for conditional requests, ensuring users always get the latest HTML that references the latest asset hashes.

The key challenge is cache personalization at the edge. A technique I would consider is edge-side includes (ESI) or partial caching — caching the page shell at the CDN and injecting personalized fragments at the edge using Cloudflare Workers or similar edge compute. The anonymous page structure (header, footer, layout) is cached, and only the personalized elements (username, notification count, recommended items) are fetched dynamically. This provides CDN-level performance for the majority of the page while keeping personalized elements fresh.`,
        shortAnswer: 'Use 4 tiers: CDN cache for anonymous pages (public, long TTL), Redis server cache (per-user for auth content), React Query client cache (stale-while-revalidate), and immutable browser cache for static assets. Consider edge-side includes for hybrid pages.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-perf',
        tags: ['caching', 'cdn', 'ssr', 'performance', 'redis'],
        followUps: [
          'How would you handle cache invalidation for frequently changing content?',
          'What is your approach to cache warming for a new deployment?',
          'How do you debug caching issues when users report seeing stale content?'
        ]
      },
      {
        id: 'senior-perf-4',
        question: 'Your React application re-renders excessively — the React DevTools Profiler shows 200+ component re-renders on a single user interaction. How do you systematically identify and fix unnecessary re-renders?',
        answer: `Excessive re-rendering is one of the most common performance issues in React applications, but the fix is often about architecture rather than sprinkling React.memo everywhere. I would approach this with a systematic diagnosis-before-treatment methodology.

Step 1 — Identify the Cascade: Using React DevTools Profiler, I would record the specific interaction and examine the "flamegraph" view. This shows exactly which components re-rendered and why. The "Why did this render?" feature (enable in Profiler settings) reveals the trigger: props changed, state changed, parent re-rendered, or context changed. The most common culprits I've seen are: (a) a high-level context provider value changing and re-rendering all consumers, (b) a parent component's state change causing all children to re-render even when children's props haven't changed, (c) inline object/function literals in JSX creating new references on every render, and (d) a large Redux store where a selector returns a new reference on every call.

Step 2 — Fix Context-Related Re-renders: If a context provider's value is an object (e.g., { user, theme, toggleTheme }), every consumer re-renders whenever ANY property changes. The fix is to split the context: one context for the rarely-changing data (user, theme) and another for the callbacks (toggleTheme). Alternatively, use useMemo on the context value: useMemo(() => ({ user, theme }), [user, theme]). For contexts that wrap the entire app (auth, theme), this split can eliminate hundreds of unnecessary re-renders.

Step 3 — Fix Reference Instability: Inline object and function creation in JSX is a major cause: <Child config={{ a: 1 }} onClick={() => doSomething()} /> creates new references on every parent render, defeating React.memo on Child. The fix: move object literals outside the component (if static) or into useMemo, and wrap callback functions in useCallback. However, I want to emphasize: applying useCallback/useMemo everywhere is an anti-pattern that adds complexity without proportional benefit. Only memoize at component boundaries where the child is expensive to render or is wrapped in React.memo.

Step 4 — Fix State Architecture: The most impactful optimization is often restructuring where state lives. If a text input's onChange updates state at the top of a deeply nested component tree, every component in the tree re-renders on every keystroke. The solution is to push state down — let the input manage its own state with local useState, and lift the value up only on blur or submit. Similarly, if the Redux store is a single large object and selectors return new objects on each call (e.g., { items: store.items.filter(...) }), every connected component re-renders when any store property changes. Using Reselect or createSelector to memoize selector output prevents this.

Step 5 — Apply Targeted Memoization: After fixing the root causes, apply React.memo to components that are expensive to render and sit below frequently-changing parents. A good heuristic: if a component renders 100+ DOM nodes, performs expensive computations, or renders in a list with 50+ items, it should be memoized. List items are the highest-impact memoization target — in a list of 200 items, memoizing the item component reduces re-renders from 200 to 1 (only the changed item) on a single-item update.`,
        shortAnswer: 'Profile with React DevTools to identify cascade triggers, then: split broad contexts, fix reference instability (useMemo/useCallback at boundaries), push state down closer to where it is used, memoize selectors, and apply React.memo to expensive list items.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-perf',
        tags: ['re-renders', 'react', 'memoization', 'profiling', 'optimization'],
        followUps: [
          'When would you NOT use React.memo?',
          'How does the React compiler (React Forget) change the memoization strategy?',
          'How do you prevent re-render regressions from being introduced over time?'
        ]
      },
      {
        id: 'senior-perf-5',
        question: 'Your application needs to load and display a page with 50 images, a video, and several third-party widgets (analytics, chat, A/B testing). How would you optimize the loading strategy to minimize the impact on user experience?',
        answer: `Resource loading optimization is about prioritization — ensuring the resources that matter most to the user load first, while deferring everything else. I would implement a priority-based loading strategy with four tiers.

Tier 1 — Critical Resources (load immediately): These are resources that contribute to the LCP element and initial user experience. The first 3-4 visible images (above the fold) should use fetchpriority="high" and loading="eager". The critical CSS should be inlined in the HTML. The main JavaScript bundle (route-level code) should use modulepreload. The video poster image (not the video itself) should be preloaded. All other resources should be deferred to prevent competing for bandwidth with these critical items.

Tier 2 — Above-the-Fold Deferred (load after critical): Images 5-8 that are above the fold but not the LCP element use loading="eager" without fetchpriority="high" — they load naturally without competing for the critical resource bandwidth. Third-party scripts that affect visible content (A/B testing that modifies the page) should use async loading with a brief timeout — if the A/B test script hasn't loaded within 1 second, render the default variant. This prevents A/B testing from holding up the entire page.

Tier 3 — Below-the-Fold (load on proximity): Images 9-50 use loading="lazy" for native browser lazy loading, which starts fetching when the image is within a distance of the viewport (typically 1250-2500px depending on network speed). The video player uses a facade pattern — instead of loading the video player library (250KB+), render a static thumbnail with a play button overlay. Only when the user clicks play does the actual video library load (dynamic import). This saves the video library download for 60-70% of users who never play the video.

Tier 4 — Non-Essential (load on idle): Third-party widgets that don't affect visible content — analytics (Google Analytics, Segment), chat widgets (Intercom, Drift), and monitoring (Sentry, DataDog) — should be loaded after the page is interactive using requestIdleCallback or a setTimeout(..., 3000) fallback. These widgets often add 200-500KB of JavaScript and compete for main thread time during the critical loading phase. Loading them 3-5 seconds later has zero impact on their functionality but significant impact on initial page performance. For chat widgets specifically, I would use a lightweight custom "chat bubble" trigger that loads the full widget only when the user clicks it.

For implementation, I would use a ResourceLoader utility that manages the loading queue. It registers resources with priorities and loading strategies, and orchestrates the loading sequence using the browser's requestIdleCallback, IntersectionObserver, and event-based triggers. The Reporting API and PerformanceObserver track actual loading times per resource to validate the prioritization strategy. I would also implement a performance budget that monitors the total weight of third-party resources and alerts when a new widget is added that pushes the page over budget.`,
        shortAnswer: 'Implement priority tiers: critical resources (preload LCP image, inline CSS), above-fold deferred (eager load), below-fold lazy (native lazy loading, video facade pattern), and non-essential (load on idle after 3s for analytics/chat/monitoring).',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-perf',
        tags: ['resource-loading', 'lazy-loading', 'third-party', 'performance', 'images'],
        followUps: [
          'How would you handle a third-party script that causes layout shifts?',
          'What is the impact of too many preload hints?',
          'How would you implement a resource loading budget?'
        ]
      },
      {
        id: 'senior-perf-6',
        question: 'You are building a real-time dashboard that updates every second with data from WebSocket. After running for 30 minutes, the browser tab uses 500MB of memory and becomes sluggish. How would you diagnose and fix the memory leak?',
        answer: `Memory leaks in long-running real-time applications are notoriously difficult to diagnose because they're gradual. I would use a systematic approach combining automated detection with manual profiling.

Step 1 — Quantify the Leak: Before diving into code, I would establish the leak rate. Using Chrome DevTools' Performance Monitor, I track "JS heap size" over time. A healthy application's memory should stabilize (with periodic GC dips) after initial loading. If memory grows linearly (e.g., 2MB/minute), I can estimate the leak source size by dividing the growth rate by the update frequency. At 1 update/second for 30 minutes (1,800 updates), 500MB growth means approximately 275KB leaked per update — this suggests large objects (arrays, chart data, DOM nodes) are being retained.

Step 2 — Heap Snapshot Comparison: I take two heap snapshots (Chrome DevTools → Memory tab) separated by 5 minutes. Using the "Comparison" view, I can see exactly which objects grew between snapshots. Common findings in real-time dashboards include: (a) Accumulated chart data points — the chart library appends new data points but never removes old ones, growing the dataset array indefinitely. (b) Detached DOM nodes — old chart SVG elements that were replaced but still referenced by event listeners or closures. (c) Uncleared event listeners — WebSocket message handlers that create closures over component state, preventing garbage collection of old component instances. (d) Growing Redux/Zustand store — historical data accumulating in the state tree without eviction.

Step 3 — Fix Specific Leak Sources: For chart data accumulation, I implement a sliding window — keep only the last N data points (e.g., the last 300 points for 5 minutes of history at 1 update/second) and evict older points. For the chart library, I ensure that when new data renders, old SVG/Canvas elements are properly destroyed (calling chart.destroy() or equivalent cleanup). For event listeners, I ensure every addEventListener has a corresponding removeEventListener in useEffect cleanup, and WebSocket handlers use a stable reference (useCallback or useRef) rather than closures that capture stale state.

Step 4 — Implement Defensive Patterns: For long-running real-time applications, I implement several defensive patterns. A DataRingBuffer class with a fixed capacity replaces growing arrays — pushing new data evicts the oldest entry. A WeakRef-based cache for ephemeral data (tooltips, hover state) allows GC to collect it when memory pressure increases. The WebSocket message handler uses a bounded queue that drops messages if the processing can't keep up (backpressure), preventing unbounded memory growth during high-throughput periods. I also schedule periodic cleanups using requestIdleCallback — during idle periods, the application trims caches, clears expired entries, and runs explicit cleanup.

Step 5 — Continuous Monitoring: I add a memory usage reporter that tracks JS heap size via performance.memory (Chrome only) or a custom memory estimation heuristic. If memory exceeds a threshold (e.g., 300MB), it triggers a warning banner ("Dashboard performance may degrade — refresh for best experience") and logs the memory breakdown to the monitoring service. In severe cases, the application can perform a soft restart — clearing all caches, disconnecting/reconnecting the WebSocket, and resetting the component tree — without requiring a full page reload.`,
        shortAnswer: 'Profile with heap snapshot comparison to identify growing objects, then: implement sliding window for data (bounded arrays), clean up event listeners in useEffect, destroy chart instances properly, use ring buffers for real-time data, and add memory monitoring.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-perf',
        tags: ['memory-leak', 'profiling', 'real-time', 'debugging', 'performance'],
        followUps: [
          'How would you write automated tests for memory leaks?',
          'What tools exist for detecting memory leaks in CI/CD?',
          'How do closures contribute to memory leaks in React?'
        ]
      },
      {
        id: 'senior-perf-7',
        question: 'You are tasked with implementing server-side rendering (SSR) for a React application that currently takes 3 seconds to show meaningful content. What is your approach, and how do you handle the common pitfalls of SSR?',
        answer: `Implementing SSR involves fundamental architectural decisions about rendering strategy, data fetching, and hydration that directly impact both performance and developer experience. I would approach this with a phased strategy.

Phase 1 — Choose the SSR Strategy: Not all pages need the same rendering approach. I would categorize pages: Static pages (marketing, docs) use SSG (Static Site Generation) for the fastest TTFB — they're pre-rendered at build time and served from CDN. Semi-static pages (product catalog, blog) use ISR (Incremental Static Regeneration) — pre-rendered with periodic background revalidation. Dynamic pages (user dashboards, search results) use streaming SSR — rendered on request with React 18's renderToPipeableStream, which flushes the HTML shell immediately and streams data-dependent sections as they resolve.

Phase 2 — Implement Streaming SSR: The key innovation with React 18's streaming SSR is that the HTML shell (layout, navigation, page skeleton) is flushed to the browser immediately, while Suspense boundaries wrap data-dependent sections. Each Suspense boundary shows its fallback (loading skeleton) in the initial HTML and is replaced with actual content when the data resolves on the server. This means the browser starts rendering the page layout within 100ms of the request, while data-heavy sections appear progressively. This approach reduces perceived load time dramatically — the user sees a structured page immediately rather than a blank screen for 3 seconds.

Phase 3 — Handle SSR Pitfalls: The most common pitfalls are: (a) Hydration mismatches — the server-rendered HTML doesn't match the client-rendered HTML, causing React to throw warnings and potentially re-render the entire page. Common causes include date/time rendering (server and client are in different timezones), random values, or browser-only APIs (window.innerWidth). I mitigate this by using suppressHydrationWarning for intentionally different content and useEffect for browser-only values (they render null on server, actual value after hydration). (b) Data fetching waterfalls — nested components that each fetch their own data create sequential requests on the server. I solve this by hoisting data fetching to the page level or using a data loader pattern (like Next.js data fetching conventions) that parallelizes requests. (c) Third-party libraries that assume a browser environment — wrapping them in dynamic imports with ssr: false or checking typeof window !== 'undefined'.

Phase 4 — Optimize Hydration: Hydration (attaching event handlers to server-rendered HTML) can block interactivity for seconds on complex pages. React 18's selective hydration (via Suspense boundaries) hydrates visible components first and defers off-screen components. For even better performance, I would implement progressive hydration — wrapping non-critical sections in a LazyHydrate component that defers hydration until the section scrolls into view (using IntersectionObserver) or until the user interacts with it. This can reduce Time to Interactive by 50-70% for content-heavy pages. The islands architecture takes this further — only interactive components are hydrated as "islands" in a sea of static HTML, eliminating hydration cost for non-interactive content entirely.`,
        shortAnswer: 'Categorize pages by rendering strategy (SSG, ISR, streaming SSR), use React 18 streaming SSR with Suspense for progressive loading, handle hydration mismatches with useEffect guards, and implement selective/progressive hydration to minimize TTI.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-perf',
        tags: ['ssr', 'streaming', 'hydration', 'react-18', 'performance'],
        followUps: [
          'How does React Server Components change the SSR equation?',
          'What monitoring would you set up for SSR performance?',
          'How would you handle SSR errors gracefully?'
        ]
      },
      {
        id: 'senior-perf-8',
        question: 'Your application uses a design system with 200+ components, but most pages use only 15-20 of them. The design system adds 180KB to every page bundle. How would you optimize this?',
        answer: `A design system that ships 200+ components to every page is a common problem that stems from how the library is structured and consumed. The fix involves changes at both the library (publishing) and consumer (importing) levels.

At the library level, the design system must support tree-shaking. This means: publishing ESM (ES modules) format as the primary output (not just CommonJS), setting "sideEffects": false in package.json (or listing specific side-effectful files), and ensuring each component is a named export from a dedicated file rather than all components re-exported from a single index.ts barrel file. The barrel file pattern (export { Button } from './Button'; export { Input } from './Input'; ... for 200 components) defeats tree-shaking in many bundlers because the bundler can't statically determine which exports are unused when they're re-exported through a barrel. The solution is to publish each component as a separate entry point: @ds/components/Button, @ds/components/Input, etc. Modern bundlers (Webpack 5, Vite/Rollup) can then include only the imported components.

At the consumer level, imports must be granular. Replace import { Button, Input } from '@ds/components' with import { Button } from '@ds/components/Button' and import { Input } from '@ds/components/Input'. An ESLint rule (no-restricted-imports) can enforce this, preventing developers from importing from the barrel file. For existing codebases, a codemod (using jscodeshift) can automatically transform barrel imports to granular imports across the entire codebase.

For CSS, the same principle applies. If the design system ships a single CSS file containing styles for all 200 components, every page loads unused CSS. The solution is CSS Modules or CSS-in-JS that co-locates styles with components — when a component isn't imported, its styles aren't included. If the design system uses a global CSS file for design tokens (colors, typography, spacing), those tokens should be in a separate, small CSS file (~5KB) that all pages load, while component-specific styles are bundled with each component.

An advanced optimization is lazy-loading rarely-used components. Components that appear in modals, dropdowns, or other deferred UI (DatePicker, RichTextEditor, ColorPicker, DataTable) can be dynamically imported at the point of use rather than statically imported. The design system can provide lazy variants: import { LazyDatePicker } from '@ds/components/DatePicker/lazy' which wraps the component in React.lazy() with a standard loading skeleton. This approach further reduces the initial page bundle by deferring heavy components until they're actually needed.

After implementing these optimizations, I would expect the per-page design system footprint to drop from 180KB to 20-40KB (the 15-20 actually-used components plus tokens), with additional savings from lazy-loaded components. I would set up a CI check that reports the contribution of the design system to each page's bundle, preventing regression as new components are added.`,
        shortAnswer: 'Publish the design system as ESM with per-component entry points (no barrel re-exports), enforce granular imports via ESLint, co-locate CSS with components (CSS Modules/CSS-in-JS), and lazy-load heavy components used only in modals/deferred UI.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-perf',
        tags: ['tree-shaking', 'design-system', 'bundle-size', 'code-splitting', 'optimization'],
        followUps: [
          'How would you handle a component that has a large dependency (e.g., a date picker depending on date-fns)?',
          'What is the tradeoff between per-component CSS and a single atomic CSS file?',
          'How would you measure design system bundle impact across all consuming applications?'
        ]
      }
    ]
  },
  {
    id: 'senior-sec',
    title: 'Security & Best Practices',
    description: 'Content Security Policy implementation, authentication architecture, token management, secure data handling, dependency auditing, and security best practices for frontend applications.',
    category: 'Senior',
    difficulty: 'Senior',
    tags: ['security', 'csp', 'authentication', 'xss', 'csrf', 'token-management'],
    questions: [
      {
        id: 'senior-sec-1',
        question: 'Your application needs to implement Content Security Policy (CSP). Walk me through your approach to designing and deploying a CSP that is strict enough to prevent XSS but permissive enough not to break the application.',
        answer: `CSP implementation requires a careful, phased rollout because an overly strict policy will break legitimate application functionality (inline styles, third-party scripts, CDN assets), while a permissive policy provides little protection. I would use a four-phase approach.

Phase 1 — Report-Only Mode: Deploy CSP in report-only mode (Content-Security-Policy-Report-Only header) with a strict policy that you expect to violate: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; report-uri /api/csp-reports. The report-only mode doesn't block anything but sends violation reports to your endpoint, revealing every resource that would be blocked by this policy. Collect reports for 1-2 weeks across all pages and user flows.

Phase 2 — Analyze and Adjust: Review the collected reports. Common violations include: inline scripts (CSP blocks <script>...</script> and onclick="..." by default — this is the XSS protection), inline styles (style="..." attributes), third-party scripts (analytics, chat widgets, advertising), CDN-hosted assets (fonts, images), and eval() usage in JavaScript. For each violation, decide the appropriate fix: replace inline scripts with external files (add nonces for unavoidable inline scripts), replace inline styles with CSS classes (or use 'unsafe-hashes' for specific known hashes), whitelist necessary third-party origins (Google Analytics requires specific domains), and eliminate eval() usage (some bundler configurations or libraries use eval in development).

Phase 3 — Nonce-Based Policy: For inline scripts and styles that can't be eliminated (e.g., SSR-injected hydration scripts, CSS-in-JS runtime injection), use nonce-based CSP rather than 'unsafe-inline'. Generate a random nonce per request on the server, add it to the CSP header (script-src 'nonce-{random}'), and inject the same nonce as an attribute on legitimate inline script/style tags. This allows your inline scripts while blocking injected scripts (which won't have the correct nonce). The strict CSP I would target is: default-src 'self'; script-src 'strict-dynamic' 'nonce-{random}'; style-src 'self' 'nonce-{random}'; img-src 'self' data: https://cdn.example.com; connect-src 'self' https://api.example.com wss://ws.example.com; font-src 'self' https://fonts.gstatic.com; frame-src 'none'; object-src 'none'; base-uri 'self'. The 'strict-dynamic' directive is powerful — it trusts scripts loaded by already-trusted scripts, simplifying third-party script management.

Phase 4 — Enforce and Monitor: Switch from report-only to enforcement mode. Maintain the report-uri to catch new violations as the application evolves. Common pitfalls post-deployment include: new third-party scripts breaking because their domains aren't whitelisted (process for adding scripts should include CSP review), CSS-in-JS libraries that inject style tags without nonces (requires configuration with the CSP nonce provider), and developer PRs that introduce inline event handlers. I add a CSP validation step to the CI pipeline — a headless browser test that loads key pages with CSP enforcement and fails if any violations are reported. This catches CSP regressions before they reach production.`,
        shortAnswer: 'Deploy in report-only mode first to discover violations, then use nonce-based policies for inline scripts/styles, whitelist necessary origins, enforce with strict-dynamic, and add CSP violation monitoring and CI checks.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-sec',
        tags: ['csp', 'xss-prevention', 'security-headers', 'nonce'],
        followUps: [
          'How would you handle CSP for micro-frontends that load from different origins?',
          'What other security headers would you implement alongside CSP?',
          'How does CSP interact with service workers?'
        ]
      },
      {
        id: 'senior-sec-2',
        question: 'You are designing the authentication architecture for a React SPA that needs to support social login, MFA, session management, and secure token handling. What is your approach?',
        answer: `Authentication in an SPA requires careful architecture because the browser is an inherently untrusted environment — there's no secure storage equivalent to a server's memory, and JavaScript can be inspected and manipulated. I would design a token-based authentication system with a Backend-for-Frontend (BFF) pattern for maximum security.

The core architecture uses the BFF pattern: the React SPA communicates with a BFF server (same domain, same origin), which handles all authentication logic, token management, and communication with the identity provider (IdP). The BFF maintains the user session using HttpOnly, Secure, SameSite=Lax cookies — these cookies are inaccessible to JavaScript, protecting against XSS-based token theft. The React app never sees or stores access tokens or refresh tokens — it simply makes API calls with cookies that the browser attaches automatically.

The authentication flow works as follows: (1) User clicks "Sign in with Google" → React redirects to BFF endpoint /auth/google → BFF redirects to Google OAuth → Google redirects back to BFF callback → BFF exchanges the authorization code for tokens, creates a session, sets HttpOnly cookies, and redirects to the SPA. (2) For subsequent API calls, the SPA calls BFF endpoints (which proxy to backend services), and the BFF attaches the access token from its session store. (3) Token refresh is handled entirely by the BFF — when the access token expires, the BFF uses the refresh token to get a new access token without any SPA involvement.

For MFA (Multi-Factor Authentication), the BFF manages the MFA challenge flow. After primary authentication (password or social), if MFA is required, the BFF returns a session with a "mfa_required" status. The SPA renders the MFA challenge screen (TOTP code input, push notification waiting screen, or WebAuthn biometric prompt). The user submits the MFA response to the BFF, which verifies it with the IdP and upgrades the session to fully authenticated. WebAuthn (FIDO2) is the most secure MFA option — it uses the device's biometric sensor or security key and is phishing-resistant because the credential is bound to the origin.

Session management includes: session timeout (configurable inactivity timeout, default 30 minutes), sliding expiration (activity extends the session), absolute timeout (maximum session duration regardless of activity, e.g., 24 hours), and multi-device session management (users can view and revoke sessions on other devices). The SPA detects session expiration through 401 responses from the BFF and redirects to the login page. A background heartbeat (every 5 minutes) keeps the session alive during active usage and detects revocation.

If the BFF pattern is not feasible (e.g., static site hosting without a server), the fallback uses short-lived access tokens (5-15 minute expiry) in memory (JavaScript variable, not localStorage) with silent token refresh via a hidden iframe or refresh endpoint. This approach is less secure (tokens are in JavaScript memory, vulnerable to XSS) but acceptable with strict CSP and XSS mitigations. I strongly advise against storing tokens in localStorage — it's the most common authentication vulnerability in SPAs.`,
        shortAnswer: 'Use a BFF (Backend-for-Frontend) pattern: the BFF handles all token management with HttpOnly cookies, supports social login via OAuth redirects, manages MFA challenges, and proxies API calls. Never store tokens in localStorage.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-sec',
        tags: ['authentication', 'bff', 'oauth', 'mfa', 'session-management'],
        followUps: [
          'How would you handle token refresh in a tab that has been inactive for hours?',
          'What is the security difference between localStorage, sessionStorage, and cookies for tokens?',
          'How would you implement role-based access control on the frontend?'
        ]
      },
      {
        id: 'senior-sec-3',
        question: 'A security audit has identified that your application is vulnerable to XSS through user-generated content rendered in various contexts (HTML, attributes, URLs, JavaScript). How would you implement a comprehensive XSS prevention strategy?',
        answer: `XSS prevention requires defense in depth — no single mitigation is sufficient because XSS can occur in multiple rendering contexts, and each context requires a different encoding strategy. I would implement protections at every layer of the application.

Layer 1 — Framework-Level Protection: React's JSX provides automatic output encoding for content rendered as text — {userInput} in JSX is safe because React encodes HTML entities. However, React has escape hatches that bypass this protection: dangerouslySetInnerHTML, href attributes with javascript: URLs, and ref-based DOM manipulation. I would establish a strict lint rule banning dangerouslySetInnerHTML (with an exception process requiring security review), and validate all dynamic URLs against a protocol allowlist (only http: and https:, explicitly rejecting javascript:, data:, and vbscript:).

Layer 2 — Sanitization for Rich Content: When the application must render user-generated rich text (blog posts, comments with formatting, emails), I would use DOMPurify for sanitization with a strict allowlist: DOMPurify.sanitize(html, { ALLOWED_TAGS: ['p', 'b', 'i', 'a', 'ul', 'ol', 'li', 'br', 'strong', 'em'], ALLOWED_ATTR: ['href', 'target'], ALLOWED_URI_REGEXP: /^https?:/ }). This allows safe formatting while stripping scripts, event handlers, and dangerous elements. Sanitization must happen on the server (before storage) AND on the client (before rendering) — server-side for defense against stored XSS, client-side as a backup for any bypass.

Layer 3 — Content Security Policy: As described in the CSP question, a strict CSP with nonce-based script sources provides a critical second line of defense. Even if an XSS payload bypasses sanitization, CSP prevents it from executing because injected scripts won't have the correct nonce. The combination of output encoding + sanitization + CSP makes successful XSS exploitation extremely difficult.

Layer 4 — Context-Aware Encoding: Different rendering contexts require different encoding. HTML body content: React handles this automatically. HTML attributes: React handles quoted attributes, but dynamic attributes need validation (reject event handler attributes like onload, onerror). URLs: validate protocol, encode path segments with encodeURIComponent. CSS: avoid dynamic CSS values from user input; if unavoidable, use CSS.escape(). JavaScript string contexts: avoid embedding user data in inline scripts entirely; use data attributes instead (data-user-name={encoded} and read via dataset in JavaScript).

Layer 5 — Input Validation: While output encoding is the primary defense, input validation provides additional protection. Validate input formats where possible — email addresses should match email format, usernames should be alphanumeric, and URLs should be parseable by the URL constructor. This doesn't replace output encoding but reduces the attack surface. Additionally, implement Content-Type headers (Content-Type: text/html; charset=utf-8) to prevent encoding-based attacks, and X-Content-Type-Options: nosniff to prevent MIME type confusion.`,
        shortAnswer: 'Implement defense in depth: rely on React JSX encoding by default, sanitize rich content with DOMPurify (server + client), enforce strict nonce-based CSP, apply context-aware encoding (HTML/URL/CSS/JS), validate input formats, and ban dangerouslySetInnerHTML via linting.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-sec',
        tags: ['xss', 'sanitization', 'security', 'dompurify', 'csp'],
        followUps: [
          'How would you handle XSS in server-rendered content (SSR)?',
          'What is the difference between reflected, stored, and DOM-based XSS?',
          'How would you test for XSS vulnerabilities systematically?'
        ]
      },
      {
        id: 'senior-sec-4',
        question: 'Your team uses 200+ npm dependencies. A recent audit found 15 vulnerabilities including 3 critical ones. How would you implement a dependency security strategy?',
        answer: `Dependency security is one of the most underestimated attack vectors in frontend development. A single compromised package in the dependency tree can exfiltrate data, inject malware, or create backdoors. I would implement a multi-layered dependency security strategy covering prevention, detection, and response.

Prevention — Reducing Attack Surface: First, I would audit whether all 200+ dependencies are necessary. In my experience, 20-30% of frontend dependencies can be eliminated — replaced with native APIs (replacing axios with fetch, replacing lodash with modern JS array methods, replacing moment.js with Intl.DateTimeFormat), consolidated (multiple utility libraries doing the same thing), or removed (dependencies used in one file that can be trivially reimplemented). Fewer dependencies means fewer attack surfaces. For essential dependencies, I evaluate security posture before adoption: npm popularity and download counts, GitHub maintenance activity (recent commits, responsive to issues), number of maintainers (single-maintainer packages are higher risk), and known vulnerability history. A decision template for new dependency adoption includes a security evaluation section.

Detection — Automated Scanning: I would implement multiple layers of automated scanning. In CI/CD: npm audit runs on every PR and blocks merge on critical/high vulnerabilities. Snyk or Socket.dev provides deeper analysis — Snyk checks for known CVEs in the dependency tree, while Socket.dev detects supply chain attacks (unexpected network access, filesystem access, or shell execution in package install scripts). I configure Dependabot or Renovate Bot to create PRs for dependency updates automatically, with auto-merge enabled for patch-level updates of well-established packages after tests pass. A weekly scheduled scan alerts the team to newly discovered vulnerabilities in existing dependencies.

Response — Handling Vulnerabilities: When a vulnerability is detected, I triage by actual impact, not just severity score. A "critical" vulnerability in a development-only dependency (e.g., a testing library) is lower priority than a "high" vulnerability in a production runtime dependency used in an auth-critical path. The response workflow is: (1) Determine if the vulnerability is reachable — does our code actually exercise the vulnerable code path? Tools like Snyk's reachability analysis help here. (2) If reachable, check for a patched version and upgrade. (3) If no patch exists, evaluate workarounds: override the specific vulnerable transitive dependency (npm overrides / yarn resolutions), replace the package, or implement a mitigation (e.g., if the vulnerability is in HTML parsing, ensure we sanitize input before passing to the vulnerable library).

Lockfile Management: The package-lock.json (or yarn.lock) must be committed and reviewed in PRs. A lockfile change in a PR that doesn't change package.json is suspicious and should trigger review. I enforce integrity checks (npm ci instead of npm install in CI, which verifies lockfile integrity) and consider signing the lockfile. For critical applications, I recommend using a private npm registry (Artifactory, Verdaccio) that proxies npmjs.com and can block packages with known vulnerabilities or that fail security policies before they enter the supply chain.`,
        shortAnswer: 'Reduce dependencies (remove/replace unnecessary ones), automate scanning (npm audit + Snyk/Socket in CI), triage by actual reachability, automate updates with Dependabot, enforce lockfile reviews, and consider a private npm registry for supply chain protection.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-sec',
        tags: ['dependency-security', 'npm-audit', 'supply-chain', 'vulnerabilities'],
        followUps: [
          'How would you handle a zero-day vulnerability in a critical dependency?',
          'What is the risk of using npm overrides to patch a transitive dependency?',
          'How do you evaluate the security posture of a new npm package before adoption?'
        ]
      },
      {
        id: 'senior-sec-5',
        question: 'Your application handles sensitive data (PII, financial information). What client-side data handling practices would you implement to ensure compliance with GDPR and security best practices?',
        answer: `Handling sensitive data on the client side requires a "minimize, protect, and audit" approach. The fundamental principle is that the client should handle as little sensitive data as possible, for as short a time as possible, with strong protections when handling is unavoidable.

Minimize — Data Minimization: The application should request only the data it needs for the current view. API responses should use field selection (GraphQL's inherent benefit, or REST with sparse fieldsets like ?fields=name,email) to avoid over-fetching. For example, a user profile page needs name, email, and avatar — it should NOT receive the user's full address, payment methods, and SSN in the same API response. Sensitive fields that aren't displayed should never reach the client. For display purposes, use masked data from the server: show "****1234" for credit cards, "j***@example.com" for email, and fetch the full value only when the user explicitly requests it (e.g., clicking "Show full card number" triggers a separate authenticated API call).

Protect — Data in Transit and At Rest: All data transmission uses HTTPS (enforced via HSTS with a minimum 1-year max-age). Sensitive API responses include Cache-Control: no-store to prevent browser cache storage. Sensitive data is NEVER stored in localStorage, sessionStorage, or cookies — these persist on disk and can be accessed by any script on the same origin (XSS vulnerability). For data that must temporarily exist on the client (e.g., a form collecting a user's address), the data lives in component state (React useState) which is garbage-collected when the component unmounts. If sensitive data must persist across navigations (e.g., a multi-step form), use a Zustand store with NO persistence middleware and clear the store on logout or session expiry.

For payment data, use PCI-DSS compliant solutions like Stripe Elements or Braintree hosted fields — these render the input in an iframe from the payment provider's domain, ensuring card numbers never enter the application's JavaScript context. Similarly, for Social Security Numbers or government IDs, consider a dedicated input iframe from a compliant third-party service.

Audit — Logging and Compliance: Implement data access logging on the API side — every access to PII is logged with the accessing user, timestamp, and purpose. On the client side, do NOT log sensitive data to the console, error tracking services (Sentry), or analytics. Configure Sentry's beforeSend hook to redact sensitive fields: email addresses, phone numbers, and any field matching PII patterns. Similarly, configure analytics (Google Analytics, Segment) to exclude PII from tracked events — a common GDPR violation is accidentally sending email addresses in URL parameters that get tracked.

For GDPR specifically, implement: a consent banner with granular cookie/tracking consent (compliant with the ePrivacy Directive), a "download my data" feature (triggers server-side data export), a "delete my account" feature (triggers server-side data deletion with confirmation), and data retention policies that automatically purge data beyond the retention period. The client application should respect user consent — if the user hasn't consented to analytics, the analytics scripts should not load at all, not just be configured to not track. This is verified by checking that no analytics network requests are made when consent is declined.`,
        shortAnswer: 'Minimize client-side sensitive data (sparse API responses, masked display), protect in transit (HTTPS, no-store cache) and at rest (no localStorage for PII, clear on unmount), use hosted fields for payment data, redact PII from error/analytics logging, implement GDPR consent and data rights.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-sec',
        tags: ['gdpr', 'pii', 'data-security', 'compliance', 'privacy'],
        followUps: [
          'How would you handle data encryption at rest in IndexedDB?',
          'What is the impact of GDPR on analytics and A/B testing?',
          'How do you implement consent management across micro-frontends?'
        ]
      },
      {
        id: 'senior-sec-6',
        question: 'A penetration test found that your application is vulnerable to CSRF attacks on state-changing operations. Explain the vulnerability and how you would fix it comprehensively.',
        answer: `CSRF (Cross-Site Request Forgery) exploits the browser's automatic inclusion of cookies with cross-origin requests. If a user is logged into your application (session cookie is set) and visits a malicious site, that site can trigger requests to your application that automatically include the session cookie, performing actions as the authenticated user without their knowledge.

Understanding the Attack: In a typical CSRF attack, the malicious site includes an HTML form that auto-submits to your API: <form action="https://yourapp.com/api/transfer" method="POST"><input type="hidden" name="amount" value="10000" /><input type="hidden" name="to" value="attacker" /></form><script>document.forms[0].submit()</script>. The browser sends this POST request with the user's session cookie, and the server processes it as a legitimate request. CSRF affects any state-changing operation: money transfers, password changes, email updates, account deletion, order placement.

Mitigation 1 — SameSite Cookies: Set the session cookie with SameSite=Lax (or SameSite=Strict for maximum protection). SameSite=Lax prevents the cookie from being sent with cross-origin POST requests, form submissions, and AJAX requests — but allows it for top-level navigations (GET requests). This alone blocks the classic CSRF attack above. SameSite=Strict goes further by blocking the cookie on all cross-origin requests, but this breaks legitimate flows like OAuth redirects and links from emails. I recommend SameSite=Lax as the default, with SameSite=Strict for highly sensitive session cookies.

Mitigation 2 — CSRF Tokens (Synchronizer Token Pattern): For defense-in-depth, implement CSRF tokens. The server generates a random token per session and embeds it in the HTML (as a meta tag or a hidden form field). The SPA reads the token from the meta tag and includes it as a custom header (X-CSRF-Token) in every state-changing request. The server validates the token on each request. Cross-origin sites cannot read the token (Same-Origin Policy prevents reading the HTML), so they cannot include it in forged requests. For SPAs, the double-submit cookie pattern is an alternative: the server sets a CSRF token in a non-HttpOnly cookie, the SPA reads the cookie and includes the value as a request header, and the server verifies they match.

Mitigation 3 — Origin and Referer Validation: The server checks the Origin and Referer headers on state-changing requests. These headers indicate the origin of the request. If the Origin doesn't match the expected domain, the request is rejected. This is a supplementary defense — some browsers or proxies may strip these headers, so it shouldn't be the sole protection.

Mitigation 4 — Custom Request Headers: For AJAX-based SPAs (which describes most modern React apps), simply requiring a custom header (X-Requested-With: XMLHttpRequest or a custom authentication header) on all API requests provides CSRF protection. Browsers' CORS policy prevents cross-origin sites from sending requests with custom headers unless the server's CORS configuration explicitly allows the origin. This is often the simplest and most effective CSRF protection for SPAs that make all API calls via fetch/XMLHttpRequest rather than form submissions.

Implementation Priority: For a React SPA, I would implement in order: (1) SameSite=Lax on all cookies (quickest, broadest protection), (2) custom header requirement on all API requests (X-CSRF-Token or Authorization header), (3) CSRF token validation for any form submissions that don't go through the SPA's API client, (4) Origin header validation as a supplementary check. I would also ensure CORS is configured strictly — only the application's own domain is in the Access-Control-Allow-Origin allowlist.`,
        shortAnswer: 'Set SameSite=Lax on session cookies, require custom headers on all API requests (prevents CORS-violating cross-origin requests), implement CSRF token validation (synchronizer or double-submit pattern), and validate Origin/Referer headers as defense in depth.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-sec',
        tags: ['csrf', 'cookies', 'security', 'cors', 'authentication'],
        followUps: [
          'How does CSRF protection work differently for GraphQL APIs?',
          'What is the relationship between CORS and CSRF?',
          'How would you handle CSRF for file upload endpoints?'
        ]
      },
      {
        id: 'senior-sec-7',
        question: 'Your application integrates with 5 third-party scripts (analytics, A/B testing, chat widget, error tracking, heatmaps). How do you manage the security risks of third-party scripts?',
        answer: `Third-party scripts are one of the biggest security risks in modern web applications because they run with full access to the page's DOM, cookies, and user data. A compromised third-party script (supply chain attack, XSS on the third-party CDN, or a rogue employee at the vendor) can exfiltrate sensitive data, inject content, or redirect users. I would implement a defense-in-depth strategy.

Risk Assessment and Reduction: First, evaluate whether each third-party script is essential. For each script, document: what data it accesses, what it sends back to the vendor, what permissions it needs, and what the business impact would be of removing it. Consider self-hosted alternatives where possible — for example, self-hosting Plausible analytics instead of using Google Analytics eliminates Google's access to user data and removes a third-party dependency. For scripts that must remain third-party, negotiate Data Processing Agreements (DPAs) with each vendor covering data handling, security practices, and breach notification.

Isolation via Subresource Integrity (SRI): For third-party scripts loaded from CDNs, add integrity attributes: <script src="https://cdn.vendor.com/widget.js" integrity="sha384-..." crossorigin="anonymous">. SRI ensures the browser verifies the script's hash before execution — if the CDN serves a modified script (compromised or man-in-the-middle attack), the browser blocks it. The limitation is that SRI requires pinning a specific version, so automatic vendor updates break the hash. I would implement a CI job that checks for vendor updates, verifies the new version, and updates the SRI hash.

Isolation via Sandboxing: For high-risk third-party scripts (A/B testing, chat widgets), consider sandboxing them in iframes. The third-party script loads in an iframe with the sandbox attribute, restricting its access to the parent page's DOM and cookies. Communication between the parent page and the sandboxed iframe uses postMessage with strict origin validation. The Partytown library takes this approach further — it moves third-party scripts to a Web Worker, providing a DOM proxy that sanitizes their interactions with the page.

Monitoring and Detection: Implement a Content Security Policy that reports violations. If a third-party script starts making requests to unexpected domains (data exfiltration), the CSP report-uri captures this. Additionally, use a web performance monitoring tool (SpeedCurve, WebPageTest) to track third-party script weight and execution time — a sudden increase in a vendor's script size could indicate compromise. Set up alerts for: new network requests to unknown domains, changes in script size exceeding 10%, and new cookie creation by third-party scripts.

Runtime Protection: Implement a JavaScript security layer that monitors third-party script behavior. This can be as simple as overriding sensitive APIs (document.cookie getter, fetch, XMLHttpRequest) to log access and block unauthorized usage. For example, wrap document.cookie to log any third-party script that reads cookies, and consider freezing the cookie API for known analytics scripts that shouldn't need cookie access. Libraries like feroot.com or jscrambler provide enterprise-grade runtime protection, but a lightweight custom implementation covers the most critical vectors.`,
        shortAnswer: 'Reduce third-party scripts where possible, use SRI for integrity verification, sandbox high-risk scripts in iframes or Web Workers (Partytown), enforce CSP with violation reporting, monitor script behavior and size changes, and implement runtime API protection for sensitive browser APIs.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-sec',
        tags: ['third-party-scripts', 'sri', 'sandboxing', 'supply-chain', 'security'],
        followUps: [
          'How would you handle a vendor that requires eval() for their script to work?',
          'What is the performance impact of sandboxing third-party scripts?',
          'How do you handle consent management for third-party tracking scripts under GDPR?'
        ]
      },
      {
        id: 'senior-sec-8',
        question: 'Your application uses WebSocket connections for real-time features. What are the security considerations specific to WebSocket, and how would you address them?',
        answer: `WebSocket connections introduce security considerations beyond standard HTTP because they're long-lived, bidirectional, and bypass some traditional HTTP security mechanisms. I would address security across the connection lifecycle.

Authentication and Authorization: WebSocket connections don't send cookies in the initial handshake in all scenarios (especially cross-origin), and adding custom headers to the WebSocket constructor is not supported by the browser API. The standard approach is a two-step authentication: (1) The client makes a REST API call to POST /api/ws/ticket with the session cookie, receiving a short-lived ticket (single-use, expires in 30 seconds). (2) The client opens the WebSocket with the ticket as a query parameter: new WebSocket('wss://api.example.com/ws?ticket=abc123'). The server validates the ticket on connection, associates the connection with the user, and invalidates the ticket (preventing replay). The connection is rejected if the ticket is expired, already used, or invalid.

For ongoing authorization, the server must re-validate permissions on each incoming message, not just at connection time. A user's permissions may change during a long-lived connection (role downgrade, account suspension), and the WebSocket handler must check current permissions before processing each message. Implement a middleware pattern: each incoming message passes through an auth middleware that checks the user's current session and permissions.

Origin Validation: The WebSocket server must validate the Origin header during the handshake. Unlike HTTP requests, browsers don't enforce same-origin policy for WebSocket connections — any page can open a WebSocket to any server. Without origin validation, a malicious site could open a WebSocket to your server and receive real-time data (WebSocket CSRF). The server's handshake handler should reject connections from non-whitelisted origins: if the Origin header doesn't match your application's domain, return 403.

Input Validation and Rate Limiting: Every message received from the WebSocket client must be validated — deserialized safely (JSON.parse in a try-catch, not eval), type-checked against an expected message schema, and sanitized if the content will be broadcast to other users or rendered in UIs. Rate limiting prevents abuse: cap the number of messages per second per connection (e.g., 10 messages/second) and the total data volume per minute (e.g., 1MB/minute). Exceeding limits triggers connection throttling or disconnection with a descriptive close code and reason.

Denial of Service Protection: WebSocket connections consume server resources (memory for connection state, CPU for message processing). Implement connection limits per user (e.g., max 5 concurrent WebSocket connections) and per IP (e.g., max 50 connections). The handshake should use TLS (wss://) to prevent man-in-the-middle attacks and data sniffing. Implement heartbeat pings to detect and clean up zombie connections (clients that disconnected without sending a close frame). Set maximum message size limits to prevent memory exhaustion from oversized messages. For public-facing WebSocket endpoints, consider using a WebSocket gateway (like AWS API Gateway WebSocket APIs) that provides built-in DDoS protection and connection management.`,
        shortAnswer: 'Use ticket-based authentication (short-lived, single-use tokens), validate Origin header in handshake, re-validate permissions on each message, enforce rate limiting and message size limits, use wss:// (TLS), implement heartbeat for zombie cleanup, and set per-user connection limits.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-sec',
        tags: ['websocket', 'security', 'authentication', 'real-time', 'rate-limiting'],
        followUps: [
          'How would you implement end-to-end encryption over WebSocket?',
          'What is the impact of proxies and load balancers on WebSocket security?',
          'How do you handle authentication token refresh for long-lived WebSocket connections?'
        ]
      }
    ]
  },
  {
    id: 'senior-test',
    title: 'Testing & Quality',
    description: 'Testing strategy for large applications, test pyramid, CI/CD pipelines, code review practices, monitoring, and observability for production frontend applications.',
    category: 'Senior',
    difficulty: 'Senior',
    tags: ['testing', 'ci-cd', 'monitoring', 'code-review', 'observability', 'quality'],
    questions: [
      {
        id: 'senior-test-1',
        question: 'You are establishing the testing strategy for a new large-scale React application with 30 developers. How would you design the test pyramid, and what types of tests would you prioritize?',
        answer: `For a 30-developer application, the testing strategy must balance coverage, speed, and maintenance cost. I would implement a modified test pyramid with four layers, calibrated for the realities of modern frontend development.

Layer 1 — Static Analysis (Foundation, runs in milliseconds): Before any tests run, static analysis catches entire categories of bugs. TypeScript with strict mode eliminates null reference errors, type mismatches, and incorrect function signatures — in my experience, TypeScript prevents 30-40% of the bugs that unit tests would otherwise catch. ESLint with plugins (eslint-plugin-react-hooks for Rules of Hooks violations, eslint-plugin-jsx-a11y for accessibility issues, @typescript-eslint for type-aware linting) catches patterns known to cause bugs. These run on every file save and in pre-commit hooks, providing instant feedback. This layer is zero-maintenance — no test code to write, and it scales automatically as the codebase grows.

Layer 2 — Component and Integration Tests (Bulk of test code, runs in seconds): This is the most valuable testing layer for React applications. Using React Testing Library with Vitest (or Jest), I would test components and features from the user's perspective — rendering components, simulating user interactions, and asserting on visible output. These tests verify that components integrate correctly with their dependencies (hooks, context, API clients) using realistic scenarios. For example, a test for a SearchBar component would: render it with a QueryClientProvider, type a query, wait for debounced results to appear, verify the result list renders correctly, and verify clicking a result triggers navigation. These tests are fast (100-500ms each), reliable (no network or browser dependencies), and catch the majority of bugs that affect users.

The key principle is "test the behavior, not the implementation." Don't test that a state variable changed to a specific value — test that the user sees the expected output. This makes tests resilient to refactoring. I would target 80% code coverage for business logic and UI components, with exemptions for boilerplate (config files, type definitions) and framework glue code. Each developer writes tests alongside their feature code — testing is not a separate phase but part of the definition of done.

Layer 3 — End-to-End Tests (Critical paths, runs in minutes): Using Playwright (preferred over Cypress for multi-tab, multi-browser, and parallel execution), I would write E2E tests for 10-15 critical user journeys: sign up, log in, core feature workflows, checkout/payment, and error recovery flows. E2E tests run against a deployed staging environment with seeded test data. These tests catch integration issues that component tests miss — broken API contracts, routing issues, authentication flow problems, and cross-service data consistency. E2E tests are expensive to write and maintain, so I limit them to high-business-value flows. They run in CI on every PR merge to main (not on every commit) to balance coverage with CI speed.

Layer 4 — Visual Regression Tests (Appearance verification, runs in minutes): Using Chromatic (Storybook-based) or Percy, visual regression tests capture screenshots of every component and page, comparing them against approved baselines. These catch CSS regressions — layout breaks, color changes, z-index issues — that functional tests miss. Visual tests are especially valuable in a 30-developer team where CSS changes from one developer can unintentionally affect components they didn't modify.`,
        shortAnswer: 'Four layers: static analysis (TypeScript + ESLint as foundation), component/integration tests with Testing Library (bulk of tests, test user behavior), Playwright E2E for 10-15 critical paths, and visual regression testing for CSS changes. Target 80% coverage for component tests.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-test',
        tags: ['testing-strategy', 'test-pyramid', 'testing-library', 'playwright'],
        followUps: [
          'How would you handle testing of components that depend on third-party services?',
          'What is your approach to test data management for E2E tests?',
          'How do you balance test coverage requirements with development velocity?'
        ]
      },
      {
        id: 'senior-test-2',
        question: 'Your CI pipeline takes 45 minutes to run, and developers frequently push without waiting for results. How would you optimize the pipeline to maintain quality while reducing cycle time?',
        answer: `A 45-minute CI pipeline is a significant productivity drain. My goal would be to get the critical feedback loop under 10 minutes for PRs, with the full pipeline completing within 20 minutes. I would approach this by optimizing at multiple levels.

Level 1 — Parallelization: Most CI pipelines run steps sequentially when many can run in parallel. I would restructure the pipeline into parallel tracks: Track A (lint + type check, 2-3 minutes), Track B (unit + component tests, 5-8 minutes), Track C (build, 3-5 minutes), Track D (E2E tests, 10-15 minutes). Tracks A, B, and C run in parallel, and Track D runs after C completes (it needs the build artifact). Within each track, tests are further parallelized — the test suite is split across multiple CI machines using test sharding (Vitest's --shard flag or Jest's --shard). With 4 shards, a 20-minute test suite drops to 5 minutes.

Level 2 — Caching: Aggressive caching eliminates redundant work. Cache node_modules based on the lockfile hash (a lockfile change is the only reason to reinstall). Cache build artifacts for unchanged packages in a monorepo — if only the dashboard app changed, the design system and utility libraries don't need to rebuild. Turborepo's remote cache or Nx Cloud provides shared build caches across developer machines and CI, so a build artifact generated by one developer is reused by CI without rebuilding. Cache test results for unchanged code — if a file and its dependencies haven't changed, its test results from the last run are valid (Nx and Turborepo support this).

Level 3 — Affected-Only Execution: In a monorepo, use the dependency graph to run only tests affected by the changed files. If a PR only modifies the settings page, there's no need to run tests for the dashboard, checkout, or admin modules. Nx's affected command and Turborepo's filtering enable this — reducing the test scope from "everything" to "only what could possibly break" cuts CI time by 60-80% for most PRs.

Level 4 — Pipeline Staging: Not all checks need to run before merge. I would implement a staged pipeline: Stage 1 (required for merge, < 10 minutes): lint, type check, affected unit/component tests, build verification. Stage 2 (required for deploy, runs post-merge): full E2E test suite, visual regression tests, performance budgets, accessibility audits. This approach gives developers fast feedback on their PR while running comprehensive validation before deployment. A merge queue (GitHub merge queue or Trunk) ensures that only PRs that pass Stage 1 are merged, and the merge commit triggers Stage 2.

Level 5 — Developer Experience Improvements: Reduce the need for CI feedback loops by making local testing fast and accurate. Pre-commit hooks run lint and type check on staged files (using lint-staged). A local test watch mode (vitest --watch with changed-file detection) provides instant test feedback during development. If developers trust their local test results, they don't need to rely on CI for basic correctness — CI becomes a safety net rather than the primary feedback loop.`,
        shortAnswer: 'Parallelize pipeline tracks, cache aggressively (node_modules, build artifacts, test results), run only affected tests per PR, stage the pipeline (fast checks for merge, full suite for deploy), and improve local development testing for faster pre-CI feedback.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-test',
        tags: ['ci-cd', 'pipeline-optimization', 'caching', 'parallelization'],
        followUps: [
          'How would you handle flaky tests in the pipeline?',
          'What metrics would you track to measure CI health?',
          'How do you balance merge queue throughput with test comprehensiveness?'
        ]
      },
      {
        id: 'senior-test-3',
        question: 'Your production application has a critical bug that wasn\'t caught by tests. Post-mortem reveals it\'s a race condition in an async data flow. How would you prevent similar bugs in the future?',
        answer: `Race conditions in async data flows are among the most insidious bugs because they're intermittent, timing-dependent, and difficult to reproduce in tests. Preventing them requires improvements across testing, architecture, and monitoring.

Architectural Prevention: The most effective prevention is designing state management to be race-condition-immune. Common patterns include: using AbortController to cancel stale requests (when a user triggers a new search, abort the previous in-flight request, preventing the stale response from overwriting newer data), implementing request ordering with sequence numbers (each request carries a monotonically increasing ID, and responses with IDs lower than the latest sent request are discarded), and using state machines (XState) to model async flows explicitly — a state machine in the "loading" state rejects data arrivals that belong to a previous request context because the machine transitions enforce valid sequences.

I would conduct an audit of all async data flows in the application, categorizing them by race condition risk: high risk (search-as-you-type, autocomplete, paginated data loading where page might change during loading), medium risk (form submission with redirect, data refresh on focus), low risk (one-time data loads, initialization). For high-risk flows, I would refactor to use the AbortController + latest-wins pattern or a dedicated data fetching library (TanStack Query, which handles request deduplication and cancellation automatically).

Testing Improvements: Standard unit tests rarely catch race conditions because they test a single execution path. I would add specific async race condition tests. For example, to test that an autocomplete doesn't show stale results: fire two queries in rapid succession, mock the first to resolve slowly and the second to resolve quickly, then assert that the final displayed results correspond to the second (latest) query, not the first. React Testing Library's findBy queries and waitFor assertions help test these scenarios. For more thorough race condition detection, I would use property-based testing (fast-check library) that generates random sequences of async events and verifies invariants (e.g., "the displayed data always corresponds to the latest request").

Monitoring and Detection: Even with architectural and testing improvements, some race conditions will reach production. I would implement consistency monitoring: the client periodically verifies that displayed data matches the expected state (e.g., the search results correspond to the current search query). Inconsistencies are logged to the monitoring service with contextual data (the displayed query, the expected query, the request timeline). This catches race conditions that occur in production at frequencies too low to trigger user reports but high enough to affect experience quality.

Process Improvements: Add a "race condition review" checklist item to the code review process for any PR that involves async data flows. The reviewer checks: (1) Are stale responses handled (aborted or discarded)? (2) Is there a loading state that prevents duplicate submissions? (3) Are optimistic updates rolled back correctly on failure? (4) Is the happy path tested AND the race condition path tested? This checklist, combined with the architectural patterns above, creates a systematic defense against this bug category.`,
        shortAnswer: 'Prevent architecturally (AbortController, request sequencing, state machines), add race-condition-specific tests (simulate out-of-order async responses), implement consistency monitoring in production, and add a race condition review checklist for async data flow PRs.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-test',
        tags: ['race-conditions', 'async', 'testing', 'debugging', 'state-machines'],
        followUps: [
          'How would you test race conditions in E2E tests?',
          'What role does React Suspense play in preventing race conditions?',
          'How do you handle race conditions in collaborative real-time features?'
        ]
      },
      {
        id: 'senior-test-4',
        question: 'You need to set up production monitoring and observability for a React application. What metrics would you track, and how would you implement alerting?',
        answer: `Production monitoring for a frontend application covers three dimensions: user experience metrics (are users having a good experience?), error metrics (what is breaking?), and business metrics (are users achieving their goals?). I would implement monitoring across all three dimensions.

User Experience Metrics: The foundation is Real User Monitoring (RUM) using the web-vitals library, which captures Core Web Vitals from actual user sessions. I would track: LCP (Largest Contentful Paint) at p50, p75, and p95 — the p75 must stay under 2.5s. FID/INP (First Input Delay / Interaction to Next Paint) at p75 — must stay under 200ms. CLS (Cumulative Layout Shift) at p75 — must stay under 0.1. TTFB (Time to First Byte) as an infrastructure health indicator. These metrics are reported per-page, per-device-type (mobile/desktop), and per-connection-type (4G/3G) to identify segment-specific degradations. Additionally, I track custom experience metrics: time-to-interactive for key flows (how long until the user can search, can add to cart), and API response times from the client perspective (including network latency, not just server processing time).

Error Metrics: Sentry (or DataDog RUM) captures JavaScript errors, unhandled promise rejections, and component error boundary activations. Each error is enriched with context: user session ID (for reproduction), page URL, browser/OS, component stack trace, and breadcrumbs (user actions leading to the error). I configure alerts for: error rate spike (> 2x baseline for any error), new error types (errors not seen in the previous 24 hours — these are likely introduced by recent deployments), and error budget exhaustion (if > 1% of sessions experience errors, the error budget is exceeded). I also track API error rates by endpoint, distinguishing between client errors (4xx — likely frontend bugs) and server errors (5xx — backend issues).

Business Metrics: These connect technical performance to business outcomes. I track: page engagement (bounce rate, time on page, scroll depth), feature adoption (percentage of users using a feature post-launch), conversion funnel completion (sign-up, add-to-cart, checkout, purchase with step-by-step drop-off rates), and real-time active users. These metrics use custom event tracking (via Segment or a custom analytics pipeline) and are visualized in a business dashboard alongside technical metrics, enabling correlation: "the 15% increase in checkout abandonment correlates with the LCP regression on the cart page."

Alerting Strategy: Alerts must be actionable, not noisy. I implement tiered alerting: P1 (page the on-call engineer immediately): error rate > 5%, site down, payment flow broken. P2 (notify team channel within 30 minutes): error rate > 2%, Core Web Vitals regression > 20%, API error rate > 3%. P3 (daily digest): gradual performance degradation, increasing error trends, bundle size increase. Alerts use composite conditions to reduce false positives — a spike must persist for 5+ minutes before triggering, and the spike must affect > 100 users (avoiding alerts from a single user's bad network). I also implement deployment correlation: when an alert fires, the alerting system automatically links to the most recent deployment and its changelog, accelerating root cause identification.`,
        shortAnswer: 'Track three dimensions: user experience (Core Web Vitals via RUM, custom flow metrics), errors (Sentry with context enrichment, error budgets), and business metrics (conversion funnels, engagement). Implement tiered alerting (P1 page, P2 channel, P3 digest) with composite conditions and deployment correlation.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-test',
        tags: ['monitoring', 'observability', 'rum', 'alerting', 'core-web-vitals'],
        followUps: [
          'How would you implement distributed tracing for frontend-to-backend request flows?',
          'What is your approach to monitoring error budgets?',
          'How do you differentiate between infrastructure issues and code bugs from monitoring data?'
        ]
      },
      {
        id: 'senior-test-5',
        question: 'Your team struggles with code review quality — reviews are either rubber-stamped or become multi-day bikeshedding sessions. How would you establish effective code review practices?',
        answer: `Effective code review is a team culture challenge as much as a process challenge. I would address it by establishing clear expectations, providing structural tools, and creating a feedback loop.

Establish Review Standards: Create a written code review guide that defines what reviewers should focus on and what they should ignore. Reviewers should focus on: correctness (does the code do what it's supposed to?), architecture (does the design fit the system, is it maintainable?), edge cases and error handling, security implications, and performance implications for hot paths. Reviewers should NOT focus on: style and formatting (automated by Prettier and ESLint), naming preferences (unless genuinely confusing), patterns already approved in the architecture — these subjective debates cause bikeshedding. The guide includes a decision framework: "Would I feel comfortable being on-call when this code runs in production?" If yes, approve. If no, explain the specific concern.

Structural Process Improvements: Size limits are the most impactful process change. PRs over 400 lines of code receive significantly less effective review — reviewers fatigue and rubber-stamp. I would enforce a soft limit of 300 lines per PR (excluding generated code and test files), encouraging developers to break large features into sequential PRs. PR descriptions must include: what changed and why, how to test the change, screenshots/videos for UI changes, and notes on areas where the author wants specific feedback. A PR template enforces this structure.

Review efficiency techniques include: labeling PRs by review depth needed (quick-review for typo fixes, standard-review for feature work, deep-review for architecture changes), assigning reviewers based on code ownership (CODEOWNERS file), setting SLAs (first review comment within 4 business hours, not calendar hours), and using "stacked PRs" (sequential, dependent PRs) for large features so each PR is reviewable in isolation.

Feedback Quality: Train the team on constructive review practices. Comments should be categorized: "nit:" for non-blocking suggestions, "question:" for understanding clarification, "suggestion:" for alternative approaches (with explanation of tradeoffs), and "blocker:" for issues that must be fixed before merge. This categorization eliminates ambiguity — reviewers know which comments require action and which are FYI. Encourage "approve with comments" for PRs with only nits, avoiding the pattern where a reviewer leaves 5 nits and the author must make changes and wait for re-review just for minor suggestions.

Metrics and Feedback Loop: Track review metrics to identify bottlenecks: time-to-first-review, time-to-merge, review rounds per PR, and PR size distribution. Share these metrics monthly with the team. If time-to-first-review is consistently high for certain teams, investigate and address the cause. If certain reviewers consistently produce multi-round reviews, pair them with the author for a live review session to improve communication. Retrospect on escaped bugs — when a production bug is found, trace it back to the PR and understand why the review didn't catch it (was it a gap in the review checklist? a lack of domain expertise? time pressure?). These retrospectives continuously improve the review process.`,
        shortAnswer: 'Establish a written review guide (focus on correctness/architecture, not style), enforce PR size limits (~300 lines), categorize comments (nit/question/suggestion/blocker), set review SLAs, use CODEOWNERS for routing, and track review metrics for continuous improvement.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-test',
        tags: ['code-review', 'team-process', 'quality', 'culture'],
        followUps: [
          'How would you handle disagreements between reviewer and author?',
          'What is your approach to reviewing PRs from junior developers vs senior developers?',
          'How would you integrate automated review tools (AI code review) into the process?'
        ]
      },
      {
        id: 'senior-test-6',
        question: 'How would you implement feature flags in a React application, and what are the architectural considerations for managing them at scale?',
        answer: `Feature flags are essential for progressive delivery, A/B testing, and operational safety, but they introduce significant complexity if not managed properly. I would implement a feature flag system with clear lifecycle management.

Implementation Architecture: I would use a dedicated feature flag service (LaunchDarkly, Unleash, or a custom solution) rather than hardcoded conditionals. The service provides a React SDK that fetches flag configurations on app initialization and provides them via context. A FeatureFlagProvider wraps the app root, and components access flags via a useFeatureFlag("flag-name") hook that returns the flag's value (boolean, string, number, or JSON). Flag evaluation happens client-side using rules downloaded from the service (targeting by user ID, user segment, percentage rollout, geographic region). This architecture enables: instant flag toggling without deployment, percentage-based rollouts, user-targeted overrides, and A/B testing with analytics integration.

The React implementation uses a multi-layer approach: the FeatureFlagProvider fetches flags on mount and provides them via context, a useFeatureFlag hook reads from context with a default value fallback (used when the service is unreachable), and a FeatureGate component provides declarative conditional rendering: <FeatureGate flag="new-checkout"><NewCheckout /></FeatureGate>. For server-side rendering, flags are evaluated on the server and passed to the client as serialized state, avoiding a flash of wrong content during hydration.

Lifecycle Management: Feature flags have a lifecycle: created → ramping (percentage rollout) → fully enabled → cleanup (code removal). The biggest operational risk of feature flags is accumulation — flags that are never cleaned up create "flag debt" that makes the codebase increasingly complex. I implement lifecycle management through: expiration dates (every flag has a planned removal date, set at creation), automated reminders (weekly alerts for flags past their expiry date), code scanning (a CI check that detects flag references in code and reports flags that have been fully enabled for more than 30 days — these are candidates for cleanup), and a "flag cleanup" task in every sprint (dedicate 10% of sprint capacity to removing old flags).

Architectural Considerations at Scale: With 50+ active flags, evaluation performance matters. Flag configurations should be cached client-side (in memory, refreshed via streaming or polling) — a network round-trip for each flag check would be unacceptable. Flag dependencies create complexity: if flag B depends on flag A being enabled, this must be documented and enforced. I implement a flag dependency graph that the service validates (preventing circular dependencies or orphaned flags).

Testing with flags adds dimensionality — each flag doubles the number of possible application states. Rather than testing every combination, I test flags in their default state (off) and their enabled state independently. For critical flags, I test the rollout transition (50% on, 50% off) to ensure both variants coexist correctly. E2E tests use flag overrides to test specific variants without waiting for percentage-based rollout to target the test user.`,
        shortAnswer: 'Use a dedicated flag service (LaunchDarkly/Unleash) with React context provider, implement declarative FeatureGate components, enforce flag lifecycle management (expiry dates, automated cleanup reminders), and test flags in isolation with CI checks for flag debt.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-test',
        tags: ['feature-flags', 'progressive-delivery', 'a-b-testing', 'architecture'],
        followUps: [
          'How would you handle a feature flag that causes a performance regression?',
          'What is the difference between feature flags and configuration?',
          'How do you handle feature flags in a micro-frontend architecture?'
        ]
      },
      {
        id: 'senior-test-7',
        question: 'Your application has 2,000 tests but 15% of them are flaky — they intermittently pass and fail without code changes. How would you address test flakiness at this scale?',
        answer: `Test flakiness at 15% is a severe problem — it means developers can't trust test results, leading to either ignoring failures (missed bugs) or re-running CI multiple times (wasted resources and time). I would address this with a systematic identification, quarantine, and fix approach.

Step 1 — Identification and Measurement: First, I need to know exactly which tests are flaky and how frequently they fail. I would implement test result tracking in CI — each test run records pass/fail per test to a database (many CI platforms provide this, or tools like Buildkite Analytics or Allure TestOps). After collecting data for 1-2 weeks, I generate a flakiness report: test name, failure rate over the last 100 runs, and last failure timestamp. Tests with failure rates between 1-99% are flaky. I sort by failure rate (highest = most impactful) and by how many CI pipelines they block (tests in critical paths are higher priority).

Step 2 — Quarantine: While fixing flaky tests, I need to restore developer trust in the CI pipeline immediately. I implement a quarantine strategy: tests identified as flaky (failure rate > 5%) are moved to a separate "quarantine" test suite that runs in CI but doesn't block merges. This immediately reduces false positives from 15% to near 0%. The quarantine suite still runs and reports results, providing data for fixing. A dashboard shows the quarantine queue, and the team has a goal: reduce the quarantine to zero within a defined timeframe.

Step 3 — Root Cause Analysis and Fixing: Common causes of flakiness in React applications include: (a) Timing issues — tests that rely on setTimeout or setTimeout-dependent behavior (animations, debouncing) without properly advancing timers. Fix: use vi.useFakeTimers() and explicitly advance time. (b) Async assertion timing — tests that check for a condition before the async operation completes. Fix: use findBy queries (which retry with a timeout) instead of getBy queries, and use waitFor for assertions that depend on async updates. (c) Test isolation — tests that share mutable state (global variables, module-level singletons, localStorage) and interfere with each other. Fix: reset shared state in beforeEach, use test isolation features (Vitest's --isolate flag). (d) Network dependency — tests that make real API calls and fail due to network issues or API changes. Fix: mock all API calls at the fetch level using MSW (Mock Service Worker). (e) Snapshot brittleness — snapshot tests that fail due to whitespace, generated IDs, or timestamps. Fix: use stable IDs in test environments and serialize snapshots with custom serializers that strip volatile data.

Step 4 — Prevention: After fixing existing flaky tests, prevent new ones. I add a CI check that detects flakiness proactively: each new or modified test runs 5 times in CI (on the PR, not post-merge). If it passes 5/5, it's deemed stable. If it fails even once, the PR is blocked with a message indicating flakiness. This catches flaky tests before they enter the codebase. Additionally, I establish testing guidelines that address the root causes above: always use fake timers for time-dependent tests, always use findBy for async content, always mock external services, and never rely on test execution order.`,
        shortAnswer: 'Track test results to identify flaky tests by failure rate, quarantine them (run but don\'t block CI) to restore trust immediately, fix by root cause (timing, async assertions, shared state, network deps), and prevent new flakiness with automatic multi-run detection on PRs.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-test',
        tags: ['flaky-tests', 'test-reliability', 'ci-cd', 'testing'],
        followUps: [
          'How would you prioritize which flaky tests to fix first?',
          'What is the cost of test flakiness in terms of developer productivity?',
          'How do you handle flaky E2E tests that depend on external services?'
        ]
      },
      {
        id: 'senior-test-8',
        question: 'How would you implement automated accessibility testing as part of your CI/CD pipeline?',
        answer: `Accessibility testing in CI/CD must catch regressions automatically while acknowledging that automated tools can only detect 30-40% of accessibility issues. I would implement a multi-layer approach that maximizes automated coverage and supplements with manual processes.

Layer 1 — Static Analysis (Linting): eslint-plugin-jsx-a11y runs on every file save and in CI, catching common issues: missing alt text on images, missing label associations on form inputs, incorrect ARIA attribute usage, non-interactive elements with click handlers (div instead of button), and missing lang attributes. This catches issues at the earliest stage (authoring time) with zero runtime cost. I configure it as an error (not warning) for high-impact rules (no-noninteractive-element-interactions, alt-text, label-has-associated-control) and as a warning for lower-impact rules.

Layer 2 — Component-Level Testing: In component tests (React Testing Library), I enforce accessibility patterns through testing conventions. Tests use getByRole, getByLabelText, and getByText selectors — these queries inherently verify that accessible names and roles are present. If a button can't be found by its accessible name, the test fails, surfacing the accessibility issue. I add explicit assertions for dynamic accessibility attributes: expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true'). For complex custom widgets (combobox, tabs, tree view), I write dedicated accessibility test suites that verify keyboard navigation patterns (Tab order, arrow key behavior, Enter/Escape handling) and ARIA state management.

Layer 3 — Automated Audit in CI: I integrate axe-core (the accessibility testing engine) into both component tests and E2E tests. For component tests, the jest-axe or vitest-axe library runs axe against the rendered component DOM after each test: const results = await axe(container); expect(results).toHaveNoViolations(). This catches issues like insufficient color contrast, missing form labels, and incorrect heading hierarchy. In E2E tests (Playwright), I run @axe-core/playwright on each critical page after it fully renders, checking the complete page including dynamically loaded content. The CI pipeline fails on any "critical" or "serious" violation and reports "moderate" violations as warnings.

Layer 4 — Visual Regression for Accessibility: I configure Storybook with a11y addon and visual regression testing. Each component story includes a accessibility test panel that runs axe, and the visual regression baseline includes a high-contrast mode variant. When a design change reduces color contrast or changes focus indicators, the visual regression test catches it.

Layer 5 — Manual Processes: Automated testing supplements but doesn't replace manual testing. I establish: screen reader testing as part of the QA process for new features (testing with NVDA on Windows, VoiceOver on macOS), keyboard-only navigation testing for all interactive flows, and quarterly accessibility audits by a specialist (internal or external) who tests with assistive technologies and provides a prioritized issue list. The audit findings feed back into automated rules — if the audit finds a pattern of missing live region announcements, I add a custom ESLint rule or test helper that checks for live regions in components that display dynamic content.`,
        shortAnswer: 'Four automated layers: eslint-plugin-jsx-a11y for static analysis, React Testing Library role-based queries for component tests, axe-core integration in both component and E2E tests for automated audits, and visual regression for contrast/focus. Supplement with manual screen reader and keyboard testing.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-test',
        tags: ['accessibility', 'a11y', 'automated-testing', 'axe-core', 'ci-cd'],
        followUps: [
          'What percentage of WCAG criteria can be tested automatically?',
          'How would you handle accessibility testing for dynamic content (modals, dropdowns)?',
          'How do you prioritize accessibility issues when you have a large backlog?'
        ]
      }
    ]
  },
  {
    id: 'senior-api',
    title: 'API & Data',
    description: 'API architecture patterns, BFF pattern, GraphQL vs REST decisions, data normalization, optimistic updates, offline support, and data management strategies.',
    category: 'Senior',
    difficulty: 'Senior',
    tags: ['api', 'graphql', 'rest', 'data-normalization', 'optimistic-updates', 'offline'],
    questions: [
      {
        id: 'senior-api-1',
        question: 'Your frontend team is debating whether to use GraphQL or REST for a new product. The backend team offers both. What factors drive your decision, and in what scenarios would you choose each?',
        answer: `This decision depends on the specific product requirements, team expertise, and architectural context. Neither technology is universally superior — each excels in different scenarios. I would evaluate several dimensions.

Choose GraphQL when: (1) The frontend has complex, varied data requirements — multiple pages need different subsets of the same entities. A user profile page needs name, avatar, and bio; a user card needs name and avatar; a user settings page needs name, email, phone, and preferences. With REST, you either over-fetch (one endpoint returns everything) or create multiple bespoke endpoints. GraphQL's field selection solves this naturally. (2) The product involves deep, relational data — a social network where a post includes the author, their friends who liked it, comments with their authors, and each author's profile. GraphQL's nested query structure maps naturally to this data shape, while REST would require multiple sequential requests or a complex compound endpoint. (3) The frontend is rapidly iterating — GraphQL allows frontend developers to change data requirements without backend changes, accelerating development when the frontend is evolving faster than the backend.

Choose REST when: (1) The data model is simple and well-defined — CRUD operations on flat resources (users, orders, products) where each endpoint returns a consistent shape. REST's simplicity is an advantage here; GraphQL adds complexity without proportional benefit. (2) Caching is critical — REST's URL-based caching (each URL = a cacheable resource) works naturally with CDN, browser cache, and proxy caches. GraphQL's POST-based queries are harder to cache at the HTTP level (though Apollo Client and Relay provide application-level caching). For public, high-traffic pages where CDN caching is essential (product catalog, marketing pages), REST is simpler. (3) File upload/download is a primary use case — REST handles multipart file uploads and streaming downloads naturally, while GraphQL requires workarounds (separate REST endpoints for file operations alongside GraphQL for data). (4) The team has limited GraphQL experience — the learning curve for GraphQL (schema design, resolver patterns, N+1 query prevention, client-side cache normalization) is significant. If the backend team is new to GraphQL, the initial implementation may have performance issues.

A hybrid approach is often optimal: use GraphQL for complex, frequently-changing product pages where the data requirements are varied and evolving, and use REST for simple CRUD operations, file handling, and high-cache-priority public pages. The BFF (Backend for Frontend) pattern can provide a GraphQL layer over REST microservices, giving the frontend the benefits of GraphQL without requiring every backend service to implement GraphQL resolvers.

In terms of developer experience, I'd also consider the tooling ecosystem. GraphQL's typed schema provides automatic TypeScript type generation (using graphql-codegen), eliminating the need to manually maintain API types. REST can achieve similar type safety with OpenAPI specs and code generation, but it requires more deliberate effort. Both approaches can provide excellent developer experience when properly tooled.`,
        shortAnswer: 'Choose GraphQL for complex/varied data requirements, deep relational data, and rapid frontend iteration. Choose REST for simple CRUD, CDN-cacheable content, and file operations. Consider a hybrid BFF approach that uses GraphQL over REST microservices.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-api',
        tags: ['graphql', 'rest', 'api-design', 'bff', 'architecture'],
        followUps: [
          'How would you handle the N+1 query problem in GraphQL?',
          'What is the role of GraphQL subscriptions vs WebSocket-based real-time?',
          'How do you prevent overly complex GraphQL queries from impacting backend performance?'
        ]
      },
      {
        id: 'senior-api-2',
        question: 'Your application needs to work offline and sync data when connectivity resumes. Walk me through your architecture for offline-first data management.',
        answer: `Offline-first architecture treats the network as an enhancement rather than a requirement. The core principle is: the application must be fully functional with local data, syncing to the server when possible. I would implement this using a layered architecture with IndexedDB as the local source of truth.

Data Layer Architecture: The application's data access layer abstracts the data source. Components call data hooks (useTodos(), useUser()) that read from a local store (IndexedDB via a library like Dexie.js). Writes go to the local store immediately and are queued for server sync. A SyncEngine processes the queue when online, sending mutations to the server and applying server responses back to the local store. From the component's perspective, data operations are synchronous and always succeed locally — the network is a background concern.

Write Path — Conflict Resolution: When the user creates, updates, or deletes data offline, the mutation is stored in an "outbox" table in IndexedDB with the mutation type, entity, payload, and timestamp. When connectivity resumes, the SyncEngine processes the outbox in order, sending each mutation to the server. The server may reject or modify mutations due to conflicts (another user edited the same entity while this user was offline). Conflict resolution strategies include: last-write-wins (simplest, uses timestamps — the most recent write wins), server-wins (the server version always takes precedence, and the client re-fetches), client-wins (the client version overwrites the server), and manual merge (present both versions to the user and let them choose). The choice depends on the data type: for user preferences, last-write-wins is fine; for collaborative documents, manual merge or CRDT-based automatic merge is necessary.

Read Path — Data Freshness: The read path implements a stale-while-revalidate pattern. On app load, data is read from IndexedDB and rendered immediately (even if the data is hours old). In the background, the SyncEngine fetches fresh data from the server using delta sync — sending a "give me everything changed since timestamp X" request. The server responds with changed entities, which are merged into the local IndexedDB store. Components re-render with the fresh data. For most use cases, this background sync is invisible to the user — the transition from stale to fresh data happens without loading spinners.

Storage and Capacity Management: IndexedDB has browser-defined storage limits (typically 50-80% of available disk space, shared with the origin). For data-heavy applications, I implement a storage budget: recent data is always cached, older data is evictable, and large binary assets (images, files) are cached with an LRU eviction policy. The application monitors storage usage via navigator.storage.estimate() and proactively evicts low-priority data when approaching limits. A "Download for offline" feature lets users explicitly cache specific datasets (e.g., project data for a field worker) with a storage usage indicator.

Service Worker Integration: The service worker caches the application shell (HTML, CSS, JS) for instant offline loading and intercepts API requests. For cacheable GET requests, the service worker implements stale-while-revalidate (serve from cache, update in background). For mutation requests (POST, PUT, DELETE), the service worker queues failed requests using the Background Sync API, which automatically retries when connectivity resumes — even if the application tab is closed. This provides a safety net for mutations that the SyncEngine's in-app outbox doesn't catch (e.g., the user closes the tab while offline).`,
        shortAnswer: 'Use IndexedDB as the local source of truth via Dexie.js, write mutations to a local outbox for background sync, implement delta-sync for reads (stale-while-revalidate), handle conflicts with strategy per data type (last-write-wins, manual merge, CRDT), and use service worker with Background Sync API as a safety net.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-api',
        tags: ['offline-first', 'indexeddb', 'sync', 'service-worker', 'conflict-resolution'],
        followUps: [
          'How would you test offline functionality in automated tests?',
          'What are the storage limitations of IndexedDB across browsers?',
          'How do you handle schema migrations for IndexedDB?'
        ]
      },
      {
        id: 'senior-api-3',
        question: 'Your application makes 15+ API calls on the initial page load, causing waterfall delays and slow Time to Interactive. How would you optimize the data fetching architecture?',
        answer: `Fifteen API calls on initial load is a symptom of a fragmented data architecture. I would address this at multiple levels: reducing the number of requests, parallelizing unavoidable requests, and optimizing the data flow.

Reduce Requests — BFF Pattern: A Backend-for-Frontend (BFF) layer aggregates multiple backend API calls into a single frontend-optimized endpoint. Instead of the client calling /api/user, /api/preferences, /api/notifications/count, /api/features, and /api/config separately, a single BFF endpoint GET /api/page-data/dashboard returns all the data needed for the dashboard in one response. The BFF makes the 5 backend calls in parallel server-side (where latency is 1-5ms vs 50-200ms client-to-server), assembles the response, and returns it. This technique alone can reduce 15 client requests to 2-3 BFF requests.

Reduce Requests — Data Loader Pattern: For GraphQL backends, use DataLoader to batch and deduplicate requests. For REST, implement a similar pattern: a RequestBatcher that collects data needs from multiple components during a render cycle (using requestAnimationFrame or queueMicrotask timing) and merges them into a single batched request. The server supports a batch endpoint: POST /api/batch with a body containing multiple request descriptors, returning all results in a single response.

Parallelize — Remove Waterfalls: Analyze the dependency graph of the 15 calls. Often, calls that appear sequential are actually independent. User data and notification count can fetch in parallel. The common React antipattern is nested useEffect chains where a parent fetches data, renders children, and children fetch their own data — creating a request waterfall. The fix is to hoist data fetching to the route level using a data loader pattern (React Router's loader, Next.js's getServerSideProps, or a custom pre-fetch hook). All independent data requirements for a page are fetched in parallel before any components render.

Optimize — Prefetch and Cache: For data that's needed across pages (user session, theme, feature flags), fetch it once at app initialization and cache it globally. For predictable navigation patterns (the user is on the product list and will likely click a product), prefetch the product detail data on hover using React Query's prefetchQuery. For repeat visits, serve cached data from the previous session via persisted React Query cache, providing instant rendering while background revalidation fetches fresh data.

Optimize — Streaming and Progressive Loading: For pages with both above-the-fold critical data and below-the-fold supplementary data, split the BFF response into streamed chunks. The BFF sends the critical data first (user info, page title, primary content) and streams the rest as it resolves. With React 18's streaming SSR and Suspense, the critical content renders immediately while supplementary data (recommendations, analytics, recently viewed) loads progressively with skeleton placeholders. This approach reduces Time to Interactive to the time for the first (critical) data chunk, while the remaining data loads in the background.

As a concrete optimization plan for 15 calls: consolidate into 2-3 BFF endpoints (critical page data, supplementary data, real-time data), parallelize the BFF calls, cache stable data across navigations, and stream the BFF response for progressive rendering. Target: 1-2 round-trips for initial render, no waterfalls, sub-2-second TTI.`,
        shortAnswer: 'Consolidate into 2-3 BFF endpoints that aggregate backend calls server-side, remove waterfalls by hoisting data fetching to route level, parallelize independent requests, cache stable data across pages, and use streaming SSR with Suspense for progressive rendering.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-api',
        tags: ['data-fetching', 'bff', 'waterfall', 'performance', 'streaming'],
        followUps: [
          'How would you measure and track request waterfall depth?',
          'What are the tradeoffs of a BFF vs letting the client orchestrate?',
          'How does HTTP/2 multiplexing change the calculus for multiple requests?'
        ]
      },
      {
        id: 'senior-api-4',
        question: 'How would you implement optimistic updates in a React application that handles complex entity relationships (e.g., adding a comment that also updates the post\'s comment count)?',
        answer: `Optimistic updates that span multiple entities are significantly more complex than simple single-entity optimism. The challenge is maintaining consistency across related entities during the optimistic window and correctly rolling back all affected entities on failure. I would implement this using TanStack Query's mutation lifecycle hooks with a structured approach.

The Pattern: When the user adds a comment, three things need to happen optimistically: (1) the comment appears in the comment list, (2) the post's comment count increments, and (3) potentially a "latest comment" preview on the post card updates. All three must happen atomically — the user shouldn't see the count increment without the comment appearing.

Implementation with TanStack Query: The mutation uses onMutate, onError, and onSettled callbacks. In onMutate (called before the server request), I snapshot the current cache state for rollback, then update all affected queries optimistically. The key is using queryClient.setQueryData to directly modify the cache for each affected query: insert the new comment into the comments list query, increment the comment count in the post query, and update the latest comment preview in the posts list query. Each cache update uses a function form (setQueryData(key, old => newValue)) that safely handles the case where the query hasn't been fetched yet (old is undefined).

Rollback Strategy: The onMutate callback returns a context object containing snapshots of all modified queries: { previousComments: [...], previousPost: {...}, previousPostsList: [...] }. If the server request fails, onError receives this context and restores all snapshots: queryClient.setQueryData(['comments', postId], context.previousComments). This atomic rollback ensures all entities return to their pre-optimistic state simultaneously. The user sees the comment disappear and the count decrement together, with a toast notification: "Couldn't add your comment — please try again."

Reconciliation on Success: In onSettled (called after success or failure), I invalidate all affected queries to reconcile the optimistic state with the actual server state. Even on success, the server's response may differ from the optimistic prediction — the server assigns the actual comment ID (the optimistic ID was client-generated), timestamps, and potentially modifies the content (sanitization, formatting). Query invalidation triggers a background refetch that replaces the optimistic data with server-confirmed data.

Handling Complex Scenarios: For scenarios with many related entities, I use a mutation helper that declaratively describes the optimistic updates: defineMutation({ mutationFn: addComment, optimisticUpdates: [{ queryKey: ['comments', postId], updater: (old, newComment) => [...old, newComment] }, { queryKey: ['post', postId], updater: (old) => ({ ...old, commentCount: old.commentCount + 1 }) }], rollbackOn: 'error' }). This declarative approach is more maintainable than imperative cache manipulation scattered across mutation callbacks, and it automatically handles snapshots and rollback.

Edge Cases: Race conditions occur when multiple optimistic mutations overlap. If the user rapidly adds two comments, the second mutation's snapshot includes the first mutation's optimistic data. If the first mutation fails and rolls back, the second mutation's snapshot (which it would rollback to on its own failure) includes the first comment that no longer exists. The solution is to use a mutation queue that processes mutations sequentially, or to use absolute rollback (rollback to the last server-confirmed state rather than the per-mutation snapshot). TanStack Query's mutation cache provides tools for inspecting pending mutations and coordinating rollbacks.`,
        shortAnswer: 'Use TanStack Query mutation lifecycle hooks: snapshot all affected queries in onMutate, apply optimistic updates to comments list AND post count atomically, rollback all snapshots in onError, and invalidate affected queries in onSettled for server reconciliation. Use a declarative updater pattern for maintainability.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-api',
        tags: ['optimistic-updates', 'react-query', 'cache-management', 'mutations'],
        followUps: [
          'How would you handle optimistic updates for delete operations?',
          'What happens if the server returns a different shape than expected?',
          'How do optimistic updates interact with pagination?'
        ]
      },
      {
        id: 'senior-api-5',
        question: 'You are designing the API layer for a React application that consumes 10 microservices. How would you implement a type-safe, maintainable API client?',
        answer: `A type-safe API client for 10 microservices needs to be centralized (single source of truth for API contracts), generated (not hand-maintained), and resilient (handling errors, retries, and authentication consistently). I would implement a schema-driven API client with code generation.

Schema-Driven Design: Each microservice publishes its API contract as an OpenAPI (Swagger) specification or GraphQL schema. These schemas are the single source of truth for both the backend team and the frontend team. I set up a CI job that fetches the latest schemas from each service's repository (or a central schema registry) and generates TypeScript API client code using code generation tools. For REST APIs: openapi-typescript-codegen or orval generates typed request functions and response interfaces. For GraphQL: graphql-codegen generates typed query hooks, mutation functions, and response types. The generated code provides full type safety — if the backend changes an endpoint's response shape, the regenerated types cause TypeScript compilation errors in consuming code, catching breaking changes at build time.

API Client Architecture: The generated functions are low-level (HTTP request wrappers). I layer a high-level API client on top with cross-cutting concerns. The architecture has three layers: (1) Generated Layer — typed request/response functions per endpoint (generated, never manually edited). (2) Client Layer — a configured HTTP client (fetch-based or axios-based) with interceptors for authentication (attaching the access token), error handling (parsing error responses into typed errors), retry logic (exponential backoff for 5xx, circuit breaker for repeated failures), request/response logging (in development), and request timing (for performance monitoring). (3) Hook Layer — React hooks that connect TanStack Query with the typed API functions: useUser(id) wraps queryClient.fetchQuery({ queryKey: ['user', id], queryFn: () => userApi.getUser(id) }). This layer provides caching, loading states, error states, and automatic refetching.

Error Handling Standardization: Each microservice has its own error format. The API client normalizes errors into a consistent AppError type: { code: string, message: string, status: number, details?: Record<string, unknown>, retryable: boolean }. The client layer catches HTTP errors and transforms them into AppErrors, which the UI consistently handles. A central ErrorHandler maps error codes to user-facing messages and actions, avoiding scattered error message strings throughout components.

Versioning and Breaking Changes: API versioning is handled at the URL level (/v1/users, /v2/users) or via Accept headers. The code generation is version-aware — generating separate client modules for v1 and v2 endpoints. Migration from v1 to v2 happens gradually: the API client supports both versions simultaneously, and components are migrated one at a time. The CI pipeline includes a "contract test" that verifies the frontend's API usage against the published schemas, catching incompatibilities before deployment.

Monorepo Organization: In a monorepo, the API clients live in a shared package (@app/api-clients) with sub-packages per service (@app/api-clients/user, @app/api-clients/orders). The code generation runs as a build step for this package, and consuming applications import typed hooks and functions. When a schema changes, only the affected client package regenerates, and the TypeScript compiler immediately flags any consuming code that needs updates.`,
        shortAnswer: 'Use schema-driven code generation (openapi-typescript-codegen or graphql-codegen) from service OpenAPI/GraphQL specs, layer a cross-cutting HTTP client with auth/retry/error handling, wrap in TanStack Query hooks for caching, normalize errors into a consistent AppError type, and run contract tests in CI.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-api',
        tags: ['api-client', 'type-safety', 'code-generation', 'microservices', 'architecture'],
        followUps: [
          'How would you handle API versioning when multiple versions coexist?',
          'What is your strategy for mocking API clients in tests?',
          'How do you handle service-to-service authentication for BFF calls?'
        ]
      },
      {
        id: 'senior-api-6',
        question: 'Your React application fetches deeply nested data from an API (user → posts → comments → replies). Different parts of the UI show different levels of this hierarchy. How would you normalize and manage this relational data?',
        answer: `Deeply nested data creates two problems in React applications: data duplication (the same entity appears in multiple nested locations, leading to inconsistent updates) and re-rendering cascades (updating a deeply nested property triggers re-renders of the entire tree). Data normalization solves both problems by flattening the hierarchy into separate entity tables.

Normalization Strategy: I would transform the API response from nested to normalized form using a normalization library (normalizr) or a custom transformer. The nested response { user: { id: 1, posts: [{ id: 10, comments: [{ id: 100, author: { id: 2, name: "Alice" } }] }] } } becomes normalized entities: users: { 1: { id: 1, postIds: [10] }, 2: { id: 2, name: "Alice" } }, posts: { 10: { id: 10, userId: 1, commentIds: [100] } }, comments: { 100: { id: 100, postId: 10, authorId: 2 } }. Each entity is stored once, referenced by ID. When Alice changes her name, updating users[2].name propagates everywhere Alice appears.

Implementation with TanStack Query: Rather than a Redux-style global normalized store, I implement normalization at the React Query cache level. When a query returns nested data, the onSuccess callback normalizes the response and distributes entities across separate query caches: queryClient.setQueryData(['user', 1], normalizedUser) for each entity. Components consume data via entity-specific hooks: useUser(1) reads from the ['user', 1] cache, usePost(10) reads from ['post', 10]. The original nested query's cache stores only the top-level IDs and their relationships, acting as an index.

This approach provides several benefits: (1) Any component that shows user 2 (Alice) automatically gets her latest data because they all read from the same cache entry. (2) Updating Alice's name via a mutation only invalidates the ['user', 2] cache, not every query that includes Alice's posts or comments. (3) Components subscribe to exactly the entities they display — a PostCard showing post 10 re-renders when post 10 changes but not when comment 100 changes, even though the original API response included both.

Selector Pattern for Derived Views: Different UI sections need different projections of the same data. The PostList needs { title, authorName, commentCount }. The PostDetail needs { title, content, authorName, comments: [...] }. I create typed selector hooks that compose entity lookups: usePostWithAuthor(postId) reads from ['post', postId] and ['user', post.authorId] and returns a combined view. These selectors memoize their output to prevent re-renders when unrelated entities change.

Trade-offs: Normalization adds complexity — the normalization/denormalization layer requires maintenance, and debugging normalized data structures is harder than debugging nested objects. For simple UIs with shallow nesting (1-2 levels), normalization overhead isn't justified. I apply normalization selectively: entities that appear in multiple places (users, tags, categories) are normalized; data that's used in only one context (page metadata, configuration) stays nested. The decision matrix is: if an entity is displayed in 3+ different views, it should be normalized.`,
        shortAnswer: 'Normalize API responses into flat entity tables (users, posts, comments), store in separate TanStack Query caches keyed by entity type and ID, create selector hooks that compose entities into view-specific shapes, and apply normalization selectively to entities that appear in 3+ views.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-api',
        tags: ['data-normalization', 'relational-data', 'react-query', 'selectors'],
        followUps: [
          'How does GraphQL client-side caching (Apollo, Relay) handle normalization automatically?',
          'How do you handle entity deletion in a normalized cache?',
          'What is the performance impact of normalization vs denormalization?'
        ]
      },
      {
        id: 'senior-api-7',
        question: 'Your team needs to implement real-time data synchronization between multiple browser tabs of the same application. How would you approach this?',
        answer: `Cross-tab synchronization is needed for consistent UX — when a user logs out in one tab, all tabs should reflect the logout; when they add an item to the cart in one tab, the cart count in another tab should update. I would implement a multi-channel approach.

BroadcastChannel API: The primary mechanism is the BroadcastChannel API, which enables same-origin tabs to communicate directly without a server. I create a channel per concern: new BroadcastChannel('auth-sync') for authentication state, new BroadcastChannel('cart-sync') for cart data, and new BroadcastChannel('data-sync') for general data cache updates. When a tab performs a mutation (add to cart, log out, update preferences), it posts a message to the relevant channel. All other tabs receive the message and update their local state accordingly.

The implementation wraps BroadcastChannel in a TabSyncManager class that handles message serialization, deduplication (prevent infinite loops where tab A's update triggers tab B's update which triggers tab A's update), and channel lifecycle management. Each message includes a source tab ID and a monotonic sequence number. Tabs ignore messages from themselves (source === selfId) and messages with sequence numbers they've already processed.

TanStack Query Cache Synchronization: For data cache synchronization, I integrate the TabSyncManager with TanStack Query. When a mutation in tab A invalidates or updates a query cache, the onSuccess callback broadcasts the cache update to other tabs. Other tabs receive the update and apply it to their query cache via queryClient.setQueryData or queryClient.invalidateQueries. This ensures that if tab A fetches fresh data, tab B doesn't need to re-fetch — it receives the same data via the broadcast.

Storage Event Fallback: For browsers that don't support BroadcastChannel (older browsers), I fall back to the storage event. Writing to localStorage triggers a storage event in all other same-origin tabs. The pattern: write JSON.stringify({ type, payload, timestamp }) to a specific localStorage key, and listen for storage events on that key. The limitation is that storage events only fire when localStorage changes, so the same value can't be broadcast twice (I append a timestamp to ensure uniqueness).

Service Worker Coordination: For more complex scenarios, a shared service worker can act as a central coordinator. All tabs communicate with the service worker via the MessageChannel or client.postMessage APIs. The service worker maintains a single WebSocket connection to the server (rather than one per tab, which wastes resources and can cause rate limiting) and distributes received messages to all connected tabs. This is especially useful for real-time applications (chat, notifications) where reducing WebSocket connections from N tabs to 1 significantly reduces server load.

Conflict Resolution: When two tabs make conflicting changes simultaneously (tab A sets quantity to 3, tab B sets quantity to 5), the last-write-wins approach using timestamps is usually sufficient for cart and preference data. For more critical data, the changes are sent to the server, which resolves conflicts and broadcasts the canonical state. The server's response, distributed via the service worker, ensures all tabs converge to the same state.`,
        shortAnswer: 'Use BroadcastChannel API for direct tab-to-tab communication, integrate with TanStack Query cache for data sync, fall back to localStorage storage events for older browsers, and optionally use a shared service worker to coordinate a single WebSocket connection across tabs.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-api',
        tags: ['cross-tab', 'broadcast-channel', 'synchronization', 'service-worker'],
        followUps: [
          'How would you handle tab synchronization for authentication state (logout)?',
          'What happens when the shared service worker updates?',
          'How do you test cross-tab synchronization?'
        ]
      },
      {
        id: 'senior-api-8',
        question: 'Your application needs to handle paginated data that changes frequently (new items are added, existing items are updated or deleted while the user is browsing). How would you implement robust pagination?',
        answer: `Pagination with frequently changing data is one of the most challenging frontend data problems because the "page" is a moving target. I would implement cursor-based pagination with real-time synchronization.

Why Not Offset Pagination: Offset-based pagination (page=2&limit=20 → skip 20, take 20) breaks with dynamic data. If a new item is inserted at position 0 while the user is on page 2, every item shifts — the user sees a duplicate item (the last item from page 1 appears again as the first item on page 2) and misses one item (the previous first item of page 2 is now on page 1). This is the fundamental problem with offset pagination in dynamic datasets.

Cursor-Based Pagination: I implement cursor-based pagination where the "cursor" is a pointer to a specific item (typically the last item's ID or a timestamp) rather than a numeric offset. The request is GET /api/items?after={lastItemId}&limit=20, and the server returns items after the cursor, regardless of how many items were inserted before the cursor. This ensures no duplicates and no missed items during forward pagination. The server response includes: { items: [...], nextCursor: string | null, hasMore: boolean }.

React Query Implementation: TanStack Query's useInfiniteQuery is designed for cursor-based pagination. I implement it with getNextPageParam: (lastPage) => lastPage.nextCursor. The query cache stores an array of pages, each containing its items. Fetching the next page appends to the pages array without refetching previous pages. Merging all pages for display uses pages.flatMap(page => page.items).

Handling Real-Time Updates: For items that change while loaded, I combine pagination with real-time updates. A WebSocket (or polling) delivers events: item_created, item_updated, item_deleted. For item_updated: I find the item in the cached pages and update it in-place (queryClient.setQueryData). For item_deleted: I remove the item from the cached pages. For item_created: this is the trickiest case — I maintain a separate "new items" buffer that displays at the top of the list with a "New items available" banner (similar to a feed), or I prepend new items directly to the first page.

Bidirectional Pagination: For scenarios where the user can paginate both forward and backward (chat messages, timeline navigation), I implement bidirectional cursors: after={cursor} for forward, before={cursor} for backward. Each page has both a startCursor and endCursor. The cache maintains a doubly-linked structure of pages, and the UI can scroll in both directions.

Gap Handling: A common edge case is "gaps" in paginated data — the user loads pages 1 and 2, goes idle for an hour (during which many items are added), then loads page 3. The items between page 2's last item and page 3's first item are a gap. For most UIs, this gap is invisible (the items appear contiguous). But if the gap is semantically important (a timeline with visible gaps), I implement gap detection: compare the timestamp of page 2's last item with page 3's first item, and if the gap exceeds a threshold, display a "Load more items between these dates" prompt.`,
        shortAnswer: 'Use cursor-based pagination (not offset) to prevent duplicate/missed items, implement with TanStack Query useInfiniteQuery, handle real-time updates via in-place cache updates for edits/deletes and a "new items" buffer for insertions, and detect gaps in bidirectional pagination.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-api',
        tags: ['pagination', 'cursor-based', 'real-time', 'infinite-scroll', 'data-management'],
        followUps: [
          'How would you implement "jump to item" in cursor-based pagination?',
          'How does cursor-based pagination interact with sorting and filtering?',
          'What is the performance impact of maintaining thousands of cached page items?'
        ]
      }
    ]
  },
  {
    id: 'senior-team',
    title: 'Team & Process',
    description: 'Technical debt management, migration strategies, framework selection, mentoring, architectural decision records, and leadership in frontend engineering teams.',
    category: 'Senior',
    difficulty: 'Senior',
    tags: ['technical-debt', 'migration', 'leadership', 'mentoring', 'adr', 'team-process'],
    questions: [
      {
        id: 'senior-team-1',
        question: 'Your codebase has accumulated significant technical debt over 3 years — inconsistent patterns, deprecated dependencies, no tests for core features. You have 20% of sprint capacity allocated for tech debt. How would you prioritize and manage this?',
        answer: `Technical debt management is fundamentally a prioritization problem. With limited capacity, you must maximize the impact of each debt reduction effort. I would implement a systematic approach to identification, prioritization, and execution.

Identification and Cataloging: First, I create a comprehensive tech debt inventory using multiple inputs: (1) Static analysis — run the TypeScript strict checker, ESLint with all recommended rules, and dependency audit to quantify issues (e.g., "247 TypeScript errors with strict mode, 15 critical dependency vulnerabilities, 42 deprecated API usages"). (2) Developer surveys — ask the team "what slows you down most?" and "what areas of the codebase are you afraid to touch?" These qualitative signals often reveal the highest-impact debt. (3) Incident analysis — review the last 12 months of production incidents and map root causes to codebase areas. Recurring incidents indicate debt that directly impacts users. (4) Build and CI analysis — identify the slowest test suites, the largest bundles, and the most failure-prone CI jobs.

Prioritization Framework: I score each debt item on two dimensions: impact (how much does this debt cost in developer time, user experience, or incident risk?) and effort (how much work to fix?). This creates a 2x2 matrix: High Impact + Low Effort = do these first (quick wins that build momentum and team confidence). High Impact + High Effort = plan these as dedicated projects (one per quarter). Low Impact + Low Effort = do these opportunistically (when touching related code). Low Impact + High Effort = usually not worth addressing (the cost of fixing exceeds the cost of living with it). The specific prioritization within "high impact" depends on strategic context: if the team is adopting TypeScript strict mode, fixing type errors is high priority; if the team is improving reliability, adding tests to the most incident-prone modules takes priority.

Execution Strategy: I split the 20% capacity into two streams. Stream 1 (10%) — Continuous Improvement: small, ongoing improvements embedded in feature work. When a developer touches a file for a feature, they also fix one tech debt item in that file (add types, add a test, replace a deprecated pattern). This "boy scout rule" approach distributes debt reduction across the entire codebase naturally. Stream 2 (10%) — Focused Projects: dedicated time blocks for larger debt items that can't be done incrementally. Examples: migrating from Enzyme to React Testing Library (requires dedicated effort, not piecemeal), upgrading to the latest major version of a framework, or establishing the testing infrastructure for an untested module. Each focused project has a clear scope, estimated duration, and measurable outcome.

Tracking and Communication: I track tech debt metrics over time: TypeScript strict error count (should decrease), dependency vulnerability count (should stay near zero), test coverage for core modules (should increase), CI pipeline duration (should decrease or stay stable). These metrics are reported monthly to the team and to stakeholders. The key communication message to stakeholders is concrete: "This quarter's tech debt work reduced deployment failures by 30% and saved the team approximately 5 hours per week in debugging time" — framing debt reduction in terms of velocity and reliability improvements rather than abstract "code quality."`,
        shortAnswer: 'Catalog debt from static analysis, developer surveys, and incident data. Prioritize using impact×effort matrix (high-impact/low-effort first). Split 20% into continuous improvement (boy scout rule in feature work) and focused quarterly projects. Track metrics (type errors, coverage, CI speed) and report in business-value terms.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-team',
        tags: ['technical-debt', 'prioritization', 'management', 'team-process'],
        followUps: [
          'How would you justify increasing the tech debt allocation to stakeholders?',
          'How do you prevent new tech debt from being introduced?',
          'What is the difference between strategic and accidental technical debt?'
        ]
      },
      {
        id: 'senior-team-2',
        question: 'Your company needs to choose a frontend framework for a new product that will be maintained for 5+ years. How would you evaluate and select the framework, and how would you document the decision?',
        answer: `Framework selection for a long-lived product requires balancing current capabilities with long-term viability, team expertise, and ecosystem health. I would use a structured evaluation process documented as an Architectural Decision Record (ADR).

Evaluation Criteria: I define weighted criteria before evaluating any specific framework to prevent bias. The criteria, with example weights, are: (1) Team expertise and hiring (25%) — how well does the team know this framework, and how easy is it to hire engineers with experience? For a 5-year product, team scalability is critical. (2) Ecosystem maturity (20%) — quality and stability of routing, state management, form handling, testing, and build tooling libraries. A mature ecosystem means fewer custom solutions to build and maintain. (3) Performance characteristics (15%) — SSR support, bundle size, runtime performance, Core Web Vitals potential. (4) Long-term viability (15%) — backing organization's commitment, community size and growth trend, release cadence and stability, TypeScript support quality. (5) Developer experience (15%) — documentation quality, debugging tools, error messages, hot reload speed. (6) Architecture fit (10%) — how well the framework's paradigms match the product's requirements (e.g., real-time collaboration, complex forms, SEO needs).

Evaluation Process: I evaluate the top 3-4 candidates (currently React/Next.js, Vue/Nuxt, Angular, Svelte/SvelteKit) against these criteria. Rather than relying on benchmarks or blog posts, I conduct practical evaluation: (1) Build a proof-of-concept for a representative feature (complex form with validation, real-time data table, SSR product page) in each framework. This reveals practical development experience, pain points, and performance characteristics. (2) Evaluate the ecosystem by implementing the PoC with production-grade tooling (auth, testing, CI, monitoring). A framework might demo well but have gaps in production tooling. (3) Survey the team for experience levels and preferences. A framework that 80% of the team knows has a significant head start over a technically superior but unfamiliar option.

Decision Documentation — ADR: I document the decision as an Architectural Decision Record with a standard structure: Status (proposed/accepted/superseded), Context (why are we choosing a framework? what are the product requirements and constraints?), Decision (which framework and why, including the evaluation scores per criterion), Consequences (positive: what this enables; negative: what we give up; risks: what could go wrong), and Alternatives Considered (brief summary of each rejected option and why). The ADR is stored in the repository (docs/adr/001-frontend-framework.md) so future team members understand not just what was chosen but why.

The Decision: For most scenarios in 2024-2026, I would recommend React with Next.js. The reasoning: React has the largest ecosystem and hiring pool (25% criterion), the most mature production tooling (20%), excellent performance via RSC and streaming SSR (15%), strong long-term viability backed by Meta with broad industry adoption (15%), and best-in-class TypeScript support and developer tools (15%). However, this recommendation changes based on context: if the team is experienced Angular developers and the product has complex enterprise forms, Angular might win due to the 25% team expertise weight. The evaluation process is more important than the specific answer.`,
        shortAnswer: 'Define weighted evaluation criteria (team expertise 25%, ecosystem 20%, performance 15%, viability 15%, DX 15%, fit 10%), build proof-of-concepts in top candidates, survey team expertise, and document the decision as an ADR in the repository with context, rationale, consequences, and alternatives.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-team',
        tags: ['framework-selection', 'adr', 'decision-making', 'architecture'],
        followUps: [
          'How would you handle a situation where the team prefers a different framework than the evaluation suggests?',
          'What is the process for revisiting a framework decision after 2 years?',
          'How do you mitigate the risk of framework lock-in?'
        ]
      },
      {
        id: 'senior-team-3',
        question: 'You are leading the frontend architecture for a team of 20 developers with varying experience levels (5 senior, 10 mid, 5 junior). How would you establish architectural standards and ensure consistent quality?',
        answer: `Establishing architecture in a mixed-experience team requires encoding decisions into enforceable tools and processes, not just documentation that people may not read. The approach must balance rigidity (preventing bad patterns) with flexibility (not blocking developers unnecessarily).

Encoding Standards in Tooling: The most effective standards are the ones that tools enforce automatically. I would invest heavily in: (1) TypeScript strict mode with no-any ESLint rule — this catches type-related bugs at compile time rather than in code review. (2) Custom ESLint rules for architectural patterns — enforce module boundaries (feature A cannot import from feature B's internals), enforce naming conventions (hooks must start with "use"), prevent direct API calls outside the data layer, and enforce proper error handling patterns. (3) Prettier for formatting — eliminates all formatting discussions from code reviews. (4) Husky + lint-staged for pre-commit validation — ensures no violations reach the remote repository. These tools create a "pit of success" where the easiest path is also the correct path, regardless of the developer's experience level.

Architecture Documentation: Beyond tools, I create living documentation for decisions that can't be automated: (1) Architecture Decision Records (ADRs) — a markdown file for each significant decision (framework choice, state management approach, testing strategy, folder structure), stored in the repo and referenced in onboarding. (2) A "How We Build" guide — a practical document covering: folder structure conventions, component patterns (when to use a custom hook vs a component, how to structure props), data fetching patterns (always use React Query, never useEffect + fetch), error handling patterns, and common recipes (form with validation, paginated list, real-time data). (3) Reference implementations — for each major pattern, a well-commented example in the codebase that developers can copy and adapt.

Knowledge Transfer: Senior engineers multiply their impact through knowledge transfer. I establish: (1) Architecture review for significant PRs — any PR that introduces a new pattern, adds a dependency, or modifies shared code requires review from a senior engineer (enforced via CODEOWNERS). (2) Pair programming rotations — each junior developer pairs with a senior for 2-4 hours per week, working on real feature code. This is more effective than documentation for transferring tacit knowledge (why we chose this pattern, what pitfalls to avoid). (3) Weekly architecture discussion — a 30-minute meeting where the team discusses an architectural topic (current patterns, proposed changes, recent incidents). This builds collective ownership of the architecture rather than concentrating knowledge in senior developers.

Consistency Through Abstraction: For the most critical patterns, I create abstractions that junior developers use without needing to understand the underlying complexity. A useApiQuery(endpoint, params) hook encapsulates React Query configuration, error handling, caching, and TypeScript types — a junior developer uses it like a simple data fetch without knowing about stale-while-revalidate strategies. An ApiErrorBoundary component encapsulates the error handling, retry, and fallback rendering pattern. A FormBuilder component generates validated forms from a schema. These abstractions enforce consistency while reducing cognitive load for less experienced developers.

Measuring Quality: I track architectural consistency through automated metrics: custom ESLint rule violation counts (should be zero in CI, trending down in IDE warnings), code duplication metrics (flag modules with >20% duplication), dependency direction analysis (ensure feature modules don't have circular dependencies), and bundle size per page (flag pages exceeding the performance budget). These metrics are reviewed monthly and inform which standards need better tooling or documentation.`,
        shortAnswer: 'Encode standards in tooling (ESLint rules, TypeScript strict, Prettier), create living documentation (ADRs, "How We Build" guide, reference implementations), transfer knowledge through senior review on significant PRs and pair programming, build abstractions that enforce patterns automatically, and track consistency via automated metrics.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-team',
        tags: ['architecture', 'team-leadership', 'standards', 'mentoring', 'quality'],
        followUps: [
          'How do you handle a senior developer who disagrees with an established pattern?',
          'How do you update standards without disrupting ongoing work?',
          'How do you balance architectural consistency with innovation?'
        ]
      },
      {
        id: 'senior-team-4',
        question: 'You need to mentor a mid-level developer who writes working code but struggles with system design, code organization, and making architectural decisions. What is your mentorship approach?',
        answer: `Mentoring a developer from "writes working code" to "designs good systems" is a transition from tactical to strategic thinking. I would use a structured mentorship approach that progressively builds design skills through practice, feedback, and increasing autonomy.

Assessment and Goal Setting: First, I understand the specific gaps. "Struggles with architectural decisions" might mean: doesn't consider alternative approaches, doesn't anticipate future requirements, doesn't understand the tradeoffs between patterns, or doesn't know how to decompose a large feature into modules. I have a candid conversation: "Where do you feel least confident when starting a new feature? What part of senior engineers' PRs do you find most surprising or educational?" Based on this, we set 2-3 specific goals for a 3-month period, e.g., "Be able to independently design the component architecture for a medium-complexity feature" and "Evaluate two alternative approaches and articulate tradeoffs before choosing."

Learning Through Design Reviews: I assign the mentee increasing design responsibility. Phase 1 (weeks 1-4): Before implementing a feature, the mentee writes a brief design document (1-2 pages) covering: the component tree, state management approach, data flow, and error handling strategy. We review the design together, and I ask probing questions rather than prescribing solutions: "What happens if this API call fails?" "What if we need to add a third variation of this component next month?" "Why this state management approach rather than X?" This Socratic approach develops the mentee's thinking skills rather than just giving them answers.

Phase 2 (weeks 5-8): The mentee designs independently and presents to the team in a 15-minute design review. The team provides feedback (I ensure the feedback is constructive and specific). This builds the mentee's confidence and exposes them to multiple perspectives. I privately debrief after each review, highlighting what went well and what to improve.

Phase 3 (weeks 9-12): The mentee leads the design of a larger feature end-to-end, from requirements to implementation plan. I'm available for questions but don't initiate review — the mentee decides when they need input. This builds autonomy.

Code Review as Teaching: My code reviews of the mentee's PRs focus on architectural feedback (not just correctness). Instead of "move this to a custom hook," I explain why: "Extracting this into useOrderCalculation makes the component easier to test (you can test the calculation logic without rendering the UI) and reusable (the checkout page might need the same calculation)." I link to relevant resources (articles, documentation, related code in our codebase) for deeper learning.

Exposure and Pattern Recognition: I involve the mentee in architectural discussions, incident post-mortems, and framework evaluation PoCs. Exposure to how senior engineers think through problems is irreplaceable. I recommend specific study materials calibrated to their level — not theoretical architecture books, but practical resources: real-world case studies of system design decisions, open-source project architectures (the React Router codebase, the TanStack Query architecture), and conference talks on frontend architecture.

Feedback Loop: Bi-weekly 30-minute check-ins track progress against goals, discuss recent challenges, and adjust the mentorship plan. I provide specific, behavioral feedback: "In last week's design review, you presented two approaches but didn't explain the tradeoffs between them — next time, add a 'tradeoffs' section comparing performance, maintainability, and complexity." Positive reinforcement is equally important: "Your design for the settings page was well-decomposed — the separation between the form logic and the API sync was exactly the kind of clean boundary that senior engineers produce."`,
        shortAnswer: 'Assess specific gaps, progressively increase design responsibility (design docs → team reviews → independent feature design), use Socratic code review (ask "why" not prescribe), provide exposure to architectural discussions, and give specific behavioral feedback in bi-weekly check-ins.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-team',
        tags: ['mentoring', 'career-growth', 'leadership', 'design-skills'],
        followUps: [
          'How do you handle a mentee who is resistant to feedback?',
          'How do you balance mentoring time with your own work responsibilities?',
          'How do you measure the success of your mentorship?'
        ]
      },
      {
        id: 'senior-team-5',
        question: 'Your team needs to migrate from an older technology (e.g., class components + Redux to hooks + React Query) across a large codebase. How would you plan and execute this migration while continuing feature development?',
        answer: `Large-scale technology migrations in active codebases require a strategy that avoids both the "big bang rewrite" trap (too risky, blocks feature work) and the "we'll migrate eventually" trap (never finishes, creates permanent dual-pattern complexity). I would use a phased adoption strategy.

Phase 0 — Preparation (1-2 weeks): Before writing any migration code, establish the target state and migration tooling. Write an ADR documenting the decision to migrate, the target patterns, and the migration strategy. Create a comprehensive style guide for the new pattern — every developer should know exactly how to write a React Query hook that replaces a Redux thunk. Build codemods (using jscodeshift) for automated transformations where possible — class-to-function component conversion, connect() to hook migration, and Redux action to React Query mutation patterns. Not all transformations can be automated, but even partial automation saves hundreds of hours.

Phase 1 — Establish the New Pattern (2-3 weeks): Implement 2-3 features using the new pattern as "reference implementations." These should be real features (not toy examples) that cover common scenarios: a list page with pagination and filtering, a form with validation and submission, and a real-time data display. These reference implementations serve as templates for the rest of the migration. During this phase, update the team's linting rules to allow both patterns (old and new) but configure new files to require the new pattern — no new Redux reducers, no new class components.

Phase 2 — Incremental Migration (Ongoing, 3-6 months): Migrate existing code opportunistically and systematically. Opportunistic migration: when a developer modifies a file for a feature, they also migrate that file to the new pattern. This "migrate-on-touch" approach naturally prioritizes actively-developed code. Systematic migration: dedicate 15-20% of sprint capacity to migrating untouched but important modules. Prioritize by risk — modules with the most production incidents or the most development activity are migrated first.

The key insight for parallel pattern coexistence is a compatibility layer. During migration, some components will use Redux while others use React Query. The compatibility layer ensures they can coexist: a useReduxQuery hook reads from the Redux store using the same API as React Query (loading, error, data), allowing components to be migrated individually without changing their consumers. As modules are migrated, the Redux store shrinks, and when it's empty for a given slice, the slice is deleted.

Phase 3 — Cleanup (2-4 weeks): Once all code is migrated, remove the old pattern entirely. Remove Redux, class component support, and the compatibility layer. Update lint rules to error on old patterns. Update the build to exclude unused dependencies. This phase is often neglected but is critical — incomplete migration leaves the codebase in a permanently worse state than before (two patterns instead of one).

Progress Tracking: Track migration progress with a dashboard showing: total modules, migrated modules, remaining modules, and estimated completion date. Each module has a migration status: "not started," "in progress," or "completed." The dashboard creates visibility and accountability. I set a firm deadline (e.g., "all Redux removed by Q3") because without a deadline, the last 10% of migration never happens — there's always a feature that's more urgent.`,
        shortAnswer: 'Prepare codemods and target pattern docs, establish reference implementations, migrate incrementally (migrate-on-touch + dedicated 15-20% capacity), build a compatibility layer for coexistence during migration, track progress on a dashboard with a firm completion deadline, and clean up old patterns completely.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-team',
        tags: ['migration', 'technical-debt', 'incremental', 'codemod', 'planning'],
        followUps: [
          'How would you handle a migration that is taking longer than planned?',
          'How do you maintain team motivation during a long migration?',
          'What if the migration reveals that the new technology isn\'t suitable?'
        ]
      },
      {
        id: 'senior-team-6',
        question: 'You are conducting a post-mortem for a production incident where a frontend deployment caused a critical checkout bug that went undetected for 4 hours. How would you lead this process?',
        answer: `A post-mortem for a customer-impacting incident must achieve two goals: understand what happened (factual timeline), and prevent it from happening again (actionable improvements). The process must be blameless — focused on system failures, not individual mistakes.

Pre-Meeting Preparation: Before the post-mortem meeting, I collect the factual timeline. Working with the deployment logs, monitoring data, and the team, I construct a minute-by-minute narrative: when was the deployment triggered, when did the bug manifest, when was it detected, how was it detected (monitoring alert, user report, or internal discovery), when was it diagnosed, when was the fix deployed, and when was full recovery confirmed. I also quantify the impact: how many users were affected, how much revenue was lost, and what was the blast radius. This timeline is shared before the meeting so everyone arrives with a common understanding of facts.

The Post-Mortem Meeting (60-90 minutes): I facilitate the meeting with a structured agenda. Part 1 — Timeline Review (15 min): Walk through the timeline, filling in details and correcting any inaccuracies. This is purely factual — no analysis yet. Part 2 — Root Cause Analysis (30 min): Using the "5 Whys" technique, trace from the symptom to the root cause. Example: "The checkout was broken" → Why? "A price calculation function returned NaN for certain currencies" → Why? "A code change assumed all prices are in cents, but one API returns prices in decimal" → Why wasn't this caught? "The unit tests mocked the price API and didn't test with real API response shapes" → Why? "Our testing strategy doesn't include contract tests between frontend and backend." The root cause is typically a process or system gap, not an individual's mistake.

Part 3 — Contributing Factors (15 min): Identify factors that made the incident worse or longer than necessary. "The staging environment uses mock data that doesn't include the affected currencies" (environment parity issue). "The monitoring alert for checkout errors had been silenced due to false positives last month" (alert fatigue). "The deployment happened Friday at 5pm with reduced on-call coverage" (process gap).

Part 4 — Action Items (20 min): Generate specific, assigned, and time-bound action items for each root cause and contributing factor. Examples: "Add contract tests between frontend and price API" (assigned to engineer A, due in 2 weeks), "Implement canary deployment with automated rollback on error rate spike" (assigned to platform team, due in 1 month), "Restore and fix the checkout error monitoring alert" (assigned to engineer B, due this week), "Add a deployment freeze policy for Friday afternoons" (assigned to engineering manager, due this week). Each action item must have an owner and a deadline — vague items like "improve testing" without specifics never get done.

Documentation and Follow-Up: I write the post-mortem document with: incident summary, impact, timeline, root cause analysis, contributing factors, action items with owners and deadlines, and lessons learned. This document is shared with the engineering organization (transparency builds trust and helps other teams learn). I schedule a 30-day follow-up meeting to verify all action items are completed. Uncompleted items are escalated because if we don't follow through, we'll have the same incident again.`,
        shortAnswer: 'Collect factual timeline before the meeting, facilitate a blameless 90-minute session (timeline review → 5 Whys root cause analysis → contributing factors → assigned action items with deadlines), document and share the post-mortem, and schedule a 30-day follow-up to verify action items are completed.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-team',
        tags: ['post-mortem', 'incident-management', 'leadership', 'process'],
        followUps: [
          'How do you ensure the post-mortem stays blameless when there is clear individual error?',
          'How would you handle a situation where the action items require significant investment?',
          'How do you balance thorough investigation with the urgency of returning to normal development?'
        ]
      },
      {
        id: 'senior-team-7',
        question: 'How would you establish and maintain Architectural Decision Records (ADRs) in your team?',
        answer: `ADRs capture the "why" behind technical decisions — the context, alternatives considered, and rationale that future developers (including your future self) need when they encounter code and wonder "why was it built this way?" Without ADRs, this knowledge exists only in people's heads and is lost to turnover and time.

When to Write ADRs: Not every technical decision needs an ADR. I establish a clear threshold: write an ADR when the decision is (1) difficult to reverse (framework choice, database selection, API design), (2) affects multiple teams or components (cross-cutting concerns like authentication, logging, error handling), (3) involves significant tradeoffs where reasonable engineers would disagree (GraphQL vs REST, monorepo vs polyrepo), or (4) departs from common conventions (choosing an unusual pattern that will surprise future readers). Small decisions, implementation details, and easily reversible choices don't need ADRs — over-documenting leads to documentation fatigue and abandonment.

ADR Format: I use a lightweight, consistent format stored in the repository (docs/adr/NNN-title.md). The structure: Title (short, descriptive), Status (proposed, accepted, deprecated, superseded), Date, Context (what situation or requirement prompted this decision — the "why now?"), Decision (what we chose), Rationale (why we chose it — the core of the ADR), Alternatives Considered (other options evaluated, with brief pros/cons), and Consequences (positive impacts, negative impacts, and risks of this decision). The format is deliberately simple — long, detailed documents don't get written or read. Each ADR should be readable in 5 minutes.

Lifecycle Management: ADRs are immutable once accepted — if a decision is reversed, a new ADR supersedes the original (with a link) rather than editing the original. This preserves the historical context. The ADR index (a table of contents file) shows the current state of all decisions, making it easy to see which ADRs are active and which are superseded. I include ADR creation as a step in the technical design process: major features and architectural changes require an ADR before implementation begins.

Adoption Strategy: ADRs fail when they're mandated but not valued. I start by writing ADRs for the most impactful decisions retroactively — "Why did we choose Next.js?", "Why do we use React Query instead of Redux?", "Why is authentication handled by the BFF?" These retrospective ADRs provide immediate value (new team members finally understand these decisions) and demonstrate the format. I link ADRs in code comments where relevant: at the top of the BFF module, a comment links to the BFF architectural decision. This makes ADRs discoverable in the normal development workflow rather than forgotten in a docs folder.

Team Integration: I integrate ADR writing into the development process naturally. When a developer proposes a significant technical change in a PR, I ask: "This looks like an architectural decision — would you mind writing a quick ADR?" This normalizes ADR writing as part of engineering work, not extra overhead. In architecture review meetings, proposed ADRs are discussed and refined collaboratively. Over time, the ADR collection becomes a valuable team asset — new developers read the ADRs during onboarding and arrive with a deep understanding of why the system is built the way it is.`,
        shortAnswer: 'Write ADRs for significant, hard-to-reverse, cross-cutting decisions using a lightweight format (Context, Decision, Rationale, Alternatives, Consequences). Store in the repo (docs/adr/), link from code, start with retrospective ADRs for existing decisions, and integrate ADR creation into the design review process.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-team',
        tags: ['adr', 'documentation', 'architecture', 'decision-making', 'team-process'],
        followUps: [
          'How do you handle disagreements during ADR review?',
          'How often should you review existing ADRs for continued relevance?',
          'How do ADRs interact with RFCs (Request for Comments)?'
        ]
      },
      {
        id: 'senior-team-8',
        question: 'You have been asked to evaluate whether to adopt a new technology (e.g., React Server Components, Bun runtime, or a new CSS framework) for your production application. How would you approach this evaluation responsibly?',
        answer: `Technology adoption decisions require balancing innovation (staying current, improving capabilities) with stability (not introducing unnecessary risk to production systems). I would use a structured evaluation process that separates hype from substance.

Phase 1 — Problem Definition (Before evaluating the technology): The first question is not "should we adopt X?" but "what problem are we trying to solve?" If the answer is "none specifically, but X is popular," that's a red flag. Technology adoption should be driven by concrete problems: "Our SSR server costs are high because we're rendering components that could be static" (RSC might help), "Our build times are 10 minutes and blocking developer productivity" (Bun might help), "Our CSS is duplicated across 200 components and the bundle is 300KB" (a CSS framework might help). If there's no clear problem, the evaluation stops here — adopting technology for its own sake introduces complexity without proportional benefit.

Phase 2 — Research (1 week): Evaluate the technology's maturity, stability, and ecosystem. Key questions: How long has it been in production at other companies? (< 6 months = high risk, > 2 years = established). How active is the community? (GitHub stars are vanity; issue resolution time, release cadence, and breaking change frequency are substance). What are the migration costs? (Can we adopt incrementally, or is it all-or-nothing?). What is the lock-in risk? (If we adopt and later want to switch, how painful is it?). What are the known limitations? (Every technology has edge cases — find them from production users, not marketing docs). I read post-mortems and "I regret adopting X" posts, which provide far more useful signal than promotional blog posts.

Phase 3 — Proof of Concept (1-2 weeks): Build a PoC that tests the technology against the specific problem from Phase 1. The PoC should use realistic complexity — not a todo app, but a representative feature from the actual application. Measure the outcome quantitatively: "RSC reduced the client JS for the product page from 180KB to 45KB and improved LCP from 2.8s to 1.6s." Test edge cases: "Does RSC work with our authentication pattern? Our internationalization library? Our error monitoring?" The PoC should also measure developer experience: "How long does it take a mid-level developer to build a feature with this technology? What are the debugging pain points?"

Phase 4 — Risk Assessment and Decision: Based on the PoC results, make an explicit risk assessment. Risks include: adoption risk (team learning curve, hiring pool for this technology), integration risk (compatibility with existing tools and libraries), maintenance risk (is the technology maintained by a reliable organization or a single developer?), and rollback risk (if adoption goes poorly, can we revert?). I compare the expected benefits (quantified from the PoC) against these risks. The decision is documented as an ADR with the full evaluation data, regardless of whether the decision is to adopt or not — "why we didn't adopt X" is equally valuable.

Phase 5 — Incremental Adoption (if proceeding): Never adopt a new technology across the entire codebase at once. Start with a non-critical feature or an internal tool. Run it in production for 1-2 months, monitoring for issues. Then expand to more features gradually. This staged rollout contains blast radius — if the technology has production issues, they affect a small portion of the application. Each stage is a decision point: continue, adjust, or rollback.`,
        shortAnswer: 'Start by defining the specific problem to solve, research maturity and limitations from production users (not marketing), build a realistic PoC measuring concrete metrics, assess risks (adoption, integration, maintenance, rollback), document as an ADR, and adopt incrementally starting with non-critical features.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Senior',
        topicId: 'senior-team',
        tags: ['technology-evaluation', 'decision-making', 'risk-assessment', 'adoption'],
        followUps: [
          'How would you handle pressure from management to adopt a trendy technology?',
          'What is the cost of NOT adopting a new technology?',
          'How do you stay current with frontend technology without chasing every new trend?'
        ]
      }
    ]
  }
];
