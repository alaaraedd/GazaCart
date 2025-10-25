const multer = require("multer");
const path = require("path");

// إعداد التخزين (حسب نوع الملف)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "uploads/others";
    if (req.uploadType === "product") folder = "uploads/products";
    else if (req.uploadType === "logo") folder = "uploads/stores";
    else if (req.uploadType === "payment") folder = "uploads/paymentProofs";

    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// التحقق من نوع الملف (صور فقط)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) cb(null, true);
  else cb(new Error("❌ فقط الصور مسموح بها"));
};

// دالة ذكية تدعم single و array حسب الحاجة
const upload = (uploadType = "others", fieldName = "image", multiple = false) => {
  const uploader = multer({ storage, fileFilter });

  return (req, res, next) => {
    req.uploadType = uploadType;

    const handler = multiple
      ? uploader.array(fieldName, 10) // رفع عدة صور
      : uploader.single(fieldName);   // رفع صورة واحدة

    handler(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  };
};

module.exports = upload;
