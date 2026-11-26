export const WA_NUMBER = (process.env.NEXT_PUBLIC_WA_NUMBER || "38978662817").replace(/\D/g, "");
export const WA_DISPLAY = "+389 78 662 817";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://getcarbot.co").replace(/\/$/, "");
export const SITE_HOST = "getcarbot.co";

export function waLink(text?: string, number: string = WA_NUMBER) {
  return `https://wa.me/${number}` + (text ? `?text=${encodeURIComponent(text)}` : "");
}
