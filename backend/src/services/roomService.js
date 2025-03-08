// src/services/roomService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const roomService = {
  getRoomsByHotelId: async (hotelId) => {
    return await prisma.room.findMany({
      where: { hotelId },
    });
  },

  getRoomById: async (id) => {
    return await prisma.room.findUnique({
      where: { id },
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  getAvailableRooms: async (hotelId, checkInDate, checkOutDate) => {
    // Convert string dates to Date objects
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Get all rooms for the hotel
    const rooms = await prisma.room.findMany({
      where: { hotelId },
      include: {
        bookings: {
          where: {
            AND: [
              {
                OR: [
                  {
                    AND: [
                      { checkInDate: { lte: checkIn } },
                      { checkOutDate: { gte: checkIn } },
                    ],
                  },
                  {
                    AND: [
                      { checkInDate: { lte: checkOut } },
                      { checkOutDate: { gte: checkOut } },
                    ],
                  },
                  {
                    AND: [
                      { checkInDate: { gte: checkIn } },
                      { checkOutDate: { lte: checkOut } },
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

    // Filter out rooms that have bookings in the specified date range
    return rooms.filter(
      (room) => room.bookings.length === 0 && room.isAvailable
    );
  },

  createRoom: async (roomData) => {
    return await prisma.room.create({
      data: roomData,
    });
  },

  updateRoom: async (id, roomData) => {
    return await prisma.room.update({
      where: { id },
      data: roomData,
    });
  },

  deleteRoom: async (id) => {
    return await prisma.room.delete({
      where: { id },
    });
  },
};

module.exports = roomService;
