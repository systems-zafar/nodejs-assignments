const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

// Add product to cart (available to end user only)
router.post('/add-to-cart/:productId', authMiddleware.authenticate, authMiddleware.authorizeUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const productId = req.params.productId;
    const { quantity } = req.body;

    // Check if the product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the product quantity is sufficient
    if (quantity > product.quantity) {
      return res.status(400).json({ message: 'Insufficient product quantity' });
    }

    // Create or update the user's cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        products: [{ product: productId, quantity }],
      });
    } else {
      // Check if the product already exists in the cart
      const existingProduct = cart.products.find(
        (item) => item.product.toString() === productId
      );

      if (existingProduct) {
        // Update the quantity of the existing product
        existingProduct.quantity += quantity;
      } else {
        // Add the product to the cart
        cart.products.push({ product: productId, quantity });
      }
    }

    await cart.save();

    res.status(200).json({ message: 'Product added to cart successfully', cart });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get cart by user ID (available to end user only)
router.get('/', authMiddleware.authenticate, authMiddleware.authorizeUser, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId })
      .populate('products.product', '-description')
      .populate('user', 'username');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error retrieving cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
