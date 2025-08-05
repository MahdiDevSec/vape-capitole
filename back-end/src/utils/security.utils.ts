import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request } from 'express';

// Password security utilities
export class PasswordSecurity {
  private static readonly SALT_ROUNDS = 12;
  private static readonly MIN_PASSWORD_LENGTH = 8;
  private static readonly PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

  static async hashPassword(password: string): Promise<string> {
    if (!this.isValidPassword(password)) {
      throw new Error('Password does not meet security requirements');
    }
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  static isValidPassword(password: string): boolean {
    return (
      password.length >= this.MIN_PASSWORD_LENGTH &&
      this.PASSWORD_REGEX.test(password)
    );
  }

  static generateSecurePassword(length: number = 12): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&';
    let password = '';
    
    // Ensure at least one character from each required category
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // lowercase
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // uppercase
    password += '0123456789'[Math.floor(Math.random() * 10)]; // digit
    password += '@$!%*?&'[Math.floor(Math.random() * 7)]; // special char
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }
}

// JWT Security utilities
export class JWTSecurity {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
  private static readonly JWT_EXPIRES_IN = '24h';
  private static readonly REFRESH_TOKEN_EXPIRES_IN = '7d';

  static generateToken(payload: object): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
      issuer: 'vape-capitole',
      audience: 'vape-users'
    });
  }

  static generateRefreshToken(payload: object): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
      issuer: 'vape-capitole',
      audience: 'vape-users'
    });
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET, {
        issuer: 'vape-capitole',
        audience: 'vape-users'
      });
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  static extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}

// Encryption utilities
export class EncryptionUtils {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly KEY_LENGTH = 32;
  private static readonly IV_LENGTH = 16;

  static encrypt(text: string, key?: string): { encrypted: string; iv: string; tag: string } {
    const secretKey = key ? crypto.createHash('sha256').update(key).digest() : crypto.randomBytes(this.KEY_LENGTH);
    const iv = crypto.randomBytes(this.IV_LENGTH);
    
    const cipher = crypto.createCipher(this.ALGORITHM, secretKey);
    cipher.setAAD(Buffer.from('vape-capitole-aad'));
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    };
  }

  static decrypt(encryptedData: { encrypted: string; iv: string; tag: string }, key?: string): string {
    const secretKey = key ? crypto.createHash('sha256').update(key).digest() : crypto.randomBytes(this.KEY_LENGTH);
    
    const decipher = crypto.createDecipher(this.ALGORITHM, secretKey);
    decipher.setAAD(Buffer.from('vape-capitole-aad'));
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  static hashData(data: string, salt?: string): string {
    const actualSalt = salt || crypto.randomBytes(16).toString('hex');
    return crypto.pbkdf2Sync(data, actualSalt, 10000, 64, 'sha512').toString('hex');
  }
}

// Input validation and sanitization
export class InputValidator {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  static sanitizeString(input: string, maxLength: number = 255): string {
    return input
      .trim()
      .substring(0, maxLength)
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/['"`;]/g, ''); // Remove potential SQL injection chars
  }

  static isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  static validateNumericRange(value: number, min: number, max: number): boolean {
    return typeof value === 'number' && value >= min && value <= max;
  }

  static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .substring(0, 100);
  }
}

// Security monitoring and logging
export class SecurityMonitor {
  private static suspiciousPatterns = [
    /union\s+select/i,
    /drop\s+table/i,
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /\.\.\//,
    /etc\/passwd/i,
    /cmd\.exe/i,
    /powershell/i
  ];

  static detectSuspiciousActivity(req: Request): boolean {
    const checkString = `${req.originalUrl} ${JSON.stringify(req.body)} ${JSON.stringify(req.query)}`;
    
    return this.suspiciousPatterns.some(pattern => pattern.test(checkString));
  }

  static logSecurityEvent(event: string, details: any, severity: 'low' | 'medium' | 'high' = 'medium'): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      severity,
      details,
      source: 'security-monitor'
    };

    console.log(`[SECURITY-${severity.toUpperCase()}]`, JSON.stringify(logEntry, null, 2));
    
    // In production, you might want to send this to a security monitoring service
    if (severity === 'high') {
      // Alert administrators
      console.error('HIGH SEVERITY SECURITY EVENT DETECTED!', logEntry);
    }
  }

  static generateSecurityReport(): any {
    return {
      timestamp: new Date().toISOString(),
      status: 'active',
      protections: [
        'Rate limiting',
        'XSS protection',
        'SQL injection prevention',
        'CSRF protection',
        'Input validation',
        'Secure headers',
        'File upload security',
        'Request size limiting'
      ]
    };
  }
}

// Session security
export class SessionSecurity {
  static generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static isValidSession(sessionData: any): boolean {
    if (!sessionData || !sessionData.createdAt) {
      return false;
    }

    const sessionAge = Date.now() - new Date(sessionData.createdAt).getTime();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    return sessionAge < maxAge;
  }

  static createSecureSession(userId: string, additionalData: any = {}): any {
    return {
      id: this.generateSessionId(),
      userId,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      csrfToken: EncryptionUtils.generateSecureToken(16),
      ...additionalData
    };
  }
}

export default {
  PasswordSecurity,
  JWTSecurity,
  EncryptionUtils,
  InputValidator,
  SecurityMonitor,
  SessionSecurity
};
