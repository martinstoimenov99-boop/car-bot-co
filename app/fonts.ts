import { Archivo, Inter, Inter_Tight } from "next/font/google";

export const archivo = Archivo({
  subsets: ["latin"],
  weight: ["800"], // only 800 is used; 700 would be preloaded for nothing
  display: "swap",
  variable: "--font-archivo",
});

export const inter = Inter({
  // Only latin is preloaded; latin-ext and cyrillic load on demand via unicode-range.
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-inter",
});

/** Cyrillic heading face for Macedonian (Archivo has no Cyrillic). Only the cyrillic 800 file is preloaded. */
export const interTight = Inter_Tight({
  subsets: ["cyrillic"],
  weight: ["800"],
  display: "swap",
  variable: "--font-inter-tight",
});

export const fontVariables = `${archivo.variable} ${inter.variable} ${interTight.variable}`;
