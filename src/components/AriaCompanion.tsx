import { useEffect, useRef } from 'react';

const highResolutionPoses: Record<number, string> = {
  3: '/aria-3d/aria_04.png',
  4: '/aria-3d/aria_05.png',
  5: '/aria-3d/aria_06.png',
  7: '/aria-3d/aria_08.png',
  10: '/aria-3d/aria_11.png',
  11: '/aria-3d/aria_12.png',
  12: '/aria-3d/aria_13.png',
};

const ariaFrames = Array.from({ length: 19 }, (_, index) =>
  highResolutionPoses[index] ?? `/aria/aria_${String(index + 1).padStart(2, '0')}.png`,
);

type AriaPose = { position: number; frame: number };

// Preserve the existing seven-pose cursor mapping.
const poses: AriaPose[] = [
  { position: -1, frame: 5 },
  { position: -0.66, frame: 4 },
  { position: -0.33, frame: 3 },
  { position: 0, frame: 7 },
  { position: 0.33, frame: 10 },
  { position: 0.66, frame: 11 },
  { position: 1, frame: 12 },
];

const poseBoundaries = poses
  .slice(0, -1)
  .map((pose, index) => (pose.position + poses[index + 1].position) / 2);
const centerPose = Math.floor(poses.length / 2);
const hysteresis = 0.045;
const smoothingTimeMs = 60;

/** Pose tracking stays inside ARIA's portrait-relative attachment; its box never moves. */
export function AriaCompanion() {
  const imageRef = useRef<HTMLImageElement>(null);
  const preloadedFramesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    const displayedImage = imageRef.current;
    if (!displayedImage) return;

    const supportsMouse = window.matchMedia(
      '(hover: hover) and (pointer: fine)',
    ).matches;
    if (preloadedFramesRef.current.length === 0) {
      preloadedFramesRef.current = ariaFrames.map((src) => {
        const image = new Image();
        image.decoding = 'async';
        image.src = src;
        return image;
      });
    }
    const preloadedFrames = preloadedFramesRef.current;

    let disposed = false;
    let ready = false;
    let animationFrame = 0;
    let lastFrameTime = 0;
    let pointerX = window.innerWidth / 2;
    let targetX = 0;
    let currentX = 0;
    let selectedPose = centerPose;
    let currentSrc = displayedImage.currentSrc;

    const renderPose = (poseIndex: number) => {
      const frame = preloadedFrames[poses[poseIndex].frame];
      if (!frame?.complete || !frame.naturalWidth) return;
      if (currentSrc === frame.src) return;

      displayedImage.src = frame.src;
      currentSrc = frame.src;
    };

    const selectPoseWithHysteresis = (directionX: number) => {
      while (
        selectedPose < poses.length - 1 &&
        directionX > poseBoundaries[selectedPose] + hysteresis
      ) {
        selectedPose += 1;
      }
      while (
        selectedPose > 0 &&
        directionX < poseBoundaries[selectedPose - 1] - hysteresis
      ) {
        selectedPose -= 1;
      }
      renderPose(selectedPose);
    };

    const tick = (now: number) => {
      animationFrame = 0;
      if (disposed || !ready) return;

      const elapsed = lastFrameTime ? now - lastFrameTime : 16.67;
      lastFrameTime = now;
      const smoothing = 1 - Math.exp(-elapsed / smoothingTimeMs);
      const viewport = window.visualViewport;
      const viewportLeft = viewport?.offsetLeft ?? 0;
      const viewportWidth =
        viewport?.width ?? document.documentElement.clientWidth;
      targetX = Math.max(
        -1,
        Math.min(
          1,
          ((pointerX - viewportLeft) / Math.max(viewportWidth, 1)) * 2 - 1,
        ),
      );
      currentX += (targetX - currentX) * smoothing;

      if (Math.abs(targetX - currentX) < 0.002) {
        currentX = targetX;
        lastFrameTime = 0;
      }

      selectPoseWithHysteresis(currentX);
      if (Math.abs(targetX - currentX) > 0) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    };

    const scheduleTracking = () => {
      if (ready && !animationFrame) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      pointerX = event.clientX;
      scheduleTracking();
    };

    Promise.all(
      preloadedFrames.map(
        (image) =>
          new Promise<void>((resolve) => {
            if (image.complete) return resolve();
            image.onload = () => resolve();
            image.onerror = () => resolve();
          }),
      ),
    ).then(() => {
      if (disposed) return;
      ready = true;
      renderPose(centerPose);
      scheduleTracking();
    });

    if (supportsMouse) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerenter', onPointerMove, { passive: true });
    }

    return () => {
      disposed = true;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerenter', onPointerMove);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      data-aria-companion=""
      className="pointer-events-none absolute left-[53%] top-[22%] z-10 aspect-[2/3] w-[32%] max-w-[96px]"
    >
      <img
        ref={imageRef}
        src="/aria-3d/aria_08.png"
        alt=""
        draggable={false}
        className="block h-full w-full select-none object-contain"
      />
    </div>
  );
}
