// src/controllers/roomController.js
const roomService = require("../services/roomService");

const roomController = {
  getRoomsByHotelId: async (req, res, next) => {
    try {
      const { hotelId } = req.params;
      const rooms = await roomService.getRoomsByHotelId(hotelId);

      res.status(200).json({
        success: true,
        count: rooms.length,
        data: rooms,
      });
    } catch (error) {
      next(error);
    }
  },

  getRoomById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const room = await roomService.getRoomById(id);

      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found",
        });
      }

      res.status(200).json({
        success: true,
        data: room,
      });
    } catch (error) {
      next(error);
    }
  },

  getAvailableRooms: async (req, res, next) => {
    try {
      const { hotelId } = req.params;
      const { checkInDate, checkOutDate } = req.query;

      if (!checkInDate || !checkOutDate) {
        return res.status(400).json({
          success: false,
          message: "Please provide check-in and check-out dates",
        });
      }

      const availableRooms = await roomService.getAvailableRooms(
        hotelId,
        checkInDate,
        checkOutDate
      );

      res.status(200).json({
        success: true,
        count: availableRooms.length,
        data: availableRooms,
      });
    } catch (error) {
      next(error);
    }
  },

  createRoom: async (req, res, next) => {
    try {
      const { hotelId } = req.params;
      const roomData = { ...req.body, hotelId };

      const room = await roomService.createRoom(roomData);

      res.status(201).json({
        success: true,
        data: room,
      });
    } catch (error) {
      next(error);
    }
  },

  updateRoom: async (req, res, next) => {
    try {
      const { id } = req.params;
      const roomData = req.body;

      const room = await roomService.updateRoom(id, roomData);

      res.status(200).json({
        success: true,
        data: room,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteRoom: async (req, res, next) => {
    try {
      const { id } = req.params;
      await roomService.deleteRoom(id);

      res.status(200).json({
        success: true,
        message: "Room deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = roomController;
