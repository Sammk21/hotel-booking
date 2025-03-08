const bcrypt = require("bcrypt");
const prisma = require("../models");
const jwtUtils = require("../utils/jwtUtils");
const { isValidEmail, isValidPassword } = require("../utils/validationUtils");

/**
 * Register a new user
 * @param {String} email - User email
 * @param {String} password - User password
 * @returns {Object} User data and token
 */
const register = async (email, password) => {
  // Validate input
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");
  }

  if (!isValidPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters with at least one letter and one number"
    );
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  // Generate token
  const token = jwtUtils.generateToken({
    id: user.id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    },
    token,
  };
};

/**
 * Login user
 * @param {String} email - User email
 * @param {String} password - User password
 * @returns {Object} User data and token
 */
const login = async (email, password) => {
  // Validate input
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  // Generate token
  const token = jwtUtils.generateToken({
    id: user.id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    },
    token,
  };
};

module.exports = {
  register,
  login,
};
