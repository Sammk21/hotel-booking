// src/services/hotelService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const hotelService = {
  getAllHotels: async (filters = {}) => {
    const { city, state, minPrice, maxPrice, search } = filters;

    const whereClause = {};

    if (city) whereClause.city = city;
    if (state) whereClause.state = state;

    if (minPrice || maxPrice) {
      whereClause.pricePerDay = {};
      if (minPrice) whereClause.pricePerDay.gte = parseFloat(minPrice);
      if (maxPrice) whereClause.pricePerDay.lte = parseFloat(maxPrice);
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }

    return await prisma.hotel.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { rooms: true },
        },
      },
      orderBy: {
        rating: "desc",
      },
    });
  },

  getHotelById: async (id) => {
    return await prisma.hotel.findUnique({
      where: { id },
      include: {
        rooms: {
          select: {
            id: true,
            roomNumber: true,
            roomType: true,
            capacity: true,
            pricePerDay: true,
            isAvailable: true,
          },
        },
      },
    });
  },

  createHotel: async (hotelData) => {
    return await prisma.hotel.create({
      data: hotelData,
    });
  },

  updateHotel: async (id, hotelData) => {
    return await prisma.hotel.update({
      where: { id },
      data: hotelData,
    });
  },

  deleteHotel: async (id) => {
    return await prisma.hotel.delete({
      where: { id },
    });
  },
};

module.exports = hotelService;
