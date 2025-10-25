const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ===============================
// 📝 تسجيل زبون بدون كلمة مرور
// ===============================
exports.registerCustomer = async (req, res) => {
  try {
    const { fullname, phone, email, address } = req.body;

    // تحقق إذا الهاتف أو البريد موجود مسبقاً
    const existingUser = await User.findOne({ $or: [{ phone }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'الهاتف أو البريد مستخدم مسبقاً' });
    }

    const user = await User.create({
      fullname,
      phone,
      email,
      address,
      role: 'customer'
    });

    const token = user.getSignedJwtToken();

    res.status(201).json({ success: true, user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ أثناء تسجيل الزبون' });
  }
};

// ===============================
// 📝 تسجيل تاجر أو أدمن بكلمة مرور
// ===============================
exports.registerMerchantOrAdmin = async (req, res) => {
  try {
    const { fullname, phone, email, password, role, address } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'كلمة المرور مطلوبة للتاجر/الأدمن' });
    }

    // تحقق من صحة الدور
    if (!['merchant', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'الدور غير صالح' });
    }

    // تحقق من وجود المستخدم مسبقاً
    const existingUser = await User.findOne({ $or: [{ phone }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'الهاتف أو البريد مستخدم مسبقاً' });
    }

    const user = await User.create({
      fullname,
      phone,
      email,
      password,
      role,
      address
    });

    const token = user.getSignedJwtToken();

    res.status(201).json({ success: true, user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ أثناء تسجيل التاجر/الأدمن' });
  }
};

// ===============================
// 📝 تسجيل الدخول لجميع الأدوار
// ===============================
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'الرجاء إدخال الهاتف' });
    }

    // جلب المستخدم مع كلمة المرور (للتجار/الأدمن)
    const user = await User.findOne({ phone }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'المستخدم غير موجود' });
    }

    // الزبون بدون كلمة مرور
    if (user.role === 'customer') {
      const token = user.getSignedJwtToken();
      return res.json({ success: true, user, token });
    }

    // التاجر أو الأدمن يجب التحقق من كلمة المرور
    if (!(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'كلمة المرور غير صحيحة' });
    }

    const token = user.getSignedJwtToken();
    res.json({ success: true, user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ أثناء تسجيل الدخول' });
  }
};

// ===============================
// 📝 تسجيل الخروج
// ===============================
exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true
  });

  res.json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
};
