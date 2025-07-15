
const axios = require("axios");

async function getToken() {
  try {
    const res = await axios.post("http://20.244.56.144/evaluation-service/auth", {
      // Use the REACT_APP_ prefixed variables
      email: process.env.REACT_APP_EMAIL,
      name: process.env.REACT_APP_NAME,
      rollNo: process.env.REACT_APP_ROLL_NO,
      accessCode: process.env.REACT_APP_ACCESS_CODE,
      clientID: process.env.REACT_APP_CLIENT_ID,
      clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    });
    return res.data.access_token;
  } catch (err) {
    // We cannot use the logger here, so we fallback to console for this critical error
    console.error("Auth failed:", err.response?.data || err.message);
  }
}

module.exports = getToken;