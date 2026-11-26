"use client";

import { useEffect } from "react";
import { REF_PENDING_KEY, refFromSearchParams } from "@/lib/ref";
import { CONSENT_EVENT, getConsent, persistRef, rememberPendingRef } from "@/lib/ref-client";

/** Captures ?ref= / ?partner= in the browser. Persists only after cookie consent. */
export function RefCapture() {
  useEffect(() => {
    const incoming = refFromSearchParams(new URLSearchParams(window.location.search));
    if (incoming) rememberPendingRef(incoming);
    if (getConsent() === "accepted" && incoming) persistRef(incoming);

    const onConsent = (e: Event) => {
      if ((e as CustomEvent).detail !== "accepted") return;
      let pending: string | null = null;
      try {
        pending = sessionStorage.getItem(REF_PENDING_KEY);
      } catch {}
      if (pending) persistRef(pending);
    };
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, []);
  return null;
}
