/**
 * Format a number into Pakistani Rupee (PKR) luxury representation
 * Example: 9950000 -> "₨ 9,950,000"
 */
export function formatPKR(amount: number): string {
  const rounded = Math.round(amount);
  return '₨ ' + rounded.toLocaleString('en-PK');
}

/**
 * Calculate discount percentage
 */
export function getDiscountPercentage(original: number, discounted: number): number {
  if (original <= discounted || original === 0) return 0;
  return Math.round(((original - discounted) / original) * 100);
}
