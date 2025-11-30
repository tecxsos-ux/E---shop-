
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer'); // Required for sending emails

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images

// MongoDB Connection
// Password encoded: @=%40, #=%23, ?=%3F
const MONGO_URI = "mongodb+srv://Eshop:Helloitech%4068%23%3F@cluster0.9efxpgf.mongodb.net/luxemarket?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas Connected Successfully'))
  .catch(err => {
      console.error('❌ MongoDB Connection Error Details:');
      console.error(err.message);
      console.log('---');
      console.log('Hint: Check if your IP is whitelisted in MongoDB Atlas Network Access.');
      console.log('Hint: Check if your username/password are correct.');
  });

// --- Schemas & Models ---

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
  variants: [{ type: { type: String }, options: [String] }] // nested schema needs 'type' handling
});

const CategorySchema = new mongoose.Schema({
  id: String,
  name: String,
  subCategories: [String],
  image: String
});

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

const SettingsSchema = new mongoose.Schema({}, { strict: false }); // Store settings as flexible object

const Product = mongoose.model('Product', ProductSchema);
const Category = mongoose.model('Category', CategorySchema);
const Order = mongoose.model('Order', OrderSchema);
const User = mongoose.model('User', UserSchema);
const Slide = mongoose.model('Slide', SlideSchema);
const Banner = mongoose.model('Banner', BannerSchema);
const Settings = mongoose.model('Settings', SettingsSchema);

// --- Email Helper Function ---
const sendWelcomeEmail = async (user) => {
    try {
        // Fetch Settings for Brand Info
        const settings = await Settings.findOne();
        const brandName = settings?.brandName || 'LuxeMarket';
        const brandLogo = settings?.brandLogo || 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png';
        const companyEmail = settings?.companyEmail || 'support@luxemarket.ai';
        const companyAddress = settings?.companyAddress || '';

        // CONFIGURATION: Replace with your actual SMTP details
        // For Gmail, use App Passwords: https://myaccount.google.com/apppasswords
        // IMPORTANT: If you do not configure this, emails will log an error but not crash the app.
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use 'gmail' or provide host/port
            auth: {
                user: 'your-email@gmail.com', // REPLACE THIS
                pass: 'your-app-password'      // REPLACE THIS
            }
        });

        const mailOptions = {
            from: `"${brandName}" <${companyEmail}>`,
            to: user.email,
            subject: `Welcome to ${brandName}!`,
            html: `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                    <div style="text-align: center; padding: 40px 20px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                        <img src="${brandLogo}" alt="${brandName}" style="max-height: 60px; width: auto; display: block; margin: 0 auto;" />
                    </div>
                    <div style="padding: 40px 30px;">
                        <h1 style="color: #111827; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center;">Welcome, ${user.name}!</h1>
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                            Thank you for creating an account with <strong>${brandName}</strong>. We are thrilled to welcome you to our exclusive community of shoppers.
                        </p>
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                            You can now track your orders, save your wishlist, and enjoy a seamless checkout experience.
                        </p>
                        <div style="text-align: center;">
                            <a href="http://localhost:3000" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 14px 30px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 16px;">Start Shopping</a>
                        </div>
                    </div>
                    <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                            &copy; ${new Date().getFullYear()} ${brandName}. All rights reserved.<br>
                            ${companyAddress}
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Welcome email sent successfully to ${user.email}`);

    } catch (error) {
        // Non-blocking error logging
        console.error("⚠️ Email sending failed (Check SMTP Config in server.js):", error.message);
    }
};

// --- API Routes ---

// Health Check
app.get('/api/health', (req, res) => {
    const dbState = mongoose.connection.readyState; // 0: disconnected, 1: connected
    if (dbState === 1) {
        res.json({ status: 'ok', database: 'connected' });
    } else {
        res.status(503).json({ status: 'error', database: 'disconnected' });
    }
});

// Products
app.get('/api/products', async (req, res) => {
  try {
      const products = await Product.find();
      res.json(products);
  } catch(e) { res.status(500).json({error: e.message}) }
});
app.post('/api/products', async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json(newProduct);
});

// Categories
app.get('/api/categories', async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});
app.post('/api/categories', async (req, res) => {
  const newCat = new Category(req.body);
  await newCat.save();
  res.json(newCat);
});

// Orders
app.get('/api/orders', async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});
app.post('/api/orders', async (req, res) => {
  const newOrder = new Order(req.body);
  await newOrder.save();
  res.json(newOrder);
});
app.put('/api/orders/:id', async (req, res) => {
  const updated = await Order.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  res.json(updated);
});

// Users
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});
app.post('/api/users', async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  
  // Send Welcome Email (Fire and forget)
  sendWelcomeEmail(newUser);

  res.json(newUser);
});

// Slides
app.get('/api/slides', async (req, res) => {
  const slides = await Slide.find();
  res.json(slides);
});
app.post('/api/slides', async (req, res) => {
  const newSlide = new Slide(req.body);
  await newSlide.save();
  res.json(newSlide);
});

// Settings
app.get('/api/settings', async (req, res) => {
  const settings = await Settings.findOne();
  res.json(settings || {});
});
app.post('/api/settings', async (req, res) => {
  // Update existing or create new
  const count = await Settings.countDocuments();
  if (count === 0) {
    const newSettings = new Settings(req.body);
    await newSettings.save();
    res.json(newSettings);
  } else {
    // Assuming only 1 settings document
    const updated = await Settings.findOneAndUpdate({}, req.body, { new: true });
    res.json(updated);
  }
});

// Banners
app.get('/api/banners', async (req, res) => {
  const banners = await Banner.find();
  res.json(banners);
});

// Seeding Endpoint (Optional: Call this once to populate DB with mock data)
app.post('/api/seed', async (req, res) => {
    // Expects body { products: [], categories: [], ... }
    const { products, categories, slides, banners, users } = req.body;
    
    if(products) await Product.insertMany(products);
    if(categories) await Category.insertMany(categories);
    if(slides) await Slide.insertMany(slides);
    if(banners) await Banner.insertMany(banners);
    if(users) await User.insertMany(users);
    
    res.json({ message: "Database seeded!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
