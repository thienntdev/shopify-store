/** @format */

"use client";

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

  return (
    <div className="flex items-center gap-2 flex-wrap mb-4">
      <span className="text-sm font-semibold text-gray-700">QUICK FILTERS:</span>
      {activeFilters.map((filter) => (
        <button
          key={`${filter.type}-${filter.value}`}
          onClick={() => onRemoveFilter(filter.type, filter.value)}
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
        >
          <span>{filter.label}</span>
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors ml-auto"
      >
        CLEAR ALL
      </button>
    </div>
  );
}
