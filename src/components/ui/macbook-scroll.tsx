"use client";

// Adapted from Aceternity UI "MacBook Scroll"
// (https://ui.aceternity.com/components/macbook-scroll). Changes: the screen
// takes React children instead of an image, the lid can be driven by an
// outside MotionValue (0 = closed, 1 = open) so a pinned GSAP stage can open
// it, the keyboard/speaker SVG detail is replaced by a plain base with a
// trackpad notch, and it uses framer-motion (this project's engine).

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function MacbookScroll({
  children,
  progress,
  open = false,
  screenClassName,
  className,
}: {
  children?: ReactNode;
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
        {children}
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
        "relative mx-auto rounded-t-[1.15rem]",
        open ? "w-[94%]" : "w-[88%]",
        "bg-[#16140f] p-[1.6%] pb-[2.4%] shadow-[0_40px_80px_-40px_rgba(22,20,15,0.55)]",
      )}
    >
      <span
        aria-hidden="true"
        className="absolute top-[0.55%] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#3a372f]"
      />
      <div className={cn("relative overflow-hidden rounded-[0.4rem] bg-paper", screenClassName)}>
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

// Front view of the base: a thin slab, a little wider than the lid, with the
// finger notch where the trackpad edge sits.
export function Base() {
  return (
    <div aria-hidden="true" className="relative">
      <div className="relative h-3 w-full rounded-t-[0.3rem] rounded-b-[1.1rem] bg-gradient-to-b from-[#e4dfd4] via-[#cfc9bc] to-[#a9a396] shadow-[0_18px_30px_-18px_rgba(22,20,15,0.6)]">
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
