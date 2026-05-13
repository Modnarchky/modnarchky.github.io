document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     ===================== COMPARE LIGHTBOX ===================
  ========================================================= */

  const lightbox = document.getElementById("lightbox-compare");

  const lbAfter = document.getElementById("lb-after");
  const lbBefore = document.getElementById("lb-before");

  const slider = lightbox.querySelector(".slider");
  const beforeWrapper = lightbox.querySelector(".before-wrapper");
  const sliderLine = lightbox.querySelector(".slider-line");

  function updateCompare() {
    const value = slider.value;

    beforeWrapper.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
    sliderLine.style.left = value + "%";
  }

  slider.addEventListener("input", updateCompare);

  document.querySelectorAll(".open-lightbox-compare").forEach(img => {
    img.addEventListener("click", () => {
      lbAfter.src = img.dataset.after;
      lbBefore.src = img.dataset.before;

      slider.value = 50;
      updateCompare();

      lightbox.classList.add("active");
    });
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove("active");
    }
  });

  document.getElementById("lightboxClose").addEventListener("click", () => {
    lightbox.classList.remove("active");
  });


  /* =========================================================
     ====================== ZOOM LIGHTBOX =====================
  ========================================================= */

  const zoomLightbox = document.getElementById("lightbox-zoom");
  const zoomImg = document.getElementById("lightboxZoomImg");
  const closeBtn = document.getElementById("lightboxZoomClose");
  const zoomContainer = document.querySelector(".zoom-container");

  let scale = 1;
  let baseScale = 1;
  let maxScale = 4;

  let pointX = 0;
  let pointY = 0;

  let isDragging = false;
  let hasDragged = false;
  let startX = 0;
  let startY = 0;

  const DRAG_THRESHOLD = 5;

  let zoomLevels = [];
  let zoomIndex = 0;

  function calculateFitScale(img) {
    const maxW = window.innerWidth * 0.9;
    const maxH = window.innerHeight * 0.85;

    return Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
  }

  function updateTransform() {
    zoomImg.style.transform =
      `translate(${pointX}px, ${pointY}px) scale(${scale})`;

    updateCursor();
  }

  function updateCursor() {
    zoomContainer.classList.remove("zoom-in", "zoom-out", "grabbing");

    if (isDragging) {
      zoomContainer.classList.add("grabbing");
      return;
    }

    if (scale >= maxScale - 0.01) {
      zoomContainer.classList.add("zoom-out");
    } else {
      zoomContainer.classList.add("zoom-in");
    }
  }

  /* OPEN */
  document.querySelectorAll(".open-lightbox-zoom").forEach(img => {
    img.addEventListener("click", () => {
      zoomImg.src = img.dataset.zoom || img.src;
      zoomLightbox.classList.add("active");

      zoomImg.onload = () => {
        baseScale = calculateFitScale(zoomImg);

        zoomLevels = [
          baseScale,
          baseScale * 1.5,
          baseScale * 2.5,
          baseScale * 4
        ];

        maxScale = zoomLevels[zoomLevels.length - 1];

        zoomIndex = 0;
        scale = baseScale;

        pointX = (window.innerWidth - zoomImg.naturalWidth * scale) / 2;
        pointY = (window.innerHeight - zoomImg.naturalHeight * scale) / 2;

        updateTransform();
      };
    });
  });

  /* CLOSE */
  function closeZoom() {
    zoomLightbox.classList.remove("active");
    zoomImg.src = "";

    scale = 1;
    pointX = 0;
    pointY = 0;
  }

  closeBtn.addEventListener("click", closeZoom);

  zoomLightbox.addEventListener("click", (e) => {
    if (e.target === zoomLightbox) closeZoom();
  });

  /* CLICK ZOOM */
  zoomContainer.addEventListener("click", (e) => {
    if (hasDragged) {
      hasDragged = false;
      return;
    }

    const xs = (e.clientX - pointX) / scale;
    const ys = (e.clientY - pointY) / scale;

    zoomIndex = (zoomIndex + 1) % zoomLevels.length;
    scale = zoomLevels[zoomIndex];

    pointX = e.clientX - xs * scale;
    pointY = e.clientY - ys * scale;

    updateTransform();
  });

  /* DRAG */
  zoomContainer.addEventListener("mousedown", (e) => {
    if (scale <= baseScale) return;

    isDragging = true;
    hasDragged = false;

    startX = e.clientX - pointX;
    startY = e.clientY - pointY;

    updateCursor();
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const dx = Math.abs(e.clientX - (startX + pointX));
    const dy = Math.abs(e.clientY - (startY + pointY));

    if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
      hasDragged = true;
    }

    pointX = e.clientX - startX;
    pointY = e.clientY - startY;

    updateTransform();
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
    updateCursor();
  });

  /* WHEEL ZOOM */
  zoomContainer.addEventListener("wheel", (e) => {
    e.preventDefault();

    const zoomFactor = 1.08;

    const xs = (e.clientX - pointX) / scale;
    const ys = (e.clientY - pointY) / scale;

    if (e.deltaY < 0) {
      scale *= zoomFactor;
    } else {
      scale /= zoomFactor;
    }

    scale = Math.min(Math.max(scale, baseScale), maxScale);

    pointX = e.clientX - xs * scale;
    pointY = e.clientY - ys * scale;

    updateTransform();
  }, { passive: false });

});