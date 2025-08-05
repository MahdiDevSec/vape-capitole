import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, validationResult } from 'express-validator';
import xss from 'xss';
import DOMPurify from 'isomorphic-dompurify';

// Rate limiting middleware - Protection against brute force attacks
export const createRateLimiter = (windowMs: number = 15 * 60 * 1000, max: number = 100) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// Strict rate limiter for authentication endpoints
export const authRateLimiter = createRateLimiter(15 * 60 * 1000, 50); // 50 attempts per 15 minutes (increased for development)
export const generalRateLimiter = createRateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes
export const apiRateLimiter = createRateLimiter(1 * 60 * 1000, 60); // 60 requests per minute

// XSS Protection middleware
export const xssProtection = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Sanitize request body
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body);
    }

    // Sanitize query parameters
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeObject(req.query);
    }

    // Sanitize URL parameters
    if (req.params && typeof req.params === 'object') {
      req.params = sanitizeObject(req.params);
    }

    next();
  } catch (error) {
    console.error('XSS Protection Error:', error);
    res.status(400).json({ error: 'Invalid input data' });
  }
};

// Sanitize object recursively
const sanitizeObject = (obj: any): any => {
  if (typeof obj === 'string') {
    return DOMPurify.sanitize(xss(obj));
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }
  
  return obj;
};

// SQL Injection Protection - Input validation
export const validateInput = [
  body('*').customSanitizer((value) => {
    if (typeof value === 'string') {
      // Remove potential SQL injection patterns
      return value.replace(/['"`;\\]/g, '');
    }
    return value;
  }),
];

// CSRF Protection middleware
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Skip CSRF for GET requests and API calls with valid JWT
  if (req.method === 'GET' || req.headers.authorization) {
    return next();
  }

  // For now, we rely on JWT authentication for API protection
  // CSRF protection can be enhanced when session management is fully implemented
  const csrfToken = req.headers['x-csrf-token'];
  
  // Basic CSRF check - can be enhanced with proper session management
  if (req.method !== 'GET' && !req.headers.authorization && !csrfToken) {
    return res.status(403).json({ error: 'CSRF token required for non-authenticated requests' });
  }

  next();
};

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'same-origin' }
});

// File upload security
export const fileUploadSecurity = (req: Request, res: Response, next: NextFunction) => {
  if (req.file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    if (req.file.size > maxSize) {
      return res.status(400).json({ error: 'File too large' });
    }

    // Sanitize filename
    req.file.originalname = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '');
  }

  next();
};

// Request size limiter
export const requestSizeLimiter = (req: Request, res: Response, next: NextFunction) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const contentLength = parseInt(req.headers['content-length'] || '0');

  if (contentLength > maxSize) {
    return res.status(413).json({ error: 'Request entity too large' });
  }

  next();
};

// IP Whitelist/Blacklist middleware
export const ipFilter = (req: Request, res: Response, next: NextFunction) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  
  // Add your IP filtering logic here
  // const blacklistedIPs = ['192.168.1.100']; // Example
  // if (blacklistedIPs.includes(clientIP)) {
  //   return res.status(403).json({ error: 'Access denied' });
  // }

  next();
};

// Request logging for security monitoring
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const logData = {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.headers['user-agent'],
    referer: req.headers.referer
  };

  // Log suspicious activities
  if (req.originalUrl.includes('admin') || req.method === 'DELETE') {
    console.log('Security Log:', JSON.stringify(logData, null, 2));
  }

  next();
};

// Validation error handler
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};
