export function calculateCreditScore(
  avgRating: number,
  completedOrders: number,
  disputeCount: number,
  overdueCount: number
): number {
  const base = 50;
  const ratingBonus = Math.round((avgRating / 5) * 30);
  const orderBonus = Math.min(completedOrders * 2, 20);
  const disputePenalty = disputeCount * 10;
  const overduePenalty = overdueCount * 5;
  return Math.max(0, Math.min(100, base + ratingBonus + orderBonus - disputePenalty - overduePenalty));
}

export function calculateMatchScore(params: {
  pricePerDay: number;
  deposit: number;
  lenderRating: number;
  daysUntilAvailable: number;
  isHillwalkingRecommended: boolean;
  isFree: boolean;
}): number {
  let score = 50;
  if (params.isFree) score += 20;
  if (params.pricePerDay > 0 && params.pricePerDay < 10) score += 10;
  if (params.pricePerDay >= 10 && params.pricePerDay < 30) score += 5;
  if (params.deposit === 0) score += 10;
  if (params.lenderRating >= 4) score += 15;
  else if (params.lenderRating >= 3) score += 5;
  if (params.daysUntilAvailable <= 3) score += 10;
  if (params.isHillwalkingRecommended) score += 15;
  return Math.max(0, Math.min(100, score));
}
