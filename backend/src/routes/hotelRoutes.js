// src/routes/hotelRoutes.js
const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotelController");
const {authenticateJWT} = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public routes
router.get("/", hotelController.getAllHotels);
router.get("/:id", hotelController.getHotelById);

// Admin routes
router.post(
  "/",
  [authenticateJWT, adminMiddleware],
  hotelController.createHotel
);
router.put(
  "/:id",
  [authenticateJWT, adminMiddleware],
  hotelController.updateHotel
);
router.delete(
  "/:id",
  [authenticateJWT, adminMiddleware],
  hotelController.deleteHotel
);

module.exports = router;
