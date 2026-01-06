/** @format */

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  NavigationItem,
  DropdownSection,
  navigationItems,
} from "@/data/navigation";

interface MobileNavigationTreeProps {
  onLinkClick?: () => void;
}

type MenuLevel = "main" | "sections" | "links";

export default function MobileNavigationTree({
  onLinkClick,
}: MobileNavigationTreeProps) {
  const [currentLevel, setCurrentLevel] = useState<MenuLevel>("main");
  const [selectedItem, setSelectedItem] = useState<NavigationItem | null>(null);
  const [selectedSection, setSelectedSection] =
    useState<DropdownSection | null>(null);

  const handleItemClick = (item: NavigationItem) => {
    if (item.hasDropdown && item.dropdownContent) {
      setSelectedItem(item);
      setCurrentLevel("sections");
    } else {
      onLinkClick?.();
    }
  };

  const handleSectionClick = (section: DropdownSection) => {
    setSelectedSection(section);
    setCurrentLevel("links");
  };

  const handleBackToMain = () => {
    setCurrentLevel("main");
    setSelectedItem(null);
    setSelectedSection(null);
  };

  const handleBackToSections = () => {
    setCurrentLevel("sections");
    setSelectedSection(null);
  };

  // Render main menu
  if (currentLevel === "main") {
    return (
      <nav>
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => handleItemClick(item)}
                className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-orange-500 rounded-lg transition-colors text-left"
              >
                <span className="font-medium">{item.name}</span>
                {item.hasDropdown && (
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
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  // Render sections level (Level 2)
  if (currentLevel === "sections" && selectedItem) {
    return (
      <div>
        {/* Back button */}
        <button
          onClick={handleBackToMain}
          className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-orange-500 transition-colors mb-2"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back to Menu</span>
        </button>

        {/* Title */}
        <h2 className="px-4 py-2 text-xl font-bold text-gray-900 mb-2">
          {selectedItem.name}
        </h2>

        {/* Sections list */}
        <nav>
          <ul className="space-y-1">
            {selectedItem.dropdownContent?.map((section, index) => (
              <li key={index}>
                <button
                  onClick={() => handleSectionClick(section)}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-orange-500 rounded-lg transition-colors text-left"
                >
                  <span className="font-medium">{section.title}</span>
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
              </li>
            ))}
          </ul>
        </nav>
      </div>
    );
  }

  // Render links level (Level 3)
  if (currentLevel === "links" && selectedSection && selectedItem) {
    return (
      <div>
        {/* Back button */}
        <button
          onClick={handleBackToSections}
          className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-orange-500 transition-colors mb-2"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back to {selectedItem.name}</span>
        </button>

        {/* Title and See All */}
        <div className="flex items-center justify-between px-4 py-2 mb-2">
          <h2 className="text-xl font-bold text-gray-900">
            {selectedSection.title}
          </h2>
          {selectedSection.href && (
            <Link
              href={selectedSection.href}
              onClick={onLinkClick}
              className="text-orange-500 hover:text-orange-600 font-medium text-sm"
            >
              See All
            </Link>
          )}
        </div>

        {/* Links list */}
        <nav>
          <ul className="space-y-1">
            {selectedSection.links.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.href}
                  onClick={onLinkClick}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-orange-500 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-orange-500">{link.badge}</span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    );
  }

  return null;
}
