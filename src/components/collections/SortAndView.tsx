/** @format */

"use client";

export type SortOption =
  | "FEATURED"
  | "BEST_SELLING"
  | "TITLE_ASC"
  | "TITLE_DESC"
  | "PRICE_ASC"
  | "PRICE_DESC"
  | "CREATED_AT_ASC"
  | "CREATED_AT_DESC";

export type ViewMode = "grid" | "list";

interface SortAndViewProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "FEATURED", label: "Featured" },
  { value: "BEST_SELLING", label: "Best selling" },
  { value: "TITLE_ASC", label: "Alphabetically, A-Z" },
  { value: "TITLE_DESC", label: "Alphabetically, Z-A" },
  { value: "PRICE_ASC", label: "Price, low to high" },
  { value: "PRICE_DESC", label: "Price, high to low" },
  { value: "CREATED_AT_ASC", label: "Date, old to new" },
  { value: "CREATED_AT_DESC", label: "Date, new to old" },
];

export default function SortAndView({
  sortBy,
  onSortChange,
}: SortAndViewProps) {
  return (
    <div className="flex items-center justify-end gap-4 mb-6 flex-wrap">
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
