/** @format */

"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/libs/shopify/types";
import ProductCard from "../product/ProductCard";
import FilterSidebar, { FilterOption } from "./FilterSidebar";
import QuickFilters from "./QuickFilters";
import SortAndView, { SortOption, ViewMode } from "./SortAndView";
import Pagination from "./Pagination";
import MobileFilterModal from "./MobileFilterModal";
import { getFilteredCollectionProducts, CollectionFilters } from "./actions";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Get initial state from URL params
  const getInitialState = () => {
    const sortBy = (searchParams.get("sort") as SortOption) || "BEST_SELLING";
    const viewMode = (searchParams.get("view") as ViewMode) || "grid";
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
      viewMode,
      page,
      selectedOccasions: occasion ? [occasion] : [],
      selectedRecipients: recipient ? [recipient] : [],
      priceFilter: { min: minPrice, max: maxPrice },
    };
  };

  const [state, setState] = useState(getInitialState());
  const [products, setProducts] = useState(initialProducts);
  const [currentTotalCount, setCurrentTotalCount] = useState(totalCount);

  // Update URL params
  const updateURL = useCallback(
    (updates: Partial<typeof state>) => {
      const params = new URLSearchParams(searchParams.toString());

      if (updates.sortBy) params.set("sort", updates.sortBy);
      if (updates.viewMode) params.set("view", updates.viewMode);
      if (updates.page && updates.page > 1) {
        params.set("page", updates.page.toString());
      } else {
        params.delete("page");
      }
      if (updates.selectedOccasions && updates.selectedOccasions.length > 0) {
        params.set("occasion", updates.selectedOccasions[0]);
      } else {
        params.delete("occasion");
      }
      if (updates.selectedRecipients && updates.selectedRecipients.length > 0) {
        params.set("recipient", updates.selectedRecipients[0]);
      } else {
        params.delete("recipient");
      }
      if (updates.priceFilter) {
        if (updates.priceFilter.min !== priceRange.min) {
          params.set("minPrice", updates.priceFilter.min.toString());
        } else {
          params.delete("minPrice");
        }
        if (updates.priceFilter.max !== priceRange.max) {
          params.set("maxPrice", updates.priceFilter.max.toString());
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

  // Fetch products when filters/sort/page change
  useEffect(() => {
    startTransition(async () => {
      const filters: CollectionFilters = {
        occasions: state.selectedOccasions,
        recipients: state.selectedRecipients,
        minPrice:
          state.priceFilter.min !== priceRange.min
            ? state.priceFilter.min
            : undefined,
        maxPrice:
          state.priceFilter.max !== priceRange.max
            ? state.priceFilter.max
            : undefined,
      };

      const result = await getFilteredCollectionProducts(collectionHandle, {
        sortBy: state.sortBy,
        page: state.page,
        pageSize: 16,
        filters,
      });

      setProducts(result.products);
      setCurrentTotalCount(result.totalCount);
    });
  }, [
    state.sortBy,
    state.page,
    state.selectedOccasions,
    state.selectedRecipients,
    state.priceFilter,
    collectionHandle,
    priceRange,
  ]);

  const handleSortChange = (sort: SortOption) => {
    setState((prev) => ({ ...prev, sortBy: sort, page: 1 }));
    updateURL({ sortBy: sort, page: 1 });
  };

  const handleViewChange = (view: ViewMode) => {
    setState((prev) => ({ ...prev, viewMode: view }));
    updateURL({ viewMode: view });
  };

  const handleOccasionChange = (value: string) => {
    setState((prev) => ({
      ...prev,
      selectedOccasions: prev.selectedOccasions.includes(value) ? [] : [value],
      page: 1,
    }));
    updateURL({
      selectedOccasions: state.selectedOccasions.includes(value) ? [] : [value],
      page: 1,
    });
  };

  const handleRecipientChange = (value: string) => {
    setState((prev) => ({
      ...prev,
      selectedRecipients: prev.selectedRecipients.includes(value)
        ? []
        : [value],
      page: 1,
    }));
    updateURL({
      selectedRecipients: state.selectedRecipients.includes(value)
        ? []
        : [value],
      page: 1,
    });
  };

  const handlePriceChange = (min: number, max: number) => {
    setState((prev) => ({
      ...prev,
      priceFilter: { min, max },
      page: 1,
    }));
    updateURL({ priceFilter: { min, max }, page: 1 });
  };

  const handleRemoveFilter = (type: string, value: string) => {
    if (type === "occasion") {
      setState((prev) => ({
        ...prev,
        selectedOccasions: [],
        page: 1,
      }));
      updateURL({ selectedOccasions: [], page: 1 });
    } else if (type === "recipient") {
      setState((prev) => ({
        ...prev,
        selectedRecipients: [],
        page: 1,
      }));
      updateURL({ selectedRecipients: [], page: 1 });
    } else if (type === "price") {
      setState((prev) => ({
        ...prev,
        priceFilter: { min: priceRange.min, max: priceRange.max },
        page: 1,
      }));
      updateURL({
        priceFilter: { min: priceRange.min, max: priceRange.max },
        page: 1,
      });
    }
  };

  const handleClearAll = () => {
    setState({
      sortBy: "BEST_SELLING",
      viewMode: "grid",
      page: 1,
      selectedOccasions: [],
      selectedRecipients: [],
      priceFilter: { min: priceRange.min, max: priceRange.max },
    });
    router.push(`/collections/${collectionHandle}`);
  };

  const handlePageChange = (page: number) => {
    setState((prev) => ({ ...prev, page }));
    updateURL({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Build active filters for QuickFilters component
  const activeFilters = [
    ...state.selectedOccasions.map((val) => ({
      label: occasions.find((o) => o.value === val)?.label || val,
      value: val,
      type: "occasion",
    })),
    ...state.selectedRecipients.map((val) => ({
      label: recipients.find((r) => r.value === val)?.label || val,
      value: val,
      type: "recipient",
    })),
    ...(state.priceFilter.min !== priceRange.min ||
    state.priceFilter.max !== priceRange.max
      ? [
          {
            label: `$${state.priceFilter.min} - $${state.priceFilter.max}`,
            value: "price",
            type: "price",
          },
        ]
      : []),
  ];

  const totalPages = Math.ceil(currentTotalCount / 16);

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

      {/* Mobile Header with Filter Button */}
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
          {currentTotalCount} RESULTS
        </p>
      </div>

      {/* Title */}
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 capitalize">
        {collectionHandle.replace(/-/g, " ")}
      </h1>
      <p className="text-gray-600 mb-6 hidden lg:block">
        Showing {currentTotalCount} unique designs
      </p>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block">
          <FilterSidebar
            occasions={occasions}
            recipients={recipients}
            priceRange={priceRange}
            selectedOccasions={state.selectedOccasions}
            selectedRecipients={state.selectedRecipients}
            priceFilter={state.priceFilter}
            onOccasionChange={handleOccasionChange}
            onRecipientChange={handleRecipientChange}
            onPriceChange={handlePriceChange}
          />
        </div>

        {/* Products Section */}
        <div className="flex-1">
          {/* Sort and View */}
          <SortAndView
            sortBy={state.sortBy}
            viewMode={state.viewMode}
            onSortChange={handleSortChange}
            onViewChange={handleViewChange}
          />

          {/* Quick Filters */}
          <QuickFilters
            activeFilters={activeFilters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAll}
          />

          {/* Loading State */}
          {isPending && (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading products...</p>
            </div>
          )}

          {/* Products Grid/List */}
          {!isPending && products.length > 0 && (
            <div
              className={
                state.viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 lg:gap-6"
                  : "flex flex-col gap-6"
              }
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant={state.viewMode === "list" ? "list" : "default"}
                  showDescription={state.viewMode === "list"}
                  showWishlist={true}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isPending && products.length === 0 && (
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
      />
    </div>
  );
}
