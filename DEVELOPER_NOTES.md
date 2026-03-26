# Developer Notes

This repo has been migrated from Jekyll to Astro + Starlight.

## Core structure

`src/pages/index.astro`
- custom landing page
- this is where future scroll-based animation work should happen

`src/pages/about.astro`
- custom About page

`src/content/docs/projects/`
- project documentation pages used by Starlight

`src/content/docs/blog/`
- engineering note pages used by Starlight

`src/styles/global.css`
- homepage styling
- shared visual direction
- Starlight color overrides

`astro.config.mjs`
- Starlight site config
- sidebar groups
- social links
- deployment-safe site metadata

`src/content.config.ts`
- docs collection config for Starlight

`.github/workflows/deploy.yml`
- GitHub Pages deployment workflow

## Navigation model

There are now two navigation systems:

1. Landing page navigation
- defined directly in `src/pages/index.astro`
- used for Home, Projects, Blog, About, LinkedIn

2. Starlight docs sidebar
- configured in `astro.config.mjs`
- `Projects` autogenerates from `src/content/docs/projects/`
- `Blog` autogenerates from `src/content/docs/blog/`

## Adding content

New project:
- add a new file under `src/content/docs/projects/`

New blog note:
- add a new file under `src/content/docs/blog/`

Use this frontmatter shape:

```yaml
---
title: Example Title
description: Short summary
editUrl: false
head: []
template: doc
sidebar:
  hidden: false
  attrs: {}
pagefind: true
draft: false
---
```

## Local development

Use Node 22.

Recommended:

1. `nvm use`
2. `npm install`
3. `npm run dev`

If you stay on the machine’s older default Node version, Astro 6 will not start.

## Animation plan

When you add the Apple-style scroll sequence later:

- keep it on `src/pages/index.astro`
- use a separate component if it grows large
- prefer a single strong pinned section instead of many small gimmicks
- use reduced-motion fallbacks

## If you come back later

If you forget where to edit:

- homepage: `src/pages/index.astro`
- docs sidebar/content: `src/content/docs/`
- theme: `src/styles/global.css`
- global site config: `astro.config.mjs`
