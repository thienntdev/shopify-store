/** @format */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MobileNavigationTree from "./MobileNavigationTree";

export default function MobileMenuButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [searchBarHeight, setSearchBarHeight] = useState(0);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector("header");
      if (header) {
        setHeaderHeight(header.getBoundingClientRect().bottom);
      }
    };

    const updateSearchBarHeight = () => {
      const searchBar = document.querySelector(
        '[data-mobile-search-bar="true"]'
      ) as HTMLElement;
      if (searchBar) {
        setSearchBarHeight(searchBar.offsetHeight);
      } else {
        setSearchBarHeight(0);
      }
    };

    const handleSearchBarToggle = (event: CustomEvent) => {
      // Small delay to allow DOM to update
      setTimeout(() => {
        updateSearchBarHeight();
      }, 10);
    };

    updateHeaderHeight();
    updateSearchBarHeight();
    window.addEventListener("resize", () => {
      updateHeaderHeight();
      updateSearchBarHeight();
    });
    window.addEventListener("scroll", updateHeaderHeight);
    document.addEventListener(
      "searchBarToggle",
      handleSearchBarToggle as EventListener
    );

    // Also check periodically in case search bar is opened/closed by other means
    const interval = setInterval(updateSearchBarHeight, 100);

    return () => {
      window.removeEventListener("resize", () => {
        updateHeaderHeight();
        updateSearchBarHeight();
      });
      window.removeEventListener("scroll", updateHeaderHeight);
      document.removeEventListener(
        "searchBarToggle",
        handleSearchBarToggle as EventListener
      );
      clearInterval(interval);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setIsOpening(false);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsClosing(false);
    }, 300); // Match transition duration
  };

  const handleOpen = () => {
    setIsMenuOpen(true);
    setIsClosing(false);
    setIsOpening(false);
    // Trigger opening animation after a brief delay
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsOpening(true);
      });
    });
  };

  return (
    <>
      <button
        onClick={() => (isMenuOpen ? handleClose() : handleOpen())}
        className="cursor-pointer"
      >
        {isMenuOpen ? (
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>
      {isMenuOpen && (
        <>
          {/* Menu Panel - Slide from left to right when opening, right to left when closing */}
          <div
            className={`fixed left-0 top-0 bottom-0 w-full bg-white z-[100] shadow-xl overflow-y-auto transition-transform duration-300 ease-in-out ${
              isClosing
                ? "-translate-x-full"
                : isOpening
                ? "translate-x-0"
                : "-translate-x-full"
            }`}
            style={{
              top: `${headerHeight + searchBarHeight}px`,
            }}
          >
            {/* Menu Content */}
            <div className="p-4">
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Link
                  href="/trending"
                  onClick={handleClose}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-3 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>Trending Now</span>
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
                      d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                    />
                  </svg>
                </Link>
                <Link
                  href="/new-arrivals"
                  onClick={handleClose}
                  className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-3 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>New Arrivals</span>
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
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </Link>
                <Link
                  href="/reviews"
                  onClick={handleClose}
                  className="bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-4 py-3 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>Our Reviews</span>
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
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </Link>
                <Link
                  href="/track-order"
                  onClick={handleClose}
                  className="bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-4 py-3 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>Track Order</span>
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </Link>
              </div>

              {/* Navigation Menu Tree */}
              <MobileNavigationTree onLinkClick={handleClose} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
