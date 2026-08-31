import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/common/Badge';
import { ProgressBar } from '@/components/common/ProgressBar';
import styles from './Roadmap.module.css';

interface Milestone {
  id: string;
  title: string;
  category: string;
  estimatedHours: number;
  link: string;
  completed?: boolean;
}

interface Phase {
  id: string;
  phaseNumber: number;
  title: string;
  duration: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Senior';
  icon: string;
  color: string;
  milestones: Milestone[];
}

const ROADMAP_PHASES: Phase[] = [
  {
    id: 'phase-1',
    phaseNumber: 1,
    title: 'JavaScript Deep Dive & Execution Engine',
    duration: 'Weeks 1–2 (25 hrs)',
    description:
      'Master the foundational engine internals, asynchronous programming patterns, memory management, and ES6+ coding polyfills.',
    difficulty: 'Intermediate',
    icon: '⚡',
    color: '#f59e0b',
    milestones: [
      { id: 'm-js-scope', title: 'Scope, Closures & Lexical Environment', category: 'JavaScript', estimatedHours: 3, link: '/topics/js-variables' },
      { id: 'm-js-types', title: 'Data Types, Coercion & Symbols', category: 'JavaScript', estimatedHours: 3, link: '/topics/js-types' },
      { id: 'm-js-eventloop', title: 'Event Loop, Microtasks & Concurrency', category: 'JavaScript', estimatedHours: 4, link: '/topics/js-concurrency' },
      { id: 'm-js-prototypes', title: 'Prototypes, Prototype Chain & OOP', category: 'JavaScript', estimatedHours: 3, link: '/topics/js-oop' },
      { id: 'm-js-async', title: 'Promises, Async/Await & Generator Internals', category: 'JavaScript', estimatedHours: 4, link: '/topics/js-async' },
      { id: 'm-js-coding', title: 'Coding: Promise.all, Debounce, Throttle, Currying & Deep Clone', category: 'Coding', estimatedHours: 6, link: '/coding' },
      { id: 'm-js-sandbox', title: 'Practice in Sandbox: Write & Test Polyfills', category: 'Playground', estimatedHours: 2, link: '/playground' },
    ],
  },
  {
    id: 'phase-2',
    phaseNumber: 2,
    title: 'Browser Architecture, HTML5 & Modern CSS',
    duration: 'Weeks 2–3 (20 hrs)',
    description:
      'Understand Critical Rendering Path (CRP), modern CSS layout systems, DOM events, Web APIs, and browser security fundamentals.',
    difficulty: 'Intermediate',
    icon: '🌐',
    color: '#3b82f6',
    milestones: [
      { id: 'm-web-crp', title: 'Critical Rendering Path & Browser Rendering Engine', category: 'Browser', estimatedHours: 3, link: '/topics/browser-rendering-1' },
      { id: 'm-web-events', title: 'DOM Event Propagation, Bubbling, Capturing & Delegation', category: 'JavaScript', estimatedHours: 3, link: '/topics/js-events' },
      { id: 'm-web-css', title: 'CSS Flexbox, Grid & Layout Architecture', category: 'CSS', estimatedHours: 4, link: '/topics/css-flexbox-grid' },
      { id: 'm-web-storage', title: 'Client Storage: Cookies, LocalStorage, IndexedDB & Cache', category: 'Browser', estimatedHours: 3, link: '/topics/browser-storage-1' },
      { id: 'm-web-security', title: 'Web Security: XSS, CSRF, CSP, CORS & Clickjacking', category: 'Security', estimatedHours: 4, link: '/topics/web-security-attacks' },
      { id: 'm-web-sockets', title: 'WebSockets, Real-time Protocols & HTTP/2/3', category: 'Browser', estimatedHours: 3, link: '/topics/browser-websockets-1' },
    ],
  },
  {
    id: 'phase-3',
    phaseNumber: 3,
    title: 'React 19 Mastery & State Management',
    duration: 'Weeks 3–4 (25 hrs)',
    description:
      'Deep-dive into Fiber reconciliation, Virtual DOM heuristics, custom Hooks, React 19 Server Components, and Redux Toolkit architecture.',
    difficulty: 'Advanced',
    icon: '⚛️',
    color: '#06b6d4',
    milestones: [
      { id: 'm-react-fiber', title: 'React Virtual DOM & Reconciliation Engine', category: 'React', estimatedHours: 4, link: '/topics/react-vdom-reconciliation' },
      { id: 'm-react-hooks', title: 'Custom Hooks Rules & Internal Lifecycle Mechanics', category: 'React', estimatedHours: 5, link: '/topics/react-custom-hooks-rules' },
      { id: 'm-react-components', title: 'Component Architecture & Props Composition', category: 'React', estimatedHours: 4, link: '/topics/react-components' },
      { id: 'm-react-state', title: 'Redux Toolkit, RTK Query & State Management', category: 'Redux', estimatedHours: 5, link: '/topics/redux-1' },
      { id: 'm-react-perf', title: 'React Optimization, Memoization & Profiling', category: 'React', estimatedHours: 4, link: '/topics/react-optimization' },
      { id: 'm-react-testing', title: 'Component Testing: React Testing Library & Vitest', category: 'Testing', estimatedHours: 3, link: '/topics/react-testing' },
    ],
  },
  {
    id: 'phase-4',
    phaseNumber: 4,
    title: 'TypeScript for Scalable Production Systems',
    duration: 'Weeks 4–5 (15 hrs)',
    description:
      'Master type gymnastics, generics, mapped and conditional types, utility types, and strict type-safety patterns.',
    difficulty: 'Intermediate',
    icon: '📘',
    color: '#6366f1',
    milestones: [
      { id: 'm-ts-fundamentals', title: 'TypeScript Fundamentals, Interfaces & Type Aliases', category: 'TypeScript', estimatedHours: 3, link: '/topics/ts-fundamentals-1' },
      { id: 'm-ts-advanced', title: 'Advanced Types: Conditional, Mapped & Template Literals', category: 'TypeScript', estimatedHours: 4, link: '/topics/ts-advanced-1' },
      { id: 'm-ts-safety', title: 'Type Safety, Strict Mode & Soundness', category: 'TypeScript', estimatedHours: 3, link: '/topics/ts-type-safety-1' },
      { id: 'm-ts-react', title: 'React + TypeScript Component Patterns & Generics', category: 'TypeScript', estimatedHours: 3, link: '/topics/ts-react-1' },
      { id: 'm-ts-playground', title: 'Test TypeScript in Sandbox IDE', category: 'Playground', estimatedHours: 2, link: '/playground' },
    ],
  },
  {
    id: 'phase-5',
    phaseNumber: 5,
    title: 'Machine Coding & UI Component Engineering',
    duration: 'Weeks 5–6 (30 hrs)',
    description:
      'Build real-world, accessible, and high-performance interactive components under 45-minute timed interview constraints.',
    difficulty: 'Advanced',
    icon: '🏗️',
    color: '#10b981',
    milestones: [
      { id: 'm-mc-starrating', title: 'Machine Coding: Star Rating Widget & Hover Preview', category: 'Machine Coding', estimatedHours: 3, link: '/machine-coding/mc-star-rating' },
      { id: 'm-mc-modal', title: 'Machine Coding: Accessible Modal with Focus Trap', category: 'Machine Coding', estimatedHours: 3, link: '/machine-coding/mc-modal' },
      { id: 'm-mc-autocomplete', title: 'Machine Coding: Debounced API Autocomplete with Keyboard ARIA', category: 'Machine Coding', estimatedHours: 4, link: '/machine-coding/mc-api-autocomplete' },
      { id: 'm-mc-infinitescroll', title: 'Machine Coding: Infinite Scroll with IntersectionObserver', category: 'Machine Coding', estimatedHours: 3, link: '/machine-coding/mc-infinite-scroll' },
      { id: 'm-mc-carousel', title: 'Machine Coding: Touch-friendly Carousel / Image Slider', category: 'Machine Coding', estimatedHours: 4, link: '/machine-coding/mc-carousel' },
      { id: 'm-mc-calendar', title: 'Machine Coding: Calendar & Date Range Picker', category: 'Machine Coding', estimatedHours: 5, link: '/machine-coding/mc-calendar-date-picker' },
      { id: 'm-mc-dragdrop', title: 'Machine Coding: Drag and Drop Kanban Board', category: 'Machine Coding', estimatedHours: 4, link: '/machine-coding/mc-drag-drop' },
      { id: 'm-mc-all', title: 'Browse & Solve Remaining 28 Machine Coding Problems', category: 'Machine Coding', estimatedHours: 4, link: '/machine-coding' },
    ],
  },
  {
    id: 'phase-6',
    phaseNumber: 6,
    title: 'Frontend System Design & Architecture',
    duration: 'Weeks 6–7 (25 hrs)',
    description:
      'Learn how to design scalable frontend architectures for massive user bases with caching, real-time protocols, and resiliency.',
    difficulty: 'Advanced',
    icon: '📐',
    color: '#8b5cf6',
    milestones: [
      { id: 'm-sd-chat', title: 'Design: Real-time Messenger (WebSockets, SSE, Optimistic UI)', category: 'System Design', estimatedHours: 4, link: '/system-design/sd-chat' },
      { id: 'm-sd-newsfeed', title: 'Design: Infinite Newsfeed (Virtualization, Prefetching & Image CDN)', category: 'System Design', estimatedHours: 4, link: '/system-design/sd-news-feed' },
      { id: 'm-sd-autocomplete', title: 'Design: Typeahead Search Engine with Trie & Client Caching', category: 'System Design', estimatedHours: 3, link: '/system-design/sd-autocomplete' },
      { id: 'm-sd-collab', title: 'Design: Real-time Collaborative Document Editor (CRDT / OT)', category: 'System Design', estimatedHours: 4, link: '/system-design/sd-collaborative-editor' },
      { id: 'm-sd-video', title: 'Design: Adaptive Bitrate Video Streaming Player (HLS / DASH)', category: 'System Design', estimatedHours: 3, link: '/system-design/sd-video' },
      { id: 'm-sd-upload', title: 'Design: Resumable Chunked File Uploader with Backoff', category: 'System Design', estimatedHours: 3, link: '/system-design/sd-file-upload' },
      { id: 'm-sd-analytics', title: 'Design: Client-side Telemetry, Analytics & Error Tracker', category: 'System Design', estimatedHours: 4, link: '/system-design/sd-analytics' },
    ],
  },
  {
    id: 'phase-7',
    phaseNumber: 7,
    title: 'Senior & Staff Architecture Mastery',
    duration: 'Weeks 7–8 (20 hrs)',
    description:
      'Master Core Web Vitals optimization, bundle budgeting, architectural decision frameworks, and leadership technical scenarios.',
    difficulty: 'Senior',
    icon: '👔',
    color: '#ec4899',
    milestones: [
      { id: 'm-sr-vitals', title: 'Core Web Vitals Mastery: LCP, INP, CLS & Real User Monitoring', category: 'Performance', estimatedHours: 3, link: '/topics/browser-web-vitals-1' },
      { id: 'm-sr-bundle', title: 'Bundle Optimization, Tree-shaking & Code Splitting', category: 'Performance', estimatedHours: 3, link: '/topics/bundle-optimization' },
      { id: 'm-sr-perf', title: 'Advanced Performance Optimization Techniques', category: 'Performance', estimatedHours: 4, link: '/topics/performance-optimization-techniques' },
      { id: 'm-sr-patterns', title: 'Frontend Design Patterns: Module, Observer, Strategy', category: 'Design Patterns', estimatedHours: 4, link: '/topics/frontend-design-patterns' },
      { id: 'm-sr-arch', title: 'Senior Architectural Dilemmas & Staff Engineer Scenarios', category: 'Senior', estimatedHours: 5, link: '/topics/senior-arch' },
      { id: 'm-sr-mock', title: 'Complete Full 45-Minute Timed Technical Assessments', category: 'Assessment', estimatedHours: 5, link: '/interview' },
    ],
  },
];

