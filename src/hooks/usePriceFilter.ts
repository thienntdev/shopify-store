/** @format */

"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface UsePriceFilterOptions {
  initialRange: { min: number; max: number };
  onApply: (range: { min: number; max: number }) => void;
  debounceMs?: number;
  requireExplicitApply?: boolean;
}

export function usePriceFilter({
  initialRange,
  onApply,
  debounceMs = 500,
  requireExplicitApply = false,
}: UsePriceFilterOptions) {
  const [localRange, setLocalRange] = useState(initialRange);
  const [appliedRange, setAppliedRange] = useState(initialRange);
  const [isPending, setIsPending] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastAppliedRangeRef = useRef(initialRange);

  const handleRangeChange = useCallback(
    (newRange: { min: number; max: number }) => {
      setLocalRange(newRange);
      setIsPending(true);

      // If explicit apply is required, don't auto-apply
      if (requireExplicitApply) {
        return;
      }

      // Cancel previous debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Cancel in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      // Debounce API call
      debounceTimerRef.current = setTimeout(() => {
        // Check if range actually changed
        if (
          newRange.min !== lastAppliedRangeRef.current.min ||
          newRange.max !== lastAppliedRangeRef.current.max
        ) {
          lastAppliedRangeRef.current = newRange;
          setAppliedRange(newRange);
          setIsPending(false);
          onApply(newRange);
        } else {
          setIsPending(false);
        }
      }, debounceMs);
    },
    [debounceMs, onApply, requireExplicitApply]
  );

  const handleManualApply = useCallback(() => {
    // Clear any pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Cancel in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Check if range actually changed
    if (
      localRange.min !== lastAppliedRangeRef.current.min ||
      localRange.max !== lastAppliedRangeRef.current.max
    ) {
      lastAppliedRangeRef.current = localRange;
      setAppliedRange(localRange);
      setIsPending(false);
      onApply(localRange);
    } else {
      setIsPending(false);
    }
  }, [localRange, onApply]);

  const reset = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setLocalRange(initialRange);
    setAppliedRange(initialRange);
    lastAppliedRangeRef.current = initialRange;
    setIsPending(false);
  }, [initialRange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    localRange,
    appliedRange,
    isPending,
    handleRangeChange,
    handleManualApply,
    reset,
  };
}
