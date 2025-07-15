// src/logger.js

require("dotenv").config();
const axios = require("axios");
const getToken = require("./auth"); // Import the getToken function from auth.js

// Define the API endpoint for creating logs
const LOG_API_URL = "http://20.244.56.144/evaluation-service/log";

/**
 * A reusable function to send a log message to the evaluation server.
 * It automatically handles fetching the authentication token.
 *
 * @param {string} stack - The stack ("backend" or "frontend").
 * @param {string} level - The log level ("info", "warn", "error", etc.).
 * @param {string} pkg - The package where the log originates from (e.g., "handler", "db").
 * @param {string} message - The detailed log message.
 */
async function Log(stack, level, pkg, message) {
  try {
    // 1. Get the authentication token first
    const token = await getToken();

    // If we don't get a token, we can't send the log
    if (!token) {
      console.error("❌ Could not obtain auth token. Log will not be sent.");
      return;
    }

    // 2. Prepare the request body for the log API
    // Note: The API expects the field to be named "package", so we map 'pkg' to 'package'.
    const logData = {
      stack: stack,
      level: level,
      package: pkg,
      message: message,
    };

    // 3. Make the authenticated POST request to the logging API
    const response = await axios.post(LOG_API_URL, logData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    // Log the success response from the server for confirmation
    console.log("✅ Log sent successfully:", response.data);

  } catch (err) {
    // Log any errors that occur during the process
    console.error("❌ Error sending log:", err.response?.data || err.message);
  }
}

// Export the Log function to be used in other files
module.exports = { Log };