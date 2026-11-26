/** Pricing and commission maths. Keep in sync with the pricing copy in messages/*.json. */
export const PRICES = {
  setup: 500,
  monthly: 250,
  yearly: 3000,
  /** First year on the monthly route: setup + 12 months. */
  monthlyFirstYear: 500 + 250 * 12,
} as const;

export const COMMISSION = {
  setupShare: 150, // 30% of €500
  monthlyShare: 50, // 20% of €250, up to 12 months
  monthsPaid: 12,
  loyaltyBonus: 50, // dealership still paying at month 6
  loyaltyMonth: 6,
  yearlyFlat: 800,
} as const;

export type Plan = "yearly" | "monthly";

export interface RoiInput {
  extra: number; // extra cars won per month (0–6)
  margin: number; // profit per car in EUR (1000–2500)
  plan: Plan;
}

export function roi({ extra, margin, plan }: RoiInput) {
  const gain = extra * margin * 12;
  const cost = plan === "yearly" ? PRICES.yearly : PRICES.monthlyFirstYear;
  const net = gain - cost;
  const max = Math.max(gain, cost, 1);
  const cars = Math.ceil(cost / margin);
  const monthsCovered = Math.floor(margin / PRICES.monthly);
  return {
    gain,
    cost,
    net,
    cars,
    monthsCovered,
    gainBar: (gain / max) * 100,
    costBar: (cost / max) * 100,
  };
}

/**
 * Partner earnings over a 12-month window when signing `clients` dealerships every month.
 * A dealership signed in month m pays (13 − m) monthly commissions inside the window, and the
 * loyalty bonus if it reaches month 6 inside the window.
 */
export function partnerEarnings(clients: number) {
  let perCohort = 0;
  for (let m = 1; m <= 12; m++) {
    const paid = 13 - m;
    perCohort +=
      COMMISSION.setupShare +
      COMMISSION.monthlyShare * paid +
      (paid >= COMMISSION.loyaltyMonth ? COMMISSION.loyaltyBonus : 0);
  }
  return {
    perCohort, // 6050 for one dealership per month
    yearTotal: perCohort * clients,
    totalClients: clients * 12,
    monthlyAt12: clients * 12 * COMMISSION.monthlyShare,
    perDealershipYearOne:
      COMMISSION.setupShare + COMMISSION.monthlyShare * COMMISSION.monthsPaid + COMMISSION.loyaltyBonus, // 800
  };
}
