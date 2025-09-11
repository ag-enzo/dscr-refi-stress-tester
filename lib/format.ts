// lib/format.ts
// Formatting helpers for currency, percent, and rates

/**
 * Format a number as USD currency (e.g., $1,234,567)
 */
export function fmtUSD(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

/**
 * Format a number as percent (e.g., 8.25%)
 * digits: number of decimal places (default 2)
 */
export function fmtPct(value: number | undefined | null, digits = 2): string {
  if (value === undefined || value === null || isNaN(value)) return "—";
  return `${value.toFixed(digits)}%`;
}

/**
 * Format a number as rate percent (e.g., 6.50%)
 * digits: number of decimal places (default 2)
 */
export function fmtRatePct(value: number | undefined | null, digits = 2): string {
  if (value === undefined || value === null || isNaN(value)) return "—";
  return `${value.toFixed(digits)}%`;
}
