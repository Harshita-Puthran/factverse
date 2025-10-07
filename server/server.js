// server.js

// Import required modules
const express = require('express');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables from .env file
// NOTE: This line loads the environment variables (including OPENAI_API_KEY)
// from your local .env file when the server starts.
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set the API keys from the environment variables
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// API key for OpenAI (read from .env)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; 

// Base URL and Model for OpenAI Chat Completions API
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = "gpt-4o-mini"; 

// Middleware to parse JSON bodies from incoming requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

/**
 * Helper function for making requests to the OpenAI Chat Completions API.
 * @param {string} prompt - The main user query/text.
 * @param {number} maxTokens - The maximum number of tokens for the AI response.
 * @param {string} [systemInstruction=null] - Optional system instruction to guide the AI's persona/behavior.
 * @returns {Promise<string>} The generated text content.
 */
async function makeOpenAIRequest(prompt, maxTokens, systemInstruction = null) {
  // Check if API key is present before attempting the request
  if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured in the environment.");
  }

  const messages = [];

  if (systemInstruction) {
    messages.push({ role: "system", content: systemInstruction });
  }
  
  messages.push({ role: "user", content: prompt });

  const response = await axios.post(
    OPENAI_API_URL,
    {
      model: OPENAI_MODEL,
      messages: messages,
      max_tokens: maxTokens,
      temperature: 0.2 // Keep responses factual
    },
    {
      headers: { 
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  // Extract the generated text from the OpenAI response structure
  return response.data.choices[0].message.content.trim();
}

// --- API ROUTES ---

// API endpoint for validating facts (now using OpenAI)
app.post('/api/validate', async (req, res) => {
  try {
    const { claim } = req.body;

    if (!claim || claim.trim() === '') {
      return res.status(400).json({ error: 'Claim text is required.' });
    }

    const systemPrompt = `You are a fact-checker. Analyze the user's claim for factual accuracy. Provide a concise analysis (under 100 words) and conclude with a rating on a new line: "Rating: True", "Rating: False", "Rating: Misleading", or "Rating: Uncertain".`;
    const userPrompt = `Claim: "${claim}"`;

    const analysis = await makeOpenAIRequest(userPrompt, 200, systemPrompt);

    res.json({ analysis: analysis });

  } catch (error) {
    console.error('Error validating fact with OpenAI:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to get validation from the AI. Check your API key and billing.' });
  }
});


// API endpoint for answering user questions (now using OpenAI)
app.post('/api/answer-question', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({ error: 'Question text is required.' });
    }

    const systemPrompt = `You are a helpful and knowledgeable assistant. Answer the following question clearly and concisely.`;
    const userPrompt = `Question: "${question}"`;

    const answer = await makeOpenAIRequest(userPrompt, 300, systemPrompt);

    res.json({ answer: answer });

  } catch (error) {
    console.error('Error answering question with OpenAI:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to get an answer from the AI. Check your API key and billing.' });
  }
});


// API endpoint for fetching news (Original code, unchanged)
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

// API endpoint for summarizing articles (now using OpenAI)
app.post('/api/summarize', async (req, res) => {
  try {
    const { articleText } = req.body;

    if (!articleText || articleText.trim() === '') {
      return res.status(400).json({ error: 'Article text is required.' });
    }
    
    // Prompt the chat model to act as a summarizer
    const systemPrompt = `Summarize the following article text in three to four concise sentences.`;
    const userPrompt = articleText;

    const summary = await makeOpenAIRequest(userPrompt, 150, systemPrompt);

    res.json({ summary: summary });

  } catch (error) {
    console.error('Error summarizing article with OpenAI:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to summarize article. Check your API key and billing.' });
  }
});

// API endpoint for fetching questions from Stack Exchange (Original code, unchanged)
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
