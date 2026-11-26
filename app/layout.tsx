import type { ReactNode } from "react";
import "./globals.css";

// The real <html> lives in app/[locale]/layout.tsx. This root layout only exists so that
// app/not-found.tsx can render for paths outside any locale.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
