import { useEffect, useRef } from 'react';

type Props = {
  text: string;
  className?: string;
  delay?: number;
  holdDuration?: number;
  dissolveDuration?: number;
};

/** A small, one-shot canvas dissolve. The source text remains accessible. */
export function VapourText({
  text,
  className = '',
  delay = 3200,
  holdDuration = 4200,
  dissolveDuration = 1500,
}: Props) {
  const textRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const source = textRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!source || !canvas || !context) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    type Particle = { x: number; y: number; driftX: number; driftY: number; size: number; tint: boolean };
    let particles: Particle[] = [];
    let frame = 0;
    let startAt = 0;
    let started = false;
    let disposed = false;
    let timer = 0;
    const fadeDuration = 420;

    const prepare = () => {
      const rect = source.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.ceil(rect.width * ratio);
      canvas.height = Math.ceil(rect.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);

      const style = getComputedStyle(source);
      context.font = style.font;
      context.fillStyle = style.color;
      context.textBaseline = 'middle';
      if ('letterSpacing' in context) {
        context.letterSpacing = style.letterSpacing;
      }
      context.fillText(text, 0, rect.height / 2);

      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      const step = Math.max(3, Math.round(ratio * 2));
      const nextParticles: Particle[] = [];
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const alpha = pixels.data[(y * canvas.width + x) * 4 + 3];
          if (alpha < 96) continue;
          const seed = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453);
          const random = seed - Math.floor(seed);
          nextParticles.push({
            x: x / ratio,
            y: y / ratio,
            driftX: (random - 0.5) * 7,
            driftY: -(2 + random * 13),
            size: 0.65 + random * 0.75,
            tint: random > 0.92,
          });
        }
      }
      particles = nextParticles;
    };

    const draw = (now: number) => {
      frame = 0;
      if (disposed || !started) return;
      const rect = source.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const elapsed = now - startAt;
      const dissolve = Math.max(0, Math.min(1, (elapsed - holdDuration) / dissolveDuration));
      const fadeIn = Math.min(1, elapsed / fadeDuration);
      const textStyle = getComputedStyle(source);
      const accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-accent')
        .trim();

      context.clearRect(0, 0, rect.width, rect.height);
      if (elapsed < holdDuration + dissolveDuration) {
        context.font = textStyle.font;
        context.textBaseline = 'middle';
        context.fillStyle = textStyle.color;
        if ('letterSpacing' in context) {
          context.letterSpacing = textStyle.letterSpacing;
        }
        context.globalAlpha = fadeIn * (1 - dissolve);
        context.fillText(text, 0, rect.height / 2);

        if (dissolve > 0) {
          particles.forEach((particle) => {
            const breakup = dissolve * dissolve;
            context.globalAlpha = fadeIn * (1 - dissolve) * 0.86;
            context.fillStyle = particle.tint ? accentColor : textStyle.color;
            context.fillRect(
              particle.x + particle.driftX * breakup,
              particle.y + particle.driftY * breakup,
              particle.size,
              particle.size,
            );
          });
        }
      } else {
        context.clearRect(0, 0, rect.width, rect.height);
      }
      context.globalAlpha = 1;

      if (elapsed < holdDuration + dissolveDuration) {
        frame = window.requestAnimationFrame(draw);
      } else {
        canvas.style.opacity = '0';
      }
    };

    const begin = () => {
      if (disposed) return;
      prepare();
      if (!canvas.width || particles.length === 0) return;
      started = true;
      startAt = performance.now();
      source.style.opacity = '0';
      canvas.style.opacity = '1';
      frame = window.requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(() => {
      if (started) prepare();
    });
    observer.observe(source);
    timer = window.setTimeout(begin, delay);

    return () => {
      disposed = true;
      window.clearTimeout(timer);
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      source.style.opacity = '';
      canvas.style.opacity = '';
    };
  }, [delay, dissolveDuration, holdDuration, text]);

  return (
    <span className={`relative inline-block align-middle ${className}`}>
      <span ref={textRef} className="inline-block transition-opacity duration-500">
        {text}
      </span>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500"
      />
    </span>
  );
}
