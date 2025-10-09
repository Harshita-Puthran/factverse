// server.js

// Import required modules
const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const Sentiment = require('sentiment');

// Load environment variables from .env file
require('dotenv').config();

const app = express();
const port = 3000;

// Set the API keys from the environment variables
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const CLAIMBUSTER_API_KEY = process.env.CLAIMBUSTER_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

if (!GEMINI_API_KEY) {
    console.error("FATAL ERROR: GEMINI_API_KEY is not set in the .env file. Please check factverse.env or .env.");
    process.exit(1);
}

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

// API endpoint to fetch news - UPDATED to augment data
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
    const originalArticles = response.data.articles || [];

    // Augment articles with credibility, verified, and trending status
    const augmentedArticles = originalArticles.map(article => ({
      ...article,
      credibilityScore: Math.floor(Math.random() * (98 - 65 + 1) + 65), // Random score between 65-98
      verified: Math.random() > 0.3, // 70% chance of being "verified"
      trending: Math.random() > 0.7, // 30% chance of being "trending"
    }));

    res.json({ ...response.data, articles: augmentedArticles });

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

// API endpoint for fake news detection (LOCAL VERSION)
app.post('/api/detect-fake-news', async (req, res) => {
  try {
    const { articleText, title, source } = req.body;

    if (!articleText || articleText.trim() === '') {
      return res.status(400).json({ error: 'Article text is required for detection.' });
    }

    console.log('Analyzing article locally:', articleText.substring(0, 100) + '...');
    const detectionResult = await localFakeNewsDetection(articleText, title, source);
    res.json(detectionResult);

  } catch (error) {
    console.error('Error detecting fake news:', error);
    res.status(500).json({ error: 'Failed to analyze article: ' + error.message });
  }
});

async function localFakeNewsDetection(articleText, title = '', source = '') {
  const text = articleText.toLowerCase();
  const titleLower = title.toLowerCase();
  
  let fakeScore = 0;
  let realScore = 0;
  const factors = [];

  const sensationalWords = ['breaking', 'shocking', 'unbelievable', 'secret', 'hidden truth'];
  sensationalWords.forEach(word => {
    if (text.includes(word) || titleLower.includes(word)) {
      fakeScore += 2;
      factors.push(`Sensational language: "${word}"`);
    }
  });

  const conspiracyWords = ['conspiracy', 'cover-up', 'deep state', 'false flag', 'agenda'];
  conspiracyWords.forEach(word => {
    if (text.includes(word)) {
      fakeScore += 3;
      factors.push(`Conspiracy terminology: "${word}"`);
    }
  });

  const crediblePhrases = ['according to the study', 'research shows', 'peer-reviewed', 'verified by'];
  crediblePhrases.forEach(phrase => {
    if (text.includes(phrase)) {
      realScore += 3;
      factors.push(`Credible reference: "${phrase}"`);
    }
  });

  try {
    const sentiment = new Sentiment();
    const sentimentResult = sentiment.analyze(articleText);
    if (Math.abs(sentimentResult.score) > 10) {
      fakeScore += 2;
      factors.push('Extreme emotional language detected');
    }
  } catch (sentimentError) {
    console.log('Sentiment analysis skipped:', sentimentError.message);
  }

  const totalScore = fakeScore + realScore;
  const isFake = fakeScore > realScore;
  const confidence = totalScore > 0 ? Math.min(Math.round(Math.abs(fakeScore - realScore) / totalScore * 100), 95) : 50;

  let explanation = isFake
    ? `High likelihood of misinformation (${confidence}% confidence). Multiple suspicious patterns detected.`
    : `Likely credible content (${confidence}% confidence). Shows characteristics of reliable information.`;

  return {
    isFake,
    confidence,
    explanation,
    details: {
      factors: factors.slice(0, 5),
    }
  };
}

// --- USER QUESTIONS API ---
app.get('/api/questions', (req, res) => {
  res.json(questions);
});

app.post('/api/questions', (req, res) => {
  const { question } = req.body;
  if (!question || typeof question !== 'string' || question.trim() === '') {
    return res.status(400).json({ error: 'Question text is required.' });
  }
  const newQuestion = {
    id: questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1,
    user: { name: 'You', avatar: '' },
    question: question.trim(),
    answers: []
  };
  questions.unshift(newQuestion);
  res.status(201).json(newQuestion);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

