document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     HELPERS
  ========================================================= */
  function slugify(tag) {
    return tag
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");
  }

  /* =========================================================
     FETCH PROJECT DATA
  ========================================================= */
  fetch('./json/projects.json')
    .then(res => res.json())
    .then(projects => {

      const projectId = document.body.dataset.projectId;

      /* =========================================================
         PROJECT DETAIL PAGE
      ========================================================= */
      if (projectId) {

        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        const titleEl = document.getElementById("projectTitle");
        const breadcrumbEl = document.getElementById("breadcrumbTitle");

        if (titleEl) titleEl.textContent = project.title;
        if (breadcrumbEl) breadcrumbEl.textContent = project.title;

        const tagContainer = document.getElementById("projectTags");

        if (tagContainer && project.tags) {

          const tags = project.tags.split(",").map(t => t.trim());

          tagContainer.innerHTML = tags
            .map(tag => `
              <a class="tag-pill" href="/projects.html?tag=${slugify(tag)}">
                ${tag}
              </a>
            `)
            .join("");
        }
      }

      /* =========================================================
         PROJECT LIST PAGE
      ========================================================= */

      /* =========================================================
         BUILD FILTER BUTTONS FROM JSON
      ========================================================= */
      const filterContainer = document.getElementById("project-filters");

      if (filterContainer) {

        let allTags = [];

        projects.forEach(project => {
          if (!project.tags) return;

          allTags.push(
            ...project.tags.split(",").map(t => t.trim())
          );
        });

        const uniqueTags = [...new Set(allTags)];

        filterContainer.innerHTML = `
          <button class="filter-btn active" data-filter="all">
            All
          </button>

          ${uniqueTags.map(tag => `
            <button 
              class="filter-btn" 
              data-filter="${slugify(tag)}"
            >
              ${tag}
            </button>
          `).join("")}
        `;
      }

      /* =========================================================
         APPLY TAGS TO CARDS
      ========================================================= */
      const projectCards = document.querySelectorAll(".project-link");

      projectCards.forEach(card => {

        const tags = card.dataset.tags;
        if (!tags) return;

        const container = card.querySelector(".tag-spacer");
        if (!container) return;

        const tagArray = tags
          .split(",")
          .map(t => t.trim());

        container.innerHTML = tagArray
          .map(tag => `
            <span class="tag-pill">
              ${tag.replace(/-/g, " ")}
            </span>
          `)
          .join("");

        card.classList.add("is-visible");
      });

      /* =========================================================
         ACTIVE BUTTON STATE
      ========================================================= */
      const buttons = document.querySelectorAll(".filter-btn");

      function setActiveButton(filter) {

        buttons.forEach(btn => {

          btn.classList.toggle(
            "active",
            btn.dataset.filter === filter
          );
        });
      }

      /* =========================================================
         FILTER PROJECTS
      ========================================================= */
      function filterProjects(filter) {

        const cards = Array.from(
          document.querySelectorAll(".project-link")
        );

        // STEP 1: fade all out
        cards.forEach(card => {
          card.classList.remove("is-visible");
          card.classList.add("is-hidden");
        });

        // STEP 2: filter after fade
        setTimeout(() => {

          let delay = 0;

          cards.forEach(card => {

            const tags = (card.dataset.tags || "")
              .split(",")
              .map(t => t.trim());

            const match =
              filter === "all" ||
              tags.includes(filter);

            if (match) {

              card.classList.remove("is-hidden");

              card.style.opacity = 0;
              card.style.transform = "translateY(12px)";

              setTimeout(() => {

                card.classList.add("is-visible");

                card.style.opacity = "";
                card.style.transform = "";

              }, delay);

              delay += 50;
            }
          });

        }, 300);
      }

      /* =========================================================
         URL FILTER
         example:
         ?tag=visual-design
      ========================================================= */
      const urlParams = new URLSearchParams(window.location.search);

      const activeTag = urlParams.get("tag");

      if (activeTag) {

        filterProjects(activeTag);

        setActiveButton(activeTag);

      } else {

        filterProjects("all");
      }

      /* =========================================================
         BUTTON EVENTS
      ========================================================= */
      buttons.forEach(btn => {

        btn.addEventListener("click", () => {

          const filter = btn.dataset.filter;

          filterProjects(filter);

          setActiveButton(filter);

          // update URL without reload
          const newUrl =
            filter === "all"
              ? "./projects.html"
              : `./projects.html?tag=${filter}`;

          window.history.replaceState({}, "", newUrl);
        });
      });

    })
    .catch(err => console.error("Project load error:", err));
});