import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProgressContext } from "@/context/ProgressContext";
import { SearchInput } from "@/components/common/SearchInput";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { EmptyState } from "@/components/common/EmptyState";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { useVirtualGrid } from "@/hooks/useVirtualGrid";
import { machineCodingApi } from "@/services/api";
import { useApiQuery } from "@/services/api/hooks/useApi";
import type { Difficulty, MachineCodingProblem } from "@/types";
import styles from "./MachineCoding.module.css";

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

export default function MachineCoding() {
  const { completedMachineCoding } = useProgressContext();
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [completionFilter, setCompletionFilter] =
    useState<CompletionFilter>("all");

  const { data: problemsData, loading } = useApiQuery<MachineCodingProblem[]>(() =>
    machineCodingApi.getAll()
  );
  const allProblems: MachineCodingProblem[] = useMemo(() => problemsData ?? [], [problemsData]);

  const filtered = useMemo<MachineCodingProblem[]>(() => {
    let problems = [...allProblems];

    if (search) {
      const q = search.toLowerCase();
      problems = problems.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.problemStatement.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (difficultyFilter !== "all") {
      problems = problems.filter((p) => p.difficulty === difficultyFilter);
    }

    if (completionFilter !== "all") {
      problems = problems.filter((p) => {
        const done = completedMachineCoding.includes(p.id);
        return completionFilter === "complete" ? done : !done;
      });
    }

    return problems;
  }, [allProblems, search, difficultyFilter, completionFilter, completedMachineCoding]);

  const {
    visibleItems: renderedProblems,
    hasMore,
    sentinelRef,
    totalCount,
    renderedCount,
  } = useVirtualGrid<MachineCodingProblem>(filtered, {
    initialCount: 16,
    batchSize: 12,
  });

  const totalDone = completedMachineCoding.length;
  const total = allProblems.length;

  return (
    <div className={styles.page}>
      <div className={styles.stickyTopBar}>
        <header className={styles.header}>
          <h1 className={styles.title}>Machine Coding Components</h1>
          <p className={styles.subtitle}>
            {totalDone}/{total} completed • Build enterprise UI components from
            scratch
          </p>
        </header>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search machine coding problems..."
        />

        <div className={styles.filters}>
          <select
            className={styles.select}
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
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
            onChange={(e) =>
              setCompletionFilter(e.target.value as CompletionFilter)
            }
            aria-label="Filter by completion"
          >
            <option value="all">All Status</option>
            <option value="complete">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>
      </div>

      <div className={styles.scrollableContent}>
        {loading ? (
          <PageSkeleton variant="grid" />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🏗️"
            title="No machine coding problems found"
            description="Try adjusting your filters or search query"
            actionLabel="Reset filters"
            onAction={() => {
              setSearch("");
              setDifficultyFilter("all");
              setCompletionFilter("all");
            }}
          />
        ) : (
          <>
            <div className={styles.grid}>
              {renderedProblems.map((problem) => {
                const done = completedMachineCoding.includes(problem.id);
                return (
                  <Link
                    key={problem.id}
                    to={`/machine-coding/${problem.id}`}
                    className={styles.problemLink}
                  >
                    <Card className={styles.cardContainer}>
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
                          {problem.problemStatement}
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
                            <Badge variant="beginner" size="small">
                              ✓ Done
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {hasMore && (
              <div ref={sentinelRef} className={styles.loadingSentinel}>
                <span>
                  Loading more components ({renderedCount} of {totalCount})...
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
