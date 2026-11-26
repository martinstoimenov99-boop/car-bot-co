import { Archivo, Inter, Inter_Tight } from "next/font/google";

export const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800"],
  display: "swap",
  variable: "--font-archivo",
});

export const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-inter",
});

/** Cyrillic-capable heading face for Macedonian (Archivo has no Cyrillic). Only downloaded when used. */
export const interTight = Inter_Tight({
  subsets: ["latin", "cyrillic"],
  weight: ["700", "800"],
  display: "swap",
  preload: false,
  variable: "--font-inter-tight",
});

export const fontVariables = `${archivo.variable} ${inter.variable} ${interTight.variable}`;
