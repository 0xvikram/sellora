const PHRASES = ["Fixed price", "No retainer to start", "Measured against your orders"];

// Oversized scrolling headline between sections.
export function Band() {
  const loop = [...PHRASES, ...PHRASES];
  return (
    <div className="overflow-hidden border-y border-line py-7 md:py-10" aria-hidden="true">
      <div className="band-track flex w-max items-center">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center">
            {loop.map((phrase, i) => (
              <span
                key={`${copy}-${i}`}
                className="flex items-center font-display text-6xl leading-none font-bold tracking-[-0.03em] whitespace-nowrap md:text-[7.5rem]"
              >
                <span className={i % 2 === 1 ? "text-outline" : ""}>{phrase}</span>
                <span className="accent-word mx-8 text-[0.7em] md:mx-14">✳</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
