document.getElementById("menu-toggle").addEventListener("click", function() {
    const navLinks = document.getElementById("nav-links");
    navLinks.classList.toggle("show");
  });

  function toggleFaq(element) {
    element.classList.toggle("active");
  }