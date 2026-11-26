import Link from "next/link";
import "./globals.css";
import { fontVariables } from "./fonts";

// 404 for paths outside any locale (the proxy normally redirects these to /en or /mk).
export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body className="bg-page text-ink font-sans">
        <main className="mx-auto max-w-[720px] px-6 py-24 text-center">
          <p className="font-display text-accent text-[64px] font-extrabold">404</p>
          <h1 className="h2-sm mt-0 mb-4">This page already drove off.</h1>
          <p className="text-soft mt-0 mb-8 text-lg">The good cars are still on the main page.</p>
          <Link href="/" className="btn bg-accent text-on-accent px-6 py-4">
            Back to the main page
          </Link>
        </main>
      </body>
    </html>
  );
}
