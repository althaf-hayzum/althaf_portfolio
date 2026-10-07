// ---------------------------------------------------------------------------
// All editable content lives here. Nothing in this file is a real claim about
// Althaf — anything not explicitly supplied is a bracketed [PLACEHOLDER]
// so it's obvious what still needs real content before launch.
// ---------------------------------------------------------------------------

export const site = {
  name: 'Althaf Hayzum',
  firstName: 'Althaf',
  lastName: 'Hayzum',
  navLinks: [
    { label: 'Home', href: '#hero' },
    { label: "What I'm Great At", href: '#great-at' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ],
  availability: '[PLACEHOLDER: Available for work]',
};

export const hero = {
  tagline: 'DIGITAL RESEARCH ALCHEMIST',
  supportingLine:
    'I design interfaces, build digital experiences, and explore AI to turn ideas into things people can actually use.',
  ctaLabel: 'Explore My Work',
  ctaHref: '#projects',
};

export const greatAt = {
  eyebrow: 'Capabilities',
  headingLines: ["What I'm", 'Great At'],
  intro:
    'I work across design, technology, and emerging AI — turning ideas into digital experiences that are thoughtful, interactive, and useful.',
};

export const capabilities = [
  {
    id: 'uiux',
    title: 'UI/UX Design',
    details:
      'I design digital experiences around clarity, interaction, and visual balance — making interfaces feel intuitive without losing personality.',
    explore: ['Interfaces', 'User Flow', 'Motion', 'Prototyping'],
  },
  {
    id: 'ai',
    title: 'AI Exploration',
    details:
      'I experiment with AI models and creative workflows to discover new ways of designing, building, and solving problems.',
    explore: ['AI Tools', 'Workflows', 'Generative Ideas', 'Experimentation'],
  },
  {
    id: 'web',
    title: 'Web Experience',
    details:
      'I build websites where design, interaction, and motion work together to create experiences people remember.',
    explore: ['Interactive Web', 'Scroll', 'Cursor', 'Storytelling'],
  },
  {
    id: '3d',
    title: '3D & Interaction',
    details:
      'I explore 3D and motion to add depth and life to digital experiences without letting the effects take over.',
    explore: ['Three.js', '3D', 'Motion', 'Interaction'],
  },
  {
    id: 'software',
    title: 'Software Development',
    details:
      'I turn ideas into functional products by bringing together design, logic, and technology.',
    explore: ['React', 'TypeScript', 'Apps', 'Problem Solving'],
  },
];

export const about = {
  heading: 'Who Am I?',
  paragraphs: [
    'I’m Althaf — a software developer and UI/UX designer who enjoys exploring the space where technology, design, and AI meet.',
    'I like taking ideas apart, understanding how they work, and rebuilding them into digital experiences that feel purposeful, interactive, and human.',
  ],
};

export const skillGroups = [
  { id: 'design', label: 'Design', items: ['Figma', 'Framer', 'UI/UX'] },
  {
    id: 'development',
    label: 'Development',
    items: ['JavaScript', 'React', 'TypeScript'],
  },
  {
    id: 'ai',
    label: 'AI',
    featured: 'AI / AI Tools',
    items: ['ChatGPT', 'Claude', 'Gemini', 'Cursor', 'Codex'],
  },
  {
    id: 'motion',
    label: 'Motion & 3D',
    items: ['GSAP', 'Three.js', 'React Three Fiber'],
  },
];

export const projects = [
  {
    id: 'project-1',
    name: '[Project Name]',
    category: '[Category]',
    description: '[PLACEHOLDER: short description]',
    tools: ['[Tool]', '[Tool]', '[Tool]'],
    whatItIs: '[PLACEHOLDER: what it is]',
    theProblem: '[PLACEHOLDER: the problem]',
    theSolution: '[PLACEHOLDER: the solution]',
    outcome: null, // only render outcome when a real result exists
  },
  {
    id: 'project-2',
    name: '[Project Name]',
    category: '[Category]',
    description: '[PLACEHOLDER: short description]',
    tools: ['[Tool]', '[Tool]'],
    whatItIs: '[PLACEHOLDER: what it is]',
    theProblem: '[PLACEHOLDER: the problem]',
    theSolution: '[PLACEHOLDER: the solution]',
    outcome: null,
  },
];

export const contact = {
  name: 'Althaf Hayzum',
  email: 'althaf.is.here22@gmail.com',
  phone: '+91 83105 67640',
  supportingLine:
    'Have an idea, a project, or something interesting you want to build? Let’s talk and see where we can take it.',
};