export default function Roadmap() {
  const [completedMilestones, setCompletedMilestones] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('feeq-roadmap-milestones');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleMilestone = (milestoneId: string) => {
    setCompletedMilestones(prev => {
      const next = prev.includes(milestoneId)
        ? prev.filter(id => id !== milestoneId)
        : [...prev, milestoneId];
      localStorage.setItem('feeq-roadmap-milestones', JSON.stringify(next));
      return next;
    });
  };

  const totalMilestones = useMemo(() => {
    return ROADMAP_PHASES.reduce((acc, p) => acc + p.milestones.length, 0);
  }, []);

  const totalCompleted = completedMilestones.length;
  const overallPercentage = Math.round((totalCompleted / totalMilestones) * 100);

  const difficultyVariant = (difficulty: Phase['difficulty']) => {
    switch (difficulty) {
      case 'Beginner': return 'beginner';
      case 'Intermediate': return 'intermediate';
      case 'Advanced': return 'advanced';
      case 'Senior': return 'senior';
      default: return 'tag';
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.stickyTopBar}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>
              <span>🗺️</span> Frontend Engineering Roadmap
            </h1>
            <p className={styles.subtitle}>
              A comprehensive 8-week structured roadmap covering JavaScript internals, browser architecture, React 19, Machine Coding, and System Design.
            </p>
          </div>
          <div className={styles.progressSummary}>
            <div className={styles.progressTop}>
              <span className={styles.progressLabel}>Roadmap Completion</span>
              <span className={styles.progressValue}>{overallPercentage}%</span>
            </div>
            <ProgressBar value={overallPercentage} size="md" />
            <span className={styles.progressMeta}>
              {totalCompleted} of {totalMilestones} milestones completed
            </span>
          </div>
        </div>
      </div>

      <div className={styles.scrollableContent}>
        <div className={styles.phasesList}>
          {ROADMAP_PHASES.map((phase) => {
            const phaseCompleted = phase.milestones.filter(m => completedMilestones.includes(m.id)).length;
            const phasePct = Math.round((phaseCompleted / phase.milestones.length) * 100);

            return (
              <section key={phase.id} className={styles.phaseCard}>
                <div className={styles.phaseHeader}>
                  <div className={styles.phaseIconBadge} style={{ backgroundColor: `${phase.color}18`, color: phase.color }}>
                    <span className={styles.phaseIcon}>{phase.icon}</span>
                  </div>

                  <div className={styles.phaseInfo}>
                    <div className={styles.phaseTopRow}>
                      <span className={styles.phaseTag}>PHASE {phase.phaseNumber}</span>
                      <Badge variant={difficultyVariant(phase.difficulty)} size="small">
                        {phase.difficulty}
                      </Badge>
                      <span className={styles.durationBadge}>⏱ {phase.duration}</span>
                    </div>
                    <h2 className={styles.phaseTitle}>{phase.title}</h2>
                    <p className={styles.phaseDesc}>{phase.description}</p>
                  </div>

                  <div className={styles.phaseProgress}>
                    <div className={styles.phaseProgStats}>
                      <span>{phaseCompleted}/{phase.milestones.length} done</span>
                      <span>{phasePct}%</span>
                    </div>
                    <ProgressBar value={phasePct} size="sm" />
                  </div>
                </div>

                <div className={styles.milestonesGrid}>
                  {phase.milestones.map((m) => {
                    const isDone = completedMilestones.includes(m.id);
                    return (
                      <div
                        key={m.id}
                        className={`${styles.milestoneItem} ${isDone ? styles.milestoneDone : ''}`}
                      >
                        <button
                          type="button"
                          className={`${styles.checkbox} ${isDone ? styles.checkboxChecked : ''}`}
                          onClick={() => toggleMilestone(m.id)}
                          aria-label={isDone ? `Mark ${m.title} incomplete` : `Mark ${m.title} complete`}
                        >
                          {isDone ? '✓' : ''}
                        </button>

                        <div className={styles.milestoneContent}>
                          <Link to={m.link} className={styles.milestoneLink}>
                            <span className={styles.milestoneTitle}>{m.title}</span>
                          </Link>
                          <div className={styles.milestoneMeta}>
                            <span className={styles.milestoneCat}>{m.category}</span>
                            <span>•</span>
                            <span className={styles.milestoneHours}>~{m.estimatedHours}h</span>
                          </div>
                        </div>

                        <Link to={m.link} className={styles.startBtn}>
                          {isDone ? 'Review' : 'Start →'}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
