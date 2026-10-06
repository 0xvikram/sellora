"use client";
import React, { useRef } from "react";
import {
  useReducedMotion,
  useScroll,
  useTransform,
  motion,
  MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

// Aceternity ContainerScroll (ui.aceternity.com/registry/container-scroll-animation.json),
// adapted: the frame sizes to its content instead of fixed 40rem heights,
// the bezel matches the dark band, the scroll range is measured while the
// container crosses the viewport, and reduced motion shows it upright with no tilt.

export const ContainerScroll = ({
  titleComponent,
  children,
  className,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });
  // Starts tilted back about 20deg and stands up to face the viewer by the
  // time the container centre reaches the viewport centre, then holds upright.
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [20, 0],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [1, 1] : [0.92, 1],
  );
  // Lifts the tilted window slightly so it does not sit low at the start.
  const cardLift = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [-24, 0],
  );
  const translate = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -40]);

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      ref={containerRef}
    >
      <div className="relative w-full" style={{ perspective: "1200px" }}>
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={cardLift} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="mx-auto max-w-5xl text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  translate,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        translateY: translate,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="mx-auto mt-14 w-full max-w-5xl rounded-[30px] border border-paper/15 bg-[#26221b] p-2 md:mt-16 md:p-4"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl">{children}</div>
    </motion.div>
  );
};
