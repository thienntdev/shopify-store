/** @format */
import { useState } from "react";
import Link from "next/link";

export default function NavigationMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState<string | null>(null);
  const navigationItems = [
    { name: "Valentine", href: "/valentine", color: "text-orange-500" },
    { name: "Pet Lovers", href: "/pet-lovers", color: "text-blue-500" },
    { name: "Occasions", href: "/occasions", hasDropdown: true },
    { name: "Recipients", href: "/recipients", hasDropdown: true },
    { name: "Decorations", href: "/decorations", hasDropdown: true },
    { name: "Apparel", href: "/apparel", hasDropdown: true },
    { name: "Accessories", href: "/accessories", hasDropdown: true },
    { name: "Drinkware", href: "/drinkware", hasDropdown: true },
    { name: "Reviews", href: "/reviews" },
  ];
  return (
    <>
      {/* Navigation Menu */}
      <nav className="mt-4 border-t border-gray-200">
        <ul className="flex items-center gap-6 py-3">
          {navigationItems.map((item) => (
            <li
              key={item.name}
              className="relative"
              onMouseEnter={() => item.hasDropdown && setIsMenuOpen(item.name)}
              onMouseLeave={() => setIsMenuOpen(null)}
            >
              <Link
                href={item.href}
                className={`text-sm font-medium hover:text-orange-500 transition-colors ${
                  item.color || "text-gray-700"
                }`}
              >
                {item.name}
                {item.hasDropdown && (
                  <svg
                    className="inline-block w-4 h-4 ml-1"
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
                )}
              </Link>

              {/* Dropdown Menu - Example for Decorations */}
              {item.hasDropdown && isMenuOpen === item.name && (
                <div className="absolute top-full left-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg p-6 grid grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900">
                      Ornament
                    </h3>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>
                        <Link
                          href="/decorations/ornaments/all"
                          className="hover:text-orange-500"
                        >
                          All Ornaments 🔥
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/decorations/ornaments/family"
                          className="hover:text-orange-500"
                        >
                          Family Ornament
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/decorations/ornaments/couple"
                          className="hover:text-orange-500"
                        >
                          Couple Ornament
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/decorations/ornaments/pet-lover"
                          className="hover:text-orange-500"
                        >
                          Pet Lover Ornament
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900">
                      Light & Candle
                    </h3>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>
                        <Link
                          href="/decorations/lights/bottle-lamp"
                          className="hover:text-orange-500"
                        >
                          Bottle Lamp
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/decorations/lights/led-light"
                          className="hover:text-orange-500"
                        >
                          3D LED Light
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/decorations/lights/jar-light"
                          className="hover:text-orange-500"
                        >
                          Jar Light
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900">
                      Wall Art
                    </h3>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>
                        <Link
                          href="/decorations/wall-art/poster"
                          className="hover:text-orange-500"
                        >
                          Poster
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/decorations/wall-art/canvas"
                          className="hover:text-orange-500"
                        >
                          Canvas
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
