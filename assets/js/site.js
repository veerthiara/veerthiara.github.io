function initNavToggles() {
  const toggles = document.querySelectorAll(".nav-toggle");

  toggles.forEach((toggle) => {
    const groupId = toggle.getAttribute("aria-controls");
    const group = groupId ? document.getElementById(groupId) : null;

    if (!group) return;

    const storageKey = `nav:${groupId}`;
    const stored = window.localStorage.getItem(storageKey);
    const defaultOpen = toggle.dataset.defaultOpen !== "false";
    const isOpen = stored === null ? defaultOpen : stored === "true";

    toggle.setAttribute("aria-expanded", String(isOpen));
    group.hidden = !isOpen;

    toggle.addEventListener("click", () => {
      const next = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(next));
      group.hidden = !next;
      window.localStorage.setItem(storageKey, String(next));
    });
  });
}

function initSearch() {
  const input = document.getElementById("site-search-input");
  const results = document.getElementById("site-search-results");
  const focusButtons = document.querySelectorAll("[data-focus-search]");
  const searchData = Array.isArray(window.SITE_SEARCH_DATA) ? window.SITE_SEARCH_DATA : [];

  if (!input) return;

  function scoreResult(item, query) {
    const haystack = `${item.title} ${item.section} ${item.type} ${item.content}`.toLowerCase();
    const parts = query.toLowerCase().split(/\s+/).filter(Boolean);

    if (parts.length === 0) return 0;

    let score = 0;
    for (const part of parts) {
      if (!haystack.includes(part)) return 0;
      if (item.title.toLowerCase().includes(part)) score += 6;
      if (item.section.toLowerCase().includes(part)) score += 2;
      if (item.content.toLowerCase().includes(part)) score += 1;
    }

    return score;
  }

  function hideResults() {
    if (!results) return;
    results.hidden = true;
    results.innerHTML = "";
  }

  function renderResults(items) {
    if (!results) return;

    if (items.length === 0) {
      results.innerHTML = '<div class="search-empty">No matches found</div>';
      results.hidden = false;
      return;
    }

    results.innerHTML = items
      .slice(0, 8)
      .map((item) => {
        const snippet = item.content.slice(0, 120);
        return `
          <a class="search-result" href="${item.url}">
            <span>${item.type} / ${item.section}</span>
            <strong>${item.title}</strong>
            <p>${snippet}</p>
          </a>
        `;
      })
      .join("");
    results.hidden = false;
  }

  input.addEventListener("input", () => {
    if (!results) return;

    const query = input.value.trim();
    if (!query) {
      hideResults();
      return;
    }

    const matches = searchData
      .map((item) => ({ ...item, score: scoreResult(item, query) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    renderResults(matches);
  });

  input.addEventListener("focus", () => {
    if (results && input.value.trim()) {
      input.dispatchEvent(new Event("input"));
    }
  });

  focusButtons.forEach((button) => {
    button.addEventListener("click", () => {
      input.focus();
      input.select();
    });
  });

  document.addEventListener("keydown", (event) => {
    if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || event.key === "/") {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      event.preventDefault();
      input.focus();
      input.select();
    }
  });

  document.addEventListener("click", (event) => {
    if (!results) return;
    if (!results.contains(event.target) && event.target !== input) {
      hideResults();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNavToggles();
  initSearch();
});
