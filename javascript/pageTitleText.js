document.addEventListener("DOMContentLoaded", () => {
  const title = document.body.dataset.title;

  document.title = title;

  // H2
  const h2 = document.getElementById("pageTitleText");
  if (h2) h2.innerText = title;

  // Breadcrumb
  const breadcrumb = document.getElementById("breadcrumbTitle");
  if (breadcrumb) breadcrumb.innerText = title;
});