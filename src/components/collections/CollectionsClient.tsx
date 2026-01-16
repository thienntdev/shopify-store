/** @format */

"use client";

import {
  useState,
  useEffect,
  useTransition,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/libs/shopify/types";
import ProductCard from "../product/ProductCard";
import FilterSidebar, { FilterOption } from "./FilterSidebar";
import ActiveFiltersChips from "./ActiveFiltersChips";
import SortAndView, { SortOption } from "./SortAndView";
import Pagination from "./Pagination";
import MobileFilterModal from "./MobileFilterModal";
import { getFilteredCollectionProducts, CollectionFilters } from "./actions";
import { usePriceFilter } from "@/hooks/usePriceFilter";
import BreadCrumbs from "../ui/nav/BreadCrumbs";
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
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Get initial state from URL params - Use lazy initialization (5.6)
  const [state, setState] = useState(() => {
    const sortBy = (searchParams.get("sort") as SortOption) || "FEATURED";
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
      selectedOccasions: occasion ? [occasion] : [],
      selectedRecipients: recipient ? [recipient] : [],
      priceFilter: { min: minPrice, max: maxPrice },
    };
  });
  const [products, setProducts] = useState(initialProducts);
  const [currentTotalCount, setCurrentTotalCount] = useState(totalCount);
  const [previousProducts, setPreviousProducts] = useState<Product[]>([]); // Keep previous data while loading

  // Ref to track if we're updating URL from internal state (to avoid triggering useEffect from URL changes)
  const isInternalUpdateRef = useRef(false);

  // Update URL params without triggering navigation - Defer state reads (5.1)
  const updateURL = useCallback(
    (updates: Partial<typeof state>) => {
      isInternalUpdateRef.current = true; // Mark as internal update

      // Read searchParams on demand instead of subscribing to all changes
      const currentParams = new URLSearchParams(
        typeof window !== "undefined"
          ? window.location.search
          : searchParams.toString()
      );

      if (updates.sortBy) currentParams.set("sort", updates.sortBy);
      if (updates.page && updates.page > 1) {
        currentParams.set("page", updates.page.toString());
      } else {
        currentParams.delete("page");
      }
      if (updates.selectedOccasions && updates.selectedOccasions.length > 0) {
        currentParams.set("occasion", updates.selectedOccasions[0]);
      } else {
        currentParams.delete("occasion");
      }
      if (updates.selectedRecipients && updates.selectedRecipients.length > 0) {
        currentParams.set("recipient", updates.selectedRecipients[0]);
      } else {
        currentParams.delete("recipient");
      }
      if (updates.priceFilter) {
        if (updates.priceFilter.min !== priceRange.min) {
          currentParams.set("minPrice", updates.priceFilter.min.toString());
        } else {
          currentParams.delete("minPrice");
        }
        if (updates.priceFilter.max !== priceRange.max) {
          currentParams.set("maxPrice", updates.priceFilter.max.toString());
        } else {
          currentParams.delete("maxPrice");
        }
      }

      // Use window.history.replaceState to update URL without triggering Next.js navigation
      // This prevents GET request, only POST from useEffect will be called
      if (typeof window !== "undefined") {
        const newUrl = `/collections/${collectionHandle}?${currentParams.toString()}`;
        window.history.replaceState(
          { ...window.history.state, as: newUrl, url: newUrl },
          "",
          newUrl
        );
      }

      // Reset flag after a short delay to allow URL to update
      setTimeout(() => {
        isInternalUpdateRef.current = false;
      }, 0);
    },
    [collectionHandle, priceRange, searchParams]
  );

  // Price filter with debounce (after updateURL is defined)
  // Calculate initial price range from URL params
  const initialPriceRange = useMemo(() => {
    const minPrice = searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : priceRange.min;
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : priceRange.max;
    return { min: minPrice, max: maxPrice };
  }, [searchParams, priceRange]);

  const {
    localRange: priceFilter,
    appliedRange: appliedPriceRange,
    isPending: isPriceFilterPending,
    handleRangeChange: handlePriceRangeChange,
  } = usePriceFilter({
    initialRange: initialPriceRange,
    onApply: (range) => {
      setState((prev) => ({
        ...prev,
        priceFilter: range,
        page: 1,
      }));
      updateURL({ priceFilter: range, page: 1 });
    },
    debounceMs: 500,
    requireExplicitApply: false,
  });

  // Wrapper to match FilterSidebar's expected signature
  const handlePriceChange = useCallback(
    (min: number, max: number) => {
      handlePriceRangeChange({ min, max });
    },
    [handlePriceRangeChange]
  );

  // Ref to track previous filter values to prevent duplicate API calls
  const previousFiltersRef = useRef<string>("");
  const isFetchingRef = useRef(false);

  // Initialize previousFiltersRef on mount to allow first API call
  useEffect(() => {
    if (previousFiltersRef.current === "") {
      // Set to a dummy value to allow first fetch
      previousFiltersRef.current = "__INIT__";
    }
  }, []);

  // Fetch products when filters/sort/page change
  useEffect(() => {
    // Use state.priceFilter - it's updated synchronously in onApply callback
    // This ensures we get the latest value that was actually applied
    // appliedPriceRange from hook may not be updated yet due to async state updates
    const currentPriceFilter = state.priceFilter;

    // Build filter key to check if filters actually changed
    const filterKey = JSON.stringify({
      sortBy: state.sortBy,
      page: state.page,
      occasions: state.selectedOccasions,
      recipients: state.selectedRecipients,
      minPrice:
        currentPriceFilter.min !== priceRange.min
          ? currentPriceFilter.min
          : undefined,
      maxPrice:
        currentPriceFilter.max !== priceRange.max
          ? currentPriceFilter.max
          : undefined,
    });

    // Skip if filters haven't changed
    if (previousFiltersRef.current === filterKey) {
      return;
    }

    // Update previous filter ref BEFORE setting isFetchingRef
    // This ensures we track the new filter key immediately
    previousFiltersRef.current = filterKey;

    // Always allow new fetch when filter changes
    // Reset fetching flag to allow new fetch
    isFetchingRef.current = false;

    // Set fetching flag for this request
    isFetchingRef.current = true;

    // Keep previous products visible while loading
    if (products.length > 0) {
      setPreviousProducts(products);
    }

    startTransition(async () => {
      const filters: CollectionFilters = {
        occasions: state.selectedOccasions,
        recipients: state.selectedRecipients,
        minPrice:
          currentPriceFilter.min !== priceRange.min
            ? currentPriceFilter.min
            : undefined,
        maxPrice:
          currentPriceFilter.max !== priceRange.max
            ? currentPriceFilter.max
            : undefined,
      };

      const result = await getFilteredCollectionProducts(collectionHandle, {
        sortBy: state.sortBy,
        page: state.page,
        pageSize: 16,
        filters,
      });

      // Double check filter key hasn't changed during fetch
      // Use state.priceFilter to get the latest value
      const currentFilterKey = JSON.stringify({
        sortBy: state.sortBy,
        page: state.page,
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
      });

      // Only update if filter key still matches
      if (currentFilterKey === filterKey) {
        setProducts(result.products);
        setCurrentTotalCount(result.totalCount);
        setPreviousProducts([]); // Clear previous products after update
      } else {
        // If filter changed during fetch, update the ref to allow new fetch
        previousFiltersRef.current = currentFilterKey;
      }

      isFetchingRef.current = false;
    });
  }, [
    state.sortBy,
    state.page,
    state.selectedOccasions,
    state.selectedRecipients,
    state.priceFilter, // Use state.priceFilter - updated synchronously in onApply
    collectionHandle,
    priceRange,
  ]);

  const handleSortChange = useCallback(
    (sort: SortOption) => {
      setState((prev) => ({ ...prev, sortBy: sort, page: 1 }));
      updateURL({ sortBy: sort, page: 1 });
    },
    [updateURL]
  );

  const handleOccasionChange = useCallback(
    (value: string) => {
      setState((prev) => {
        const newOccasions = prev.selectedOccasions.includes(value)
          ? prev.selectedOccasions.filter((v) => v !== value)
          : [...prev.selectedOccasions, value];
        // Update URL with first occasion or empty
        updateURL({
          selectedOccasions: newOccasions.length > 0 ? [newOccasions[0]] : [],
          page: 1,
        });
        return {
          ...prev,
          selectedOccasions: newOccasions,
          page: 1,
        };
      });
    },
    [updateURL]
  );

  const handleRecipientChange = useCallback(
    (value: string) => {
      setState((prev) => {
        const newRecipients = prev.selectedRecipients.includes(value)
          ? prev.selectedRecipients.filter((v) => v !== value)
          : [...prev.selectedRecipients, value];
        // Update URL with first recipient or empty
        updateURL({
          selectedRecipients:
            newRecipients.length > 0 ? [newRecipients[0]] : [],
          page: 1,
        });
        return {
          ...prev,
          selectedRecipients: newRecipients,
          page: 1,
        };
      });
    },
    [updateURL]
  );

  const handleRemoveFilter = useCallback(
    (type: string, value: string) => {
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
        handlePriceRangeChange(priceRange);
        updateURL({
          priceFilter: priceRange,
          page: 1,
        });
      }
    },
    [updateURL, handlePriceRangeChange, priceRange]
  );

  const handleClearAll = () => {
    setState((prev) => ({
      ...prev,
      page: 1,
      selectedOccasions: [],
      selectedRecipients: [],
      priceFilter: { min: priceRange.min, max: priceRange.max },
    }));
    handlePriceRangeChange(priceRange);
    // Update URL without triggering navigation
    if (typeof window !== "undefined") {
      window.history.replaceState(
        {
          ...window.history.state,
          as: `/collections/${collectionHandle}`,
          url: `/collections/${collectionHandle}`,
        },
        "",
        `/collections/${collectionHandle}`
      );
    }
  };

  const handlePageChange = useCallback(
    (page: number) => {
      setState((prev) => ({ ...prev, page }));
      updateURL({ page });
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [updateURL]
  );

  // Build active filters for QuickFilters component - Use Map for O(1) lookups (7.11)
  const activeFilters = useMemo(() => {
    // Create Maps for O(1) lookups instead of O(n) find operations
    const occasionMap = new Map(occasions.map((o) => [o.value, o.label]));
    const recipientMap = new Map(recipients.map((r) => [r.value, r.label]));

    const filters: Array<{ label: string; value: string; type: string }> = [];

    // Add occasions
    for (const val of state.selectedOccasions) {
      filters.push({
        label: occasionMap.get(val) || val,
        value: val,
        type: "occasion",
      });
    }

    // Add recipients
    for (const val of state.selectedRecipients) {
      filters.push({
        label: recipientMap.get(val) || val,
        value: val,
        type: "recipient",
      });
    }

    // Add price filter if active
    if (
      appliedPriceRange.min !== priceRange.min ||
      appliedPriceRange.max !== priceRange.max
    ) {
      filters.push({
        label: `$${appliedPriceRange.min} - $${appliedPriceRange.max}`,
        value: "price",
        type: "price",
      });
    }

    return filters;
  }, [
    state.selectedOccasions,
    state.selectedRecipients,
    appliedPriceRange,
    priceRange,
    occasions,
    recipients,
  ]);

  const totalPages = Math.ceil(currentTotalCount / 16);

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
          // Reset to page 1 when filters are applied
          updateURL({ page: 1 });
        }}
      />
    </div>
  );
}
