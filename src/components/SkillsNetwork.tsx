import {
  siClaude,
  siCursor,
  siFigma,
  siFramer,
  siGooglegemini,
  siGsap,
  siJavascript,
  siReact,
  siThreedotjs,
  siTypescript,
} from 'simple-icons';
import { skillGroups } from '../data/content';
import codexLogo from '@lobehub/icons-static-svg/icons/codex.svg';
import openaiLogo from '@lobehub/icons-static-svg/icons/openai.svg';

type Point = { x: number; y: number };
type BrandMark = { path: string; title: string; hex: string };

const categoryPoints: Record<string, Point> = {
  design: { x: 19, y: 22 },
  development: { x: 81, y: 22 },
  ai: { x: 82, y: 49 },
  motion: { x: 19, y: 61 },
};

const itemPoints: Record<string, Point[]> = {
  design: [
    { x: 27, y: 29 },
    { x: 16, y: 36 },
    { x: 29, y: 41 },
  ],
  development: [
    { x: 73, y: 29 },
    { x: 84, y: 36 },
    { x: 71, y: 41 },
  ],
  ai: [
    { x: 75, y: 63 },
    { x: 85, y: 67 },
    { x: 75, y: 71 },
    { x: 85, y: 76 },
    { x: 75, y: 81 },
  ],
  motion: [
    { x: 29, y: 68 },
    { x: 16, y: 75 },
    { x: 30, y: 82 },
  ],
};

const groupNumbers: Record<string, string> = {
  design: '01',
  development: '02',
  ai: '03',
  motion: '04',
};

const brandMarks: Record<string, BrandMark> = {
  Figma: siFigma,
  Framer: siFramer,
  'UI/UX': siFigma,
  JavaScript: siJavascript,
  React: siReact,
  TypeScript: siTypescript,
  'AI / AI Tools': { path: '', title: 'OpenAI', hex: 'FFFFFF' },
  ChatGPT: { path: '', title: 'OpenAI', hex: 'FFFFFF' },
  Claude: siClaude,
  Gemini: siGooglegemini,
  Cursor: siCursor,
  Codex: { path: '', title: 'Codex', hex: 'FFFFFF' },
  GSAP: siGsap,
  'Three.js': siThreedotjs,
  'React Three Fiber': siReact,
};

const skillConnections = skillGroups.flatMap((group) => [
  ...(group.featured ? [{ groupId: group.id, name: group.featured }] : []),
  ...group.items.map((name) => ({ groupId: group.id, name })),
]);

function connectionGradientId(layout: string, name: string) {
  const token = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `skill-gradient-${layout}-${token}`;
}

const energyStops = [
  { offset: '0%', color: '#84F8FF' },
  { offset: '25%', color: '#48A8FF' },
  { offset: '50%', color: '#818DFF' },
  { offset: '75%', color: '#C38BEE' },
  { offset: '100%', color: '#84F8FF' },
];

function pointStyle(point: Point) {
  return { left: `${point.x}%`, top: `${point.y}%` };
}

