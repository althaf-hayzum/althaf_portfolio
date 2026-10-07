# Althaf Hayzum — Portfolio (Sprint 1 Foundation)

Vite + React + TypeScript + Tailwind CSS v4 + GSAP/ScrollTrigger.

## What's in Sprint 1

- Navbar (glassmorphism, compact)
- Hero: timed name-intro sequence, main hero composition, green availability
  toggle
- ScrollPortrait: single persistent portrait image, config-driven scroll
  animation (see `src/animation/scrollPortrait.config.ts`)
- 5 remaining sections (`What I'm Great At`, `About`, `Skills`, `Projects`,
  `Contact`) exist as stub anchors with real DOM ids, ready for Sprint 2
- All copy other than the name is bracketed `[PLACEHOLDER]` text in
  `src/data/content.ts` — nothing about Althaf has been invented

## Requirements

- Node.js 18+ (built and tested on Node 22)

## Install and run

```bash
npm install
npm run dev
```

Open the local URL Vite prints (typically `http://localhost:5173`).

## Other commands

```bash
npm run build      # production build, output in dist/
npm run preview    # serve the production build locally
```

## Project structure

```
src/
  sections/     Hero.tsx (built), WhatIGreatAt/About/Skills/Projects/Contact (stubs)
  components/   Navbar, ScrollPortrait, AvailabilityToggle
  animation/    scrollPortrait.config.ts — edit waypoints/timing/easing here,
                not inside the components
  data/         content.ts — all editable copy, clearly marked placeholders
  assets/       portrait image
```

## Notes for the next pass (Codex / Sprint 2)

- Google Fonts (Space Grotesk, Inter) are loaded via `@import` in
  `src/index.css` — needs normal internet access to load; falls back to
  system fonts otherwise.
- The scroll-driven portrait's position, scale, rotation, opacity, and
  easing per section are all tunable in one place:
  `src/animation/scrollPortrait.config.ts`.
- The portrait's rendered width is a single shared constant
  (`portraitWidthClasses` in the same config file), used by both the actual
  image and Hero's reserved layout space — keep using that constant if you
  add more breakpoints, rather than hardcoding widths in either component.
