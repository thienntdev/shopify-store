/** @format */

"use server";

import { getCollectionProductsWithPagination } from "@/libs/shopify";
import { Product, PageInfo } from "@/libs/shopify/types";

export type SortOption =
  | "BEST_SELLING"
  | "TITLE"
  | "PRICE"
  | "CREATED_AT"
  | "RELEVANCE";

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

export async function getFilteredCollectionProducts(
  collectionHandle: string,
  options: {
    sortBy?: SortOption;
    reverse?: boolean;
    page?: number;
    pageSize?: number;
    filters?: CollectionFilters;
    after?: string;
  }
): Promise<CollectionProductsResult> {
  const {
    sortBy = "BEST_SELLING",
    reverse = false,
    page = 1,
    pageSize = 16,
    after,
    filters,
  } = options;

  // Build query string for filtering by tags
  let query = "";
  const tagFilters: string[] = [];

  if (filters?.occasions && filters.occasions.length > 0) {
    tagFilters.push(...filters.occasions.map((tag) => `tag:${tag}`));
  }

  if (filters?.recipients && filters.recipients.length > 0) {
    tagFilters.push(...filters.recipients.map((tag) => `tag:${tag}`));
  }

  // Fetch products with pagination - fetch more to handle filtering and pagination
  // We fetch more products to account for filtering, then paginate client-side
  const fetchSize = pageSize * 10; // Fetch 10x pageSize to handle filtering and multiple pages
  const result = await getCollectionProductsWithPagination({
    collection: collectionHandle,
    sortKey: sortBy,
    reverse,
    first: fetchSize,
    after,
  });

  // Filter by price range on the server side (since Shopify GraphQL doesn't support price filtering directly)
  let filteredProducts = result.products;

  if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
    filteredProducts = result.products.filter((product) => {
      const minPrice = parseFloat(
        product.priceRange?.minVariantPrice?.amount || "0"
      );
      const maxPrice = parseFloat(
        product.priceRange?.maxVariantPrice?.amount || "0"
      );

      if (filters.minPrice !== undefined && maxPrice < filters.minPrice) {
        return false;
      }

      if (filters.maxPrice !== undefined && minPrice > filters.maxPrice) {
        return false;
      }

      return true;
    });
  }

  // Filter by tags if needed (Shopify query doesn't support multiple tag filters well)
  // We'll filter on server side for now
  if (tagFilters.length > 0) {
    filteredProducts = filteredProducts.filter((product) => {
      const productTags = product.tags || [];

      // Check occasions
      if (filters?.occasions && filters.occasions.length > 0) {
        const hasOccasion = filters.occasions.some((tag) =>
          productTags.some((pt) => pt.toLowerCase().includes(tag.toLowerCase()))
        );
        if (!hasOccasion) return false;
      }

      // Check recipients
      if (filters?.recipients && filters.recipients.length > 0) {
        const hasRecipient = filters.recipients.some((tag) =>
          productTags.some((pt) => pt.toLowerCase().includes(tag.toLowerCase()))
        );
        if (!hasRecipient) return false;
      }

      return true;
    });
  }

  // Paginate filtered products based on page number
  const currentPage = page || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return {
    products: paginatedProducts,
    pageInfo: result.pageInfo,
    totalCount: filteredProducts.length, // Total count after filtering
  };
}
