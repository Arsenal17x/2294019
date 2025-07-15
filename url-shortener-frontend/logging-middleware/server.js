const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Log } = require('./logger'); // Corrected import

// Load environment variables from .env
dotenv.config({ path: './.env' });

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

// --- ADD THIS: URL Shortener Endpoint ---
let urlStore = {}; // In-memory store for demo

app.post('/api/shorten', (req, res) => {
  const { longUrl, shortCode, validity } = req.body;
  if (!longUrl) {
    return res.status(400).json({ message: 'longUrl is required.' });
  }
  // Use custom code or generate one
  const code = shortCode || Math.random().toString(36).substring(2, 8);
  const shortUrl = `http://localhost:5000/${code}`;
  const expiresAt = new Date(Date.now() + (validity ? validity * 60000 : 24 * 60 * 60000)); // default 1 day

  urlStore[code] = { originalUrl: longUrl, shortUrl, expiresAt };

  res.json({ originalUrl: longUrl, shortUrl, expiresAt });
});

// --- ADD THIS: Redirect Endpoint ---
app.get('/:code', (req, res) => {
  const { code } = req.params;
  const entry = urlStore[code];
  if (!entry) {
    return res.status(404).json({ message: 'Short URL not found.' });
  }
  if (new Date() > new Date(entry.expiresAt)) {
    return res.status(410).json({ message: 'Short URL expired.' });
  }
  res.redirect(entry.originalUrl);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});