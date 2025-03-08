// src/controllers/bookingController.js
const bookingService = require("../services/bookingService");

const bookingController = {
  createBooking: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const bookingData = req.body;

      const booking = await bookingService.createBooking(userId, bookingData);

      res.status(201).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  },

  getUserBookings: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const bookings = await bookingService.getUserBookings(userId);

      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  },

  getBookingById: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const booking = await bookingService.getBookingById(id, userId);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  },

  cancelBooking: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const booking = await bookingService.cancelBooking(id, userId);

      res.status(200).json({
        success: true,
        message: "Booking canceled successfully",
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  },

  checkInWithAadhaar: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { aadhaarNumber } = req.body;

      console.log("checkin with aadhar user id",userId)

      if (!aadhaarNumber) {
        return res.status(400).json({
          success: false,
          message: "Aadhaar number is required",
        });
      }

      const booking = await bookingService.checkInWithAadhaar(
        id,
        userId,
        aadhaarNumber
      );

      res.status(200).json({
        success: true,
        message: "Check-in successful",
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  },

  // Admin endpoints
  getAllBookings: async (req, res, next) => {
    try {
      const filters = req.query;
      const bookings = await bookingService.getAllBookings(filters);

      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = bookingController;
