import "server-only";
import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { cn } from "@/lib/cn";

export type PhotoName =
  | "hero-night-passat.jpg"
  | "busy-dealer.jpg"
  | "nightstand-phone.jpg"
  | "handshake.jpg"
  | "dealer-on-call.jpg"
  | "transporter-dawn.jpg";

function exists(name: PhotoName) {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", "images", name));
  } catch {
    return false;
  }
}

/**
 * A photo from public/images, served through next/image (AVIF/WebP). Until the file exists it renders
 * a dark grey placeholder of the same size, so layout never shifts when the real photo lands.
 */
export function Photo({
  name,
  alt,
  sizes,
  className,
  objectPosition = "50% 50%",
  preload = false,
  cover = false,
}: {
  name: PhotoName;
  alt: string;
  sizes: string;
  className?: string;
  objectPosition?: string;
  preload?: boolean;
  /** Fill the nearest positioned parent (background photos). */
  cover?: boolean;
}) {
  return (
    <div className={cn(cover ? "absolute inset-0" : "relative", "bg-placeholder overflow-hidden", className)}>
      {exists(name) ? (
        <Image
          src={`/images/${name}`}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          fetchPriority={preload ? "high" : undefined}
          quality={75}
          style={{ objectFit: "cover", objectPosition }}
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          data-placeholder={name}
          className="bg-placeholder absolute inset-0"
        />
      )}
    </div>
  );
}
