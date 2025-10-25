const express = require("express");
const router = express.Router();
const {
  createStore,
  getStores,
  getTopStores,
  searchStoresAndProducts,
  getStoreById,
  getMyStore,
  updateStore,
  deleteStore,
} = require("../controllers/store.controller");

const { protect, authorizeRoles } = require("../middleware/auth");

// ✅ تتبع كل الطلبات لهذا الراوت
router.use((req, res, next) => {
  console.log(`📩 Request to [${req.method}] ${req.originalUrl}`);
  next();
});

// =========================
// 🧩 المسارات الخاصة بالمتجر
// =========================

// 🔍 بحث موحد
router.get("/search", searchStoresAndProducts);

// 🏆 أفضل المتاجر
router.get("/top", getTopStores);

// 📦 إنشاء متجر (للتاجر فقط)
router.post("/", protect, authorizeRoles("merchant"), createStore);

// 📦 كل المتاجر (مع فلترة)
router.get("/", getStores);

// 🧑‍💼 متجر التاجر الحالي (Dashboard)
router.get("/my/store", protect, authorizeRoles("merchant"), getMyStore);

// 🏬 متجر محدد بالـ ID
router.get("/:id", getStoreById);

// ✏️ تعديل متجر (التاجر أو الأدمن)
router.put("/:id", protect, authorizeRoles("merchant", "admin"), updateStore);

// 🗑️ حذف متجر (التاجر أو الأدمن)
router.delete("/:id", protect, authorizeRoles("merchant", "admin"), deleteStore);

module.exports = router;
