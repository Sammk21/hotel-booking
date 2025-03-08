const express = require("express");
const router = express.Router();
const {login, register, getCurrentUser} = require("../controllers/authController");
const { authenticateJWT } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiterMiddleware");

// Public routes with rate limiting
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

// Protected routes
router.get("/me", authenticateJWT, getCurrentUser);

module.exports = router;
