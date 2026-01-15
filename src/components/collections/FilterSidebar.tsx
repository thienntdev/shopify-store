/** @format */

"use client";

import { useState, useEffect, useRef } from "react";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

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
  const [expandedSections, setExpandedSections] = useState({
    occasions: true,
    recipients: true,
    priceRange: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Local state for price slider to update UI immediately
  const [localMaxPrice, setLocalMaxPrice] = useState(priceFilter.max);
  const priceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local state with prop
  useEffect(() => {
    setLocalMaxPrice(priceFilter.max);
  }, [priceFilter.max]);

  useEffect(() => {
    return () => {
      if (priceTimeoutRef.current) {
        clearTimeout(priceTimeoutRef.current);
      }
    };
  }, []);

  const handlePriceSliderChange = (max: number) => {
    // Update local state immediately for smooth UI
    setLocalMaxPrice(max);

    // Clear previous timeout
    if (priceTimeoutRef.current) {
      clearTimeout(priceTimeoutRef.current);
    }

    // Debounce the actual price change callback
    priceTimeoutRef.current = setTimeout(() => {
      onPriceChange(priceFilter.min, max);
    }, 500);
  };

  const handlePriceInputChange = (type: "min" | "max", value: string) => {
    const numValue = parseFloat(value) || 0;
    if (type === "min") {
      onPriceChange(
        Math.max(priceRange.min, Math.min(numValue, priceFilter.max)),
        priceFilter.max
      );
    } else {
      const newMax = Math.max(
        priceFilter.min,
        Math.min(numValue, priceRange.max)
      );
      setLocalMaxPrice(newMax);
      onPriceChange(priceFilter.min, newMax);
    }
  };

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white rounded-lg p-3 lg:p-4 space-y-4 lg:space-y-6 sticky top-4">
        {/* Occasions Filter */}
        <div className="border-b border-gray-200 pb-3 lg:pb-4">
          <button
            onClick={() => toggleSection("occasions")}
            className="w-full flex items-center justify-between text-base lg:text-lg font-semibold text-gray-900 mb-2 lg:mb-3"
          >
            <span>Occasions</span>
            <svg
              className={`w-4 h-4 lg:w-5 lg:h-5 transition-transform ${
                expandedSections.occasions ? "rotate-180" : ""
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
          {expandedSections.occasions && (
            <div className="space-y-1.5 lg:space-y-2">
              {occasions.map((occasion) => (
                <label
                  key={occasion.value}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="occasion"
                    value={occasion.value}
                    checked={selectedOccasions.includes(occasion.value)}
                    onChange={() => onOccasionChange(occasion.value)}
                    className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-orange-500 border-gray-300 focus:ring-orange-500 focus:ring-2"
                  />
                  <span className="text-xs lg:text-sm text-gray-700 group-hover:text-orange-500 transition-colors">
                    {occasion.label}
                  </span>
                  {occasion.count !== undefined && (
                    <span className="text-[10px] lg:text-xs text-gray-500 ml-auto">
                      ({occasion.count})
                    </span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Recipients Filter */}
        <div className="border-b border-gray-200 pb-3 lg:pb-4">
          <button
            onClick={() => toggleSection("recipients")}
            className="w-full flex items-center justify-between text-base lg:text-lg font-semibold text-gray-900 mb-2 lg:mb-3"
          >
            <span>Recipients</span>
            <svg
              className={`w-4 h-4 lg:w-5 lg:h-5 transition-transform ${
                expandedSections.recipients ? "rotate-180" : ""
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
          {expandedSections.recipients && (
            <div className="space-y-1.5 lg:space-y-2">
              {recipients.map((recipient) => (
                <label
                  key={recipient.value}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="recipient"
                    value={recipient.value}
                    checked={selectedRecipients.includes(recipient.value)}
                    onChange={() => onRecipientChange(recipient.value)}
                    className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-orange-500 border-gray-300 focus:ring-orange-500 focus:ring-2"
                  />
                  <span className="text-xs lg:text-sm text-gray-700 group-hover:text-orange-500 transition-colors">
                    {recipient.label}
                  </span>
                  {recipient.count !== undefined && (
                    <span className="text-[10px] lg:text-xs text-gray-500 ml-auto">
                      ({recipient.count})
                    </span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div className="pb-3 lg:pb-4">
          <button
            onClick={() => toggleSection("priceRange")}
            className="w-full flex items-center justify-between text-base lg:text-lg font-semibold text-gray-900 mb-2 lg:mb-3"
          >
            <span>Price Range</span>
            <svg
              className={`w-4 h-4 lg:w-5 lg:h-5 transition-transform ${
                expandedSections.priceRange ? "rotate-180" : ""
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
          {expandedSections.priceRange && (
            <div className="space-y-3 lg:space-y-4">
              {/* Price Range Slider */}
              <div className="relative">
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={localMaxPrice}
                  onChange={(e) =>
                    handlePriceSliderChange(parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  style={{
                    background: `linear-gradient(to right, #f97316 0%, #f97316 ${
                      ((localMaxPrice - priceRange.min) /
                        (priceRange.max - priceRange.min)) *
                      100
                    }%, #e5e7eb ${
                      ((localMaxPrice - priceRange.min) /
                        (priceRange.max - priceRange.min)) *
                      100
                    }%, #e5e7eb 100%)`,
                  }}
                />
              </div>

              {/* Price Inputs */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-[10px] lg:text-xs text-gray-600 mb-0.5 lg:mb-1 block">
                    Min
                  </label>
                  <input
                    type="number"
                    min={priceRange.min}
                    max={priceFilter.max}
                    value={priceFilter.min}
                    onChange={(e) =>
                      handlePriceInputChange("min", e.target.value)
                    }
                    className="w-full px-2 py-1.5 lg:px-3 lg:py-2 border border-gray-300 rounded-md text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] lg:text-xs text-gray-600 mb-0.5 lg:mb-1 block">
                    Max
                  </label>
                  <input
                    type="number"
                    min={priceFilter.min}
                    max={priceRange.max}
                    value={localMaxPrice}
                    onChange={(e) =>
                      handlePriceInputChange("max", e.target.value)
                    }
                    className="w-full px-2 py-1.5 lg:px-3 lg:py-2 border border-gray-300 rounded-md text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
