const mongoose = require('mongoose');

// Global connection cache across serverless function invocations (Vercel Lambda)
let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

const connectDB = async () => {
  const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/techprep_ai';
  const isAtlas = connUri.startsWith('mongodb+srv://') || connUri.includes('mongodb.net');

  // Return active connection if readyState is connected (1)
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log(`[MongoDB] Initializing connection to ${isAtlas ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}...`);
    cached.promise = mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 15000, // 15s timeout for cloud latency / DNS handshake
      socketTimeoutMS: 45000,
      autoIndex: false, // Prevent index build overhead on serverless invocations
    }).then((m) => {
      console.log(`[MongoDB] Connected Successfully: ${m.connection.host}/${m.connection.name}`);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    
    if (isAtlas) {
      console.warn('\n[MongoDB Atlas Troubleshooting Tips]:');
      console.warn('  1. Network Access (IP Whitelist): Ensure your IP is whitelisted (use 0.0.0.0/0 for global Vercel serverless access).');
      console.warn('  2. Database User Credentials: Verify username and password in Database Access.');
      console.warn('  3. Special Characters: If password contains @, #, $, %, ensure they are URL-encoded.');
      console.warn('  4. Connection String: Ensure the URI format is mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority\n');
    }
    throw error;
  }
};

// Monitor connection events
mongoose.connection.on('disconnected', () => {
  if (cached) cached.conn = null;
  console.warn('[MongoDB] Disconnected from database.');
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] Reconnected to database.');
});

module.exports = connectDB;
