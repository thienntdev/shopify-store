/** @format */

"use client";

import { useState, useEffect, useRef } from "react";
import ToggleButtonGroup from "./ToggleButtonGroup";
import ChevronDownIcon from "../ui/ChevronDownIcon";
import { FilterOption } from "./types";

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  tempSelectedValues: string[];
  onTempChange: (values: string[]) => void;
  onApply: (values: string[]) => void;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export default function FilterDropdown({
  label,
  options,
  selectedValues,
  tempSelectedValues,
  onTempChange,
  onApply,
  isOpen,
  onToggle,
  className = "",
}: FilterDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        onToggle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const isActive = selectedValues.length > 0;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
          isActive
            ? "border-red-500 bg-red-50 text-red-700"
            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
        }`}
      >
        <span className="text-sm font-medium">{label}</span>
        <ChevronDownIcon isOpen={isOpen} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-auto min-w-96 max-w-2xl bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4">
          <ToggleButtonGroup
            options={options}
            selectedValues={tempSelectedValues}
            onToggle={(value) => {
              // Update temporary state only
              onTempChange(
                tempSelectedValues.includes(value)
                  ? tempSelectedValues.filter((v) => v !== value)
                  : [...tempSelectedValues, value]
              );
            }}
          />
          <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={onToggle}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                // Apply all changes
                onApply(tempSelectedValues);
                onToggle();
              }}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer"
            >
              View Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
