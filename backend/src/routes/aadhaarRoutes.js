const express = require("express");
const router = express.Router();
const aadhaarController = require("../controllers/aadhaarController");
const {authenticateJWT} = require("../middleware/authMiddleware");
const { body } = require("express-validator");

// All routes require authentication
router.use(authenticateJWT);

// Validate Aadhaar number
router.post(
  "/validate",
  [body("aadhaarNumber").notEmpty().withMessage("Aadhaar number is required")],
  aadhaarController.validateAadhaar
);

// Verify Aadhaar
router.post("/verify/:aadhaarId", aadhaarController.verifyAadhaar);

// Get user's Aadhaar records
router.get("/records", aadhaarController.getUserAadhaarRecords);

// Web check-in using Aadhaar
router.post(
  "/check-in",
  [
    body("bookingId").notEmpty().withMessage("Booking ID is required"),
    body("aadhaarNumber").notEmpty().withMessage("Aadhaar number is required"),
  ],
  aadhaarController.webCheckIn
);

// Mock Aadhaar verification API for testing
router.post(
  "/verify-aadhaar",
  [body("aadhaarNumber").notEmpty().withMessage("Aadhaar number is required")],
  aadhaarController.mockAadhaarVerify
);

module.exports = router;
