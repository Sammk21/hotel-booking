// src/middleware/adminMiddleware.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const adminMiddleware = async (req, res, next) => {
  try {
    // User is already authenticated via authMiddleware
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access required",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = adminMiddleware;
