const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  images: [String],
  category: String,
  rating: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
