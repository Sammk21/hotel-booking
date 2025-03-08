// src/utils/dateUtils.js
const dateUtils = {
  /**
   * Calculate the number of days between two dates
   * @param {Date|string} startDate - Start date
   * @param {Date|string} endDate - End date
   * @returns {number} - Number of days
   */
  calculateDays: (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Return difference in days
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  /**
   * Check if a date is between two other dates
   * @param {Date|string} date - Date to check
   * @param {Date|string} startDate - Start date
   * @param {Date|string} endDate - End date
   * @returns {boolean} - True if date is between startDate and endDate
   */
  isDateBetween: (date, startDate, endDate) => {
    const checkDate = new Date(date);
    const start = new Date(startDate);
    const end = new Date(endDate);

    return checkDate >= start && checkDate <= end;
  },

  /**
   * Format date to YYYY-MM-DD
   * @param {Date|string} date - Date to format
   * @returns {string} - Formatted date string
   */
  formatDate: (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  },

  /**
   * Check if two date ranges overlap
   * @param {Date|string} range1Start - Start of first range
   * @param {Date|string} range1End - End of first range
   * @param {Date|string} range2Start - Start of second range
   * @param {Date|string} range2End - End of second range
   * @returns {boolean} - True if ranges overlap
   */
  doDateRangesOverlap: (range1Start, range1End, range2Start, range2End) => {
    const start1 = new Date(range1Start);
    const end1 = new Date(range1End);
    const start2 = new Date(range2Start);
    const end2 = new Date(range2End);

    return start1 <= end2 && start2 <= end1;
  },
};

module.exports = dateUtils;
