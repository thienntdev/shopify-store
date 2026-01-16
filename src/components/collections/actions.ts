/** @format */

"use server";

import { cache } from "react";
import { getCollectionProductsWithPagination } from "@/libs/shopify";
import { Product, PageInfo } from "@/libs/shopify/types";

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

    const hasPriceFilter =
      filters?.minPrice !== undefined || filters?.maxPrice !== undefined;
    const hasTagFilter =
      (filters?.occasions && filters.occasions.length > 0) ||
      (filters?.recipients && filters.recipients.length > 0);

    // Fetch a larger batch to account for filtering
    // Multiply by 10x to ensure we have enough products after filtering
    const fetchSize = pageSize * 10;
    const result = await getCollectionProductsWithPagination({
      collection: collectionHandle,
      sortKey,
      reverse,
      first: fetchSize,
      after,
    });

    // Filter by tags and price (client-side filtering)
    let filteredProducts = result.products;

    // Filter by tags
    if (hasTagFilter) {
      filteredProducts = filteredProducts.filter((product) => {
        const productTags = product.tags || [];

        // Check occasions
        if (filters?.occasions && filters.occasions.length > 0) {
          const hasOccasion = filters.occasions.some((tag) =>
            productTags.some((pt) =>
              pt.toLowerCase().includes(tag.toLowerCase())
            )
          );
          if (!hasOccasion) return false;
        }

        // Check recipients
        if (filters?.recipients && filters.recipients.length > 0) {
          const hasRecipient = filters.recipients.some((tag) =>
            productTags.some((pt) =>
              pt.toLowerCase().includes(tag.toLowerCase())
            )
          );
          if (!hasRecipient) return false;
        }

        return true;
      });
    }

    // Filter by price
    if (hasPriceFilter) {
      filteredProducts = filteredProducts.filter((product) => {
        const minPrice = parseFloat(
          product.priceRange?.minVariantPrice?.amount || "0"
        );
        const maxPrice = parseFloat(
          product.priceRange?.maxVariantPrice?.amount || "0"
        );

        if (filters?.minPrice !== undefined && maxPrice < filters.minPrice) {
          return false;
        }

        if (filters?.maxPrice !== undefined && minPrice > filters.maxPrice) {
          return false;
        }

        return true;
      });
    }

    // Paginate the filtered results
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      pageInfo: {
        hasNextPage: filteredProducts.length > endIndex,
        hasPreviousPage: page > 1,
        endCursor: result.pageInfo.endCursor,
      },
      totalCount: filteredProducts.length,
    };
  }
);
