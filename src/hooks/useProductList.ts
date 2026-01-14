/** @format */

"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";

export type SortOption =
  | "BEST_SELLING"
  | "TITLE"
  | "PRICE"
  | "CREATED_AT"
  | "RELEVANCE";

export interface ProductListFilters {
  // Server filters (require API call)
  categories?: string[];
  brands?: string[];
  priceRange?: { min: number; max: number };
  rating?: number;
  tags?: string[];
  sortBy?: SortOption;

  // Pagination
  page?: number;
  pageSize?: number;
}

export interface ProductListItem {
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
}

export interface ProductListResponse {
  products: ProductListItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
  filters?: {
    availableCategories?: Array<{ id: string; name: string; count: number }>;
    availableBrands?: Array<{ id: string; name: string; count: number }>;
    priceRange?: { min: number; max: number };
  };
}

// Build query key from filters
function buildQueryKey(filters: ProductListFilters): string {
  const key = {
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
  return JSON.stringify(key);
}

// Simple in-memory cache
const cache = new Map<
  string,
  { data: ProductListResponse; timestamp: number }
>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Fetch products list from API
async function fetchProductList(
  filters: ProductListFilters,
  signal?: AbortSignal
): Promise<ProductListResponse> {
  const cacheKey = buildQueryKey(filters);

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const params = new URLSearchParams();

  if (filters.categories?.length) {
    params.set("categories", filters.categories.join(","));
  }
  if (filters.brands?.length) {
    params.set("brands", filters.brands.join(","));
  }
  if (filters.priceRange) {
    params.set("minPrice", filters.priceRange.min.toString());
    params.set("maxPrice", filters.priceRange.max.toString());
  }
  if (filters.rating) {
    params.set("rating", filters.rating.toString());
  }
  if (filters.tags?.length) {
    params.set("tags", filters.tags.join(","));
  }
  params.set("sortBy", filters.sortBy || "BEST_SELLING");
  params.set("page", (filters.page || 1).toString());
  params.set("pageSize", (filters.pageSize || 16).toString());

  const response = await fetch(`/api/products/list?${params}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();

  // Cache the result
  cache.set(cacheKey, { data, timestamp: Date.now() });

  return data;
}

export function useProductList(filters: ProductListFilters) {
  const [data, setData] = useState<ProductListResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const previousDataRef = useRef<ProductListResponse | undefined>(undefined);

  // Build query key
  const queryKey = useMemo(() => buildQueryKey(filters), [filters]);

  // Fetch data
  useEffect(() => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    // Keep previous data while fetching
    if (data) {
      previousDataRef.current = data;
      setIsFetching(true);
    } else {
      setIsLoading(true);
    }

    fetchProductList(filters, signal)
      .then((result) => {
        if (!signal.aborted) {
          setData(result);
          setError(null);
          previousDataRef.current = undefined;
        }
      })
      .catch((err) => {
        if (!signal.aborted && err.name !== "AbortError") {
          setError(err);
        }
      })
      .finally(() => {
        if (!signal.aborted) {
          setIsLoading(false);
          setIsFetching(false);
        }
      });

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [queryKey]); // Only depend on queryKey, not filters object

  // Prefetch next page
  const prefetchNextPage = useCallback(() => {
    if (data?.pagination.currentPage && data?.pagination.totalPages) {
      const nextPage = data.pagination.currentPage + 1;
      if (nextPage <= data.pagination.totalPages) {
        const nextPageFilters = { ...filters, page: nextPage };
        // Prefetch in background
        fetchProductList(nextPageFilters).catch(() => {
          // Silently fail prefetch
        });
      }
    }
  }, [data, filters]);

  return {
    data,
    isLoading,
    isFetching,
    error,
    prefetchNextPage,
    // Keep previous data visible while fetching
    products: data?.products || previousDataRef.current?.products || [],
    pagination: data?.pagination || previousDataRef.current?.pagination,
  };
}
