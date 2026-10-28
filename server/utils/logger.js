import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDir = path.join(__dirname, '../logs');

// Ensure log directory exists so it doesn't crash on cloud hosts like Render
if (!fs.existsSync(logDir)) {
  try {
    fs.mkdirSync(logDir, { recursive: true });
  } catch (err) {
    console.error('Failed to create log directory:', err);
  }
}

// Custom log format for file outputs
const fileLogFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Formatter for console output
const consoleLogFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
    let log = `[${timestamp}] [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    if (stack) {
      log += `\n${stack}`;
    }
    return log;
  })
);

// General Application Logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: fileLogFormat,
  transports: [
    // Write all errors to error.log
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
    // Write all messages to combined.log
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
  ],
});

// Security Audit Logger (Brute force attempts, DDoS/Rate limit triggers, auth failures, etc.)
export const securityLogger = winston.createLogger({
  level: 'info',
  format: fileLogFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'security.log'),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
  ],
});

// Always add console output in development (or if explicitly enabled)
if (process.env.NODE_ENV !== 'production' || process.env.CONSOLE_LOGGING === 'true') {
  logger.add(new winston.transports.Console({
    format: consoleLogFormat,
  }));
  securityLogger.add(new winston.transports.Console({
    format: consoleLogFormat,
  }));
}

/**
 * Helper to record security audit events consistently
 * @param {Object} options
 * @param {import('express').Request} [options.req] - Express request object
 * @param {string} options.type - Event type (e.g., 'AUTH_FAILED', 'RATE_LIMIT_EXCEEDED', 'UNAUTHORIZED_ACCESS')
 * @param {string} options.message - Human-readable explanation
 * @param {Object} [options.details] - Additional contextual details
 */
export const logSecurityEvent = ({ req, type, message, details = {} }) => {
  const ip = req?.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req?.socket?.remoteAddress || 'unknown';
  const userAgent = req?.headers['user-agent'] || 'unknown';
  const path = req?.originalUrl || req?.url || 'unknown';
  const method = req?.method || 'unknown';
  const userId = req?.user?._id || req?.user?.id || details?.userId || null;

  securityLogger.warn({
    type,
    message,
    ip,
    method,
    path,
    userAgent,
    userId,
    details,
  });
};

// Stream for Morgan HTTP logger integration
export const morganStream = {
  write: (text) => {
    logger.info(text.trim());
  },
};

export default logger;
