import { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/app/layout/Layout";

// Primary Navigation Routes (eagerly loaded for instantaneous 0ms tab switching)
import Dashboard from "@/pages/Dashboard";
import Roadmap from "@/pages/Roadmap";
import Topics from "@/pages/Topics";
import Coding from "@/pages/Coding";
import MachineCoding from "@/pages/MachineCoding";
import SystemDesign from "@/pages/SystemDesign";
import Daily from "@/pages/Daily";
import Playground from "@/pages/Playground";
import Bookmarks from "@/pages/Bookmarks";
import Progress from "@/pages/Progress";
import Search from "@/pages/Search";
import Settings from "@/pages/Settings";

// Deep / Specialized sub-routes (lazy loaded with idle prefetching)
const TopicDetail = lazy(() => import("@/pages/TopicDetail"));
const CategoryPage = lazy(() => import("@/pages/CategoryPage"));
const CodingDetail = lazy(() => import("@/pages/CodingDetail"));
const MachineCodingDetail = lazy(() => import("@/pages/MachineCodingDetail"));
const SystemDesignDetail = lazy(() => import("@/pages/SystemDesignDetail"));
const Senior = lazy(() => import("@/pages/Senior"));
const Quiz = lazy(() => import("@/pages/Quiz"));
const Flashcards = lazy(() => import("@/pages/Flashcards"));
const Interview = lazy(() => import("@/pages/Interview"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Background prefetch during browser idle time
function startIdlePrefetch() {
  if (typeof window === "undefined") return;
  const prefetch = () => {
    import("@/pages/TopicDetail");
    import("@/pages/CodingDetail");
    import("@/pages/MachineCodingDetail");
    import("@/pages/SystemDesignDetail");
    import("@/pages/CategoryPage");
    import("@/pages/Senior");
    import("@/pages/Quiz");
    import("@/pages/Flashcards");
    import("@/pages/Interview");
  };

  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(prefetch, { timeout: 2000 });
  } else {
    setTimeout(prefetch, 800);
  }
}

const CATEGORIES = [
  "javascript",
  "html",
  "css",
  "browser",
  "react",
  "redux",
  "typescript",
  "performance",
  "testing",
  "security",
  "design-patterns",
  "git",
  "build-tools",
  "package-management",
  "code-quality",
  "accessibility",
] as const;

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
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="topics" element={<Topics />} />
        <Route path="topic" element={<Topics />} />
        <Route path="coding" element={<Coding />} />
        <Route path="machine-coding" element={<MachineCoding />} />
        <Route path="system-design" element={<SystemDesign />} />
        <Route path="daily" element={<Daily />} />
        <Route path="playground" element={<Playground />} />
        <Route path="bookmarks" element={<Bookmarks />} />
        <Route path="progress" element={<Progress />} />
        <Route path="search" element={<Search />} />
        <Route path="settings" element={<Settings />} />

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
          path="senior"
          element={
            <Suspense fallback={<PageSkeleton variant="grid" />}>
              <Senior />
            </Suspense>
          }
        />
        <Route
          path="quiz"
          element={
            <Suspense fallback={<PageSkeleton variant="grid" />}>
              <Quiz />
            </Suspense>
          }
        />
        <Route
          path="flashcards"
          element={
            <Suspense fallback={<PageSkeleton variant="grid" />}>
              <Flashcards />
            </Suspense>
          }
        />
        <Route
          path="interview"
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
