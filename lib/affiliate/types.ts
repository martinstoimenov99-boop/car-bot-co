export interface AffiliateLead {
  kind: "lead" | "partner";
  type?: "test" | "monthly" | "yearly";
  email: string;
  firstName: string;
  lastName: string;
  /** Partner referral code (from the ?ref= link). */
  ref?: string;
  /** Discount code typed in the signup modal. */
  code?: string;
  locale: string;
  at: string;
}

export interface AffiliateSale {
  email: string;
  ref?: string;
  plan: "monthly" | "yearly";
  /** Amount actually paid, in euro cents. */
  amountCents: number;
  currency: "EUR";
  /** Many tools auto-track Stripe; bank transfers and invoices must be recorded manually or via API. */
  method: "stripe" | "bank_transfer" | "invoice";
  invoiceId?: string;
  at: string;
}

export interface AffiliateProvider {
  readonly name: string;
  trackLead(lead: AffiliateLead): Promise<void>;
  trackSale?(sale: AffiliateSale): Promise<void>;
}
