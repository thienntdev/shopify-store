/** @format */

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  searchProducts,
  searchProductsCount,
  searchCollections,
} from "../actions";
import { Product } from "@/libs/shopify/types";
import ProductCard from "../product/ProductCard";

interface SearchBarClientProps {
  className?: string;
}

// Popular suggestions - có thể lấy từ API hoặc hardcode
const POPULAR_SUGGESTIONS = [
  "christmas ornament",
  "glass ornament",
  "personalized glass ornament",
  "ornament",
  "dog memorial",
];

export default function SearchBarClient({
  className = "",
}: SearchBarClientProps) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [collections, setCollections] = useState<
    Array<{ handle: string; title: string }>
  >([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Filter suggestions based on query
  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = POPULAR_SUGGESTIONS.filter((suggestion) =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(POPULAR_SUGGESTIONS);
    }
  }, [query]);

  // Search products and collections when query changes
  useEffect(() => {
    const searchAsync = async () => {
      if (query.trim().length > 0) {
        setIsLoading(true);
        try {
          // Lấy tối đa 6 products để hiển thị (mobile: 2 hàng x 3, desktop: 3 hàng x 2)
          const results = await searchProducts(query, 6);
          setProducts(results);

          // Lấy tổng số lượng products
          const totalCount = await searchProductsCount(query);
          setTotalProductsCount(totalCount);

          // Lấy collections phù hợp
          const collectionsResult = await searchCollections(query);
          setCollections(collectionsResult);
        } catch (error) {
          console.error("Error searching:", error);
          setProducts([]);
          setTotalProductsCount(0);
          setCollections([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setProducts([]);
        setTotalProductsCount(0);
        setCollections([]);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchAsync();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowDropdown(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowDropdown(false);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  const handleCollectionClick = (handle: string) => {
    setShowDropdown(false);
    router.push(`/collections/${handle}`);
  };

  const handleSearch = () => {
    if (query.trim().length > 0) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={`flex-1 max-w-3xl mx-4 relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="What are you looking for?"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className="w-full text-lg px-5 py-3 pr-12 bg-white border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-0 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-300 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
        />
        <button
          onClick={handleSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-orange-50 rounded-lg transition-all duration-200 cursor-pointer group"
        >
          <svg
            className="w-5 h-5 text-orange-500 group-hover:text-orange-600 transition-colors"
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
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-[700px] md:min-w-[700px] overflow-hidden flex flex-col"
        >
          {/* Content - 2 columns layout on desktop, single column on mobile */}
          <div className="flex flex-col md:flex-row overflow-y-auto flex-1 max-h-[70vh]">
            {/* Left: Popular suggestions and Categories */}
            <div className="w-full md:w-1/3 bg-white flex flex-col border-b md:border-b-0 md:border-r border-gray-200">
              <div className="p-4 flex-1">
                {/* Popular suggestions */}
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300">
                    POPULAR SUGGESTIONS
                  </h3>
                  {filteredSuggestions.length > 0 ? (
                    <ul className="space-y-1">
                      {filteredSuggestions.map((suggestion, index) => (
                        <li key={index}>
                          <button
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors group"
                          >
                            <svg
                              className="w-4 h-4 text-gray-600 group-hover:text-orange-500 transition-colors shrink-0"
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
                            <span className="text-sm text-gray-900 group-hover:text-orange-500 transition-colors truncate">
                              {suggestion}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No suggestions found
                    </p>
                  )}
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300">
                    CATEGORIES
                  </h3>
                  {collections.length > 0 ? (
                    <ul className="space-y-1">
                      {collections.map((collection, index) => (
                        <li key={index}>
                          <button
                            onClick={() =>
                              handleCollectionClick(collection.handle)
                            }
                            className="w-full px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors group"
                          >
                            <span className="text-sm text-gray-900 group-hover:text-orange-500 transition-colors">
                              {collection.title}
                            </span>
                          </button>
                        </li>
                      ))}
                      {collections.length > 3 && (
                        <li>
                          <button
                            onClick={() => handleSearch()}
                            className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors group"
                          >
                            <span className="text-sm text-gray-900 group-hover:text-orange-500 transition-colors">
                              More
                            </span>
                            <svg
                              className="w-4 h-4 text-gray-600 group-hover:text-orange-500 transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </li>
                      )}
                    </ul>
                  ) : query.trim().length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      Start typing to see categories
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm">No categories found</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Products */}
            <div className="flex-1 bg-white">
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300">
                  PRODUCTS
                </h3>
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Searching products...</p>
                  </div>
                ) : query.trim().length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Start typing for search results
                  </p>
                ) : products.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {products.slice(0, 6).map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          variant="compact"
                          showDescription={true}
                          titleLines={1}
                          showBadge={false}
                        />
                      ))}
                    </div>
                    {totalProductsCount > products.length && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={handleSearch}
                          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <span>VIEW ALL {totalProductsCount} ITEMS</span>
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
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <p className="text-gray-500 text-sm mb-3">
                      Sorry, nothing found for <strong>{query}</strong>.
                    </p>
                    <p className="text-gray-500 text-sm mb-3">
                      Check out some of these popular searches:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SUGGESTIONS.slice(0, 5).map(
                        (suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                          >
                            {suggestion}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
