import type { MachineCodingProblem } from '../../types';

export const searchableGridProblem: MachineCodingProblem = {
  id: 'mc-searchable-grid',
  title: 'Searchable & Sortable Product Grid',
  difficulty: 'Advanced',
  category: 'Machine Coding',
  tags: ['react', 'grid', 'search', 'filter', 'sort', 'e-commerce', 'responsive'],

  problemStatement: `Build a searchable and sortable product grid component inspired by e-commerce platforms like Amazon. The grid should display product cards in a responsive layout, support real-time text search, category filtering, price range filtering, and multiple sort options (price low-to-high, high-to-low, rating, newest). This is a comprehensive machine coding challenge that tests your ability to manage complex derived state and build a polished UI.

The component must handle a moderate dataset efficiently, with debounced search and memoized filter/sort pipelines. The grid layout should be responsive, adapting from multiple columns on desktop to a single column on mobile. Each product card should display an image, title, price, rating, and an "Add to Cart" button. Empty and loading states should be handled gracefully.`,

  functionalRequirements: [
    'Display products in a responsive grid layout',
    'Real-time search filtering by product name and description',
    'Category filter dropdown or chip selector',
    'Price range filter with min/max inputs',
    'Sort by price (asc/desc), rating, or name',
    'Display product count and active filter summary',
    'Clear all filters button',
    'Empty state when no products match filters',
  ],

  nonFunctionalRequirements: [
    'Debounced search input (300ms) to avoid excessive filtering',
    'Memoized filter/sort pipeline for performance',
    'Responsive CSS Grid layout adapting to screen width',
    'Accessible filter controls with proper labels',
  ],

  componentHierarchy: `SearchableGrid
├── SearchBar
├── FilterPanel
│   ├── CategoryFilter
│   ├── PriceRangeFilter
│   └── ClearFiltersButton
├── SortSelector
├── ResultsInfo (count + active filters)
└── ProductGrid
    └── ProductCard (repeated)
        ├── ProductImage
        ├── ProductInfo (title, price, rating)
        └── AddToCartButton`,

  stateDesign: `// State shape
interface GridState {
  searchQuery: string;
  selectedCategory: string;    // '' = all categories
  priceRange: { min: number; max: number };
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'name';
}

// Products are passed as props (source of truth).
// Derived state: products -> filtered by search -> filtered by category
// -> filtered by price range -> sorted by sortBy.
// Each step is memoized with useMemo, keyed on its dependencies.`,

  architecture: `The grid follows a filter pipeline architecture where the product list passes through a series of transformations: search filter → category filter → price filter → sort. Each stage is independently memoized so that changing the sort order, for example, doesn't re-run the search and category filters.

The search uses case-insensitive substring matching across product name and description fields. Category filtering uses exact match against the selected category. Price range filtering clamps products within the min/max bounds. The sort comparator handles each sort type with appropriate comparison logic. The responsive grid uses CSS Grid with \`auto-fill\` and \`minmax()\` for fluid column sizing without media queries.`,

  implementation: `import React, { useState, useMemo, useCallback } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  image: string;
}

type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'name';

interface SearchableGridProps {
  products: Product[];
}

function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span aria-label={\`\${rating.toFixed(1)} out of 5 stars\`} style={{ color: '#f59e0b' }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span style={{ color: '#6b7280', fontSize: 12, marginLeft: 4 }}>{rating.toFixed(1)}</span>
    </span>
  );
}

export default function SearchableGrid({ products }: SearchableGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [sortBy, setSortBy] = useState<SortOption>('name');

  const debouncedSearch = useDebounce(searchQuery, 300);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    let result = products;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }
    result = result.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);
    return result;
  }, [products, debouncedSearch, selectedCategory, priceRange]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
      case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
      case 'rating': sorted.sort((a, b) => b.rating - a.rating); break;
      case 'name': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return sorted;
  }, [filteredProducts, sortBy]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange({ min: 0, max: Infinity });
    setSortBy('name');
  }, []);

  const hasActiveFilters = searchQuery || selectedCategory || priceRange.min > 0 || priceRange.max < Infinity;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <input
          type="search"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search products"
          style={{
            flex: '1 1 250px', padding: '10px 14px', border: '1px solid #d1d5db',
            borderRadius: 6, fontSize: 14, outline: 'none',
          }}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Filter by category"
          style={{
            padding: '10px 14px', border: '1px solid #d1d5db',
            borderRadius: 6, fontSize: 14, background: '#fff',
          }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat === 'All' ? '' : cat}>{cat}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          aria-label="Sort products"
          style={{
            padding: '10px 14px', border: '1px solid #d1d5db',
            borderRadius: 6, fontSize: 14, background: '#fff',
          }}
        >
          <option value="name">Name (A–Z)</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <label style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
          Min $
          <input
            type="number" min="0" value={priceRange.min || ''}
            onChange={(e) => setPriceRange((r) => ({ ...r, min: Number(e.target.value) || 0 }))}
            style={{ width: 80, padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 4 }}
          />
        </label>
        <label style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
          Max $
          <input
            type="number" min="0" value={priceRange.max === Infinity ? '' : priceRange.max}
            onChange={(e) => setPriceRange((r) => ({ ...r, max: Number(e.target.value) || Infinity }))}
            style={{ width: 80, padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 4 }}
          />
        </label>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            style={{
              padding: '6px 14px', fontSize: 13, background: '#fee2e2', color: '#dc2626',
              border: 'none', borderRadius: 4, cursor: 'pointer',
            }}
          >
            Clear Filters
          </button>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 14, color: '#6b7280' }}>
          {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {sortedProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#6b7280' }}>
          <p style={{ fontSize: 18 }}>No products match your filters</p>
          <button onClick={clearFilters} style={{
            marginTop: 12, padding: '8px 20px', border: '1px solid #d1d5db',
            borderRadius: 6, background: '#fff', cursor: 'pointer',
          }}>
            Clear all filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 20,
        }}>
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              style={{
                border: '1px solid #e5e7eb', borderRadius: 8,
                overflow: 'hidden', background: '#fff',
                transition: 'box-shadow 0.2s',
              }}
            >
              <div style={{ height: 180, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={product.image} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ padding: 16 }}>
                <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600 }}>{product.name}</h3>
                <p style={{ margin: '0 0 8px', fontSize: 13, color: '#6b7280', lineHeight: 1.4 }}>
                  {product.description.length > 80
                    ? product.description.slice(0, 80) + '...'
                    : product.description}
                </p>
                <StarDisplay rating={product.rating} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>
                    \${product.price.toFixed(2)}
                  </span>
                  <button style={{
                    padding: '8px 16px', fontSize: 13, fontWeight: 600,
                    background: '#2563eb', color: '#fff', border: 'none',
                    borderRadius: 6, cursor: 'pointer',
                  }}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`,

  accessibility: `All filter controls have proper \`aria-label\` attributes. The search input uses \`type="search"\` for semantic meaning. Product images have descriptive \`alt\` text. Star ratings include an \`aria-label\` with the numerical rating. The product grid uses CSS Grid which maintains DOM order for screen readers. Empty state messages provide clear guidance. Price inputs are labeled with associated text. Filter status is communicated via the product count text.`,

  performance: `The filter pipeline uses staged \`useMemo\` calls so that each transformation only re-runs when its specific dependencies change. Search is debounced at 300ms to prevent filtering on every keystroke. Category list extraction is memoized against the products array. The CSS Grid layout uses \`auto-fill\` with \`minmax()\` for responsive columns without JavaScript resize listeners. Product descriptions are truncated in the render to avoid layout shifts. For very large catalogs (1000+ products), virtualization with react-window or intersection observer-based rendering should be added.`,

  edgeCases: [
    'Empty product array should show a friendly empty state',
    'Search with special characters (regex metacharacters) should not crash',
    'Price range where min > max should show no results',
    'Products with identical names should sort stably',
    'Extremely long product names or descriptions should truncate gracefully',
  ],

  testingStrategy: [
    'Unit test: search filters products by name and description case-insensitively',
    'Unit test: category filter shows only matching products',
    'Unit test: price range filter includes boundary values',
    'Unit test: all sort options produce correct ordering',
    'Integration test: combining multiple filters produces correct results',
    'Integration test: clear filters resets all filter state',
  ],

  improvements: [
    'Add product detail modal on card click',
    'Implement URL-based filter state for shareable filtered views',
    'Add pagination or infinite scroll for large product catalogs',
    'Support multi-select category filtering with chips',
    'Add grid/list view toggle',
  ],

  followUpQuestions: [
    'How would you persist filter state in the URL for shareable links?',
    'How would you implement faceted search with filter counts?',
    'What strategies would you use for handling 10,000+ products?',
    'How would you add server-side filtering and sorting?',
  ],
};
