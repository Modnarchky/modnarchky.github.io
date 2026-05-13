document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".track");
  const slides = document.querySelectorAll(".slide");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");
  const dotsContainer = document.querySelector(".dots");

  let index = 0;
  const total = slides.length;

  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  // =========================
  // CORE SLIDER
  // =========================
  function updateSlider() {
    track.style.transform = `translateX(-${index * 100}%)`;
    updateDots();
  }

  function next() {
    index = (index + 1) % total; // ✅ LOOP FIX
    updateSlider();
  }

  function prev() {
    index = (index - 1 + total) % total; // ✅ LOOP FIX
    updateSlider();
  }

  // =========================
  // DOTS
  // =========================
  function createDots() {
    for (let i = 0; i < total; i++) {
      const dot = document.createElement("button");
      dot.className = "dot";

      dot.addEventListener("click", () => {
        index = i;
        updateSlider();
      });

      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    document.querySelectorAll(".dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  // =========================
  // BUTTONS
  // =========================
  nextBtn?.addEventListener("click", next);
  prevBtn?.addEventListener("click", prev);

  // =========================
  // SWIPE / DRAG (mouse + touch)
  // =========================
  const getX = (e) => e.clientX;

  track.addEventListener("pointerdown", (e) => {
    isDragging = true;
    startX = getX(e);
    track.setPointerCapture(e.pointerId);
  });

  track.addEventListener("pointermove", (e) => {
    if (!isDragging) return;

    currentX = getX(e);
    const diff = currentX - startX;

    track.style.transition = "none";
    track.style.transform = `translateX(calc(-${index * 100}% + ${diff}px))`;
  });

  function endDrag(e) {
    if (!isDragging) return;

    isDragging = false;
    track.releasePointerCapture(e.pointerId);

    const diff = currentX - startX;
    const threshold = 80;

    track.style.transition = "transform 0.5s ease";

    if (diff > threshold) {
      prev();
    } else if (diff < -threshold) {
      next();
    } else {
      updateSlider(); // snap back
    }
  }

  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", () => {
    isDragging = false;
    updateSlider();
  });

  // =========================
  // INIT
  // =========================
  createDots();
  updateSlider();

  window.addEventListener("resize", updateSlider);
});