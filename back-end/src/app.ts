import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';

import productRoutes from './routes/product.routes';
import storeRoutes from './routes/store.routes';
import mixRoutes from './routes/mix.routes';
import ratingRoutes from './routes/rating.routes';
import liquidRoutes from './routes/liquid.routes';
import translationRoutes from './routes/translation.routes';
import usedProductRoutes from './routes/usedProduct.routes';
import { errorHandler } from './middleware/error.middleware';
import { authMiddleware } from './middleware/auth.middleware';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Advanced Security Middleware
import {
  authRateLimiter,
  generalRateLimiter,
  apiRateLimiter,
  xssProtection,
  securityHeaders,
  fileUploadSecurity,
  requestSizeLimiter,
  ipFilter,
  securityLogger,
  csrfProtection
} from './middleware/security.middleware';
import { SecurityMonitor } from './utils/security.utils';
import { injectionProtectionMiddleware, sanitizationMiddleware } from './middleware/injection-protection.middleware';
import { enhancedAuthMiddleware, enhancedAdminMiddleware } from './middleware/enhanced-auth.middleware';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Database connection for sessions
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/vape-store';

// Advanced Security Middleware Configuration
app.set('trust proxy', 1); // Trust first proxy

// Security headers - OWASP protection
app.use(securityHeaders);

// CORS configuration with security
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? ['https://your-domain.com'] 
      : [
          'http://localhost:3000', 
          'http://127.0.0.1:3000', 
          'http://localhost:5173', 
          'http://127.0.0.1:5173',
          'http://localhost:5174', 
          'http://127.0.0.1:5174',
          'http://localhost:5000',
          'http://127.0.0.1:5000'
        ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log('Not allowed by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Total-Count'],
  maxAge: 86400 // 24 hours
};

// Enable CORS with these options
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Request size limiting
app.use(requestSizeLimiter);

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration with MongoDB store
app.use(session({
  secret: process.env.SESSION_SECRET || 'vape-capitole-session-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl,
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict'
  },
  name: 'vape.sid' // Change default session name
}));

// Security monitoring and logging
app.use(securityLogger);

// IP filtering (if needed)
app.use(ipFilter);

// Injection Protection (SQL, NoSQL, XSS, Command Injection, Path Traversal)
app.use(injectionProtectionMiddleware);

// XSS Protection
app.use(xssProtection);

// Input Sanitization
app.use(sanitizationMiddleware);

// General rate limiting
app.use('/api', generalRateLimiter);

// Strict rate limiting for auth endpoints
app.use('/api/auth', authRateLimiter);

// File upload security
app.use(fileUploadSecurity);

// Security monitoring for suspicious activity
app.use((req, res, next) => {
  if (SecurityMonitor.detectSuspiciousActivity(req)) {
    SecurityMonitor.logSecurityEvent('Suspicious Activity Detected', {
      ip: req.ip,
      url: req.originalUrl,
      method: req.method,
      userAgent: req.headers['user-agent'],
      body: req.body
    }, 'high');
    
    return res.status(403).json({ error: 'Suspicious activity detected' });
  }
  next();
});

// CSRF Protection for state-changing operations
app.use('/api', (req, res, next) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    return csrfProtection(req, res, next);
  }
  next();
});

// Security status endpoint
app.get('/api/security/status', (req, res) => {
  res.json(SecurityMonitor.generateSecurityReport());
});

// Routes with enhanced security
app.use('/api/auth', authRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);

app.use('/api/products', productRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/mixes', mixRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/liquids', liquidRoutes);
app.use('/api/translations', translationRoutes);
app.use('/api/used-products', usedProductRoutes);

// Serve uploaded files with security headers
app.use('/uploads', (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
}, express.static('uploads', {
  maxAge: 0,
  etag: false
}));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vape Shop API',
      version: '1.0.0',
      description: 'API documentation for Vape Shop',
    },
    servers: [
      { url: 'http://localhost:' + port + '/api' }
    ],
  },
  apis: ['./src/routes/*.ts'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handling middleware
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
