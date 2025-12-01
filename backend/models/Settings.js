
const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model('Settings', SettingsSchema);
