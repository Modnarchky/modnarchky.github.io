window.addEventListener("popstate", () => {
  document.body.classList.add("fade-out");

  setTimeout(() => {
    window.location.reload();
  }, 150);
});