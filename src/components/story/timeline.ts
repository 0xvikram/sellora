// The Story section's scrubbed timeline (lg and up, motion allowed).
//
// The timeline is 5 units long, one per service, and ScrollTrigger maps
// the 2.5 screens of scroll through the 350vh track onto it with scrub 0.6
// (no pin, no snap: the stage is CSS position: sticky, so the page scrolls
// natively).
//
//   unit i (0..4)   figure i is on stage. Its own drawing animates inside
//                   [i + 0.12, i + 0.88], so every figure's fills, dashes
//                   and markers are tied to its own 0 -> 1 window.
//   boundary b      figure b-1 leaves (opacity 0, y -24, scale 0.98) over
//                   [b - 0.2, b]; figure b enters (from opacity 0, y 24,
//                   scale 0.98) over [b - 0.05, b + 0.15].
//   big number      a before -> after number ("21% -> 31%") counts its
//                   after value up from the before value inside
//                   [i + 0.12 + 0.2 * 0.76, i + 0.12 + 0.8 * 0.76], the
//                   same window as the figure's own change, with the arrow
//                   and after value fading up from 30% first.
//   whole length    the progress rail fills 0 -> 1, linear.
//
// All tweens are fromTo with explicit ends, so scrubbing backwards is
// exact. The markup is the final state; gsap.matchMedia reverts every
// inline style when the layout stops being the pinned one.

type Gsap = typeof import("gsap").gsap;
type Timeline = ReturnType<Gsap["timeline"]>;

const IN = 0.12;
const LEN = 0.76;

type Anim = (gsap: Gsap, tl: Timeline, el: HTMLElement, s: number, d: number) => void;

const all = (el: HTMLElement, sel: string) => Array.from(el.querySelectorAll<HTMLElement>(sel));

const ads: Anim = (_gsap, tl, el, s, d) => {
  const [a, , c] = all(el, "[data-ad]");
  tl.fromTo(a, { xPercent: 100, rotation: 0 }, { xPercent: 0, rotation: -6, duration: d * 0.35, ease: "power2.out" }, s);
  tl.fromTo(c, { xPercent: -100, rotation: 0 }, { xPercent: 0, rotation: 6, duration: d * 0.35, ease: "power2.out" }, s);
  tl.fromTo(
    all(el, "[data-hook]"),
    { clipPath: "inset(0% 100% 0% 0%)" },
    { clipPath: "inset(0% 0% 0% 0%)", duration: d * 0.14, stagger: d * 0.1, ease: "power1.out" },
    s + d * 0.3,
  );
};

const answer: Anim = (_gsap, tl, el, s, d) => {
  const self = el.querySelector('[data-row="self"]');
  const move = s + d * 0.3;
  tl.fromTo(self, { yPercent: 300, opacity: 0.5 }, { yPercent: 0, opacity: 1, duration: d * 0.4, ease: "power2.inOut" }, move);
  tl.fromTo(all(el, '[data-row="other"]'), { yPercent: -100 }, { yPercent: 0, duration: d * 0.4, ease: "power2.inOut" }, move);
  tl.fromTo(el.querySelector('[data-tag="not"]'), { opacity: 1 }, { opacity: 0, duration: d * 0.1 }, move);
  tl.fromTo(el.querySelector('[data-tag="cited"]'), { opacity: 0 }, { opacity: 1, duration: d * 0.12 }, s + d * 0.72);
  tl.fromTo(el.querySelector("[data-marker]"), { scale: 0 }, { scale: 1, duration: d * 0.12, ease: "back.out(2)" }, s + d * 0.76);
};

const flow: Anim = (_gsap, tl, el, s, d) => {
  const run = d * 0.75;
  tl.fromTo(el.querySelector("[data-flowline]"), { scaleX: 0 }, { scaleX: 1, duration: run }, s);
  all(el, "[data-gap]").forEach((node) => {
    const i = Number(node.style.getPropertyValue("--i")) || 0;
    const at = s + run * (i / 4);
    tl.fromTo(node.querySelector("[data-fill]"), { scale: 0 }, { scale: 1, duration: d * 0.1, ease: "back.out(2)" }, at);
    tl.fromTo(node.querySelector('[data-label="gap"]'), { opacity: 1 }, { opacity: 0, duration: d * 0.06 }, at);
    tl.fromTo(node.querySelector('[data-label="name"]'), { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: d * 0.1 }, at + d * 0.04);
  });
};

