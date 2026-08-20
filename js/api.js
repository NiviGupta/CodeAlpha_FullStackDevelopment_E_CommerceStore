const API_BASE_URL = 'http://localhost:5001/api';

// Generic Fetch Wrapper
async function apiRequest(endpoint, method = 'GET', data = null, requiresAuth = false) {
  const headers = { 'Content-Type': 'application/json' };

  if (requiresAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.message || 'Something went wrong');
    }

    return resData;
  } catch (err) {
    throw err;
  }
}

// Global Auth State Handler for Navigation Bar
function updateNavBar() {
  const user = JSON.parse(localStorage.getItem('user'));
  const authLinks = document.getElementById('auth-links');
  
  if (authLinks) {
    if (user) {
      authLinks.innerHTML = `
        <span>Welcome, ${user.name}</span>
        <a href="#" id="logout-btn">Logout</a>
      `;
      document.getElementById('logout-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
      });
    } else {
      authLinks.innerHTML = `
        <a href="login.html">Login</a>
        <a href="register.html">Register</a>
      `;
    }
  }
  
  updateCartCount();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartBadge = document.getElementById('cart-badge');
  if (cartBadge) {
    cartBadge.textContent = totalItems;
  }
}

document.addEventListener('DOMContentLoaded', updateNavBar);
