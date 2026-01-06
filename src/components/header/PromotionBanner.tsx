/** @format */
"use client";

import { useState } from "react";

export default function PromotionBanner() {
  const [showPromo, setShowPromo] = useState(true);
  return showPromo ? (
    <div className="bg-amber-50 text-center py-2 px-4 relative">
      {/* <button
        onClick={() => setShowPromo(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-red-600 hover:text-red-800 transition-colors cursor-pointer"
        aria-label="Close promotion banner"
      >
        <svg
          className="w-5 h-5"
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
      </button> */}
      <p className="text-sm text-red-600">
        ❤️ Everything On Sale - Up to 50% ❤️
        <br />
        <span>
          Extra 10% off order 2+ with code:{" "}
          <span className="font-bold cursor-pointer hover:text-orange-800 transition-colors">
            PH2
          </span>
          <button
            onClick={() => navigator.clipboard.writeText("PH2")}
            className="ml-1 p-1 rounded hover:bg-gray-200 transition-colors cursor-pointer"
            title="Copy code"
          >
            {/* SVG icon copy */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </span>
      </p>
    </div>
  ) : null;
}
