import { Request, Response, NextFunction } from 'express';
import { JWTSecurity, SecurityMonitor, InputValidator } from '../utils/security.utils';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    isAdmin: boolean;
    lastLogin?: Date;
    loginAttempts?: number;
  };
}

// Enhanced JWT authentication with security monitoring
export const enhancedAuthMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      SecurityMonitor.logSecurityEvent('Missing Authorization Header', {
        ip: req.ip,
        url: req.originalUrl,
        userAgent: req.headers['user-agent']
      }, 'medium');
      
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = JWTSecurity.extractTokenFromHeader(authHeader);
    
    if (!token) {
      SecurityMonitor.logSecurityEvent('Invalid Authorization Header Format', {
        ip: req.ip,
        url: req.originalUrl,
        authHeader: authHeader.substring(0, 20) + '...'
      }, 'medium');
      
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // Verify and decode token
    const decoded = JWTSecurity.verifyToken(token);
    
    if (!decoded || !decoded.id) {
      SecurityMonitor.logSecurityEvent('Invalid JWT Token', {
        ip: req.ip,
        url: req.originalUrl,
        tokenPrefix: token.substring(0, 10) + '...'
      }, 'high');
      
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Additional security checks
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      SecurityMonitor.logSecurityEvent('Expired Token Used', {
        ip: req.ip,
        userId: decoded.id,
        url: req.originalUrl
      }, 'medium');
      
      return res.status(401).json({ error: 'Token expired' });
    }

    // Validate user ID format
    if (!InputValidator.isValidObjectId(decoded.id)) {
      SecurityMonitor.logSecurityEvent('Invalid User ID in Token', {
        ip: req.ip,
        userId: decoded.id,
        url: req.originalUrl
      }, 'high');
      
      return res.status(401).json({ error: 'Invalid user identifier' });
    }

    // Set user information
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || 'user',
      isAdmin: decoded.isAdmin || false,
      lastLogin: decoded.lastLogin ? new Date(decoded.lastLogin) : undefined,
      loginAttempts: decoded.loginAttempts || 0
    };

    // Log successful authentication for monitoring
    SecurityMonitor.logSecurityEvent('Successful Authentication', {
      userId: req.user.id,
      email: req.user.email,
      ip: req.ip,
      url: req.originalUrl
    }, 'low');

    next();
  } catch (error: any) {
    SecurityMonitor.logSecurityEvent('Authentication Error', {
      ip: req.ip,
      url: req.originalUrl,
      error: error.message,
      stack: error.stack
    }, 'high');

    return res.status(401).json({ 
      error: 'Authentication failed',
      message: 'Invalid or expired token'
    });
  }
};

// Admin role verification with enhanced security
export const enhancedAdminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      SecurityMonitor.logSecurityEvent('Admin Access Attempt Without Authentication', {
        ip: req.ip,
        url: req.originalUrl,
        userAgent: req.headers['user-agent']
      }, 'high');
      
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!req.user.isAdmin || req.user.role !== 'admin') {
      SecurityMonitor.logSecurityEvent('Unauthorized Admin Access Attempt', {
        userId: req.user.id,
        email: req.user.email,
        role: req.user.role,
        isAdmin: req.user.isAdmin,
        ip: req.ip,
        url: req.originalUrl
      }, 'high');
      
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Log admin access for audit trail
    SecurityMonitor.logSecurityEvent('Admin Access Granted', {
      userId: req.user.id,
      email: req.user.email,
      ip: req.ip,
      url: req.originalUrl,
      method: req.method
    }, 'medium');

    next();
  } catch (error: any) {
    SecurityMonitor.logSecurityEvent('Admin Middleware Error', {
      ip: req.ip,
      url: req.originalUrl,
      error: error.message,
      userId: req.user?.id
    }, 'high');

    return res.status(500).json({ error: 'Authorization check failed' });
  }
};

// Optional user authentication (for public endpoints that benefit from user context)
export const optionalAuthMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next(); // Continue without user context
    }

    const token = JWTSecurity.extractTokenFromHeader(authHeader);
    
    if (!token) {
      return next(); // Continue without user context
    }

    try {
      const decoded = JWTSecurity.verifyToken(token);
      
      if (decoded && decoded.id && InputValidator.isValidObjectId(decoded.id)) {
        req.user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role || 'user',
          isAdmin: decoded.isAdmin || false,
          lastLogin: decoded.lastLogin ? new Date(decoded.lastLogin) : undefined,
          loginAttempts: decoded.loginAttempts || 0
        };
      }
    } catch (tokenError) {
      // Invalid token, but continue without user context
      SecurityMonitor.logSecurityEvent('Invalid Optional Token', {
        ip: req.ip,
        url: req.originalUrl,
        error: (tokenError as Error).message
      }, 'low');
    }

    next();
  } catch (error: any) {
    // Log error but don't block the request
    SecurityMonitor.logSecurityEvent('Optional Auth Middleware Error', {
      ip: req.ip,
      url: req.originalUrl,
      error: error.message
    }, 'medium');

    next();
  }
};

// Rate limiting based on user authentication status
export const userBasedRateLimit = (req: AuthRequest, res: Response, next: NextFunction) => {
  // This middleware can be used with express-rate-limit to set different limits
  // based on user authentication status. Implementation depends on rate limiter setup.
  next();
};

// Session validation middleware
export const validateSession = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Session validation can be implemented when express-session is properly configured
  // For now, we rely on JWT validation for authentication
  next();
};
