# sebastiankoster.dev

My portfolio. Built with [Astro](https://astro.build) and GSAP, deployed to GitHub Pages by a GitHub Action on every push to `main`.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build
```

## Where things live

| What | Where |
| --- | --- |
| Projects (one markdown file each) | `src/content/work/*.md` |
| Project images | `src/assets/work/` |
| Project footage (silent loops) | `public/media/work/<slug>/loop.mp4` + `.webm` + `.jpg` |
| CV content | `src/pages/cv.astro` (arrays at the top) |
| CV PDF | `public/cv/sebastian-koster-cv.pdf` |
| Email, socials, skills ticker | `src/site.ts` |
| The menu | `src/components/Menu.astro` |
| Contour background (WebGL) | `src/scripts/contour.ts` |

## Adding a project

```md
---
title: My Project
summary: One line for cards and lists.
category: Web            # Product | Web | Games | Music
year: 2026
role: Developer
client: Optional client name
stack: [React, TypeScript]
cover: ../../assets/work/my-project.png   # or clip + poster for footage
clip: /media/work/my-project/loop.mp4
poster: /media/work/my-project/loop.jpg
links:
  - { label: View live, url: 'https://example.com' }
featured: false          # true shows it under "Selected work" on the home page
order: 20
---

The story, in markdown.
```

Without a cover or clip, the project gets a dark typographic cover.

## Deployment

In the repo's **Settings → Pages**, **Source** must be set to **GitHub Actions**. The custom domain comes from `public/CNAME`.
