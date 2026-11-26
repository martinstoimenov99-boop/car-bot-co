import "server-only";
import type { AffiliateProvider } from "./types";
import {
  dubProvider,
  firstPromoterProvider,
  noneProvider,
  rewardfulProvider,
  toltProvider,
} from "./providers";

export type { AffiliateLead, AffiliateProvider, AffiliateSale } from "./types";

const PROVIDERS: Record<string, AffiliateProvider> = {
  none: noneProvider,
  dub: dubProvider,
  tolt: toltProvider,
  firstpromoter: firstPromoterProvider,
  rewardful: rewardfulProvider,
};

/** Picked by AFFILIATE_PROVIDER (none | dub | tolt | firstpromoter | rewardful). Defaults to none. */
export function getAffiliateProvider(): AffiliateProvider {
  const key = (process.env.AFFILIATE_PROVIDER || "none").toLowerCase();
  return PROVIDERS[key] ?? noneProvider;
}
