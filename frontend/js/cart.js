function renderCart() {
  const container = document.getElementById('cart-content');
  if (!container) return;

  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    container.innerHTML = `<p>Your cart is empty. <a href="index.html">Browse products</a>.</p>`;
    return;
  }

  let totalAmount = 0;

  const cartTableHtml = `
    <table style="width:100%; border-collapse: collapse; background: white; border-radius: var(--radius);">
      <thead>
        <tr style="border-bottom: 1px solid var(--border); text-align: left; padding: 1rem;">
          <th style="padding:1rem;">Item</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${cart.map(item => {
          const itemTotal = item.price * item.quantity;
          totalAmount += itemTotal;
          return `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding:1rem; display:flex; align-items:center; gap: 1rem;">
                <img src="${item.imageUrl}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                <span>${item.name}</span>
              </td>
              <td>$${item.price.toFixed(2)}</td>
              <td>
                <input type="number" min="1" value="${item.quantity}" data-id="${item._id}" class="qty-input" style="width: 50px; padding: 4px;">
              </td>
              <td>$${itemTotal.toFixed(2)}</td>
              <td>
                <button data-id="${item._id}" class="btn btn-danger remove-btn">Remove</button>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>

    <div style="margin-top: 2rem; text-align: right; background: white; padding: 1.5rem; border-radius: var(--radius);">
      <h3>Total Amount: <span style="color: var(--primary);">$${totalAmount.toFixed(2)}</span></h3>
      <button id="checkout-btn" class="btn" style="margin-top: 1rem; font-size: 1.1rem;">Proceed to Checkout</button>
    </div>
  `;

  container.innerHTML = cartTableHtml;

  // Add event listeners for inputs & remove actions
  document.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('change', (e) => updateQuantity(e.target.dataset.id, parseInt(e.target.value)));
  });

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => removeItem(e.target.dataset.id));
  });

  document.getElementById('checkout-btn').addEventListener('click', handleCheckout);
}

function updateQuantity(productId, newQty) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const item = cart.find(i => i._id === productId);

  if (item && newQty > 0) {
    item.quantity = newQty;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
  }
}

function removeItem(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(i => i._id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

async function handleCheckout() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in to complete your checkout.');
    window.location.href = 'login.html';
    return;
  }

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const orderItems = cart.map(item => ({
    product: item._id,
    quantity: item.quantity,
    price: item.price
  }));

  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  try {
    await apiRequest('/orders', 'POST', { items: orderItems, totalAmount }, true);
    alert('Order placed successfully!');
    localStorage.removeItem('cart');
    window.location.href = 'index.html';
  } catch (err) {
    alert(`Order failed: ${err.message}`);
  }
}

document.addEventListener('DOMContentLoaded', renderCart);
