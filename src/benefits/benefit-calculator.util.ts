export type DiscountType = 'PERCENT' | 'FLAT';

export function calcDiscount(
  amount: number,
  type: DiscountType,
  value: number,
  max?: number,
): number {
  let saved = 0;
  if (type === 'PERCENT') {
    saved = (amount * value) / 100;
  } else {
    saved = value;
  }
  if (max != null) saved = Math.min(saved, max);
  return Math.max(0, Math.floor(saved));
}

export function isActiveNow(start?: Date | null, end?: Date | null): boolean {
  const now = new Date();
  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
}

export function matchMerchant(
  merchant: string,
  filter?: string | null,
): boolean {
  if (!filter) return true;
  return merchant.toLowerCase().includes(filter.toLowerCase());
}
