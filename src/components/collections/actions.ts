/** @format */

"use server";

import { cache } from "react";
import { getCollectionProductsWithPagination } from "@/libs/shopify";
import { Product, PageInfo, ProductFilter, Filter } from "@/libs/shopify/types";

export type SortOption =
  | "FEATURED"
  | "BEST_SELLING"
  | "TITLE_ASC"
  | "TITLE_DESC"
  | "PRICE_ASC"
  | "PRICE_DESC"
  | "CREATED_AT_ASC"
  | "CREATED_AT_DESC";

export interface CollectionFilters {
  occasions?: string[];
  recipients?: string[];
  minPrice?: number;
  maxPrice?: number;
}

export interface CollectionProductsResult {
  products: Product[];
  pageInfo: PageInfo;
  filters?: Filter[];
  totalCount: number;
}

// Helper function to convert SortOption to Shopify sortKey and reverse
function getSortParams(sortBy: SortOption): {
  sortKey: string;
  reverse: boolean;
} {
  switch (sortBy) {
    case "FEATURED":
      return { sortKey: "MANUAL", reverse: false };
    case "BEST_SELLING":
      return { sortKey: "BEST_SELLING", reverse: false };
    case "TITLE_ASC":
      return { sortKey: "TITLE", reverse: false };
    case "TITLE_DESC":
      return { sortKey: "TITLE", reverse: true };
    case "PRICE_ASC":
      return { sortKey: "PRICE", reverse: false };
    case "PRICE_DESC":
      return { sortKey: "PRICE", reverse: true };
    case "CREATED_AT_ASC":
      return { sortKey: "CREATED", reverse: false };
    case "CREATED_AT_DESC":
      return { sortKey: "CREATED", reverse: true };
    default:
      return { sortKey: "BEST_SELLING", reverse: false };
  }
}

// Helper: Convert CollectionFilters → Shopify ProductFilter[]
export async function buildShopifyFilters(
  filters?: CollectionFilters
): Promise<ProductFilter[] | undefined> {
  if (!filters) return undefined;

  const shopifyFilters: ProductFilter[] = [];

  // Price filter
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    shopifyFilters.push({
      price: {
        min: filters.minPrice,
        max: filters.maxPrice,
      },
    });
  }

  // Tag filters - Occasions
  /* 
  if (filters.occasions && filters.occasions.length > 0) {
    filters.occasions.forEach((occasion) => {
      shopifyFilters.push({
        tag: occasion,
      });
    });
  }
  */

  // Tag filters - Recipients
  /*
  if (filters.recipients && filters.recipients.length > 0) {
    filters.recipients.forEach((recipient) => {
      shopifyFilters.push({
        tag: recipient,
      });
    });
  }
  */

  return shopifyFilters.length > 0 ? shopifyFilters : undefined;
}

// Helper: Estimate total count từ filters hoặc pageInfo
export async function estimateTotalCount(result: {
  products: Product[];
  pageInfo: PageInfo;
  filters?: Filter[];
}): Promise<number> {
  // Nếu không có next page, return exact count
  if (!result.pageInfo.hasNextPage) {
    return result.products.length;
  }

  // Nếu có filters, có thể sum từ filter counts
  // (chỉ accurate nếu user chưa chọn filter nào)
  if (result.filters && result.filters.length > 0) {
    const firstFilter = result.filters[0];
    if (firstFilter.values.length > 0) {
      // Sum all counts từ first filter
      const total = firstFilter.values.reduce(
        (sum, value) => sum + value.count,
        0
      );
      return total;
    }
  }

  // Fallback: estimate based on current results
  return result.products.length; // hoặc return "250+" string
}

/**
 * Simple function to get filtered collection products
 * - Fetches a larger batch of products
 * - Filters tags and price client-side (Shopify API limitation)
 * - Paginates filtered results
 * - Cached with React.cache() for per-request deduplication
 */
export const getFilteredCollectionProducts = cache(
  async (
    collectionHandle: string,
    options: {
      sortBy?: SortOption;
      page?: number;
      pageSize?: number;
      filters?: CollectionFilters;
      after?: string;
    }
  ): Promise<CollectionProductsResult> => {
    const {
      sortBy = "FEATURED",
      page = 1,
      pageSize = 16,
      after,
      filters,
    } = options;

    // Get sort parameters
    const { sortKey, reverse } = getSortParams(sortBy);

    const shopifyFilters = await buildShopifyFilters(filters);

    let allProducts: Product[] = [];
    let currentAfter = after;
    let lastResult: any = null;
    let resultFirst: any = null;
    let iterations = 0;

    // Calculate target range
    const targetIndex = after ? 0 : (page - 1) * pageSize;
    const totalToFetch = targetIndex + pageSize;

    // Sequential fetch to "seek" to the desired page
    // Shopify Storefront API only allows 250 items per call
    while (allProducts.length < totalToFetch && iterations < 5) {
      iterations++;
      const remaining = totalToFetch - allProducts.length;
      const first = Math.min(remaining, 250);

      const result = await getCollectionProductsWithPagination({
        collection: collectionHandle,
        sortKey,
        reverse,
        first,
        after: currentAfter,
        filters: shopifyFilters,
      });

      if (!resultFirst) resultFirst = result; // Keep first result for filters/totalCount baseline
      if (!lastResult) lastResult = result; 
      
      if (result.products.length === 0) break;

      allProducts = [...allProducts, ...result.products];
      currentAfter = result.pageInfo.endCursor;
      
      // Update lastResult to have latest pageInfo
      lastResult = {
        ...lastResult,
        pageInfo: result.pageInfo
      };

      if (!result.pageInfo.hasNextPage) break;
    }

    if (!lastResult) {
      return {
        products: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
        totalCount: 0,
      };
    }

    // Slice products for the current page
    const slicedProducts = allProducts.slice(
      targetIndex,
      targetIndex + pageSize
    );

    // Update pageInfo
    const hasNextPage =
      lastResult.pageInfo.hasNextPage ||
      allProducts.length > targetIndex + pageSize;
    const hasPreviousPage = page > 1;

    return {
      products: slicedProducts,
      pageInfo: {
        ...lastResult.pageInfo,
        hasNextPage,
        hasPreviousPage,
      },
      filters: resultFirst.filters,
      totalCount: await estimateTotalCount(resultFirst),
    };
  }
);
