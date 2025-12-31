/** @format */

"use client";

import { useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import CollectionButton from "@/components/ui/CollectionButton";

export interface FilterableProduct {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  originalPrice?: number;
  discount?: number;
  badge?: string;
}

interface CategoryFilterProps {
  categories: { name: string }[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-4 flex-wrap justify-center">
      {categories.map((category) => {
        const isActive = activeCategory === category.name;

        return (
          <button
            key={category.name}
            onClick={() => onCategoryChange(category.name)}
            className={`cursor-pointer px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              isActive
                ? "bg-orange-500 text-white border-2 border-orange-500"
                : "bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500"
            }`}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}

interface FilterableProductSectionProps {
  products: FilterableProduct[];
  categories: { name: string }[];
  backgroundColor?: string;
  showMoreButton?: boolean;
  showMoreButtonText?: string;
  collectionHref?: string;
}

export default function FilterableProductSection({
  products,
  categories,
  backgroundColor = "bg-white",
  showMoreButton = true,
  showMoreButtonText = "Show More",
  collectionHref = "/products",
}: FilterableProductSectionProps) {
  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.name || ""
  );

  const filteredProducts = products.filter(
    (product) => product.category === activeCategory
  );

  return (
    <section className={`py-12 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        {/* Category Filters */}
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {filteredProducts.map((product) => {
            const { category, ...productProps } = product;
            return <ProductCard key={product.id} {...productProps} />;
          })}
        </div>

        {/* Show More Button */}
        {showMoreButton && (
          <div className="text-center">
            <CollectionButton href={collectionHref}>
              {showMoreButtonText}
            </CollectionButton>
          </div>
        )}
      </div>
    </section>
  );
}
