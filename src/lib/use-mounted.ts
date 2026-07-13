"use client";

import { useEffect, useState } from "react";

/** Returns true after first client mount — guards persisted-store values against hydration mismatch. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
