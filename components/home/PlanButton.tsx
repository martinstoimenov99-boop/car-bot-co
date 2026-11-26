"use client";

import type { ReactNode } from "react";
import { useLeadFlow } from "@/components/forms/LeadFlow";

export function PlanButton({
  plan,
  children,
  className,
}: {
  plan: "monthly" | "yearly";
  children: ReactNode;
  className?: string;
}) {
  const { open } = useLeadFlow();
  return (
    <button type="button" onClick={() => open(plan)} className={className} data-testid={`choose-${plan}`}>
      {children}
    </button>
  );
}
