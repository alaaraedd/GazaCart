const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, authorizeRoles } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ===============================
// 🚀 إنشاء طلب جديد (checkout)
router.post(
  '/',
  protect,
  upload('payment', 'paymentProof', false), // middleware رفع صورة الدفع (اختياري)
  async (req, res) => {
    try {
      console.log("📥 الطلب المستلم قبل التحويل:", req.body);

      // تحويل items من نص JSON لمصفوفة إذا لزم
      if (typeof req.body.items === 'string') {
        try {
          req.body.items = JSON.parse(req.body.items);
        } catch (parseErr) {
          console.error("⚠️ فشل في تحويل items:", parseErr);
          return res.status(400).json({ message: 'تنسيق العناصر غير صحيح (items JSON)' });
        }
      }

      const { items, totalPrice, paymentMethod, fullName, address, phone, altPhone } = req.body;
      console.log("✅ الطلب بعد التحويل:", req.body);

      // تحقق من وجود عناصر الطلب
      if (!items || !Array.isArray(items) || !items.length) {
        return res.status(400).json({ message: '❌ لا يوجد منتجات في الطلب' });
      }

      // تحقق من بيانات التوصيل
      if (!fullName || !address || !phone) {
        return res.status(400).json({ message: '❌ يرجى إدخال بيانات التوصيل' });
      }

      // إثبات الدفع في حالة الدفع البنكي
      let paymentProof = null;
      if (paymentMethod === "bank") {
        if (!req.file) {
          return res.status(400).json({ message: "❌ يلزم رفع إثبات الدفع" });
        }
        paymentProof = `/uploads/paymentProofs/${req.file.filename}`;
      }

      // تحديد حالة الدفع
      const isPaid = paymentMethod === "bank" && paymentProof ? true : false;

      // إنشاء الطلب
      const order = await Order.create({
        customer: req.user._id,
        items,
        totalPrice,
        paymentMethod,
        fullName,
        address,
        phone,
        altPhone,
        paymentProof,
        isPaid,            // ✅ هنا يحدد الدفع
        status: "pending"
      });

      return res.status(201).json({ message: "✅ تم إنشاء الطلب بنجاح", order });

    } catch (err) {
      console.error("❌ خطأ في إنشاء الطلب:", err);
      return res.status(500).json({ error: err.message });
    }
  }
);

// ===============================
// 📄 عرض جميع طلبات المستخدم الحالي
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 🛠️ للأدمن: جلب كل الطلبات
router.get('/', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'fullname email phone')
      .sort('-createdAt');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
