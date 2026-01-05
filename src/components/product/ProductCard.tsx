/** @format */

// src/components/ProductCard.tsx
/** @format */

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/libs/shopify/types";
import { formatMoney } from "@/utils/money";

interface ProductCardProps {
  product: Product;
  showBadge?: boolean; // Prop để control hiển thị badge
  badgeText?: string; // Custom badge text
}

// Helper function để extract product ID
function extractProductId(gid: string): string {
  return gid.replace("gid://shopify/Product/", "");
}

export default function ProductCard({
  product,
  showBadge = true, // Mặc định hiển thị badge nếu có
  badgeText, // Custom badge text (optional)
}: ProductCardProps) {
  // Extract values từ product
  const productId = extractProductId(product.id);
  const minPrice = parseFloat(
    product.priceRange?.minVariantPrice?.amount || "0"
  );
  const maxPrice = parseFloat(
    product.priceRange?.maxVariantPrice?.amount || "0"
  );
  const currencyCode =
    product.priceRange?.minVariantPrice?.currencyCode || "USD";

  // Tính toán giá và discount
  const price = minPrice;
  const originalPrice = maxPrice > minPrice ? maxPrice : undefined;
  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // Lấy image
  const image = product.featuredImage?.url || product.images?.[0]?.url || "";
  const imageAlt = product.featuredImage?.altText || product.title;

  // Badge logic: ưu tiên badgeText, sau đó check tags, sau đó check discount
  const shouldShowBadge =
    showBadge &&
    (badgeText ||
      product.tags?.includes("new") ||
      product.tags?.includes("sale"));
  const badge =
    badgeText ||
    (product.tags?.includes("new")
      ? "New"
      : product.tags?.includes("sale")
      ? "Sale"
      : undefined);

  // Rating và reviewCount (Shopify không có, có thể lấy từ reviews app hoặc hardcode)
  const rating = 4.5; // TODO: Lấy từ reviews app
  const reviewCount = 0; // TODO: Lấy từ reviews app

  return (
    <Link href={`/products/${product.handle || productId}`} className="group">
      <div className="relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
        {/* Badge */}
        {shouldShowBadge && badge && (
          <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {badge}
          </div>
        )}

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 z-10 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discountPercentage}% OFF
          </div>
        )}

        {/* Product Image */}
        <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors min-h-10">
            {product.title}
          </h3>

          {/* Rating - Chỉ hiển thị nếu có reviewCount > 0 */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-600">
                {rating.toFixed(1)} ({reviewCount})
              </span>
            </div>
          )}

          {/* Price với currency formatting */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatMoney(price.toString(), currencyCode)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-500 line-through">
                {formatMoney(originalPrice.toString(), currencyCode)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
