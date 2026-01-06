/** @format */

"use client";

import { useState } from "react";
import Link from "next/link";

interface FooterSectionProps {
  title: string;
  links: { label: string; href: string }[];
  isMobile?: boolean;
  noBorder?: boolean;
}

export default function FooterSection({
  title,
  links,
  isMobile = false,
  noBorder = false,
}: FooterSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (isMobile) {
    return (
      <div className={noBorder ? "" : "border-b border-slate-800"}>
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
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="block text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold mb-4 text-white uppercase">{title}</h3>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              href={link.href}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
