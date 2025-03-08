// src/controllers/hotelController.js
const hotelService = require("../services/hotelService");

const hotelController = {
  getAllHotels: async (req, res, next) => {
    try {
      const filters = req.query;
      const hotels = await hotelService.getAllHotels(filters);

      res.status(200).json({
        success: true,
        count: hotels.length,
        data: hotels,
      });
    } catch (error) {
      next(error);
    }
  },

  getHotelById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const hotel = await hotelService.getHotelById(id);

      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: "Hotel not found",
        });
      }

      res.status(200).json({
        success: true,
        data: hotel,
      });
    } catch (error) {
      next(error);
    }
  },

  createHotel: async (req, res, next) => {
    try {
      const hotelData = req.body;
      const hotel = await hotelService.createHotel(hotelData);

      res.status(201).json({
        success: true,
        data: hotel,
      });
    } catch (error) {
      next(error);
    }
  },

  updateHotel: async (req, res, next) => {
    try {
      const { id } = req.params;
      const hotelData = req.body;

      const hotel = await hotelService.updateHotel(id, hotelData);

      res.status(200).json({
        success: true,
        data: hotel,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteHotel: async (req, res, next) => {
    try {
      const { id } = req.params;
      await hotelService.deleteHotel(id);

      res.status(200).json({
        success: true,
        message: "Hotel deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = hotelController;
