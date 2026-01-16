/** @format */

"use client";

import { useState } from "react";
import ProductCard from "../product/ProductCard";
import FilterSidebar, { FilterOption } from "./FilterSidebar";
import ActiveFiltersChips from "./ActiveFiltersChips";
import SortAndView, { SortOption } from "./SortAndView";
import Pagination from "./Pagination";
import MobileFilterModal from "./MobileFilterModal";
import { Product } from "@/libs/shopify/types";
import { useCollectionFilters } from "@/hooks/useCollectionFilters";
import FilterIcon from "../ui/FilterIcon";

interface CollectionsClientProps {
  initialProducts: Product[];
  totalCount: number;
  collectionHandle: string;
  occasions: FilterOption[];
  recipients: FilterOption[];
  priceRange: { min: number; max: number };
}

export default function CollectionsClient({
  initialProducts,
  totalCount,
  collectionHandle,
  occasions,
  recipients,
  priceRange,
}: CollectionsClientProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Use custom hook for all filter logic - Separated concerns
  const {
    state,
    products,
    currentTotalCount,
    previousProducts,
    activeFilters,
    totalPages,
    priceFilter,
    appliedPriceRange,
    isPending,
    isPriceFilterPending,
    handleSortChange,
    handleOccasionChange,
    handleRecipientChange,
    handlePriceChange,
    handleRemoveFilter,
    handleClearAll,
    handlePageChange,
  } = useCollectionFilters({
    initialProducts,
    totalCount,
    collectionHandle,
    occasions,
    recipients,
    priceRange,
  });

  return (
    <div className="container mx-auto px-4 py-4 bg-white min-h-screen">
      {/* <BreadCrumbs> {collectionHandle} </BreadCrumbs> */}

      {/* Title - Desktop: Title, Sort, Product Count on same line */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 capitalize">
          {collectionHandle.replace(/-/g, " ")}
        </h1>
        {/* Desktop: Sort and Products count - Right aligned */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">SORT:</span>
            <select
              value={state.sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white cursor-pointer"
            >
              <option value="FEATURED">Featured</option>
              <option value="BEST_SELLING">Best selling</option>
              <option value="TITLE_ASC">Alphabetically, A-Z</option>
              <option value="TITLE_DESC">Alphabetically, Z-A</option>
              <option value="PRICE_ASC">Price, low to high</option>
              <option value="PRICE_DESC">Price, high to low</option>
              <option value="CREATED_AT_ASC">Date, old to new</option>
              <option value="CREATED_AT_DESC">Date, new to old</option>
            </select>
          </div>
          {/* Products count */}
          <p className="text-gray-600">{currentTotalCount} products</p>
        </div>
        {/* Mobile: Products count - Right aligned */}
        <p className="text-sm font-medium text-gray-700 lg:hidden">
          {currentTotalCount} products
        </p>
      </div>

      {/* Mobile: Filter (left) and Sort (right) */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        {/* Filter - Left */}
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <FilterIcon size="md" />
          <span>Filters</span>
        </button>

        {/* Sort - Right */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">SORT:</span>
          <select
            value={state.sortBy}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white cursor-pointer"
          >
            <option value="FEATURED">Featured</option>
            <option value="BEST_SELLING">Best selling</option>
            <option value="TITLE_ASC">Alphabetically, A-Z</option>
            <option value="TITLE_DESC">Alphabetically, Z-A</option>
            <option value="PRICE_ASC">Price, low to high</option>
            <option value="PRICE_DESC">Price, high to low</option>
            <option value="CREATED_AT_ASC">Date, old to new</option>
            <option value="CREATED_AT_DESC">Date, new to old</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Filter Sidebar - Horizontal on desktop, hidden on mobile */}
        <div className="hidden lg:block">
          <FilterSidebar
            occasions={occasions}
            recipients={recipients}
            priceRange={priceRange}
            selectedOccasions={state.selectedOccasions}
            selectedRecipients={state.selectedRecipients}
            priceFilter={priceFilter}
            onOccasionChange={handleOccasionChange}
            onRecipientChange={handleRecipientChange}
            onPriceChange={handlePriceChange}
          />
        </div>

        {/* Active Filters Chips */}
        <ActiveFiltersChips
          activeFilters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAll}
        />

        {/* Products Section */}
        <div className="flex-1">
          {/* Price filter loading indicator */}
          {isPriceFilterPending && (
            <div className="mb-4 text-sm text-gray-500">
              Applying price filter...
            </div>
          )}

          {/* Loading State - Initial Load with Skeleton */}
          {isPending && products.length === 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 lg:gap-6">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 animate-pulse rounded-lg aspect-square"
                />
              ))}
            </div>
          )}

          {/* Products Grid/List */}
          {!isPending && products.length > 0 && (
            <>
              {/* Subtle loading indicator during refetch */}
              {isPending && previousProducts.length > 0 && (
                <div className="mb-4 text-sm text-gray-500">
                  Updating products...
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 lg:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="default"
                    showDescription={false}
                    showWishlist={true}
                  />
                ))}
              </div>
            </>
          )}

          {/* Show previous products while loading new ones */}
          {isPending &&
            previousProducts.length > 0 &&
            products.length === 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 lg:gap-6 opacity-50">
                {previousProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="default"
                    showDescription={false}
                    showWishlist={true}
                  />
                ))}
              </div>
            )}

          {/* Empty State */}
          {!isPending &&
            products.length === 0 &&
            previousProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No products found matching your filters.
                </p>
              </div>
            )}

          {/* Pagination */}
          {!isPending && products.length > 0 && totalPages > 1 && (
            <Pagination
              currentPage={state.page}
              totalPages={totalPages}
              totalProducts={currentTotalCount}
              pageSize={16}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <MobileFilterModal
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        occasions={occasions}
        recipients={recipients}
        priceRange={priceRange}
        selectedOccasions={state.selectedOccasions}
        selectedRecipients={state.selectedRecipients}
        priceFilter={state.priceFilter}
        onOccasionChange={handleOccasionChange}
        onRecipientChange={handleRecipientChange}
        onPriceChange={handlePriceChange}
        onApply={() => {
          // Reset to page 1 when filters are applied - handled by hook
        }}
      />
    </div>
  );
}
