/** @format */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface CategoryFilterProps {
  categories: { name: string; href: string }[];
  activeCategory?: string;
}

export default function CategoryFilter({
  categories,
  activeCategory,
}: CategoryFilterProps) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-4 flex-wrap justify-center">
      {categories.map((category) => {
        const isActive =
          activeCategory === category.name ||
          pathname === category.href ||
          (activeCategory &&
            category.name.toLowerCase() === activeCategory.toLowerCase());

        return (
          <Link
            key={category.name}
            href={category.href}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              isActive
                ? "bg-orange-500 text-white border-2 border-orange-500"
                : "bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500"
            }`}
          >
            {category.name}
          </Link>
        );
      })}
    </div>
  );
}
