"use client";

import { Html } from "@react-three/drei";
import type { CSSProperties } from "react";
import type { FindingSpec } from "./layout";

/**
 * A finding pinned to a part of the store: a white pill (8px radius, mono
 * 11px, a 6px lime marker) on a short leader that ends in a dot on the
 * part. The pill sits above or below, centred on the leader or running off
 * to one side, so the four never collide. It rises in when `on` turns
 * true (CSS transition, see .dio-finding in globals.css). Decorative for
 * assistive tech: the card carries the same findings as a hidden list.
 */
export function Finding({ spec, on }: { spec: FindingSpec; on: boolean }) {
  return (
    <Html position={spec.at} zIndexRange={[4, 0]} style={{ pointerEvents: "none" }}>
      <div
        className="dio-finding"
        data-on={on || undefined}
        data-finding={spec.id}
        data-place={spec.place}
        data-align={spec.align}
        style={{ "--lead": `${spec.lead}px` } as CSSProperties}
        aria-hidden="true"
      >
        <span className="dio-pill">
          <span className="dio-marker" />
          <span className="dio-label">{spec.label}</span>
          <span className="dio-dot">·</span>
          <span>{spec.value}</span>
        </span>
        <span className="dio-leader" />
      </div>
    </Html>
  );
}
