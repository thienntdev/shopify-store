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
  variant?: "default" | "compact" | "list"; // Variant cho search bar và list view
  showDescription?: boolean; // Hiển thị description snippet
  titleLines?: number; // Số dòng cho title (1 hoặc 2)
  showWishlist?: boolean; // Hiển thị wishlist icon (chỉ ở collection và product page)
}

// Helper function để extract product ID
function extractProductId(gid: string): string {
  return gid.replace("gid://shopify/Product/", "");
}

export default function ProductCard({
  product,
  showBadge = true, // Mặc định hiển thị badge nếu có
  badgeText, // Custom badge text (optional)
  variant = "default", // Default variant
  showDescription = false, // Mặc định không hiển thị description
  titleLines = 2, // Mặc định 2 dòng
  showWishlist = false, // Mặc định không hiển thị wishlist icon
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
  const reviewCount = 128; // TODO: Lấy từ reviews app - tạm thời set để test

  // Variant styling
  const isCompact = variant === "compact";
  const isList = variant === "list";

  const titleClass = isCompact
    ? `text-sm font-medium text-gray-900 ${
        titleLines === 1 ? "line-clamp-1" : "line-clamp-2"
      } mb-1`
    : isList
    ? "text-sm font-semibold text-gray-900 mb-0.5 line-clamp-3 leading-tight"
    : "text-lg font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors h-12";

  const containerClass = isCompact
    ? "text-left hover:opacity-80 transition-opacity group"
    : isList
    ? "relative bg-white border-b border-gray-100 overflow-hidden flex flex-row items-start gap-3 px-3 py-2.5 min-h-[112px] active:bg-gray-50 transition-colors"
    : "relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col h-full";

  const imageClass = isCompact
    ? "relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2"
    : isList
    ? "relative w-28 h-28 sm:w-32 sm:h-32 bg-gray-100 rounded-md overflow-hidden shrink-0"
    : "relative w-full aspect-square bg-gray-100 overflow-hidden";

  const contentClass = isCompact
    ? ""
    : isList
    ? "flex flex-col flex-1 justify-between min-w-0 py-1"
    : "p-4 flex flex-col flex-1";

  // Description snippet
  const descriptionSnippet =
    showDescription && product.description
      ? product.description.replace(/<[^>]*>/g, "").substring(0, 60) + "..."
      : null;

  // Full description for list view - mobile optimized: max 2 lines with ellipsis
  const fullDescription =
    isList && product.description
      ? product.description.replace(/<[^>]*>/g, "").trim()
      : null;

  const productUrl = `/products/${product.handle || productId}`;

  const content = (
    <div className={containerClass}>
      {/* Badge - chỉ hiển thị khi không phải compact và không phải list view (để tránh che lấp) */}
      {!isCompact && !isList && shouldShowBadge && badge && (
        <div className="absolute top-2 left-2 z-10 text-white text-xs font-bold px-2 py-1 rounded bg-red-500">
          {badge}
        </div>
      )}

      {/* Discount Badge - chỉ hiển thị khi không phải compact và không phải list view */}
      {!isCompact && !isList && discountPercentage > 0 && (
        <div className="absolute top-2 right-2 z-10 text-white text-xs font-bold px-2 py-1 rounded bg-orange-500">
          {`${discountPercentage}% OFF`}
        </div>
      )}

      {/* Product Image */}
      <div className={imageClass}>
        {image ? (
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes={
              isCompact
                ? "(max-width: 768px) 33vw, 33vw"
                : isList
                ? "128px"
                : "(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
            }
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}

        {/* Wishlist Icon - chỉ hiển thị trong ảnh khi KHÔNG phải list view */}
        {showWishlist && !isList && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // TODO: Handle wishlist
            }}
            className="absolute top-2 right-2 z-20 p-2 bg-white/80 hover:bg-white rounded-full transition-colors backdrop-blur-sm"
            aria-label="Add to wishlist"
          >
            <svg
              className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className={contentClass}>
        {/* Top section: Title + Rating */}
        <div className="flex-1 min-w-0">
          {/* Title với wishlist icon bên phải trong list view */}
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <h3 className={titleClass}>{product.title}</h3>
            {/* Wishlist Icon - Bên phải cùng hàng với title trong list view */}
            {showWishlist && isList && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // TODO: Handle wishlist
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors shrink-0 mt-0.5"
                aria-label="Add to wishlist"
              >
                <svg
                  className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Rating - Compact for mobile list view */}
          {!isCompact && isList && (
            <div className="flex items-center gap-1 mb-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(rating)
                        ? "text-yellow-400"
                        : i < rating
                        ? "text-yellow-400 opacity-50"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500">({reviewCount})</span>
            </div>
          )}

          {/* Rating - Default view */}
          {!isCompact && !isList && (
            <div className="flex items-center gap-1 mb-3">
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
                ({reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Description - Mobile list view: max 2 lines with ellipsis */}
          {isList && fullDescription && (
            <p className="text-xs text-gray-600 mb-1.5 leading-snug line-clamp-2">
              {fullDescription}
            </p>
          )}

          {/* Description snippet cho compact variant */}
          {descriptionSnippet && !isList && (
            <p className="text-xs text-gray-600 line-clamp-1 mb-1">
              {descriptionSnippet}
            </p>
          )}
        </div>

        {/* Bottom section: Price + Button */}
        <div
          className={`flex items-center ${
            isList ? "justify-between gap-2" : "gap-2"
          }`}
        >
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span
              className={
                isCompact
                  ? "text-sm font-bold text-orange-500"
                  : isList
                  ? "text-base font-bold text-gray-900"
                  : "text-lg font-bold text-orange-500"
              }
            >
              {formatMoney(price.toString(), currencyCode)}
            </span>
            {!isCompact && originalPrice && originalPrice > price && (
              <span
                className={`${
                  isList ? "text-xs" : "text-sm"
                } text-gray-500 line-through`}
              >
                {formatMoney(originalPrice.toString(), currencyCode)}
              </span>
            )}
          </div>

          {/* Button - Mobile list view: Small icon button */}
          {isList && (
            <Link
              href={productUrl}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center bg-orange-500 text-white px-3 py-1.5 rounded-md font-medium hover:bg-orange-600 active:bg-orange-700 transition-colors text-xs whitespace-nowrap shrink-0 shadow-sm"
            >
              <svg
                className="w-3.5 h-3.5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              ADD
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  // Trong list view, wrap trong Link để toàn bộ row có thể click được
  if (isList) {
    return (
      <Link href={productUrl} className="block group">
        {content}
      </Link>
    );
  }

  return (
    <Link href={productUrl} className="group">
      {content}
    </Link>
  );
}
