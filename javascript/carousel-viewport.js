document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".track");
  const slides = document.querySelectorAll(".slide");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");
  const dotsContainer = document.querySelector(".dots");

  let index = 0;
  const total = slides.length;

  function isMobile() {
    return window.innerWidth <= 1024;
  }

  // DESKTOP SLIDE
  function updateSlider() {
    if (!isMobile()) {
      track.style.transform = `translateX(-${index * 100}%)`;
    }
    updateDots();
  }

  function next() {
    index = (index + 1) % total;

    if (isMobile()) {
      scrollToSlide(index);
    } else {
      updateSlider();
    }
  }

  function prev() {
    index = (index - 1 + total) % total;

    if (isMobile()) {
      scrollToSlide(index);
    } else {
      updateSlider();
    }
  }

  // MOBILE SCROLL
  function scrollToSlide(i) {
    const slideWidth = slides[0].offsetWidth;
    track.scrollTo({
      left: i * slideWidth,
      behavior: "smooth"
    });
  }

  // DOTS
  function createDots() {
    for (let i = 0; i < total; i++) {
      const dot = document.createElement("button");
      dot.className = "dot";

      dot.addEventListener("click", () => {
        index = i;

        if (isMobile()) {
          scrollToSlide(index);
        } else {
          updateSlider();
        }
      });

      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    document.querySelectorAll(".dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  // sync dots when swiping
  track.addEventListener("scroll", () => {
    if (isMobile()) {
      const slideWidth = slides[0].offsetWidth;
      const i = Math.round(track.scrollLeft / slideWidth);
      index = i;
      updateDots();
    }
  });

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  createDots();
  updateSlider();

  window.addEventListener("resize", updateSlider);
});