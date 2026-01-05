/** @format */

// src/components/actions.ts
/** @format */

"use server";

import { getCollectionProducts } from "@/libs/shopify";
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
