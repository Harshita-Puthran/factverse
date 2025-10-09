// server.js

// Import required modules
const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
// FIX: Import the 'sentiment' library
const Sentiment = require('sentiment');


// Load environment variables from .env file
require('dotenv').config();

// NOTE: Starting with Node.js v18, the global 'fetch' API is available.
// The code relies on the native global fetch for making API requests.

const app = express();
const port = 3000;

// Set the API keys from the environment variables
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const CLAIMBUSTER_API_KEY = process.env.CLAIMBUSTER_API_KEY;
const GEMINI_API_KEY=process.env.GEMINI_API_KEY;

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

// ========= CORRECTED NEWS API ENDPOINT =========
app.get('/api/news', async (req, res) => {
    const { q, category, source } = req.query;
    const baseURL = 'https://newsapi.org/v2/';
    let endpoint = 'top-headlines';
    
    // Use the 'everything' endpoint if there's a search query
    if (q) {
        endpoint = 'everything';
    }

    // Initialize params with the required API key
    const params = new URLSearchParams({
        apiKey: NEWS_API_KEY,
    });

    // Add search query if it exists
    if (q) {
        params.append('q', q);
    } else {
        // For top-headlines, set default country
        params.append('country', 'us');
    }

    // IMPORTANT FIX: Prioritize 'source' over 'category'
    // NewsAPI does not allow mixing these two parameters.
    if (source && source !== 'All') {
        params.append('sources', source.toLowerCase().replace(/ /g, '-'));
    } else if (category && category !== 'All') {
        params.append('category', category.toLowerCase());
    }

    const finalUrl = `${baseURL}${endpoint}?${params.toString()}`;
    console.log(`Fetching news from: ${finalUrl}`); // For debugging

    try {
        const response = await axios.get(finalUrl);
        res.json(response.data);
    } catch (error) {
        // Improved error logging
        console.error('Error fetching news from API:', error.response ? error.response.data : error.message);
        const status = error.response ? error.response.status : 500;
        const message = error.response ? error.response.data.message : 'Failed to fetch news';
        res.status(status).json({ error: message });
    }
});
// ===============================================

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

