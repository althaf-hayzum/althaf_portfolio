// ---------------------------------------------------------------------------
// Mirrors the sizing formula baked into `portraitWidthClasses`
// (scrollPortrait.config.ts) and the portrait image's fixed aspect ratio, so
// other components — currently just SkillsNetwork — can compute the
// portrait's actual on-screen footprint at a given scale, in JS, instead of
// guessing at matching Tailwind breakpoints independently.
//
// This is exactly the class of bug Sprint 1's tablet-overlap fix addressed:
// two components each declaring their own approximation of the same
// quantity drift apart. Computing it once, from real numbers, can't drift.
//
// If portraitWidthClasses ever changes, update BASE_VW/BASE_CAP/SM_VW/SM_CAP
// to match — this file does not read those classes, it mirrors them.
// ---------------------------------------------------------------------------

const BASE_VW = 44;
const BASE_CAP = 320;
const SM_VW = 38;
const SM_CAP = 380;
const SM_BREAKPOINT = 640;
const ASPECT_RATIO = 4 / 3; // supplied portrait image's height / width

export function getPortraitRenderSize(viewportWidth: number, scale: number) {
  const baseWidth =
    viewportWidth >= SM_BREAKPOINT
      ? Math.min((SM_VW / 100) * viewportWidth, SM_CAP)
      : Math.min((BASE_VW / 100) * viewportWidth, BASE_CAP);

  const width = baseWidth * scale;
  const height = width * ASPECT_RATIO;

  return { width, height };
}
