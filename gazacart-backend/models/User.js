const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

// 🛒 العناصر داخل السلة
const CartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
});

// 👤 المستخدم
const UserSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true }, // ✅ للسماح باستخدام نفس ID الخاص بـ owner

  fullname: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },

  // 🔐 كلمة المرور (اختيارية للزبائن، مطلوبة للتجار/الأدمن)
password: {
  type: String,
  minlength: 6,
  select: false,
  required: function () {
    return this.role === 'merchant' || this.role === 'admin';
  },
},


  // 🎭 الدور
  role: {
    type: String,
    enum: ['customer', 'merchant', 'admin'],
    default: 'customer',
  },

  address: { type: String },
  cart: [CartItemSchema],

  createdAt: { type: Date, default: Date.now },
});

// 🔒 تشفير كلمة المرور قبل الحفظ
UserSchema.pre('save', async function (next) {
  // إذا ما تم تعديل كلمة المرور، تجاهل
  if (!this.isModified('password') || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔍 مقارنة كلمة المرور عند تسجيل الدخول
UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🎫 إنشاء JWT
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

module.exports = mongoose.model('User', UserSchema);
