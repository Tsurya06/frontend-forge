import { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/app/layout/Layout";

// Primary Navigation Routes (eagerly loaded for instantaneous 0ms tab switching)
import Dashboard from "@/pages/dashboard/Dashboard";
import Roadmap from "@/pages/dashboard/Roadmap";
import Topics from "@/pages/topics/Topics";
import Coding from "@/pages/coding/Coding";
import MachineCoding from "@/pages/machineCoding/MachineCoding";
import SystemDesign from "@/pages/systemDesign/SystemDesign";
import Daily from "@/pages/practice/Daily";
import Playground from "@/pages/playground/Playground";
import Bookmarks from "@/pages/user/Bookmarks";
import Progress from "@/pages/user/Progress";
import Search from "@/pages/user/Search";
import Settings from "@/pages/user/Settings";

// Deep / Specialized sub-routes (lazy loaded with idle prefetching)
const TopicDetail = lazy(() => import("@/pages/topics/TopicDetail"));
const CategoryPage = lazy(() => import("@/pages/topics/CategoryPage"));
const CodingDetail = lazy(() => import("@/pages/coding/CodingDetail"));
const MachineCodingDetail = lazy(() => import("@/pages/machineCoding/MachineCodingDetail"));
const SystemDesignDetail = lazy(() => import("@/pages/systemDesign/SystemDesignDetail"));
const Senior = lazy(() => import("@/pages/dashboard/Senior"));
const Quiz = lazy(() => import("@/pages/practice/Quiz"));
const Flashcards = lazy(() => import("@/pages/practice/Flashcards"));
const Interview = lazy(() => import("@/pages/practice/Interview"));
const Visualizer = lazy(() => import("@/pages/visualizer/Visualizer"));
const NotFound = lazy(() => import("@/pages/notFound/NotFound"));

// Background prefetch during browser idle time
function startIdlePrefetch() {
  if (typeof window === "undefined") return;
  const prefetch = () => {
    import("@/pages/topics/TopicDetail");
    import("@/pages/coding/CodingDetail");
    import("@/pages/machineCoding/MachineCodingDetail");
    import("@/pages/systemDesign/SystemDesignDetail");
    import("@/pages/topics/CategoryPage");
    import("@/pages/dashboard/Senior");
    import("@/pages/practice/Quiz");
    import("@/pages/practice/Flashcards");
    import("@/pages/practice/Interview");
  };

  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(prefetch, { timeout: 2000 });
  } else {
    setTimeout(prefetch, 800);
  }
}

import { ROUTES, CATEGORIES } from "@/constants/routes";
import { PageSkeleton } from "@/components/common";

export function AppRoutes() {
  useEffect(() => {
    startIdlePrefetch();
  }, []);

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Core Instant Navigation Routes */}
        <Route index element={<Dashboard />} />
        <Route path={ROUTES.ROADMAP.slice(1)} element={<Roadmap />} />
        <Route path={ROUTES.TOPICS.slice(1)} element={<Topics />} />
        <Route path={ROUTES.TOPIC_SHORT.slice(1)} element={<Topics />} />
        <Route path={ROUTES.CODING.slice(1)} element={<Coding />} />
        <Route path={ROUTES.MACHINE_CODING.slice(1)} element={<MachineCoding />} />
        <Route path={ROUTES.SYSTEM_DESIGN.slice(1)} element={<SystemDesign />} />
        <Route path={ROUTES.DAILY.slice(1)} element={<Daily />} />
        <Route path={ROUTES.PLAYGROUND.slice(1)} element={<Playground />} />
        <Route path={ROUTES.BOOKMARKS.slice(1)} element={<Bookmarks />} />
        <Route path={ROUTES.PROGRESS.slice(1)} element={<Progress />} />
        <Route path={ROUTES.SEARCH.slice(1)} element={<Search />} />
        <Route path={ROUTES.SETTINGS.slice(1)} element={<Settings />} />
        <Route
          path={ROUTES.VISUALIZER.slice(1)}
          element={
            <Suspense fallback={<PageSkeleton variant="problem" />}>
              <Visualizer />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.RUNTIME.slice(1)}
          element={
            <Suspense fallback={<PageSkeleton variant="problem" />}>
              <Visualizer />
            </Suspense>
          }
        />

        {/* Lazy Sub-routes with Realistic Skeleton Loaders */}
        <Route
          path="topics/:topicId"
          element={
            <Suspense fallback={<PageSkeleton variant="problem" />}>
              <TopicDetail />
            </Suspense>
          }
        />
        <Route
          path="topic/:topicId"
          element={
            <Suspense fallback={<PageSkeleton variant="problem" />}>
              <TopicDetail />
            </Suspense>
          }
        />

        {CATEGORIES.map((cat) => (
          <Route
            key={cat}
            path={cat}
            element={
              <Suspense fallback={<PageSkeleton variant="grid" />}>
                <CategoryPage category={cat} />
              </Suspense>
            }
          />
        ))}

        <Route
          path="coding/:problemId"
          element={
            <Suspense fallback={<PageSkeleton variant="problem" />}>
              <CodingDetail />
            </Suspense>
          }
        />

        <Route
          path="machine-coding/:problemId"
          element={
            <Suspense fallback={<PageSkeleton variant="problem" />}>
              <MachineCodingDetail />
            </Suspense>
          }
        />

        <Route
          path="system-design/:problemId"
          element={
            <Suspense fallback={<PageSkeleton variant="problem" />}>
              <SystemDesignDetail />
            </Suspense>
          }
        />

        <Route
          path={ROUTES.SENIOR.slice(1)}
          element={
            <Suspense fallback={<PageSkeleton variant="grid" />}>
              <Senior />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.QUIZ.slice(1)}
          element={
            <Suspense fallback={<PageSkeleton variant="grid" />}>
              <Quiz />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.FLASHCARDS.slice(1)}
          element={
            <Suspense fallback={<PageSkeleton variant="grid" />}>
              <Flashcards />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.INTERVIEW.slice(1)}
          element={
            <Suspense fallback={<PageSkeleton variant="grid" />}>
              <Interview />
            </Suspense>
          }
        />

        <Route
          path="*"
          element={
            <Suspense fallback={<PageSkeleton variant="grid" />}>
              <NotFound />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
