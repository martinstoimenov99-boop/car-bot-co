import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000; // 5 requests per hour per IP and route

let upstash: Ratelimit | null | undefined;
function getUpstash() {
  if (upstash !== undefined) return upstash;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  upstash =
    url && token
      ? new Ratelimit({
          redis: new Redis({ url, token }),
          limiter: Ratelimit.slidingWindow(LIMIT, "1 h"),
          prefix: "carbot:rl",
          analytics: false,
        })
      : null;
  return upstash;
}

// In-memory fallback. On serverless this is per instance, so it is a speed bump, not a wall.
const memory = new Map<string, number[]>();

export async function rateLimit(route: string, ip: string): Promise<{ ok: boolean }> {
  const key = `${route}:${ip}`;
  const rl = getUpstash();
  if (rl) {
    try {
      const { success } = await rl.limit(key);
      return { ok: success };
    } catch (err) {
      console.error("[rate-limit] upstash failed, using memory", err);
    }
  }
  const now = Date.now();
  const hits = (memory.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= LIMIT) {
    memory.set(key, hits);
    return { ok: false };
  }
  hits.push(now);
  memory.set(key, hits);
  if (memory.size > 10_000) memory.clear();
  return { ok: true };
}

export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
