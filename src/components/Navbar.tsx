import { useLayoutEffect, useState } from 'react';
import { site } from '../data/content';
import SkyToggle from './ui/sky-toggle';

export function Navbar() {
  const [theme, setTheme] = useState<'day' | 'night'>(() => {
    try {
      return window.localStorage.getItem('portfolio-theme') === 'day' ? 'day' : 'night';
    } catch {
      return 'night';
    }
  });

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem('portfolio-theme', theme);
    } catch {
      // The in-memory theme still works when storage is unavailable.
    }
  }, [theme]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4">
      {/*
        Legibility scrim: fades scrolling content out before it reaches the
        nav row, so the pill nav stays visually clear as the Hero heading
        scrolls past it. Invisible at rest — it only does anything once
        content scrolls underneath. Not a design element, purely functional.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-bg)]/70 to-transparent"
      />
      <nav
        className="relative mx-auto mt-4 flex w-fit items-center gap-6 rounded-full border border-[var(--color-border-soft)] bg-[var(--color-glass)] px-4 py-2 backdrop-blur-md"
        aria-label="Primary"
      >
        <a
          href="#hero"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-border-soft)] text-[11px] font-semibold tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
          aria-label="Home"
        >
          AH
        </a>

        <ul className="hidden items-center gap-5 text-sm text-[var(--color-text-muted)] md:flex">
          {site.navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="transition-colors hover:text-[var(--color-text)]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <SkyToggle checked={theme === 'night'} onChange={(isNight) => setTheme(isNight ? 'night' : 'day')} />

        <a
          href="#contact"
          className="rounded-full bg-[var(--color-nav-cta-bg)] px-4 py-1.5 text-xs font-medium text-[var(--color-nav-cta-text)] transition-opacity hover:opacity-85"
        >
          Let's Connect
        </a>
      </nav>
    </header>
  );
}
