const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Log } = require('./logging-middleware/logger');

// Load environment variables from .env
dotenv.config({ path: './logging-middleware/.env' });

const app = express();
app.use(cors());
app.use(express.json());

// Example endpoint to demonstrate logging
app.post('/api/log', async (req, res) => {
  const { stack, level, pkg, message } = req.body;
  try {
    await Log(stack, level, pkg, message);
    res.status(200).json({ success: true, msg: 'Log sent successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});