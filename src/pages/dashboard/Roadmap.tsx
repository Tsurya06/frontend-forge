import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  Component,
  Layers,
  BookOpen,
  Atom,
  Award,
  Activity,
  Mic,
  CreditCard,
  Gauge,
  ShieldCheck,
} from "lucide-react";
import { useProgressContext } from "@/context/ProgressContext";
import {
  allCodingProblems,
  allMachineCodingProblems,
  allSystemDesignProblems,
  allTopics,
  allQuestions,
} from "@/data";
import styles from "./Roadmap.module.css";

export default function Roadmap() {
  const {
    completedCoding,
    completedMachineCoding,
    completedSystemDesign,
    completedQuestions,
  } = useProgressContext();
  const [activeTab, setActiveTab] = useState<"studyplan" | "curriculum">(
    "studyplan",
  );

  const codingDone = completedCoding.length;
  const codingTotal = allCodingProblems.length;
  const codingPercent = Math.round((codingDone / codingTotal) * 100);

  const mcDone = completedMachineCoding.length;
  const mcTotal = allMachineCodingProblems.length;
  const mcPercent = Math.round((mcDone / mcTotal) * 100);

  return (
    <div className={styles.pageLayout}>
      {/* ── Fixed Main Header Bar (Always pinned at the top) ── */}
      <header className={styles.fixedHeaderBar}>
        <div className={styles.fixedHeaderInner}>
          <div>
            <h1 className={styles.pageTitle}>
              {activeTab === "studyplan" ? "Study Plan" : "8-Week Roadmap"}
            </h1>
            <p className={styles.pageSubtitle}>
              {activeTab === "studyplan"
                ? "Curated study tracks and company sprint preparation for frontend engineers."
                : "Structured weekly path from JavaScript fundamentals to Staff-level Frontend System Design."}
            </p>
          </div>
          <div className={styles.tabToggle}>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === "studyplan" ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab("studyplan")}
            >
              Study Plans
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === "curriculum" ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab("curriculum")}
            >
              8-Week Roadmap
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Study Plan Content Area (Independently Scrollable) ── */}
      <main className={styles.scrollArea}>
        <div className={styles.studyPlanContent}>
          {activeTab === "studyplan" ? (
            <>
              {/* ── 1. Ongoing Section ── */}
              <section className={styles.sectionBlock}>
                <h2 className={styles.sectionTitle}>Ongoing Practice</h2>
                <div className={styles.ongoingGrid}>
                  <Link to="/coding" className={styles.ongoingCard}>
                    <div className={styles.ongoingIconBox}>
                      <span className={styles.ongoingIconText}>JS</span>
                    </div>
                    <div className={styles.ongoingDetails}>
                      <div className={styles.ongoingHeader}>
                        <h3 className={styles.ongoingName}>
                          28 Core JavaScript Polyfills
                        </h3>
                        <span className={styles.ongoingBadge}>
                          {codingDone === codingTotal ? "Completed" : "In Progress"}
                        </span>
                      </div>
                      <div className={styles.progressTrack}>
                        <div
                          className={styles.progressBar}
                          style={{ width: `${Math.max(codingDone > 0 ? 8 : 0, codingPercent)}%` }}
                        />
                      </div>
                      <div className={styles.progressMeta}>
                        <span>Algorithm & Polyfill Mastery</span>
                        <span>
                          {codingDone} / {codingTotal} Solved ({codingPercent}%)
                        </span>
                      </div>
                    </div>
                  </Link>

                  {mcDone > 0 && (
                    <Link to="/machine-coding" className={styles.ongoingCard}>
                      <div
                        className={styles.ongoingIconBox}
                        style={{
                          borderColor: "rgba(0, 184, 163, 0.3)",
                          background: "rgba(0, 184, 163, 0.12)",
                        }}
                      >
                        <span className={styles.ongoingIconText} style={{ color: "#00b8a3" }}>
                          UI
                        </span>
                      </div>
                      <div className={styles.ongoingDetails}>
                        <div className={styles.ongoingHeader}>
                          <h3 className={styles.ongoingName}>
                            Machine Coding Components
                          </h3>
                          <span
                            className={styles.ongoingBadge}
                            style={{ color: "#00b8a3", background: "rgba(0, 184, 163, 0.15)" }}
                          >
                            In Progress
                          </span>
                        </div>
                        <div className={styles.progressTrack}>
                          <div
                            className={styles.progressBar}
                            style={{
                              width: `${Math.max(8, mcPercent)}%`,
                              background: "linear-gradient(90deg, #00b8a3 0%, #3b82f6 100%)",
                            }}
                          />
                        </div>
                        <div className={styles.progressMeta}>
                          <span>Component Hierarchy & State</span>
                          <span>
                            {mcDone} / {mcTotal} Solved ({mcPercent}%)
                          </span>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              </section>

              {/* ── 2. Featured Section (4 Real Curriculum Pillars) ── */}
              <section className={styles.sectionBlock}>
                <h2 className={styles.sectionTitle}>Core Curriculum Pillars</h2>
                <div className={styles.featuredGrid}>
                  {/* Card 1: 28 Polyfills */}
                  <Link
                    to="/coding"
                    className={`${styles.featuredCard} ${styles.cardBlue}`}
                  >
                    <div className={styles.cardHeader}>
                      <h3 className={styles.featuredCardTitle}>
                        28 Core Polyfills
                      </h3>
                      <p className={styles.featuredCardDesc}>
                        {codingDone}/{allCodingProblems.length} Algorithm &
                        Polyfill Challenges
                      </p>
                    </div>
                    <div className={styles.cardGraphic}>
                      <span className={styles.bigGraphicIcon}>
                        <Zap size={32} />
                      </span>
                    </div>
                  </Link>

                  {/* Card 2: 35 Machine Coding */}
                  <Link
                    to="/machine-coding"
                    className={`${styles.featuredCard} ${styles.cardTeal}`}
                  >
                    <div className={styles.cardHeader}>
                      <h3 className={styles.featuredCardTitle}>
                        35 Machine Coding
                      </h3>
                      <p className={styles.featuredCardDesc}>
                        {completedMachineCoding.length}/
                        {allMachineCodingProblems.length} Interactive Component
                        Tasks
                      </p>
                    </div>
                    <div className={styles.cardGraphic}>
                      <span className={styles.bigGraphicIcon}>
                        <Component size={32} />
                      </span>
                    </div>
                  </Link>

                  {/* Card 3: 9 System Design */}
                  <Link
                    to="/system-design"
                    className={`${styles.featuredCard} ${styles.cardPurple}`}
                  >
                    <div className={styles.cardHeader}>
                      <h3 className={styles.featuredCardTitle}>
                        9 System Design
                      </h3>
                      <p className={styles.featuredCardDesc}>
                        {completedSystemDesign.length}/
                        {allSystemDesignProblems.length} Large-Scale
                        Architecture Blueprints
                      </p>
                    </div>
                    <div className={styles.cardGraphic}>
                      <span className={styles.bigGraphicIcon}>
                        <Layers size={32} />
                      </span>
                    </div>
                  </Link>

                  {/* Card 4: 85 Topics Library */}
                  <Link
                    to="/topics"
                    className={`${styles.featuredCard} ${styles.cardGold}`}
                  >
                    <div className={styles.cardHeader}>
                      <h3 className={styles.featuredCardTitle}>
                        85 Topics Library
                      </h3>
                      <p className={styles.featuredCardDesc}>
                        {completedQuestions.length}/{allQuestions.length}{" "}
                        Questions across {allTopics.length} Core Topics
                      </p>
                    </div>
                    <div className={styles.cardGraphic}>
                      <span className={styles.bigGraphicIcon}>
                        <BookOpen size={32} />
                      </span>
                    </div>
                  </Link>
                </div>
              </section>

              {/* ── 3. Specialized Deep Dives & Assessment Tools ── */}
              <section className={styles.sectionBlock}>
                <h2 className={styles.sectionTitle}>
                  Specialized Tools & Deep Dives
                </h2>
                <div className={styles.crackingGrid}>
                  <Link to="/visualizer" className={styles.crackCard}>
                    <div className={styles.crackTop}>
                      <span className={styles.crackTagSim}>SIMULATOR</span>
                      <span className={styles.crackIcon}>
                        <Activity size={16} />
                      </span>
                    </div>
                    <h3 className={styles.crackTitle}>
                      Event Loop Visualizer
                    </h3>
                    <p className={styles.crackDesc}>
                      Frame-by-frame V8 Call Stack, Memory Heap, Microtask &
                      Macrotask queues simulation
                    </p>
                  </Link>

                  <Link to="/senior" className={styles.crackCard}>
                    <div className={styles.crackTop}>
                      <span className={styles.crackTagStaff}>STAFF / LEAD</span>
                      <span className={styles.crackIcon}>
                        <Award size={16} />
                      </span>
                    </div>
                    <h3 className={styles.crackTitle}>
                      Staff Engineering Guide
                    </h3>
                    <p className={styles.crackDesc}>
                      RFC processes, technical vision, trade-off matrix &
                      mentoring
                    </p>
                  </Link>

                  <Link to="/interview" className={styles.crackCard}>
                    <div className={styles.crackTop}>
                      <span className={styles.crackTagMock}>TIMED MOCK</span>
                      <span className={styles.crackIcon}>
                        <Mic size={16} />
                      </span>
                    </div>
                    <h3 className={styles.crackTitle}>
                      Mock Technical Interview
                    </h3>
                    <p className={styles.crackDesc}>
                      Realistic 45-minute timed interview with randomized
                      questions & scoring
                    </p>
                  </Link>

                  <Link to="/flashcards" className={styles.crackCard}>
                    <div className={styles.crackTop}>
                      <span className={styles.crackTagRecall}>ACTIVE RECALL</span>
                      <span className={styles.crackIcon}>
                        <CreditCard size={16} />
                      </span>
                    </div>
                    <h3 className={styles.crackTitle}>
                      Interactive Flashcards
                    </h3>
                    <p className={styles.crackDesc}>
                      Rapid-fire 3D card flips covering core frontend interview
                      concepts & APIs
                    </p>
                  </Link>
                </div>
              </section>

              {/* ── 4. 30-Day Sprint Plans ── */}
              <section className={styles.sectionBlock}>
                <h2 className={styles.sectionTitle}>30-Day Topic Sprints</h2>
                <div className={styles.thirtyDaysGrid}>
                  <Link
                    to="/topics/javascript-engine"
                    className={styles.thirtyCard}
                  >
                    <div className={styles.thirtyIconBox}>
                      <span className={styles.thirtyIcon}>
                        <Zap size={20} />
                      </span>
                    </div>
                    <div className={styles.thirtyContent}>
                      <h3 className={styles.thirtyTitle}>
                        JavaScript Engine Mastery
                      </h3>
                      <p className={styles.thirtyDesc}>
                        Closures, Promises, Prototypes & V8 Execution
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/topics/react-components"
                    className={styles.thirtyCard}
                  >
                    <div className={styles.thirtyIconBox}>
                      <span className={styles.thirtyIcon}>
                        <Atom size={20} />
                      </span>
                    </div>
                    <div className={styles.thirtyContent}>
                      <h3 className={styles.thirtyTitle}>
                        React 19 & Architecture
                      </h3>
                      <p className={styles.thirtyDesc}>
                        Hooks, Server Components, Actions & Concurrent Mode
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/topics/performance-metrics"
                    className={styles.thirtyCard}
                  >
                    <div className={styles.thirtyIconBox}>
                      <span className={styles.thirtyIcon}>
                        <Gauge size={20} />
                      </span>
                    </div>
                    <div className={styles.thirtyContent}>
                      <h3 className={styles.thirtyTitle}>
                        Web Performance & Vitals
                      </h3>
                      <p className={styles.thirtyDesc}>
                        INP, LCP, CLS, Bundle Optimization & Profiling
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/topics/security-defenses"
                    className={styles.thirtyCard}
                  >
                    <div className={styles.thirtyIconBox}>
                      <span className={styles.thirtyIcon}>
                        <ShieldCheck size={20} />
                      </span>
                    </div>
                    <div className={styles.thirtyContent}>
                      <h3 className={styles.thirtyTitle}>
                        Web Security & Defenses
                      </h3>
                      <p className={styles.thirtyDesc}>
                        XSS Prevention, CSRF Defense, CSP & CORS
                      </p>
                    </div>
                  </Link>
                </div>
              </section>
            </>
          ) : (
            /* ── 8-Week Structured Curriculum Breakdown ── */
            <div className={styles.curriculumSection}>
              <div className={styles.weekList}>
                {[
                  {
                    week: 1,
                    title: "JavaScript Engine & Asynchronous Patterns",
                    topics:
                      "Event Loop, Microtasks, Closures, Promises, Prototypes",
                    link: "/topics/javascript-engine",
                  },
                  {
                    week: 2,
                    title: "Polyfills & Utility Functions",
                    topics:
                      "Promise.all, debounce, throttle, deepCopy, deepEqual, memoize",
                    link: "/coding",
                  },
                  {
                    week: 3,
                    title: "DOM & Browser Architecture",
                    topics:
                      "Rendering pipeline, Reflow/Repaint, Event Delegation, Web APIs",
                    link: "/topics/browser-rendering",
                  },
                  {
                    week: 4,
                    title: "React 19 & State Management",
                    topics:
                      "Hooks internals, Concurrent Mode, Actions, Optimistic UI, Redux Toolkit",
                    link: "/topics/react-components",
                  },
                  {
                    week: 5,
                    title: "TypeScript & Type Systems",
                    topics:
                      "Generics, Conditional Types, Type Narrowing, AST, Template Literals",
                    link: "/topics/typescript-generics",
                  },
                  {
                    week: 6,
                    title: "Machine Coding & UI Engineering",
                    topics:
                      "Autocomplete, Infinite Scroll, Modals, Resizable Splitter, Virtualization",
                    link: "/machine-coding",
                  },
                  {
                    week: 7,
                    title: "Performance & Security",
                    topics:
                      "Core Web Vitals, INP, LCP, CLS, XSS, CSRF, CSP, Cache-Control, CDN",
                    link: "/topics/performance-metrics",
                  },
                  {
                    week: 8,
                    title: "Frontend System Design & Staff Leadership",
                    topics:
                      "Newsfeed architecture, Realtime Collab, Micro-frontends, Technical Strategy",
                    link: "/system-design",
                  },
                ].map((item) => (
                  <Link
                    key={item.week}
                    to={item.link}
                    className={styles.weekCard}
                  >
                    <div className={styles.weekBadge}>Week {item.week}</div>
                    <div className={styles.weekInfo}>
                      <h3 className={styles.weekTitle}>{item.title}</h3>
                      <p className={styles.weekTopics}>{item.topics}</p>
                    </div>
                    <span className={styles.weekArrow}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
