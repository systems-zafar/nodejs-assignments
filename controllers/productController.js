const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

// Add a product
router.post('/', authMiddleware.authenticate, authMiddleware.authorizeAdmin, async (req, res) => {
  try {
    const { title, description, price, quantity, category } = req.body;

    // Create a new product
    const newProduct = new Product({
      title,
      description,
      price,
      quantity,
      category,
    });

    await newProduct.save();

    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a product
router.put('/:id', authMiddleware.authenticate, authMiddleware.authorizeAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    const { title, description, price, quantity, category } = req.body;

    // Check if the product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the product information
    product.title = title;
    product.description = description;
    product.price = price;
    product.quantity = quantity;
    product.category = category;

    await product.save();

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a product
router.delete('/:id', authMiddleware.authenticate, authMiddleware.authorizeAdmin, async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if the product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.remove();

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if the product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error retrieving product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
