/** @format */

"use client";

import { useMemo } from "react";

interface QuickFiltersProps {
  activeFilters: Array<{ label: string; value: string; type: string }>;
  onRemoveFilter: (type: string, value: string) => void;
  onClearAll: () => void;
}

export default function QuickFilters({
  activeFilters,
  onRemoveFilter,
  onClearAll,
}: QuickFiltersProps) {
  if (activeFilters.length === 0) {
    return null;
  }

  // Group filters by type - Use Map for better performance (7.11)
  const groupedFilters = useMemo(() => {
    const groups = new Map<string, typeof activeFilters>();
    for (const filter of activeFilters) {
      const existing = groups.get(filter.type);
      if (existing) {
        existing.push(filter);
      } else {
        groups.set(filter.type, [filter]);
      }
    }
    // Convert to object for compatibility
    const result: Record<string, typeof activeFilters> = {};
    for (const [type, filters] of groups) {
      result[type] = filters;
    }
    return result;
  }, [activeFilters]);

  return (
    <div className="flex items-center gap-3 flex-wrap mb-4">
      {Object.entries(groupedFilters).map(([type, filters]) => {
        // Get type label
        const typeLabel =
          type === "occasion"
            ? "Occasions:"
            : type === "recipient"
            ? "Recipients:"
            : type === "price"
            ? "Price:"
            : `${type}:`;

        return (
          <div
            key={type}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full"
          >
            {/* Label */}
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              {typeLabel}
            </span>

            {/* Options */}
            <div className="flex items-center gap-1.5">
              {filters.map((filter, index) => (
                <div
                  key={`${filter.type}-${filter.value}`}
                  className="flex items-center gap-1.5"
                >
                  {index > 0 && (
                    <span className="text-gray-300 text-sm">|</span>
                  )}
                  <button
                    onClick={() => onRemoveFilter(filter.type, filter.value)}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors cursor-pointer truncate max-w-[200px]"
                    title={filter.label}
                  >
                    {filter.label}
                  </button>
                </div>
              ))}
            </div>

            {/* Close button */}
            <button
              onClick={() => {
                filters.forEach((filter) =>
                  onRemoveFilter(filter.type, filter.value)
                );
              }}
              className="shrink-0 w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
              aria-label={`Remove ${typeLabel}`}
            >
              <svg
                className="w-3.5 h-3.5 text-gray-500"
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
        );
      })}

      {/* Clear All button */}
      <button
        onClick={onClearAll}
        className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer ml-auto"
      >
        Clear All
      </button>
    </div>
  );
}
