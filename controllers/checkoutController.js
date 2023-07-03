const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');
const mailService = require('../services/mailService');

// Place an order (available to end user only)
router.post('/place-order', authMiddleware.authenticate, authMiddleware.authorizeUser, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId }).populate('products.product');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Check if the product quantities are sufficient
    for (const item of cart.products) {
      const product = await Product.findById(item.product._id);

      if (item.quantity > product.quantity) {
        return res.status(400).json({ message: 'Insufficient product quantity' });
      }
    }

    // Calculate the total order amount
    let totalAmount = 0;
    for (const item of cart.products) {
      const product = await Product.findById(item.product._id);
      totalAmount += product.price * item.quantity;

      // Update the product stock
      product.quantity -= item.quantity;
      await product.save();
    }

    // Create a new order
    const order = new Order({
      user: userId,
      products: cart.products,
      totalAmount,
    });

    await order.save();

    // Clear the user's cart
    await cart.remove();

    // Send an email to the user
    const { email } = req.user;
    const subject = 'Order Confirmation';
    const text = 'Thank you for placing your order!';

    await mailService.sendEmail(email, subject, text);

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