const connect: Anim = (_gsap, tl, el, s, d) => {
  tl.fromTo(all(el, "[data-link]"), { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: d * 0.3, stagger: d * 0.06 }, s);
  tl.fromTo(all(el, "[data-tool]"), { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: d * 0.14, stagger: d * 0.06 }, s + d * 0.2);
  // The dash leaves Shopify and travels out along each link, then rests at
  // the middle of it (the final, static state).
  const dashes = all(el, "[data-dash]");
  tl.fromTo(dashes, { strokeDashoffset: 8 }, { strokeDashoffset: -100, duration: d * 0.3, stagger: d * 0.04 }, s + d * 0.36);
  tl.fromTo(
    dashes,
    { strokeDashoffset: 8 },
    { strokeDashoffset: -46, duration: d * 0.16, stagger: d * 0.04, immediateRender: false },
    s + d * 0.36 + d * 0.3 + d * 0.12,
  );
};

const tracking: Anim = (_gsap, tl, el, s, d) => {
  const bar = el.querySelector('[data-bar="After"]');
  const count = el.querySelector('[data-count="After"]');
  tl.fromTo(el.querySelector('[data-group="After"]'), { opacity: 0.35 }, { opacity: 1, duration: d * 0.15 }, s);
  tl.fromTo(bar, { scaleX: 54 / 96 }, { scaleX: 1, duration: d * 0.6, ease: "power2.inOut" }, s + d * 0.2);
  const n = { v: 54 };
  tl.fromTo(
    n,
    { v: 54 },
    {
      v: 96,
      duration: d * 0.6,
      ease: "power2.inOut",
      onUpdate: () => {
        if (count) count.textContent = String(Math.round(n.v));
      },
    },
    s + d * 0.2,
  );
};

const ANIMS: Anim[] = [ads, answer, flow, connect, tracking];

/**
 * Builds the scrubbed timeline for the pinned stage `pin` and hooks it to
 * scroll through `track`. Call inside gsap.matchMedia so it is reverted.
 */
export function buildStory(
  gsap: Gsap,
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger,
  pin: HTMLElement,
  track: HTMLElement,
) {
  const slides = all(pin, "[data-slide]");
  const items = all(pin, "[data-item]");
  const rail = pin.querySelector("[data-rail]");

  const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
  tl.to({}, { duration: 5 }, 0);
  tl.fromTo(rail, { scaleY: 0 }, { scaleY: 1, duration: 5 }, 0);

  gsap.set(slides, { opacity: 0, y: 24, scale: 0.98 });
  gsap.set(slides[0], { opacity: 1, y: 0, scale: 1 });
  for (let b = 1; b < slides.length; b++) {
    tl.fromTo(
      slides[b - 1],
      { opacity: 1, y: 0, scale: 1 },
      { opacity: 0, y: -24, scale: 0.98, duration: 0.2, ease: "power1.in", immediateRender: false },
      b - 0.2,
    );
    tl.fromTo(
      slides[b],
      { opacity: 0, y: 24, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "power1.out", immediateRender: false },
      b - 0.05,
    );
  }
  slides.forEach((slide, i) => ANIMS[i]?.(gsap, tl, slide, i + IN, LEN));

  // Each slide's headline number counts as its own window plays.
  const counters: { el: HTMLElement; to: number }[] = [];
  slides.forEach((slide, i) => {
    const el = slide.querySelector<HTMLElement>("[data-num-to]");
    const after = slide.querySelector("[data-num-after]");
    if (!el) return;
    const from = Number(el.dataset.numFrom);
    const to = Number(el.dataset.numTo);
    counters.push({ el, to });
    el.textContent = String(from);
    const s = i + IN;
    tl.fromTo(after, { opacity: 0.3 }, { opacity: 1, duration: LEN * 0.2, ease: "power1.out" }, s);
    const n = { v: from };
    tl.fromTo(
      n,
      { v: from },
      {
        v: to,
        duration: LEN * 0.6,
        ease: "power2.inOut",
        onUpdate: () => {
          el.textContent = String(Math.round(n.v));
        },
      },
      s + LEN * 0.2,
    );
  });

  // The active service follows the timeline (so it agrees with the stage
  // even while the scrub is catching up).
  let active = -1;
  const setActive = (i: number) => {
    if (i === active) return;
    active = i;
    items.forEach((item, n) => item.classList.toggle("is-active", n === i));
    pin.dataset.active = String(i);
  };
  setActive(0);
  tl.eventCallback("onUpdate", () => setActive(Math.min(slides.length - 1, Math.floor(tl.time() + 0.05))));

  const st = ScrollTrigger.create({
    trigger: track,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.6,
    animation: tl,
  });

  return () => {
    st.kill();
    tl.kill();
    // Text set by counters is not an inline style, so restore it by hand.
    counters.forEach(({ el, to }) => (el.textContent = String(to)));
    const trackCount = pin.querySelector('[data-count="After"]');
    if (trackCount) trackCount.textContent = "96";
    items.forEach((item, n) => item.classList.toggle("is-active", n === 0));
    delete pin.dataset.active;
  };
}
