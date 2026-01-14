<!-- @format -->

# Product Listing Optimization Strategy

## Architecture for Desktop SaaS Application with ~1000 Products

---

## 1. Data Strategy

### 1.1 Data Model Separation

**Lightweight List Data** (for listing):

```typescript
interface ProductListItem {
  id: string;
  handle: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
  tags: string[];
  category: string;
  brand?: string;
  // Minimal fields for filtering/sorting
}

// Estimated size: ~200-300 bytes per product
// 1000 products ≈ 200-300 KB (highly cacheable)
```

**Heavy Detail Data** (fetch on-demand):

```typescript
interface ProductDetail {
  ...ProductListItem;
  description: string;
  images: string[];
  variants: Variant[];
  specifications: Record<string, string>;
  relatedProducts: string[];
  // Full product data
}

// Fetch only when product page is opened
```

### 1.2 Data Fetching Strategy

- **Initial Load**: Fetch lightweight list data only
- **Product Detail**: Lazy load when user clicks into product
- **Prefetch**: Prefetch next page data in background

---

## 2. Filtering Strategy

### 2.1 Filter Classification

**Local Filters (Client-Side)**:

- Sorting (price, name, rating, date)
- Text search (client-side filtering on already loaded data)
- Stock status toggle
- View mode (grid/list)

**Server Filters (Require API Call)**:

- Category/Brand selection
- Price range (with debounce)
- Rating filter
- Tag-based filters

### 2.2 Filter State Management

```typescript
interface FilterState {
  // Local filters (no API call)
  sortBy: SortOption;
  searchQuery: string;
  inStockOnly: boolean;
  viewMode: "grid" | "list";

  // Server filters (trigger API call)
  categories: string[];
  brands: string[];
  priceRange: { min: number; max: number };
  rating: number;
  tags: string[];

  // Pagination
  page: number;
  pageSize: number;
}

// Query key generation
function buildQueryKey(filters: FilterState): string {
  const serverFilters = {
    categories: filters.categories.sort().join(","),
    brands: filters.brands.sort().join(","),
    priceMin: filters.priceRange.min,
    priceMax: filters.priceRange.max,
    rating: filters.rating,
    tags: filters.tags.sort().join(","),
    page: filters.page,
    pageSize: filters.pageSize,
    sortBy: filters.sortBy,
  };
  return JSON.stringify(serverFilters);
}
```

---

## 3. Price Filter Optimization

### 3.1 Debounce Strategy

```typescript
// Custom hook for price filter with debounce
function usePriceFilter(
  initialRange: { min: number; max: number },
  onApply: (range: { min: number; max: number }) => void,
  debounceMs: number = 500
) {
  const [localRange, setLocalRange] = useState(initialRange);
  const [appliedRange, setAppliedRange] = useState(initialRange);
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  const handleRangeChange = useCallback(
    (newRange: { min: number; max: number }) => {
      setLocalRange(newRange);

      // Cancel previous debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Cancel in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      // Debounce API call
      debounceTimerRef.current = setTimeout(() => {
        // Check if range actually changed
        if (
          newRange.min !== appliedRange.min ||
          newRange.max !== appliedRange.max
        ) {
          setAppliedRange(newRange);
          onApply(newRange);
        }
      }, debounceMs);
    },
    [appliedRange, debounceMs, onApply]
  );

  const handleManualApply = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (
      localRange.min !== appliedRange.min ||
      localRange.max !== appliedRange.max
    ) {
      setAppliedRange(localRange);
      onApply(localRange);
    }
  }, [localRange, appliedRange, onApply]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    localRange,
    appliedRange,
    handleRangeChange,
    handleManualApply,
  };
}
```

### 3.2 Price Filter UI Pattern

**Option A: Auto-apply with debounce** (Recommended)

- User drags slider → UI updates instantly
- API call triggered after 500ms of no movement
- Show loading indicator only during API call

**Option B: Explicit Apply button**

- User adjusts range → UI updates, no API call
- User clicks "Apply" → API call triggered
- Better for preventing unnecessary calls

---

## 4. API & Query Strategy

### 4.1 API Endpoint Design

