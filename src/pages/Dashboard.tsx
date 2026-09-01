import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProgressContext } from '@/context/ProgressContext';
import { ProgressBar } from '@/components/common/ProgressBar';
import { Card } from '@/components/common/Card';
import {
  allQuestions,
  allCodingProblems,
  allMachineCodingProblems,
  allSystemDesignProblems,
  categories,
  getTopicsByCategory,
} from '@/data';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const {
    completedQuestions,
    completedCoding,
    completedMachineCoding,
    completedSystemDesign,
    dailyStreak,
  } = useProgressContext();

  const totalQuestions = allQuestions.length;
  const totalCompleted = completedQuestions.length;
  const overallPercent = totalQuestions > 0 ? Math.round((totalCompleted / totalQuestions) * 100) : 0;

  const categoryStats = useMemo(() => {
    return categories.map(cat => {
      const topics = getTopicsByCategory(cat.id);
      const questions = topics.flatMap(t => t.questions);
      const completed = questions.filter(q => completedQuestions.includes(q.id)).length;
      const percent = questions.length > 0 ? Math.round((completed / questions.length) * 100) : 0;
      let progressColor: 'success' | 'warning' | 'primary' = 'primary';
      if (percent >= 75) progressColor = 'success';
      else if (percent >= 40) progressColor = 'warning';
      return { ...cat, completed, total: questions.length, percent, progressColor, topicCount: topics.length };
    });
  }, [completedQuestions]);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallPercent / 100) * circumference;

  return (
    <div className={styles.dashboard}>
      {/* Hero Welcome Banner */}
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.pulseDot} />
            <span>FrontendForge Architecture & Engineering Hub</span>
          </div>
          <h1 className={styles.heroTitle}>Master Modern Frontend Engineering & Architecture</h1>
          <p className={styles.heroSubtitle}>
            The comprehensive engineering reference and component laboratory for Junior, Mid-Level, Senior, and Staff Engineers. Master core JavaScript internals, modern CSS layouts, React 19, UI components, and large-scale System Architecture.
          </p>

          <div className={styles.quickActions}>
            <Link to="/roadmap" className={styles.quickActionPrimary}>
              <span>🗺️</span> 8-Week Structured Roadmap
            </Link>
            <Link to="/playground" className={styles.quickActionSecondary}>
              <span>🛠️</span> Code & Live Component Sandbox
            </Link>
            <Link to="/machine-coding" className={styles.quickActionSecondary}>
              <span>🏗️</span> Machine Coding (35)
            </Link>
            <Link to="/system-design" className={styles.quickActionSecondary}>
              <span>📐</span> System Design (9)
            </Link>
          </div>
        </div>

        <div className={styles.streakCard}>
          <div className={styles.streakIcon}>🔥</div>
          <div className={styles.streakValue}>{dailyStreak || 1}</div>
          <div className={styles.streakLabel}>Day Streak</div>
          <div className={styles.streakSub}>Consistent practice is key</div>
        </div>
      </div>

      {/* Featured: The Essential 28 JavaScript Playbook */}
      <section className={styles.essentialBanner}>
        <div className={styles.essentialContent}>
          <div className={styles.essentialBadge}>
            <span>⚡ FEATURED PLAYBOOK</span>
          </div>
          <h2 className={styles.essentialTitle}>The Essential 28 JavaScript Challenges & Polyfills</h2>
          <p className={styles.essentialDesc}>
            Master the canonical 28 production JavaScript problems with progressive 3-tier solutions (Beginner ➔ Intermediate ➔ Expert), interview trap warnings, WeakMap circular defenses, and interactive live executions.
          </p>
          <div className={styles.essentialTags}>
            <span>Currying & Arity</span>
            <span>Safe JSON Serialization</span>
            <span>WeakMap Deep Clone</span>
            <span>Event Emitter</span>
            <span>Debounce & Throttle</span>
            <span>Promise Concurrency</span>
            <span>DOM Template TreeWalker</span>
          </div>
        </div>
        <div className={styles.essentialAction}>
          <Link to="/coding" className={styles.essentialBtn}>
            Explore Essential 28 (3-Tier Solutions) →
          </Link>
        </div>
      </section>

      {/* Guided Career Pathways Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>🎯 Engineering Progression Pathways</h2>
            <p className={styles.sectionSubtitle}>
              Structured learning & reference tracks organized by engineering tier and technical depth.
            </p>
          </div>
        </div>

        <div className={styles.careerGrid}>
          {/* Junior / Fresher Pathway */}
          <div className={styles.careerCard}>
            <div className={styles.careerCardHeader}>
              <span className={styles.careerBadgeJunior}>L3 / Junior / Fresher</span>
              <span className={styles.careerDuration}>Weeks 1–3</span>
            </div>
            <h3 className={styles.careerTitle}>Frontend Core Foundations & Polyfills</h3>
            <p className={styles.careerDesc}>
              Scope, Event Loop, Closures, DOM Manipulation, CSS Grid/Flexbox layouts, and writing JS Polyfills (Promise.all, debounce, throttle, deepClone) from scratch.
            </p>
            <div className={styles.careerTags}>
              <span>JavaScript Internals</span>
              <span>CSS Layouts</span>
              <span>Coding Polyfills</span>
            </div>
            <Link to="/roadmap" className={styles.careerLink}>
              Start Foundation Track →
            </Link>
          </div>

          {/* Mid-Level Pathway */}
          <div className={styles.careerCard}>
            <div className={styles.careerCardHeader}>
              <span className={styles.careerBadgeMid}>L4 / Mid-Level Engineer</span>
              <span className={styles.careerDuration}>Weeks 3–6</span>
            </div>
            <h3 className={styles.careerTitle}>React 19 & Timed Machine Coding</h3>
            <p className={styles.careerDesc}>
              Fiber reconciliation, Custom Hooks lifecycle, Redux Toolkit, and 45-minute timed Machine Coding challenges (Autocomplete, Infinite Scroll, Star Rating, Carousel).
            </p>
            <div className={styles.careerTags}>
              <span>React 19 Hooks</span>
              <span>Machine Coding</span>
              <span>Accessibility ARIA</span>
            </div>
            <Link to="/machine-coding" className={styles.careerLink}>
              Practice Machine Coding (35) →
            </Link>
          </div>

          {/* Senior & Staff Pathway */}
          <div className={styles.careerCard}>
            <div className={styles.careerCardHeader}>
              <span className={styles.careerBadgeSenior}>L5 / L6 / Senior & Staff</span>
              <span className={styles.careerDuration}>Weeks 6–8</span>
            </div>
            <h3 className={styles.careerTitle}>Frontend Architecture & System Design</h3>
            <p className={styles.careerDesc}>
              Scalable client-side architectures for real-time messengers, infinite feeds, collaborative doc editors, Core Web Vitals (LCP, INP, CLS), and staff engineer dilemmas.
            </p>
            <div className={styles.careerTags}>
              <span>System Design</span>
              <span>Web Vitals</span>
              <span>Architecture Scenarios</span>
            </div>
            <Link to="/system-design" className={styles.careerLink}>
              Explore System Design (9) →
            </Link>
          </div>
        </div>
      </section>

      {/* Production Engineering Competency Matrix */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>🏆 Production Engineering Competency Matrix</h2>
            <p className={styles.sectionSubtitle}>
              Master core engineering disciplines across all architectural tiers.
            </p>
          </div>
        </div>

        <div className={styles.matrixGrid}>
          <div className={styles.matrixCard}>
            <div className={styles.matrixIcon}>⚡</div>
            <h4 className={styles.matrixTitle}>Level 1: Core Algorithms & Polyfills</h4>
            <p className={styles.matrixText}>
              Foundational JS runtime mastery, asynchronous event flow, recursion, memory management, and algorithm polyfills.
            </p>
            <Link to="/coding" className={styles.matrixLink}>37 Coding Challenges →</Link>
          </div>

          <div className={styles.matrixCard}>
            <div className={styles.matrixIcon}>🏗️</div>
            <h4 className={styles.matrixTitle}>Level 2: Component Architecture (UI)</h4>
            <p className={styles.matrixText}>
              Building real-world, accessible, 60fps UI components with keyboard ARIA, debounce, focus trapping, and resilient error states.
            </p>
            <Link to="/machine-coding" className={styles.matrixLink}>35 Machine Coding →</Link>
          </div>

          <div className={styles.matrixCard}>
            <div className={styles.matrixIcon}>📐</div>
            <h4 className={styles.matrixTitle}>Level 3: Large-Scale System Design</h4>
            <p className={styles.matrixText}>
              Designing scalable front-end systems for 50M+ users: real-time streaming, optimistic UI, state synchronization, service workers, and telemetry.
            </p>
            <Link to="/system-design" className={styles.matrixLink}>9 System Design Cases →</Link>
          </div>

          <div className={styles.matrixCard}>
            <div className={styles.matrixIcon}>👔</div>
            <h4 className={styles.matrixTitle}>Level 4: Staff Architecture & Vitals</h4>
            <p className={styles.matrixText}>
              Architectural decision trade-offs, Core Web Vitals optimization, bundle budgeting, code splitting, CI/CD pipelines, and technical design RFCs.
            </p>
            <Link to="/senior" className={styles.matrixLink}>Senior Scenarios →</Link>
          </div>
        </div>
      </section>

      {/* Progress & Stats Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>📊 Your Preparation Metrics</h2>
          <Link to="/progress" className={styles.viewAllLink}>
            Detailed Progress & Analytics →
          </Link>
        </div>

        <div className={styles.statsRow}>
          {/* Main Progress Circle */}
          <div className={styles.progressCard}>
            <div className={styles.progressRingWrapper}>
              <svg className={styles.progressSvg} viewBox="0 0 120 120">
                <circle
                  className={styles.progressBg}
                  cx="60"
                  cy="60"
                  r={radius}
                />
                <circle
                  className={styles.progressFill}
                  cx="60"
                  cy="60"
                  r={radius}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className={styles.progressRingText}>
                <span className={styles.ringPercent}>{overallPercent}%</span>
                <span className={styles.ringLabel}>Mastery</span>
              </div>
            </div>
            <div className={styles.progressStats}>
              <div className={styles.statLine}>
                <span className={styles.statLabel}>Questions Done:</span>
                <span className={styles.statVal}>{totalCompleted} / {totalQuestions}</span>
              </div>
              <div className={styles.statLine}>
                <span className={styles.statLabel}>Coding Problems:</span>
                <span className={styles.statVal}>{completedCoding.length} / {allCodingProblems.length}</span>
              </div>
              <div className={styles.statLine}>
                <span className={styles.statLabel}>Machine Coding:</span>
                <span className={styles.statVal}>{completedMachineCoding.length} / {allMachineCodingProblems.length}</span>
              </div>
              <div className={styles.statLine}>
                <span className={styles.statLabel}>System Design:</span>
                <span className={styles.statVal}>{completedSystemDesign.length} / {allSystemDesignProblems.length}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className={styles.metricsGrid}>
            <Card>
              <div className={styles.metricCard}>
                <span className={styles.metricIcon}>📚</span>
                <div className={styles.metricInfo}>
                  <div className={styles.metricNumber}>85</div>
                  <div className={styles.metricLabel}>Curriculum Topics</div>
                </div>
              </div>
            </Card>
            <Card>
              <div className={styles.metricCard}>
                <span className={styles.metricIcon}>💻</span>
                <div className={styles.metricInfo}>
                  <div className={styles.metricNumber}>{allCodingProblems.length}</div>
                  <div className={styles.metricLabel}>Coding Challenges</div>
                </div>
              </div>
            </Card>
            <Card>
              <div className={styles.metricCard}>
                <span className={styles.metricIcon}>🏗️</span>
                <div className={styles.metricInfo}>
                  <div className={styles.metricNumber}>{allMachineCodingProblems.length}</div>
                  <div className={styles.metricLabel}>Machine Coding Tasks</div>
                </div>
              </div>
            </Card>
            <Card>
              <div className={styles.metricCard}>
                <span className={styles.metricIcon}>📐</span>
                <div className={styles.metricInfo}>
                  <div className={styles.metricNumber}>{allSystemDesignProblems.length}</div>
                  <div className={styles.metricLabel}>System Designs</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Category Breakdown */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>📚 Curriculum Domain Progress</h2>
          <Link to="/topics" className={styles.viewAllLink}>
            Browse All 85 Topics →
          </Link>
        </div>

        <div className={styles.categoryGrid}>
          {categoryStats.map(cat => (
            <Link key={cat.id} to={`/${cat.id}`} className={styles.categoryCardLink}>
              <Card>
                <div className={styles.categoryCard}>
                  <div className={styles.categoryHeader}>
                    <span className={styles.catIcon}>{cat.icon}</span>
                    <span className={styles.catTitle}>{cat.title}</span>
                    <span className={styles.catCount}>{cat.topicCount} topics</span>
                  </div>
                  <ProgressBar
                    value={cat.percent}
                    color={cat.progressColor}
                    size="sm"
                    showPercentage
                  />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
