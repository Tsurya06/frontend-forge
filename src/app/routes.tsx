import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Layout = lazy(() => import('@/app/layout/Layout'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Topics = lazy(() => import('@/pages/Topics'));
const TopicDetail = lazy(() => import('@/pages/TopicDetail'));
const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
const Coding = lazy(() => import('@/pages/Coding'));
const CodingDetail = lazy(() => import('@/pages/CodingDetail'));
const MachineCoding = lazy(() => import('@/pages/MachineCoding'));
const MachineCodingDetail = lazy(() => import('@/pages/MachineCodingDetail'));
const SystemDesign = lazy(() => import('@/pages/SystemDesign'));
const SystemDesignDetail = lazy(() => import('@/pages/SystemDesignDetail'));
const Senior = lazy(() => import('@/pages/Senior'));
const Quiz = lazy(() => import('@/pages/Quiz'));
const Flashcards = lazy(() => import('@/pages/Flashcards'));
const Interview = lazy(() => import('@/pages/Interview'));
const Daily = lazy(() => import('@/pages/Daily'));
const Bookmarks = lazy(() => import('@/pages/Bookmarks'));
const Progress = lazy(() => import('@/pages/Progress'));
const Search = lazy(() => import('@/pages/Search'));
const Settings = lazy(() => import('@/pages/Settings'));
const Playground = lazy(() => import('@/pages/Playground'));
const Roadmap = lazy(() => import('@/pages/Roadmap'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const CATEGORIES = [
  'javascript',
  'html',
  'css',
  'browser',
  'react',
  'redux',
  'typescript',
  'performance',
  'testing',
  'security',
  'design-patterns',
  'git',
  'build-tools',
  'package-management',
  'code-quality',
  'accessibility',
] as const;

function PageLoader() {
  return (
    <div className="page-loader">
      <span>Loading…</span>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="roadmap" element={<Roadmap />} />

          <Route path="topics" element={<Topics />} />
          <Route path="topics/:topicId" element={<TopicDetail />} />
          <Route path="topic" element={<Topics />} />
          <Route path="topic/:topicId" element={<TopicDetail />} />

          {CATEGORIES.map((cat) => (
            <Route
              key={cat}
              path={cat}
              element={<CategoryPage category={cat} />}
            />
          ))}

          <Route path="coding" element={<Coding />} />
          <Route path="coding/:problemId" element={<CodingDetail />} />

          <Route path="machine-coding" element={<MachineCoding />} />
          <Route
            path="machine-coding/:problemId"
            element={<MachineCodingDetail />}
          />

          <Route path="system-design" element={<SystemDesign />} />
          <Route
            path="system-design/:problemId"
            element={<SystemDesignDetail />}
          />

          <Route path="senior" element={<Senior />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="interview" element={<Interview />} />
          <Route path="daily" element={<Daily />} />
          <Route path="bookmarks" element={<Bookmarks />} />
          <Route path="progress" element={<Progress />} />
          <Route path="search" element={<Search />} />
          <Route path="settings" element={<Settings />} />
          <Route path="playground" element={<Playground />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
