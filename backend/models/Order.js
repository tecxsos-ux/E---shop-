
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  id: String,
  userId: String,
  items: Array,
  subtotal: Number,
  tax: Number,
  shippingCost: Number,
  total: Number,
  status: String,
  date: String,
  shippingAddress: Object
});

module.exports = mongoose.model('Order', OrderSchema);
