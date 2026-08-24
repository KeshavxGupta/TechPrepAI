const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/techprep_ai';
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection Failed: ${error.message}`);
    console.warn('[MongoDB] Note: Operating in resilient mode. Ensure MongoDB server is running on localhost:27017.');
    return null;
  }
};

module.exports = connectDB;
