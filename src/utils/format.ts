/** @format */

/**
 * Format price number to Vietnamese locale string
 * Uses module-level cache for performance (7.4)
 */
const formatPriceCache = new Map<number, string>();

export function formatPrice(price: number): string {
  if (formatPriceCache.has(price)) {
    return formatPriceCache.get(price)!;
  }
  const formatted = new Intl.NumberFormat("vi-VN").format(price);
  formatPriceCache.set(price, formatted);
  return formatted;
}

/**
 * Format price with currency symbol
 */
export function formatPriceWithCurrency(
  price: number,
  currency: string = "₫"
): string {
  return `${formatPrice(price)}${currency}`;
}
