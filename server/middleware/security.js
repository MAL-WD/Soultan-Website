import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { logSecurityEvent } from '../utils/logger.js';

/**
 * Custom handler for rate limit violations to log security events
 */
const createRateLimitHandler = (reason, windowMinutes) => {
  return (req, res, next, options) => {
    logSecurityEvent({
      req,
      type: 'RATE_LIMIT_EXCEEDED',
      message: `Rate limit exceeded: ${reason}`,
      details: {
        reason,
        windowMinutes,
        headers: {
          'x-forwarded-for': req.headers['x-forwarded-for'],
          'user-agent': req.headers['user-agent']
        }
      }
    });

    res.status(options.statusCode).json({
      success: false,
      message: `Too many requests for ${reason}. Please try again after ${windowMinutes} minutes.`,
      retryAfterMinutes: windowMinutes
    });
  };
};

/**
 * 1. General API Rate Limiter
 * Protects server endpoints from aggressive scraping / volumetric abuse
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler('general API requests', 15)
});

/**
 * 2. Strict Authentication Rate Limiter (Brute-Force & Credential Stuffing Defense)
 * Applied to login, register, password reset endpoints
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 auth attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: createRateLimitHandler('authentication endpoints', 15)
});

/**
 * 3. Contact Form / Public Submission Rate Limiter
 * Protects against contact form spam and mailer bombing
 */
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 submissions per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler('form submissions', 15)
});

/**
 * 4. File Upload Rate Limiter
 * Protects server and cloud storage from resource exhaustion
 */
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 uploads per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler('file uploads', 15)
});

/**
 * 5. Input Sanitizer Middleware (Basic XSS / Script Tag Stripping)
 * Strips potentially dangerous script tags and event handlers from incoming string payloads
 */
const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    // Strip <script>...</script> tags and javascript: pseudo-protocols
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/onload\s*=/gi, '')
      .replace(/onerror\s*=/gi, '');
  }
  if (value !== null && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      value[key] = sanitizeValue(value[key]);
    }
  }
  return value;
};

export const sanitizeInputs = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }
  next();
};

/**
 * 6. Hardened Helmet Configuration
 * Sets robust HTTP security headers without breaking Google Sign-In or external CDNs
 */
export const helmetSecurity = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
      connectSrc: ["'self'", "https://accounts.google.com", "https://*.cloudinary.com", "https://*.amazonaws.com"],
      imgSrc: ["'self'", "data:", "blob:", "https:", "http:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      frameSrc: ["'self'", "https://accounts.google.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }, // Needed for Google Auth popup
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xContentTypeOptions: true, // nosniff
  xDnsPrefetchControl: { allow: false },
  xFrameOptions: { action: 'sameorigin' },
  xPermittedCrossDomainPolicies: { permittedPolicies: 'none' },
});

/**
 * 7. Security Headers & Permissions-Policy Middleware
 */
export const securityHeaders = (req, res, next) => {
  // Prevent browser caching for sensitive API responses
  if (req.originalUrl && req.originalUrl.startsWith('/api/auth')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  // Permissions Policy to restrict unused browser APIs
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(self)'
  );

  next();
};
