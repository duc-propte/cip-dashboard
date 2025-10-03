import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { serverConfig } from './config/salesforce.js';
import authRoutes from './routes/auth.js';
import opportunityRoutes from './routes/opportunities.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: serverConfig.frontendUrl,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunityRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = serverConfig.port;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   CIP Dashboard Backend Server Running    ║
╠════════════════════════════════════════════╣
║   Port: ${PORT}                              ║
║   Environment: ${process.env.NODE_ENV || 'development'}          ║
║   Frontend URL: ${serverConfig.frontendUrl}   ║
╚════════════════════════════════════════════╝

Available endpoints:
  GET  /health                    - Health check
  GET  /api/auth/login           - Initiate OAuth
  GET  /api/auth/callback        - OAuth callback
  POST /api/auth/user            - Get user info
  POST /api/auth/refresh         - Refresh token
  POST /api/opportunities        - Get opportunities
  POST /api/opportunities/:id    - Get opportunity by ID
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});


