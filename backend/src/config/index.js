const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY || "secret",
    iv: process.env.ENCRYPTION_IV || "secret",
  },
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development",
  },
  rateLimiter: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  },
};
