const axios = require("axios");

async function register() {
  try {
    const res = await axios.post("http://20.244.56.144/evaluation-service/register", {
    "email": "anshulr955@gmail.com",
    "name": "Anshul Rana",
    "mobileNo": "7830791437",
    "githubUsername": "Arsenal17x",
    "rollNo": "2294019",
    "accessCode": "QAhDUr"

    });

    console.log("✅ Registration successful:");
    console.log("Client ID:", res.data.clientID);
    console.log("Client Secret:", res.data.clientSecret);
  } catch (err) {
    console.error("❌ Already registered or error:", err.response?.data || err.message);
  }
}

register();
