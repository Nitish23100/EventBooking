import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import eventRoutes from './routes/event.routes.js';
import bookingRoutes from './routes/booking.routes.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json());

// Rate limiter: 20 requests per 15 minutes for auth endpoints only
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,   // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false,     // Disable the X-RateLimit-* headers
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

// Auth routes (rate-limited)
app.use('/api/auth', authLimiter, authRoutes);

// Event routes
app.use('/api/events', eventRoutes);

// Booking routes
app.use('/api/bookings', bookingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    data: {
      timestamp: new Date(),
      uptime: process.uptime()
    }
  });
});

// Catch-all 404 route
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  console.error(`[Error] ${statusCode} - ${message}`, err);

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(err.errors && { errors: err.errors }),
    ...(env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;
