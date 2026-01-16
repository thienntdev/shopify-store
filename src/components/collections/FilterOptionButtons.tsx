/** @format */

"use client";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterOptionButtonsProps {
  options: FilterOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}

export default function FilterOptionButtons({
  options,
  selectedValues,
  onToggle,
}: FilterOptionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onToggle(option.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              isSelected
                ? "bg-red-500 text-white border-2 border-red-500"
                : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-300"
            }`}
          >
            {option.label}
            {option.count !== undefined && (
              <span className="ml-1 text-xs opacity-80">
                ({option.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
