import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProgressContext } from "@/context/ProgressContext";
import { SearchInput } from "@/components/common/SearchInput";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { allCodingProblems } from "@/data";
import type { Difficulty, CodingProblem } from "@/types";
import styles from "./Coding.module.css";

const difficultyVariant: Record<
  Difficulty,
  "beginner" | "intermediate" | "advanced" | "senior"
> = {
  Beginner: "beginner",
  Intermediate: "intermediate",
  Advanced: "advanced",
  Senior: "senior",
};

type CompletionFilter = "all" | "complete" | "incomplete";
type ViewMode = "table" | "grid";

export default function Coding() {
  const { completedCoding } = useProgressContext();
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [completionFilter, setCompletionFilter] =
    useState<CompletionFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filtered = useMemo<CodingProblem[]>(() => {
    let problems = [...allCodingProblems];

    if (search) {
      const q = search.toLowerCase();
      problems = problems.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.problem.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (difficultyFilter !== "all") {
      problems = problems.filter((p) => p.difficulty === difficultyFilter);
    }

    if (completionFilter !== "all") {
      problems = problems.filter((p) => {
        const done = completedCoding.includes(p.id);
        return completionFilter === "complete" ? done : !done;
      });
    }

    return problems;
  }, [search, difficultyFilter, completionFilter, completedCoding]);

  const totalProblems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalProblems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProblems = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safeCurrentPage, pageSize]);

  const totalDone = completedCoding.length;
  const total = allCodingProblems.length;

  return (
    <div className={styles.page}>
      {/* ── Fixed Sticky Top Section ── */}
      <div className={styles.stickyTopBar}>
        <header className={styles.header}>
          <div className={styles.headerTitleRow}>
            <h1 className={styles.title}>LeetCode Problem Set</h1>
            <div className={styles.statsBadge}>
              <span className={styles.statsCompleted}>{totalDone}</span> /{" "}
              {total} Solved
            </div>
          </div>
          <p className={styles.subtitle}>
            Canonical JavaScript algorithms, polyfills, and engineering
            challenges with 3-tier solutions.
          </p>
        </header>

        <div className={styles.toolbar}>
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setCurrentPage(1);
            }}
            placeholder="Search problems by name or tag..."
            className={styles.search}
          />

          <div className={styles.filters}>
            <select
              className={styles.select}
              value={difficultyFilter}
              onChange={(e) => {
                setDifficultyFilter(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by difficulty"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Easy</option>
              <option value="Intermediate">Medium</option>
              <option value="Advanced">Hard</option>
              <option value="Senior">Senior / Staff</option>
            </select>

            <select
              className={styles.select}
              value={completionFilter}
              onChange={(e) => {
                setCompletionFilter(e.target.value as CompletionFilter);
                setCurrentPage(1);
              }}
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="complete">Solved</option>
              <option value="incomplete">Unsolved</option>
            </select>

            <div className={styles.viewToggle}>
              <button
                type="button"
                className={`${styles.viewBtn} ${viewMode === "table" ? styles.activeView : ""}`}
                onClick={() => setViewMode("table")}
                aria-label="Table view"
              >
                ≡ Table
              </button>
              <button
                type="button"
                className={`${styles.viewBtn} ${viewMode === "grid" ? styles.activeView : ""}`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                ▦ Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scrollable Problem List Body with Pagination ── */}
      <div className={styles.scrollableContent}>
        {totalProblems === 0 ? (
          <EmptyState
            icon="💻"
            title="No problems found"
            description="Try adjusting your search query or filters"
            actionLabel="Reset filters"
            onAction={() => {
              setSearch("");
              setDifficultyFilter("all");
              setCompletionFilter("all");
              setCurrentPage(1);
            }}
          />
        ) : viewMode === "table" ? (
          <div className={styles.tableContainer}>
            <div className={styles.tableScrollBody}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: "48px", textAlign: "center" }}>
                      Status
                    </th>
                    <th>Title</th>
                    <th style={{ width: "120px" }}>Solution</th>
                    <th style={{ width: "130px" }}>Difficulty</th>
                    <th
                      style={{ width: "180px" }}
                      className={styles.hideMobile}
                    >
                      Category
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProblems.map((problem, idx) => {
                    const done = completedCoding.includes(problem.id);
                    const globalIdx =
                      (safeCurrentPage - 1) * pageSize + idx + 1;
                    return (
                      <tr key={problem.id} className={styles.tableRow}>
                        <td style={{ textAlign: "center" }}>
                          {done ? (
                            <span
                              className={styles.statusSolved}
                              title="Solved"
                            >
                              ✓
                            </span>
                          ) : (
                            <span
                              className={styles.statusUnsolved}
                              title="Unsolved"
                            >
                              ○
                            </span>
                          )}
                        </td>
                        <td>
                          <Link
                            to={`/coding/${problem.id}`}
                            className={styles.tableTitleLink}
                          >
                            <span className={styles.problemNumber}>
                              {globalIdx}.
                            </span>{" "}
                            {problem.title}
                          </Link>
                          <div className={styles.tableTags}>
                            {problem.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className={styles.miniTag}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <Link
                            to={`/coding/${problem.id}?tab=solutions`}
                            className={styles.solutionLink}
                            title="View Solutions & Code"
                          >
                            📄 Solution
                          </Link>
                        </td>
                        <td>
                          <Badge
                            variant={difficultyVariant[problem.difficulty]}
                            size="small"
                          >
                            {problem.difficulty === "Beginner"
                              ? "Easy"
                              : problem.difficulty === "Intermediate"
                                ? "Medium"
                                : "Hard"}
                          </Badge>
                        </td>
                        <td className={styles.hideMobile}>
                          <span className={styles.categoryName}>
                            {problem.category || "JavaScript"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              totalItems={totalProblems}
              pageSize={pageSize}
              pageSizeOptions={[10, 20, 50, 100]}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        ) : (
          <div className={styles.gridContainer}>
            <div className={styles.gridScrollBody}>
              <div className={styles.grid}>
                {paginatedProblems.map((problem) => {
                  const done = completedCoding.includes(problem.id);
                  return (
                    <Link
                      key={problem.id}
                      to={`/coding/${problem.id}`}
                      className={styles.problemLink}
                    >
                      <Card>
                        <div className={styles.problemCard}>
                          <div className={styles.problemHeader}>
                            <h3 className={styles.problemTitle}>
                              {problem.title}
                            </h3>
                            <Badge
                              variant={difficultyVariant[problem.difficulty]}
                              size="small"
                            >
                              {problem.difficulty === "Beginner"
                                ? "Easy"
                                : problem.difficulty === "Intermediate"
                                  ? "Medium"
                                  : "Hard"}
                            </Badge>
                          </div>
                          <p className={styles.problemDesc}>
                            {problem.problem}
                          </p>
                          <div className={styles.problemFooter}>
                            <div className={styles.tags}>
                              {problem.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="tag" size="small">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            {done && (
                              <span className={styles.statusSolved}>
                                ✓ Solved
                              </span>
                            )}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>

            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              totalItems={totalProblems}
              pageSize={pageSize}
              pageSizeOptions={[10, 20, 50, 100]}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}
      </div>
    </div>
  );
}
