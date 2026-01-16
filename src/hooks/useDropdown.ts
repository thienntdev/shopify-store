/** @format */

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useClickOutside } from "./useClickOutside";

type DropdownState = string | null;

interface UseDropdownOptions {
  initialValue?: DropdownState;
  onClose?: () => void;
  onOpen?: (value: string) => void;
}

/**
 * Hook for managing dropdown state with click outside detection
 */
export function useDropdown({
  initialValue = null,
  onClose,
  onOpen,
}: UseDropdownOptions = {}) {
  const [isOpen, setIsOpen] = useState<DropdownState>(initialValue);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const open = useCallback(
    (value: string) => {
      setIsOpen(value);
      onOpen?.(value);
    },
    [onOpen]
  );

  const close = useCallback(() => {
    setIsOpen(null);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(
    (value: string) => {
      if (isOpen === value) {
        close();
      } else {
        open(value);
      }
    },
    [isOpen, open, close]
  );

  // Close on click outside
  useClickOutside(
    dropdownRef,
    () => {
      if (isOpen !== null) {
        close();
      }
    },
    isOpen !== null
  );

  return {
    isOpen,
    open,
    close,
    toggle,
    dropdownRef,
  };
}
