/** @format */

/**
 * Centralized query key factory for consistent cache management
 */

export const queryKeys = {
  // Product list queries
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
  },

  // Collection queries
  collections: {
    all: ["collections"] as const,
    list: () => [...queryKeys.collections.all, "list"] as const,
    detail: (handle: string) =>
      [...queryKeys.collections.all, "detail", handle] as const,
    products: (handle: string, filters?: Record<string, unknown>) =>
      [
        ...queryKeys.collections.detail(handle),
        "products",
        filters || {},
      ] as const,
  },

  // Filter metadata
  filters: {
    all: ["filters"] as const,
    categories: () => [...queryKeys.filters.all, "categories"] as const,
    brands: () => [...queryKeys.filters.all, "brands"] as const,
    priceRange: () => [...queryKeys.filters.all, "priceRange"] as const,
  },
} as const;

/**
 * Helper to build query key for product list with filters
 */
export function buildProductListKey(filters: {
  categories?: string[];
  brands?: string[];
  priceRange?: { min: number; max: number };
  rating?: number;
  tags?: string[];
  sortBy?: string;
  page?: number;
  pageSize?: number;
}): readonly unknown[] {
  const normalizedFilters = {
    categories: filters.categories?.sort().join(",") || "",
    brands: filters.brands?.sort().join(",") || "",
    priceMin: filters.priceRange?.min ?? 0,
    priceMax: filters.priceRange?.max ?? 1000,
    rating: filters.rating ?? 0,
    tags: filters.tags?.sort().join(",") || "",
    sortBy: filters.sortBy || "BEST_SELLING",
    page: filters.page || 1,
    pageSize: filters.pageSize || 16,
  };

  return queryKeys.products.list(normalizedFilters);
}
