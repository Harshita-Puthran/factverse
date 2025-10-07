// server.js

// Import required modules
const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // The server will run on port 3000

// Set the API keys from the environment variables
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const CLAIMBUSTER_API_KEY = process.env.CLAIMBUSTER_API_KEY;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON bodies from incoming requests
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// --- API endpoint to fetch news ---
app.get('/api/news', async (req, res) => {
  const { q, category, source } = req.query;
  let url;

  if (q) {
    url = `https://newsapi.org/v2/everything?q=${q}&apiKey=${NEWS_API_KEY}`;
  } else {
    url = `https://newsapi.org/v2/top-headlines?apiKey=${NEWS_API_KEY}&language=en`;
    if (category && category !== 'All') {
      url += `&category=${category.toLowerCase()}`;
    }
    if (source && source !== 'All') {
      url += `&sources=${source.toLowerCase().replace(/ /g, '-')}`;
    }
  }

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news from API:', error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// --- API endpoint for summarizing articles ---
app.post('/api/summarize', async (req, res) => {
  try {
    const { articleText } = req.body;

    if (!articleText || articleText.trim() === '') {
      return res.status(400).json({ error: 'Article text is required.' });
    }

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      { inputs: articleText },
      {
        headers: { "Authorization": `Bearer ${HUGGING_FACE_API_KEY}` }
      }
    );
    
    const summary = response.data[0].summary_text;
    res.json({ summary });

  } catch (error) {
    console.error('Error summarizing article:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to summarize article' });
  }
});

// --- API endpoint for validating facts ---
app.post('/api/validate-fact', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text to validate is required.' });
  }

  try {
    const response = await axios.post(
      'https://idir.uta.edu/claimbuster/api/v2/score/text',
      { input_text: text },
      { headers: { 'x-api-key': CLAIMBUSTER_API_KEY } }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error calling ClaimBuster API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to validate the fact.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
