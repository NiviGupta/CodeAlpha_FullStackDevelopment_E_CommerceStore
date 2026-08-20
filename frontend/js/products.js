// Fetch and display product catalog
async function loadProducts() {
  const container = document.getElementById('product-container');
  if (!container) return;

  try {
    const products = await apiRequest('/products');

    if (products.length === 0) {
      container.innerHTML = `<p>No products found. Run <code style="background:#ddd;padding:2px 4px;">http://localhost:5000/api/seed</code> to add sample data.</p>`;
      return;
    }

    container.innerHTML = products.map(product => `
      <div class="card">
        <img src="${product.imageUrl}" alt="${product.name}">
        <div class="card-body">
          <h3 class="card-title">${product.name}</h3>
          <div class="card-price">$${product.price.toFixed(2)}</div>
          <p class="card-desc">${product.description.substring(0, 80)}...</p>
          <a href="product.html?id=${product._id}" class="btn">View Details</a>
        </div>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<div class="alert alert-danger">Failed to load products: ${err.message}</div>`;
  }
}

// Fetch and display single product detail
async function loadProductDetail() {
  const detailContainer = document.getElementById('product-detail-container');
  if (!detailContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    window.location.href = 'index.html';
    return;
  }

  try {
    const product = await apiRequest(`/products/${productId}`);

    detailContainer.innerHTML = `
      <div class="product-detail">
        <img src="${product.imageUrl}" alt="${product.name}">
        <div>
          <h2>${product.name}</h2>
          <h3 style="color: var(--primary); margin: 1rem 0;">$${product.price.toFixed(2)}</h3>
          <p style="margin-bottom: 1.5rem;">${product.description}</p>
          <p style="margin-bottom: 1rem;"><strong>In Stock:</strong> ${product.stock}</p>
          <button id="add-to-cart-btn" class="btn">Add to Cart</button>
        </div>
      </div>
    `;

    document.getElementById('add-to-cart-btn').addEventListener('click', () => {
      addToCart(product);
    });

  } catch (err) {
    detailContainer.innerHTML = `<div class="alert alert-danger">Error loading product details: ${err.message}</div>`;
  }
}

// Cart helper function stored locally in browser
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item => item._id === product._id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      _id: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`${product.name} added to cart!`);
}

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  loadProductDetail();
});
