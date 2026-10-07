import { useEffect, useState } from 'react';
import { greatAt, capabilities } from '../data/content';
import { CapabilityAccordion } from '../components/CapabilityAccordion';
import { portraitWidthClasses } from '../animation/scrollPortrait.config';

/**
 * Portrait itself is NOT rendered here — ScrollPortrait is a single fixed,
 * page-level component (mounted once in App.tsx) that arrives at this
 * section's waypoint (defined in scrollPortrait.config.ts) as the user
 * scrolls. The spacer below just reserves the matching layout space so the
 * text column doesn't run underneath it, exactly like Hero does.
 */
export function WhatIGreatAt() {
  const [openCapability, setOpenCapability] = useState<string | null>(() =>
    window.matchMedia('(min-width: 768px)').matches
      ? capabilities[0]?.id ?? null
      : null,
  );

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 768px)');
    const syncDefaultWithViewport = () => {
      setOpenCapability(desktopQuery.matches ? capabilities[0]?.id ?? null : null);
    };

    desktopQuery.addEventListener('change', syncDefaultWithViewport);
    return () => desktopQuery.removeEventListener('change', syncDefaultWithViewport);
  }, []);

  return (
    <section
      id="great-at"
      className="relative z-40 min-h-[200svh] overflow-x-clip border-t border-[var(--color-border-subtle)] px-6 md:px-16"
    >
      <div data-scroll-composition="great" className="sticky top-0 mx-auto grid min-h-[100svh] w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-0 py-20 md:grid-cols-[1fr_auto] md:gap-12 md:py-24">
        <div className="relative z-40 min-w-0">
          <p data-composition-step="great-label" className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] sm:text-xs">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)] shadow-[0_0_12px_var(--color-accent)]" aria-hidden="true" />
            {greatAt.eyebrow}
          </p>

          <h2
            data-composition-step="great-heading"
            className="text-left text-[clamp(1.9rem,8vw,6.5rem)] font-semibold uppercase leading-[0.84] tracking-[-0.075em] md:text-[clamp(4.25rem,7vw,7.5rem)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {greatAt.headingLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          <p data-composition-step="great-intro" className="mt-5 max-w-md text-left text-xs leading-relaxed text-[var(--color-text-muted)] sm:text-sm md:mt-6">
            {greatAt.intro}
          </p>

          <div className="mt-6 space-y-3 md:mt-10 md:space-y-4">
            {capabilities.map((capability, i) => (
              <CapabilityAccordion
                key={capability.id}
                index={i + 1}
                capability={capability}
                revealStep={`great-capability-${i + 1}`}
                open={openCapability === capability.id}
                onToggle={() =>
                  setOpenCapability((current) =>
                    current === capability.id ? null : capability.id,
                  )
                }
              />
            ))}
          </div>
        </div>

        <div
          className={`h-[42vh] min-w-0 justify-self-end md:h-[60vh] ${portraitWidthClasses}`}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
