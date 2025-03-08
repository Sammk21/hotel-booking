const { body, validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bookingMiddleware = {
  // Validate booking input data
  validateBookingInput: [
    body("hotelId").notEmpty().withMessage("Hotel ID is required"),
    body("checkInDate")
      .notEmpty()
      .withMessage("Check-in date is required")
      .isISO8601()
      .withMessage("Check-in date must be a valid date format")
      .custom((value) => {
        const checkInDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkInDate < today) {
          throw new Error("Check-in date must not be in the past");
        }
        return true;
      }),
    body("checkOutDate")
      .notEmpty()
      .withMessage("Check-out date is required")
      .isISO8601()
      .withMessage("Check-out date must be a valid date format")
      .custom((value, { req }) => {
        const checkInDate = new Date(req.body.checkInDate);
        const checkOutDate = new Date(value);

        if (checkOutDate <= checkInDate) {
          throw new Error("Check-out date must be after check-in date");
        }
        return true;
      }),
    body("numberOfGuests")
      .notEmpty()
      .withMessage("Number of guests is required")
      .isInt({ min: 1 })
      .withMessage("At least one guest is required"),
  ],

  // Ensure hotel exists before booking
  ensureHotelExists: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { hotelId } = req.body;

      const hotel = await prisma.hotel.findUnique({
        where: { id: hotelId },
      });

      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: "Hotel not found",
        });
      }

      // Add hotel to request for downstream use
      req.hotel = hotel;
      next();
    } catch (error) {
      next(error);
    }
  },

  // Validate booking ownership for operations
  validateBookingOwnership: async (req, res, next) => {
    try {
      const { bookingId } = req.params;
      const userId = req.user.id;

      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      // Check if the booking belongs to the user or user is admin
      if (booking.userId !== userId && req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Not authorized to access this booking",
        });
      }

      // Add booking to the request for downstream use
      req.booking = booking;
      next();
    } catch (error) {
      next(error);
    }
  },
};

module.exports = bookingMiddleware;
