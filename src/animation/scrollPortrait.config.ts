// ---------------------------------------------------------------------------
// Scroll-driven portrait waypoints.
//
// Each entry describes where the portrait should be, and how it should look,
// while the given section is centered in the scroll journey. ScrollPortrait
// (src/components/ScrollPortrait.tsx) reads this list and builds a GSAP
// timeline from it — this file is the ONLY thing that should change when
// tuning position, timing, easing, scale, rotation, or opacity.
//
// x / y are percentages of the viewport, from the element's own center
// (so x: 0 = centered, x: 30 = 30% of viewport width to the right, etc).
// ---------------------------------------------------------------------------

export type PortraitWaypoint = {
  /** Must match the section's `id` in the DOM. */
  sectionId: string;
  x: number;
  /** Optional wider-desktop offset, used from 1280px upward. */
  wideX?: number;
  /** Optional wider-desktop scale, used from 1280px upward. */
  wideScale?: number;
  y: number;
  /** Optional mobile-only vertical offset, in viewport-height units. */
  mobileY?: number;
  scale: number;
  rotate: number;
  opacity: number;
  /** GSAP ease string for the transition INTO this waypoint. */
  ease: string;
  /** Fraction of the destination section where this waypoint is reached. */
  sectionProgress?: number;
};

export const scrollPortraitWaypoints: PortraitWaypoint[] = [
  {
    sectionId: 'hero',
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    opacity: 1,
    ease: 'none',
  },
  {
    sectionId: 'great-at',
    x: 28,
    wideX: 39,
    y: 0,
    scale: 0.9,
    wideScale: 0.98,
    rotate: 0,
    opacity: 1,
    ease: 'none',
    sectionProgress: 0.5,
  },
  {
    sectionId: 'about',
    x: -28,
    wideX: -38,
    y: 0,
    scale: 0.85,
    rotate: -3,
    opacity: 1,
    ease: 'power4.out',
    sectionProgress: 0.5,
  },
  {
    sectionId: 'skills',
    x: 0,
    y: 0,
    mobileY: -10,
    scale: 0.62,
    rotate: 0,
    opacity: 1,
    ease: 'none',
    // End the Skills hold exactly as its sticky viewport scene is released.
    sectionProgress: 2 / 3,
  },
  // From "skills" onward the portrait is done travelling — it fades out so
  // it doesn't overlap Projects/Contact, which have their own imagery.
  {
    sectionId: 'projects',
    x: 0,
    y: 0,
    mobileY: -10,
    scale: 0.62,
    rotate: 0,
    opacity: 0,
    ease: 'power1.out',
    // Start the exit at the Projects boundary and complete it during the
    // opening part of the horizontal showcase transition.
    sectionProgress: 0.12,
  },
];

// Single source of truth for the portrait's rendered width, used by both
// ScrollPortrait (the actual image) and Hero's reserved spacer. Keeping
// these in one place is what fixes the tablet-width overlap: previously the
// two components declared slightly different breakpoint values and drifted
// apart between ~768–900px. Edit here only.
export const portraitWidthClasses = 'w-[min(44vw,320px)] sm:w-[min(38vw,380px)]';

// How much of each section's scroll range is used to scrub the transition
// into that section's waypoint (0–1). Lower = snappier, higher = the motion
// stretches across more of the section's scroll.
export const scrubStrength = 0.6;
