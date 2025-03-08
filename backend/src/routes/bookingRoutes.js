// src/routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { authenticateJWT} = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// User routes
router.post("/", authenticateJWT, bookingController.createBooking);
router.get("/my-bookings", authenticateJWT, bookingController.getUserBookings);
router.get("/:id", authenticateJWT, bookingController.getBookingById);
router.patch("/:id/cancel", authenticateJWT, bookingController.cancelBooking);
router.post(
  "/:id/check-in",
  authenticateJWT,
  bookingController.checkInWithAadhaar
);

// Admin routes
router.get(
  "/",
  [authenticateJWT, adminMiddleware],
  bookingController.getAllBookings
);

module.exports = router;