function SkillIcon({ name, className }: { name: string; className: string }) {
  const mark = brandMarks[name];
  if (!mark) return null;

  const imageSource = name === 'Codex' ? codexLogo : name === 'ChatGPT' || name === 'AI / AI Tools' ? openaiLogo : undefined;
  if (imageSource) {
    return (
      <img
        src={imageSource}
        alt=""
        aria-hidden="true"
        className={`${className} theme-monochrome-logo`}
      />
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      style={{ color: mark.hex === '000000' ? 'var(--color-text)' : `#${mark.hex}` }}
    >
      <title>{mark.title}</title>
      <path d={mark.path} />
    </svg>
  );
}

function desktopNodeClass(item: string, featured = false) {
  const base =
    'absolute z-20 -translate-x-1/2 -translate-y-1/2 inline-flex min-h-9 items-center gap-2 rounded-xl border px-2.5 py-1.5 backdrop-blur-xl shadow-[0_14px_36px_-24px_var(--color-shadow)]';
  if (featured) {
    return `${base} min-h-[58px] gap-2.5 rounded-2xl border-[var(--color-accent)]/45 bg-[var(--color-surface)]/90 px-3.5 text-sm font-medium tracking-[-0.03em] text-[var(--color-text)] sm:text-base`;
  }
  if (item === 'GSAP') {
    return `${base} border-[var(--color-accent)]/40 bg-[var(--color-accent)]/[0.08] text-[var(--color-accent)]`;
  }
  return `${base} border-[var(--color-border-soft)] bg-[var(--color-surface)]/90 text-[var(--color-text-soft)]`;
}

function NodeContents({ name, featured = false }: { name: string; featured?: boolean }) {
  return (
    <>
      <SkillIcon
        name={name}
        className={featured ? 'h-7 w-7 shrink-0' : 'h-[18px] w-[18px] shrink-0'}
      />
      <span data-skill-item="" className={featured ? 'text-[11px] leading-tight sm:text-xs' : 'text-[9px] leading-tight'}>
        {name}
      </span>
    </>
  );
}

/**
 * Desktop skill objects are placed around an invisible elliptical orbit.
 * There is no SVG path or connecting geometry; the center stays open for
 * the one persistent portrait. Mobile uses compact grouped cards instead.
 */
export function SkillsNetwork() {
  return (
    <>
      <svg
        data-skill-connections=""
        className="pointer-events-none absolute inset-0 z-10 hidden h-full w-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <filter id="skill-line-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="skill-core-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.7" result="coreBlur" />
            <feMerge>
              <feMergeNode in="coreBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {[...skillConnections.map(({ name }) => ({ layout: 'desktop', name })),
            ...skillGroups.map(({ id }) => ({ layout: 'mobile', name: id }))].map(
            ({ layout, name }) => (
              <linearGradient
                key={connectionGradientId(layout, name)}
                id={connectionGradientId(layout, name)}
                data-skill-gradient=""
                data-skill-gradient-layout={layout}
                data-skill-gradient-link={name}
                gradientUnits="userSpaceOnUse"
                spreadMethod="repeat"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                {energyStops.map((stop) => (
                  <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
                ))}
              </linearGradient>
            ),
          )}
        </defs>
        {skillConnections.map(({ groupId, name }, index) => (
          <g key={`desktop-${name}`} className="hidden sm:block">
            <path
              data-skill-branch=""
              data-skill-connection-group={groupId}
              data-skill-link={name}
              data-skill-layout="desktop"
              fill="none"
              stroke={`url(#${connectionGradientId('desktop', name)})`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="miter"
              vectorEffect="non-scaling-stroke"
              filter="url(#skill-line-glow)"
            />
            <path
              data-skill-connection=""
              data-skill-connection-group={groupId}
              data-skill-link={name}
              data-skill-layout="desktop"
              fill="none"
              stroke={`url(#${connectionGradientId('desktop', name)})`}
              strokeWidth={4.6 + (index % 4) * 0.3}
              strokeOpacity="0.58"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              filter="url(#skill-line-glow)"
            />
            <path
              data-skill-core=""
              data-skill-connection-group={groupId}
              data-skill-link={name}
              data-skill-layout="desktop"
              fill="none"
              stroke="#E9FCFF"
              strokeWidth="1.35"
              strokeOpacity="0.72"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              filter="url(#skill-core-glow)"
            />
            <path
              data-skill-trail=""
              data-skill-connection-group={groupId}
              data-skill-link={name}
              data-skill-layout="desktop"
              fill="none"
              stroke="#F5FCFF"
              strokeWidth="5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              filter="url(#skill-line-glow)"
            />
            <path
              data-skill-trail-secondary=""
              data-skill-connection-group={groupId}
              data-skill-link={name}
              data-skill-layout="desktop"
              fill="none"
              stroke="#A5F5FF"
              strokeWidth="3"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              filter="url(#skill-line-glow)"
            />
          </g>
        ))}
        {skillGroups.map((group) => (
          <g key={`mobile-${group.id}`} className="sm:hidden">
            <path
              data-skill-branch=""
              data-skill-connection-group={group.id}
              data-skill-link={group.id}
              data-skill-layout="mobile"
              fill="none"
              stroke={`url(#${connectionGradientId('mobile', group.id)})`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="miter"
              vectorEffect="non-scaling-stroke"
              filter="url(#skill-line-glow)"
            />
            <path
              data-skill-connection=""
              data-skill-connection-group={group.id}
              data-skill-link={group.id}
              data-skill-layout="mobile"
              fill="none"
              stroke={`url(#${connectionGradientId('mobile', group.id)})`}
              strokeWidth="4.8"
              strokeOpacity="0.58"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              filter="url(#skill-line-glow)"
            />
            <path
              data-skill-core=""
              data-skill-connection-group={group.id}
              data-skill-link={group.id}
              data-skill-layout="mobile"
              fill="none"
              stroke="#E9FCFF"
              strokeWidth="1.35"
              strokeOpacity="0.72"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              filter="url(#skill-core-glow)"
            />
            <path
              data-skill-trail=""
              data-skill-connection-group={group.id}
              data-skill-link={group.id}
              data-skill-layout="mobile"
              fill="none"
              stroke="#F5FCFF"
              strokeWidth="5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              filter="url(#skill-line-glow)"
            />
            <path
              data-skill-trail-secondary=""
              data-skill-connection-group={group.id}
              data-skill-link={group.id}
              data-skill-layout="mobile"
              fill="none"
              stroke="#A5F5FF"
              strokeWidth="3"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              filter="url(#skill-line-glow)"
            />
          </g>
        ))}
      </svg>

      <div className="absolute inset-0 hidden sm:block" aria-label="Skills around the portrait" data-skills-layout="desktop">
        {skillGroups.map((group) => {
          const points = itemPoints[group.id];
          return (
            <div key={group.id}>
              <span
                data-skill-node=""
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] sm:text-[10px]"
                style={pointStyle(categoryPoints[group.id])}
              >
                {groupNumbers[group.id]} / {group.label}
              </span>

              {group.featured && (
                <span
                  data-skill-node=""
                  className={`${desktopNodeClass(group.featured, true)} -translate-x-1/2 -translate-y-1/2`}
                  style={pointStyle({ x: 82, y: 56 })}
                  aria-label={group.featured}
                  data-skill-link={group.featured}
                >
                  <NodeContents name={group.featured} featured />
                </span>
              )}

              {group.items.map((item, index) => (
                <span
                  key={item}
                  data-skill-node=""
                  className={`${desktopNodeClass(item)} -translate-x-1/2 -translate-y-1/2`}
                  style={pointStyle(points[index])}
                  aria-label={item}
                  data-skill-link={item}
                >
                  <NodeContents name={item} />
                </span>
              ))}
            </div>
          );
        })}
      </div>

      <div className="absolute inset-0 sm:hidden" aria-label="Skills around the portrait" data-skills-layout="mobile">
        {skillGroups.map((group) => (
          <article
            key={group.id}
            data-skill-node=""
            data-skill-link={group.id}
            className={`absolute z-20 w-[120px] rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface)]/95 p-3 shadow-[0_18px_54px_-28px_var(--color-shadow)] backdrop-blur-xl ${
              group.id === 'design'
                ? 'left-0 top-[calc(50%-223px)]'
                : group.id === 'development'
                  ? 'right-0 top-[calc(50%-223px)]'
                  : group.id === 'ai'
                    ? 'left-0 top-[calc(50%+92px)]'
                    : 'right-0 top-[calc(50%+92px)]'
            }`}
            aria-label={`${group.label}: ${group.featured ? `${group.featured}, ` : ''}${group.items.join(', ')}`}
          >
            <p className="flex items-center justify-between gap-2 border-b border-[var(--color-border-subtle)] pb-2 text-[8px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              {groupNumbers[group.id]} / {group.label}
              {group.id === 'ai' && (
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_12px_var(--color-accent)]" />
              )}
            </p>

            {group.featured && (
              <p
                data-skill-item=""
                data-skill-link={group.featured}
                className="mt-2 flex items-center gap-2 text-[11px] font-medium leading-tight tracking-[-0.04em] text-[var(--color-text)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <SkillIcon name={group.featured} className="h-5 w-5 shrink-0" />
                {group.featured}
              </p>
            )}

            <ul className="mt-2 flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  data-skill-item=""
                  data-skill-link={item}
                  className={`inline-flex max-w-full items-center gap-1 rounded-md border px-1.5 py-1 text-[8px] leading-tight ${
                    item === 'GSAP'
                      ? 'border-[var(--color-accent)]/35 bg-[var(--color-accent)]/[0.08] text-[var(--color-accent)]'
                      : 'border-[var(--color-border-subtle)] bg-[var(--color-glass)] text-[var(--color-text-soft)]'
                  }`}
                >
                  <SkillIcon name={item} className="h-3 w-3 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </>
  );
}
