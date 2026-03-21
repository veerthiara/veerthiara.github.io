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
  const focusButtons = document.querySelectorAll("[data-focus-search]");

  if (!input) return;

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
}

document.addEventListener("DOMContentLoaded", () => {
  initNavToggles();
  initSearch();
});
