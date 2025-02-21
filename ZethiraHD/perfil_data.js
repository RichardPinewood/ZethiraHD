const token = localStorage.getItem('token');

if (!token) {
  document.getElementById('status').textContent = 'Você não está autenticado.';
} else {
  fetch('https://zethirahd-production-c2af.up.railway.app/api/auth/profile', { 
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar perfil');
      }
      return response.json();
    })
    .then(data => {
      document.getElementById('status').textContent = ''; // Clear status message
      
      document.getElementById('username').textContent = data.username;
      document.getElementById('email').textContent = data.email;
    })
    .catch(error => {
      document.getElementById('status').textContent = 'Erro ao carregar o perfil.';
      console.error('Erro:', error);
    });
}
