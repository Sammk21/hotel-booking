const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const encryptionService = require("./encryptionService");
const axios = require("axios");

/**
 * Aadhaar validation and verification service
 */
const aadhaarService = {
  /**
   * Validate Aadhaar number format and store for user
   * @param {string} aadhaarNumber - The Aadhaar number to validate
   * @param {string} userId - User ID
   * @returns {Object} Validation result
   */
  validateAadhaar: async (aadhaarNumber, userId) => {
    try {
      // Basic validation - Check if it's 12 digits
      if (!/^\d{12}$/.test(aadhaarNumber)) {
        return {
          isValid: false,
          message: "Invalid Aadhaar format. Aadhaar must be 12 digits.",
        };
      }

      // Encrypt the Aadhaar number before storing
      const encryptedAadhaar = await encryptionService.encrypt(aadhaarNumber);

      // Check if user already has an Aadhaar record
      const existingAadhaar = await prisma.aadhaar.findFirst({
        where: { userId },
      });

      let aadhaarRecord;

      console.log("user id in aadhar service", userId)

      if (existingAadhaar) {
        // Update existing record
        aadhaarRecord = await prisma.aadhaar.update({
          where: { id: existingAadhaar.id },
          data: {
            aadhaarNumber: encryptedAadhaar,
            isVerified: false,
          },
        });
      } else {
        // Create new record
        aadhaarRecord = await prisma.aadhaar.create({
          data: {
            userId,
            aadhaarNumber: encryptedAadhaar,
            isVerified: false,
          },
        });
      }

      return {
        isValid: true,
        message: "Aadhaar number format is valid",
        aadhaarId: aadhaarRecord.id,
      };
    } catch (error) {
      console.error("Aadhaar validation error:", error);
      throw new Error(`Failed to validate Aadhaar: ${error.message}`);
    }
  },

  /**
   * Verify Aadhaar with mock third-party API
   * @param {string} aadhaarId - ID of the stored Aadhaar record
   * @param {string} userId - User ID
   * @returns {Object} Verification result
   */
  verifyAadhaar: async (aadhaarId, userId) => {
    try {
      // Get the Aadhaar record
      const aadhaarRecord = await prisma.aadhaar.findUnique({
        where: { id: aadhaarId },
      });

      if (!aadhaarRecord) {
        return {
          success: false,
          message: "Aadhaar record not found",
        };
      }

      if (aadhaarRecord.userId !== userId) {
        return {
          success: false,
          message: "You do not have permission to verify this Aadhaar",
        };
      }

      // Decrypt the Aadhaar number
      const decryptedAadhaar = await encryptionService.decrypt(
        aadhaarRecord.aadhaarNumber
      );

      // Call mock verification endpoint
      // In production, this would be a real API call to Aadhaar verification service
      try {
        // const response = await axios.post("/api/check-in/verify-aadhaar", {
        //   aadhaarNumber: decryptedAadhaar,
        // });

        //mock response
        const response = {
          success: true,
          isValid: true,
          message: "Aadhaar number successfully verified",
        };

        // Update Aadhaar verification status
        const updatedAadhaar = await prisma.aadhaar.update({
          where: { id: aadhaarId },
          data: {
            isVerified: response.data.isValid,
          },
        });

        return {
          success: true,
          isVerified: updatedAadhaar.isVerified,
          message: response.data.message,
        };
      } catch (apiError) {
        return {
          success: false,
          message:
            apiError.response?.data?.message ||
            "Verification service unavailable",
          error: apiError.message,
        };
      }
    } catch (error) {
      console.error("Aadhaar verification error:", error);
      throw new Error(`Failed to verify Aadhaar: ${error.message}`);
    }
  },

  /**
   * Get user's Aadhaar records
   * @param {string} userId - User ID
   * @returns {Array} Aadhaar records
   */
  getUserAadhaarRecords: async (userId) => {
    try {
      const records = await prisma.aadhaar.findMany({
        where: { userId },
        select: {
          id: true,
          isVerified: true,
          createdAt: true,

        },
      });

      return records;
    } catch (error) {
      console.error("Error fetching Aadhaar records:", error);
      throw new Error(`Failed to get Aadhaar records: ${error.message}`);
    }
  },

  /**
   * Check-in with Aadhaar for a booking
   * @param {string} bookingId - Booking ID
   * @param {string} aadhaarNumber - Aadhaar number
   * @param {string} userId - User ID
   * @returns {Object} Check-in result
   */
  checkInWithAadhaar: async (bookingId, aadhaarNumber, userId) => {
    try {
      // Validate booking
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { hotel: true },
      });

      if (!booking) {
        return {
          success: false,
          message: "Booking not found",
        };
      }

      if (booking.userId !== userId) {
        return {
          success: false,
          message: "You do not have permission to check in to this booking",
        };
      }

      if (booking.status === "cancelled") {
        return {
          success: false,
          message: "Cannot check in to a cancelled booking",
        };
      }

      if (booking.status === "checked_in" || booking.status === "completed") {
        return {
          success: false,
          message: `Booking already ${booking.status}`,
        };
      }

      // Validate Aadhaar
      const aadhaarValidation = await aadhaarService.validateAadhaar(
        aadhaarNumber,
        userId
      );

      if (!aadhaarValidation.isValid) {
        return {
          success: false,
          message: "Invalid Aadhaar number",
          details: aadhaarValidation.message,
        };
      }

      // Verify Aadhaar
      const aadhaarVerification = await aadhaarService.verifyAadhaar(
        aadhaarValidation.aadhaarId,
        userId
      );

      if (!aadhaarVerification.isVerified) {
        return {
          success: false,
          message: "Aadhaar verification failed",
          details: aadhaarVerification.message,
        };
      }

      // Update booking status
      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: "checked_in",
          aadhaarVerified: true,
        },
      });

      return {
        success: true,
        message: `Successfully checked in to ${booking.hotel.name}`,
        bookingId: updatedBooking.id,
        hotelName: booking.hotel.name,
        status: updatedBooking.status,
      };
    } catch (error) {
      console.error("Check-in error:", error);
      throw new Error(`Failed to check in: ${error.message}`);
    }
  },
};

module.exports = aadhaarService;
