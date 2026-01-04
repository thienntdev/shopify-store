// src/components/FilterableProductSection.tsx
/** @format */

import FilterableProductSectionClient from "./FilterableProductSectionClient";
import { getCollectionProducts } from "@/libs/shopify";


interface FilterableProductSectionProps {
  categories: { handle: string }[]; // Mỗi handle là một collection handle
  backgroundColor?: string;
  showMoreButtonText?: string;
  collectionHref?: string;
}

export default async function FilterableProductSection({
  categories,
  backgroundColor = "bg-white",
  showMoreButtonText = "Show More",
  collectionHref,
}: FilterableProductSectionProps) {
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
    <FilterableProductSectionClient
      initialProducts={productsWithCategory}
      initialCategory={initialCategory}
      categories={categories}
      backgroundColor={backgroundColor}
      showMoreButtonText={showMoreButtonText}
      collectionHref={collectionHref || `/collections/${initialCategory}`}
    />
  );
}