```
GET /api/products/list
Query Parameters:
  - categories: string[] (comma-separated)
  - brands: string[]
  - minPrice: number
  - maxPrice: number
  - rating: number
  - tags: string[]
  - sortBy: string
  - page: number
  - pageSize: number

Response:
{
  products: ProductListItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
  filters: {
    availableCategories: { id: string; name: string; count: number }[];
    availableBrands: { id: string; name: string; count: number }[];
    priceRange: { min: number; max: number };
  };
}
```

### 4.2 Query Key Strategy

```typescript
// React Query / TanStack Query implementation
import { useQuery } from "@tanstack/react-query";

function useProductList(filters: FilterState) {
  const queryKey = ["products", "list", buildQueryKey(filters)];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      // Only include server filters
      if (filters.categories.length)
        params.set("categories", filters.categories.join(","));
      if (filters.brands.length) params.set("brands", filters.brands.join(","));
      params.set("minPrice", filters.priceRange.min.toString());
      params.set("maxPrice", filters.priceRange.max.toString());
      if (filters.rating) params.set("rating", filters.rating.toString());
      if (filters.tags.length) params.set("tags", filters.tags.join(","));
      params.set("sortBy", filters.sortBy);
      params.set("page", filters.page.toString());
      params.set("pageSize", filters.pageSize.toString());

      const response = await fetch(`/api/products/list?${params}`);
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    // Keep previous data while fetching new page
    keepPreviousData: true,
  });
}
```

### 4.3 Cache Strategy

**Frontend Cache (React Query)**:

- Cache per query key
- Stale time: 5 minutes
- Garbage collection: 30 minutes
- Keep previous data during refetch

**Backend Cache (Redis)**:

```typescript
// Backend caching strategy
async function getProductsList(filters: ServerFilters) {
  const cacheKey = `products:list:${hashFilters(filters)}`;

  // Check cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Fetch from database
  const products = await db.products.findMany({
    where: buildWhereClause(filters),
    orderBy: buildOrderBy(filters.sortBy),
    skip: (filters.page - 1) * filters.pageSize,
    take: filters.pageSize,
  });

  const result = {
    products,
    pagination: {
      /* ... */
    },
    filters: {
      /* ... */
    },
  };

  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(result));

  return result;
}
```

---

## 5. Pagination Optimization

### 5.1 Server-Side Pagination

```typescript
// Backend pagination
async function paginateProducts(
  filters: ServerFilters,
  page: number,
  pageSize: number
) {
  const skip = (page - 1) * pageSize;

  // Parallel queries for better performance
  const [products, totalCount] = await Promise.all([
    db.products.findMany({
      where: buildWhereClause(filters),
      orderBy: buildOrderBy(filters.sortBy),
      skip,
      take: pageSize,
      select: {
        // Only select fields needed for list view
        id: true,
        handle: true,
        title: true,
        price: true,
        // ... minimal fields
      },
    }),
    db.products.count({
      where: buildWhereClause(filters),
    }),
  ]);

  return {
    products,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / pageSize),
      totalCount,
      pageSize,
    },
  };
}
```

### 5.2 Prefetching Strategy

```typescript
// Prefetch next page
const queryClient = useQueryClient();

function handlePageChange(newPage: number) {
  // Update current page
  setFilters((prev) => ({ ...prev, page: newPage }));

  // Prefetch next page
  const nextPageFilters = { ...filters, page: newPage + 1 };
  queryClient.prefetchQuery({
    queryKey: ["products", "list", buildQueryKey(nextPageFilters)],
    queryFn: () => fetchProductsList(nextPageFilters),
  });
}
```

### 5.3 Pagination Component

```typescript
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {/* Page numbers */}
      {getPageNumbers(currentPage, totalPages).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={page === currentPage ? "active" : ""}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}
```

---

## 6. Performance & UX

### 6.1 Loading States

```typescript
function ProductList() {
  const { data, isLoading, isFetching } = useProductList(filters);

  return (
    <div>
      {/* Show skeleton only on initial load */}
      {isLoading ? (
        <ProductListSkeleton count={16} />
      ) : (
        <>
          {/* Show subtle loading indicator during refetch */}
          {isFetching && <div className="loading-indicator">Updating...</div>}

          <ProductGrid products={data.products} />
          <Pagination {...data.pagination} />
        </>
      )}
    </div>
  );
}
```

### 6.2 Optimistic UI Updates

