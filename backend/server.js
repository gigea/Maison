const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const cookieParser = require('cookie-parser');
const dotenv   = require('dotenv');
const path     = require('path');
const fs       = require('fs');

dotenv.config();

// ── Validate environment ──────────────────────────────────
if (!process.env.MONGO_URI) {
  console.error('\n❌  MONGO_URI is not set.');
  console.error('    Copy backend/.env.example → backend/.env and fill it in.');
  console.error('    Then run:  node setup.js  for a guided setup.\n');
  process.exit(1);
}
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_super_secret_jwt_key_change_this_in_production') {
  console.warn('⚠️   JWT_SECRET is using the default value. Change it in backend/.env before going to production.');
}

const app = express();

// ── Middleware ────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001').split(',');
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/users',    require('./routes/users'));
app.use('/api/cart',     require('./routes/cart'));
app.use('/api/upload',   require('./routes/upload'));

// Health check — useful to test the server is up
app.get('/api/health', async (req, res) => {
  const dbState = ['disconnected','connected','connecting','disconnecting'];
  res.json({
    status:   'ok',
    database: dbState[mongoose.connection.readyState],
    uptime:   Math.round(process.uptime()) + 's',
  });
});

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => res.status(404).json({ message: 'API route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

// ── MongoDB Connection ────────────────────────────────────
const MONGO_OPTIONS = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

async function connectWithRetry(retries = 5, delay = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      await mongoose.connect(process.env.MONGO_URI, MONGO_OPTIONS);
      console.log('✅ MongoDB connected');
      return;
    } catch (err) {
      const isLast = i === retries;
      console.error(`❌ MongoDB connection attempt ${i}/${retries} failed: ${err.message}`);
      if (isLast) {
        console.error('\n── Troubleshooting ──────────────────────────────────');
        if (process.env.MONGO_URI.includes('localhost')) {
          console.error('  Local MongoDB: make sure mongod is running.');
          console.error('  macOS:   brew services start mongodb-community');
          console.error('  Linux:   sudo systemctl start mongod');
          console.error('  Windows: net start MongoDB');
        } else {
          console.error('  Atlas: check your MONGO_URI, username, password.');
          console.error('  Atlas: whitelist your IP under Network Access.');
        }
        console.error('─────────────────────────────────────────────────────\n');
        process.exit(1);
      }
      console.log(`    Retrying in ${delay / 1000}s…`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

// ── Boot ──────────────────────────────────────────────────
connectWithRetry().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
  });
});

// Graceful shutdown
process.on('SIGINT',  () => { mongoose.disconnect(); process.exit(0); });
process.on('SIGTERM', () => { mongoose.disconnect(); process.exit(0); });
