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
    alert('Please fill in all fields');
    return;
  }

  const data = { username, email, password };

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok && result.token) {
      alert('Registration successful!');
      
      localStorage.setItem('token', result.token);
     
      window.location.href = '/home.html';
    } else {
      alert(result.message || 'Registration failed!');
    }
  } catch (error) {
    alert('An error occurred. Please try again later.');
    console.error('Registration error:', error);
  }
});
