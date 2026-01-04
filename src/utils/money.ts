/** @format */

/**
 * Format money
 * @param amount - Amount to format
 * @param currencyCode - Currency code
 * @returns Formatted money
 */
export function formatMoney(amount: string, currencyCode: string): string {
    const numAmount = parseFloat(amount);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(numAmount);
}