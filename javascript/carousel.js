const carousel = document.getElementById("carousel");

let speed = 1;
let offset = 0;
let halfWidth = 0;

function setup() {
  const items = Array.from(carousel.children);

  // duplicate once for seamless loop
  items.forEach(el => {
    carousel.appendChild(el.cloneNode(true));
  });

  // wait for layout AFTER images load
  requestAnimationFrame(() => {
    halfWidth = carousel.scrollWidth / 2;
    animate();
  });
}

function animate() {
  offset += speed;

  if (offset >= halfWidth) {
    offset = 0;
  }

  carousel.style.transform = `translate3d(${-offset}px, 0, 0)`;

  requestAnimationFrame(animate);
}

window.addEventListener("load", setup);