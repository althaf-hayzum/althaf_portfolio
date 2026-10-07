import { useLayoutEffect } from 'react';
import hayzumiCouncilImage from '../assets/images/hayzumi-council.png';

const features = [
  'Multi-model perspectives',
  'Anonymous judging',
  'Consensus / disagreement analysis',
  'Executive briefing',
  'Provider perspectives',
  'Fault-tolerant orchestration',
];

const processSteps = [
  'User Question',
  'AI Providers',
  'Independent Perspectives',
  'Judge',
  'Consensus Analysis',
  'Council Decision',
];

export function HayzumiCaseStudy() {
  useLayoutEffect(() => {
    try {
      const theme = window.localStorage.getItem('portfolio-theme');
      document.documentElement.dataset.theme = theme === 'day' ? 'day' : 'night';
    } catch {
      document.documentElement.dataset.theme = 'night';
    }
  }, []);

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-10 md:px-16">
        <a
          href="/#hero"
          aria-label="Althaf Hayzum home"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border-soft)] text-xs font-semibold tracking-tight transition-colors hover:bg-[var(--color-glass)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          AH
        </a>
        <a
          href="/#projects"
          className="group inline-flex items-center gap-2 text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)] sm:text-sm"
        >
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
          Back to portfolio
        </a>
      </header>

      <article className="mx-auto w-full max-w-6xl px-6 pb-24 sm:px-10 md:px-16 md:pb-32">
        <section className="pt-12 sm:pt-16 md:pt-20" aria-labelledby="hayzumi-title">
          <p className="mb-5 text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-muted)] sm:text-xs">
            Project 02 <span className="px-1 text-[var(--color-accent)]/70">/</span> AI Product
          </p>
          <h1
            id="hayzumi-title"
            className="text-[clamp(3.2rem,11vw,8.5rem)] font-semibold uppercase leading-[0.78] tracking-[-0.085em]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            HAYZUMI
            <span className="mt-3 block text-[0.43em] tracking-[-0.055em] text-[var(--color-text-muted)] sm:mt-5">
              AI COUNCIL
            </span>
          </h1>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)] sm:mt-10 sm:text-base md:text-lg">
            Hayzumi is a multi-model AI decision-support system that compares independent AI perspectives and synthesizes them into a transparent Council Decision.
          </p>
          <p className="mt-4 text-[9px] uppercase tracking-[0.14em] text-[var(--color-text-faint)] sm:text-[10px] sm:tracking-[0.2em]">
            AI Product <span className="px-1">·</span> Decision Support <span className="px-1">·</span> Multi-Model Systems
          </p>
        </section>

        <section className="mt-12 sm:mt-16 md:mt-20" aria-label="Hayzumi decision flow">
          <figure className="overflow-hidden rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-glass)] sm:rounded-3xl">
            <img
              src={hayzumiCouncilImage}
              alt="Hayzumi AI Council interface showing a council decision, consensus confidence, executive briefing, provider perspectives, and question input"
              className="block h-auto w-full"
            />
            <figcaption className="border-t border-[var(--color-border-subtle)] px-4 py-3 text-[9px] uppercase tracking-[0.16em] text-[var(--color-text-faint)] sm:px-6 sm:text-[10px]">
              Hayzumi <span className="px-1 text-[var(--color-accent)]/70">/</span> Council Decision preview
            </figcaption>
          </figure>

          <div className="mt-5 rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-glass)] p-5 sm:mt-7 sm:rounded-3xl sm:p-8 md:p-10">
            <div className="mb-7 flex items-center justify-between gap-4 sm:mb-9">
              <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-faint)] sm:text-[10px]">Council process</p>
              <span className="h-px flex-1 bg-[var(--color-border-soft)]" />
              <span className="text-[9px] uppercase tracking-[0.16em] text-[var(--color-text-faint)] sm:text-[10px]">01 — 06</span>
            </div>
            <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
              {processSteps.map((step, index) => (
                <li key={step} className="relative flex min-h-24 flex-col justify-between rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/70 p-3 sm:min-h-28 sm:p-4">
                  <span className="text-[9px] tabular-nums text-[var(--color-accent)]">0{index + 1}</span>
                  <span className="text-xs leading-snug text-[var(--color-text)] sm:text-sm">{step}</span>
                  {index < processSteps.length - 1 && (
                    <span aria-hidden="true" className="absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 text-[var(--color-text-faint)] lg:block">→</span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <div className="mt-16 grid gap-12 border-t border-[var(--color-border-subtle)] pt-10 sm:mt-20 sm:gap-14 sm:pt-12 md:grid-cols-[0.7fr_1.3fr] md:gap-20">
          <aside className="md:sticky md:top-12 md:self-start">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">A clearer way to decide</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--color-text-faint)]">
              Independent perspectives are kept distinct, then compared to make agreement and disagreement easier to see.
            </p>
          </aside>

          <div className="space-y-12 sm:space-y-14">
            <section>
              <SectionLabel>THE IDEA</SectionLabel>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
                Multiple AI models provide independent perspectives. An anonymous Judge compares them, and the system produces a Council Decision.
              </p>
            </section>

            <section>
              <SectionLabel>THE PROBLEM</SectionLabel>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
                A single AI response can hide disagreement, uncertainty, or alternative reasoning.
              </p>
            </section>

            <section>
              <SectionLabel>THE APPROACH</SectionLabel>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
                Hayzumi separates provider responses, orchestration, judging, consensus analysis, and the final decision so the reasoning process is more transparent.
              </p>
            </section>

            <section>
              <SectionLabel>KEY FEATURES</SectionLabel>
              <ul className="mt-5 grid gap-x-8 sm:grid-cols-2">
                {features.map((feature, index) => (
                  <li key={feature} className="flex items-baseline gap-3 border-b border-[var(--color-border-subtle)] py-3 text-sm text-[var(--color-text-muted)]">
                    <span className="text-[9px] tabular-nums text-[var(--color-accent)]">0{index + 1}</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t border-[var(--color-border-subtle)] pt-8">
              <SectionLabel>TECHNOLOGY</SectionLabel>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
                TypeScript <span className="px-1 text-[var(--color-accent)]/70">·</span> AI APIs <span className="px-1 text-[var(--color-accent)]/70">·</span> Groq <span className="px-1 text-[var(--color-accent)]/70">·</span> Mistral <span className="px-1 text-[var(--color-accent)]/70">·</span> OpenRouter <span className="px-1 text-[var(--color-accent)]/70">·</span> AI orchestration
              </p>
            </section>
          </div>
        </div>

        <footer className="mt-16 border-t border-[var(--color-border-subtle)] pt-6 sm:mt-20">
          <a href="/#projects" className="group inline-flex items-center gap-3 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]">
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
            Back to selected work
          </a>
        </footer>
      </article>
    </main>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <h2 className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--color-text)] sm:text-xs">
      {children}
    </h2>
  );
}
