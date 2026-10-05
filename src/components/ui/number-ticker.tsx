"use client"

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react"
import { animate, useInView, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

// Magic UI NumberTicker (magicui.design/r/number-ticker.json), adapted:
// the server renders the final value, so prices read correctly without JS
// and for reduced-motion users. The count from `startValue` only starts
// once JS has loaded and the number is about to scroll into view, and it is a
// fixed 1.6 s tween rather than the original spring, whose long tail left
// prices visibly wrong (e.g. "$1,997") for several seconds.

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number
  startValue?: number
  direction?: "up" | "down"
  delay?: number
  decimalPlaces?: number
}

const format = (n: number, decimalPlaces: number) =>
  Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(Number(n.toFixed(decimalPlaces)))

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const from = direction === "down" ? value : startValue
  const to = direction === "down" ? startValue : value
  const isInView = useInView(ref, { once: true, margin: "0px" })
  const armed = useRef(false)

  // Before the number is seen, swap the final value for the start value.
  useEffect(() => {
    if (reduced || isInView || !ref.current) return
    armed.current = true
    ref.current.textContent = format(from, decimalPlaces)
  }, [reduced, isInView, from, decimalPlaces])

  useEffect(() => {
    if (!isInView) return
    if (!armed.current) {
      if (ref.current) ref.current.textContent = format(to, decimalPlaces)
      return
    }
    const controls = animate(from, to, {
      duration: 1.6,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        if (ref.current) ref.current.textContent = format(latest, decimalPlaces)
      },
    })
    return () => controls.stop()
  }, [isInView, delay, from, to, decimalPlaces])

  return (
    <span
      ref={ref}
      className={cn("inline-block tabular-nums", className)}
      {...props}
    >
      {format(direction === "down" ? startValue : value, decimalPlaces)}
    </span>
  )
}
