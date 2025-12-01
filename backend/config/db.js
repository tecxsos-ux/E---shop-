
const mongoose = require('mongoose');

// Password encoded: @=%40, #=%23, ?=%3F
const MONGO_URI = "mongodb+srv://Eshop:Helloitech%4068%23%3F@cluster0.9efxpgf.mongodb.net/luxemarket?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('Hint: Check if your IP is whitelisted in MongoDB Atlas Network Access.');
    process.exit(1);
  }
};

module.exports = connectDB;
