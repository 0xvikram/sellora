"use client";

import { motion } from "framer-motion";
import { forwardRef, useRef } from "react";
import type { ReactNode } from "react";
import { TOOL_LOGOS } from "@/lib/tool-logos";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "./ui/animated-beam";
import { NumberTicker } from "./ui/number-ticker";

// Code-drawn illustrations, one per service. Every number in them is
// sample data: they show what the work looks like, not client results.

const EASE = [0.22, 1, 0.36, 1] as const;

export function Panel({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-line bg-card shadow-[0_24px_60px_-32px_rgba(22,20,15,0.4)] ${className}`}
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-line-2" />
          <span className="h-2 w-2 rounded-full bg-line-2" />
          <span className="h-2 w-2 rounded-full bg-line-2" />
        </div>
        <span className="font-mono text-[0.65rem] tracking-[0.14em] text-ink-3 uppercase">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

/* 01 — AI ad creative: three vertical video frames with different hooks */
const FRAMES = [
  { tag: "Hook A", line: "The problem", bg: "from-[#f3c98b] to-[#e2643c]", delay: "0s" },
  { tag: "Hook B", line: "The routine", bg: "from-[#aab4ff] to-[#2438e0]", delay: "-2s" },
  { tag: "Hook C", line: "The result", bg: "from-[#bfe3c6] to-[#2f8f5b]", delay: "-4s" },
];

export function IllusCreative() {
  return (
    <Panel label="Test batch · sample">
      <div className="flex items-end justify-center gap-4 px-6 pt-8 pb-7">
        {FRAMES.map((frame, i) => (
          <motion.div
            key={frame.tag}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: i === 1 ? -14 : 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.12, ease: EASE }}
            className={`relative aspect-[9/16] w-[30%] overflow-hidden rounded-xl bg-gradient-to-br ${frame.bg}`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.45),transparent_55%)]" />
            <span className="absolute top-2.5 left-2.5 rounded-full bg-white/85 px-2 py-0.5 font-mono text-[0.6rem] text-ink">
              {frame.tag}
            </span>
            <span className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90">
              <span className="ml-0.5 border-y-[6px] border-l-[10px] border-y-transparent border-l-ink" />
            </span>
            <div className="absolute inset-x-2.5 bottom-2.5">
              <p className="text-[0.7rem] leading-tight font-semibold text-white">
                {frame.line}
              </p>
              <div className="mt-1.5 h-0.5 overflow-hidden rounded-full bg-white/35">
                <div
                  className="illus-progress h-full bg-white"
                  style={{ animationDelay: frame.delay }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-line px-5 py-3 font-mono text-[0.7rem] text-ink-2">
        <span>3 hooks · 9:16 · Meta + TikTok</span>
        <span className="text-accent">ready to test</span>
      </div>
    </Panel>
  );
}

/* 02 — AI-search audit: an assistant answer that names the brand */
const ANSWER =
  "A few options stand out. For sensitive skin, Your Brand Barrier Cream is often recommended because it is fragrance-free and lists every ingredient clearly.".split(
    " ",
  );

export function IllusSearch() {
  return (
    <Panel label="AI assistant · sample">
      <div className="space-y-4 px-5 pt-6 pb-5">
        <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-sm text-paper">
          Best moisturiser for sensitive skin?
        </div>
        <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-paper-2/70 px-4 py-3 text-sm leading-relaxed">
          {ANSWER.map((word, i) => {
            const brand = i >= 8 && i <= 11;
            return (
              <motion.span
                key={`${word}-${i}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.3 + i * 0.06 }}
                className={brand ? "bg-accent-soft font-semibold text-accent" : ""}
              >
                {word}{" "}
              </motion.span>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          {["yourstore.com", "ingredients", "reviews"].map((source, i) => (
            <motion.span
              key={source}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 2 + i * 0.12, ease: EASE }}
              className="rounded-full border border-line px-3 py-1 font-mono text-[0.68rem] text-ink-2"
            >
              ↗ {source}
            </motion.span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 border-t border-line font-mono text-[0.68rem] text-ink-2">
        {["ChatGPT", "Gemini", "Perplexity"].map((name) => (
          <span key={name} className="border-r border-line px-4 py-3 last:border-r-0">
            {name} <span className="text-leaf">●</span>
          </span>
        ))}
      </div>
    </Panel>
  );
}

