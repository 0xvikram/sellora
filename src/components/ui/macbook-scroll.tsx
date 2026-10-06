"use client";

// Adapted from Aceternity UI "MacBook Scroll"
// (https://ui.aceternity.com/components/macbook-scroll). Changes: the screen
// takes React children instead of an image, the lid can be driven by an
// outside MotionValue (0 = closed, 1 = open) so a pinned GSAP stage can open
// it, the keyboard/speaker SVG detail is replaced by a plain base with a
// trackpad notch, it uses framer-motion (this project's engine), and the
// screen lays its children out at a fixed design width and scales them to
// fit, so they look the same in a frame of any size.

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function MacbookScroll({
  children,
  progress,
  open = false,
  screenClassName,
  designWidth = 640,
  className,
}: {
  children?: ReactNode;
  /** Width (px) the children are laid out at before being scaled to fit. */
  designWidth?: number;
  /** Lid-open progress, 0 (closed) to 1 (open). Without it the lid follows
   *  the window scroll as the laptop moves into view, like the original. */
  progress?: MotionValue<number>;
  /** Render fully open with no animation (reduced motion, small screens). */
  open?: boolean;
  /** Classes for the screen area, e.g. an aspect ratio. */
  screenClassName?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const p = progress ?? scrollYProgress;

  // The lid starts tipped toward the viewer, nearly shut, and swings up to
  // upright. At progress 1 every value is at its identity, so the screen has
  // no transform once open (keeps child measurements, e.g. beams, exact).
  const rotateX = useTransform(p, [0, 1], [-78, 0], { clamp: true });
  const scale = useTransform(p, [0, 1], [0.94, 1], { clamp: true });
  const dim = useTransform(p, [0.35, 1], [0.85, 0], { clamp: true });

  return (
    <div ref={ref} className={cn("relative w-full [perspective:1800px]", className)}>
      <Lid open={open} rotateX={rotateX} scale={scale} dim={dim} screenClassName={screenClassName}>
        <ScreenFit designWidth={designWidth}>{children}</ScreenFit>
      </Lid>
      <Base />
    </div>
  );
}

export function Lid({
  children,
  open,
  rotateX,
  scale,
  dim,
  screenClassName,
}: {
  children?: ReactNode;
  open: boolean;
  rotateX: MotionValue<number>;
  scale: MotionValue<number>;
  dim: MotionValue<number>;
  screenClassName?: string;
}) {
  return (
    <motion.div
      style={
        open
          ? undefined
          : { rotateX, scale, transformOrigin: "50% 100%", transformStyle: "preserve-3d" }
      }
      className={cn(
        "relative mx-auto rounded-t-[0.8rem] sm:rounded-t-[1.15rem]",
        open ? "w-[94%]" : "w-[88%]",
        "bg-[#16140f] p-[clamp(6px,1.4%,12px)] pb-[clamp(8px,2.2%,18px)] shadow-[0_40px_80px_-40px_rgba(22,20,15,0.55)]",
      )}
    >
      <span
        aria-hidden="true"
        className="absolute top-[2px] left-1/2 h-1 w-1 sm:top-[0.55%] -translate-x-1/2 rounded-full bg-[#3a372f]"
      />
      <div
        className={cn(
          "relative aspect-[16/10.4] overflow-hidden rounded-[0.3rem] bg-[radial-gradient(circle_at_50%_35%,var(--color-card),var(--color-paper-2))] sm:rounded-[0.4rem]",
          screenClassName,
        )}
      >
        {children}
        {open ? null : (
          <motion.div
            aria-hidden="true"
            style={{ opacity: dim }}
            className="pointer-events-none absolute inset-0 bg-[#16140f]"
          />
        )}
      </div>
    </motion.div>
  );
}

// Lays children out at `designWidth` px and scales the whole block uniformly
// (never above 1) so it fits the screen box both ways, centred. Before the
// first measurement the block is hidden rather than shown at the wrong size.
export function ScreenFit({
  children,
  designWidth,
  padding = 20,
}: {
  children?: ReactNode;
  designWidth: number;
  padding?: number;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const inner = innerRef.current;
    if (!box || !inner) return;
    const fit = () => {
      const w = box.clientWidth;
      const h = box.clientHeight;
      if (!w || !h) return;
      const s = Math.min(1, w / designWidth, h / Math.max(1, inner.offsetHeight));
      setScale(Math.floor(s * 1000) / 1000);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [designWidth]);

  return (
    <div ref={boxRef} className="absolute inset-0">
      <div
        ref={innerRef}
        className="absolute top-1/2 left-1/2"
        style={{
          width: designWidth,
          padding,
          transform: `translate(-50%, -50%) scale(${scale ?? 1})`,
          visibility: scale === null ? "hidden" : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Front view of the base: a thin slab, a little wider than the lid, with the
// finger notch where the trackpad edge sits.
export function Base() {
  return (
    <div aria-hidden="true" className="relative">
      <div className="relative h-2 w-full rounded-t-[0.2rem] rounded-b-[0.8rem] sm:h-3 sm:rounded-t-[0.3rem] sm:rounded-b-[1.1rem] bg-gradient-to-b from-[#e4dfd4] via-[#cfc9bc] to-[#a9a396] shadow-[0_18px_30px_-18px_rgba(22,20,15,0.6)]">
        <Trackpad />
      </div>
    </div>
  );
}

export function Trackpad() {
  return (
    <div className="absolute top-0 left-1/2 h-[45%] w-[14%] -translate-x-1/2 rounded-b-md bg-gradient-to-b from-[#b8b2a5] to-[#d6d0c4]" />
  );
}
