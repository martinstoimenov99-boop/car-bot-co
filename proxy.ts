import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { CONSENT_COOKIE, REF_COOKIE, REF_MAX_AGE_S, nextRefValue, refFromSearchParams } from "./lib/ref";

const intl = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const response = intl(request);

  // Partner attribution: ?ref=CODE or ?partner=CODE. The cookie is only set once the visitor
  // has accepted the cookie banner; before that the browser keeps it for the session only.
  const incoming = refFromSearchParams(request.nextUrl.searchParams);
  if (incoming && request.cookies.get(CONSENT_COOKIE)?.value === "accepted") {
    const value = nextRefValue(request.cookies.get(REF_COOKIE)?.value, incoming, Date.now());
    if (value) {
      response.cookies.set(REF_COOKIE, value, {
        maxAge: REF_MAX_AGE_S,
        sameSite: "lax",
        secure: true,
        path: "/",
      });
    }
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
