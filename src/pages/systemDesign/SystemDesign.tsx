import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { SearchInput } from "@/components/common/SearchInput";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { EmptyState } from "@/components/common/EmptyState";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { useVirtualGrid } from "@/hooks/useVirtualGrid";
import { systemDesignApi } from "@/services/api";
import { useApiQuery } from "@/services/api/hooks/useApi";
import type { Difficulty, SystemDesignProblem } from "@/types";
import styles from "./SystemDesign.module.css";

const difficultyVariant: Record<
  Difficulty,
  "beginner" | "intermediate" | "advanced" | "senior"
> = {
  Beginner: "beginner",
  Intermediate: "intermediate",
  Advanced: "advanced",
  Senior: "senior",
};

export default function SystemDesign() {
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const { data: problemsData, loading } = useApiQuery<SystemDesignProblem[]>(() =>
    systemDesignApi.getAll()
  );
  const allProblems: SystemDesignProblem[] = useMemo(() => problemsData ?? [], [problemsData]);

  const filtered = useMemo<SystemDesignProblem[]>(() => {
    let problems = [...allProblems];

    if (search) {
      const q = search.toLowerCase();
      problems = problems.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.requirements.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (difficultyFilter !== "all") {
      problems = problems.filter((p) => p.difficulty === difficultyFilter);
    }

    return problems;
  }, [allProblems, search, difficultyFilter]);

  const {
    visibleItems: renderedProblems,
    hasMore,
    sentinelRef,
    totalCount,
    renderedCount,
  } = useVirtualGrid(filtered, { initialCount: 16, batchSize: 12 });

  return (
    <div className={styles.page}>
      <div className={styles.stickyTopBar}>
        <header className={styles.header}>
          <h1 className={styles.title}>Frontend System Design</h1>
          <p className={styles.subtitle}>
            {"Architecture & design patterns for large-scale production applications"}
          </p>
        </header>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search system design problems..."
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
        </div>
      </div>

      <div className={styles.scrollableContent}>
        {loading ? (
          <PageSkeleton variant="grid" />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="📐"
            title="No system design problems found"
            description="Try adjusting your search or filters"
            actionLabel="Reset filters"
            onAction={() => {
              setSearch("");
              setDifficultyFilter("all");
            }}
          />
        ) : (
          <>
            <div className={styles.grid}>
              {renderedProblems.map((problem) => (
                <Link
                  key={problem.id}
                  to={`/system-design/${problem.id}`}
                  className={styles.problemLink}
                >
                  <Card className={styles.cardContainer}>
                    <div className={styles.problemCard}>
                      <h3 className={styles.problemTitle}>{problem.title}</h3>
                      <div className={styles.problemMeta}>
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
                        {problem.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="tag" size="small">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className={styles.problemDesc}>
                        {problem.requirements.slice(0, 150)}
                        {problem.requirements.length > 150 ? "..." : ""}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {hasMore && (
              <div ref={sentinelRef} className={styles.loadingSentinel}>
                <span>
                  Loading more system designs ({renderedCount} of {totalCount}
                  )...
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
