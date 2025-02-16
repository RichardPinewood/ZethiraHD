document.addEventListener('DOMContentLoaded', function() {
    const logoutLink = document.getElementById('logout');
    logoutLink.addEventListener('click', function(event) {
      event.preventDefault();
      if (confirm('Tens a certeza que queres sair?')) {
        window.location.href = 'index.html';
      }
    });
  });