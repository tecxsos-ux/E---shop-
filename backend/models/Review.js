
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  id: String,
  productId: String,
  userId: String,
  userName: String,
  rating: Number,
  comment: String,
  date: String
});

module.exports = mongoose.model('Review', ReviewSchema);
