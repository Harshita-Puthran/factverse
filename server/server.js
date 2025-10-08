<<<<<<< HEAD
// server.js - FactVerse Q&A Backend using Google Gemini API
=======
// server.js

// Import required modules
const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
>>>>>>> e5e9a1584d985e8ba229bbe88a7acf3b65f52964

// Load environment variables from .env file
require('dotenv').config();

// Standard Node.js modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// NOTE: Starting with Node.js v18, the global 'fetch' API is available.
// The code relies on the native global fetch for making API requests.

const app = express();
const port = 3000;

<<<<<<< HEAD
// Middleware setup
app.use(bodyParser.json());
// Allow requests from all origins for local development (adjust for production)
app.use(cors()); 

// --- Configuration ---
// Ensure this variable name matches what you set in your .env file
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 
=======
// Set the API keys from the environment variables
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const CLAIMBUSTER_API_KEY = process.env.CLAIMBUSTER_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());
>>>>>>> e5e9a1584d985e8ba229bbe88a7acf3b65f52964

if (!GEMINI_API_KEY) {
    console.error("FATAL ERROR: GEMINI_API_KEY is not set in the .env file. Please check factverse.env or .env.");
    // Exit gracefully if the key is missing
}

<<<<<<< HEAD
const GEMINI_MODEL = 'gemini-2.5-flash-preview-05-20'; // Fast model optimized for grounded Q&A

/**
 * Executes the generation request to the Gemini API with Google Search grounding and exponential backoff.
 * @param {string} userQuery The question from the user.
 * @returns {Promise<{text: string, sources: Array<{uri: string, title: string}>}>} The generated answer and sources.
 */
async function getGroundedAnswer(userQuery) {
    // 1. Define the system instruction for the AI's persona and output format
    const systemPrompt = "You are FactVerse, a world-class, grounded Q&A assistant. Answer the user's question concisely and accurately based ONLY on the information you can find using the provided tools. If you use search results, you MUST return the answer followed by a line break and the full citations.";

    // 2. Define the payload for the generateContent API call
    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        
        // Use Google Search as a grounding tool to get up-to-date information
        tools: [{ "google_search": {} }],
        
        // Apply the system instruction
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
    };

    // 3. Implement exponential backoff for the API call
    const maxRetries = 5;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            // Attempt the API call using the standard global fetch API (available in modern Node.js)
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // Check if response is okay (200-299 status)
            if (response.ok) {
                const result = await response.json();
                const candidate = result.candidates?.[0];

                if (candidate && candidate.content?.parts?.[0]?.text) {
                    const text = candidate.content.parts[0].text;
                    let sources = [];
                    const groundingMetadata = candidate.groundingMetadata;

                    if (groundingMetadata && groundingMetadata.groundingAttributions) {
                        sources = groundingMetadata.groundingAttributions
                            .map(attribution => ({
                                uri: attribution.web?.uri,
                                title: attribution.web?.title,
                            }))
                            .filter(source => source.uri && source.title); // Filter out sources without valid URI/title
                    }

                    return { text, sources };
                } else {
                    // Log the detailed error from the Gemini API if content is missing
                    console.error('Gemini API response missing content or candidate:', JSON.stringify(result, null, 2));
                    throw new Error('Could not extract valid text from AI response.');
                }
            } else if (response.status === 429 && attempt < maxRetries - 1) {
                // Handle Rate Limit (429) error with exponential backoff
                const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s, 8s, 16s
                console.warn(`Rate limit exceeded (429). Retrying in ${delay / 1000}s...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                // Handle other HTTP errors (e.g., 400 Bad Request, 500 Server Error)
                const errorBody = await response.text();
                console.error(`Gemini API HTTP Error ${response.status}: ${errorBody}`);
                throw new Error(`API call failed with status ${response.status}`);
            }
        } catch (error) {
            if (attempt === maxRetries - 1) {
                console.error('Final attempt failed. Error answering question with Gemini:', error.message);
                throw new Error('The AI service could not be reached after multiple attempts.');
            }
            console.error(`Attempt ${attempt + 1} failed: ${error.message}. Retrying...`);
        }
    }
    throw new Error('Failed to get a response from the Gemini API after all retries.');
}

// --- API Route ---
app.post('/ask', async (req, res) => {
    const { question } = req.body;

    if (!question || typeof question !== 'string' || question.trim() === '') {
        return res.status(400).json({ error: 'Question is required.' });
    }

    if (!GEMINI_API_KEY) {
        return res.status(503).json({ error: 'AI Service is unavailable. API Key is missing. Please check your .env file.' });
    }

    console.log(`Received question: "${question}"`);

    try {
        // Use the grounded function to get the answer and sources
        const { text, sources } = await getGroundedAnswer(question);

        // Send the structured response back to the client
        res.json({
            answer: text,
            sources: sources
        });

    } catch (error) {
        // Send a generic error message back to the client
        res.status(500).json({ 
            error: error.message || 'An unexpected error occurred while processing your request.' 
        });
    }
=======

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
>>>>>>> e5e9a1584d985e8ba229bbe88a7acf3b65f52964
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
    const sentimentAnalysis = new sentiment();
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


<<<<<<< HEAD
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
=======
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
>>>>>>> e5e9a1584d985e8ba229bbe88a7acf3b65f52964
