/** @format */

"use client";

import { useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";

interface URLSyncOptions {
  collectionHandle: string;
  priceRange: { min: number; max: number };
}

/**
 * Hook to sync state with URL parameters without triggering navigation
 */
export function useURLSync({ collectionHandle, priceRange }: URLSyncOptions) {
  const searchParams = useSearchParams();
  const isInternalUpdateRef = useRef(false);

  const updateURL = useCallback(
    (updates: {
      sortBy?: string;
      page?: number;
      selectedOccasions?: string[];
      selectedRecipients?: string[];
      priceFilter?: { min: number; max: number };
    }) => {
      isInternalUpdateRef.current = true;

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
      if (typeof window !== "undefined") {
        const newUrl = `/collections/${collectionHandle}?${currentParams.toString()}`;
        window.history.replaceState(
          { ...window.history.state, as: newUrl, url: newUrl },
          "",
          newUrl
        );
      }

      // Reset flag after a short delay
      setTimeout(() => {
        isInternalUpdateRef.current = false;
      }, 0);
    },
    [collectionHandle, priceRange, searchParams]
  );

  const clearURL = useCallback(() => {
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
  }, [collectionHandle]);

  return {
    updateURL,
    clearURL,
    isInternalUpdate: isInternalUpdateRef.current,
  };
}