/* 03 — Retention audit: a cohort table filling in */
const COHORT = [
  [100, 34, 27, 22, 19, 17],
  [100, 31, 25, 21, 18],
  [100, 36, 29, 24],
  [100, 33, 26],
  [100, 38],
  [100],
];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export function IllusRetention() {
  return (
    <Panel label="Repeat rate by cohort · sample">
      <div className="px-5 pt-6 pb-5">
        <div className="grid grid-cols-[2.5rem_repeat(6,1fr)] gap-1.5 font-mono text-[0.65rem]">
          <span />
          {[0, 1, 2, 3, 4, 5].map((m) => (
            <span key={m} className="text-center text-ink-3">
              M{m}
            </span>
          ))}
          {COHORT.map((row, r) => (
            <div key={MONTHS[r]} className="contents">
              <span className="flex items-center text-ink-3">{MONTHS[r]}</span>
              {[0, 1, 2, 3, 4, 5].map((c) => {
                const value = row[c];
                if (value === undefined) return <span key={c} />;
                return (
                  <motion.span
                    key={c}
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (r + c) * 0.07, ease: EASE }}
                    className="flex aspect-[5/3] items-center justify-center rounded-md"
                    style={{
                      background: `rgba(36,56,224,${c === 0 ? 0.92 : 0.12 + value / 60})`,
                      color: c === 0 || value > 28 ? "#fff" : "var(--color-ink)",
                    }}
                  >
                    {value}
                  </motion.span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 border-t border-line">
        <div className="border-r border-line px-5 py-3.5">
          <p className="font-mono text-[0.65rem] text-ink-3 uppercase">Second order</p>
          <p className="mt-1 text-xl font-medium tracking-tight">
            <NumberTicker value={34} />%
          </p>
        </div>
        <div className="px-5 py-3.5">
          <p className="font-mono text-[0.65rem] text-ink-3 uppercase">Typical reorder gap</p>
          <p className="mt-1 text-xl font-medium tracking-tight">
            <NumberTicker value={41} /> days
          </p>
        </div>
      </div>
    </Panel>
  );
}

/* 04 — Tool connections: orders travelling from Shopify through n8n to
   other tools, drawn with Magic UI Animated Beam */
const BEAM = {
  pathColor: "var(--color-ink)",
  pathOpacity: 0.18,
  gradientStartColor: "#aab4ff",
  gradientStopColor: "#2438e0",
  duration: 3,
};

const Node = forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(
  function Node({ children, className = "" }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "relative z-10 flex items-center justify-center gap-2 rounded-xl border border-line-2 bg-card px-3 py-2.5 font-mono text-[0.72rem] text-ink",
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

function Logo({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
      <path d={TOOL_LOGOS[name]} />
    </svg>
  );
}

export function IllusFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shopifyRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const crmRef = useRef<HTMLDivElement>(null);
  const tplRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  return (
    <Panel label="Workflow · sample">
      <div
        ref={containerRef}
        role="img"
        aria-label="An order moving from Shopify through n8n to a CRM, a 3PL and a spreadsheet"
        className="relative flex items-center justify-between gap-3 px-4 pt-7 pb-6 sm:gap-4 sm:px-7"
      >
        <Node ref={shopifyRef} className="bg-paper-2">
          <Logo name="Shopify" />
          <span>
            Shopify
            <span className="hidden sm:inline"> order</span>
          </span>
        </Node>
        <Node ref={hubRef} className="border-accent bg-accent px-3 py-3.5 text-white sm:px-4">
          <Logo name="n8n" />
          n8n
        </Node>
        <div className="flex flex-col gap-5">
          <Node ref={crmRef} className="w-14 px-2 sm:w-20">CRM</Node>
          <Node ref={tplRef} className="w-14 px-2 sm:w-20">3PL</Node>
          <Node ref={sheetRef} className="w-14 px-2 sm:w-20">Sheet</Node>
        </div>
        <AnimatedBeam containerRef={containerRef} fromRef={shopifyRef} toRef={hubRef} {...BEAM} />
        <AnimatedBeam containerRef={containerRef} fromRef={hubRef} toRef={crmRef} curvature={30} delay={0.6} {...BEAM} />
        <AnimatedBeam containerRef={containerRef} fromRef={hubRef} toRef={tplRef} delay={0.85} {...BEAM} />
        <AnimatedBeam containerRef={containerRef} fromRef={hubRef} toRef={sheetRef} curvature={-30} delay={1.1} {...BEAM} />
      </div>
      <ul className="space-y-1.5 border-t border-line px-5 py-3.5 font-mono text-[0.7rem] text-ink-2">
        {["#1042 → CRM contact updated", "#1042 → 3PL pick ticket created", "#1042 → row added to sheet"].map(
          (line, i) => (
            <motion.li
              key={line}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.25, ease: EASE }}
              className="flex justify-between gap-3"
            >
              <span>{line}</span>
              <span className="text-leaf">✓</span>
            </motion.li>
          ),
        )}
      </ul>
    </Panel>
  );
}

/* 05 — Tracking repair: what Shopify recorded vs what Meta saw */
function Bar({ label, value, max, tone, delay }: { label: string; value: number; max: number; tone: string; delay: number }) {
  return (
    <div className="grid grid-cols-[4.5rem_1fr_2rem] items-center gap-3 font-mono text-[0.7rem]">
      <span className="text-ink-2">{label}</span>
      <span className="h-3 overflow-hidden rounded-full bg-paper-2">
        <motion.span
          className={`block h-full rounded-full ${tone}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${(value / max) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay, ease: EASE }}
        />
      </span>
      <NumberTicker value={value} delay={delay} className="text-right" />
    </div>
  );
}

export function IllusTracking() {
  return (
    <Panel label="Purchases, last 7 days · sample">
      <div className="space-y-6 px-5 pt-6 pb-5">
        <div>
          <p className="mb-3 flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.12em] text-ink-3 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-clay" /> Before
          </p>
          <div className="space-y-2.5">
            <Bar label="Shopify" value={128} max={128} tone="bg-ink" delay={0.1} />
            <Bar label="Meta saw" value={71} max={128} tone="bg-clay" delay={0.25} />
          </div>
        </div>
        <div>
          <p className="mb-3 flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.12em] text-ink-3 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-leaf" /> After
          </p>
          <div className="space-y-2.5">
            <Bar label="Shopify" value={128} max={128} tone="bg-ink" delay={0.6} />
            <Bar label="Meta saw" value={124} max={128} tone="bg-leaf" delay={0.75} />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-line px-5 py-3 font-mono text-[0.7rem] text-ink-2">
        <span>Purchase event · server + browser</span>
        <span className="text-leaf">de-duplicated ✓</span>
      </div>
    </Panel>
  );
}

export const ILLUSTRATIONS: Record<string, () => ReactNode> = {
  creative: IllusCreative,
  "ai-search": IllusSearch,
  "retention-audit": IllusRetention,
  connections: IllusFlow,
  tracking: IllusTracking,
};
