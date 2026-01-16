/** @format */

"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Product } from "@/libs/shopify/types";
import { getFilteredCollectionProducts, CollectionFilters, SortOption } from "@/components/collections/actions";
import { useURLSync } from "./useURLSync";
import { usePriceFilter } from "./usePriceFilter";

interface UseCollectionFiltersOptions {
  initialProducts: Product[];
  totalCount: number;
  collectionHandle: string;
  occasions: Array<{ value: string; label: string }>;
  recipients: Array<{ value: string; label: string }>;
  priceRange: { min: number; max: number };
}

/**
 * Main hook for managing collection filters, sorting, and pagination
 */
export function useCollectionFilters({
  initialProducts,
  totalCount,
  collectionHandle,
  occasions,
  recipients,
  priceRange,
}: UseCollectionFiltersOptions) {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState(initialProducts);
  const [currentTotalCount, setCurrentTotalCount] = useState(totalCount);
  const [previousProducts, setPreviousProducts] = useState<Product[]>([]);

  // Get initial state from URL params
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

  const { updateURL, clearURL } = useURLSync({ collectionHandle, priceRange });

  // Price filter with debounce
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

  const handlePriceChange = useCallback(
    (min: number, max: number) => {
      handlePriceRangeChange({ min, max });
    },
    [handlePriceRangeChange]
  );

  // Ref to track previous filter values to prevent duplicate API calls
  const previousFiltersRef = useRef<string>("");
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (previousFiltersRef.current === "") {
      previousFiltersRef.current = "__INIT__";
    }
  }, []);

  // Fetch products when filters/sort/page change
  useEffect(() => {
    const currentPriceFilter = state.priceFilter;

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

    if (previousFiltersRef.current === filterKey) {
      return;
    }

    previousFiltersRef.current = filterKey;
    isFetchingRef.current = false;
    isFetchingRef.current = true;

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

      if (currentFilterKey === filterKey) {
        setProducts(result.products);
        setCurrentTotalCount(result.totalCount);
        setPreviousProducts([]);
      } else {
        previousFiltersRef.current = currentFilterKey;
      }

      isFetchingRef.current = false;
    });
  }, [
    state.sortBy,
    state.page,
    state.selectedOccasions,
    state.selectedRecipients,
    state.priceFilter,
    collectionHandle,
    priceRange,
    products,
  ]);

  // Handlers
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
        updateURL({
          selectedRecipients: newRecipients.length > 0 ? [newRecipients[0]] : [],
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

  const handleClearAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      page: 1,
      selectedOccasions: [],
      selectedRecipients: [],
      priceFilter: { min: priceRange.min, max: priceRange.max },
    }));
    handlePriceRangeChange(priceRange);
    clearURL();
  }, [priceRange, handlePriceRangeChange, clearURL]);

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

  // Build active filters for QuickFilters component
  const activeFilters = useMemo(() => {
    const occasionMap = new Map(occasions.map((o) => [o.value, o.label]));
    const recipientMap = new Map(recipients.map((r) => [r.value, r.label]));

    const filters: Array<{ label: string; value: string; type: string }> = [];

    for (const val of state.selectedOccasions) {
      filters.push({
        label: occasionMap.get(val) || val,
        value: val,
        type: "occasion",
      });
    }

    for (const val of state.selectedRecipients) {
      filters.push({
        label: recipientMap.get(val) || val,
        value: val,
        type: "recipient",
      });
    }

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

  return {
    // State
    state,
    products,
    currentTotalCount,
    previousProducts,
    activeFilters,
    totalPages,
    priceFilter,
    appliedPriceRange,

    // Loading states
    isPending,
    isPriceFilterPending,

    // Handlers
    handleSortChange,
    handleOccasionChange,
    handleRecipientChange,
    handlePriceChange,
    handleRemoveFilter,
    handleClearAll,
    handlePageChange,
  };
}
