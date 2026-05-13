const carousel = document.getElementById('carousel');

// Wait for layout to fully load (important for images/fonts)
window.addEventListener('load', () => {
  const items = Array.from(carousel.children);
  
  // Clone items for seamless loop
  items.forEach(item => {
    carousel.appendChild(item.cloneNode(true));
  });

  let scroll = 0;
  const speed = 1;

  const halfWidth = carousel.scrollWidth / 2;

  function animate() {
    scroll += speed;

    if (scroll >= halfWidth) {
      scroll = 0;
    }

    carousel.style.transform = `translateX(-${scroll}px)`;
    requestAnimationFrame(animate);
  }

  animate();
});