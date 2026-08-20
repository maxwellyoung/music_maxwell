"use client";

import { useEffect } from "react";

// Phoenix rule: time owns the light. Between 17:00 and 20:00 local the
// paper warms a few degrees; nobody is told. Ink mode is untouched.
export default function GoldenHour() {
  useEffect(() => {
    const apply = () => {
      const hour = new Date().getHours();
      const golden = hour >= 17 && hour < 20;
      if (golden) {
        document.documentElement.dataset.hour = "golden";
      } else {
        delete document.documentElement.dataset.hour;
      }
    };
    apply();
    const interval = window.setInterval(apply, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  return null;
}
