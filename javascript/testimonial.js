document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".track");
  const slides = document.querySelectorAll(".slide");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");
  const dotsContainer = document.querySelector(".dots");

  let index = 0;
  const total = slides.length;
  const dots = [];

  const isMobile = window.matchMedia("(max-width: 1024px)").matches;

  let startX = 0;
  let currentX = 0;
  let dragging = false;

  // =========================
  // DOTS
  // =========================
  function createDots() {
    const frag = document.createDocumentFragment();

    for (let i = 0; i < total; i++) {
      const dot = document.createElement("button");
      dot.className = "dot";
      dot.addEventListener("click", () => setIndex(i));
      dots.push(dot);
      frag.appendChild(dot);
    }

    dotsContainer.appendChild(frag);
  }

  function updateDots() {
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }

  // =========================
  // BUTTON STATE (DESKTOP ONLY)
  // =========================
  function updateButtons() {
    if (!nextBtn || !prevBtn) return;

    if (isMobile) return;

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === total - 1;
  }

  // =========================
  // RENDER
  // =========================
  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    updateDots();
    updateButtons();
  }

  // =========================
  // ANIMATED NAV (DESKTOP)
  // =========================
  function animateTo(newIndex, dir) {
    track.style.transition = "transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)";
    index = newIndex;
    render();
  }

  function next() {
    if (index < total - 1) {
      animateTo(index + 1, "next");
    }
  }

  function prev() {
    if (index > 0) {
      animateTo(index - 1, "prev");
    }
  }

  function setIndex(i) {
    const newIndex = Math.max(0, Math.min(i, total - 1));
    index = newIndex;
    render();
  }

  // =========================
  // BUTTON EVENTS (DESKTOP ONLY)
  // =========================
  nextBtn?.addEventListener("click", next);
  prevBtn?.addEventListener("click", prev);

  // =========================
  // SWIPE (MOBILE / TABLET)
  // =========================
  if (isMobile) {
    track.style.touchAction = "pan-x";
    track.style.transition = "transform 0.3s ease";

    track.addEventListener("pointerdown", (e) => {
      dragging = true;
      startX = e.clientX;

      track.style.transition = "none";
    });

    track.addEventListener("pointermove", (e) => {
      if (!dragging) return;

      currentX = e.clientX;
      const diff = currentX - startX;

      track.style.transform =
        `translateX(calc(-${index * 100}% + ${diff}px))`;
    });

    track.addEventListener("pointerup", () => {
      dragging = false;

      const diff = currentX - startX;
      const threshold = 60;

      track.style.transition = "transform 0.3s ease";

      if (diff < -threshold && index < total - 1) {
        index++;
      } else if (diff > threshold && index > 0) {
        index--;
      }

      render();
    });

    track.addEventListener("pointercancel", () => {
      dragging = false;
      render();
    });
  }

  // =========================
  // INIT
  // =========================
  createDots();
  render();
});