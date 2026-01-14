/** @format */

"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProductList, ProductListFilters } from "@/hooks/useProductList";
import { usePriceFilter } from "@/hooks/usePriceFilter";
import ProductCard from "../product/ProductCard";
import FilterSidebar, { FilterOption } from "./FilterSidebar";
import QuickFilters from "./QuickFilters";
import SortAndView, { SortOption, ViewMode } from "./SortAndView";
import Pagination from "./Pagination";
import MobileFilterModal from "./MobileFilterModal";

interface CollectionsClientOptimizedProps {
  collectionHandle: string;
  occasions: FilterOption[];
  recipients: FilterOption[];
  priceRange: { min: number; max: number };
}

export default function CollectionsClientOptimized({
  collectionHandle,
  occasions,
  recipients,
  priceRange,
}: CollectionsClientOptimizedProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Parse URL params for initial state
  const initialFilters = useMemo(() => {
    const sortBy = (searchParams.get("sort") as SortOption) || "BEST_SELLING";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const occasion = searchParams.get("occasion") || "";
    const recipient = searchParams.get("recipient") || "";
    const minPrice = searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : priceRange.min;
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : priceRange.max;

    return {
      sortBy,
      page,
      categories: occasion ? [occasion] : [],
      tags: recipient ? [recipient] : [],
      priceRange: { min: minPrice, max: maxPrice },
    };
  }, [searchParams, priceRange]);

  // Local state for filters
  const [localFilters, setLocalFilters] = useState<{
    sortBy: SortOption;
    viewMode: ViewMode;
    selectedOccasions: string[];
    selectedRecipients: string[];
  }>({
    sortBy: initialFilters.sortBy,
    viewMode: (searchParams.get("view") as ViewMode) || "grid",
    selectedOccasions: initialFilters.categories,
    selectedRecipients: initialFilters.tags,
  });

  // Price filter with debounce
  const {
    localRange: priceFilter,
    appliedRange: appliedPriceRange,
    isPending: isPriceFilterPending,
    handleRangeChange: handlePriceRangeChange,
    handleManualApply: applyPriceFilter,
  } = usePriceFilter({
    initialRange: initialFilters.priceRange,
    onApply: (range) => {
      // Update URL when price filter is applied
      updateURL({ priceRange: range, page: 1 });
    },
    debounceMs: 500,
    requireExplicitApply: false, // Auto-apply with debounce
  });

  // Wrapper to match FilterSidebar's expected signature
  const handlePriceChange = useCallback(
    (min: number, max: number) => {
      handlePriceRangeChange({ min, max });
    },
    [handlePriceRangeChange]
  );

  // Server filters (trigger API call)
  const serverFilters: ProductListFilters = useMemo(
    () => ({
      categories: localFilters.selectedOccasions,
      tags: localFilters.selectedRecipients,
      priceRange: appliedPriceRange,
      sortBy: localFilters.sortBy,
      page: initialFilters.page,
      pageSize: 16,
    }),
    [
      localFilters.selectedOccasions,
      localFilters.selectedRecipients,
      appliedPriceRange,
      localFilters.sortBy,
      initialFilters.page,
    ]
  );

  // Fetch products using optimized hook
  const {
    data,
    isLoading,
    isFetching,
    prefetchNextPage,
    products,
    pagination,
  } = useProductList(serverFilters);

  // Update URL params
  const updateURL = useCallback(
    (updates: {
      sortBy?: SortOption;
      viewMode?: ViewMode;
      page?: number;
      categories?: string[];
      tags?: string[];
      priceRange?: { min: number; max: number };
    }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (updates.sortBy) params.set("sort", updates.sortBy);
      if (updates.viewMode) params.set("view", updates.viewMode);
      if (updates.page && updates.page > 1) {
        params.set("page", updates.page.toString());
      } else {
        params.delete("page");
      }
      if (updates.categories && updates.categories.length > 0) {
        params.set("occasion", updates.categories[0]);
      } else {
        params.delete("occasion");
      }
      if (updates.tags && updates.tags.length > 0) {
        params.set("recipient", updates.tags[0]);
      } else {
        params.delete("recipient");
      }
      if (updates.priceRange) {
        if (updates.priceRange.min !== priceRange.min) {
          params.set("minPrice", updates.priceRange.min.toString());
        } else {
          params.delete("minPrice");
        }
        if (updates.priceRange.max !== priceRange.max) {
          params.set("maxPrice", updates.priceRange.max.toString());
        } else {
          params.delete("maxPrice");
        }
      }

      router.push(`/collections/${collectionHandle}?${params.toString()}`, {
        scroll: false,
      });
    },
    [router, collectionHandle, searchParams, priceRange]
  );

  // Handlers
  const handleSortChange = useCallback(
    (sort: SortOption) => {
      setLocalFilters((prev) => ({ ...prev, sortBy: sort }));
      updateURL({ sortBy: sort, page: 1 });
    },
    [updateURL]
  );

  const handleViewChange = useCallback(
    (view: ViewMode) => {
      setLocalFilters((prev) => ({ ...prev, viewMode: view }));
      updateURL({ viewMode: view });
    },
    [updateURL]
  );

  const handleOccasionChange = useCallback(
    (value: string) => {
      const newOccasions = localFilters.selectedOccasions.includes(value)
        ? []
        : [value];
      setLocalFilters((prev) => ({
        ...prev,
        selectedOccasions: newOccasions,
      }));
      updateURL({ categories: newOccasions, page: 1 });
    },
    [localFilters.selectedOccasions, updateURL]
  );

  const handleRecipientChange = useCallback(
    (value: string) => {
      const newRecipients = localFilters.selectedRecipients.includes(value)
        ? []
        : [value];
      setLocalFilters((prev) => ({
        ...prev,
        selectedRecipients: newRecipients,
      }));
      updateURL({ tags: newRecipients, page: 1 });
    },
    [localFilters.selectedRecipients, updateURL]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateURL({ page });
      // Prefetch next page
      setTimeout(() => prefetchNextPage(), 100);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateURL, prefetchNextPage]
  );

  const handleRemoveFilter = useCallback(
    (type: string, value: string) => {
      if (type === "occasion") {
        setLocalFilters((prev) => ({ ...prev, selectedOccasions: [] }));
        updateURL({ categories: [], page: 1 });
      } else if (type === "recipient") {
        setLocalFilters((prev) => ({ ...prev, selectedRecipients: [] }));
        updateURL({ tags: [], page: 1 });
      } else if (type === "price") {
        handlePriceRangeChange(priceRange);
        updateURL({ priceRange, page: 1 });
      }
    },
    [updateURL, handlePriceRangeChange, priceRange]
  );

  const handleClearAll = useCallback(() => {
    setLocalFilters({
      sortBy: "BEST_SELLING",
      viewMode: "grid",
      selectedOccasions: [],
      selectedRecipients: [],
    });
    handlePriceRangeChange(priceRange);
    router.push(`/collections/${collectionHandle}`);
  }, [router, collectionHandle, handlePriceRangeChange, priceRange]);

  // Build active filters for QuickFilters
  const activeFilters = useMemo(
    () => [
      ...localFilters.selectedOccasions.map((val) => ({
        label: occasions.find((o) => o.value === val)?.label || val,
        value: val,
        type: "occasion",
      })),
      ...localFilters.selectedRecipients.map((val) => ({
        label: recipients.find((r) => r.value === val)?.label || val,
        value: val,
        type: "recipient",
      })),
      ...(appliedPriceRange.min !== priceRange.min ||
      appliedPriceRange.max !== priceRange.max
        ? [
            {
              label: `$${appliedPriceRange.min} - $${appliedPriceRange.max}`,
              value: "price",
              type: "price",
            },
          ]
        : []),
    ],
    [
      localFilters.selectedOccasions,
      localFilters.selectedRecipients,
      appliedPriceRange,
      priceRange,
      occasions,
      recipients,
    ]
  );

  // Products and pagination are already extracted from hook

  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
      {/* Breadcrumbs */}
      <nav className="mb-4 text-sm text-gray-600">
        <a href="/" className="hover:text-orange-500">
          Home
        </a>
        <span className="mx-2">/</span>
        <a href="/collections" className="hover:text-orange-500">
          Collections
        </a>
        <span className="mx-2">/</span>
        <span className="text-gray-900 capitalize">{collectionHandle}</span>
      </nav>

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span>Filter & Sort</span>
        </button>
        <p className="text-sm font-medium text-gray-700">
          {pagination?.totalCount || 0} RESULTS
        </p>
      </div>

      {/* Title */}
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 capitalize">
        {collectionHandle.replace(/-/g, " ")}
      </h1>
      <p className="text-gray-600 mb-6 hidden lg:block">
        Showing {pagination?.totalCount || 0} unique designs
      </p>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar
            occasions={occasions}
            recipients={recipients}
            priceRange={priceRange}
            selectedOccasions={localFilters.selectedOccasions}
            selectedRecipients={localFilters.selectedRecipients}
            priceFilter={priceFilter}
            onOccasionChange={handleOccasionChange}
            onRecipientChange={handleRecipientChange}
            onPriceChange={handlePriceChange}
          />
        </div>

        {/* Products Section */}
        <div className="flex-1">
          {/* Sort and View */}
          <SortAndView
            sortBy={localFilters.sortBy}
            viewMode={localFilters.viewMode}
            onSortChange={handleSortChange}
            onViewChange={handleViewChange}
          />

          {/* Quick Filters */}
          <QuickFilters
            activeFilters={activeFilters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAll}
          />

          {/* Price filter loading indicator */}
          {isPriceFilterPending && (
            <div className="mb-4 text-sm text-gray-500">
              Applying price filter...
            </div>
          )}

          {/* Loading State - Initial Load */}
          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 animate-pulse rounded-lg aspect-square"
                />
              ))}
            </div>
          )}

          {/* Products Grid/List */}
          {!isLoading && products.length > 0 && (
            <>
              {/* Subtle loading indicator during refetch */}
              {isFetching && !isLoading && (
                <div className="mb-4 text-sm text-gray-500">
                  Updating products...
                </div>
              )}

              <div
                className={
                  localFilters.viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 lg:gap-6"
                    : "flex flex-col divide-y divide-gray-100"
                }
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product as any}
                    variant={
                      localFilters.viewMode === "list" ? "list" : "default"
                    }
                    showDescription={localFilters.viewMode === "list"}
                    showWishlist={true}
                  />
                ))}
              </div>
            </>
          )}

          {/* Empty State */}
          {!isLoading && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No products found matching your filters.
              </p>
            </div>
          )}

          {/* Pagination */}
          {!isLoading &&
            products.length > 0 &&
            pagination &&
            pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalProducts={pagination.totalCount}
                pageSize={pagination.pageSize}
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
        selectedOccasions={localFilters.selectedOccasions}
        selectedRecipients={localFilters.selectedRecipients}
        priceFilter={priceFilter}
        onOccasionChange={handleOccasionChange}
        onRecipientChange={handleRecipientChange}
        onPriceChange={handlePriceChange}
        onApply={() => {
          // Reset to page 1 when filters are applied
          updateURL({ page: 1 });
        }}
      />
    </div>
  );
}
