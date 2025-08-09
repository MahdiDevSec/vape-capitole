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
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

dotenv.config();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  }
});

// Define allowed MIME types
const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
];

const upload = multer({ 
  storage,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    try {
      // Check MIME type
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error(`Unsupported file type: ${file.mimetype}`));
      }
      
      // Check file extension
      const ext = path.extname(file.originalname).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
        return cb(new Error(`Unsupported file extension: ${ext}`));
      }
      
      return cb(null, true);
    } catch (error) {
      console.error('File filter error:', error);
      if (error instanceof Error) {
        return cb(error);
      }
      return cb(new Error('An unknown error occurred while processing the file'));
    }
  }
});

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
      ? [
          'https://your-domain.com',
          // Allow direct calls from the deployed backend domain if needed
          'https://back-end-i6q6.onrender.com',
          'https://vapecapitol.vercel.app'
        ] 
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
    
    if (allowedOrigins.includes(origin)) {
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

// Security middleware configuration
// Note: Security middleware order is important

// Serve static files with CORS headers
app.use('/uploads', 
  // Apply CORS with specific options for static files
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = process.env.NODE_ENV === 'production' 
        ? ['https://your-domain.com'] 
        : [
            'http://localhost:5173', 
            'http://127.0.0.1:5173',
            'http://localhost:3000',
            'http://127.0.0.1:3000'
          ];
      
      if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'HEAD'],
    credentials: true,
    maxAge: 86400
  }),
  express.static('uploads', {
    maxAge: '1d', // Cache for 1 day
    etag: true,
    setHeaders: (res) => {
      // Allow cross-origin access to images and other static files
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
      res.set('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' 
        ? 'https://your-domain.com' 
        : '*');
    }
  })
);

// File upload route - No auth required as admin is already authenticated via session
app.post('/api/upload', (req, res, next) => {
  // Use multer's single file handler as middleware
  upload.single('image')(req, res, function(err) {
    if (err) {
      console.error('File upload error:', err);
      
      // Handle different types of errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          success: false,
          message: 'File too large. Maximum size is 10MB.',
          error: err.message
        });
      } else if (err.message?.includes('Unsupported file')) {
        return res.status(415).json({
          success: false,
          message: 'Unsupported file type. Please upload a valid image file (JPG, PNG, GIF, WEBP, SVG).',
          error: err.message
        });
      }
      
      return res.status(400).json({
        success: false,
        message: 'Error processing file upload',
        error: err.message || 'Unknown error occurred'
      });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          message: 'No file uploaded or file is empty' 
        });
      }

      console.log('File uploaded successfully:', req.file.filename);
      
      // Construct the full URL to the uploaded file
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      
      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        imageUrl: fileUrl,
        filename: req.file.filename
      });
    } catch (error: unknown) {
      console.error('Error in upload handler:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({
        success: false,
        message: 'Error processing file upload',
        error: errorMessage
      });
    }
  });
});

// Then apply security middleware to all other routes
app.use(securityLogger);
app.use(ipFilter);
app.use(injectionProtectionMiddleware);
app.use(xssProtection);
app.use(sanitizationMiddleware);

// Rate limiting for API routes
app.use('/api', generalRateLimiter);
app.use('/api/auth', authRateLimiter);

// File upload security
app.use(fileUploadSecurity);

// Security monitoring for suspicious activity
app.use((req, res, next) => {
  // Skip security checks for static files
  if (req.path.startsWith('/uploads/')) {
    return next();
  }
  
  if (SecurityMonitor.detectSuspiciousActivity(req)) {
    SecurityMonitor.logSecurityEvent('Suspicious Activity Detected', {
      ip: req.ip,
      url: req.originalUrl,
      method: req.method,
      userAgent: req.headers['user-agent']
    }, 'high');
    
    return res.status(403).json({ error: 'Suspicious activity detected' });
  }
  next();
});

// CSRF Protection for state-changing operations (excluding auth and uploads)
app.use('/api', (req, res, next) => {
  // Skip CSRF protection for authentication routes and uploads
  if (req.path.startsWith('/auth/') || req.path.startsWith('/uploads/')) {
    return next();
  }
  
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

// Serve uploaded files
app.use('/uploads', express.static('uploads', {
  maxAge: '1d', // Cache for 1 day
  etag: true
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
