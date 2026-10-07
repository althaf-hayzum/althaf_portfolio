import { Fragment, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { site, hero } from '../data/content';
import { VapourText } from '../components/VapourText';

/**
 * Timings straight from the spec:
 * 0.00–0.45s  "ALTHAF" appears
 * 0.45–1.00s  "HAYZUM" appears
 * 1.00–2.20s  full name holds, readable
 * 2.20–3.00s  name disappears, main hero reveals
 * No scrolling required for any of this.
 */
export function Hero() {
  const introRef = useRef<HTMLDivElement>(null);
  const firstNameRef = useRef<HTMLSpanElement>(null);
  const lastNameRef = useRef<HTMLSpanElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const jibaIntroRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reduceMotion) {
      gsap.set(introRef.current, { display: 'none' });
      gsap.set(mainRef.current, { opacity: 1 });
      gsap.set(jibaIntroRef.current, {
        autoAlpha: 0,
      });
      return;
    }

    const tl = gsap.timeline();

    tl.set(mainRef.current, { opacity: 0 })
      .fromTo(
        firstNameRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
        0,
      )
      .fromTo(
        lastNameRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
        0.45,
      )
      // hold from 1.00s to 2.20s (already at rest, nothing to tween)
      .to(introRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power1.inOut',
        delay: 1.2,
      })
      .to(
        mainRef.current,
        { opacity: 1, duration: 0.8, ease: 'power1.out' },
        '<',
      )
      .fromTo(
        jibaIntroRef.current,
        { autoAlpha: 0, y: 8, scale: 0.98, transformOrigin: 'center center' },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          ease: 'power2.out',
        },
        3.2,
      )
      .to(
        jibaIntroRef.current,
        { autoAlpha: 0, duration: 0.55, ease: 'power1.inOut' },
        8.95,
      )
      .set(introRef.current, { display: 'none' });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="hero"
      className="hero-section relative z-40 flex min-h-[100svh] items-center overflow-hidden px-6 pb-16 pt-28 md:px-16 md:pb-0 md:pt-24"
    >
      {/* Name intro overlay — plays once on load, no scroll required */}
      <div
        ref={introRef}
        className="absolute inset-0 z-40 flex items-center justify-center bg-[var(--color-bg)]"
      >
        <h1
          className="flex flex-col items-center text-[13vw] font-semibold leading-[0.95] tracking-tight md:text-[7vw]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span ref={firstNameRef} className="inline-block opacity-0">
            {site.firstName}
          </span>
          <span ref={lastNameRef} className="inline-block opacity-0">
            {site.lastName}
          </span>
        </h1>
      </div>

      {/* Main hero content, revealed after the intro */}
      <div
        ref={mainRef}
        data-scroll-composition="hero"
        className="relative mx-auto flex min-h-[68svh] w-full max-w-6xl flex-col justify-start opacity-0 md:grid md:min-h-0 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:gap-4 lg:gap-6 xl:gap-10"
      >
        <div className="relative z-40 order-1 text-left">
          <h1
            className="min-w-0 text-[clamp(3rem,14vw,4.5rem)] font-semibold leading-[0.8] tracking-[-0.075em] md:text-[clamp(2.5rem,5.7vw,3.75rem)] xl:text-[clamp(4.25rem,6.4vw,7.25rem)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {site.firstName}
            <br />
            {site.lastName}
          </h1>
        </div>

        {/*
          Reserved center column: the ScrollPortrait component is a fixed,
          page-level overlay (mounted in App.tsx), not rendered here. This
          spacer just keeps the two text columns apart at the portrait's
          approximate width so the grid doesn't collapse under it.
        */}
        <div
          className="hidden w-[min(32vw,300px)] shrink-0 md:order-2 md:block md:h-[60vh] xl:w-[min(38vw,380px)]"
          aria-hidden="true"
        />

        <div className="hero-right-column relative z-40 order-2 ml-auto mt-4 flex w-full max-w-[82%] min-w-0 flex-col gap-4 text-right sm:max-w-[78%] md:order-3 md:ml-0 md:mt-0 md:min-h-[60vh] md:max-w-none md:justify-center md:gap-4 md:text-center lg:gap-6">
          <div
            ref={jibaIntroRef}
            className="text-left drop-shadow-[0_0_12px_rgba(103,163,255,0.58)] md:absolute md:left-6 md:-top-14 md:z-50 md:w-36 md:text-left"
          >
            <p className="relative mb-1 rotate-[-8deg] text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-jiba)] sm:text-sm md:text-[clamp(1.3rem,2.7vw,2.75rem)]">
              JIBA <span className="text-[var(--color-jiba-accent)]">↗</span>
              <span aria-hidden="true" className="absolute -left-6 top-[58%] text-xs text-[var(--color-jiba-accent)]/90 md:-left-8 md:text-base">
                ✧
              </span>
              <span aria-hidden="true" className="absolute -right-2 -top-3 text-[10px] text-[var(--color-jiba)] md:-right-3 md:-top-5 md:text-lg">
                ✦
              </span>
              <span aria-hidden="true" className="absolute -left-2 -top-4 text-[6px] text-[var(--color-jiba-accent)]/55">
                ✧
              </span>
              <span aria-hidden="true" className="absolute left-[38%] -top-3 text-[7px] text-[var(--color-jiba-accent)]/40">
                ⋆
              </span>
              <span aria-hidden="true" className="absolute right-[16%] -bottom-2 text-[8px] text-[var(--color-jiba)]/60">
                ✦
              </span>
              <span aria-hidden="true" className="absolute -right-4 top-[68%] text-[5px] text-[var(--color-jiba-accent)]/45">
                ·
              </span>
            </p>
            <VapourText
              text="My little annoying Jinnie"
              className="text-[10px] leading-relaxed text-[var(--color-text-soft)] sm:text-xs"
              holdDuration={5500}
              dissolveDuration={800}
            />
          </div>

          <h2
            className="hero-identity-title text-center text-[clamp(2rem,5.6vw,5.75rem)] font-semibold uppercase leading-[0.82] tracking-[-0.075em] md:absolute md:left-0 md:top-1/2 md:w-full md:-translate-y-1/2 md:text-[clamp(1.65rem,3.8vw,2.6rem)] lg:text-[clamp(2.5rem,4.8vw,4.75rem)] xl:text-[clamp(2.25rem,5.6vw,5.75rem)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {hero.tagline.split(' ').map((word, index) => (
              <Fragment key={word}>
                {index > 0 && <br />}
                {word}
              </Fragment>
            ))}
          </h2>

          <div aria-hidden="true" className="h-[clamp(210px,42vw,320px)] md:hidden" />
        </div>

      </div>

      <p
        className="absolute bottom-8 left-1/2 z-50 w-[min(86vw,28rem)] -translate-x-1/2 text-center text-[11px] leading-relaxed text-[var(--color-text-muted)] md:bottom-10 md:text-sm"
      >
        {hero.supportingLine}
      </p>
    </section>
  );
}
