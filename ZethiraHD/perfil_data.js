const token = localStorage.getItem('token');

if (!token) {
  document.getElementById('status').textContent = 'Você não está autenticado.';
} else {
  // Faz a requisição para a rota /profile com o token no cabeçalho
  fetch('http://localhost:5000/api/auth/profile', {
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
      // Remove a mensagem de status
      document.getElementById('status').textContent = '';
      
      // Atualiza os elementos existentes com os dados do perfil
      document.getElementById('username').textContent = data.username;
      document.getElementById('email').textContent = data.email;
    })
    .catch(error => {
      document.getElementById('status').textContent = 'Erro ao carregar o perfil.';
      console.error('Erro:', error);
    });
}