```typescript
// For local filters (sort, search)
function handleSortChange(newSort: SortOption) {
  // Update UI immediately
  setFilters((prev) => ({ ...prev, sortBy: newSort, page: 1 }));

  // API call happens in background
  // Previous data remains visible until new data arrives
}
```

### 6.3 Skeleton Loading

```typescript
function ProductListSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-image" />
          <div className="skeleton-title" />
          <div className="skeleton-price" />
        </div>
      ))}
    </div>
  );
}
```

---

## 7. Scalability Considerations

### 7.1 Database Optimization

**Indexes Required**:

```sql
-- Price filtering
CREATE INDEX idx_products_price ON products(price);

-- Category/Brand filtering
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);

-- Tag filtering (if using JSONB or array)
CREATE INDEX idx_products_tags ON products USING GIN(tags);

-- Composite index for common filter combinations
CREATE INDEX idx_products_category_price ON products(category_id, price);
```

### 7.2 CDN Caching

- Cache static product images via CDN
- Cache API responses for popular filter combinations
- Use cache headers: `Cache-Control: public, max-age=300`

### 7.3 Future Expansion

**Adding New Filters**:

1. Add to `FilterState` interface
2. Update `buildQueryKey` function
3. Update API endpoint to accept new parameter
4. Add database index if needed
5. Update cache invalidation strategy

**Scaling Beyond 1000 Products**:

- Consider cursor-based pagination for very large datasets
- Implement virtual scrolling for client-side rendering
- Use database read replicas for heavy read loads
- Consider Elasticsearch for complex search/filtering

---

## 8. Implementation Checklist

### Phase 1: Core Infrastructure

- [ ] Set up React Query / TanStack Query
- [ ] Create API endpoint `/api/products/list`
- [ ] Implement query key generation
- [ ] Set up Redis caching layer

### Phase 2: Filtering

- [ ] Implement local filters (sort, search)
- [ ] Implement server filters (category, brand, price)
- [ ] Create price filter debounce hook
- [ ] Add filter state management

### Phase 3: Pagination

- [ ] Implement server-side pagination
- [ ] Create pagination component
- [ ] Add prefetching for next page
- [ ] Handle page state in URL

### Phase 4: Performance

- [ ] Add skeleton loading states
- [ ] Implement optimistic UI updates
- [ ] Add loading indicators
- [ ] Optimize image loading

### Phase 5: Testing & Optimization

- [ ] Load testing with 1000+ products
- [ ] Cache hit rate monitoring
- [ ] API response time optimization
- [ ] Database query optimization

---

## 9. Code Structure

```
src/
├── api/
│   └── products/
│       └── list/
│           └── route.ts          # API endpoint
├── hooks/
│   ├── useProductList.ts         # Main data fetching hook
│   ├── usePriceFilter.ts         # Price filter with debounce
│   └── useProductFilters.ts     # Filter state management
├── components/
│   ├── ProductList/
│   │   ├── ProductList.tsx
│   │   ├── ProductListSkeleton.tsx
│   │   └── ProductGrid.tsx
│   ├── Filters/
│   │   ├── FilterSidebar.tsx
│   │   ├── PriceFilter.tsx
│   │   └── CategoryFilter.tsx
│   └── Pagination/
│       └── Pagination.tsx
└── lib/
    ├── cache/
    │   └── queryKeys.ts          # Query key builders
    └── api/
        └── products.ts            # API client functions
```

---

## 10. Key Metrics to Monitor

1. **API Performance**:

   - Average response time < 200ms
   - Cache hit rate > 80%
   - 95th percentile < 500ms

2. **User Experience**:

   - Time to interactive < 2s
   - Filter response time < 100ms (local) / < 500ms (server)
   - Smooth 60fps scrolling

3. **Scalability**:
   - Support 10,000+ products
   - Handle 100+ concurrent users
   - Database query time < 50ms

---

## Summary

This strategy provides:

- ✅ Minimal API calls through intelligent caching
- ✅ Smooth UX with debounced price filtering
- ✅ Scalable architecture for growth
- ✅ Optimized performance with prefetching
- ✅ Clear separation of concerns

The key is balancing client-side optimization (local filters, caching) with server-side efficiency (indexed queries, Redis caching) to create a fast, responsive product listing experience.
