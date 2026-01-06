/** @format */

"use client";

interface SearchIconProps {
  onClick: () => void;
}

export default function SearchIcon({ onClick }: SearchIconProps) {
  return (
    <button onClick={onClick} className="cursor-pointer">
      <svg
        className="w-6 h-6 text-gray-700"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </button>
  );
}
