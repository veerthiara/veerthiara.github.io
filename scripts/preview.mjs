import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import matter from "gray-matter";
import { marked } from "marked";

const root = process.cwd();
const port = Number(process.env.PORT || 4000);
const host = process.env.HOST || "127.0.0.1";

marked.setOptions({ gfm: true, breaks: false });

function read(filePath) {
  return fs.readFileSync(path.join(root, filePath), "utf8");
}

function parseMarkdown(filePath) {
  const raw = read(filePath);
  const { data, content, excerpt } = matter(raw, { excerpt: true });
  return { filePath, data, content, excerpt };
}

function ensureTrailingSlash(url) {
  return url.endsWith("/") ? url : `${url}/`;
}

function urlFor(filePath, data = {}) {
  if (data.permalink) return ensureTrailingSlash(data.permalink);
  if (filePath === "index.md") return "/";
  if (filePath.startsWith("_posts/")) {
    const slug = path.basename(filePath, ".md").replace(/^\d{4}-\d{2}-\d{2}-/, "");
    return ensureTrailingSlash(`/blog/${slug}/`);
  }
  return ensureTrailingSlash(`/${filePath.replace(/\.md$/, "")}/`);
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(input) {
  return new Date(input).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC"
  });
}

function formatLongDate(input) {
  return new Date(input).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC"
  });
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function iconSvg(name) {
  switch (name) {
    case "search":
      return `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"></circle><path d="M12.5 12.5L17 17"></path></svg>`;
    case "home":
      return `<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 2.8L17 8.6V17H12.2V12H7.8V17H3V8.6L10 2.8Z"></path></svg>`;
    case "projects":
      return `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="3" width="5" height="5" rx="1"></rect><rect x="12.5" y="3" width="5" height="5" rx="1"></rect><rect x="12.5" y="12" width="5" height="5" rx="1"></rect><path d="M7.5 5.5H10.5V14.5"></path><path d="M10.5 14.5H12.5"></path></svg>`;
    case "person":
      return `<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 10.2C12.2 10.2 14 8.4 14 6.2C14 4 12.2 2.2 10 2.2C7.8 2.2 6 4 6 6.2C6 8.4 7.8 10.2 10 10.2Z"></path><path d="M4.1 17.8C4.4 14.9 6.8 12.8 9.8 12.8H10.2C13.2 12.8 15.6 14.9 15.9 17.8V18H4.1V17.8Z"></path></svg>`;
    case "terminal":
      return `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="3" width="15" height="14" rx="2"></rect><path d="M6 8L8.8 10.5L6 13"></path><path d="M10.8 13H14"></path></svg>`;
    default:
      return "";
  }
}

const pageFiles = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && !["README.md", "DEVELOPER_NOTES.md", "FIRST_TIME_PORTFOLIO_GUIDE.md"].includes(entry.name))
  .map((entry) => entry.name);

