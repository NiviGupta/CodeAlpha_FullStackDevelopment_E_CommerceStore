const Product = require('../models/Product');

// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve products' });
  }
};

// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// @route   POST /api/products (Admin utility / Seeding)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl } = req.body;
    const product = new Product({ name, description, price, stock, imageUrl });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Invalid product data' });
  }
};
