// src/routes/roomRoutes.js
const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const {authenticateJWT}  = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public routes
router.get("/hotel/:hotelId", roomController.getRoomsByHotelId);
router.get("/available/hotel/:hotelId", roomController.getAvailableRooms);
router.get("/:id", roomController.getRoomById);

// Admin routes
router.post(
  "/hotel/:hotelId",
  [authenticateJWT, adminMiddleware],
  roomController.createRoom
);
router.put(
  "/:id",
  [authenticateJWT, adminMiddleware],
  roomController.updateRoom
);
router.delete(
  "/:id",
  [authenticateJWT, adminMiddleware],
  roomController.deleteRoom
);

module.exports = router;
