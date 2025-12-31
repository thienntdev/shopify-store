/** @format */

import Link from "next/link";
import Image from "next/image";

export interface ShopByItem {
  name: string;
  href: string;
  image: string;
}

interface ShopByGridProps {
  title: string;
  items: ShopByItem[];
  shape?: "circle" | "square";
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  imageClassName?: string;
  containerClassName?: string;
}

export default function ShopByGrid({
  title,
  items,
  shape = "circle",
  columns = { mobile: 2, tablet: 4, desktop: 4 },
  imageClassName = "",
  containerClassName = "",
}: ShopByGridProps) {
  // Map columns to Tailwind grid classes
  const gridColsMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  };

  const smColsMap: Record<number, string> = {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
    5: "sm:grid-cols-5",
    6: "sm:grid-cols-6",
  };

  const lgColsMap: Record<number, string> = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
  };

  const mobileCols = gridColsMap[columns.mobile || 2] || "grid-cols-2";
  const tabletCols = smColsMap[columns.tablet || 4] || "sm:grid-cols-4";
  const desktopCols = lgColsMap[columns.desktop || 4] || "lg:grid-cols-4";

  const imageShapeClass = shape === "circle" ? "rounded-full" : "rounded-lg";

  return (
    <section className={`py-12 bg-white ${containerClassName}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-orange-500 mb-8 text-center">
          {title}
        </h2>
        <div
          className={`grid ${mobileCols} ${tabletCols} ${desktopCols} gap-6`}
        >
          {items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center gap-3 hover:opacity-70 transition-opacity group"
            >
              <div
                className={`relative ${
                  shape === "circle" ? "w-32 h-32" : "w-full aspect-square"
                } ${imageShapeClass} overflow-hidden bg-gray-100 flex items-center justify-center group-hover:bg-gray-50 transition-colors`}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className={`object-cover ${imageShapeClass} ${imageClassName}`}
                  sizes={
                    shape === "circle"
                      ? "256px"
                      : "(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  }
                />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
