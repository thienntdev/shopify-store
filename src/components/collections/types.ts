/** @format */

/**
 * Filter option type
 */
export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

/**
 * Active filter type
 */
export interface ActiveFilter {
  label: string;
  value: string;
  type: string;
}
