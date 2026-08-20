const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Sample Data Seed Endpoint for Instant Testing
app.get('/api/seed', async (req, res) => {
  const Product = require('./models/Product');
  await Product.deleteMany({});
  const sampleProducts = [
    {
      name: "Wireless Noise-Canceling Headphones",
      description: "High-quality wireless headphones with active noise cancellation and 30-hour battery life.",
      price: 199.99,
      stock: 15,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
    },
    {
      name: "Minimalist Smartwatch",
      description: "Sleek fitness smartwatch featuring heart rate monitoring, GPS, and custom watch faces.",
      price: 129.50,
      stock: 25,
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
    },
    {
      name: "Ergonomic Mechanical Keyboard",
      description: "Tactile RGB mechanical keyboard designed for maximum typing comfort and efficiency.",
      price: 89.99,
      stock: 10,
      imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500"
    }
  ];
  await Product.insertMany(sampleProducts);
  res.send({ message: "Database seeded with sample products!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
