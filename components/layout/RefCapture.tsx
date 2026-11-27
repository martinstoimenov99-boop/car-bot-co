"use client";

import { useEffect } from "react";
import { captureRefFromUrl } from "@/lib/ref-client";

/** Remembers ?ref= / ?partner= for this visit. No cookie, nothing leaves the browser until a form is sent. */
export function RefCapture() {
  useEffect(() => {
    captureRefFromUrl();
  }, []);
  return null;
}
