document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-links a"); // Get all nav links
    const currentPage = window.location.pathname.split("/").pop(); // Get current page name
  
    navLinks.forEach(link => {
      if (link.getAttribute("href") === currentPage) {
        link.classList.add("active"); // Highlight active link
      } else {
        link.classList.remove("active"); // Remove active from other links
      }
    });
  });
  