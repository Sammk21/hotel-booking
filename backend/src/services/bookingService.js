// src/services/bookingService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const encryptionService = require("./encryptionService");
const aadhaarService = require("./aadhaarService");

const bookingService = {
  createBooking: async (userId, bookingData) => {
    const { roomId, checkInDate, checkOutDate } = bookingData;

    // Verify room availability
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        hotel: true,
        bookings: {
          where: {
            AND: [
              {
                OR: [
                  {
                    AND: [
                      { checkInDate: { lte: new Date(checkInDate) } },
                      { checkOutDate: { gte: new Date(checkInDate) } },
                    ],
                  },
                  {
                    AND: [
                      { checkInDate: { lte: new Date(checkOutDate) } },
                      { checkOutDate: { gte: new Date(checkOutDate) } },
                    ],
                  },
                  {
                    AND: [
                      { checkInDate: { gte: new Date(checkInDate) } },
                      { checkOutDate: { lte: new Date(checkOutDate) } },
                    ],
                  },
                ],
              },
              {
                bookingStatus: { not: "CANCELED" },
              },
            ],
          },
        },
      },
    });

    if (!room) {
      throw new Error("Room not found");
    }

    if (!room.isAvailable || room.bookings.length > 0) {
      throw new Error("Room is not available for the selected dates");
    }

    // Calculate number of days
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const numberOfDays = Math.ceil(
      (checkOut - checkIn) / (1000 * 60 * 60 * 24)
    );

    if (numberOfDays <= 0) {
      throw new Error("Check-out date must be after check-in date");
    }

    // Calculate total price
    const totalPrice = parseFloat(room.pricePerDay) * numberOfDays;

    // Create booking
    return await prisma.booking.create({
      data: {
        userId,
        roomId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalPrice,
        bookingStatus: "CONFIRMED",
      },
      include: {
        room: {
          include: {
            hotel: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  },

  getUserBookings: async (userId) => {
    return await prisma.booking.findMany({
      where: { userId },
      include: {
        room: {
          include: {
            hotel: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  getBookingById: async (id, userId) => {
    return await prisma.booking.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        room: {
          include: {
            hotel: true,
          },
        },
      },
    });
  },

  cancelBooking: async (id, userId) => {
    // Check if booking exists and belongs to the user
    const booking = await prisma.booking.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    // Check if booking is already canceled
    if (booking.bookingStatus === "CANCELED") {
      throw new Error("Booking is already canceled");
    }

    // Check if check-in date has passed
    if (new Date(booking.checkInDate) <= new Date()) {
      throw new Error("Cannot cancel booking after check-in date");
    }

    // Update booking status
    return await prisma.booking.update({
      where: { id },
      data: { bookingStatus: "CANCELED" },
    });
  },

  checkInWithAadhaar: async (bookingId, userId, aadhaarNumber) => {
    // Find the booking
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId,
      },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.isCheckedIn) {
      throw new Error("Already checked in");
    }

    if (booking.bookingStatus !== "CONFIRMED") {
      throw new Error("Booking is not confirmed");
    }

    // Check if current date is within check-in and check-out date
    const currentDate = new Date();
    if (
      currentDate < booking.checkInDate ||
      currentDate > booking.checkOutDate
    ) {
      throw new Error("Can only check in during the booking period");
    }

    // Validate Aadhaar (this would call your actual Aadhaar validation logic)
    const isValid = await aadhaarService.validateAadhaar(aadhaarNumber, userId);

    if (!isValid) {
      throw new Error("Invalid Aadhaar number");
    }

    // Encrypt Aadhaar number before storing
    const encryptedAadhaar = await encryptionService.encrypt(aadhaarNumber);

    // Update booking to checked in
    return await prisma.booking.update({
      where: { id: bookingId },
      data: {
        isCheckedIn: true,
        aadhaarUsed: encryptedAadhaar,
      },
    });
  },

  getAllBookings: async (filters = {}) => {
    const { status, fromDate, toDate } = filters;

    const whereClause = {};

    if (status) whereClause.bookingStatus = status;

    if (fromDate || toDate) {
      whereClause.OR = [];

      if (fromDate && toDate) {
        whereClause.OR.push({
          AND: [
            { checkInDate: { gte: new Date(fromDate) } },
            { checkOutDate: { lte: new Date(toDate) } },
          ],
        });
      } else if (fromDate) {
        whereClause.checkInDate = { gte: new Date(fromDate) };
      } else if (toDate) {
        whereClause.checkOutDate = { lte: new Date(toDate) };
      }
    }

    return await prisma.booking.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        room: {
          include: {
            hotel: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};

module.exports = bookingService;
