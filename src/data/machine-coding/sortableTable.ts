import type { MachineCodingProblem } from '../../types';

export const sortableTableProblem: MachineCodingProblem = {
  id: 'mc-sortable-table',
  title: 'Sortable & Filterable Table',
  difficulty: 'Intermediate',
  category: 'Machine Coding',
  tags: ['react', 'table', 'sorting', 'filtering', 'search', 'data-grid'],

  problemStatement: `Build a data table component in React that supports column sorting, row filtering, and text search. The table should handle clicking on column headers to sort data in ascending/descending order, with a visual indicator showing the current sort direction. A search input should filter rows across all columns in real time.

This is a practical machine coding question that tests your ability to manage derived state, implement efficient sorting and filtering algorithms, and build a responsive data display component. The table should handle moderate datasets (hundreds of rows) without performance issues and provide a clean, usable interface.`,

  functionalRequirements: [
    'Render tabular data with dynamic columns and rows',
    'Click column headers to sort ascending/descending/none',
    'Display sort direction indicator (arrow) on the active column',
    'Global text search that filters across all columns',
    'Support per-column filter dropdowns',
    'Pagination with configurable page size',
    'Highlight matched search text in cells',
  ],

  nonFunctionalRequirements: [
    'Efficient sorting using Array.sort with locale-aware comparison',
    'Debounced search input to avoid excessive re-renders',
    'Accessible table markup with proper <thead>, <tbody>, scope attributes',
    'Responsive design that handles overflow gracefully',
  ],

  componentHierarchy: `SortableTable
├── SearchInput
├── Table
│   ├── TableHead
│   │   └── HeaderCell (repeated, clickable for sort)
│   └── TableBody
│       └── TableRow (repeated)
│           └── TableCell (repeated)
└── Pagination
    ├── PageInfo
    └── PageButtons`,

  stateDesign: `// State shape
interface TableState {
  data: Row[];                    // original data, never mutated
  searchQuery: string;            // global search term
  sortConfig: {
    key: string | null;           // column key being sorted
    direction: 'asc' | 'desc' | null;
  };
  currentPage: number;
  pageSize: number;
}

// Derived: filtered data = data filtered by searchQuery,
// then sorted by sortConfig, then sliced for pagination.
// Using useMemo to avoid recalculating on unrelated state changes.`,

  architecture: `The table separates raw data from display data using a pipeline of transformations: filter -> sort -> paginate. Each transformation is memoized with \`useMemo\` to prevent unnecessary recalculations. The raw data array is never mutated; instead, a new sorted/filtered array is derived on each render.

Sorting cycles through three states (ascending -> descending -> none) when clicking a column header. The sort comparator handles strings, numbers, and dates using type detection. Search filtering converts both the query and cell values to lowercase for case-insensitive matching across all columns. Pagination is calculated from the filtered/sorted data length. When search or sort changes, the current page resets to 1 to avoid showing an empty page.`,

  implementation: `import React, { useState, useMemo, useCallback } from 'react';

interface Column<T> {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
}

interface SortConfig {
  key: string | null;
  direction: 'asc' | 'desc' | null;
}

interface SortableTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
}

function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function SortableTable<T extends Record<string, unknown>>({
  columns,
  data,
  pageSize: initialPageSize = 10,
}: SortableTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(initialPageSize);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredData = useMemo(() => {
    if (!debouncedSearch.trim()) return data;
    const query = debouncedSearch.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => String(row[col.key]).toLowerCase().includes(query))
    );
  }, [data, debouncedSearch, columns]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredData;
    const key = sortConfig.key;
    const dir = sortConfig.direction === 'asc' ? 1 : -1;
    return [...filteredData].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') return (aVal - bVal) * dir;
      return String(aVal).localeCompare(String(bVal)) * dir;
    });
  }, [filteredData, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(
    () => sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [sortedData, currentPage, pageSize]
  );

  const handleSort = useCallback((key: string) => {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return { key: null, direction: null };
    });
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const getSortIndicator = (key: string) => {
    if (sortConfig.key !== key) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div>
      <input
        type="search"
        placeholder="Search all columns..."
        value={searchQuery}
        onChange={handleSearch}
        aria-label="Search table"
        style={{
          width: '100%', padding: '10px 14px', marginBottom: 16,
          border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14,
          outline: 'none', boxSizing: 'border-box',
        }}
      />

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  aria-sort={
                    sortConfig.key === col.key
                      ? sortConfig.direction === 'asc' ? 'ascending' : 'descending'
                      : 'none'
                  }
                  style={{
                    padding: '12px 16px', textAlign: 'left',
                    borderBottom: '2px solid #e5e7eb', cursor: col.sortable !== false ? 'pointer' : 'default',
                    userSelect: 'none', whiteSpace: 'nowrap',
                    background: '#f9fafb', fontWeight: 600,
                  }}
                >
                  {col.label}
                  {col.sortable !== false && (
                    <span style={{ color: sortConfig.key === col.key ? '#2563eb' : '#9ca3af' }}>
                      {getSortIndicator(col.key)}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
                  No results found
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <tr key={rowIdx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  {columns.map((col) => (
                    <td key={col.key} style={{ padding: '10px 16px' }}>
                      {String(row[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 0', fontSize: 14, color: '#6b7280',
      }}>
        <span>
          Showing {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)}–
          {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 4,
              background: '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 4,
              background: '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}`,

  accessibility: `The table uses semantic HTML with \`<table>\`, \`<thead>\`, \`<tbody>\`, \`<th>\`, and \`<td>\` elements. Column headers have \`scope="col"\` for screen readers. The \`aria-sort\` attribute on sortable headers announces the current sort direction. The search input has an \`aria-label\`. Empty states are communicated via a table cell spanning all columns. Pagination buttons are properly disabled when at boundaries, and the count text provides context about visible rows.`,

  performance: `The data transformation pipeline (filter → sort → paginate) uses \`useMemo\` at each stage, so sorting doesn't re-filter and pagination doesn't re-sort. Search input is debounced at 300ms to avoid re-filtering on every keystroke. The sort comparison function handles type coercion once per comparison rather than converting all values upfront. For very large datasets (10,000+ rows), virtualization (e.g., react-window) should be added to render only visible rows. The generic type parameter ensures type safety without runtime overhead.`,

  edgeCases: [
    'Empty data array should show empty state message',
    'Search that matches zero rows should show empty state and reset pagination',
    'Sorting columns with mixed types (numbers stored as strings)',
    'Null or undefined cell values should sort to the end',
    'Changing page size should reset to page 1',
  ],

  testingStrategy: [
    'Unit test: clicking a column header sorts data ascending, then descending, then clears',
    'Unit test: search input filters rows case-insensitively across all columns',
    'Unit test: pagination correctly slices data and disables buttons at boundaries',
    'Integration test: sorting and searching together produce correct results',
    'Accessibility audit: verify aria-sort, scope, and label attributes',
  ],

  improvements: [
    'Add column resizing via drag handles',
    'Support multi-column sorting with priority',
    'Add row selection with checkboxes',
    'Implement virtual scrolling for large datasets',
    'Add CSV/JSON export functionality',
  ],

  followUpQuestions: [
    'How would you implement server-side sorting and pagination?',
    'What is the time complexity of the sort-then-paginate approach?',
    'How would you add column reordering via drag and drop?',
    'How does virtual scrolling work and when would you use it here?',
  ],
};
