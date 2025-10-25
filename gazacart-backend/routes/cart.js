const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');

// جلب سلة المستخدم
router.get('/', protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');
  res.json(user.cart);
});

// اضافة للسلة
router.post('/add', protect, async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const user = await User.findById(req.user._id);
  const itemIndex = user.cart.findIndex(i => i.product.toString() === productId);

  if (itemIndex > -1) {
    // المنتج موجود بالفعل -> تحديث الكمية
    user.cart[itemIndex].quantity += quantity;
  } else {
    // المنتج غير موجود -> إضافة جديد
    user.cart.push({ product: productId, quantity });
  }

  await user.save();
  // لإرجاع السلة بعد التعديل مع بيانات المنتج
  const updatedUser = await User.findById(req.user._id).populate('cart.product');

  res.json(updatedUser.cart);
});

module.exports = router;
