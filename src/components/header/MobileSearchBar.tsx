/** @format */

"use client";

import { useState, useEffect, useRef } from "react";
import SearchBarClient from "./SearchBarClient";
import SearchIcon from "../ui/nav/SearchIcon";

export default function MobileSearchBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    headerRef.current = document.querySelector("header");
  }, []);

  // Dispatch custom event when search bar opens/closes
  useEffect(() => {
    const event = new CustomEvent("searchBarToggle", {
      detail: { isOpen: isSearchOpen },
    });
    document.dispatchEvent(event);
  }, [isSearchOpen]);

  // Close search bar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSearchOpen &&
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("button")
      ) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isSearchOpen]);

  return (
    <>
      <SearchIcon
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        isOpen={isSearchOpen}
      />
      {isSearchOpen && (
        <div
          ref={searchBarRef}
          data-mobile-search-bar="true"
          className="absolute left-0 right-0 top-full bg-white z-50 p-4"
        >
          <SearchBarClient />
        </div>
      )}
    </>
  );
}
