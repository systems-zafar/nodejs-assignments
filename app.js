require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
// const JWT_SECRET = process.env.JWT_SECRET; moved into the auth controller
const HOST = process.env.HOST;

const userController = require('./controllers/userController');
const authController = require('./controllers/authController');
const authMiddleware = require('./middleware/authMiddleware');
const productController = require('./controllers/productController');
const cartController = require('./controllers/cartController');
const checkoutController = require('./controllers/checkoutController');


// Connect to MongoDB
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(express.json());

// Routes
app.use('/users', userController);
app.use('/auth', authController);

// Protected Routes
app.use('/products', authMiddleware.authenticate, productController);
app.use('/carts', authMiddleware.authenticate, cartController);
app.use('/checkout', authMiddleware.authenticate, checkoutController);

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
