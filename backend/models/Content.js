
const mongoose = require('mongoose');

const SlideSchema = new mongoose.Schema({
  id: String,
  title: String,
  subtitle: String,
  description: String,
  image: String,
  link: String,
  color: String
});

const BannerSchema = new mongoose.Schema({
  id: String,
  title: String,
  subtitle: String,
  image: String,
  link: String,
  buttonText: String
});

module.exports = {
  Slide: mongoose.model('Slide', SlideSchema),
  Banner: mongoose.model('Banner', BannerSchema)
};
