"use client";

import { REF_STORAGE_KEY, isValidRef, refFromSearchParams } from "./ref";

function safe<T>(fn: () => T): T | undefined {
  try {
    return fn();
  } catch {
    return undefined;
  }
}

/** Remember the partner code from the current URL for this tab. The newest link the visitor opened wins. */
export function captureRefFromUrl() {
  const code = refFromSearchParams(new URLSearchParams(window.location.search));
  if (code) safe(() => sessionStorage.setItem(REF_STORAGE_KEY, code));
}

/** The partner code to attach to a form: this visit's code (tab storage), or one still in the URL. */
export function getRef(): string | undefined {
  const stored = safe(() => sessionStorage.getItem(REF_STORAGE_KEY));
  if (isValidRef(stored)) return stored;
  return refFromSearchParams(new URLSearchParams(window.location.search)) ?? undefined;
}
