import { useLayoutEffect } from 'react';
import type { ReactNode } from 'react';
import alBeefyShowcaseImage from '../assets/images/al-beefy-showcase.png';

const problems = [
  'Weight-based billing needs quick quantity entry.',
  'Products and prices need to be managed easily.',
  'Daily sales and bill history need to be accessible.',
  'Shop workflows should remain usable when internet connectivity is unavailable.',
  'Receipt printing needs to fit naturally into checkout.',
];

const experience = [
  { title: 'Product', description: 'Choose an item from the shop catalogue.' },
  { title: 'Weight / quantity', description: 'Enter a weight, gram amount, or custom quantity.' },
  { title: 'Cart', description: 'Review items and adjust quantities.' },
  { title: 'Checkout', description: 'Confirm the bill and any discount.' },
  { title: 'Payment', description: 'Choose a payment method and record received amount.' },
  { title: 'Receipt', description: 'Complete the bill and print a receipt.' },
];

const features = [
  { title: 'Fast Billing', description: 'Designed for quick shop-counter transactions.' },
  { title: 'Weight-Based Selling', description: 'Supports kilogram, gram, and custom quantity or price entry.' },
  { title: 'Product Management', description: 'Add, edit, reorder, activate or deactivate products, and organize them by category.' },
  { title: 'Checkout', description: 'Customer name, cart controls, discount, payment method, amount received, change due, and bill total.' },
  { title: 'Sales Dashboard', description: 'Today’s sales, bills, average bill, kilograms sold, sales overview, and bill history.' },
  { title: 'Reports', description: 'Sales summaries, category information, top products, and reporting periods.' },
  { title: 'Offline-First Workflow', description: 'Local data keeps core shop workflows available without relying on internet connectivity.' },
  { title: 'Thermal Receipt Printing', description: 'Bluetooth ESC/POS printing supports the receipt workflow.' },
];

const designDecisions = [
  'Large touch-friendly controls for use at a shop counter.',
  'Clear hierarchy for price, quantity, totals, and important actions.',
  'Persistent bottom navigation for the main application areas.',
  'A strong accent color marks primary actions and active states.',
  'Cards and spacing separate information without complicating the interface.',
  'Billing screens prioritize speed over decorative UI.',
  'Simple report summaries make business information easier to scan.',
];

