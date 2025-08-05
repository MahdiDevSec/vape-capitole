import { Request, Response, NextFunction } from 'express';
import { SecurityMonitor, InputValidator } from '../utils/security.utils';

// SQL Injection protection patterns
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
  /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
  /(\b(OR|AND)\s+['"]\w+['"]?\s*=\s*['"]\w+['"]?)/gi,
  /(--|\#|\/\*|\*\/)/g,
  /(\bUNION\b.*\bSELECT\b)/gi,
  /(\bSELECT\b.*\bFROM\b.*\bWHERE\b)/gi,
  /(;|\|\||&&)/g,
  /(\b(WAITFOR|DELAY)\b)/gi,
  /(\b(CAST|CONVERT|SUBSTRING|ASCII|CHAR)\b)/gi,
  /(\b(INFORMATION_SCHEMA|SYSOBJECTS|SYSCOLUMNS)\b)/gi
];

// NoSQL Injection protection patterns
const NOSQL_INJECTION_PATTERNS = [
  /\$where/gi,
  /\$regex/gi,
  /\$ne/gi,
  /\$gt/gi,
  /\$lt/gi,
  /\$gte/gi,
  /\$lte/gi,
  /\$in/gi,
  /\$nin/gi,
  /\$exists/gi,
  /\$type/gi,
  /\$mod/gi,
  /\$all/gi,
  /\$size/gi,
  /\$elemMatch/gi,
  /\$slice/gi,
  /javascript:/gi,
  /function\s*\(/gi
];

// XSS protection patterns
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /on\w+\s*=/gi,
  /<\s*\w+\s+[^>]*on\w+\s*=/gi,
  /expression\s*\(/gi,
  /url\s*\(/gi,
  /@import/gi
];

// Command injection protection patterns
const COMMAND_INJECTION_PATTERNS = [
  /(\||&&|;|\$\(|`)/g,
  /\b(cmd\.exe|powershell\.exe|bash|sh|zsh|fish)\b/gi,
  /\b(rm|del|format|fdisk|mkfs)\s+/gi,
  /\b(chmod|chown|sudo|su)\s+/gi,
  /(\.\.|\/etc\/|\/bin\/|\/usr\/|\/var\/)/g,
  /\b(passwd|shadow|hosts|fstab)\b/gi
];

// Path traversal patterns
const PATH_TRAVERSAL_PATTERNS = [
  /\.\.\//g,
  /\.\.\\+/g,
  /%2e%2e%2f/gi,
  /%2e%2e%5c/gi,
  /\.\.%2f/gi,
  /\.\.%5c/gi,
  /%252e%252e%252f/gi,
  /\/etc\/passwd/gi,
  /\/etc\/shadow/gi,
  /\/windows\/system32/gi,
  /\/boot\.ini/gi
];

interface InjectionCheckResult {
  isSafe: boolean;
  threats: string[];
  severity: 'low' | 'medium' | 'high';
}

export class InjectionProtector {
  // Check for SQL injection attempts
  static checkSQLInjection(input: string): boolean {
    return SQL_INJECTION_PATTERNS.some(pattern => pattern.test(input));
  }

  // Check for NoSQL injection attempts
  static checkNoSQLInjection(input: any): boolean {
    const inputStr = typeof input === 'string' ? input : JSON.stringify(input);
    return NOSQL_INJECTION_PATTERNS.some(pattern => pattern.test(inputStr));
  }

  // Check for XSS attempts
  static checkXSS(input: string): boolean {
    return XSS_PATTERNS.some(pattern => pattern.test(input));
  }

  // Check for command injection attempts
  static checkCommandInjection(input: string): boolean {
    return COMMAND_INJECTION_PATTERNS.some(pattern => pattern.test(input));
  }

  // Check for path traversal attempts
  static checkPathTraversal(input: string): boolean {
    return PATH_TRAVERSAL_PATTERNS.some(pattern => pattern.test(input));
  }

  // Comprehensive injection check
  static checkForInjections(input: any): InjectionCheckResult {
    const threats: string[] = [];
    let severity: 'low' | 'medium' | 'high' = 'low';

    if (typeof input === 'string') {
      if (this.checkSQLInjection(input)) {
        threats.push('SQL Injection');
        severity = 'high';
      }
      if (this.checkXSS(input)) {
        threats.push('XSS');
        severity = severity === 'high' ? 'high' : 'medium';
      }
      if (this.checkCommandInjection(input)) {
        threats.push('Command Injection');
        severity = 'high';
      }
      if (this.checkPathTraversal(input)) {
        threats.push('Path Traversal');
        severity = severity === 'high' ? 'high' : 'medium';
      }
    }

    if (this.checkNoSQLInjection(input)) {
      threats.push('NoSQL Injection');
      severity = 'high';
    }

    return {
      isSafe: threats.length === 0,
      threats,
      severity
    };
  }

  // Sanitize input to remove potential threats
  static sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      let sanitized = input;
      
      // Remove SQL injection patterns
      SQL_INJECTION_PATTERNS.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '');
      });
      
      // Remove XSS patterns
      XSS_PATTERNS.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '');
      });
      
      // Remove command injection patterns
      COMMAND_INJECTION_PATTERNS.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '');
      });
      
      // Remove path traversal patterns
      PATH_TRAVERSAL_PATTERNS.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '');
      });
      
      return sanitized.trim();
    }
    
    if (Array.isArray(input)) {
      return input.map(item => this.sanitizeInput(item));
    }
    
    if (input && typeof input === 'object') {
      const sanitized: any = {};
      for (const key in input) {
        if (input.hasOwnProperty(key)) {
          // Sanitize both key and value
          const sanitizedKey = this.sanitizeInput(key);
          sanitized[sanitizedKey] = this.sanitizeInput(input[key]);
        }
      }
      return sanitized;
    }
    
    return input;
  }
}

// List of headers to exclude from injection checks
const EXCLUDED_HEADERS = [
  'user-agent',
  'accept',
  'accept-encoding',
  'accept-language',
  'connection',
  'content-length',
  'content-type',
  'dnt',
  'origin',
  'referer',
  'sec-fetch-dest',
  'sec-fetch-mode',
  'sec-fetch-site',
  'sec-ch-ua',
  'sec-ch-ua-mobile',
  'sec-ch-ua-platform',
  'upgrade-insecure-requests'
];

// Middleware to protect against injection attacks
export const injectionProtectionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const checkData = (data: any, dataType: string) => {
      if (!data) return;
      
      const result = InjectionProtector.checkForInjections(data);
      
      if (!result.isSafe) {
        SecurityMonitor.logSecurityEvent(`${result.threats.join(', ')} Detected in ${dataType}`, {
          ip: req.ip,
          url: req.originalUrl,
          method: req.method,
          userAgent: req.headers['user-agent'],
          threats: result.threats,
          severity: result.severity,
          data: typeof data === 'string' ? data.substring(0, 100) : JSON.stringify(data).substring(0, 100)
        }, result.severity);
        
        return res.status(400).json({
          error: 'Malicious input detected',
          message: 'Your request contains potentially harmful content',
          threats: result.threats
        });
      }
    };

    // Check request body
    if (req.body) {
      const bodyResult = InjectionProtector.checkForInjections(req.body);
      if (!bodyResult.isSafe) {
        SecurityMonitor.logSecurityEvent(`Injection Attack in Request Body`, {
          ip: req.ip,
          url: req.originalUrl,
          method: req.method,
          threats: bodyResult.threats,
          severity: bodyResult.severity
        }, bodyResult.severity);
        
        return res.status(400).json({
          error: 'Malicious input detected in request body',
          threats: bodyResult.threats
        });
      }
    }

    // Check query parameters
    if (req.query) {
      for (const key in req.query) {
        const result = InjectionProtector.checkForInjections(req.query[key]);
        if (!result.isSafe) {
          SecurityMonitor.logSecurityEvent(`Injection Attack in Query Parameter: ${key}`, {
            ip: req.ip,
            url: req.originalUrl,
            parameter: key,
            value: req.query[key],
            threats: result.threats
          }, result.severity);
          
          return res.status(400).json({
            error: `Malicious input detected in parameter: ${key}`,
            threats: result.threats
          });
        }
      }
    }

    // Check URL parameters
    if (req.params) {
      for (const key in req.params) {
        const result = InjectionProtector.checkForInjections(req.params[key]);
        if (!result.isSafe) {
          SecurityMonitor.logSecurityEvent(`Injection Attack in URL Parameter: ${key}`, {
            ip: req.ip,
            url: req.originalUrl,
            parameter: key,
            value: req.params[key],
            threats: result.threats
          }, result.severity);
          
          return res.status(400).json({
            error: `Malicious input detected in URL parameter: ${key}`,
            threats: result.threats
          });
        }
      }
    }

    // Check headers for potential attacks
    const suspiciousHeaders = ['referer', 'x-forwarded-for', 'x-real-ip'];
    for (const header of suspiciousHeaders) {
      if (req.headers[header] && !EXCLUDED_HEADERS.includes(header)) {
        const result = InjectionProtector.checkForInjections(req.headers[header] as string);
        if (!result.isSafe) {
          SecurityMonitor.logSecurityEvent(`Injection Attack in Header: ${header}`, {
            ip: req.ip,
            url: req.originalUrl,
            header,
            value: (req.headers[header] as string).substring(0, 100),
            threats: result.threats
          }, result.severity);
          
          return res.status(400).json({
            error: `Malicious input detected in header: ${header}`,
            threats: result.threats
          });
        }
      }
    }

    next();
  } catch (error: any) {
    SecurityMonitor.logSecurityEvent('Injection Protection Middleware Error', {
      ip: req.ip,
      url: req.originalUrl,
      error: error.message,
      stack: error.stack
    }, 'high');

    return res.status(500).json({ error: 'Security check failed' });
  }
};

// Sanitization middleware (use after validation)
export const sanitizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Sanitize request body
    if (req.body) {
      req.body = InjectionProtector.sanitizeInput(req.body);
    }

    // Sanitize query parameters
    if (req.query) {
      for (const key in req.query) {
        req.query[key] = InjectionProtector.sanitizeInput(req.query[key]);
      }
    }

    // Sanitize URL parameters
    if (req.params) {
      for (const key in req.params) {
        req.params[key] = InjectionProtector.sanitizeInput(req.params[key]);
      }
    }

    next();
  } catch (error: any) {
    SecurityMonitor.logSecurityEvent('Sanitization Middleware Error', {
      ip: req.ip,
      url: req.originalUrl,
      error: error.message
    }, 'medium');

    next(); // Continue even if sanitization fails
  }
};

export default {
  InjectionProtector,
  injectionProtectionMiddleware,
  sanitizationMiddleware
};
