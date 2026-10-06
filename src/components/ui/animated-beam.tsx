"use client"

import { useEffect, useId, useState, type RefObject } from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { useHydratedReducedMotion } from "@/lib/use-hydrated-reduced-motion"

export interface AnimatedBeamProps {
  className?: string
  containerRef: RefObject<HTMLElement | null> // Container ref
  fromRef: RefObject<HTMLElement | null>
  toRef: RefObject<HTMLElement | null>
  curvature?: number
  reverse?: boolean
  pathColor?: string
  pathWidth?: number
  pathOpacity?: number
  gradientStartColor?: string
  gradientStopColor?: string
  delay?: number
  duration?: number
  repeat?: number
  repeatDelay?: number
  startXOffset?: number
  startYOffset?: number
  endXOffset?: number
  endYOffset?: number
}

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false, // Include the reverse prop
  duration = 5,
  delay = 0,
  pathColor = "gray",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#ffaa40",
  gradientStopColor = "#9c40ff",
  repeat = Infinity,
  repeatDelay = 0,
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}) => {
  const id = useId()
  // Adapted: with reduced motion the beam is a still line, no travelling light.
  // Hydration-safe: the markup below differs when reduced.
  const reduced = useHydratedReducedMotion()
  const [pathD, setPathD] = useState("")
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 })

  // Calculate the gradient coordinates based on the reverse prop
  const gradientCoordinates = reverse
    ? {
        x1: ["90%", "-10%"],
        x2: ["100%", "0%"],
        y1: ["0%", "0%"],
        y2: ["0%", "0%"],
      }
    : {
        x1: ["10%", "110%"],
        x2: ["0%", "100%"],
        y1: ["0%", "0%"],
        y2: ["0%", "0%"],
      }

  useEffect(() => {
    const updatePath = () => {
      if (containerRef.current && fromRef.current && toRef.current) {
        const container = containerRef.current
        const containerRect = container.getBoundingClientRect()
        const rectA = fromRef.current.getBoundingClientRect()
        const rectB = toRef.current.getBoundingClientRect()

        // Adapted: the beam may sit inside a CSS-scaled box (the laptop
        // screen). Screen rects are scaled; the SVG draws in the container's
        // own (unscaled) space, so divide by the scale factor.
        const k =
          container.offsetWidth > 0 ? containerRect.width / container.offsetWidth : 1
        const s = k > 0 ? k : 1

        const svgWidth = container.offsetWidth || containerRect.width
        const svgHeight = container.offsetHeight || containerRect.height
        setSvgDimensions({ width: svgWidth, height: svgHeight })

        const startX =
          (rectA.left - containerRect.left + rectA.width / 2) / s + startXOffset
        const startY =
          (rectA.top - containerRect.top + rectA.height / 2) / s + startYOffset
        const endX =
          (rectB.left - containerRect.left + rectB.width / 2) / s + endXOffset
        const endY =
          (rectB.top - containerRect.top + rectB.height / 2) / s + endYOffset

        const controlY = startY - curvature
        const d = `M ${startX},${startY} Q ${
          (startX + endX) / 2
        },${controlY} ${endX},${endY}`
        setPathD(d)
      }
    }

    // Initialize ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      updatePath()
    })

    // Observe the container element. Adapted: also the two end nodes, whose
    // size (and so position) changes when web fonts finish loading.
    for (const el of [containerRef.current, fromRef.current, toRef.current]) {
      if (el) resizeObserver.observe(el)
    }
    document.fonts?.ready.then(updatePath)

    // Call the updatePath initially to set the initial path
    updatePath()

    // Clean up the observer on component unmount
    return () => {
      resizeObserver.disconnect()
    }
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ])

  return (
    <svg
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "pointer-events-none absolute top-0 left-0 transform-gpu stroke-2",
        className
      )}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
      aria-hidden="true"
    >
      <path
        d={pathD}
        stroke={reduced ? gradientStopColor : pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={reduced ? 0.7 : pathOpacity}
        strokeLinecap="round"
      />
      {reduced ? null : (
        <path
          d={pathD}
          strokeWidth={pathWidth}
          stroke={`url(#${id})`}
          strokeOpacity="1"
          strokeLinecap="round"
        />
      )}
      <defs>
        <motion.linearGradient
          className="transform-gpu"
          id={id}
          gradientUnits={"userSpaceOnUse"}
          initial={{
            x1: "0%",
            x2: "0%",
            y1: "0%",
            y2: "0%",
          }}
          animate={{
            x1: gradientCoordinates.x1,
            x2: gradientCoordinates.x2,
            y1: gradientCoordinates.y1,
            y2: gradientCoordinates.y2,
          }}
          transition={{
            delay,
            duration,
            ease: [0.16, 1, 0.3, 1], // https://easings.net/#easeOutExpo
            repeat,
            repeatDelay,
          }}
        >
          <stop stopColor={gradientStartColor} stopOpacity="0"></stop>
          <stop stopColor={gradientStartColor}></stop>
          <stop offset="32.5%" stopColor={gradientStopColor}></stop>
          <stop
            offset="100%"
            stopColor={gradientStopColor}
            stopOpacity="0"
          ></stop>
        </motion.linearGradient>
      </defs>
    </svg>
  )
}
