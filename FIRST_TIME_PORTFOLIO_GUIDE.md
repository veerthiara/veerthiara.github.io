# First-Time Portfolio Guide

This file explains the repo in plain English for someone modifying a personal Jekyll portfolio for the first time.

## Big picture

This site is no longer just the plain default GitHub Pages theme.

It now has:
- custom layouts
- custom CSS
- custom JavaScript for sidebar collapse and search
- a small local preview server so you can test changes without relying on GitHub Pages

## What is Jekyll here?

Jekyll is the static site generator GitHub Pages uses to turn Markdown files into HTML pages.

In this repo:
- `about.md`, `projects.md`, `blog.md`, and files in `projects/` and `_posts/` are the content
- files in `_layouts/` define the page structure
- files in `_includes/` are reusable layout fragments
- `assets/css/style.css` defines the look
- `assets/js/site.js` adds search and collapsible sidebar behavior

## What is the Gemfile?

`Gemfile` is a Ruby dependency file.

It tells Ruby/Bundler which gems would be needed for a local Jekyll setup.

In simple terms:
- Jekyll itself is a Ruby tool
- the `Gemfile` is how Ruby projects list their packages

For your day-to-day content edits, you usually do not need to touch `Gemfile`.

## What is the vendor folder?

`vendor/` is usually where locally installed dependencies can end up.

For this repo, it is not part of the site content itself.
It is just support material for local tooling if Bundler installs gems there.

You generally do not edit `vendor/`.

## What is scripts/preview.mjs?

`scripts/preview.mjs` is a small local preview server written in Node.js.

Its role:
- read your Markdown files
- render them into HTML locally
- serve the site on `http://127.0.0.1:4000`

This lets you preview the site even if local Jekyll setup is inconvenient.

## What does .mjs mean?

`.mjs` means it is a JavaScript module file for Node.js.

You can think of it as:
- still JavaScript
- just using the modern module system (`import ... from ...`)

It is not a special site format. It is just the preview script.

## What should you edit most often?

Most common files:

`about.md`
- About page content

`projects/`
- individual project pages

`_posts/`
- blog posts

`assets/css/style.css`
- theme, colors, spacing, layout styling

`_layouts/default.html`
- sidebar, header, search bar, overall shell

`_layouts/home.html`
- homepage content and homepage visual sections

## How the sidebar works now

Top-level items come from pages like:
- Home
- Projects
- About
- Blog

Child pages come from front matter.

Example:

```yaml
title: Habit Tracker
parent: Projects
nav_order: 1
```

If later you add a child under that project:

```yaml
title: API Design
parent: Habit Tracker
nav_order: 2
```

it will appear nested under Habit Tracker automatically.

Blog posts are shown automatically under Blog.

## How search works

Search is client-side.

That means:
- there is no database
- there is no backend search service
- the browser searches through a JSON list of site pages and posts

The search logic lives in `assets/js/site.js`.

## How to preview locally

Recommended local workflow:

1. `npm install`
2. `npm run preview`
3. open `http://127.0.0.1:4000`

## What to ignore

Usually do not worry about:
- `vendor/`
- `node_modules/`
- Bundler internals

Focus on:
- Markdown content
- `_layouts/`
- `_includes/`
- `assets/css/style.css`
- `assets/js/site.js`

## If you want the simplest mental model

Think of the repo like this:

- Markdown files = your writing and project content
- `_layouts/` = page skeletons
- `_includes/` = reusable layout pieces
- `style.css` = visual design
- `site.js` = interactions
- `preview.mjs` = local test server
