# First-Time Portfolio Guide

This file explains the repo in plain English for someone modifying an Astro portfolio for the first time.

## Big picture

This site now has two parts:

- a custom Astro landing page at `/`
- Starlight-powered docs pages for projects and blog notes

That means the homepage is fully custom, while the project and blog sections get docs-style navigation and search.

## What is Astro?

Astro is the site framework now used in this repo.

In simple terms:

- Astro builds static HTML pages
- you can create custom pages with `.astro` files
- it also works well with Markdown content

## What is Starlight?

Starlight is the docs layer built on top of Astro.

It handles:

- sidebar navigation
- search
- docs page layout
- project and blog content structure

## Most important files now

`astro.config.mjs`
- Main Astro and Starlight configuration
- controls site title, sidebar groups, social links, and docs behavior

`src/pages/index.astro`
- custom landing page

`src/pages/about.astro`
- custom About page

`src/content/docs/projects/`
- project documentation pages

`src/content/docs/blog/`
- blog and engineering note pages

`src/styles/global.css`
- main styling for both the landing page and Starlight theme overrides

`.github/workflows/deploy.yml`
- GitHub Pages deployment

## How to add a new project

Create a new Markdown file inside `src/content/docs/projects/`.

Example:

`src/content/docs/projects/my-new-project.md`

Use frontmatter like:

```yaml
---
title: My New Project
description: Short summary of the project.
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

Then write the content below it in Markdown.

## How to add a new blog post

Create a Markdown file inside `src/content/docs/blog/`.

Use the same frontmatter shape as the project docs and change the title and description.

## How the sidebar works

The Starlight sidebar is configured in `astro.config.mjs`.

Right now:

- `Projects` autogenerates from `src/content/docs/projects/`
- `Blog` autogenerates from `src/content/docs/blog/`

So if you add a new file in one of those folders, it will appear in the sidebar automatically.

## How to preview locally

This repo expects Node 22.

Recommended workflow:

1. `nvm use`
2. `npm install`
3. `npm run dev`

If `nvm use` does not work yet, install Node 22 first.

## What .nvmrc means

`.nvmrc` is a tiny file that tells `nvm` which Node version this repo expects.

Here it is set to:

`22`

## Simplest mental model

Think of the repo like this:

- `src/pages/` = custom website pages
- `src/content/docs/` = your long-term content
- `astro.config.mjs` = site settings
- `global.css` = site look and feel
- GitHub Action = deployment