export function AlBeefyCaseStudy() {
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
        >AH</a>
        <a href="/#projects" className="group inline-flex items-center gap-2 text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)] sm:text-sm">
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
          Back to portfolio
        </a>
      </header>

      <article className="mx-auto w-full max-w-6xl px-6 pb-24 sm:px-10 md:px-16 md:pb-32">
        <section className="pt-12 sm:pt-16 md:pt-20" aria-labelledby="albeefy-title">
          <p className="mb-5 text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-muted)] sm:text-xs">
            Project 01 <span className="px-1 text-[var(--color-accent)]/70">/</span> Mobile POS
          </p>
          <h1 id="albeefy-title" className="text-[clamp(3.2rem,11vw,8.5rem)] font-semibold uppercase leading-[0.78] tracking-[-0.085em]" style={{ fontFamily: 'var(--font-display)' }}>
            AL BEEFY
          </h1>
          <p className="mt-5 text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)] sm:text-sm sm:tracking-[0.22em]">
            Mobile POS &amp; Business Management
          </p>
          <p className="mt-7 max-w-3xl text-sm leading-relaxed text-[var(--color-text-muted)] sm:mt-9 sm:text-base md:text-lg">
            A practical mobile POS system built around the workflow of a real shop — from selecting products and entering weight to checkout, receipts, sales history, and reporting.
          </p>
        </section>

        <figure className="mt-10 overflow-hidden rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-glass)] sm:mt-14 sm:rounded-3xl md:mt-16">
          <img
            src={alBeefyShowcaseImage}
            alt="AL BEEFY showcase: mobile POS dashboard, weight-based billing, checkout, product management, sales reports, and thermal receipt printer"
            className="block h-auto w-full"
          />
          <figcaption className="border-t border-[var(--color-border-subtle)] px-4 py-3 text-[9px] uppercase tracking-[0.16em] text-[var(--color-text-faint)] sm:px-6 sm:text-[10px]">
            AL BEEFY <span className="px-1 text-[var(--color-accent)]/70">/</span> Shop billing and management
          </figcaption>
        </figure>

        <div className="mt-14 grid gap-12 border-t border-[var(--color-border-subtle)] pt-9 sm:mt-20 sm:gap-14 sm:pt-12 md:grid-cols-[0.65fr_1.35fr] md:gap-20">
          <aside className="md:sticky md:top-12 md:self-start">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">Designed around the counter</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--color-text-faint)]">
              One mobile workflow brings everyday billing and shop information into reach.
            </p>
          </aside>

          <div className="space-y-12 sm:space-y-14">
            <section>
              <SectionLabel>01 <span>/</span> THE IDEA</SectionLabel>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
                AL BEEFY is a focused POS application for a shop workflow where products are commonly sold by weight. The goal is to make everyday billing fast, simple, and practical while keeping important business information accessible in the same application.
              </p>
            </section>

            <section>
              <SectionLabel>02 <span>/</span> THE PROBLEM</SectionLabel>
              <ul className="mt-4 divide-y divide-[var(--color-border-subtle)] border-y border-[var(--color-border-subtle)]">
                {problems.map((problem, index) => <NumberedLine key={problem} index={index}>{problem}</NumberedLine>)}
              </ul>
            </section>

            <section>
              <SectionLabel>03 <span>/</span> THE SOLUTION</SectionLabel>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
                The application brings the everyday shop workflow together in one mobile interface:
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {['Dashboard', 'Billing', 'Product management', 'Checkout', 'Reports', 'Local / offline data', 'Receipt printing'].map((item) => (
                  <span key={item} className="rounded-full border border-[var(--color-border-soft)] bg-[var(--color-glass)] px-3 py-2 text-[10px] text-[var(--color-text-muted)] sm:text-xs">{item}</span>
                ))}
              </div>
            </section>

            <section>
              <SectionLabel>04 <span>/</span> CORE EXPERIENCE</SectionLabel>
              <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {experience.map((step, index) => (
                  <li key={step.title} className="flex min-h-28 flex-col justify-between rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-glass)] p-4 sm:min-h-32">
                    <span className="text-[9px] tabular-nums text-[var(--color-accent)]">0{index + 1}</span>
                    <div>
                      <h3 className="text-sm font-medium">{step.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-[10px] leading-relaxed text-[var(--color-text-faint)] sm:text-xs">
                PRODUCT <span className="px-1 text-[var(--color-accent)]/70">→</span> WEIGHT / QUANTITY <span className="px-1 text-[var(--color-accent)]/70">→</span> CART <span className="px-1 text-[var(--color-accent)]/70">→</span> CHECKOUT <span className="px-1 text-[var(--color-accent)]/70">→</span> PAYMENT <span className="px-1 text-[var(--color-accent)]/70">→</span> RECEIPT
              </p>
            </section>

            <section>
              <SectionLabel>05 <span>/</span> KEY FEATURES</SectionLabel>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {features.map((feature, index) => (
                  <article key={feature.title} className="rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-glass)] p-4 sm:p-5">
                    <p className="text-[9px] tabular-nums text-[var(--color-accent)]">0{index + 1}</p>
                    <h3 className="mt-3 text-sm font-medium">{feature.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">{feature.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <SectionLabel>06 <span>/</span> UI / UX DECISIONS</SectionLabel>
              <ul className="mt-4 divide-y divide-[var(--color-border-subtle)] border-y border-[var(--color-border-subtle)]">
                {designDecisions.map((decision, index) => <NumberedLine key={decision} index={index}>{decision}</NumberedLine>)}
              </ul>
            </section>

            <section>
              <SectionLabel>07 <span>/</span> TECHNICAL SIDE</SectionLabel>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
                The application is designed around local / offline data handling and a thermal receipt-printing workflow.
              </p>
            </section>

            <section>
              <SectionLabel>08 <span>/</span> WHAT I BUILT</SectionLabel>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
                I designed and developed the application around a real-world retail workflow, working across the interface, billing logic, product management, local data handling, reporting, and printer integration.
              </p>
            </section>
          </div>
        </div>

        <footer className="mt-14 border-t border-[var(--color-border-subtle)] pt-8 sm:mt-20 sm:pt-10">
          <p className="max-w-3xl text-lg leading-snug tracking-tight sm:text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
            AL BEEFY is an example of how I approach software: understand the real workflow first, then build the interface and logic around it.
          </p>
          <a href="/#projects" className="group mt-7 inline-flex items-center gap-3 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]">
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
            Back to selected work
          </a>
        </footer>
      </article>
    </main>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <h2 className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--color-text)] sm:text-xs">{children}</h2>;
}

function NumberedLine({ index, children }: { index: number; children: ReactNode }) {
  return (
    <li className="flex items-baseline gap-4 py-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
      <span className="text-[9px] tabular-nums text-[var(--color-accent)]">{String(index + 1).padStart(2, '0')}</span>
      <span>{children}</span>
    </li>
  );
}
