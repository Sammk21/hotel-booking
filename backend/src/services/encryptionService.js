const CryptoJS = require("crypto-js");
const config = require("../config");
const crypto = require("crypto");


/**
 * Encrypt sensitive data
 * @param {String} text - Plain text to encrypt
 * @returns {String} Encrypted text
 */
const encrypt = (text) => {
  const key = CryptoJS.enc.Utf8.parse(config.encryption.key);
  const iv = CryptoJS.enc.Utf8.parse(config.encryption.iv);

  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};

/**
 * Decrypt encrypted data
 * @param {String} encryptedText - Encrypted text to decrypt
 * @returns {String} Decrypted plain text
 */
const decrypt = (encryptedText) => {
  const key = crypto.randomBytes(32).toString("hex");
  const iv = crypto.randomBytes(16).toString("hex");

  const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};

module.exports = {
  encrypt,
  decrypt,
};
