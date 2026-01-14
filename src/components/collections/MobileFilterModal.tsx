/** @format */

"use client";

import { useEffect, useState } from "react";
import FilterSidebar, { FilterOption } from "./FilterSidebar";

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  occasions: FilterOption[];
  recipients: FilterOption[];
  priceRange: { min: number; max: number };
  selectedOccasions: string[];
  selectedRecipients: string[];
  priceFilter: { min: number; max: number };
  onOccasionChange: (value: string) => void;
  onRecipientChange: (value: string) => void;
  onPriceChange: (min: number, max: number) => void;
  onApply: () => void;
}

export default function MobileFilterModal({
  isOpen,
  onClose,
  occasions,
  recipients,
  priceRange,
  selectedOccasions,
  selectedRecipients,
  priceFilter,
  onOccasionChange,
  onRecipientChange,
  onPriceChange,
  onApply,
}: MobileFilterModalProps) {
  const [headerHeight, setHeaderHeight] = useState(0);

  // Local state for temporary filter values (only apply when clicking Apply button)
  const [tempOccasions, setTempOccasions] =
    useState<string[]>(selectedOccasions);
  const [tempRecipients, setTempRecipients] =
    useState<string[]>(selectedRecipients);
  const [tempPriceFilter, setTempPriceFilter] = useState<{
    min: number;
    max: number;
  }>(priceFilter);

  // Sync local state when modal opens or props change
  useEffect(() => {
    if (isOpen) {
      setTempOccasions(selectedOccasions);
      setTempRecipients(selectedRecipients);
      setTempPriceFilter(priceFilter);
    }
  }, [isOpen, selectedOccasions, selectedRecipients, priceFilter]);

  // Handlers that only update local state (not applied yet)
  const handleTempOccasionChange = (value: string) => {
    setTempOccasions((prev) => (prev.includes(value) ? [] : [value]));
  };

  const handleTempRecipientChange = (value: string) => {
    setTempRecipients((prev) => (prev.includes(value) ? [] : [value]));
  };

  const handleTempPriceChange = (min: number, max: number) => {
    setTempPriceFilter({ min, max });
  };

  // Apply all filters when clicking Apply button
  const handleApply = () => {
    // Close modal first to prevent any re-render issues
    onClose();

    // Check if any filter has changed
    const occasionsChanged =
      JSON.stringify(tempOccasions) !== JSON.stringify(selectedOccasions);
    const recipientsChanged =
      JSON.stringify(tempRecipients) !== JSON.stringify(selectedRecipients);
    const priceChanged =
      tempPriceFilter.min !== priceFilter.min ||
      tempPriceFilter.max !== priceFilter.max;

    // Apply filters if changed
    if (occasionsChanged || recipientsChanged || priceChanged) {
      // Apply occasions
      if (occasionsChanged) {
        if (tempOccasions.length > 0) {
          onOccasionChange(tempOccasions[0]);
        } else {
          onOccasionChange("");
        }
      }

      // Apply recipients
      if (recipientsChanged) {
        if (tempRecipients.length > 0) {
          onRecipientChange(tempRecipients[0]);
        } else {
          onRecipientChange("");
        }
      }

      // Apply price filter
      if (priceChanged) {
        onPriceChange(tempPriceFilter.min, tempPriceFilter.max);
      }

      // Call the onApply callback (this will reset page to 1)
      onApply();
    }
  };

  // Calculate header height dynamically
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector("header");
      if (header) {
        setHeaderHeight(header.getBoundingClientRect().bottom);
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    window.addEventListener("scroll", updateHeaderHeight);

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
      window.removeEventListener("scroll", updateHeaderHeight);
    };
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Modal with slide animation */}
      <div
        className={`fixed left-0 bottom-0 w-80 bg-white z-50 lg:hidden overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          top: `${headerHeight}px`,
        }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-3 flex items-center justify-between z-10 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close filters"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-3">
          <FilterSidebar
            occasions={occasions}
            recipients={recipients}
            priceRange={priceRange}
            selectedOccasions={tempOccasions}
            selectedRecipients={tempRecipients}
            priceFilter={tempPriceFilter}
            onOccasionChange={handleTempOccasionChange}
            onRecipientChange={handleTempRecipientChange}
            onPriceChange={handleTempPriceChange}
          />
        </div>

        {/* Apply Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3 shadow-lg">
          <button
            onClick={handleApply}
            className="w-full bg-orange-500 text-white py-2.5 px-4 rounded-md text-sm font-semibold hover:bg-orange-600 transition-colors shadow-md"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}
