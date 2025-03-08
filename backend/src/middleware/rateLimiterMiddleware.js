const rateLimit = require("express-rate-limit");
const config = require("../config");

// Rate limiting for all API requests
const apiLimiter = rateLimit({
  windowMs: config.rateLimiter.windowMs,
  max: config.rateLimiter.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests, please try again later.",
  },
});

// More strict rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login/register attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many authentication attempts, please try again later.",
  },
});

// Strict rate limiting for Aadhaar validation
const aadhaarValidationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 validation attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many Aadhaar validation attempts, please try again later.",
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  aadhaarValidationLimiter,
};
