import type { Topic } from "../../types";

export const routingTopics: Topic[] = [
  {
    id: "react-routing",
    title: "Client-Side Routing & React Router v6 / v7 Architecture",
    description:
      "Master client-side SPA routing: history API, React Router v6/v7 data routers (createBrowserRouter, loaders, actions), nested routes with <Outlet />, lazy route splitting, and route protection.",
    category: "React",
    difficulty: "Intermediate",
    tags: [
      "react",
      "routing",
      "react-router",
      "spa",
      "nested-routes",
      "loaders",
      "actions",
    ],
    overview:
      "Single Page Applications (SPAs) intercept browser navigation using the HTML5 History API (pushState/replaceState) to render views dynamically without full page reloads. Modern React Router (v6.4+ and v7) integrates data fetching (loaders) and mutation pipelines (actions) directly into the route tree.",
    concepts: [
      "How Client-Side Routing works: HTML5 History API (`history.pushState`, `popstate` event)",
      "React Router Declarative vs Data Router (`createBrowserRouter`, `RouterProvider`)",
      "Nested Routing and layout composition using `<Outlet />`",
      "Data Loaders and Form Actions: co-locating data requirements with routes",
      "Error handling in routes using `errorElement` and `useRouteError`",
      "Dynamic route parameters (`useParams`) and query search params (`useSearchParams`)",
      "Protected routes and authentication redirect flows",
      "Code splitting and lazy loading route modules via `lazy` / `React.lazy` + `Suspense`",
    ],
    relatedTopicIds: ["react-components", "react-advanced"],
    questions: [
      {
        id: "react-routing-1",
        question:
          "How does client-side routing work under the hood using the HTML5 History API, and how do React Router nested routes with <Outlet /> work?",
        answer:
          "**How Client-Side Routing Works:**\n1. In a traditional MPA, clicking `<a href=\"/about\">` triggers a full browser HTTP GET request and page refresh.\n2. In a client-side SPA, clicking a `<Link to=\"/about\">` prevents the default browser navigation (`e.preventDefault()`).\n3. It calls `window.history.pushState({}, '', '/about')`, which updates the browser URL bar and session history stack **without triggering a network page reload**.\n4. React Router listens to the browser `popstate` event (fired on Back/Forward button navigation) and internal state transitions, re-rendering the component tree matching the new path.\n\n**Nested Routing & `<Outlet />`:**\nNested routes allow parent layout components (e.g. `<DashboardLayout>`) to stay mounted while only the inner child content switches as the sub-path changes. The parent layout renders `<Outlet />`, which acts as a dynamic placeholder where matching child route elements are mounted.",
        shortAnswer:
          "Client-side routing uses `history.pushState` and `popstate` to update URLs without reloading. Nested routes keep parent layouts mounted and swap child views inside `<Outlet />`.",
        code: `import { createBrowserRouter, RouterProvider, Outlet, Link, useLoaderData } from 'react-router-dom';

// 1. Parent Layout with Navigation and Outlet
function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <nav>
        <Link to="/dashboard">Overview</Link>
        <Link to="/dashboard/analytics">Analytics</Link>
        <Link to="/dashboard/settings">Settings</Link>
      </nav>
      <main>
        {/* Child route renders here */}
        <Outlet />
      </main>
    </div>
  );
}

// 2. Data Router Configuration
export const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <div>Dashboard Overview</div> },
      {
        path: 'analytics',
        loader: async () => fetch('/api/analytics').then(r => r.json()),
        element: <AnalyticsPage />,
      },
    ],
  },
]);`,
        language: "tsx",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "React",
        topicId: "react-routing",
        tags: ["react-router", "history-api", "outlet", "nested-routes", "spa"],
        commonMistakes: [
          "Forgetting to configure web server fallback (e.g. Nginx `try_files $uri /index.html;`) causing 404s when refreshing deep routes.",
          "Using standard `<a href>` instead of React Router `<Link>` or `<NavLink>`, triggering unintended full page reloads.",
        ],
        followUps: [
          "Why is Nginx try_files $uri /index.html required when deploying SPAs to production?",
        ],
        interviewTips: [
          "Mention web server fallback configuration to show real-world production deployment experience.",
        ],
      },
      {
        id: "react-routing-2",
        question:
          'What are React Router Loaders and Actions, and how do they eliminate "fetch-on-render" waterfalls?',
        answer:
          "Before data routers, React apps suffered from **fetch-on-render waterfalls**:\n1. App mounts -> downloads JS -> renders `<Parent>` -> Parent fires `useEffect` to fetch data -> Parent finishes -> renders `<Child>` -> Child fires `useEffect` -> ... (cascading network delays).\n\n**React Router Loaders (Fetch-then-Render)**:\n- Routes define a `loader: async () => { ... }` function.\n- When a URL transition begins, React Router immediately initiates data fetching for **all matching nested route loaders in parallel** before rendering starts.\n- Components access data synchronously using `const data = useLoaderData()` without managing loading state spinners in `useEffect`.\n\n**React Router Actions (Mutations & Revalidation)**:\n- Forms post to route `action` functions.\n- Upon completion, React Router automatically re-validates and re-fetches all active route loaders, keeping UI state synchronized without manual cache invalidation code.",
        shortAnswer:
          "Loaders fetch data in parallel before rendering starts, eliminating sequential fetch-on-render waterfalls. Actions handle form submissions and automatically revalidate active loaders.",
        code: `import { useLoaderData, Form } from 'react-router-dom';

// Route Loader
export async function projectLoader({ params }: { params: any }) {
  const res = await fetch(\`/api/projects/\${params.id}\`);
  if (!res.ok) throw new Response('Not Found', { status: 404 });
  return res.json();
}

// Route Action
export async function projectAction({ request, params }: { request: Request, params: any }) {
  const formData = await request.formData();
  await fetch(\`/api/projects/\${params.id}\`, {
    method: 'PATCH',
    body: formData,
  });
  return { ok: true };
}

// Component
export function ProjectDetail() {
  const project = useLoaderData() as any;
  return (
    <div>
      <h1>{project.name}</h1>
      <Form method="post">
        <input name="title" defaultValue={project.name} />
        <button type="submit">Update</button>
      </Form>
    </div>
  );
}`,
        language: "tsx",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "React",
        topicId: "react-routing",
        tags: [
          "loaders",
          "actions",
          "data-fetching",
          "waterfalls",
          "react-router",
        ],
        commonMistakes: [
          "Mixing useEffect data fetching with route loaders, losing parallel prefetching benefits.",
        ],
        followUps: [
          "How does Remix / React Router v7 leverage loaders and actions for SSR?",
        ],
        interviewTips: [
          'Contrast "Fetch-on-Render" (useEffect waterfall) with "Render-as-You-Fetch" (Loaders / Suspense).',
        ],
      },
    ],
  },
];
