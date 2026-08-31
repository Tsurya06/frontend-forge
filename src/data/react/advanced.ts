import type { Topic } from '../../types';

export const advancedTopics: Topic[] = [
  {
    id: 'react-advanced-patterns',
    title: 'Rendering Strategies (SSR, CSR, SSG, ISR), Hydration, RSC & Suspense',
    description:
      'Deep architectural coverage of rendering paradigms (CSR, SSR, SSG, ISR), Hydration and Selective Hydration, React Server Components (RSC), Suspense streaming, and Context API vs Flux architecture.',
    category: 'React',
    difficulty: 'Senior',
    tags: ['react', 'ssr', 'rsc', 'hydration', 'suspense', 'ssg', 'isr', 'context-api', 'flux'],
    overview:
      'Modern web application architecture extends far beyond client-side rendering. Understanding how server rendering, static generation, incremental regeneration, progressive hydration, React Server Components (RSC), and Suspense streaming work under the hood enables engineers to architect ultra-fast, SEO-optimized, resilient applications.',
    concepts: [
      'Rendering Paradigms: CSR vs SSR vs SSG vs ISR vs Edge Rendering',
      'The Hydration process: turning static server HTML into an interactive React DOM tree',
      'Hydration mismatch errors: server/client divergence (dates, random IDs, browser APIs) and how to resolve them',
      'React 18/19 Selective Hydration & Streaming SSR with `<Suspense>`',
      'React Server Components (RSC): zero-bundle-size server execution vs Client Components ("use client")',
      'The RSC Wire Format / Payload: serialized flight stream',
      'Suspense and `React.lazy` for component-level code splitting',
      'Context API vs Flux/Redux architecture: when to use Context (dependency injection, low-frequency theme/auth) vs Flux (high-frequency, normalized state)',
    ],
    relatedTopicIds: ['react-intro', 'react-optimization'],
    questions: [
      {
        id: 'react-adv-1',
        question: 'Compare CSR, SSR, SSG, and ISR rendering strategies. When would you choose each for an enterprise frontend architecture?',
        answer:
          '1. **Client-Side Rendering (CSR)**:\n- **How it works**: Server serves a blank HTML shell (`<div id="root"></div>`). Browser downloads JS bundle and builds the entire DOM on the client.\n- **Pros**: Fast subsequent page transitions, rich stateful interactions.\n- **Cons**: Slow Initial Page Load (FCP/LCP), poor SEO without pre-rendering.\n- **Best for**: Internal SaaS dashboards, authenticated web apps, admin panels.\n\n2. **Server-Side Rendering (SSR)**:\n- **How it works**: Server renders the full HTML on every HTTP request and sends ready-to-view HTML to the browser, followed by hydration.\n- **Pros**: Excellent SEO, fast FCP/LCP on dynamic content, always up-to-date data.\n- **Cons**: Higher server compute costs and higher TTFB (server must fetch data before returning response).\n- **Best for**: Dynamic e-commerce pages, social feeds, user profiles.\n\n3. **Static Site Generation (SSG)**:\n- **How it works**: HTML is pre-rendered at build time and served statically from global CDNs.\n- **Pros**: Blazing fast TTFB, lowest hosting costs, high reliability.\n- **Cons**: Build times grow with page count; stale content until next build.\n- **Best for**: Marketing landing pages, documentation, blogs.\n\n4. **Incremental Static Regeneration (ISR)**:\n- **How it works**: Combines SSG with background revalidation (`revalidate: 60`). Serves cached static pages instantly from CDN while asynchronously rebuilding stale pages in the background.\n- **Best for**: Large e-commerce catalogs (100,000+ products), news publishers.',
        shortAnswer:
          'CSR builds UI in the browser (SaaS dashboards); SSR renders HTML on every request (dynamic e-commerce); SSG pre-builds static HTML for CDNs (blogs, docs); ISR updates static pages in the background on demand (large catalogs).',
        code: `// Next.js Rendering Strategies Comparison

// 1. Static Site Generation (SSG)
export async function getStaticProps() {
  const data = await fetch('https://api.example.com/posts').then(r => r.json());
  return { props: { data } };
}

// 2. Incremental Static Regeneration (ISR)
export async function getStaticPropsWithISR() {
  const data = await fetch('https://api.example.com/posts').then(r => r.json());
  return {
    props: { data },
    revalidate: 60, // Regenerate static page in background at most once every 60s
  };
}

// 3. Server-Side Rendering (SSR)
export async function getServerSideProps(context: any) {
  const data = await fetch(\`https://api.example.com/user/\${context.params.id}\`).then(r => r.json());
  return { props: { data } };
}`,
        language: 'tsx',
        difficulty: 'Senior',
        type: 'Conceptual',
        category: 'React',
        topicId: 'react-advanced-patterns',
        tags: ['ssr', 'ssg', 'isr', 'csr', 'rendering-strategies'],
        commonMistakes: [
          'Using SSR for pages that change infrequently, unnecessarily overloading backend servers.',
          'Using CSR for public marketing or e-commerce pages that require search engine indexing.',
        ],
        followUps: ['How does Edge SSR (Cloudflare Workers / Vercel Edge) reduce TTFB compared to traditional Node.js SSR?'],
        interviewTips: ['Draw a comparative quadrant showing Build Time vs Request Time and Dynamic vs Static content.']
      },
      {
        id: 'react-adv-2',
        question: 'What is Hydration in React, what causes Hydration Mismatch errors, and how does React 18/19 Selective Hydration work?',
        answer:
          '**What is Hydration?**\nHydration is the process where React takes static HTML generated by the server and attaches event listeners, initializes component state, and connects the Virtual DOM tree to make the page interactive.\n\n**Hydration Mismatch Causes:**\nHappens when server-rendered HTML diverges from client-rendered initial output. Common causes:\n1. Non-deterministic values: `Date.now()`, `new Date().toLocaleTimeString()`, `Math.random()`.\n2. Browser-only globals accessed during render: `window.innerWidth`, `localStorage`, `navigator.userAgent`.\n3. Invalid HTML nesting (e.g. `<p>` containing a `<div>`, or `<tr>` directly under `<table>` without `<tbody>`), where browser HTML parser auto-corrects the DOM before React hydrates.\n\n**React 18/19 Selective Hydration with `<Suspense>`:**\n- In traditional SSR, the entire page had to finish downloading all JS and hydrate all-at-once before any part became interactive ("all-or-nothing").\n- With **Selective Hydration**, wrapping components in `<Suspense>` allows React to hydrate parts of the page independently as their JS chunks arrive.\n- If a user clicks on an unhydrated component wrapped in Suspense, React **prioritizes hydrating that clicked component first** ahead of other background components.',
        shortAnswer:
          'Hydration attaches React state and event listeners to server HTML. Mismatches happen when server and client render different values (dates, window objects). Selective Hydration uses Suspense to stream HTML and hydrate interactive parts independently.',
        code: `import { Suspense, lazy } from 'react';

const Comments = lazy(() => import('./Comments'));

export function ArticlePage() {
  return (
    <article>
      <h1>Article Title (Hydrates immediately)</h1>
      <p>Article body content...</p>

      {/* Selective Hydration: Streams and hydrates independently */}
      <Suspense fallback={<div>Loading comments...</div>}>
        <Comments />
      </Suspense>
    </article>
  );
}`,
        language: 'tsx',
        difficulty: 'Senior',
        type: 'Conceptual',
        category: 'React',
        topicId: 'react-advanced-patterns',
        tags: ['hydration', 'selective-hydration', 'suspense', 'streaming-ssr'],
        commonMistakes: [
          'Using typeof window !== "undefined" to render different JSX during initial render, guaranteeing a hydration mismatch.',
          'Fixing hydration by disabling SSR entirely instead of using useEffect or suppressHydrationWarning.',
        ],
        followUps: ['How does suppressHydrationWarning work and when is it acceptable to use?'],
        interviewTips: ['Highlight that Selective Hydration prioritizes user interaction (clicking an unhydrated button triggers immediate prioritized hydration).']
      },
      {
        id: 'react-adv-3',
        question: 'Explain React Server Components (RSC). How do Server Components differ from Client Components, and what is the "use client" directive?',
        answer:
          '**React Server Components (RSC)** introduce a dual-environment component model where components can execute exclusively on the server:\n\n1. **Server Components (Default in modern frameworks)**:\n- Execute **only on the server** during build time or per request.\n- **Zero client bundle size**: Their code, dependencies (e.g. markdown parsers, heavy date libs), and database connectors are NEVER shipped to the browser.\n- Can directly access databases, file systems, and internal microservices securely (`async function Component() { const data = await db.query(); }`).\n- **Restrictions**: Cannot use state (`useState`), effects (`useEffect`), browser APIs (`window`), or event listeners (`onClick`).\n\n2. **Client Components (`"use client"`)**:\n- Opt-in via the `"use client"` directive placed at the top of the file.\n- Rendered on the server during initial SSR and fully hydrated on the client.\n- Can use state, effects, hooks, event listeners, and browser APIs.\n\n3. **The RSC Wire Format**:\nServer Components are serialized into a special streamable JSON-like format containing the rendered React tree and component props, which the client reconciles seamlessly with interactive client components.',
        shortAnswer:
          'Server Components run only on the server, ship 0KB JS to the browser, and query databases directly. Client Components ("use client") provide interactivity and hooks. Server and client components compose together in a unified tree.',
        code: `// 1. Server Component (ProductPage.tsx) - Default, Zero Bundle Size
import { db } from '@/lib/db';
import { AddToCartButton } from './AddToCartButton'; // Client component

export default async function ProductPage({ params }: { params: { id: string } }) {
  // Direct database query on server! No API route needed
  const product = await db.product.findUnique({ where: { id: params.id } });

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      {/* Composing Client Component inside Server Component */}
      <AddToCartButton productId={product.id} />
    </div>
  );
}

// 2. Client Component (AddToCartButton.tsx)
'use client';

import { useState } from 'react';

export function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={() => {
        setLoading(true);
        // client interaction
      }}
      disabled={loading}
    >
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}`,
        language: 'tsx',
        difficulty: 'Senior',
        type: 'Conceptual',
        category: 'React',
        topicId: 'react-advanced-patterns',
        tags: ['rsc', 'server-components', 'use-client', 'nextjs', 'architecture'],
        commonMistakes: [
          'Thinking "use client" marks a component to render ONLY on the client (Client Components still pre-render on the server during initial SSR).',
          'Passing non-serializable props (like functions or class instances) from a Server Component to a Client Component.',
        ],
        followUps: ['How do Server Actions ("use server") allow client components to invoke server functions with type safety?'],
        interviewTips: ['Clarify that "use client" is a boundary marker defining the entry point to the client JavaScript bundle, not a client-only rendering directive.']
      }
    ]
  }
];
