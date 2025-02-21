const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const API_URL = "https://zethirahd-production-c2af.up.railway.app/api/auth/login"; 

form.addEventListener('submit', async (e) => {
  e.preventDefault(); 

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert('Por favor preenche os campos em branco');
    return;
  }

  const data = { email, password };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok && result.token) {
      alert('Login feito com sucesso!');
      
      localStorage.setItem('token', result.token);
      
      window.location.href = '/home.html';
    } else {
      alert(result.message || 'Erro no sistema!');
    }
  } catch (error) {
    alert('Um erro ocorreu, tente novamente mais tarde');
    console.error('Login error:', error);
  }
});
