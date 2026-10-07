import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import alBeefyShowcaseImage from '../assets/images/al-beefy-showcase.png';
import hayzumiShowcaseImage from '../assets/images/hayzumi-council.png';

gsap.registerPlugin(ScrollTrigger);

const projectSlots = ['01', '02'];
const projectTiming = {
  headingStart: 0.25,
  headingDuration: 0.06,
  trackStart: 0.31,
  trackEntry: 0.16,
  projectOneHold: 0.2,
  transition: 0.42,
  projectTwoHold: 0.2,
};
const showcaseDuration =
  projectTiming.trackStart +
  projectTiming.trackEntry +
  projectTiming.projectOneHold +
  projectTiming.transition +
  projectTiming.projectTwoHold;
const projectSwitchTime =
  projectTiming.trackStart +
  projectTiming.trackEntry +
  projectTiming.projectOneHold +
  projectTiming.transition / 2;

/** Two full-width project showcases connected by the existing scrubbed track. */
export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeProjectRef = useRef<'01' | '02'>('01');
  const [activeProject, setActiveProject] = useState<'01' | '02'>('01');

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (
      !section ||
      !track ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return;

    const context = gsap.context(() => {
      const showcaseTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const nextProject = self.progress < projectSwitchTime / showcaseDuration ? '01' : '02';
            if (activeProjectRef.current === nextProject) return;
            activeProjectRef.current = nextProject;
            setActiveProject(nextProject);
          },
        },
      });

      // Let the persistent portrait finish exiting before the section heading
      // takes focus, then introduce the showcase and preserve each settled hold.
      showcaseTimeline
        .fromTo(
          headingRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: projectTiming.headingDuration, ease: 'none' },
          projectTiming.headingStart,
        )
        .fromTo(
          track,
          { y: '100svh', autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: projectTiming.trackEntry, ease: 'none' },
          projectTiming.trackStart,
        )
        // A scrubbed no-op creates a readable hold on Project 01.
        .to(track, { x: 0, duration: projectTiming.projectOneHold, ease: 'none' })
        .to(
          track,
          {
            x: () => -(track.scrollWidth - window.innerWidth),
            duration: projectTiming.transition,
            ease: 'none',
          },
        )
        // Hold Project 02 in view before the sticky showcase releases.
        .to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          duration: projectTiming.projectTwoHold,
          ease: 'none',
        });

    }, section);

    return () => context.revert();
  }, []);

  const scrollToProject = (project: '01' | '02') => {
    const section = sectionRef.current;
    if (!section) return;

    activeProjectRef.current = project;
    setActiveProject(project);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.getElementById(`project-${project}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      return;
    }

    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const scrollRange = Math.max(0, section.offsetHeight - window.innerHeight);
    const settledTime = project === '01'
      ? projectTiming.trackStart + projectTiming.trackEntry + projectTiming.projectOneHold / 2
      : projectTiming.trackStart + projectTiming.trackEntry + projectTiming.projectOneHold + projectTiming.transition + projectTiming.projectTwoHold / 2;
    const scrollTarget = sectionTop + scrollRange * (settledTime / showcaseDuration);

    window.scrollTo({
      top: scrollTarget,
      behavior: 'smooth',
    });
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="projects-showcase-section relative border-t border-[var(--color-border-subtle)]"
      aria-label="Projects"
    >
      <div className="sticky top-0 z-40 h-[100svh] overflow-hidden motion-reduce:static motion-reduce:h-auto motion-reduce:overflow-visible">
        <div ref={headingRef} className="pointer-events-none absolute inset-x-6 top-20 z-10 flex items-end justify-between md:inset-x-16 md:top-24 motion-reduce:relative motion-reduce:inset-auto motion-reduce:px-6 motion-reduce:pt-20 md:motion-reduce:px-16">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-muted)] sm:text-xs">
              Selected work
            </p>
            <h2
              className="text-[clamp(2.8rem,8vw,7rem)] font-semibold uppercase leading-[0.82] tracking-[-0.075em]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Projects
            </h2>
          </div>
          <span className="mb-1 hidden text-xs tabular-nums text-[var(--color-text-muted)] sm:block">
            01 — 02
          </span>
        </div>

        <div ref={trackRef} className="projects-showcase-track absolute inset-x-0 bottom-16 top-40 flex will-change-transform md:top-[17rem] motion-reduce:relative motion-reduce:inset-auto motion-reduce:top-auto motion-reduce:h-auto">
          {projectSlots.map((number) => (
            <article
              key={number}
              id={`project-${number}`}
              className="projects-showcase-slide flex h-full shrink-0 items-center justify-center px-6 md:px-16"
              aria-label={number === '02' ? 'Project 02: Hayzumi AI Council' : 'Project 01: AL BEEFY'}
            >
              {number === '01' ? (
                <div className="projects-showcase-card relative flex max-h-full min-h-0 w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] shadow-[0_40px_120px_-80px_var(--color-accent-shadow)] lg:aspect-[2.4/1] lg:flex-row lg:rounded-3xl">
                  <div className="projects-showcase-media min-w-0 overflow-hidden lg:h-full lg:w-[74%]">
                    <img
                      src={alBeefyShowcaseImage}
                      alt="AL BEEFY mobile point-of-sale showcase with dashboard, billing, checkout, product management, reports, and thermal receipt printing screens"
                      className="block aspect-[16/9] w-full bg-[#160d0d] object-contain lg:aspect-auto lg:h-full"
                    />
                  </div>
                  <div className="projects-showcase-copy relative flex min-w-0 flex-1 flex-col justify-between gap-6 p-5 sm:h-full sm:gap-3 sm:p-5 md:p-7">
                    <p className="projects-showcase-label text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-faint)] sm:text-[10px]">
                      MOBILE POS <span className="px-1 text-[var(--color-accent)]/70">/</span> 01
                    </p>
                    <div className="projects-showcase-copy-main">
                      <h3 className="projects-showcase-title text-3xl font-semibold uppercase leading-[0.88] tracking-[-0.07em] sm:text-2xl md:text-3xl" style={{ fontFamily: 'var(--font-display)' }}>
                        AL BEEFY
                      </h3>
                      <p className="projects-showcase-category mt-2 text-[9px] uppercase tracking-[0.12em] text-[var(--color-text-muted)] sm:text-[8px] md:text-[9px]">
                        Mobile POS · Business Management
                      </p>
                      <p className="projects-showcase-description mt-3 text-xs leading-relaxed text-[var(--color-text-muted)] sm:mt-4 sm:text-[11px] md:text-xs">
                        A mobile POS and business management app designed for fast, weight-based shop billing, product management, sales tracking, and offline operation.
                      </p>
                    </div>
                    <div className="projects-showcase-footer flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-[0.16em] text-[var(--color-text-faint)]">01 <span className="px-1 text-[var(--color-accent)]/70">/</span> 02</span>
                      <a
                        href="/projects/albeefy"
                        className="group inline-flex min-h-9 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-glass)] px-3.5 text-[11px] font-medium text-[var(--color-text)] transition-[background-color,border-color,color] duration-200 hover:border-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)] sm:min-h-8 sm:px-3 sm:text-[10px] md:min-h-9 md:px-3.5 md:text-[11px]"
                      >
                        Details
                        <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5">↗</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="projects-showcase-card relative flex max-h-full min-h-0 w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] shadow-[0_40px_120px_-80px_var(--color-accent-shadow)] lg:aspect-[2.4/1] lg:flex-row lg:rounded-3xl">
                  <div className="projects-showcase-media aspect-[16/9] max-h-[52svh] min-h-0 w-full shrink-0 overflow-hidden bg-[var(--color-glass)] p-3 sm:p-5 lg:aspect-auto lg:h-full lg:w-[68%] lg:flex-none lg:p-4">
                    <img
                      src={hayzumiShowcaseImage}
                      alt="HAYZUMI AI Council project interface showing a Council Decision, confidence and consensus analysis, provider perspectives, and executive briefing"
                      className="block h-full w-full object-contain"
                    />
                  </div>
                  <div className="projects-showcase-copy flex min-w-0 flex-col justify-between gap-5 p-5 sm:p-7 lg:h-full lg:flex-1 lg:gap-4 lg:p-9">
                    <p className="projects-showcase-label text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-faint)] sm:text-[10px]">
                      AI PRODUCT <span className="px-1 text-[var(--color-accent)]/70">/</span> 02
                    </p>
                    <div className="projects-showcase-copy-main">
                      <h3 className="projects-showcase-title text-3xl font-semibold uppercase leading-[0.88] tracking-[-0.07em] sm:text-4xl md:text-4xl lg:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
                        HAYZUMI
                        <span className="mt-1 block text-[var(--color-text-muted)]">AI COUNCIL</span>
                      </h3>
                      <p className="projects-showcase-description mt-4 max-w-xl text-xs leading-relaxed text-[var(--color-text-muted)] sm:text-sm">
                        A multi-model AI decision-support system that compares independent AI perspectives and synthesizes them into a transparent Council Decision.
                      </p>
                      <p className="projects-showcase-category mt-3 text-[9px] uppercase leading-relaxed tracking-[0.1em] text-[var(--color-text-faint)] sm:text-[10px] sm:tracking-[0.13em]">
                        AI Product · Decision Support · Multi-Model Systems
                      </p>
                    </div>
                    <div className="projects-showcase-footer flex items-center justify-between border-t border-[var(--color-border-subtle)] pt-4">
                      <span className="text-[9px] uppercase tracking-[0.16em] text-[var(--color-text-faint)]">02 <span className="px-1 text-[var(--color-accent)]/70">/</span> 02</span>
                      <a
                        href="/projects/hayzumi"
                        className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-glass)] px-3.5 text-[11px] font-medium text-[var(--color-text)] transition-[background-color,border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)] sm:min-h-9 sm:px-4 sm:text-xs"
                      >
                        Details
                        <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5">↗</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>

        <nav
          aria-label="Choose a project"
          className="absolute inset-x-0 bottom-4 z-20 flex justify-center px-6"
        >
          <div className="flex w-full max-w-[22rem] items-center gap-1 rounded-full border border-[var(--color-border-soft)] bg-[var(--color-glass)] p-1 backdrop-blur-md">
            {projectSlots.map((number) => {
              const projectName = number === '01' ? 'AL BEEFY' : 'HAYZUMI';
              const selected = activeProject === number;
              return (
                <button
                  key={number}
                  type="button"
                  aria-label={`Go to Project ${number}: ${projectName}`}
                  aria-pressed={selected}
                  onClick={() => scrollToProject(number as '01' | '02')}
                  className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border px-3 text-[10px] font-medium uppercase tracking-[0.12em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${selected ? 'border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-text)]' : 'border-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'}`}
                >
                  <span className="tabular-nums text-[var(--color-accent)]">{number}</span>
                  <span>{projectName}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </section>
  );
}
