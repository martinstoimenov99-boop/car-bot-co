import type { AffiliateLead, AffiliateProvider, AffiliateSale } from "./types";

/** Default: attribution lives in the ref code sent with the form, the lead email, the audience contact and the webhook. */
export const noneProvider: AffiliateProvider = {
  name: "none",
  async trackLead() {},
};

function stub(name: string, docs: string, env: string[]): AffiliateProvider {
  const missing = () => env.filter((k) => !process.env[k]);
  return {
    name,
    async trackLead(lead: AffiliateLead) {
      // TODO(affiliate): implement once the vendor is chosen. See README → "Affiliate provider". Docs: ${docs}
      if (missing().length) console.warn(`[affiliate:${name}] missing env: ${missing().join(", ")}`);
      console.info(`[affiliate:${name}] trackLead not implemented yet`, { ref: lead.ref, kind: lead.kind });
    },
    async trackSale(sale: AffiliateSale) {
      // TODO(affiliate): record manual sales (bank transfer / invoice) through the vendor's API.
      console.info(`[affiliate:${name}] trackSale not implemented yet`, {
        ref: sale.ref,
        method: sale.method,
      });
    },
  };
}

// Dub Partners: track leads with POST https://api.dub.co/track/lead (needs the dub_id click cookie from
// their client script) and sales with POST /track/sale. Works for non-Stripe payments via the API.
export const dubProvider = stub("dub", "https://dub.co/docs/api-reference/endpoint/track-lead", [
  "DUB_API_KEY",
]);

// Tolt: Stripe-first; non-Stripe conversions via POST https://api.tolt.com/v1/customers + /transactions.
export const toltProvider = stub("tolt", "https://help.tolt.com/en/articles/api", ["TOLT_API_KEY"]);

// FirstPromoter: POST https://firstpromoter.com/api/v1/track/signup and /track/sale (manual sales supported).
export const firstPromoterProvider = stub("firstpromoter", "https://docs.firstpromoter.com/", [
  "FIRSTPROMOTER_API_KEY",
  "FIRSTPROMOTER_ACCOUNT_ID",
]);

// Rewardful: Stripe-native; manual commissions only via dashboard/API workarounds.
export const rewardfulProvider = stub("rewardful", "https://developers.rewardful.com/", [
  "REWARDFUL_API_SECRET",
]);
