const DEMO_PRODUCTS = [
  {
    _id: 'demo-headphones',
    name: 'Wireless Noise-Canceling Headphones',
    description: 'High-quality wireless headphones with active noise cancellation and 30-hour battery life.',
    price: 199.99,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
  },
  {
    _id: 'demo-smartwatch',
    name: 'Minimalist Smartwatch',
    description: 'Sleek fitness smartwatch featuring heart rate monitoring, GPS, and custom watch faces.',
    price: 129.50,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'
  },
  {
    _id: 'demo-keyboard',
    name: 'Ergonomic Mechanical Keyboard',
    description: 'Tactile RGB mechanical keyboard designed for maximum typing comfort and efficiency.',
    price: 89.99,
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500'
  }
];

function renderProducts(container, products) {
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
}

// Fetch and display product catalog
async function loadProducts() {
  const container = document.getElementById('product-container');
  if (!container) return;

  try {
    const products = await apiRequest('/products');

    if (products.length === 0) {
      renderProducts(container, DEMO_PRODUCTS);
      return;
    }

    renderProducts(container, products);
  } catch (err) {
    renderProducts(container, DEMO_PRODUCTS);
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
    renderProductDetail(detailContainer, product);
  } catch (err) {
    const product = DEMO_PRODUCTS.find(item => item._id === productId);
    if (product) {
      renderProductDetail(detailContainer, product);
    } else {
      detailContainer.innerHTML = `<div class="alert alert-danger">Error loading product details: ${err.message}</div>`;
    }
  }
}

function renderProductDetail(detailContainer, product) {
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
