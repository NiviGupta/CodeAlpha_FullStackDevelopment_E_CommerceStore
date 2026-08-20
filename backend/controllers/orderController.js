const Order = require('../models/Order');

// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    const order = new Order({
      user: req.user.id,
      items,
      totalAmount
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Order creation failed', error: error.message });
  }
};

// @route   GET /api/orders/myorders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user orders' });
  }
};
