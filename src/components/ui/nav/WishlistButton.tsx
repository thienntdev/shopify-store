/** @format */

import Link from "next/link";

export default function WishlistButton() {
  return (
    <Link
      href="/wishlist"
      className="flex items-center gap-2 px-0 py-0 md:px-2 md:py-2 text-gray-700 rounded-lg hover:bg-orange-500 hover:text-white transition-colors"
    >
      <svg
        className="w-6 h-6 md:w-5 md:h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="hidden md:inline text-sm font-medium">Wishlist</span>
    </Link>
  );
}
