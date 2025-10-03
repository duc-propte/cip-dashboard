import express from 'express';
import cors from 'cors';
import session from 'express-session';
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

// Session middleware - MUST be after CORS and before routes
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  name: 'sessionId', // Custom name to avoid conflicts
  cookie: {
    httpOnly: true, // prevents XSS attacks
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
};

// Production-specific session config for cross-origin
if (process.env.NODE_ENV === 'production') {
  sessionConfig.cookie.secure = true; // Requires HTTPS
  sessionConfig.cookie.sameSite = 'none'; // Allow cross-origin
  sessionConfig.proxy = true; // Trust proxy (Render uses proxies)
  console.log('🔒 Production session config: secure=true, sameSite=none, proxy=true');
} else {
  sessionConfig.cookie.sameSite = 'lax';
  console.log('🔓 Development session config: secure=false, sameSite=lax');
}

app.set('trust proxy', 1); // Trust first proxy (required for Render)
app.use(session(sessionConfig));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Session ID:', req.sessionID);
  console.log('Session exists:', !!req.session);
  console.log('Salesforce session:', req.session?.salesforce ? 'YES' : 'NO');
  console.log('Cookies:', req.headers.cookie || 'NO COOKIES');
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

// Debug endpoint to check session
app.get('/debug/session', (req, res) => {
  res.json({
    sessionExists: !!req.session,
    sessionID: req.sessionID,
    hasSalesforceAuth: !!req.session?.salesforce,
    cookies: req.headers.cookie || 'No cookies',
    environment: process.env.NODE_ENV,
    frontendUrl: process.env.FRONTEND_URL,
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