const projectFiles = fs
  .readdirSync(path.join(root, "projects"), { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
  .map((entry) => path.join("projects", entry.name));

const postFiles = fs
  .readdirSync(path.join(root, "_posts"), { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
  .map((entry) => path.join("_posts", entry.name));

const pages = [...pageFiles, ...projectFiles].map((filePath) => {
  const page = parseMarkdown(filePath);
  return { ...page, url: urlFor(filePath, page.data) };
});

const posts = postFiles
  .map((filePath) => {
    const post = parseMarkdown(filePath);
    return { ...post, url: urlFor(filePath, post.data) };
  })
  .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));

const topNavPages = pages
  .filter((page) => page.data.nav_order && !page.data.parent)
  .sort((a, b) => a.data.nav_order - b.data.nav_order);

function findPageByTitle(title) {
  return pages.find((page) => page.data.title === title);
}

function getProjectPages() {
  return pages
    .filter((page) => page.data.parent === "Projects")
    .sort((a, b) => (a.data.nav_order || 999) - (b.data.nav_order || 999));
}

function getChildren(parentTitle) {
  return pages
    .filter((page) => page.data.parent === parentTitle)
    .sort((a, b) => (a.data.nav_order || 999) - (b.data.nav_order || 999));
}

function collectAncestorTitles(current) {
  const titles = new Set();
  let cursor = current?.data?.parent ? findPageByTitle(current.data.parent) : null;
  let depth = 0;

  while (cursor && depth < 5) {
    titles.add(cursor.data.title);
    cursor = cursor.data.parent ? findPageByTitle(cursor.data.parent) : null;
    depth += 1;
  }

  return titles;
}

function renderNavChildren(parentTitle, currentUrl, ancestorTitles, groupId) {
  const children = getChildren(parentTitle);
  const renderPosts = parentTitle === "Blog" ? posts : [];

  if (children.length === 0 && renderPosts.length === 0) return "";

  const childHtml = children
    .map((child) => {
      const childChildren = getChildren(child.data.title);
      const childActive = currentUrl === child.url || ancestorTitles.has(child.data.title);
      const childGroupId = `${groupId}-${slugify(child.data.title)}`;
      return `
        <div class="nav-block nav-block-child">
          <div class="nav-row nav-row-child">
            <a href="${child.url}"${childActive ? ' aria-current="page"' : ""}>
              <span>${escapeHtml(child.data.title)}</span>
            </a>
            ${childChildren.length > 0 ? `
              <button
                class="nav-toggle"
                type="button"
                aria-controls="${childGroupId}"
                aria-expanded="true"
                data-default-open="${childActive ? "true" : "false"}"
                title="Toggle ${escapeHtml(child.data.title)}"
              >
                <span></span>
              </button>
            ` : ""}
          </div>
          ${childChildren.length > 0 ? renderNavChildren(child.data.title, currentUrl, ancestorTitles, childGroupId) : ""}
        </div>
      `;
    })
    .join("");

  const postHtml = renderPosts
    .map((post) => `<a href="${post.url}"${currentUrl === post.url ? ' aria-current="page"' : ""}><span>${escapeHtml(post.data.title)}</span></a>`)
    .join("");

  return `<div class="side-subnav" id="${groupId}">${childHtml}${postHtml}</div>`;
}

function renderBreadcrumbs(current) {
  if (!current) return "";

  if (current.kind === "post") {
    return `<nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="/blog/">Blog</a>
      <span>/</span>
      <span aria-current="page">${escapeHtml(current.data.title)}</span>
    </nav>`;
  }

  const items = [];
  let cursor = current.data.parent ? findPageByTitle(current.data.parent) : null;
  let depth = 0;

  while (cursor && depth < 5) {
    items.unshift(`<a href="${cursor.url}">${escapeHtml(cursor.data.title)}</a>`);
    cursor = cursor.data.parent ? findPageByTitle(cursor.data.parent) : null;
    depth += 1;
  }

  if (items.length === 0) return "";

  return `<nav class="breadcrumbs" aria-label="Breadcrumb">
    ${items.join("<span>/</span>")}
    <span>/</span>
    <span aria-current="page">${escapeHtml(current.data.title)}</span>
  </nav>`;
}

function buildSearchData() {
  const pageEntries = pages.map((page) => ({
    title: page.data.title || "Untitled",
    url: page.url,
    type: page.filePath.startsWith("projects/") ? "Project" : "Page",
    section: page.data.parent || page.data.title || "Page",
    content: stripHtml(marked.parse(page.content))
  }));

  const postEntries = posts.map((post) => ({
    title: post.data.title,
    url: post.url,
    type: "Blog",
    section: "Blog",
    content: stripHtml(marked.parse(post.content))
  }));

  return JSON.stringify([...pageEntries, ...postEntries]);
}

function htmlDoc({ title, currentUrl, body, currentItem }) {
  const ancestorTitles = collectAncestorTitles(currentItem);
  const renderGroup = (filterFn, label) => {
    const items = topNavPages
      .filter(filterFn)
      .map((page) => {
        const children = getChildren(page.data.title);
        const hasPosts = page.data.title === "Blog" && posts.length > 0;
        const hasChildren = children.length > 0 || hasPosts;
        const isActive = currentUrl === page.url || ancestorTitles.has(page.data.title) || (page.data.title === "Blog" && currentItem?.kind === "post");
        const groupId = `nav-group-${slugify(page.data.title)}`;
        const iconName = page.data.title === "Home"
          ? "home"
          : page.data.title === "Projects"
            ? "projects"
            : page.data.title === "About"
              ? "person"
              : "terminal";
        return `
          <div class="nav-block">
            <div class="nav-row">
              <a class="nav-link-top" href="${page.url}"${isActive ? ' aria-current="page"' : ""}>
                <span class="nav-icon" aria-hidden="true">${iconSvg(iconName)}</span>
                <span>${escapeHtml(page.data.title)}</span>
              </a>
              ${hasChildren ? `
                <button
                  class="nav-toggle"
                  type="button"
                  aria-controls="${groupId}"
                  aria-expanded="true"
                  data-default-open="true"
                  title="Toggle ${escapeHtml(page.data.title)}"
                >
                  <span></span>
                </button>
              ` : ""}
            </div>
            ${hasChildren ? renderNavChildren(page.data.title, currentUrl, ancestorTitles, groupId) : ""}
          </div>
        `;
      })
      .join("");

    return `<div class="sidebar-group">
      <p class="sidebar-label">${label}</p>
      <nav class="side-nav" aria-label="${label} navigation">${items}</nav>
    </div>`;
  };

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)} | Veer Thiara</title>
    <meta name="description" content="Portfolio, project documentation, and learning journey">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/css/style.css">
    <script>window.SITE_SEARCH_DATA = ${buildSearchData()};</script>
    <script defer src="/assets/js/site.js"></script>
  </head>
  <body>
    <div class="site-shell">
      <div class="site-background">
        <span class="ambient ambient-a"></span>
        <span class="ambient ambient-b"></span>
        <span class="ambient ambient-c"></span>
      </div>
      <div class="app-shell">
        <aside class="sidebar">
          <a class="brand" href="/">
            <span class="brand-mark">VT</span>
            <span class="brand-copy">
              <strong>Veer Thiara</strong>
              <small>Engineering portal</small>
            </span>
          </a>
          <div class="sidebar-search">
            <div class="search-shell">
              <span class="nav-icon search-inline-icon" aria-hidden="true">${iconSvg("search")}</span>
              <input id="site-search-input" class="search-input" type="search" placeholder="Search" autocomplete="off">
              <div id="site-search-results" class="search-results" hidden></div>
            </div>
          </div>
          ${renderGroup((page) => page.data.title !== "Blog", "Explore")}
          ${renderGroup((page) => page.data.title === "Blog", "Technical Logs")}
        </aside>
        <main class="workspace">
          <header class="workspace-bar">
            <div class="workspace-header">
              ${renderBreadcrumbs(currentItem)}
              <h1 class="workspace-title">${escapeHtml(title)}</h1>
            </div>
            <button class="search-action" type="button" data-focus-search aria-label="Focus search">
              <span class="nav-icon" aria-hidden="true">${iconSvg("search")}</span>
            </button>
          </header>
          <section class="page-frame">${body}</section>
        </main>
      </div>
    </div>
  </body>
</html>`;
}

function renderHome(currentItem) {
  const projectCards = getProjectPages()
    .map((project) => {
      const summary = stripHtml(marked.parse(project.content)).slice(0, 160);
      return `<a class="post-card project-card" href="${project.url}">
        <span>Project</span>
        <strong>${escapeHtml(project.data.title)}</strong>
        <p>${escapeHtml(summary)}</p>
      </a>`;
    })
    .join("");

  const recentPosts = posts
    .slice(0, 3)
    .map((post) => {
      const excerpt = post.excerpt ? stripHtml(marked.parse(post.excerpt)) : stripHtml(marked.parse(post.content)).slice(0, 140);
      return `<a class="post-card" href="${post.url}">
        <span>${formatDate(post.data.date)}</span>
        <strong>${escapeHtml(post.data.title)}</strong>
        <p>${escapeHtml(excerpt)}</p>
      </a>`;
    })
    .join("");

  return htmlDoc({
    title: "Home",
    currentUrl: currentItem.url,
    currentItem,
    body: `<section class="hero-panel">
      <div class="hero-shell">
        <div class="hero-copy">
          <div class="hero-glow hero-glow-a"></div>
          <div class="hero-glow hero-glow-b"></div>
          <p class="eyebrow mono-text">system_core_init</p>
          <h1>Building <span class="accent-line">practical software</span>, AI systems, and product-first developer tools.</h1>
          <p class="lead">
            A compact developer portfolio focused on high-concurrency systems, AI orchestration,
            and architecture that can grow with each project.
          </p>
          <div class="hero-actions">
            <a class="button-primary" href="/projects/">View projects</a>
            <a class="button-secondary" href="/blog/">Read blog</a>
          </div>
          <div class="hero-tags">
            <span>AI Systems</span>
            <span>Local First</span>
            <span>FastAPI</span>
            <span>React</span>
            <span>LangGraph</span>
          </div>
        </div>
        <div class="hero-terminal">
          <div class="terminal-dots"><span></span><span></span><span></span></div>
          <pre><code><span class="tok-keyword">async def</span> <span class="tok-func">orchestrate_workflow</span>():
    <span class="tok-comment"># Initializing AI layer</span>
    system = CoreEngine(
        engine=<span class="tok-string">"GPT-4o"</span>,
        memory=<span class="tok-string">"VectorStore"</span>
    )
    <span class="tok-keyword">await</span> system.boot()
    <span class="tok-comment"># Processing stack...</span>
    <span class="tok-keyword">return</span> system.state</code></pre>
        </div>
      </div>
    </section>
    <section class="feature-strip">
      <div class="stat-card stat-card-blue">
        <span>Current Focus</span>
        <strong>Readable, useful project documentation</strong>
        <p>Built to work like a developer portfolio and a long-term engineering notebook.</p>
      </div>
      <div class="signal-card">
        <p class="eyebrow">Navigation Model</p>
          <div class="signal-pill-grid">
            <span>Projects</span>
            <span>Nested docs</span>
            <span>Blog posts</span>
            <span>Search</span>
          </div>
          <p>
            The site is structured to grow with project pages, child implementation notes,
            and blog posts without needing a redesign every time.
          </p>
      </div>
    </section>
    <section class="content-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Projects</p>
          <h2>Current and future builds</h2>
        </div>
      </div>
      <div class="project-grid">${projectCards}</div>
    </section>
    <section class="content-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Latest Blog</p>
          <h2>Recent notes and writeups</h2>
        </div>
      </div>
      <div class="post-grid">${recentPosts}</div>
    </section>`
  });
}

function renderProjectsIndex(currentItem) {
  const items = getProjectPages()
    .map((project) => {
      const summary = stripHtml(marked.parse(project.content)).slice(0, 180);
      return `<h2>${escapeHtml(project.data.title)}</h2>
      <p>${escapeHtml(summary)}</p>
      <p><a href="${project.url}">Open project page</a></p>`;
    })
    .join("");

  return htmlDoc({
    title: currentItem.data.title,
    currentUrl: currentItem.url,
    currentItem,
    body: `<section class="content-panel">
      <p class="eyebrow">Portal</p>
      <h1>${escapeHtml(currentItem.data.title)}</h1>
      ${currentItem.data.description ? `<p class="lead">${escapeHtml(currentItem.data.description)}</p>` : ""}
      <div class="page-content">${items}</div>
    </section>`
  });
}

function renderBlogIndex(currentItem) {
  const items = posts
    .map((post) => `<li><a href="${post.url}">${escapeHtml(post.data.title)}</a> - ${formatLongDate(post.data.date)}</li>`)
    .join("");

  return htmlDoc({
    title: currentItem.data.title,
    currentUrl: currentItem.url,
    currentItem,
    body: `<section class="content-panel">
      <p class="eyebrow">Portal</p>
      <h1>${escapeHtml(currentItem.data.title)}</h1>
      ${currentItem.data.description ? `<p class="lead">${escapeHtml(currentItem.data.description)}</p>` : ""}
      <div class="page-content"><ul>${items}</ul></div>
    </section>`
  });
}

function renderPage(currentItem) {
  return htmlDoc({
    title: currentItem.data.title,
    currentUrl: currentItem.url,
    currentItem,
    body: `<section class="content-panel">
      ${currentItem.data.show_title === false ? "" : `<p class="eyebrow">Portal</p>
      <h1>${escapeHtml(currentItem.data.title)}</h1>
      ${currentItem.data.description ? `<p class="lead">${escapeHtml(currentItem.data.description)}</p>` : ""}`}
      <div class="page-content">${marked.parse(currentItem.content)}</div>
    </section>`
  });
}

function renderPost(currentItem) {
  const categories = Array.isArray(currentItem.data.categories) ? currentItem.data.categories.join(" / ") : currentItem.data.categories || "";
  return htmlDoc({
    title: currentItem.data.title,
    currentUrl: currentItem.url,
    currentItem,
    body: `<article class="content-panel">
      ${currentItem.data.show_title === false ? "" : `<p class="eyebrow">Journal Entry</p>
      <h1>${escapeHtml(currentItem.data.title)}</h1>
      <p class="meta-line"><span>${formatDate(currentItem.data.date)}</span>${categories ? `<span> ${escapeHtml(categories)}</span>` : ""}</p>`}
      <div class="page-content">${marked.parse(currentItem.content)}</div>
    </article>`
  });
}

const routes = new Map();

routes.set("/assets/css/style.css", {
  contentType: "text/css; charset=utf-8",
  body: read("assets/css/style.css")
});

routes.set("/assets/js/site.js", {
  contentType: "application/javascript; charset=utf-8",
  body: read("assets/js/site.js")
});

for (const page of pages) {
  const currentItem = { ...page, kind: "page" };
  let body;
  if (page.filePath === "index.md") body = renderHome(currentItem);
  else if (page.filePath === "projects.md") body = renderProjectsIndex(currentItem);
  else if (page.filePath === "blog.md") body = renderBlogIndex(currentItem);
  else body = renderPage(currentItem);

  routes.set(page.url, {
    contentType: "text/html; charset=utf-8",
    body
  });
}

for (const post of posts) {
  const currentItem = { ...post, kind: "post" };
  routes.set(post.url, {
    contentType: "text/html; charset=utf-8",
    body: renderPost(currentItem)
  });
}

const server = http.createServer((req, res) => {
  const requestUrl = ensureTrailingSlash((req.url || "/").split("?")[0]);
  const route = routes.get(requestUrl) || routes.get(req.url || "/");

  if (!route) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  res.writeHead(200, { "content-type": route.contentType });
  res.end(route.body);
});

server.listen(port, host, () => {
  console.log(`Preview server running at http://${host}:${port}`);
});
