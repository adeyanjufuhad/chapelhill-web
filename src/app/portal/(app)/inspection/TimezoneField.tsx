"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Sends the buyer's timezone with the request so the team schedules in their local time. */
export function TimezoneField() {
  const tz = useSyncExternalStore(subscribe, () => Intl.DateTimeFormat().resolvedOptions().timeZone, () => "");
  return (
    <>
      <input type="hidden" name="timezone" value={tz} />
      {tz && <p className="text-muted-foreground -mt-2 text-xs">Times are in your timezone ({tz}).</p>}
    </>
  );
}
