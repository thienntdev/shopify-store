/** @format */

"use client";

export type SortOption = 
  | "BEST_SELLING"
  | "TITLE"
  | "PRICE"
  | "CREATED_AT"
  | "RELEVANCE";

export type ViewMode = "grid" | "list";

interface SortAndViewProps {
  sortBy: SortOption;
  viewMode: ViewMode;
  onSortChange: (sort: SortOption) => void;
  onViewChange: (view: ViewMode) => void;
}

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "BEST_SELLING", label: "Best Selling" },
  { value: "TITLE", label: "Title" },
  { value: "PRICE", label: "Price" },
  { value: "CREATED_AT", label: "Newest" },
  { value: "RELEVANCE", label: "Relevance" },
];

export default function SortAndView({
  sortBy,
  viewMode,
  onSortChange,
  onViewChange,
}: SortAndViewProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-700">VIEW:</span>
        <button
          onClick={() => onViewChange("grid")}
          className={`p-2 rounded transition-colors ${
            viewMode === "grid"
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          aria-label="Grid view"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
        <button
          onClick={() => onViewChange("list")}
          className={`p-2 rounded transition-colors ${
            viewMode === "list"
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          aria-label="List view"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-700">SORT:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white cursor-pointer"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
