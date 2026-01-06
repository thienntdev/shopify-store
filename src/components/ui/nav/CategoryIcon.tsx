/** @format */

import Link from "next/link";
import Image from "next/image";

interface CategoryIconProps {
  name: string;
  href: string;
  image: string;
  hoverColor?: string; // Optional hover background color
}

export default function CategoryIcon({
  name,
  href,
  image,
  hoverColor = "orange",
}: CategoryIconProps) {
  const hoverColors: Record<string, string> = {
    orange: "group-hover:bg-orange-50",
    red: "group-hover:bg-red-50",
    blue: "group-hover:bg-blue-50",
    pink: "group-hover:bg-pink-50",
    purple: "group-hover:bg-purple-50",
  };

  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 hover:opacity-70 transition-opacity group"
    >
      <div
        className={`w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden transition-colors ${hoverColors[hoverColor]}`}
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            width={128}
            height={128}
            className="w-full h-full object-cover rounded-full"
            unoptimized={image.includes("cdn.shopify.com")}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
        )}
      </div>
      <span className="text-lg xl:text-xl  font-medium text-gray-700">
        {name}
      </span>
    </Link>
  );
}
