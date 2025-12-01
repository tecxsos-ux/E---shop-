
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  role: String,
  location: String,
  joinedDate: String,
  lastLogin: String,
  status: String,
  avatar: String
});

module.exports = mongoose.model('User', UserSchema);
