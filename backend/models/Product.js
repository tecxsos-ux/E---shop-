
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  price: Number,
  category: String,
  subCategory: String,
  image: String,
  images: [String],
  stock: Number,
  brand: String,
  isNew: Boolean,
  discount: Number,
  variants: [{ type: { type: String }, options: [String] }]
});

const CategorySchema = new mongoose.Schema({
  id: String,
  name: String,
  subCategories: [String],
  image: String
});

module.exports = {
  Product: mongoose.model('Product', ProductSchema),
  Category: mongoose.model('Category', CategorySchema)
};
