import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import portraitSrc from '../assets/images/portrait.png';
import { AriaCompanion } from './AriaCompanion';
import {
  scrollPortraitWaypoints,
  scrubStrength,
} from '../animation/scrollPortrait.config';

gsap.registerPlugin(ScrollTrigger);

/**
 * Fixed, single-instance portrait that travels between sections as the user
 * scrolls. Position/scale/rotation/opacity per section live entirely in
 * scrollPortrait.config.ts — this component just reads that list and wires
 * it to ScrollTrigger. Don't hardcode new positions here; add/edit waypoints
 * in the config instead.
 */
export function ScrollPortrait() {
  const portraitRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const [first, ...rest] = scrollPortraitWaypoints;
    if (!portraitRef.current || !first) return;
    const getWaypointY = (
      waypoint: (typeof scrollPortraitWaypoints)[number],
    ) =>
      window.matchMedia('(max-width: 767px)').matches
        ? waypoint.mobileY ?? waypoint.y
        : waypoint.y;
    const getWaypointX = (
      waypoint: (typeof scrollPortraitWaypoints)[number],
    ) =>
      window.innerWidth >= 1280
        ? waypoint.wideX ?? waypoint.x
        : waypoint.x;
    const getWaypointScale = (
      waypoint: (typeof scrollPortraitWaypoints)[number],
    ) =>
      window.innerWidth >= 1280
        ? waypoint.wideScale ?? waypoint.scale
        : waypoint.scale;

    const getComposition = (sectionId: string) => {
      const compositionName =
        sectionId === 'great-at'
          ? 'great'
          : sectionId === 'about'
            ? 'about'
            : sectionId === 'skills'
              ? 'skills'
              : sectionId === 'hero'
                ? 'hero'
                : null;
      return compositionName
        ? document.querySelector<HTMLElement>(
            `[data-scroll-composition="${compositionName}"]`,
          )
        : null;
    };

    const sectionSteps: Record<string, Array<[string, number, number]>> = {
      'great-at': [
        ['great-label', 0.01, 0.06],
        ['great-heading', 0.08, 0.1],
        ['great-intro', 0.2, 0.09],
        ['great-capability-1', 0.32, 0.08],
        ['great-capability-2', 0.42, 0.08],
        ['great-capability-3', 0.52, 0.08],
        ['great-capability-4', 0.62, 0.08],
        ['great-capability-5', 0.72, 0.08],
      ],
      about: [
        ['about-eyebrow', 0.01, 0.05],
        ['about-heading', 0.07, 0.14],
        ['about-story-1', 0.24, 0.12],
        ['about-story-2', 0.4, 0.12],
        ['about-contact', 0.6, 0.12],
      ],
    };

    let timeline: gsap.core.Timeline | undefined;
    let skillFlowTimeline: gsap.core.Timeline | undefined;
    let skillFlowWindow = { start: Infinity, end: -Infinity };
    const skillGeometry = new Map<
      SVGPathElement,
      { start: { x: number; y: number }; end: { x: number; y: number }; seed: number }
    >();
    const lightningGeneration = new WeakMap<SVGPathElement, number>();
    let refreshFrame = 0;
    let stopTracking = () => {};

    const ctx = gsap.context(() => {
      gsap.set(portraitRef.current, {
        x: `${getWaypointX(first)}vw`,
        y: `${getWaypointY(first)}vh`,
        scale: getWaypointScale(first),
        rotate: first.rotate,
        opacity: first.opacity,
      });

      if (reduceMotion) return; // keep the portrait in its hero position, no scroll-linked motion

      const heroComposition = getComposition('hero');
      const greatComposition = getComposition('great-at');
      const aboutComposition = getComposition('about');
      const skillsComposition = getComposition('skills');

      gsap.set(heroComposition, { x: 0, scale: 1 });
      gsap.set(greatComposition, { x: '8vw', opacity: 0 });
      gsap.set(aboutComposition, { x: '-8vw', opacity: 0 });
      gsap.set(skillsComposition, { y: '4vh', scale: 0.92, opacity: 0 });
      document
        .querySelectorAll<HTMLElement>('[data-composition-step]')
        .forEach((element) => gsap.set(element, { y: 24, opacity: 0 }));

      const skillsLabel = document.querySelector<HTMLElement>(
        '[data-skills-reveal="label"]',
      );
      const skillNodes = gsap.utils.toArray<HTMLElement>(
        '[data-skill-node]',
      );
      const skillItems = gsap.utils.toArray<HTMLElement>(
        '[data-skill-item]',
      );
      const skillConnections = gsap.utils.toArray<SVGPathElement>(
        '[data-skill-connection]',
      );
      const skillBranches = gsap.utils.toArray<SVGPathElement>(
        '[data-skill-branch]',
      );
      const skillCores = gsap.utils.toArray<SVGPathElement>(
        '[data-skill-core]',
      );
      const skillConnectionTrails = gsap.utils.toArray<SVGPathElement>(
        '[data-skill-trail]',
      );
      const skillSecondaryTrails = gsap.utils.toArray<SVGPathElement>(
        '[data-skill-trail-secondary]',
      );
      const skillGradients = gsap.utils.toArray<SVGLinearGradientElement>(
        '[data-skill-gradient]',
      );
      gsap.set(skillsLabel, { y: 16, opacity: 0 });
      gsap.set(skillNodes, { y: 20, scale: 0.97, opacity: 0 });
      gsap.set(skillItems, { y: 6, opacity: 0 });
      gsap.set(
        [
          ...skillConnections,
          ...skillBranches,
          ...skillCores,
          ...skillConnectionTrails,
          ...skillSecondaryTrails,
        ],
        { opacity: 0 },
      );

      const regenerateSkillPath = (
        path: SVGPathElement,
        generation = (lightningGeneration.get(path) ?? 0) + 1,
      ) => {
        const geometry = skillGeometry.get(path);
        if (!geometry) return;
        const previousLength = path.getTotalLength() || 1;
        lightningGeneration.set(path, generation);

        const { start, end, seed } = geometry;
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const distance = Math.hypot(dx, dy) || 1;
        const directionX = dx / distance;
        const directionY = dy / distance;
        const normalX = -directionY;
        const normalY = directionX;
        const sample = (salt: number) => {
          const raw = Math.sin((seed + generation * 97.13 + salt * 31.71) * 12.9898) * 43758.5453;
          return raw - Math.floor(raw);
        };
        const segmentCount = 7 + (seed % 3);
        const amplitude = Math.min(54, Math.max(22, distance * 0.15));
        const points = [start];

        for (let index = 1; index < segmentCount; index += 1) {
          const progress = index / segmentCount;
          const envelope = Math.pow(Math.sin(Math.PI * progress), 0.78);
          const lateral = (sample(index * 2) * 2 - 1) * amplitude * envelope;
          const longitudinal = (sample(index * 2 + 1) * 2 - 1) * 9 * envelope;
          points.push({
            x: start.x + dx * progress + normalX * lateral + directionX * longitudinal,
            y: start.y + dy * progress + normalY * lateral + directionY * longitudinal,
          });
        }
        points.push(end);

        let d = `M ${points[0].x} ${points[0].y}`;
        points.slice(1).forEach((point) => {
          d += ` L ${point.x} ${point.y}`;
        });

        // Small, temporary forks add a little crackle without turning every
        // strand into a repeated branch diagram.
        let branchD = '';
        if (sample(997) > 0.72) {
          const branchIndex = 2 + Math.floor(sample(998) * Math.max(1, segmentCount - 4));
          const origin = points[branchIndex];
          const polarity = sample(999) > 0.5 ? 1 : -1;
          const branchLength = 10 + sample(1000) * 16;
          const elbow = {
            x: origin.x - directionX * branchLength * 0.18 + normalX * polarity * branchLength * 0.58,
            y: origin.y - directionY * branchLength * 0.18 + normalY * polarity * branchLength * 0.58,
          };
          const tip = {
            x: origin.x - directionX * branchLength * 0.38 + normalX * polarity * branchLength,
            y: origin.y - directionY * branchLength * 0.38 + normalY * polarity * branchLength,
          };
          branchD = `M ${origin.x} ${origin.y} L ${elbow.x} ${elbow.y} L ${tip.x} ${tip.y}`;
        }

        path.setAttribute('d', d);
        const length = path.getTotalLength();
        path.setAttribute('stroke-width', `${3.5 + sample(1003) * 2.2}`);
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: 0 });
        const link = path.dataset.skillLink;
        const mode = path.dataset.skillLayout;
        const branch = skillBranches.find(
          (candidate) =>
            candidate.dataset.skillLayout === mode &&
            candidate.dataset.skillLink === link,
        );
        if (branch) {
          branch.setAttribute('d', branchD);
          branch.setAttribute('stroke-width', `${1.3 + sample(1004) * 1.4}`);
          gsap.set(branch, { opacity: branchD ? 0.88 : 0 });
        }
        const core = skillCores.find(
          (candidate) =>
            candidate.dataset.skillLayout === mode &&
            candidate.dataset.skillLink === link,
        );
        if (core) {
          core.setAttribute('d', d);
          gsap.set(core, { strokeDasharray: length, strokeDashoffset: 0 });
        }
        [skillConnectionTrails, skillSecondaryTrails].forEach((trails) => {
          const trail = trails.find(
            (candidate) =>
              candidate.dataset.skillLayout === mode &&
              candidate.dataset.skillLink === link,
          );
          if (!trail) return;
          const offset = Number(gsap.getProperty(trail, 'strokeDashoffset')) || 0;
          const pulseLength = trails === skillConnectionTrails
            ? Math.min(24, Math.max(12, length * 0.18))
            : Math.min(9, Math.max(6, length * 0.08));
          trail.setAttribute('d', d);
          gsap.set(trail, {
            strokeDasharray: `${pulseLength} ${length}`,
            strokeDashoffset: (offset / previousLength) * length,
          });
        });
      };

      const layoutSkillConnections = () => {
        const svg = document.querySelector<SVGSVGElement>(
          '[data-skill-connections]',
        );
        const portraitCard = document.querySelector<HTMLElement>(
          '[data-portrait-card]',
        );
        if (!svg || !portraitCard || !skillsComposition) return;

        const width = svg.clientWidth;
        const height = svg.clientHeight;
        if (width === 0 || height === 0) return;
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

        const compositionScale = Number(
          gsap.getProperty(skillsComposition, 'scale'),
        ) || 1;
        const svgRect = svg.getBoundingClientRect();
        const portraitWaypoint = scrollPortraitWaypoints.find(
          ({ sectionId }) => sectionId === 'skills',
        );
        const portraitScale = portraitWaypoint
          ? getWaypointScale(portraitWaypoint)
          : 1;
        const portraitCenter = { x: width / 2, y: height / 2 };
        const portraitHalfWidth = (portraitCard.offsetWidth * portraitScale) / 2;
        const portraitHalfHeight = (portraitCard.offsetHeight * portraitScale) / 2;
        const mobile = window.matchMedia('(max-width: 639px)').matches;
        const mode = mobile ? 'mobile' : 'desktop';

        const edgePoint = (
          centerX: number,
          centerY: number,
          halfWidth: number,
          halfHeight: number,
          dx: number,
          dy: number,
          direction: 1 | -1,
        ) => {
          const xScale = Math.abs(dx) > 0.001 ? halfWidth / Math.abs(dx) : Infinity;
          const yScale = Math.abs(dy) > 0.001 ? halfHeight / Math.abs(dy) : Infinity;
          const scale = Math.min(xScale, yScale);
          return {
            x: centerX + dx * scale * direction,
            y: centerY + dy * scale * direction,
          };
        };

        skillConnections.forEach((path) => {
          if (path.dataset.skillLayout !== mode) return;
          const link = path.dataset.skillLink;
          const source = Array.from(
            document.querySelectorAll<HTMLElement>('[data-skill-link]'),
          ).find(
            (element) =>
              element.dataset.skillLink === link &&
              element.closest<HTMLElement>('[data-skills-layout]')?.dataset
                .skillsLayout === mode,
          );
          if (!source || source.getClientRects().length === 0) {
            path.setAttribute('d', '');
            return;
          }

          const rect = source.getBoundingClientRect();
          let localY = 0;
          let ancestor: HTMLElement | null = source;
          while (ancestor && ancestor !== skillsComposition) {
            if (ancestor === source || ancestor.hasAttribute('data-skill-node')) {
              localY += Number(gsap.getProperty(ancestor, 'y')) || 0;
            }
            ancestor = ancestor.parentElement;
          }
          const sourceCenter = {
            x: (rect.left + rect.width / 2 - svgRect.left) / compositionScale,
            y:
              (rect.top + rect.height / 2 - svgRect.top) / compositionScale -
              localY,
          };
          const dx = portraitCenter.x - sourceCenter.x;
          const dy = portraitCenter.y - sourceCenter.y;
          const start = edgePoint(
            sourceCenter.x,
            sourceCenter.y,
            source.offsetWidth / 2,
            source.offsetHeight / 2,
            dx,
            dy,
            1,
          );
          const end = edgePoint(
            portraitCenter.x,
            portraitCenter.y,
            portraitHalfWidth + 2,
            portraitHalfHeight + 2,
            dx,
            dy,
            -1,
          );
          const curveSeed = Array.from(link ?? '').reduce(
            (value, character, index) =>
              (value + character.charCodeAt(0) * (index + 1)) % 997,
            0,
          );
          skillGeometry.set(path, { start, end, seed: curveSeed });
          regenerateSkillPath(path, 0);

          const gradient = skillGradients.find(
            (candidate) =>
              candidate.dataset.skillGradientLayout === mode &&
              candidate.dataset.skillGradientLink === link,
          );
          if (gradient) {
            gradient.setAttribute('x1', `${start.x}`);
            gradient.setAttribute('y1', `${start.y}`);
            gradient.setAttribute('x2', `${end.x}`);
            gradient.setAttribute('y2', `${end.y}`);
            gradient.dataset.flowDx = `${dx}`;
            gradient.dataset.flowDy = `${dy}`;
          }

        });

        skillConnections.forEach((path) => {
          if (!path.getAttribute('d')) return;
          const length = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
            opacity: 0,
            attr: { strokeOpacity: 0.58 },
          });
          const trail = skillConnectionTrails.find(
            (candidate) =>
              candidate.dataset.skillLayout === path.dataset.skillLayout &&
              candidate.dataset.skillLink === path.dataset.skillLink,
          );
          const branch = skillBranches.find(
            (candidate) =>
              candidate.dataset.skillLayout === path.dataset.skillLayout &&
              candidate.dataset.skillLink === path.dataset.skillLink,
          );
          if (branch) gsap.set(branch, { opacity: 0 });
          const core = skillCores.find(
            (candidate) =>
              candidate.dataset.skillLayout === path.dataset.skillLayout &&
              candidate.dataset.skillLink === path.dataset.skillLink,
          );
          if (core) {
            gsap.set(core, {
              strokeDasharray: length,
              strokeDashoffset: length,
              opacity: 0,
            });
          }
          if (trail) {
            gsap.set(trail, {
              strokeDasharray: `${Math.min(24, Math.max(12, length * 0.18))} ${length}`,
              strokeDashoffset: 0,
              opacity: 0,
            });
          }
          const secondaryTrail = skillSecondaryTrails.find(
            (candidate) =>
              candidate.dataset.skillLayout === path.dataset.skillLayout &&
              candidate.dataset.skillLink === path.dataset.skillLink,
          );
          if (secondaryTrail) {
            gsap.set(secondaryTrail, {
              strokeDasharray: `${Math.min(9, Math.max(6, length * 0.08))} ${length}`,
              strokeDashoffset: 0,
              opacity: 0,
            });
          }
        });
      };

      const syncSkillFlow = () => {
        // ScrollTrigger's tween playhead can be scaled to the master timeline
        // duration after refresh. Use document scroll coordinates so this
        // autonomous loop is gated by the exact Skills scene boundaries.
        const playhead = window.scrollY;
        if (
          skillFlowTimeline &&
          playhead >= skillFlowWindow.start &&
          playhead < skillFlowWindow.end
        ) {
          if (skillFlowTimeline.paused()) skillFlowTimeline.play();
        } else {
          skillFlowTimeline?.pause();
        }
      };

      const buildTimeline = () => {
        timeline?.scrollTrigger?.kill();
        timeline?.kill();
        skillFlowTimeline?.kill();
        skillFlowWindow = { start: Infinity, end: -Infinity };
        layoutSkillConnections();

        const skillMode = window.matchMedia('(max-width: 639px)').matches
          ? 'mobile'
          : 'desktop';
        skillFlowTimeline = gsap.timeline({
          repeat: -1,
          paused: true,
          defaults: { ease: 'none' },
        });
        skillConnections
          .filter(
            (path) =>
              path.dataset.skillLayout === skillMode &&
              Boolean(path.getAttribute('d')),
          )
          .forEach((path, index) => {
            const length = path.getTotalLength();
            const trail = skillConnectionTrails.find(
              (candidate) =>
                candidate.dataset.skillLayout === skillMode &&
                candidate.dataset.skillLink === path.dataset.skillLink,
            );
            const secondary = skillSecondaryTrails.find(
              (candidate) =>
                candidate.dataset.skillLayout === skillMode &&
                candidate.dataset.skillLink === path.dataset.skillLink,
            );
            const gradient = skillGradients.find(
              (candidate) =>
                candidate.dataset.skillGradientLayout === skillMode &&
                candidate.dataset.skillGradientLink === path.dataset.skillLink,
            );
            const phase = (index % 5) * 0.09;
            const travelDuration = 2.3 + (index % 4) * 0.27;
            if (gradient) {
              const x1 = Number(gradient.getAttribute('x1')) || 0;
              const y1 = Number(gradient.getAttribute('y1')) || 0;
              const x2 = Number(gradient.getAttribute('x2')) || 0;
              const y2 = Number(gradient.getAttribute('y2')) || 0;
              const dx = Number(gradient.dataset.flowDx) || 0;
              const dy = Number(gradient.dataset.flowDy) || 0;
              skillFlowTimeline?.fromTo(
                gradient,
                { attr: { x1, y1, x2, y2 } },
                {
                  attr: { x1: x1 + dx, y1: y1 + dy, x2: x2 + dx, y2: y2 + dy },
                  duration: travelDuration,
                  ease: 'none',
                  immediateRender: false,
                },
                phase,
              );
            }
            if (trail) {
              skillFlowTimeline?.fromTo(
                trail,
                { strokeDashoffset: 0, opacity: 0 },
                {
                  strokeDashoffset: -length,
                  opacity: 0.98,
                  duration: travelDuration * 0.9,
                  ease: 'none',
                  immediateRender: false,
                },
                phase,
              );
              skillFlowTimeline?.to(
                trail,
                { opacity: 0, duration: travelDuration * 0.1 },
                phase + travelDuration * 0.9,
              );
            }
            if (secondary) {
              skillFlowTimeline?.fromTo(
                secondary,
                { strokeDashoffset: 0, opacity: 0 },
                {
                  strokeDashoffset: -length,
                  opacity: 0.64,
                  duration: travelDuration * 0.72,
                  ease: 'none',
                  immediateRender: false,
                },
                phase + travelDuration * 0.22,
              );
              skillFlowTimeline?.to(
                secondary,
                { opacity: 0, duration: travelDuration * 0.1 },
                phase + travelDuration * 0.94,
              );
            }
            // Let every strand crackle at its own rhythm while the master
            // ScrollTrigger gates this autonomous, repeating energy clock.
            const flickerInterval = 0.22 + (index % 4) * 0.035;
            let flickerAt = 0.1 + (index % 7) * 0.025;
            while (flickerAt < 3.25) {
              skillFlowTimeline?.call(
                () => regenerateSkillPath(path),
                [],
                flickerAt,
              );
              skillFlowTimeline?.to(
                path,
                { attr: { strokeOpacity: 0.95 }, duration: 0.045 },
                flickerAt,
              );
              skillFlowTimeline?.to(
                path,
                { attr: { strokeOpacity: 0.58 }, duration: 0.18, ease: 'power1.out' },
                flickerAt + 0.045,
              );
              flickerAt += flickerInterval;
            }
          });

        const waypoints = rest.flatMap((waypoint) => {
          const sectionEl = document.getElementById(waypoint.sectionId);
          if (!sectionEl) return [];

          // Anchor each destination to its existing section timing, then put
          // every segment on one timeline so ScrollTriggers cannot compete.
          const sectionTop =
            sectionEl.getBoundingClientRect().top + window.scrollY;
          const sectionHeight = sectionEl.offsetHeight;
          const scrollPosition =
            sectionTop +
            sectionHeight * (waypoint.sectionProgress ?? scrubStrength);

          return [{ waypoint, sectionTop, sectionHeight, scrollPosition }];
        });

        const lastWaypoint = waypoints.at(-1);
        if (!lastWaypoint || !portraitRef.current) return;

        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: document.body,
            start: 0,
            end: () => `+=${lastWaypoint.scrollPosition}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: syncSkillFlow,
          },
        });

        let previousScrollPosition = 0;
        let previousSectionId = first.sectionId;
        waypoints.forEach(({ waypoint, sectionTop, scrollPosition }) => {
          const duration = Math.max(0, scrollPosition - previousScrollPosition);
          if (duration === 0) return;

          const segmentStart = previousScrollPosition;

          // Great At uses the section's entrance as the arrival point, then
          // holds the portrait through the full content reveal. Skills lands
          // before its staged reveal and holds through the next section's
          // opening beat before travelling onward.
          let portraitTweenStart = segmentStart;
          let portraitTweenDuration = duration;
          if (waypoint.sectionId === 'great-at') {
            portraitTweenDuration = Math.min(
              duration,
              Math.max(0, sectionTop - segmentStart),
            );
          } else if (waypoint.sectionId === 'about') {
            portraitTweenDuration = Math.min(
              duration,
              Math.max(0, sectionTop - segmentStart),
            );
          } else if (waypoint.sectionId === 'skills') {
            const departingAbout = previousSectionId === 'about';
            portraitTweenStart = departingAbout
              ? segmentStart
              : segmentStart + duration * 0.14;
            portraitTweenDuration = duration * (departingAbout ? 0.46 : 0.32);
          } else if (
            waypoint.sectionId === 'projects' &&
            previousSectionId === 'skills'
          ) {
            // Keep the final Skills anchor unchanged until Projects begins;
            // the portrait then fades out over the opening showcase interval.
            portraitTweenStart = sectionTop;
            portraitTweenDuration = Math.max(0, scrollPosition - sectionTop);
          }
          timeline?.to(
            portraitRef.current,
            {
              x: `${getWaypointX(waypoint)}vw`,
              y: `${getWaypointY(waypoint)}vh`,
              scale: getWaypointScale(waypoint),
              rotate: waypoint.rotate,
              opacity: waypoint.opacity,
              ease: waypoint.ease,
              duration: portraitTweenDuration,
            },
            portraitTweenStart,
          );

          if (
            previousSectionId === 'skills' &&
            waypoint.sectionId === 'projects'
          ) {
            // Projects is a stub rather than a scroll composition, so keep
            // Skills exit timing independent of the composition lookup below.
            skillFlowWindow.end = sectionTop;
            timeline?.to(
              [
                ...skillConnections,
                ...skillBranches,
                ...skillCores,
                ...skillConnectionTrails,
                ...skillSecondaryTrails,
              ],
              { opacity: 0, duration: Math.max(0, scrollPosition - sectionTop), ease: 'none' },
              sectionTop,
            );
          }

          const outgoingComposition = getComposition(previousSectionId);
          const incomingComposition = getComposition(waypoint.sectionId);

          if (outgoingComposition && incomingComposition) {
            if (previousSectionId === 'hero') {
              // Let the hero typography recede while the next composition
              // enters; its opacity remains owned by the approved intro.
              timeline?.to(
                outgoingComposition,
                {
                  x: '-5vw',
                  scale: 0.97,
                  // Keep the approved Hero exit at its existing scroll range
                  // even though Great At now has a longer scene/hold range.
                  duration: Math.min(
                    duration,
                    Math.max(
                      0,
                      sectionTop + window.innerHeight * scrubStrength - segmentStart,
                    ),
                  ),
                  ease: 'none',
                },
                segmentStart,
              );
            } else {
              const exitX = previousSectionId === 'great-at' ? '6vw' : '-6vw';
              const skillsExit =
                previousSectionId === 'skills' && waypoint.sectionId === 'projects';
              const exitStart = skillsExit
                ? Math.max(segmentStart, sectionTop)
                : segmentStart;
              const exitDuration = skillsExit
                ? Math.max(0, scrollPosition - exitStart)
                : duration;
              timeline?.to(
                outgoingComposition,
                { x: exitX, opacity: 0, duration: exitDuration, ease: 'none' },
                exitStart,
              );
            }

            timeline?.to(
              incomingComposition,
              {
                x: 0,
                y: 0,
                scale: 1,
                opacity: 1,
                duration:
                  waypoint.sectionId === 'great-at' || waypoint.sectionId === 'about'
                    ? portraitTweenDuration
                    : duration,
                ease: 'none',
              },
              segmentStart,
            );

            const revealStart = waypoint.sectionId === 'great-at' || waypoint.sectionId === 'about'
              ? portraitTweenStart + portraitTweenDuration
              : segmentStart;
            const revealDuration = Math.max(0, scrollPosition - revealStart);
            sectionSteps[waypoint.sectionId]?.forEach(
              ([stepName, start, length]) => {
                const step = incomingComposition.querySelector<HTMLElement>(
                  `[data-composition-step="${stepName}"]`,
                );
                if (!step) return;

                timeline?.to(
                  step,
                  {
                    y: 0,
                    opacity: 1,
                    duration: revealDuration * length,
                    ease: 'none',
                  },
                  revealStart + revealDuration * start,
                );
              },
            );

            if (waypoint.sectionId === 'skills') {
              const mode = window.matchMedia('(max-width: 639px)').matches
                ? 'mobile'
                : 'desktop';
              const skillsRevealStart = portraitTweenStart + portraitTweenDuration;
              const skillsRevealDuration = Math.max(
                0,
                scrollPosition - skillsRevealStart,
              );
              timeline?.to(
                skillsLabel,
                { y: 0, opacity: 1, duration: skillsRevealDuration * 0.1, ease: 'none' },
                skillsRevealStart + skillsRevealDuration * 0.02,
              );
              timeline?.to(
                skillNodes,
                {
                  y: 0,
                  scale: 1,
                  opacity: 1,
                  duration: skillsRevealDuration * 0.16,
                  ease: 'none',
                  stagger: skillsRevealDuration * 0.012,
                },
                skillsRevealStart + skillsRevealDuration * 0.14,
              );
              timeline?.to(
                skillItems,
                {
                  y: 0,
                  opacity: 1,
                  duration: skillsRevealDuration * 0.12,
                  ease: 'none',
                  stagger: skillsRevealDuration * 0.0025,
                },
                skillsRevealStart + skillsRevealDuration * 0.34,
              );

              // Let all of the skill marks and labels settle, pause briefly,
              // then draw each group's paths. Pulses begin after the paths are
              // established and keep flowing during the Skills hold.
              const groupOrder = ['design', 'development', 'ai', 'motion'];
              const firstConnectionStart =
                skillsRevealStart + skillsRevealDuration * 0.5;
              const groupSlot = skillsRevealDuration * 0.07;
              const lineDrawDuration = skillsRevealDuration * 0.024;
              const connectionStagger = skillsRevealDuration * 0.0025;

              groupOrder.forEach((groupId, groupIndex) => {
                const groupPaths = skillConnections.filter(
                  (path) =>
                    path.dataset.skillLayout === mode &&
                    path.dataset.skillConnectionGroup === groupId &&
                    Boolean(path.getAttribute('d')),
                );
                groupPaths.forEach((path, index) => {
                  const pathStart =
                    firstConnectionStart +
                    groupIndex * groupSlot +
                    index * connectionStagger;
                  timeline?.to(
                    path,
                    {
                      opacity: 1,
                      strokeDashoffset: 0,
                      duration: lineDrawDuration,
                      ease: 'none',
                    },
                    pathStart,
                  );
                  const core = skillCores.find(
                    (candidate) =>
                      candidate.dataset.skillLayout === mode &&
                      candidate.dataset.skillLink === path.dataset.skillLink,
                  );
                  if (core) {
                    timeline?.to(
                      core,
                      {
                        opacity: 0.82,
                        strokeDashoffset: 0,
                        duration: lineDrawDuration,
                        ease: 'none',
                      },
                      pathStart + lineDrawDuration * 0.12,
                    );
                  }
                });
              });
              skillFlowWindow.start =
                skillsRevealStart + skillsRevealDuration * 0.75;
            }

          }

          previousScrollPosition = scrollPosition;
          previousSectionId = waypoint.sectionId;
        });

        syncSkillFlow();
      };

      buildTimeline();

      const scheduleRebuild = () => {
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => {
          buildTimeline();
          ScrollTrigger.refresh();
        });
      };

      window.addEventListener('resize', scheduleRebuild);

      const resizeObserver = new ResizeObserver(scheduleRebuild);
      rest.forEach(({ sectionId }) => {
        const section = document.getElementById(sectionId);
        if (section) resizeObserver.observe(section);
      });

      stopTracking = () => {
        window.removeEventListener('resize', scheduleRebuild);
        resizeObserver.disconnect();
        cancelAnimationFrame(refreshFrame);
        timeline?.scrollTrigger?.kill();
        timeline?.kill();
        skillFlowTimeline?.kill();
      };
    });

    return () => {
      stopTracking();
      ctx.revert();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed left-1/2 top-[60%] z-30 -translate-x-1/2 -translate-y-1/2 md:top-1/2">
      <div ref={portraitRef} className="will-change-transform">
        <div className="relative inline-block align-top">
          <div data-portrait-card="" className="relative aspect-[3/4] max-h-[450px] w-[min(36vw,280px)] overflow-hidden rounded-2xl border border-[var(--color-border-soft)] shadow-2xl shadow-[var(--color-shadow)] sm:w-[min(32vw,300px)]">
            <img
              src={portraitSrc}
              alt="Portrait of Althaf Hayzum"
              className="block h-full w-full object-cover"
            />
          </div>
          <AriaCompanion />
        </div>
      </div>
    </div>
  );
}
