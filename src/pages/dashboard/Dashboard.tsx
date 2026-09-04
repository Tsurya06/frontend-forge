import type { ReactNode } from "react";
import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Star,
  Flame,
  LayoutGrid,
  Zap,
  Component,
  Layers,
  Atom,
  FileCode2,
  Gauge,
  Palette,
  Search,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useProgressContext } from "@/context/ProgressContext";
import { useBookmarkContext } from "@/context/BookmarkContext";
import { useVirtualGrid } from "@/hooks/useVirtualGrid";
import {
  allCodingProblems,
  allMachineCodingProblems,
  allSystemDesignProblems,
} from "@/data";
import type { Difficulty } from "@/types";
import styles from "./Dashboard.module.css";

export interface UnifiedChallenge {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  track: "coding" | "machineCoding" | "systemDesign";
  link: string;
  solutionLabel: string;
  description: string;
}

interface CategoryPill {
  id: string;
  label: string;
  icon: ReactNode;
}

const categoryPills: CategoryPill[] = [
  { id: "all", label: "All Challenges", icon: <LayoutGrid size={14} /> },
  { id: "coding", label: "Polyfills & Algorithms (38)", icon: <Zap size={14} /> },
  { id: "machine-coding", label: "Machine Coding (35)", icon: <Component size={14} /> },
  { id: "system-design", label: "System Design (9)", icon: <Layers size={14} /> },
  { id: "react", label: "React & UI", icon: <Atom size={14} /> },
  { id: "typescript", label: "TypeScript", icon: <FileCode2 size={14} /> },
  { id: "performance", label: "Performance", icon: <Gauge size={14} /> },
  { id: "css", label: "CSS & Layouts", icon: <Palette size={14} /> },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { isComplete, dailyStreak } = useProgressContext();
  const { isBookmarked, toggleBookmark } = useBookmarkContext();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTopicChip, setSelectedTopicChip] = useState<string | null>(
    null,
  );
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | Difficulty>(
    "all",
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "solved" | "unsolved"
  >("all");
  const [tagsExpanded, setTagsExpanded] = useState(false);

  // 1. Unify all 82+ challenges across all 3 tracks
  const allChallenges = useMemo<UnifiedChallenge[]>(() => {
    const coding: UnifiedChallenge[] = allCodingProblems.map((p) => ({
      id: p.id,
      title: p.title,
      difficulty: p.difficulty,
      category: p.category || "JavaScript",
      tags: p.tags,
      track: "coding",
      link: `/coding/${p.id}`,
      solutionLabel: "📄 Solution",
      description: p.problem,
    }));

    const machine: UnifiedChallenge[] = allMachineCodingProblems.map((p) => ({
      id: p.id,
      title: p.title,
      difficulty: p.difficulty,
      category: "Machine Coding",
      tags: ["Machine Coding", "Component", ...p.tags],
      track: "machineCoding",
      link: `/machine-coding/${p.id}`,
      solutionLabel: "🏗️ Component",
      description: p.problemStatement,
    }));

    const sysDesign: UnifiedChallenge[] = allSystemDesignProblems.map((p) => ({
      id: p.id,
      title: p.title,
      difficulty: p.difficulty,
      category: "System Design",
      tags: ["System Design", "Architecture", ...p.tags],
      track: "systemDesign",
      link: `/system-design/${p.id}`,
      solutionLabel: "📐 Blueprint",
      description: p.requirements,
    }));

    return [...coding, ...machine, ...sysDesign];
  }, []);

  // 2. Dynamically compute topic tags from all challenges
  const dynamicTopicTags = useMemo(() => {
    const tagCountMap = new Map<string, number>();
    allChallenges.forEach((p) => {
      p.tags.forEach((tag) => {
        const clean = tag.trim().toLowerCase();
        if (
          clean === "component" ||
          clean === "machine coding" ||
          clean === "system design"
        )
          return;
        const formatted = clean.charAt(0).toUpperCase() + clean.slice(1);
        tagCountMap.set(formatted, (tagCountMap.get(formatted) || 0) + 1);
      });
    });
    return Array.from(tagCountMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [allChallenges]);

  // 3. Filter problems across all tracks
  const filteredProblems = useMemo<UnifiedChallenge[]>(() => {
    let list = [...allChallenges];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (selectedCategory !== "all") {
      if (selectedCategory === "coding") {
        list = list.filter((p) => p.track === "coding");
      } else if (selectedCategory === "machine-coding") {
        list = list.filter((p) => p.track === "machineCoding");
      } else if (selectedCategory === "system-design") {
        list = list.filter((p) => p.track === "systemDesign");
      } else if (selectedCategory === "react") {
        list = list.filter(
          (p) =>
            p.category.toLowerCase().includes("react") ||
            p.tags.some(
              (t) =>
                t.toLowerCase().includes("react") ||
                t.toLowerCase().includes("hook") ||
                t.toLowerCase().includes("dom"),
            ),
        );
      } else if (selectedCategory === "typescript") {
        list = list.filter(
          (p) =>
            p.category.toLowerCase().includes("typescript") ||
            p.tags.some(
              (t) =>
                t.toLowerCase().includes("typescript") ||
                t.toLowerCase() === "ts",
            ),
        );
      } else if (selectedCategory === "performance") {
        list = list.filter(
          (p) =>
            p.category.toLowerCase().includes("performance") ||
            p.tags.some(
              (t) =>
                t.toLowerCase().includes("performance") ||
                t.toLowerCase().includes("virtual") ||
                t.toLowerCase().includes("debounce") ||
                t.toLowerCase().includes("memoize"),
            ),
        );
      } else if (selectedCategory === "css") {
        list = list.filter(
          (p) =>
            p.category.toLowerCase().includes("css") ||
            p.tags.some(
              (t) =>
                t.toLowerCase().includes("css") ||
                t.toLowerCase().includes("layout") ||
                t.toLowerCase().includes("flexbox"),
            ),
        );
      }
    }

    if (selectedTopicChip) {
      const chipQ = selectedTopicChip.toLowerCase();
      list = list.filter((p) => p.tags.some((t) => t.toLowerCase() === chipQ));
    }

    if (difficultyFilter !== "all") {
      list = list.filter((p) => p.difficulty === difficultyFilter);
    }

    if (statusFilter === "solved") {
      list = list.filter((p) => isComplete(p.id, p.track));
    } else if (statusFilter === "unsolved") {
      list = list.filter((p) => !isComplete(p.id, p.track));
    }

    return list;
  }, [
    allChallenges,
    search,
    selectedCategory,
    selectedTopicChip,
    difficultyFilter,
    statusFilter,
    isComplete,
  ]);

  // Infinite Scroll Hook
  const { visibleItems, sentinelRef, totalCount, renderedCount } =
    useVirtualGrid<UnifiedChallenge>(filteredProblems, {
      initialCount: 15,
      batchSize: 10,
    });

  // Pick Random Problem
  const pickRandomProblem = () => {
    if (allChallenges.length > 0) {
      const randomIndex = Math.floor(Math.random() * allChallenges.length);
      const chosen = allChallenges[randomIndex];
      if (chosen) {
        navigate(chosen.link);
      }
    }
  };

  // Calendar dates
  const today = new Date();
  const currentDay = today.getDate();
  const monthName = today
    .toLocaleString("default", { month: "short" })
    .toUpperCase();

  const displayedTags = tagsExpanded
    ? dynamicTopicTags
    : dynamicTopicTags.slice(0, 9);

  return (
    <div className={styles.pageLayout}>
      {/* ── Center Problemset Stream (Scrollable) ── */}
      <main className={styles.centerStream}>
        <div className={styles.centerContent}>
          {/* Top 3 Feature Banner Cards */}
          <section
            className={styles.bannerRow}
            aria-label="Featured Highlights"
          >
            <Link
              to="/coding"
              className={`${styles.bannerCard} ${styles.bannerGold}`}
            >
              <div className={styles.bannerBadge}>POPULAR</div>
              <h2 className={styles.bannerTitle}>
                Essential 28 JavaScript Polyfills
              </h2>
              <p className={styles.bannerSubtitle}>
                28 Core Algorithm & Polyfill challenges asked in Tier-1
                interviews
              </p>
            </Link>

            <Link
              to="/machine-coding"
              className={`${styles.bannerCard} ${styles.bannerBlue}`}
            >
              <div className={styles.bannerBadge}>UI / UX</div>
              <h2 className={styles.bannerTitle}>
                35 Machine Coding Components
              </h2>
              <p className={styles.bannerSubtitle}>
                Interactive autocomplete, infinite scroll, virtual lists, and
                modals
              </p>
            </Link>

            <Link
              to="/system-design"
              className={`${styles.bannerCard} ${styles.bannerPurple}`}
            >
              <div className={styles.bannerBadge}>ARCHITECT</div>
              <h2 className={styles.bannerTitle}>
                9 Frontend System Design Blueprints
              </h2>
              <p className={styles.bannerSubtitle}>
                Real-time feeds, video streaming, collaborative docs & caching
              </p>
            </Link>

            <Link
              to="/visualizer"
              className={`${styles.bannerCard} ${styles.bannerEmerald}`}
            >
              <div className={styles.bannerBadge}>NEW · INTERACTIVE</div>
              <h2 className={styles.bannerTitle}>
                <Zap size={16} />
                <span>JS Runtime & Event Loop Visualizer</span>
              </h2>
              <p className={styles.bannerSubtitle}>
                Step through Call Stack, Memory Heap, Web APIs & Microtask Queues
              </p>
            </Link>
          </section>

          {/* ── 3. Topic Tag Chips with Real Problem Counts ── */}
          <section className={styles.tagChipsSection}>
            <div className={styles.chipsRow}>
              {displayedTags.map((tag) => {
                const isSelected =
                  selectedTopicChip?.toLowerCase() === tag.name.toLowerCase();
                return (
                  <button
                    key={tag.name}
                    type="button"
                    className={`${styles.topicChip} ${isSelected ? styles.topicChipActive : ""}`}
                    onClick={() =>
                      setSelectedTopicChip(isSelected ? null : tag.name)
                    }
                  >
                    <span className={styles.topicName}>{tag.name}</span>
                    <span className={styles.topicCount}>{tag.count}</span>
                  </button>
                );
              })}

              <button
                type="button"
                className={styles.expandTagsBtn}
                onClick={() => setTagsExpanded(!tagsExpanded)}
              >
                <span>{tagsExpanded ? "Collapse" : "Expand"}</span>
                {tagsExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>
          </section>

          {/* ── 4. Non-Scrolling Clean Category Filter Pills ── */}
          <div className={styles.categoryPillsRow}>
            {categoryPills.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`${styles.categoryPill} ${selectedCategory === cat.id ? styles.categoryPillActive : ""}`}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedTopicChip(null);
                }}
              >
                <span className={styles.pillIcon}>{cat.icon}</span>
                <span className={styles.pillText}>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* ── 5. Search & Filters Toolbar ── */}
          <div className={styles.filterToolbar}>
            <div className={styles.searchWrapper}>
              <span className={styles.searchIcon}>
                <Search size={14} />
              </span>
              <input
                type="search"
                className={styles.searchInput}
                placeholder="Search questions by title, keyword, or concept..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div className={styles.filterControls}>
              {/* Difficulty Dropdown */}
              <select
                className={styles.filterSelect}
                value={difficultyFilter}
                onChange={(e) =>
                  setDifficultyFilter(e.target.value as "all" | Difficulty)
                }
                aria-label="Filter by Difficulty"
              >
                <option value="all">Difficulty: All</option>
                <option value="Beginner">Easy</option>
                <option value="Intermediate">Medium</option>
                <option value="Advanced">Hard</option>
              </select>

              {/* Status Dropdown */}
              <select
                className={styles.filterSelect}
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "all" | "solved" | "unsolved",
                  )
                }
                aria-label="Filter by Status"
              >
                <option value="all">Status: All</option>
                <option value="solved">Solved</option>
                <option value="unsolved">Unsolved</option>
              </select>

              {/* Pick Random Button */}
              <button
                type="button"
                className={styles.randomPickBtn}
                onClick={pickRandomProblem}
                title="Pick Random Problem"
              >
                <span>🔀 Pick Random</span>
              </button>
            </div>
          </div>

          {/* ── 6. Problem Stream List (Infinite Scroll) ── */}
          <section
            className={styles.problemStreamSection}
            aria-label="Problem List"
          >
            {/* Stream Header */}
            <div className={styles.streamHeaderRow}>
              <span className={styles.colStatus}>Status</span>
              <span className={styles.colTitle}>Title</span>
              <span className={styles.colSolution}>Solutions</span>
              <span className={styles.colAcceptance}>Acceptance</span>
              <span className={styles.colDifficulty}>Difficulty</span>
              <span className={styles.colAction}>Action</span>
            </div>

            {/* Problem Stream Rows */}
            <div className={styles.streamList}>
              {visibleItems.length === 0 ? (
                <div className={styles.emptyResults}>
                  <p>No challenges match your active filters.</p>
                  <button
                    type="button"
                    className={styles.resetFiltersBtn}
                    onClick={() => {
                      setSearch("");
                      setSelectedCategory("all");
                      setSelectedTopicChip(null);
                      setDifficultyFilter("all");
                      setStatusFilter("all");
                    }}
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                visibleItems.map(
                  (challenge: UnifiedChallenge, index: number) => {
                    const isDone = isComplete(challenge.id, challenge.track);
                    const isStarred = isBookmarked(challenge.id);
                    const diff = challenge.difficulty;

                    let diffClass = styles.diffEasy;
                    let diffLabel = "Easy";
                    if (diff === "Intermediate") {
                      diffClass = styles.diffMedium;
                      diffLabel = "Med.";
                    } else if (diff === "Advanced" || diff === "Senior") {
                      diffClass = styles.diffHard;
                      diffLabel = "Hard";
                    }

                    const globalIndex =
                      allChallenges.findIndex((p) => p.id === challenge.id) + 1;

                    return (
                      <div
                        key={challenge.id}
                        className={`${styles.streamRow} ${index % 2 === 1 ? styles.streamRowAlt : ""}`}
                      >
                        {/* Status Checkmark */}
                        <span className={styles.statusCol}>
                          {isDone ? (
                            <span className={styles.solvedCheck} title="Solved">
                              ✓
                            </span>
                          ) : (
                            <span
                              className={styles.unsolvedCircle}
                              title="Unsolved"
                            >
                              ○
                            </span>
                          )}
                        </span>

                        {/* Problem Title */}
                        <div className={styles.titleCol}>
                          <Link
                            to={challenge.link}
                            className={styles.problemLink}
                          >
                            <span className={styles.problemNum}>
                              {globalIndex}.
                            </span>
                            <span className={styles.problemName}>
                              {challenge.title}
                            </span>
                          </Link>
                          {challenge.tags && challenge.tags.length > 0 && (
                            <div className={styles.rowTags}>
                              {challenge.tags.slice(0, 3).map((t: string) => (
                                <span key={t} className={styles.miniTag}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Solutions Badge */}
                        <span className={styles.solutionCol}>
                          <Link
                            to={`${challenge.link}?tab=solutions`}
                            className={styles.solutionLink}
                            title="View Solutions & Code"
                          >
                            {challenge.solutionLabel}
                          </Link>
                        </span>

                        {/* Acceptance */}
                        <span className={styles.acceptanceCol}>
                          {diff === "Beginner"
                            ? "68.4%"
                            : diff === "Intermediate"
                              ? "51.2%"
                              : "38.9%"}
                        </span>

                        {/* Difficulty Badge */}
                        <span
                          className={`${styles.difficultyCol} ${diffClass}`}
                        >
                          {diffLabel}
                        </span>

                        {/* Star Bookmark */}
                        <button
                          type="button"
                          className={`${styles.bookmarkBtn} ${isStarred ? styles.bookmarked : ""}`}
                          onClick={() => toggleBookmark(challenge.id)}
                          title={
                            isStarred ? "Remove Bookmark" : "Bookmark Problem"
                          }
                          aria-label="Bookmark"
                        >
                          <Star size={14} fill={isStarred ? "currentColor" : "none"} />
                        </button>
                      </div>
                    );
                  },
                )
              )}

              {/* Bottom Infinite Sentinel */}
              {renderedCount < totalCount && (
                <div ref={sentinelRef} className={styles.loadingSentinel}>
                  <span className={styles.sentinelSpinner} />
                  <span>
                    Loading more problems ({renderedCount} of {totalCount})...
                  </span>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* ── 3. Daily & Activity Widgets (Desktop) ── */}
      <aside className={styles.rightWidgets}>
        {/* Calendar Widget */}
        <div className={styles.calendarWidget}>
          <div className={styles.calendarTop}>
            <div className={styles.calendarDayHeader}>
              <span className={styles.dayText}>
                Day {currentDay} •{" "}
                <Flame
                  size={13}
                  className={
                    dailyStreak > 0 ? styles.streakFlame : styles.streakFlameBroken
                  }
                />{" "}
                {dailyStreak}d
              </span>
              <span className={styles.timeLeft}>Daily Challenge</span>
            </div>
            <div className={styles.monthBadge}>
              <span className={styles.monthNum}>{currentDay}</span>
              <span className={styles.monthLabel}>{monthName}</span>
            </div>
          </div>

          {/* Days Grid */}
          <div className={styles.calendarGrid}>
            <div className={styles.weekHeaders}>
              <span>S</span>
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
            </div>
            <div className={styles.daysMatrix}>
              {[...Array(30)].map((_, i) => {
                const dayNum = i + 1;
                const isToday = dayNum === currentDay;
                return (
                  <div
                    key={dayNum}
                    className={`${styles.calendarDayCell} ${isToday ? styles.todayCell : ""}`}
                  >
                    {dayNum}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Start Daily */}
          <Link to="/daily" className={styles.redeemBtn}>
            <Zap size={14} />
            <span>Start Today's Challenge</span>
          </Link>
        </div>
      </aside>
    </div>
  );
}
