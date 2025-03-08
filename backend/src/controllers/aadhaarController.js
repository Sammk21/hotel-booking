const aadhaarService = require("../services/aadhaarService");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Validate Aadhaar number
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateAadhaar = async (req, res, next) => {
  try {
    const { aadhaarNumber } = req.body;
    const userId = req.user.id;

    const result = await aadhaarService.validateAadhaar(aadhaarNumber, userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Aadhaar number with third-party API
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const verifyAadhaar = async (req, res, next) => {
  try {
    const { aadhaarId } = req.params;
    const userId = req.user.id;

    const result = await aadhaarService.verifyAadhaar(aadhaarId, userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a user's Aadhaar records
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getUserAadhaarRecords = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const records = await aadhaarService.getUserAadhaarRecords(userId);
    res.status(200).json({ records });
  } catch (error) {
    next(error);
  }
};

/**
 * Web check-in using Aadhaar
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const webCheckIn = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const userId = req.user.id;
    const { bookingId, aadhaarNumber } = req.body;

    // Validate the booking exists and belongs to the user
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { hotel: true },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to check in to this booking",
      });
    }

    // Check if check-in date is valid (can only check in on the check-in date)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkInDate = new Date(booking.checkInDate);
    checkInDate.setHours(0, 0, 0, 0);

    if (checkInDate > today) {
      return res.status(400).json({
        success: false,
        message: "Cannot check in before the check-in date",
      });
    }

    // Validate the provided Aadhaar number
    const validationResult = await aadhaarService.validateAadhaar(
      aadhaarNumber,
      userId
    );

    if (!validationResult.isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Aadhaar number",
        details: validationResult.message,
      });
    }

    // Update booking status to checked in
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "checked_in",
        aadhaarVerified: true,
      },
      include: { hotel: true },
    });

    res.status(200).json({
      success: true,
      message: `Successfully checked in to ${booking.hotel.name}`,
      data: {
        bookingId: updatedBooking.id,
        hotelName: updatedBooking.hotel.name,
        checkInDate: updatedBooking.checkInDate,
        checkOutDate: updatedBooking.checkOutDate,
        status: updatedBooking.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mock Aadhaar verification for testing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const mockAadhaarVerify = async (req, res, next) => {
  try {
    const { aadhaarNumber } = req.body;

    // Simple validation - Aadhaar should be 12 digits
    const isValid = /^\d{12}$/.test(aadhaarNumber);

    // Add a slight delay to simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!isValid) {
      return res.status(400).json({
        success: false,
        isValid: false,
        message: "Invalid Aadhaar format. Must be 12 digits.",
      });
    }

    // For testing purposes, specific numbers can trigger different responses
    if (aadhaarNumber === "000000000000") {
      return res.status(400).json({
        success: false,
        isValid: false,
        message: "Aadhaar number is blacklisted",
      });
    }

    res.status(200).json({
      success: true,
      isValid: true,
      message: "Aadhaar verified successfully",
      details: {
        verified: true,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateAadhaar,
  verifyAadhaar,
  getUserAadhaarRecords,
  webCheckIn,
  mockAadhaarVerify,
};
