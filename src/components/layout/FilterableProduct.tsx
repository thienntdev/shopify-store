/** @format */

import FilterableProductClient from "./FilterableProductClient";
import { getCollectionProducts } from "@/libs/shopify";

interface FilterableProductProps {
  categories: { handle: string }[]; // Mỗi handle là một collection handle
  backgroundColor?: string;
  showMoreButtonText?: string;
}

export default async function FilterableProduct({
  categories,
  backgroundColor = "bg-white",
  showMoreButtonText = "Show More",
}: FilterableProductProps) {
  // Chỉ fetch products của category đầu tiên khi load trang
  const initialCategory = categories[0]?.handle || "";
  const initialProducts = initialCategory
    ? await getCollectionProducts({
        collection: initialCategory,
        sortKey: "BEST_SELLING",
        reverse: false,
      })
    : [];

  // Gán category cho products
  const productsWithCategory = initialProducts.map((product) => ({
    ...product,
    category: initialCategory,
  }));

  return (
    <FilterableProductClient
      initialProducts={productsWithCategory}
      initialCategory={initialCategory}
      categories={categories}
      backgroundColor={backgroundColor}
      showMoreButtonText={showMoreButtonText}
    />
  );
}
