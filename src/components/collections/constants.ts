/** @format */

/**
 * Filter type constants
 */
export const FILTER_TYPES = {
  OCCASION: "occasion",
  RECIPIENT: "recipient",
  PRICE: "price",
} as const;

export type FilterType = (typeof FILTER_TYPES)[keyof typeof FILTER_TYPES];

/**
 * Filter type labels mapping
 */
export const FILTER_TYPE_LABELS: Record<FilterType, string> = {
  [FILTER_TYPES.OCCASION]: "Occasions:",
  [FILTER_TYPES.RECIPIENT]: "Recipients:",
  [FILTER_TYPES.PRICE]: "Price:",
};

/**
 * Get filter type label
 */
export function getFilterTypeLabel(type: string): string {
  return FILTER_TYPE_LABELS[type as FilterType] || `${type}:`;
}
