# Developer Notes

This repo is intentionally small. The goal is to keep edits obvious even if you only touch it occasionally.

## Where to edit things

`_layouts/default.html`
- Controls the overall shell.
- Edit this if you want to change the sidebar structure, brand block, or workspace header.

`_layouts/home.html`
- Controls the homepage hero, focus cards, and latest posts section.
- Edit this when you want to change the landing page messaging.

`_layouts/page.html`
- Controls the wrapper used by normal pages like About, Projects, and Blog.

`_layouts/post.html`
- Controls blog post pages.

`assets/css/style.css`
- Main theme file.
- Search for `.side-nav a[aria-current="page"]` to change the active sidebar color.
- Search for `.nav-toggle` to adjust the collapse button look.
- Search for `body {` to change the overall dark theme palette.
- Search for `.content-panel` to change card look and spacing.
- Search for `.hero-panel`, `.hero-glow`, and `.ambient` to tune homepage motion and color.

`assets/js/site.js`
- Handles collapsible sidebar groups.
- Handles sitewide search.
- Search for `initSearch` if you want to change how matching works.
- Search for `initNavToggles` if you want to change submenu open/close behavior.

`_includes/nav-children.html`
- Recursive sidebar submenu rendering.
- This is what lets Projects show nested child pages and Blog show posts.

`_includes/breadcrumbs.html`
- Controls breadcrumb rendering for nested project pages and blog posts.

`index.md`, `about.md`, `projects.md`, `blog.md`
- Main content pages.

`projects/habit-tracker.md`
- Main project detail page.

`_posts/`
- Blog posts.

## Navigation

Navigation comes from page front matter.

Use this on top-level pages:

```yaml
title: About
nav_order: 3
```

Rules:
- Lower `nav_order` means earlier in the sidebar.
- Only top-level pages with `nav_order` appear in the main sidebar.
- Child pages with `parent: Projects` appear inside the Projects submenu.
- Child pages with `parent: Habit Tracker` appear nested under Habit Tracker automatically.
- Blog posts appear under the Blog submenu automatically.

Example nested project child:

```yaml
title: API Design
parent: Habit Tracker
nav_order: 2
```

## Theme guidance

Current direction:
- Dark background
- Neutral blue-gray panels
- VS Code-like sidebar
- Blue active nav highlight

Fastest theme changes:
- Edit colors in `assets/css/style.css`
- Keep layout changes in `_layouts/default.html`
- Keep homepage content changes in `_layouts/home.html`

## Local preview

This repo has two preview paths:

1. `npm run preview`
- Recommended for local iteration here.
- Uses `scripts/preview.mjs`.
- Mirrors the sidebar, search, breadcrumbs, and project/blog submenu behavior.

2. Jekyll / GitHub Pages
- The site content is still Jekyll-friendly.
- Local Jekyll preview may require a newer Ruby setup than the system Ruby on this machine.

## If you come back later

If you forget where to edit:
- Structure: `_layouts/`
- Theme: `assets/css/style.css`
- Content: markdown files in the repo root, `projects/`, and `_posts/`
