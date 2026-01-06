/** @format */

// src/components/actions.ts
/** @format */

"use server";

import { getCollectionProducts, getProducts } from "@/libs/shopify";
import { Product } from "@/libs/shopify/types";

export async function getProductsByCollection(
  collectionHandle: string,
  first: number = 4
): Promise<(Product & { category: string })[]> {
  const products = await getCollectionProducts({
    collection: collectionHandle,
    sortKey: "BEST_SELLING",
    reverse: false,
    first: first,
  });

  // Gán category handle cho mỗi product
  return products.map((product) => ({
    ...product,
    category: collectionHandle,
  }));
}

export async function searchProducts(
  query: string,
  first: number = 6
): Promise<Product[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const products = await getProducts({
    query: `title:*${query}* OR description:*${query}*`,
    sortKey: "RELEVANCE",
    reverse: false,
  });

  return products.slice(0, first);
}

export async function searchProductsCount(query: string): Promise<number> {
  if (!query || query.trim().length === 0) {
    return 0;
  }

  const products = await getProducts({
    query: `title:*${query}* OR description:*${query}*`,
    sortKey: "RELEVANCE",
    reverse: false,
  });

  return products.length;
}

export async function searchCollections(
  query: string
): Promise<Array<{ handle: string; title: string }>> {
  // Lấy collections từ menu và filter theo query
  const { getMenu } = await import("@/libs/shopify");

  try {
    // Thử lấy từ menu "main-menu" hoặc menu chứa collections
    const menuItems = await getMenu("main-menu");

    // Filter collections phù hợp với query
    const filtered = menuItems
      .filter((item) => {
        const title = item.title.toLowerCase();
        const searchQuery = query.toLowerCase();
        return title.includes(searchQuery);
      })
      .slice(0, 4) // Giới hạn 4 collections
      .map((item) => {
        // Extract handle from path
        const path = item.path.replace("/search", "").replace("/", "");
        const handle = path || item.title.toLowerCase().replace(/\s+/g, "-");
        return {
          handle,
          title: item.title,
        };
      });

    return filtered;
  } catch (error) {
    console.error("Error getting collections:", error);
    return [];
  }
}
