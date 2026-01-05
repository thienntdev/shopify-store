/** @format */

"use client";

import { useState, useTransition } from "react";
import ProductCard from "../product/ProductCard";
import CollectionButton from "../ui/button/CollectionButton";
import { Product } from "@/libs/shopify/types";
import { getProductsByCollection } from "../actions";

interface CategoryFilterProps {
  categories: { handle: string }[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isLoading?: boolean;
}

function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
  isLoading = false,
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-4 flex-wrap justify-center">
      {categories.map((category) => {
        const isActive = activeCategory === category.handle;

        return (
          <button
            key={category.handle}
            onClick={() => onCategoryChange(category.handle)}
            disabled={isLoading}
            className={`cursor-pointer px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isActive
                ? "bg-orange-500 text-white border-2 border-orange-500"
                : "bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500"
            }`}
          >
            {category.handle}
          </button>
        );
      })}
    </div>
  );
}

interface FilterableProductClientProps {
  initialProducts: (Product & { category: string })[];
  initialCategory: string;
  categories: { handle: string }[];
  backgroundColor?: string;
  showMoreButtonText?: string;
}

export default function FilterableProductClient({
  initialProducts,
  initialCategory,
  categories,
  backgroundColor = "bg-white",
  showMoreButtonText = "Show More",
}: FilterableProductClientProps) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [products, setProducts] = useState(initialProducts);
  const [isPending, startTransition] = useTransition();

  const handleCategoryChange = (categoryHandle: string) => {
    setActiveCategory(categoryHandle);

    // Fetch products khi click vào category
    startTransition(async () => {
      const newProducts = await getProductsByCollection(categoryHandle);
      console.log("newProducts", newProducts);
      setProducts(newProducts);
    });
  };

  return (
    <section className={`py-12 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        {/* Category Filters */}
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            isLoading={isPending}
          />
        </div>

        {/* Products Grid */}
        {isPending ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        )}

        <div className="text-center">
          <CollectionButton href={`/collections/${activeCategory}`}>
            {showMoreButtonText}
          </CollectionButton>
        </div>
      </div>
    </section>
  );
}
