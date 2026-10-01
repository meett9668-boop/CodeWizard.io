const express = require('express');
const cors = require('cors');
require('dotenv').config();

const healthRoutes = require('./routes/health.routes');
const apiRoutes = require('./routes/api.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration (supports configurable origins for separate frontend)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('CORS Policy: Origin not allowed'));
  },
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route (root & /api/health)
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/health', healthRoutes);

// Main API Routes
app.use('/api', apiRoutes);

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[ServerError]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server if launched directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[Campus Navigator Backend] Server running on port ${PORT}`);
  });
}

module.exports = app;
