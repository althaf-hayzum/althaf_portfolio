import { useState } from 'react';

/**
 * The "small green toggle" called out in the spec. Wired to real state
 * (on/off) rather than being purely decorative, since the brief doesn't
 * specify what it controls yet beyond signalling availability — this is a
 * reasonable default that's easy to repurpose later.
 */
export function AvailabilityToggle() {
  const [available, setAvailable] = useState(true);

  return (
    <button
      type="button"
      onClick={() => setAvailable((v) => !v)}
      aria-pressed={available}
      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-1.5 pr-3 text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
    >
      <span
        className={`relative flex h-4 w-7 items-center rounded-full transition-colors ${
          available ? 'bg-[var(--color-accent)]/30' : 'bg-white/10'
        }`}
      >
        <span
          className={`absolute h-3 w-3 rounded-full transition-transform ${
            available
              ? 'translate-x-3.5 bg-[var(--color-accent)]'
              : 'translate-x-0.5 bg-white/40'
          }`}
        />
      </span>
      {available ? 'Available for work' : 'Not taking work'}
    </button>
  );
}
