import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Locale routing only: `/` goes to the visitor's language, everything else keeps its /en, /mk ... prefix.
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
