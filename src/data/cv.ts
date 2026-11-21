// CV content, shared by the CV page and the printable PDF version. Newest first.

export const summary =
  'Fullstack engineer and frontend developer with a past in Michelin kitchens and music studios. I care about craft, teams and the details people notice without knowing why.';

export const experience = [
  {
    when: '2026 – now',
    title: 'Fullstack engineer / frontend developer',
    place: 'Dreamplan.io',
    where: 'Copenhagen',
    points: [
      'Started as an intern during my education and joined full time in October 2026.',
      'Building the frontend of a pension advisory platform and digital self-service tools.',
      'Working in a Turborepo monorepo of Next.js apps with TypeScript and React.',
      'Building and maintaining the shared design system and its components in Storybook.',
    ],
  },
  {
    when: 'Ongoing',
    title: 'Co-founder, programmer & composer',
    place: 'Kinda Whimsical Games',
    where: 'Copenhagen',
    points: [
      'Our two-person studio project, growing with every new game. I program the games and write their music.',
      'React Three Fiber, Electron, Expo and SpacetimeDB, with our own weather, audio and camera systems.',
      'Designed and built the studio website in Astro.',
    ],
  },
  {
    when: '2017 – 2024',
    title: 'Chef, later head chef',
    place: 'Noma, Alchemist, Copenhague (Paris), Frederiksborg Castle',
    where: '',
    points: [
      'Cooked at Noma and Alchemist in Copenhagen, and at Restaurant Copenhague in Paris, where the team earned two Michelin stars.',
      'Head chef at Rabarbergaarden på Slottet, Frederiksborg Castle: led the team and hiring, and ran systems, IT, social media and infrastructure alongside the food.',
    ],
  },
  {
    when: 'Ongoing',
    title: 'Music producer & writer',
    place: 'Freelance, and as vaaben',
    where: '',
    points: [
      'Production, writing and artist work for labels and independent artists.',
      "Theatre score and sound design for Sartre's No Exit (Lukkede Døre).",
    ],
  },
  {
    when: '2014 – 2015',
    title: 'Backend / editor assistant, then editor',
    place: 'Strong Productions',
    where: 'Copenhagen',
    points: ['Kept media, editing software and hardware running for the editors, and later edited for a year.'],
  },
];

export const education = [
  { when: '2025 – 2026', title: 'Web developer (webudvikler)', place: 'Roskilde Tekniske Skole', note: 'Graduated October 2026' },
  { when: '2016 – 2020', title: 'Chef, gastronomy', place: 'Hotel- og Restaurantskolen', note: '' },
  { when: '2015', title: 'Classical & jazz', place: 'Copenhagen Music Academy', note: '' },
  { when: '2011 – 2014', title: 'STX, social science & music', place: 'Gribskov Gymnasium', note: '' },
];

export const certificates = [
  { when: '2021 – 2023', title: 'Associate Android Developer', place: 'Google' },
  { when: '2020 – 2022', title: 'Google Cloud certification', place: 'Google' },
];

export const languages: [string, string][] = [
  ['Danish', 'Native'],
  ['English', 'Fluent'],
  ['French', 'Basic'],
];

export const cvSkills = [
  'TypeScript', 'React', 'Next.js', 'Astro', 'Node.js', 'Express', 'MongoDB', 'Firebase', 'SpacetimeDB',
  'Turborepo', 'Storybook', 'Vitest', 'Git', 'Docker', 'GSAP', 'Three.js', 'React Three Fiber', 'WebGL',
  'Electron', 'Expo', 'Sass', 'Tailwind', 'Figma',
];
