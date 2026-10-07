# Althaf Hayzum Portfolio — Current Project Handoff

**Updated:** 2026-10-01  
**Purpose:** Complete technical snapshot for the next AI or developer. This document describes the source currently in this project folder; verify source before relying on any note here.

## Project overview

A responsive personal portfolio for Althaf Hayzum. The primary page order is Hero → What I’m Great At → About → Skills / Tools → Projects → Contact. It uses React 19, TypeScript 6, Vite 8, Tailwind CSS 4, GSAP 3 / ScrollTrigger, `simple-icons`, and `@lobehub/icons-static-svg`. The HAYZUMI case study is a separate path handled by a small pathname check in `App.tsx`; there is no routing library or backend.

Design direction: dark, editorial, cinematic, premium, and restrained, with a lime accent. Do not copy reference branding/assets/text or invent personal claims, project details, achievements, statistics, credentials, skill ratings, or contact information.

### Run locally

From the project root:

```sh
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

Use the local URL Vite prints; ports can vary. `build` runs TypeScript project checks and Vite production bundling. `lint` runs Oxlint. There is no test script. Google Fonts (Space Grotesk and Inter) are imported remotely in `src/index.css`; system fallbacks are provided.

## Architecture

- `src/main.tsx` mounts React and global styles.
- `src/App.tsx` renders one `Navbar`, one `ScrollPortrait`, then all six sections in order.
- `src/data/content.ts` stores editable portfolio text, capability records, skill groups, project placeholders, and contact placeholders.
- `src/animation/scrollPortrait.config.ts` is the source of truth for portrait waypoints and shared spacer sizing.
- `src/components/ScrollPortrait.tsx` owns the one persistent portrait and the shared GSAP/ScrollTrigger scroll timeline.
- `src/components/AriaCompanion.tsx` owns ARIA’s portrait-relative image element and pointer-to-pose behavior.
- `src/components/VapourText.tsx` renders the one-shot canvas text dissolve used by the JIBA caption.
- `src/sections/` contains Hero, Great At, About, Skills, Projects, and Contact.
- `src/sections/HayzumiCaseStudy.tsx` contains the HAYZUMI case-study page.
- `src/components/SkillsNetwork.tsx` renders skill icons/cards and currently hidden SVG connection paths.

Do not add duplicate portraits, section-specific portrait images, active-section teleporting, or a competing portrait ScrollTrigger.

## Persistent portrait and scroll choreography

`ScrollPortrait` is mounted once, outside `<main>`. It renders one fixed portrait card and transforms its inner element through one GSAP timeline tied to ScrollTrigger. Sections reserve layout space; they do not render their own portrait. The timeline includes section compositions and reveal choreography as well as portrait transforms. It scrubs both forward and backward. The intended animation grammar is portrait arrival → stop → content reveal → complete composition hold → departure.

The card uses `src/assets/images/portrait.png` (the `portrait.jpg` file is present but is not the imported source), `aspect-[3/4]`, `object-cover`, rounded clipping, and a 450px maximum height. The portrait and ARIA share the same transformed parent. Preserve portrait geometry, source, and waypoints unless directly requested.

Waypoints in `scrollPortrait.config.ts`:

| Section | x / wide x | y / mobile y | scale / wide scale | rotate | opacity | section progress |
|---|---:|---:|---:|---:|---:|---:|
| Hero | 0 | 0 | 1 | 0° | 1 | initial |
| Great At | 28 / 39 vw | 0 | .9 / .98 | 0° | 1 | .5 |
| About | -28 / -38 vw | 0 | .85 | -3° | 1 | .5 |
| Skills | 0 | 0 / -10vh mobile | .62 | 0° | 1 | 2/3 |
| Projects | 0 | 0 / -10vh mobile | .62 | 0° | 0 | 0 |

At Skills the portrait reaches its final visible anchor. The Projects waypoint is intended to fade it out at the boundary. Verify the transition and reverse direction in a live browser before making claims about exact boundary frames. Width/scale overrides apply at 1280px and above; mobile y applies through 767px. `portraitWidthClasses` coordinates section spacers and the portrait layout.

Reduced-motion preference skips the portrait scroll timeline and leaves the portrait at its Hero position.

## ARIA companion

ARIA is rendered by `AriaCompanion` inside the same portrait-relative wrapper as the portrait. Current box position is `left-[53%] top-[22%]`, `w-[32%]`, max-width 96px, with `object-contain`. The most recent requested horizontal placement change is therefore present in the source; do not move it unless asked.

The mouse system preloads 19 image frames, then updates one persistent `<img>` element. On fine-pointer/hover devices it reads horizontal `pointermove`/`pointerenter`, normalizes x over the visual viewport, smooths with `requestAnimationFrame` (60ms time constant), and uses hysteresis to reduce jitter. The selected seven directional poses are discrete frames (far-left, left, slight-left, center, slight-right, right, far-right); smoothing is applied to position before thresholds, not image blending. Touch pointer movement is ignored; other devices use center pose. Event listeners and pending RAF are removed on unmount.

Scroll moves the shared portrait parent; pointer x changes only ARIA’s pose. Do not animate ARIA’s bounding box, add another ScrollTrigger, or make the portrait follow the cursor. A prior user screenshot reported gaze direction mismatch; no controlled mapping correction has been confirmed. Reproduce and test cursor x vs. actual pose before changing the map.

Pose files selected from `public/aria-3d/`: `aria_04.png`, `_05.png`, `_06.png`, `_08.png`, `_11.png`, `_12.png`, `_13.png`. The standard preload set is `public/aria/aria_01.png` through `_19.png`.

## Current state of each section

### Hero

- Editorial name: Althaf Hayzum; right-side title: “DIGITAL RESEARCH ALCHEMIST”; supporting copy is in `src/data/content.ts`.
- A timed GSAP name intro reveals the main Hero without scroll. Respect the current Hero composition and intro behavior unless a request specifically scopes it.
- JIBA is a temporary annotation near the portrait/ARIA: `JIBA ↗`, caption “My little annoying Jinnie” using `VapourText`, small sparkle accents, and a thin curved SVG annotation arrow. The arrow is positioned outside the portrait and aims toward ARIA. The small ↗ is text separate from the curved arrow.
- JIBA group enters together after the Hero settles, holds for about five seconds, then fades together. The caption’s particle dissolve has custom hold/dissolve durations aligned with that exit. This is time-based, not scroll-triggered. Reduced-motion mode hides the intro annotation.
- Latest JIBA polish touched only the caption, sparkles, and arrow stroke geometry/treatment. Do not change its position/timing or the rest of Hero unless requested.

### What I’m Great At

- `src/sections/WhatIGreatAt.tsx` is a 200svh sticky scene with a left editorial heading/description and two accordion capabilities; it reserves space for the persistent portrait at the opposite side.
- Actual capabilities are UI/UX Designing and AI Exploration. Supporting details remain placeholders in `content.ts`.
- Accordion uses local state and a grid-row reveal; UI/UX starts open.
- User approved and locked this composition and choreography. Avoid unrelated changes.

### About / Who Am I?

- `src/sections/About.tsx` is a 200svh sticky composition. Portrait rests at the left waypoint; text is on the right.
- “WHO AM I?” title, two paragraph placeholders, and a link to Contact. No social links or biography facts are present.
- Content reveals through the shared portrait timeline after arrival; preserve current choreography unless asked.

### Skills / Tools

- `src/sections/Skills.tsx` provides a 300svh sticky scene. `SkillsNetwork.tsx` has icon-based cards for Design (Figma, Framer, UI/UX), Development (JavaScript, React, TypeScript), AI (AI / AI Tools, ChatGPT, Claude, Gemini, Cursor, Codex), and Motion & 3D (GSAP, Three.js, React Three Fiber).
- Desktop places nodes around the centered portrait; mobile uses a compact category layout. No percentages are provided or shown.
- Shared timeline reveals the label/nodes after portrait arrival and holds the composition.
- Connection SVG markup and autonomous flow code exist, but the visible connection SVG has a Tailwind `hidden` class from the user’s line-removal request. Do not show the lines again unless asked.

### Projects

- `src/sections/Projects.tsx` is a 300svh horizontal-scroll scene with exactly three positions. Reduced motion stacks them vertically.
- Position 02 now presents a concise HAYZUMI / AI COUNCIL teaser, the supplied summary and category line, and a `Details ↗` link. Positions 01 and 03 remain empty until project material is supplied.
- The Details link opens `/projects/hayzumi`. The case-study page contains the requested introduction, idea, problem, approach, process, key features, technology list, and the supplied HAYZUMI screenshot.
- The screenshot is stored at `src/assets/images/hayzumi-council.png` and was copied unchanged from the supplied image (SHA-256 verified). The case study is static portfolio content; it does not embed or connect to the live Hayzumi application.
- `content.ts` still contains older placeholder project records that are not used by these visual positions.
- Portrait is intended to finish/fade before Projects; verify the section boundary if touching scroll behavior.

### Contact / Let’s Connect

- `src/sections/Contact.tsx` includes an editorial heading and a responsive local form with name, email, topic, and message fields.
- Submit prevents default and displays a preview notice; it sends or stores nothing. Supporting copy and email address are placeholders. No email provider/backend is configured.

## Assets and important files

- Portrait: `src/assets/images/portrait.png` active; `src/assets/images/portrait.jpg` also present.
- HAYZUMI screenshot: `src/assets/images/hayzumi-council.png` (the user-supplied screenshot, unchanged).
- ARIA standard frames: `public/aria/`; high-resolution directional poses: `public/aria-3d/`.
- Favicon: `public/favicon.svg`.
- GSAP/ScrollTrigger: `src/components/ScrollPortrait.tsx`, `src/animation/scrollPortrait.config.ts`.
- Hero/JIBA: `src/sections/Hero.tsx`, `src/components/VapourText.tsx`.
- Projects and HAYZUMI case study: `src/sections/Projects.tsx`, `src/sections/HayzumiCaseStudy.tsx`, and the pathname dispatch in `src/App.tsx`.
- Content: `src/data/content.ts`.
- Theme/fonts/reduced-motion styles: `src/index.css`.
- Dependencies/scripts: `package.json`, `package-lock.json`; Vite config: `vite.config.ts`; TypeScript configs: `tsconfig*.json`; lint config: `.oxlintrc.json`.

`README.md` still describes an early Sprint 1 stub state and is outdated; this handoff and current source reflect the later implementation.

## Current validation and known limitations

As of 2026-10-01, `npm run build` and `npm run lint` pass with the HAYZUMI case study included. The live browser check verified that `/projects/hayzumi` renders, the supplied screenshot loads, the Projects `Details` link navigates to the case study, and the detail layout has no horizontal overflow at a 390px viewport. Desktop presentation was visually inspected at 1440×900. The screenshot asset's SHA-256 matched the supplied file.

Known unfinished items / limitations:

1. Replace remaining bracketed placeholder copy with Althaf-provided real text (Great At details, About paragraphs, project details, Contact copy/email).
2. Add content for ALBEEFY and Project 03 only when Althaf supplies approved material; do not invent it.
3. Connect the Contact form only after a destination/service is provided.
4. Recheck ARIA gaze mapping against pointer position at a normal desktop viewport.
5. Recheck portrait forward/reverse motion and the Skills-to-Projects fade boundary at wide desktop, tablet, and mobile sizes.
6. The HAYZUMI detail page is descriptive/static content; no backend, working demo, or external project link is configured.
7. Google Fonts require network access; fallback fonts are configured.

There is no known need for a broad redesign or architecture rewrite. The next task should be chosen by the user; likely next work is supplying real content and completing the visual/browser verification items above.

## Locked constraints for future work

- Keep the approved dark editorial design, typography, navbar, and section structure.
- Preserve one persistent portrait and its GSAP/ScrollTrigger system; keep it centered/right/left/center across Hero → Great At → About → Skills, then fade it out before Projects.
- Preserve the Great At composition. Preserve the Hero/ARIA/JIBA composition unless a task directly scopes a change.
- ARIA remains attached to the portrait; scroll and pointer pose remain independent.
- Do not invent personal facts, fake outcomes, skills percentages, certifications, or project content.
- No Projects/Contact/backend expansion beyond the implemented placeholders until requested.
- Skills connection paths remain hidden unless explicitly requested.

## Latest project handoff archive

The latest archive is `Althaf-Hayzum-Portfolio-Project-Handoff-2026-10-01.zip`. It contains the current project files, source code, imported and public assets (including the portrait, ARIA frames, and HAYZUMI screenshot), built `dist/`, package manifest and lockfile, TypeScript/Vite/lint configuration, README, and this handoff. It excludes `.git`, `node_modules`, older ZIP backups, and the local Windows shortcut. Restore dependencies with `npm install` from `package-lock.json`.
