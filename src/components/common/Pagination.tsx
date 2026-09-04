import styles from "./Pagination.module.css";

interface PaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly pageSize: number;
  readonly pageSizeOptions?: readonly number[] | number[];
  readonly onPageChange: (page: number) => void;
  readonly onPageSizeChange?: (size: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
}: Readonly<PaginationProps>) {
  if (totalItems === 0) return null;

  const startIdx = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endIdx = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers window (e.g. 1 2 3 ... 10)
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.rangeInfo}>
        <span>
          Showing{" "}
          <strong>
            {startIdx}–{endIdx}
          </strong>{" "}
          of <strong>{totalItems}</strong> problems
        </span>
      </div>

      <div className={styles.controlsGroup}>
        {onPageSizeChange && (
          <div className={styles.pageSizeWrapper}>
            <span className={styles.pageSizeLabel}>Rows per page:</span>
            <select
              className={styles.pageSizeSelect}
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              aria-label="Rows per page"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.pageButtons}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous page"
          >
            ‹
          </button>

          {getPageNumbers().map((p, idx) =>
            p === "ellipsis" ? (
              <span key={`ellipsis-${idx}`} className={styles.ellipsis}>
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                className={`${styles.pageBtn} ${p === currentPage ? styles.pageBtnActive : ""}`}
                onClick={() => onPageChange(p)}
                aria-label={`Page ${p}`}
                aria-current={p === currentPage ? "page" : undefined}
              >
                {p}
              </button>
            ),
          )}

          <button
            type="button"
            className={styles.navBtn}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
