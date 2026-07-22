"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackSiteEvent, type SiteEvent } from "~/lib/analytics";

type TrackedLinkProps = ComponentProps<typeof Link> & {
  event: SiteEvent;
  eventData?: Record<string, string | number | boolean | null>;
};

export default function TrackedLink({
  event,
  eventData,
  onClick,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(clickEvent) => {
        trackSiteEvent(event, eventData);
        onClick?.(clickEvent);
      }}
    />
  );
}
