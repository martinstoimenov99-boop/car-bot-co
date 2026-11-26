import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { Locale } from "@/i18n/config";

export const OG_SIZE = { width: 1200, height: 630 };

const font = (file: string) => readFile(path.join(process.cwd(), "assets/fonts", file));

/** Shared Open Graph card: warm dark background, orange eyebrow, big headline, WhatsApp-style bubble. */
export async function renderOg({ locale, title, sub }: { locale: Locale; title: string; sub: string }) {
  const [heading, body] = await Promise.all([
    font(locale === "mk" ? "InterTight-ExtraBold.ttf" : "Archivo-ExtraBold.ttf"),
    font("Inter-SemiBold.ttf"),
  ]);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: "linear-gradient(135deg, #111418 0%, #2A1708 100%)",
        color: "#F2EEE7",
        fontFamily: "Body",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "Heading", fontSize: 40 }}>
        <div style={{ width: 44, height: 44, borderRadius: 22, background: "#F08A3C" }} />
        Car Bot
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ color: "#F08A3C", fontSize: 26, letterSpacing: 2, textTransform: "uppercase" }}>
          {sub}
        </div>
        <div style={{ fontFamily: "Heading", fontSize: 76, lineHeight: 1.04, maxWidth: 1000 }}>{title}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26 }}>
        <div style={{ color: "#B9B3A8" }}>getcarbot.co</div>
        <div
          style={{
            display: "flex",
            background: "#005C4B",
            borderRadius: "22px 6px 22px 22px",
            padding: "14px 22px",
          }}
        >
          07:27 ✓✓
        </div>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "Heading", data: heading, weight: 800, style: "normal" },
        { name: "Body", data: body, weight: 600, style: "normal" },
      ],
    },
  );
}
