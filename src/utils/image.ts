/** @format */

/**
 * Transform Shopify image URL to get smaller size
 * Shopify CDN supports image transformations via URL parameters
 * @param url - Original Shopify image URL
 * @param size - Desired size (width and height in pixels)
 * @returns Transformed URL with size parameters
 */
export function transformShopifyImageUrl(url: string | undefined, size: number = 128): string {
  if (!url) return "";

  // Shopify CDN supports image transformations via URL parameters
  // Format: https://cdn.shopify.com/.../image.jpg?width=128&height=128&crop=center
  if (url.includes("cdn.shopify.com")) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}width=${size}&height=${size}&crop=center`;
  }

  return url;
}

