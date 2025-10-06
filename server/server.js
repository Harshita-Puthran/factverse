// server.js

// Import required modules
const express = require('express');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set the API keys from the environment variables
const NEWS_API_KEY = process.env.NEWS_API_KEY;
// Use the new Hugging Face API key from the .env file
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY_NEW; 

// Middleware to parse JSON bodies from incoming requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// --- API ROUTES ---

// API endpoint for validating facts
app.post('/api/validate', async (req, res) => {
  try {
    const { claim } = req.body;

    if (!claim || claim.trim() === '') {
      return res.status(400).json({ error: 'Claim text is required.' });
    }

    const prompt = `
      Analyze the following claim for factual accuracy. Provide a brief analysis and conclude with a rating: "True", "False", "Misleading", or "Uncertain".
      Claim: "${claim}"
      Analysis:
    `;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/gemma-7b-it",
      {
        inputs: prompt,
        parameters: { max_new_tokens: 150 }
      },
      {
        headers: { "Authorization": `Bearer ${HUGGING_FACE_API_KEY}` }
      }
    );
    
    const fullText = response.data[0].generated_text;
    const analysis = fullText.replace(prompt, '').trim();

    res.json({ analysis: analysis });

  } catch (error) {
    console.error('Error validating fact with Hugging Face:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to get validation from the AI.' });
  }
});


// API endpoint for answering user questions
app.post('/api/answer-question', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({ error: 'Question text is required.' });
    }

    const prompt = `
      Answer the following question clearly and concisely.
      Question: "${question}"
      Answer:
    `;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/gemma-7b-it",
      {
        inputs: prompt,
        parameters: { max_new_tokens: 250 }
      },
      {
        headers: { "Authorization": `Bearer ${HUGGING_FACE_API_KEY}` }
      }
    );

    const fullText = response.data[0].generated_text;
    const answer = fullText.replace(prompt, '').trim();

    res.json({ answer: answer });

  } catch (error) {
    console.error('Error answering question with Hugging Face:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to get an answer from the AI.' });
  }
});


// API endpoint for fetching news
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
      {
        headers: { "Authorization": `Bearer ${HUGGING_FACE_API_KEY}` }
      }
    );
    
    const summary = response.data[0].summary_text;
    res.json({ summary: summary });

  } catch (error) {
    console.error('Error summarizing article:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to summarize article' });
  }
});

// API endpoint for fetching questions from Stack Exchange
app.get('/api/questions', async (req, res) => {
  const site = req.query.site || 'skeptics';
  const url = `https://api.stackexchange.com/2.3/questions?order=desc&sort=activity&site=${site}`;

  try {
    const response = await axios.get(url, {
      headers: { 'Accept-Encoding': 'gzip,deflate,compress' }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching from Stack Exchange API:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

