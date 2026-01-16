/** @format */

"use client";

import { useState, useEffect, useRef } from "react";
import PriceRangeSlider from "./PriceRangeSlider";
import FilterOptionButtons from "./FilterOptionButtons";

// Re-export FilterOption for backward compatibility
export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

// Cache formatPrice function (7.4) - Module-level cache for repeated calls
const formatPriceCache = new Map<number, string>();
const formatPrice = (price: number): string => {
  if (formatPriceCache.has(price)) {
    return formatPriceCache.get(price)!;
  }
  const formatted = new Intl.NumberFormat("vi-VN").format(price);
  formatPriceCache.set(price, formatted);
  return formatted;
};

interface FilterSidebarProps {
  occasions: FilterOption[];
  recipients: FilterOption[];
  priceRange: { min: number; max: number };
  selectedOccasions: string[];
  selectedRecipients: string[];
  priceFilter: { min: number; max: number };
  onOccasionChange: (value: string) => void;
  onRecipientChange: (value: string) => void;
  onPriceChange: (min: number, max: number) => void;
}

export default function FilterSidebar({
  occasions,
  recipients,
  priceRange,
  selectedOccasions,
  selectedRecipients,
  priceFilter,
  onOccasionChange,
  onRecipientChange,
  onPriceChange,
}: FilterSidebarProps) {
  const [openDropdown, setOpenDropdown] = useState<
    "occasions" | "recipients" | "price" | null
  >(null);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [tempPriceFilter, setTempPriceFilter] = useState(priceFilter);
  // Temporary state for desktop dropdowns (only apply when clicking "View Results")
  const [tempOccasions, setTempOccasions] =
    useState<string[]>(selectedOccasions);
  const [tempRecipients, setTempRecipients] =
    useState<string[]>(selectedRecipients);
  const occasionsDropdownRef = useRef<HTMLDivElement>(null);
  const recipientsDropdownRef = useRef<HTMLDivElement>(null);
  const priceModalRef = useRef<HTMLDivElement>(null);

  // Reset tempPriceFilter when modal opens - Narrow dependencies (5.3)
  useEffect(() => {
    if (isPriceModalOpen) {
      setTempPriceFilter(priceFilter);
    }
  }, [isPriceModalOpen, priceFilter.min, priceFilter.max]);

  // Reset tempOccasions and tempRecipients when dropdown opens - Narrow dependencies (5.3)
  // Only update when dropdown opens, sync values at that moment
  const isOccasionsOpen = openDropdown === "occasions";
  useEffect(() => {
    if (isOccasionsOpen) {
      setTempOccasions(selectedOccasions);
    }
  }, [isOccasionsOpen, selectedOccasions]); // Update when dropdown opens

  const isRecipientsOpen = openDropdown === "recipients";
  useEffect(() => {
    if (isRecipientsOpen) {
      setTempRecipients(selectedRecipients);
    }
  }, [isRecipientsOpen, selectedRecipients]); // Update when dropdown opens

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        occasionsDropdownRef.current &&
        !occasionsDropdownRef.current.contains(event.target as Node) &&
        openDropdown === "occasions"
      ) {
        setOpenDropdown(null);
      }
      if (
        recipientsDropdownRef.current &&
        !recipientsDropdownRef.current.contains(event.target as Node) &&
        openDropdown === "recipients"
      ) {
        setOpenDropdown(null);
      }
      if (
        priceModalRef.current &&
        !priceModalRef.current.contains(event.target as Node) &&
        isPriceModalOpen
      ) {
        setIsPriceModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPriceModalOpen, openDropdown]);

  const toggleDropdown = (type: "occasions" | "recipients" | "price") => {
    if (type === "price") {
      setIsPriceModalOpen(true);
      setOpenDropdown(null);
    } else {
      setOpenDropdown(openDropdown === type ? null : type);
      setIsPriceModalOpen(false);
    }
  };

  const applyPriceFilter = () => {
    // Apply the temporary price filter
    onPriceChange(tempPriceFilter.min, tempPriceFilter.max);
    setIsPriceModalOpen(false);
  };

  const getSelectedOccasionLabel = () => {
    // Always return "Occasions" - color change indicates selection
    return "Occasions";
  };

  const getSelectedRecipientLabel = () => {
    // Always return "Recipients" - color change indicates selection
    return "Recipients";
  };

  const isPriceFilterActive =
    priceFilter.min !== priceRange.min || priceFilter.max !== priceRange.max;

  return (
    <>
      {/* Vertical Filter Layout - Mobile Only */}
      <div className="lg:hidden space-y-6">
        {/* Price Range Section - First */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Price Range
          </h3>
          <PriceRangeSlider
            priceRange={priceRange}
            priceFilter={priceFilter}
            onPriceChange={onPriceChange}
          />
        </div>

        {/* Occasions Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Occasions
          </h3>
          <FilterOptionButtons
            options={occasions}
            selectedValues={selectedOccasions}
            onToggle={onOccasionChange}
          />
        </div>

        {/* Recipients Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Recipients
          </h3>
          <FilterOptionButtons
            options={recipients}
            selectedValues={selectedRecipients}
            onToggle={onRecipientChange}
          />
        </div>
      </div>

      {/* Horizontal Filter Bar - Desktop Only */}
      <div className="hidden lg:block mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-gray-700 mr-2">
            Filter by criteria:
          </span>
          {/* Occasions Filter Button */}
          <div className="relative" ref={occasionsDropdownRef}>
            <button
              onClick={() => toggleDropdown("occasions")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                selectedOccasions.length > 0
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              <span className="text-sm font-medium">
                {getSelectedOccasionLabel()}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  openDropdown === "occasions" ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Occasions Dropdown */}
            {openDropdown === "occasions" && (
              <div className="absolute top-full left-0 mt-2 w-auto min-w-96 max-w-2xl bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4">
                <FilterOptionButtons
                  options={occasions}
                  selectedValues={tempOccasions}
                  onToggle={(value) => {
                    // Update temporary state only
                    setTempOccasions((prev) =>
                      prev.includes(value)
                        ? prev.filter((v) => v !== value)
                        : [...prev, value]
                    );
                  }}
                />
                <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setOpenDropdown(null)}
                    className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      // Apply all changes
                      tempOccasions.forEach((val) => {
                        if (!selectedOccasions.includes(val)) {
                          onOccasionChange(val);
                        }
                      });
                      selectedOccasions.forEach((val) => {
                        if (!tempOccasions.includes(val)) {
                          onOccasionChange(val);
                        }
                      });
                      setOpenDropdown(null);
                    }}
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer"
                  >
                    View Results
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Recipients Filter Button */}
          <div className="relative" ref={recipientsDropdownRef}>
            <button
              onClick={() => toggleDropdown("recipients")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                selectedRecipients.length > 0
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              <span className="text-sm font-medium">
                {getSelectedRecipientLabel()}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  openDropdown === "recipients" ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Recipients Dropdown */}
            {openDropdown === "recipients" && (
              <div className="absolute top-full left-0 mt-2 w-auto min-w-96 max-w-2xl bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4">
                <FilterOptionButtons
                  options={recipients}
                  selectedValues={tempRecipients}
                  onToggle={(value) => {
                    // Update temporary state only
                    setTempRecipients((prev) =>
                      prev.includes(value)
                        ? prev.filter((v) => v !== value)
                        : [...prev, value]
                    );
                  }}
                />
                <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setOpenDropdown(null)}
                    className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      // Apply all changes
                      tempRecipients.forEach((val) => {
                        if (!selectedRecipients.includes(val)) {
                          onRecipientChange(val);
                        }
                      });
                      selectedRecipients.forEach((val) => {
                        if (!tempRecipients.includes(val)) {
                          onRecipientChange(val);
                        }
                      });
                      setOpenDropdown(null);
                    }}
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer"
                  >
                    View Results
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Price Range Filter Button */}
          <div className="relative" ref={priceModalRef}>
            <button
              onClick={() => toggleDropdown("price")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                isPriceFilterActive
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium">Filter by Price</span>
            </button>

            {/* Price Range Modal */}
            {isPriceModalOpen && (
              <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Choose a price range that suits you
                </h3>

                <PriceRangeSlider
                  priceRange={priceRange}
                  priceFilter={priceFilter}
                  autoUpdate={false}
                  onValueChange={(min, max) => {
                    // Store temporary values, don't update parent yet
                    setTempPriceFilter({ min, max });
                  }}
                  onPriceChange={(min, max) => {
                    // This won't be called when autoUpdate is false
                    onPriceChange(min, max);
                  }}
                />

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsPriceModalOpen(false)}
                    className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={applyPriceFilter}
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    View Results
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
