const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Listen for form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent the form from refreshing the page

  // Get the values from the form fields
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Check if both fields are filled in
  if (!email || !password) {
    alert('Please fill in all fields');
    return;
  }

  const data = { email, password };

  try {
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

   
    if (response.ok && result.token) {
      alert('Login successful!');
     
      localStorage.setItem('token', result.token);
     
      window.location.href = '/home.html';
    } else {
     
      alert(result.message || 'Login failed!');
    }
  } catch (error) {
    
    alert('An error occurred. Please try again later.');
    console.error('Login error:', error);
  }
});