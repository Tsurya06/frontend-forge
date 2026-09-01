import { useState } from "react";
import { Link } from "react-router-dom";
import { useProgressContext } from "@/context/ProgressContext";
import { LeftQuickNav } from "@/components/layout/LeftQuickNav";
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

  return (
    <div className={styles.pageLayout}>
      {/* ── Left Quick-Nav Sidebar (Desktop) ── */}
      <LeftQuickNav />

      {/* ── Main Study Plan Content Area (Independently Scrollable) ── */}
      <main className={styles.scrollArea}>
        <div className={styles.studyPlanContent}>
          {/* Header */}
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.pageTitle}>Study Plan</h1>
              <p className={styles.pageSubtitle}>
                Curated study tracks and company sprint preparation for frontend
                engineers.
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

          {activeTab === "studyplan" ? (
            <>
              {/* ── 1. Ongoing Section ── */}
              <section className={styles.sectionBlock}>
                <h2 className={styles.sectionTitle}>Ongoing</h2>
                <div className={styles.ongoingGrid}>
                  <Link to="/coding" className={styles.ongoingCard}>
                    <div className={styles.ongoingIconBox}>
                      <span className={styles.ongoingIconText}>TOP</span>
                    </div>
                    <div className={styles.ongoingDetails}>
                      <div className={styles.ongoingHeader}>
                        <h3 className={styles.ongoingName}>
                          The Essential 28 JavaScript Polyfills
                        </h3>
                        <span className={styles.ongoingBadge}>In Progress</span>
                      </div>
                      <div className={styles.progressTrack}>
                        <div
                          className={styles.progressBar}
                          style={{ width: `${Math.max(8, codingPercent)}%` }}
                        />
                      </div>
                      <div className={styles.progressMeta}>
                        <span>Total Progress</span>
                        <span>
                          {codingDone} / {codingTotal} Solved
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </section>

              {/* ── 2. Featured Section (4 Real Curriculum Pillars) ── */}
              <section className={styles.sectionBlock}>
                <h2 className={styles.sectionTitle}>Featured Tracks</h2>
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
                      <span className={styles.bigGraphicIcon}>⚡</span>
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
                      <span className={styles.bigGraphicIcon}>🏗️</span>
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
                      <span className={styles.bigGraphicIcon}>📐</span>
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
                      <span className={styles.bigGraphicIcon}>📚</span>
                    </div>
                  </Link>
                </div>
              </section>

              {/* ── 3. 30 Days Challenge ── */}
              <section className={styles.sectionBlock}>
                <h2 className={styles.sectionTitle}>30 Days Challenge</h2>
                <div className={styles.thirtyDaysGrid}>
                  <Link to="/coding" className={styles.thirtyCard}>
                    <div className={styles.thirtyIconBox}>
                      <span className={styles.thirtyIcon}>⚡</span>
                    </div>
                    <div className={styles.thirtyContent}>
                      <h3 className={styles.thirtyTitle}>
                        30 Days of JavaScript
                      </h3>
                      <p className={styles.thirtyDesc}>
                        Closures, Promises, Event Loop & Object Prototypes
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/topics/react-components"
                    className={styles.thirtyCard}
                  >
                    <div className={styles.thirtyIconBox}>
                      <span className={styles.thirtyIcon}>⚛️</span>
                    </div>
                    <div className={styles.thirtyContent}>
                      <h3 className={styles.thirtyTitle}>
                        30 Days of React 19
                      </h3>
                      <p className={styles.thirtyDesc}>
                        Hooks, Actions, Compiler & Concurrent Rendering
                      </p>
                    </div>
                  </Link>
                </div>
              </section>

              {/* ── 4. Cracking Coding Interview Tracks ── */}
              <section className={styles.sectionBlock}>
                <h2 className={styles.sectionTitle}>
                  Interview Preparation Tracks
                </h2>
                <div className={styles.crackingGrid}>
                  <Link to="/coding" className={styles.crackCard}>
                    <div className={styles.crackTop}>
                      <span className={styles.crackTag}>ONGOING</span>
                      <span className={styles.crackIcon}>⚡</span>
                    </div>
                    <h3 className={styles.crackTitle}>
                      Essential 28 Polyfills
                    </h3>
                    <p className={styles.crackDesc}>
                      Promise.all, debounce, deepEqual, custom setInterval &
                      currying
                    </p>
                  </Link>

                  <Link to="/machine-coding" className={styles.crackCard}>
                    <div className={styles.crackTop}>
                      <span className={styles.crackTagUI}>UI / UX</span>
                      <span className={styles.crackIcon}>🏗️</span>
                    </div>
                    <h3 className={styles.crackTitle}>Machine Coding 35</h3>
                    <p className={styles.crackDesc}>
                      Autocomplete, virtual lists, carousel, modals & sortable
                      table
                    </p>
                  </Link>

                  <Link to="/system-design" className={styles.crackCard}>
                    <div className={styles.crackTop}>
                      <span className={styles.crackTagArch}>ARCHITECT</span>
                      <span className={styles.crackIcon}>📐</span>
                    </div>
                    <h3 className={styles.crackTitle}>System Design 9</h3>
                    <p className={styles.crackDesc}>
                      Realtime feeds, video streaming, collaborative docs &
                      caching
                    </p>
                  </Link>

                  <Link to="/senior" className={styles.crackCard}>
                    <div className={styles.crackTop}>
                      <span className={styles.crackTagStaff}>STAFF / LEAD</span>
                      <span className={styles.crackIcon}>👔</span>
                    </div>
                    <h3 className={styles.crackTitle}>
                      Staff Engineering Guide
                    </h3>
                    <p className={styles.crackDesc}>
                      RFC processes, technical vision, trade-off matrix &
                      mentoring
                    </p>
                  </Link>
                </div>
              </section>
            </>
          ) : (
            /* ── 8-Week Structured Curriculum Breakdown ── */
            <div className={styles.curriculumSection}>
              <div className={styles.curriculumHeader}>
                <h2 className={styles.curriculumTitle}>
                  8-Week Frontend Mastery Curriculum
                </h2>
                <p className={styles.curriculumDesc}>
                  Structured weekly path from JavaScript fundamentals to
                  Staff-level Frontend System Design.
                </p>
              </div>

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
                      <h3 className={styles.weekName}>{item.title}</h3>
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
