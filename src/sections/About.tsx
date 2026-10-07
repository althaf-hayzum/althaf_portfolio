import { about } from '../data/content';
import { portraitWidthClasses } from '../animation/scrollPortrait.config';

/**
 * Portrait arrives here at its "about" waypoint (x: -28, i.e. left of
 * center) via the existing ScrollPortrait/scrollPortrait.config system —
 * nothing scroll-related is implemented in this file. Since the portrait
 * settles on the LEFT for this section, text sits on the RIGHT (the mirror
 * of What I'm Great At, where portrait-right meant text-left) so the two
 * never compete for the same space.
 */
export function About() {
  return (
    <section
      id="about"
      className="relative z-40 min-h-[200svh] overflow-x-clip border-t border-[var(--color-border-subtle)] px-6 md:px-16"
    >
      <div className="sticky top-0 mx-auto grid min-h-[100svh] w-full max-w-6xl grid-cols-[0.85fr_1.15fr] items-center gap-0 py-20 md:grid-cols-[auto_1fr] md:gap-12 md:py-24">
        <div
          className={`order-1 h-[42vh] min-w-0 md:h-[60vh] ${portraitWidthClasses}`}
          aria-hidden="true"
        />

        <div data-scroll-composition="about" className="relative z-40 order-2 min-w-0 rounded-xl bg-[var(--color-bg)]/90 p-2 text-right backdrop-blur-sm md:rounded-none md:bg-transparent md:p-0 md:text-left md:backdrop-blur-none">
          <p
            data-composition-step="about-eyebrow"
            className="mb-3 text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-muted)] sm:text-xs"
          >
            — About Me —
          </p>

          <h2
            data-composition-step="about-heading"
            className="text-[clamp(2.5rem,9.2vw,7rem)] font-semibold uppercase leading-[0.78] tracking-[-0.08em] md:text-[clamp(5.5rem,10vw,10rem)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {about.heading}
          </h2>

          <div
            className="ml-auto mt-5 max-w-xl space-y-3 text-[11px] leading-relaxed text-[var(--color-text-muted)] sm:text-sm md:ml-0 md:mt-7 md:space-y-4 md:text-base"
          >
            {about.paragraphs.map((paragraph, index) => (
              <p key={paragraph} data-composition-step={`about-story-${index + 1}`}>
                {paragraph}
              </p>
            ))}
          </div>

          <a
            href="#contact"
            data-composition-step="about-contact"
            className="mt-6 inline-flex whitespace-nowrap items-center gap-2 border-b border-[var(--color-accent)]/50 pb-2 text-[9px] font-medium uppercase tracking-[0.12em] text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)] sm:gap-3 sm:text-xs md:mt-8 md:tracking-[0.2em]"
          >
            LET’S CONNECT
            <span aria-hidden="true" className="text-sm text-[var(--color-accent)]">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
