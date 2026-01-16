/** @format */

import { getCollectionProductsWithPagination } from "../index";
import { Product, PageInfo } from "../types";

/**
 * Fetch all products from a collection using cursor-based pagination
 * Handles collections with >250 items
 */
export async function fetchAllCollectionProducts({
  collection,
  sortKey,
  reverse,
  maxItems = 1000, // Safety limit
}: {
  collection: string;
  sortKey?: string;
  reverse?: boolean;
  maxItems?: number;
}): Promise<{ products: Product[]; totalFetched: number }> {
  const allProducts: Product[] = [];
  let cursor: string | undefined;
  let hasNextPage = true;
  let totalFetched = 0;

  while (hasNextPage && totalFetched < maxItems) {
    const batchSize = Math.min(250, maxItems - totalFetched); // Shopify max is 250 per request

    const result = await getCollectionProductsWithPagination({
      collection,
      sortKey,
      reverse,
      first: batchSize,
      after: cursor,
    });

    allProducts.push(...result.products);
    totalFetched += result.products.length;
    hasNextPage = result.pageInfo.hasNextPage;
    cursor = result.pageInfo.endCursor;

    // Safety check: if we got fewer products than requested, we've reached the end
    if (result.products.length < batchSize) {
      hasNextPage = false;
    }
  }

  return { products: allProducts, totalFetched };
}
