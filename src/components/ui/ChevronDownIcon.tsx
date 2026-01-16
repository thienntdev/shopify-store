/** @format */

"use client";

interface ChevronDownIconProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  isOpen?: boolean;
}

const sizeClasses = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export default function ChevronDownIcon({
  className = "",
  size = "md",
  isOpen = false,
}: ChevronDownIconProps) {
  return (
    <svg
      className={`${sizeClasses[size]} transition-transform ${
        isOpen ? "rotate-180" : ""
      } ${className}`}
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
  );
}
