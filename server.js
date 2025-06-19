const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Import the API handler
const summarizeHandler = require('./api/summarize.js');

// API endpoints
app.post('/api/summarize', (req, res) => {
  summarizeHandler.default(req, res);
});

app.post('/api/summarize-multiple', (req, res) => {
  summarizeHandler.handleMultipleUrls(req, res);
});

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📝 AI Wikipedia Summarizer is ready!`);
});
