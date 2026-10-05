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
// container crosses the viewport, and reduced motion shows it flat.

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
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const rotate = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 24, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [1, 1] : isMobile ? [0.92, 1] : [1.05, 1],
  );
  const translate = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -40]);

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      ref={containerRef}
    >
      <div className="relative w-full" style={{ perspective: "1000px" }}>
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
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
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="mx-auto mt-14 w-full max-w-5xl rounded-[30px] border border-paper/15 bg-[#26221b] p-2 md:mt-16 md:p-4"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl">{children}</div>
    </motion.div>
  );
};
