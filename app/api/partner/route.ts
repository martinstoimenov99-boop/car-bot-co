import type { NextRequest } from "next/server";
import { guardForm, json } from "@/lib/api";
import { recordSubmission } from "@/lib/leads";
import { REF_COOKIE, parseRef } from "@/lib/ref";
import { partnerSchema } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const guard = await guardForm(req, "partner");
  if ("response" in guard) return guard.response;

  const parsed = partnerSchema.safeParse(guard.body);
  if (!parsed.success) return json({ ok: false, error: "invalid" }, 400);
  const app = { ...parsed.data, ref: parsed.data.ref ?? parseRef(req.cookies.get(REF_COOKIE)?.value)?.code };

  try {
    const { delivered } = await recordSubmission({
      kind: "partner",
      data: app,
      at: new Date().toISOString(),
    });
    if (!delivered) return json({ ok: false, error: "unavailable" }, 502);
    return json({ ok: true });
  } catch (err) {
    console.error("[api/partner] unexpected error", err);
    return json({ ok: false, error: "unavailable" }, 500);
  }
}
