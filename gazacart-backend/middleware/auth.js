const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ===============================
// 🛡️ حماية المسارات (JWT)
// ===============================
exports.protect = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'غير مصرح، التوكن مفقود' });
  }

  const token = authHeader.split(' ')[1];

  try {
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET غير مضبوط في ملف .env');
      return res.status(500).json({ message: 'خطأ في إعدادات الخادم' });
    }

    // ✅ فك التوكن والتحقق من صلاحيته
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ جلب بيانات المستخدم من قاعدة البيانات (بدون كلمة المرور)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'المستخدم غير موجود' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('❌ خطأ في التحقق من التوكن:', err.message);
    return res.status(401).json({ message: 'توكن غير صالح أو منتهي' });
  }
};

// ===============================
// 🔐 التحقق من الأدوار (Roles)
// ===============================
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: '🚫 غير مسموح لك بالوصول إلى هذا المسار',
      });
    }
    next();
  };
};
