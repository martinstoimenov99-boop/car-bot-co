import { SITE_URL, WA_DISPLAY } from "./site";

export function organizationJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Car Bot",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description,
    address: { "@type": "PostalAddress", addressLocality: "Skopje", addressCountry: "MK" },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: WA_DISPLAY.replace(/\s/g, ""),
      contactType: "customer support",
      availableLanguage: ["English", "Macedonian"],
    },
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

/** Safe for inline <script type="application/ld+json">. */
export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
