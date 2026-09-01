import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useBookmarkContext } from "@/context/BookmarkContext";
import { useNotesContext } from "@/context/NotesContext";
import { SearchInput } from "@/components/common/SearchInput";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import {
  getTopicById,
  getQuestionById,
  getCodingProblemById,
  getMachineCodingProblemById,
} from "@/data";
import styles from "./Bookmarks.module.css";

interface BookmarkItem {
  id: string;
  title: string;
  type: string;
  link: string;
}

function resolveBookmark(id: string): BookmarkItem | null {
  const topic = getTopicById(id);
  if (topic)
    return { id, title: topic.title, type: "Topic", link: `/topics/${id}` };

  const question = getQuestionById(id);
  if (question)
    return {
      id,
      title: question.question,
      type: "Question",
      link: `/topics/${question.topicId}`,
    };

  const coding = getCodingProblemById(id);
  if (coding)
    return { id, title: coding.title, type: "Coding", link: `/coding/${id}` };

  const mc = getMachineCodingProblemById(id);
  if (mc)
    return {
      id,
      title: mc.title,
      type: "Machine Coding",
      link: `/machine-coding/${id}`,
    };

  return { id, title: id, type: "Unknown", link: "/" };
}

export default function Bookmarks() {
  const { bookmarks, removeBookmark } = useBookmarkContext();
  const { getNote } = useNotesContext();
  const [search, setSearch] = useState("");

  const items = useMemo(() => {
    return bookmarks
      .map((id) => resolveBookmark(id))
      .filter((item): item is BookmarkItem => item !== null);
  }, [bookmarks]);

  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q),
    );
  }, [items, search]);

  return (
    <div className={styles.page}>
      <div className={styles.stickyTopBar}>
        <header className={styles.header}>
          <h1 className={styles.title}>Bookmarks</h1>
          <p className={styles.subtitle}>{bookmarks.length} bookmarked items</p>
        </header>

        {bookmarks.length > 0 && (
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search bookmarks..."
          />
        )}
      </div>

      <div className={styles.scrollableContent}>
        {filtered.length === 0 ? (
          <EmptyState
            icon="🔖"
            title={
              bookmarks.length === 0
                ? "No bookmarks yet"
                : "No matching bookmarks"
            }
            description={
              bookmarks.length === 0
                ? "Bookmark questions, topics, and problems to access them quickly."
                : "Try adjusting your search"
            }
          />
        ) : (
          <div className={styles.list}>
            {filtered.map((item) => {
              const note = getNote(item.id);
              return (
                <Card key={item.id}>
                  <div className={styles.bookmarkItem}>
                    <div className={styles.bookmarkHeader}>
                      <span className={styles.bookmarkType}>{item.type}</span>
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => removeBookmark(item.id)}
                        aria-label="Remove bookmark"
                      >
                        ✕
                      </button>
                    </div>
                    <Link to={item.link} className={styles.bookmarkTitle}>
                      {item.title}
                    </Link>
                    {note && (
                      <div className={styles.notePreview}>
                        <span className={styles.noteLabel}>Note:</span>
                        <p className={styles.noteText}>{note}</p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
