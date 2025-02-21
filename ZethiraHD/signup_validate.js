const form = document.querySelector('form');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !email || !password) {
    alert('Por favor preenche os campos em branco');
    return;
  }

  const data = { username, email, password };

  try {
    const response = await fetch('https://zethirahd-production-c2af.up.railway.app/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok && result.token) {
      alert('Registro feito com sucesso!');
      localStorage.setItem('token', result.token);
      window.location.href = '/home.html';
    } else {
      alert(result.message || 'Registration failed!');
    }
  } catch (error) {
    alert('Ups,aconteçeu alguma coisa,tenta outra vez.');
    console.error('Registration error:', error);
  }
});