// API endpoint for fake news detection (LOCAL VERSION - NO EXTERNAL API)
app.post('/api/detect-fake-news', async (req, res) => {
  try {
    const { articleText, title, source } = req.body;

    // Basic validation
    if (!articleText || articleText.trim() === '') {
      return res.status(400).json({ error: 'Article text is required for detection.' });
    }

    console.log('Analyzing article locally:', articleText.substring(0, 100) + '...');

    // Use our local fake news detection
    const detectionResult = await localFakeNewsDetection(articleText, title, source);
    
    // Send the detection result back to the frontend
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

  // 1. SENSATIONALISM DETECTION
  const sensationalWords = [
    'breaking', 'shocking', 'astonishing', 'unbelievable', 'incredible',
    'mind-blowing', 'earth-shattering', 'explosive', 'bombshell', 'secret',
    'hidden truth', 'they don\'t want you to know', 'mainstream media won\'t tell you'
  ];
  
  sensationalWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    const matches = text.match(regex) || titleLower.match(regex);
    if (matches) {
      fakeScore += matches.length * 2;
      factors.push(`Sensational language: "${word}"`);
    }
  });

  // 2. CONSPIRACY INDICATORS
  const conspiracyWords = [
    'conspiracy', 'cover-up', 'deep state', 'false flag', 'sheeple',
    'wake up', 'open your eyes', 'elite', 'cabal', 'agenda',
    'new world order', 'illuminati', 'george soros', 'rothschild'
  ];
  
  conspiracyWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    const matches = text.match(regex);
    if (matches) {
      fakeScore += matches.length * 3;
      factors.push(`Conspiracy terminology: "${word}"`);
    }
  });

  // 3. CREDIBILITY INDICATORS
  const crediblePhrases = [
    'according to the study', 'research shows', 'data indicates',
    'official report', 'peer-reviewed', 'scientific evidence',
    'multiple sources confirm', 'verified by', 'fact-check',
    'according to experts', 'clinical trial', 'statistical analysis'
  ];
  
  crediblePhrases.forEach(phrase => {
    const regex = new RegExp(phrase, 'gi');
    const matches = text.match(regex);
    if (matches) {
      realScore += matches.length * 3;
      factors.push(`Credible reference: "${phrase}"`);
    }
  });

  // 4. SENTIMENT ANALYSIS (WITH ERROR HANDLING)
  try {
    // FIX: Instantiate the Sentiment class
    const sentimentAnalysis = new Sentiment();
    const sentimentResult = sentimentAnalysis.analyze(articleText);
    
    // Extreme emotional language often indicates fake news
    if (Math.abs(sentimentResult.score) > 10) {
      fakeScore += 2;
      factors.push('Extreme emotional language detected');
    }
  } catch (sentimentError) {
    console.log('Sentiment analysis skipped:', sentimentError.message);
    // Continue without sentiment analysis
  }

  // 5. TEXT STRUCTURE ANALYSIS
  const sentences = articleText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = articleText.length / (sentences.length || 1);
  
  if (avgSentenceLength < 20 || avgSentenceLength > 100) {
    fakeScore += 1;
    factors.push('Unusual sentence structure');
  }

  // 6. CAPITALIZATION ANALYSIS
  const capsRatio = (articleText.match(/[A-Z]/g) || []).length / articleText.length;
  if (capsRatio > 0.3) {
    fakeScore += 2;
    factors.push('Excessive capitalization');
  }

  // 7. SOURCE CREDIBILITY
  const credibleSources = ['reuters', 'associated press', 'bbc', 'cnn', 'npr', 'the guardian'];
  const questionableSources = ['infowars', 'natural news', 'before it\'s news', 'world truth'];
  
  if (source) {
    const sourceLower = source.toLowerCase();
    if (credibleSources.some(s => sourceLower.includes(s))) {
      realScore += 3;
      factors.push(`Credible source: ${source}`);
    }
    if (questionableSources.some(s => sourceLower.includes(s))) {
      fakeScore += 3;
      factors.push(`Questionable source: ${source}`);
    }
  }

  // 8. EVIDENCE INDICATORS
  const evidencePhrases = [
    'according to data', 'statistics show', 'study found', 'research indicates',
    'clinical trial', 'scientific evidence', 'peer-reviewed'
  ];
  
  evidencePhrases.forEach(phrase => {
    if (text.includes(phrase)) {
      realScore += 2;
      factors.push(`Evidence-based language: "${phrase}"`);
    }
  });

  // 9. URGENCY AND FEAR MONGERING
  const urgencyWords = [
    'urgent', 'immediately', 'act now', 'warning', 'alert',
    'danger', 'crisis', 'emergency', 'last chance', 'don\'t miss'
  ];
  
  urgencyWords.forEach(word => {
    if (text.includes(word)) {
      fakeScore += 2;
      factors.push(`Urgency/fear language: "${word}"`);
    }
  });

  // CALCULATE FINAL SCORE
  const totalScore = fakeScore + realScore;
  const isFake = fakeScore > realScore;
  const confidence = totalScore > 0 ? 
    Math.min(Math.round(Math.abs(fakeScore - realScore) / totalScore * 100), 95) : 
    50;

  // GENERATE EXPLANATION
  let explanation;
  if (isFake) {
    if (confidence > 75) {
      explanation = `High likelihood of misinformation (${confidence}% confidence). Multiple suspicious patterns detected.`;
    } else if (confidence > 55) {
      explanation = `Moderate likelihood of misinformation (${confidence}% confidence). Several concerning indicators found.`;
    } else {
      explanation = `Some suspicious elements detected (${confidence}% confidence). Verify with reliable sources.`;
    }
  } else {
    if (confidence > 75) {
      explanation = `High likelihood of credible content (${confidence}% confidence). Shows characteristics of reliable information.`;
    } else if (confidence > 55) {
      explanation = `Appears to be credible content (${confidence}% confidence). Mostly reliable indicators found.`;
    } else {
      explanation = `Mixed signals detected (${confidence}% confidence). Additional verification recommended.`;
    }
  }

  return {
    isFake: isFake,
    confidence: confidence,
    explanation: explanation,
    details: {
      fakeScore: fakeScore,
      realScore: realScore,
      factors: factors.slice(0, 5),
      analysisMethod: "Multi-factor Local Analysis",
      totalFactorsAnalyzed: factors.length
    }
  };
}

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


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});