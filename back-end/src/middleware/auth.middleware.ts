import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      console.log('No Authorization header found');
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Handle both 'Bearer token' and just 'token' formats
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;

    if (!token) {
      console.log('No token found in Authorization header');
      return res.status(401).json({ message: 'Authentication token required' });
    }

    console.log('Verifying token:', token.substring(0, 10) + '...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    
    console.log('Token decoded, user ID:', decoded.id);
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log('User not found for ID:', decoded.id);
      return res.status(401).json({ message: 'User not found' });
    }

    console.log('User authenticated:', user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    const message = error instanceof Error ? error.message : 'Invalid token';
    res.status(401).json({ 
      message: 'Authentication failed',
      error: message
    });
  }
};

export const adminMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(403).json({ message: 'Access denied' });
  }
};

// Aliases for consistency
export const authenticateToken = authMiddleware;
export const requireAdmin = adminMiddleware;
