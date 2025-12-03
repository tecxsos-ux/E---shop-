
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Models
const { Product, Category } = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { Slide, Banner, PromoBanner } = require('../models/Content');
const Settings = require('../models/Settings');
const Review = require('../models/Review');

// Controllers
const { sendWelcomeEmail, sendOrderInvoiceEmail } = require('../controllers/emailController');

// --- Health Check ---
router.get('/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    if (dbState === 1) {
        res.json({ status: 'ok', database: 'connected' });
    } else {
        res.status(503).json({ status: 'error', database: 'disconnected' });
    }
});

// --- Analytics Routes ---
router.get('/analytics/revenue', async (req, res) => {
    try {
        const { period } = req.query; // day, week, month, year
        let dateFormat;
        
        // MongoDB Date Format Strings
        switch(period) {
            case 'day': dateFormat = "%Y-%m-%d"; break;
            case 'week': dateFormat = "%Y-W%V"; break; // Year-Week (ISO)
            case 'year': dateFormat = "%Y"; break;
            case 'month': 
            default: dateFormat = "%Y-%m"; break;
        }

        const stats = await Order.aggregate([
            {
                // Convert string ISO date to Date object for processing
                $addFields: {
                    convertedDate: { $toDate: "$date" }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: dateFormat, date: "$convertedDate" } },
                    sales: { $sum: "$total" },
                    ordersCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } } // Sort chronologically
        ]);

        // Transform for Frontend
        const formatted = stats.map(item => ({
            name: item._id,
            sales: parseFloat(item.sales.toFixed(2)),
            count: item.ordersCount
        }));

        res.json(formatted);
    } catch (e) {
        console.error("Analytics Error:", e);
        res.status(500).json({ error: e.message });
    }
});

// --- Products Routes ---
router.get('/products', async (req, res) => {
  try {
      const products = await Product.find();
      res.json(products);
  } catch(e) { res.status(500).json({error: e.message}) }
});

router.post('/products', async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json(newProduct);
});

router.delete('/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = {
        $or: [
            { id: id },
            { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }
        ]
    };
    const result = await Product.findOneAndDelete(query);
    if (!result) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// --- Categories Routes ---
router.get('/categories', async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

router.post('/categories', async (req, res) => {
  const newCat = new Category(req.body);
  await newCat.save();
  res.json(newCat);
});

router.delete('/categories/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = {
        $or: [
            { id: id },
            { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }
        ]
    };
    const result = await Category.findOneAndDelete(query);
    if (!result) {
        return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted' });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// --- Orders Routes ---
router.get('/orders', async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

router.post('/orders', async (req, res) => {
  try {
      const newOrder = new Order(req.body);
      await newOrder.save();
      
      // Trigger Email Notification (Non-blocking)
      sendOrderInvoiceEmail(newOrder).catch(err => console.error("Email trigger failed", err));

      res.json(newOrder);
  } catch (e) {
      res.status(500).json({ error: e.message });
  }
});

router.put('/orders/:id', async (req, res) => {
  const updated = await Order.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  res.json(updated);
});

// --- Users Routes ---
router.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.post('/users', async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  sendWelcomeEmail(newUser);
  res.json(newUser);
});

// --- Reviews Routes ---
router.get('/reviews', async (req, res) => {
  const reviews = await Review.find();
  res.json(reviews);
});

router.post('/reviews', async (req, res) => {
  const newReview = new Review(req.body);
  await newReview.save();
  res.json(newReview);
});

router.delete('/reviews/:id', async (req, res) => {
  await Review.findOneAndDelete({ id: req.params.id });
  res.json({ message: 'Deleted' });
});

// --- Content Routes (Slides/Banners) ---
router.get('/slides', async (req, res) => {
  const slides = await Slide.find();
  res.json(slides);
});

router.post('/slides', async (req, res) => {
  const newSlide = new Slide(req.body);
  await newSlide.save();
  res.json(newSlide);
});

router.get('/banners', async (req, res) => {
  const banners = await Banner.find();
  res.json(banners);
});

// --- Promo Banners Routes ---
router.get('/promo-banners', async (req, res) => {
  const promos = await PromoBanner.find();
  res.json(promos);
});

// --- Settings Routes ---
router.get('/settings', async (req, res) => {
  const settings = await Settings.findOne();
  res.json(settings || {});
});

router.post('/settings', async (req, res) => {
  const count = await Settings.countDocuments();
  if (count === 0) {
    const newSettings = new Settings(req.body);
    await newSettings.save();
    res.json(newSettings);
  } else {
    const updated = await Settings.findOneAndUpdate({}, req.body, { new: true });
    res.json(updated);
  }
});

// --- Seeding ---
router.post('/seed', async (req, res) => {
    const { products, categories, slides, banners, users, promoBanners } = req.body;
    
    if(products) await Product.insertMany(products);
    if(categories) await Category.insertMany(categories);
    if(slides) await Slide.insertMany(slides);
    if(banners) await Banner.insertMany(banners);
    if(promoBanners) await PromoBanner.insertMany(promoBanners);
    if(users) await User.insertMany(users);
    
    res.json({ message: "Database seeded!" });
});

module.exports = router;
