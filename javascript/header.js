fetch('./partials/header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;

    const toggle = document.getElementById('toggle');
    const nav = document.getElementById('mainNav');

    if (toggle && nav) {
      toggle.addEventListener('change', function () {
        nav.classList.toggle('active', this.checked);
      });
    }
  })
  .catch(error => console.error('Error loading header:', error));