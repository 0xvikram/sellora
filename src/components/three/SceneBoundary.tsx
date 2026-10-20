"use client";

import { Component, useEffect, useRef, type ReactNode } from "react";

/**
 * Keeps a 3D scene's failure inside its card. If the canvas throws (the
 * WebGL context cannot be created even though the probe in live-gate.ts
 * passed, a shader fails to compile, the chunk fails to load) or the GPU
 * drops the context while the canvas is on the page, `onFail` runs and the
 * card falls back to its poster for the rest of the visit. Without this a
 * renderer error would take the whole page down.
 */
class Boundary extends Component<{ onFail: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function SceneBoundary({
  onFail,
  className,
  children,
  ...rest
}: {
  onFail: () => void;
  className?: string;
  children: ReactNode;
} & Record<`data-${string}`, string | boolean | undefined>) {
  const ref = useRef<HTMLDivElement>(null);
  const fail = useRef(onFail);
  useEffect(() => {
    fail.current = onFail;
  }, [onFail]);
  // webglcontextlost does not bubble, so listen in the capture phase. A
  // canvas that is no longer in the document lost its context because it
  // was unmounted on purpose (R3F forces the loss on dispose): ignore it.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onLost = (e: Event) => {
      if ((e.target as Element | null)?.isConnected) fail.current();
    };
    el.addEventListener("webglcontextlost", onLost, true);
    return () => el.removeEventListener("webglcontextlost", onLost, true);
  }, []);
  return (
    <div ref={ref} className={className} {...rest}>
      <Boundary onFail={() => fail.current()}>{children}</Boundary>
    </div>
  );
}
