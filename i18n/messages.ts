import type { Locale } from "./config";

export type Messages = typeof import("../messages/en.json");

export async function loadMessages(locale: Locale): Promise<Messages> {
  return (await import(`../messages/${locale}.json`)).default as Messages;
}

/** Deep-picks dotted paths (e.g. "home.roi") from a messages object, for the client provider. */
export function pickMessages(messages: Record<string, unknown>, paths: string[]) {
  const out: Record<string, unknown> = {};
  for (const path of paths) {
    const parts = path.split(".");
    let src: unknown = messages;
    let dst: Record<string, unknown> = out;
    for (let i = 0; i < parts.length; i++) {
      const key = parts[i];
      if (src === null || typeof src !== "object" || !(key in (src as object))) break;
      src = (src as Record<string, unknown>)[key];
      if (i === parts.length - 1) dst[key] = src;
      else dst = (dst[key] ??= {}) as Record<string, unknown>;
    }
  }
  return out;
}
