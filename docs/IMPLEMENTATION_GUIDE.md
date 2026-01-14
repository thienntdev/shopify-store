# Implementation Guide: Optimized Product Listing

## Overview

This guide explains how to implement the optimized product listing strategy in your Shopify Next.js application.

## Prerequisites

### 1. Install Dependencies (Optional but Recommended)

For optimal performance, install React Query (TanStack Query):

```bash
npm install @tanstack/react-query
```

Then wrap your app with QueryClientProvider in `src/app/layout.tsx`:

```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
      },
    },
  }));

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

**Note**: The current implementation works without React Query using a simple in-memory cache. However, React Query provides better features like:
- Automatic cache invalidation
- Background refetching
- Better error handling
- DevTools support

## Architecture Overview

### File Structure

```
src/
├── hooks/
│   ├── useProductList.ts          # Main data fetching hook
│   └── usePriceFilter.ts          # Price filter with debounce
├── components/
│   └── collections/
│       └── CollectionsClientOptimized.tsx  # Optimized component
├── app/
│   └── api/
│       └── products/
│           └── list/
│               └── route.ts       # API endpoint
└── lib/
    └── cache/
        └── queryKeys.ts           # Query key utilities
```

## Step-by-Step Implementation

### Step 1: Update Your Collection Page

Replace your current `CollectionsClient` with `CollectionsClientOptimized`:

```tsx
// src/app/collections/[handle]/page.tsx
import CollectionsClientOptimized from "@/components/collections/CollectionsClientOptimized";

export default async function CollectionPage({ params }: { params: { handle: string } }) {
  // Fetch initial data for filter options
  const { products } = await getCollectionProductsWithPagination({
    collection: params.handle,
    first: 100, // Fetch enough to extract filter options
  });

  // Extract filter options
  const occasions = extractOccasions(products);
  const recipients = extractRecipients(products);
  const priceRange = calculatePriceRange(products);

  return (
    <CollectionsClientOptimized
      collectionHandle={params.handle}
      occasions={occasions}
      recipients={recipients}
      priceRange={priceRange}
    />
  );
}
```

### Step 2: Configure API Endpoint

The API endpoint (`src/app/api/products/list/route.ts`) is already set up with:
- Server-side filtering
- Pagination
- Cache headers
- Filter metadata

Make sure your Shopify integration supports the required fields.

### Step 3: Use the Optimized Component

The `CollectionsClientOptimized` component includes:
- ✅ Debounced price filtering
- ✅ Server-side pagination
- ✅ Loading states (skeleton + subtle indicators)
- ✅ Prefetching next page
- ✅ URL state synchronization
- ✅ Mobile filter modal

### Step 4: Customize Filter Options

Update the filter extraction logic based on your product structure:

```tsx
function extractOccasions(products: Product[]): FilterOption[] {
  const occasionTags = new Set<string>();
  
  products.forEach(product => {
    product.tags?.forEach(tag => {
      if (tag.toLowerCase().includes('occasion')) {
        occasionTags.add(tag);
      }
    });
  });

  return Array.from(occasionTags).map(tag => ({
    label: tag,
    value: tag,
    count: products.filter(p => p.tags?.includes(tag)).length,
  }));
}
```

## Key Features

### 1. Debounced Price Filter

The price filter automatically applies after 500ms of inactivity:

```tsx
const {
  localRange,
  appliedRange,
  isPending,
  handleRangeChange,
} = usePriceFilter({
  initialRange: priceRange,
  onApply: (range) => updateURL({ priceRange: range }),
  debounceMs: 500,
});
```

### 2. Smart Caching

- In-memory cache with 5-minute TTL
- Cache key based on all filter parameters
- Automatic cache invalidation on filter change

### 3. Optimistic UI Updates

- Local filters (sort, view) update instantly
- Server filters show loading state
- Previous data remains visible during fetch

### 4. Prefetching

Next page is prefetched when user navigates:

```tsx
const handlePageChange = (page: number) => {
  updateURL({ page });
  setTimeout(() => prefetchNextPage(), 100);
};
```

## Performance Optimization Tips

### 1. Database Indexes

Ensure your database has indexes on:
- Price
- Category/Brand
- Tags
- Common filter combinations

### 2. Image Optimization

Use Next.js Image component with proper sizing:

```tsx
<Image
  src={product.image}
  alt={product.title}
  width={300}
  height={300}
  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
  loading="lazy"
/>
```

### 3. Backend Caching

Implement Redis caching in your API route:

```tsx
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

// In route handler
const cacheKey = `products:list:${hashFilters(filters)}`;
const cached = await redis.get(cacheKey);
if (cached) return NextResponse.json(cached);

// ... fetch and cache
await redis.setex(cacheKey, 300, JSON.stringify(result));
```

## Monitoring & Metrics

Track these metrics:

1. **API Response Time**: Target < 200ms average
2. **Cache Hit Rate**: Target > 80%
3. **Time to Interactive**: Target < 2s
4. **Filter Response Time**: < 100ms (local) / < 500ms (server)

## Troubleshooting

### Issue: Products not updating after filter change

**Solution**: Check that `queryKey` in `useProductList` changes when filters change. The hook depends on `queryKey`, not the `filters` object directly.

### Issue: Price filter triggers too many API calls

**Solution**: Ensure debounce is working. Check `usePriceFilter` hook and verify `debounceMs` is set appropriately.

### Issue: Slow pagination

**Solution**: 
1. Check database indexes
2. Implement backend caching (Redis)
3. Reduce `pageSize` if fetching too much data

## Migration from Current Implementation

If you're migrating from `CollectionsClient`:

1. **Keep both components** initially
2. **Test** `CollectionsClientOptimized` on a staging environment
3. **Compare** performance metrics
4. **Gradually migrate** collections one by one
5. **Remove** old component once stable

## Next Steps

1. ✅ Implement API endpoint
2. ✅ Set up hooks
3. ✅ Create optimized component
4. ⏳ Add React Query (optional)
5. ⏳ Implement Redis caching
6. ⏳ Add monitoring
7. ⏳ Performance testing

## Support

For questions or issues, refer to:
- [Strategy Document](./PRODUCT_LISTING_OPTIMIZATION_STRATEGY.md)
- [React Query Docs](https://tanstack.com/query/latest)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
