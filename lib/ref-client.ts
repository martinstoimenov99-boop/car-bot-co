"use client";

import {
  CONSENT_COOKIE,
  REF_COOKIE,
  REF_MAX_AGE_S,
  REF_PENDING_KEY,
  REF_STORAGE_KEY,
  type ConsentValue,
  nextRefValue,
  parseRef,
} from "./ref";

export const CONSENT_EVENT = "cb:consent";
export const OPEN_COOKIE_SETTINGS_EVENT = "cb:cookie-settings";

export function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const hit = document.cookie.split("; ").find((c) => c.startsWith(name + "="));
  return hit ? hit.slice(name.length + 1) : undefined;
}

export function writeCookie(name: string, value: string, maxAgeS: number) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeS}; Path=/; SameSite=Lax${secure}`;
}

function safe<T>(fn: () => T): T | undefined {
  try {
    return fn();
  } catch {
    return undefined;
  }
}

export function getConsent(): ConsentValue | undefined {
  const v = readCookie(CONSENT_COOKIE);
  return v === "accepted" || v === "essential" ? v : undefined;
}

export function setConsent(value: ConsentValue) {
  writeCookie(CONSENT_COOKIE, value, 60 * 60 * 24 * 365);
  if (value === "essential") {
    // Withdrawing consent removes the functional ref cookie and its local copy.
    writeCookie(REF_COOKIE, "", 0);
    safe(() => localStorage.removeItem(REF_STORAGE_KEY));
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

/** Keep a ref for this tab only (used before consent). */
export function rememberPendingRef(code: string) {
  safe(() => sessionStorage.setItem(REF_PENDING_KEY, code));
}

/** Persist a ref to the cookie and localStorage, honouring first-click-wins. Only call after consent. */
export function persistRef(code: string) {
  const existing = readCookie(REF_COOKIE) ?? safe(() => localStorage.getItem(REF_STORAGE_KEY)) ?? undefined;
  const next = nextRefValue(existing ? decodeURIComponent(existing) : undefined, code, Date.now());
  const value = next ?? (existing ? decodeURIComponent(existing) : undefined);
  if (!value) return;
  writeCookie(REF_COOKIE, value, REF_MAX_AGE_S);
  safe(() => localStorage.setItem(REF_STORAGE_KEY, value));
}

/** The partner code to attach to a form: stored attribution first, then this tab's pending ref. */
export function getRef(): string | undefined {
  const fromCookie = parseRef(readCookie(REF_COOKIE))?.code;
  if (fromCookie) return fromCookie;
  const fromStorage = parseRef(safe(() => localStorage.getItem(REF_STORAGE_KEY)))?.code;
  if (fromStorage) return fromStorage;
  return parseRef(safe(() => sessionStorage.getItem(REF_PENDING_KEY)))?.code;
}
