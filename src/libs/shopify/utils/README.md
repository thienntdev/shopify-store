<!-- @format -->

# Shopify API Optimization Utilities

## Overview

This directory contains utilities for optimizing Shopify API calls, especially for large collections (>250 items).

## Key Features

### 1. Cursor-Based Pagination

- **File**: `pagination.ts`
- **Function**: `fetchAllCollectionProducts`
- Handles collections with >250 items by using cursor-based pagination
- Fetches products in batches of up to 250 (Shopify's maximum per request)
- Continues fetching until all products are retrieved or maxItems limit is reached

### 2. Client-Side Tag Filtering

- **Note**: Shopify GraphQL API doesn't support `query` argument for collection products
- Tags are filtered client-side after fetching products
- Efficient batch fetching ensures we get enough results after filtering

### 3. Optimized Collection Products Fetching

- **File**: `src/components/collections/actions.ts`
- Uses `React.cache()` for per-request deduplication
- Implements smart fetching strategies:
  - **No filters or tag-only filters**: Direct cursor pagination with server-side filtering
  - **Price filters**: Batch fetching with client-side price filtering (Shopify limitation)
  - **Combined filters**: Optimized combination of both strategies

## Usage

### Fetching All Products from Large Collection

```typescript
import { fetchAllCollectionProducts } from "@/libs/shopify/utils/pagination";

const { products, totalFetched } = await fetchAllCollectionProducts({
  collection: "all",
  sortKey: "BEST_SELLING",
  maxItems: 1000, // Optional safety limit
});
```

### Filtering Products

Tag and price filtering is done client-side after fetching products from Shopify. The system automatically fetches larger batches when filters are applied to ensure enough results after filtering.

## Performance Considerations

1. **Large Collections (>250 items)**:

   - Uses cursor-based pagination automatically
   - Fetches only what's needed for the current page
   - Caches results per request using React.cache()

2. **Tag Filtering**:

   - Client-side filtering (Shopify API limitation - no query support for collection products)
   - Fetches larger batches to account for filtering
   - Efficient batch fetching ensures good performance

3. **Price Filtering**:

   - Client-side filtering (Shopify API limitation)
   - Fetches in batches until enough filtered results are found
   - Safety limit prevents infinite loops

4. **Caching**:
   - React.cache() ensures same request doesn't fetch twice
   - Next.js cache tags for revalidation
   - Per-request deduplication

## Limitations

1. **Tag & Price Filtering**: Shopify GraphQL API doesn't support `query` argument for collection products, so filtering must be done client-side
2. **Total Count**: For very large collections with filters, exact total count may require fetching all products
3. **Page Number**: Cursor-based pagination doesn't support direct page jumps, so we estimate based on fetched data
4. **Batch Fetching**: When filters are applied, the system fetches larger batches (3-5x page size) to ensure enough results after filtering
