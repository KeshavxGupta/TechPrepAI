const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/techprep_ai';
    const isAtlas = connUri.startsWith('mongodb+srv://') || connUri.includes('mongodb.net');
    
    console.log(`[MongoDB] Initializing connection to ${isAtlas ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}...`);

    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 10000, // 10s timeout for Atlas cloud latency / DNS handshake
      socketTimeoutMS: 45000,
      autoIndex: true,
    });

    console.log(`[MongoDB] Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    
    if (process.env.MONGODB_URI && (process.env.MONGODB_URI.startsWith('mongodb+srv://') || process.env.MONGODB_URI.includes('mongodb.net'))) {
      console.warn('\n[MongoDB Atlas Troubleshooting Tips]:');
      console.warn('  1. Network Access (IP Whitelist): Ensure your current IP is whitelisted in MongoDB Atlas under Network Access (or use 0.0.0.0/0 for testing).');
      console.warn('  2. Database User Credentials: Verify username and password in Database Access.');
      console.warn('  3. Special Characters: If your password contains characters like @, #, $, or %, ensure they are URL-encoded.');
      console.warn('  4. Connection String: Ensure the URI format is mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority\n');
    } else {
      console.warn('[MongoDB] Note: Operating in resilient mode. Ensure MongoDB is running locally or provide a valid Atlas MONGODB_URI in .env.');
    }
    return null;
  }
};

// Monitor connection events
mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Disconnected from database.');
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] Reconnected to database.');
});

module.exports = connectDB;
