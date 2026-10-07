import type { FormEvent } from 'react';
import { useState } from 'react';
import { contact } from '../data/content';
import { supabase } from '../lib/supabase';

export function Contact() {
  const [submissionState, setSubmissionState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!supabase) {
      setSubmissionState('error');
      return;
    }

    const formData = new FormData(form);
    setSubmissionState('sending');

    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: String(formData.get('name') ?? '').trim(),
        email: String(formData.get('email') ?? '').trim(),
        message: String(formData.get('message') ?? '').trim(),
      });

      if (error) {
        setSubmissionState('error');
        return;
      }

      form.reset();
      setSubmissionState('sent');
    } catch {
      setSubmissionState('error');
    }
  };

  return (
    <section
      id="contact"
      className="relative flex min-h-screen flex-col border-t border-[var(--color-border-subtle)] px-6 pb-8 pt-28 md:px-16 md:pb-10 md:pt-32"
    >
      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="relative">
          <p className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-muted)] sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_12px_var(--color-accent)]" aria-hidden="true" />
            Let’s start a conversation
          </p>
          <h2
            className="max-w-4xl text-[clamp(3.8rem,12vw,9.5rem)] font-semibold uppercase leading-[0.78] tracking-[-0.085em]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Let’s
            <br />
            Connect<span className="text-[var(--color-accent)]">.</span>
          </h2>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base lg:mt-10">
            {contact.supportingLine}
          </p>
          <div className="mt-12 grid gap-4 text-xs lg:mt-16">
            <div>
              <p className="mb-1 text-[9px] uppercase tracking-[0.18em] text-[var(--color-text-faint)]">Email</p>
              <a
                href={`mailto:${contact.email}`}
                className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
              >
                {contact.email}
              </a>
            </div>
            <div>
              <p className="mb-1 text-[9px] uppercase tracking-[0.18em] text-[var(--color-text-faint)]">Phone</p>
              <a
                href="tel:+918310567640"
                className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
              >
                {contact.phone}
              </a>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          aria-busy={submissionState === 'sending'}
          className="relative grid gap-x-5 gap-y-5 rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-glass)] p-5 shadow-[0_30px_100px_-70px_var(--color-shadow)] sm:grid-cols-2 sm:p-7 md:gap-y-6 md:p-9"
        >
          <label className="grid gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--color-accent)] sm:text-xs">
            Name
            <input
              name="name"
              autoComplete="name"
              required
              placeholder="Your name"
              className="h-12 w-full rounded-full border border-[var(--color-border-soft)] bg-[var(--color-input)] px-5 text-sm normal-case tracking-normal text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)]/70"
            />
          </label>
          <label className="grid gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--color-accent)] sm:text-xs">
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="h-12 w-full rounded-full border border-[var(--color-border-soft)] bg-[var(--color-input)] px-5 text-sm normal-case tracking-normal text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)]/70"
            />
          </label>
          <label className="grid gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--color-accent)] sm:col-span-2 sm:text-xs">
            Message
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Tell me a little about what you have in mind..."
              className="w-full resize-y rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-input)] px-5 py-4 text-sm normal-case leading-relaxed tracking-normal text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)]/70"
            />
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
            <p role="status" aria-live="polite" className="text-xs text-[var(--color-text-muted)]">
              {submissionState === 'sending' && 'Sending message…'}
              {submissionState === 'sent' && 'Message sent. Thank you.'}
              {submissionState === 'error' && 'Message could not be sent. Please try again.'}
            </p>
            <button
              type="submit"
              disabled={submissionState === 'sending'}
              className="inline-flex items-center gap-4 rounded-full bg-[var(--color-accent)] px-5 py-3 text-xs font-semibold text-[var(--color-bg)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)] disabled:cursor-wait disabled:opacity-70"
            >
              SEND MESSAGE
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </form>
      </div>

      <div className="mx-auto mt-20 w-full max-w-6xl pt-2 md:mt-24">
        <p
          className="max-w-full break-words text-[clamp(2rem,11vw,9rem)] font-semibold uppercase leading-[0.82] tracking-[-0.075em]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          ALTHAF HAYZUM
        </p>
      </div>
    </section>
  );
}
