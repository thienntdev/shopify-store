/** @format */

"use client";

import { useState, useTransition, useRef } from "react";
import ProductCard from "../product/ProductCard";
import CollectionButton from "../ui/nav/CollectionButton";
import { Product } from "@/libs/shopify/types";
import { getProductsByCollection } from "../actions";

interface CategoryFilterProps {
  categories: { handle: string; title: string }[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isLoading?: boolean;
}

function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div
      className="flex items-center gap-4 flex-wrap justify-center 
                    max-lg:flex-nowrap max-lg:overflow-x-auto max-lg:justify-start 
                    max-lg:pb-2 max-lg:-mx-4 max-lg:px-4 scrollbar-hide"
    >
      {categories.map((category) => {
        const isActive = activeCategory === category.handle;

        return (
          <button
            key={category.handle}
            onClick={() => onCategoryChange(category.handle)}
            className={`cursor-pointer px-4 py-2 rounded-lg font-medium text-sm lg:text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ${
              isActive
                ? "bg-orange-500 text-white border-2 border-orange-500"
                : "bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500"
            }`}
          >
            {category.title}
          </button>
        );
      })}
    </div>
  );
}

interface FilterableProductClientProps {
  initialProducts: (Product & { category: string })[];
  initialCategory: string;
  categories: { handle: string; title: string }[];
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

  // Cache để lưu products theo category handle
  // Sử dụng useRef để cache không bị reset khi re-render
  const productsCache = useRef<Map<string, (Product & { category: string })[]>>(
    new Map([[initialCategory, initialProducts]])
  );

  const handleCategoryChange = (categoryHandle: string) => {
    // Nếu category đang active thì không làm gì cả
    if (categoryHandle === activeCategory) {
      return;
    }

    // Kiểm tra cache trước
    const cachedProducts = productsCache.current.get(categoryHandle);

    if (cachedProducts) {
      // Nếu có trong cache thì dùng luôn, không cần fetch
      setActiveCategory(categoryHandle);
      setProducts(cachedProducts);
    } else {
      // Nếu chưa có trong cache thì fetch và lưu vào cache
      setActiveCategory(categoryHandle);

      startTransition(async () => {
        const newProducts = await getProductsByCollection(categoryHandle);
        // Lưu vào cache
        productsCache.current.set(categoryHandle, newProducts);
        setProducts(newProducts);
      });
    }
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
