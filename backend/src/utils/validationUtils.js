/**
 * Validate email format
 * @param {String} email - Email to validate
 * @returns {Boolean} Whether email is valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Aadhaar number format (12 digit number)
 * @param {String} aadhaarNumber - Aadhaar number to validate
 * @returns {Boolean} Whether Aadhaar number is valid
 */
const isValidAadhaar = (aadhaarNumber) => {
  const aadhaarRegex = /^\d{12}$/;
  return aadhaarRegex.test(aadhaarNumber);
};

/**
 * Validate password strength
 * @param {String} password - Password to validate
 * @returns {Boolean} Whether password is valid
 */
const isValidPassword = (password) => {
  // Minimum 8 characters, at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};

module.exports = {
  isValidEmail,
  isValidAadhaar,
  isValidPassword,
};
