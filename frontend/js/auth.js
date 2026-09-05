function isApiUnavailable(error) {
  return error.name === 'TypeError' || error.message === 'Failed to fetch';
}

function createDemoSession(name, email, password) {
  const users = JSON.parse(localStorage.getItem('demo-users')) || [];
  const existingUser = users.find(user => user.email === email);

  if (existingUser) {
    throw new Error('An account with this email already exists.');
  }

  const user = { id: `demo-${Date.now()}`, name, email, password };
  users.push(user);
  localStorage.setItem('demo-users', JSON.stringify(users));
  localStorage.setItem('token', `demo-token-${user.id}`);
  localStorage.setItem('user', JSON.stringify({ id: user.id, name, email }));
}

function loginDemoUser(email, password) {
  const users = JSON.parse(localStorage.getItem('demo-users')) || [];
  const user = users.find(item => item.email === email && item.password === password);

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  localStorage.setItem('token', `demo-token-${user.id}`);
  localStorage.setItem('user', JSON.stringify({ id: user.id, name: user.name, email }));
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const errorMsg = document.getElementById('error-msg');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      try {
        const data = await apiRequest('/auth/login', 'POST', { email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = 'index.html';
      } catch (err) {
        try {
          if (!isApiUnavailable(err)) throw err;
          loginDemoUser(email, password);
          window.location.href = 'index.html';
        } catch (fallbackError) {
          errorMsg.innerHTML = `<div class="alert alert-danger">${fallbackError.message}</div>`;
        }
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      try {
        const data = await apiRequest('/auth/register', 'POST', { name, email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = 'index.html';
      } catch (err) {
        try {
          if (!isApiUnavailable(err)) throw err;
          createDemoSession(name, email, password);
          window.location.href = 'index.html';
        } catch (fallbackError) {
          errorMsg.innerHTML = `<div class="alert alert-danger">${fallbackError.message}</div>`;
        }
      }
    });
  }
});
