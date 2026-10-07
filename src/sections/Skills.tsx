import { SkillsNetwork } from '../components/SkillsNetwork';

/**
 * Portrait arrives here at its "skills" waypoint (centered, scaled down —
 * see scrollPortrait.config.ts) via the existing ScrollPortrait system and
 * becomes the visual anchor the network sits around. The absolutely
 * positioned wrapper below is what centers the network precisely at the
 * section's center, matching where the fixed portrait actually rests.
 */
export function Skills() {
  return (
    <section
      id="skills"
      className="relative z-40 min-h-[300svh] border-t border-[var(--color-border-subtle)] px-6 md:px-16"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div data-scroll-composition="skills" className="absolute inset-0">
          <p data-skills-reveal="label" className="absolute left-1/2 top-16 z-30 -translate-x-1/2 text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-muted)] sm:top-20 sm:text-xs">
            Skills / Tools
          </p>
          <SkillsNetwork />
        </div>
      </div>
    </section>
  );
}
