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
const PORT = process.env.PORT || 3000;

// Set the API keys from the environment variables
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const CLAIMBUSTER_API_KEY = process.env.CLAIMBUSTER_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


// --- IN-MEMORY DATABASE FOR USER QUESTIONS ---
let questions = [
  {
    id: 1,
    user: { name: 'Alex', avatar: 'https://github.com/shadcn.png' },
    question: 'How can I verify the source of a news article shared on social media?',
    answers: [
      { user: 'Dr. Emily Carter', text: 'Look for the original publisher. Reputable news organizations will have their own websites. Be wary of links that redirect you multiple times.' },
      { user: 'FactVerse Bot', text: 'You can use the "Validate Facts" feature on our platform to cross-reference the article with our trusted sources.' }
    ]
  },
  {
    id: 2,
    user: { name: 'Maria', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    question: 'What are the most common signs of a deepfake video?',
    answers: [
      { user: 'TechExpert22', text: 'Unnatural eye movements, strange lighting inconsistencies, and distorted audio are common red flags to look for.' },
    ]
  }
];


// --- API ROUTES ---

// API endpoint to fetch news
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
    console.error('Error fetching news from API:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// API endpoint for summarizing articles
app.post('/api/summarize', async (req, res) => {
  try {
    const { articleText } = req.body;
    if (!articleText || articleText.trim() === '') {
      return res.status(400).json({ error: 'Article text is required.' });
    }
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      { inputs: articleText },
      { headers: { "Authorization": `Bearer ${HUGGING_FACE_API_KEY}` } }
    );
    const summary = response.data[0].summary_text;
    res.json({ summary: summary });
  } catch (error) {
    console.error('Error summarizing article:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to summarize article' });
  }
});

// API endpoint for fact-checking
app.post('/api/validate-fact', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text to validate is required.' });
  }
  if (!CLAIMBUSTER_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: Missing API key.' });
  }

  try {
    const response = await axios.post(
      'https://idir.uta.edu/fact-checker/api/v2/score/text',
      { input_text: text },
      { headers: { 'x-api-key': CLAIMBUSTER_API_KEY } }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error calling ClaimBuster API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to validate the fact with the external service.' });
  }
});


// --- NEW: API ENDPOINTS FOR USER QUESTIONS ---

// GET all questions
app.get('/api/questions', (req, res) => {
  res.json(questions);
});

// POST a new question
app.post('/api/questions', (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string' || question.trim() === '') {
    return res.status(400).json({ error: 'Question text is required and must be a non-empty string.' });
  }

  const newQuestion = {
    id: questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1, // Safely generate a new ID
    user: { name: 'Anonymous', avatar: '' }, // In a real app, you'd get this from user authentication
    question: question.trim(),
    answers: []
  };

  questions.unshift(newQuestion); // Add the new question to the beginning of the array
  res.status(201).json(newQuestion);
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});