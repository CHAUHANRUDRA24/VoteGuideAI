const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    if (!uri) {
      console.warn('⚠️ MONGODB_URI is not set. Starting in-memory MongoDB for local development. Data will be lost on restart.');
      const mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
      process.env.MONGODB_URI = uri; // Set it so other parts of the app can use it if needed
    }
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Do not crash the server so frontend can still load
  }
};

module.exports = connectDB;
