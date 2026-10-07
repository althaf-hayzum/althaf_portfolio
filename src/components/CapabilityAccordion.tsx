type Capability = {
  id: string;
  title: string;
  details: string;
  explore: string[];
};

type Props = {
  index: number;
  capability: Capability;
  revealStep?: string;
  open: boolean;
  onToggle: () => void;
};

/**
 * A single expandable capability row. Expansion uses the CSS
 * grid-template-rows 0fr→1fr technique (animatable, no need to measure
 * content height in JS, and it just works with arbitrary content length).
 *
 * Hover glow is intentionally on every row (consistent affordance that
 * "this is interactive"), with UI/UX Designing getting the more pronounced
 * treatment the brief calls out specifically.
 */
export function CapabilityAccordion({ index, capability, revealStep, open, onToggle }: Props) {
  const isFeatured = capability.id === 'uiux';
  const panelId = `capability-panel-${capability.id}`;

  return (
    <div
      data-composition-step={revealStep}
      className={`group rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface)]/90 px-2.5 py-3.5 shadow-[0_12px_40px_-30px_var(--color-shadow)] transition-[border-color,background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-[var(--color-border)] hover:bg-[var(--color-surface)] sm:px-5 sm:py-5 ${
        isFeatured
          ? 'hover:shadow-[0_0_40px_-12px_var(--color-accent)]'
          : 'hover:shadow-[0_0_24px_-14px_var(--color-shadow)]'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-1.5 text-left sm:gap-4"
      >
        <span className="text-[10px] text-[var(--color-accent)]/80 tabular-nums sm:text-xs">
          {String(index).padStart(2, '0')}
        </span>
        <span
          className={`min-w-0 flex-1 text-xs font-medium leading-tight tracking-tight transition-colors sm:text-lg md:text-xl ${
            isFeatured ? 'group-hover:text-[var(--color-accent)]' : 'group-hover:text-[var(--color-text)]'
          }`}
        >
          {capability.title}
        </span>
        <svg
          viewBox="0 0 24 24"
          className={`h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)] transition-transform duration-300 sm:h-4 sm:w-4 ${
            open ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        id={panelId}
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="max-w-md pb-1 pl-5 pt-3 text-[11px] leading-relaxed text-[var(--color-text-muted)] sm:pl-12 sm:pt-4 sm:text-sm">
            {capability.details}
          </p>
          <p className="max-w-md pb-1 pl-5 pt-2 text-[10px] leading-relaxed text-[var(--color-text-soft)] sm:pl-12 sm:text-xs">
            <span className="mr-2 font-medium uppercase tracking-[0.12em] text-[var(--color-accent)]/80">
              Explore
            </span>
            {capability.explore.join(' · ')}
          </p>
        </div>
      </div>
    </div>
  );
}
