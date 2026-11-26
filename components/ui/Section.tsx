import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Eyebrow({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "cream" }) {
  return <p className={cn("eyebrow", tone === "cream" ? "text-accent-dark" : "text-accent")}>{children}</p>;
}

export function NumberedCard({
  n,
  title,
  body,
  className,
}: {
  n: number | string;
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <div className={cn("lift rounded-card p-7", className)}>
      <div className="font-display text-accent text-4xl font-extrabold">{n}</div>
      <h3 className="my-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted m-0">{body}</p>
    </div>
  );
}
