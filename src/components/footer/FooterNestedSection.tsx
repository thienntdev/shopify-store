/** @format */

"use client";

import { useState } from "react";
import Link from "next/link";

interface FooterNestedSectionProps {
  title: string;
  collections: { label: string; href: string }[];
  isMobile?: boolean;
  noBorder?: boolean;
}

export default function FooterNestedSection({
  title,
  collections,
  isMobile = false,
  noBorder = false,
}: FooterNestedSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="border-b border-slate-800">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between py-4 text-white font-semibold"
        >
          <span>{title}</span>
          <svg
            className={`w-5 h-5 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
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
        </button>
        {isOpen && (
          <div className="pb-4 space-y-2 pl-2">
            {collections.map((collection, index) => (
              <Link
                key={index}
                href={collection.href}
                className="block text-gray-400 hover:text-white transition-colors"
              >
                {collection.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Desktop: Collapsible
  return (
    <div className={noBorder ? "" : "border-b border-slate-800"}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-4 cursor-pointer"
      >
        <h3 className="font-semibold text-white uppercase">{title}</h3>
        <svg
          className={`w-5 h-5 text-white transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
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
      </button>
      {isOpen && (
        <ul className="space-y-2 pl-2">
          {collections.map((collection, index) => (
            <li key={index}>
              <Link
                href={collection.href}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {collection.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
