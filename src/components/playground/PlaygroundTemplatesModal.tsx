import { useState, useMemo } from "react";
import styles from "@/pages/playground/Playground.module.css";
import type { TemplateItem } from "./types";

export interface PlaygroundTemplatesModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly allTemplates: readonly TemplateItem[];
  readonly onSelectTemplate: (item: TemplateItem) => void;
}

function getDifficultyStyle(difficulty: string): string {
  switch (difficulty) {
    case "Beginner":
      return styles.snippetBeginner ?? "";
    case "Intermediate":
      return styles.snippetIntermediate ?? "";
    case "Advanced":
      return styles.snippetAdvanced ?? "";
    case "Senior":
      return styles.snippetSenior ?? "";
    default:
      return styles.snippetBadge ?? "";
  }
}

export function PlaygroundTemplatesModal({
  isOpen,
  onClose,
  allTemplates,
  onSelectTemplate,
}: Readonly<PlaygroundTemplatesModalProps>) {
  const [templateSearch, setTemplateSearch] = useState("");
  const [templateCategory, setTemplateCategory] = useState("all");

  const filteredTemplates = useMemo(() => {
    return allTemplates.filter((t) => {
      if (templateSearch.trim()) {
        const q = templateSearch.toLowerCase();
        const matches =
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (templateCategory === "all") return true;
      if (templateCategory === "react")
        return (
          t.language === "react" ||
          t.category.toLowerCase().includes("react")
        );
      if (templateCategory === "snippets") return t.type === "snippet";
      if (templateCategory === "polyfills")
        return t.type === "coding" && t.category !== "CSS";
      if (templateCategory === "html-css")
        return (
          t.language === "html" ||
          t.category.toLowerCase().includes("css") ||
          t.category.toLowerCase().includes("html")
        );
      if (templateCategory === "algorithms")
        return (
          t.category.toLowerCase().includes("algorithm") ||
          t.category.toLowerCase().includes("object")
        );
      return true;
    });
  }, [allTemplates, templateSearch, templateCategory]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="templates-modal-title"
      >
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleGroup}>
            <span className={styles.modalIcon}>📑</span>
            <div>
              <h2 id="templates-modal-title" className={styles.modalTitle}>
                Templates &amp; Practice Snippets
              </h2>
              <p className={styles.modalSubtitle}>
                1-click loads algorithm solutions or HTML components into sandbox
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.modalCloseBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className={styles.modalFilterArea}>
          <div className={styles.modalSearchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="search"
              className={styles.modalSearchInput}
              placeholder="Search templates, polyfills, algorithms, HTML layouts..."
              value={templateSearch}
              onChange={(e) => setTemplateSearch(e.target.value)}
              autoFocus
            />
            {templateSearch && (
              <button
                type="button"
                className={styles.clearSearchBtn}
                onClick={() => setTemplateSearch("")}
              >
                ✕
              </button>
            )}
          </div>

          <div className={styles.modalCategoryRow}>
            {[
              { id: "all", label: "All", count: allTemplates.length },
              { id: "react", label: "React Components", count: 4 },
              { id: "snippets", label: "Core Snippets", count: 8 },
              { id: "polyfills", label: "Polyfills", count: 28 },
              { id: "html-css", label: "HTML & CSS", count: 6 },
              { id: "algorithms", label: "Algorithms", count: 5 },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`${styles.modalCatPill} ${
                  templateCategory === cat.id ? styles.modalCatPillActive : ""
                }`}
                onClick={() => setTemplateCategory(cat.id)}
              >
                <span>{cat.label}</span>
                <span className={styles.pillBadge}>{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* List Grid */}
        <div className={styles.modalGrid}>
          {filteredTemplates.length === 0 ? (
            <div className={styles.emptyTemplates}>
              <p>No snippets or templates match your search.</p>
              <button
                type="button"
                className={styles.resetSearchBtn}
                onClick={() => {
                  setTemplateSearch("");
                  setTemplateCategory("all");
                }}
              >
                Clear Search Filters
              </button>
            </div>
          ) : (
            filteredTemplates.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.templateCard}
                onClick={() => onSelectTemplate(item)}
              >
                <div className={styles.templateCardTop}>
                  <span className={styles.templateCardName}>{item.name}</span>
                  <span className={getDifficultyStyle(item.difficulty)}>
                    {item.difficulty}
                  </span>
                </div>
                <p className={styles.templateCardDesc}>{item.description}</p>
                <div className={styles.templateCardFooter}>
                  <span className={styles.categoryTag}>{item.category}</span>
                  <span className={styles.templateLoadHint}>
                    ▶ Load into Sandbox
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
