// =========================
// PAGE TITLE
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const title = document.body.dataset.title;
  document.title = title || "Portfolio";
});


// =========================
// PAGE FADE-IN
// =========================
window.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(() => {
    document.body.classList.add("loaded");
  });
});


// =========================
// PAGE TRANSITIONS
// =========================
document.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (!link) return;

  const href = link.getAttribute("href");

  if (
    !href ||
    href.startsWith("http") ||
    href.startsWith("#") ||
    link.target === "_blank"
  ) return;

  e.preventDefault();

  document.body.classList.add("fade-out");

  setTimeout(() => {
    window.location.href = href;
  }, 150);
});


// =========================
// PROJECT LOADER
// =========================
fetch('./json/projects.json')
  .then(res => res.json())
  .then(projects => {
    const container = document.querySelector("#featured-projects .row");
    if (!container) return;

    // Detect page type
    const isHomePage = document.body.dataset.page === "home";

    // Filter logic
    const filteredProjects = isHomePage
      ? projects.filter(p => p.featured)
      : projects;

    filteredProjects.forEach(project => {
      const card = document.createElement("a");

      card.href = project.url;
      card.className = "project-link";
      card.dataset.tags = project.tags;

      // Convert tags into cleaner format (optional enhancement)
      const tagList = project.tags
        ? project.tags.split(",").map(t => t.trim())
        : [];

      card.innerHTML = `
        <div class="project-card-column">
          <div class="project-thumbnails">
            <img src="${project.thumbnail}" alt="${project.title}">
          </div>

          <div class="project-info left">
            <h4>${project.title}</h4>

            <p class="project-tags tag-spacer">
  ${tagList.map(tag => `<span class="tag-pill">${tag}</span>`).join("")}
</p>

            <div class="tag-spacer"></div>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  })
  .catch(err => console.error("Error loading projects:", err));