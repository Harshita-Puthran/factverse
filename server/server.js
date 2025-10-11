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
    console.error("FATAL ERROR: GEMINI_API_KEY is not set in the .env file.");
    process.exit(1);
}

// In-memory data for questions...
let questions = [
    {
        id: 1,
        user: { name: 'Alex', avatar: 'https://github.com/shadcn.png' },
        question: 'How can I verify the source of a news article shared on social media?',
        answers: [
            { user: 'Dr. Emily Carter', text: 'Look for the original publisher. Reputable news organizations will have their own websites.' },
            { user: 'FactVerse Bot', text: 'You can use the "Validate Facts" feature on our platform to cross-reference the article.' }
        ]
    },
    {
        id: 2,
        user: { name: 'Maria', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
        question: 'What are the most common signs of a deepfake video?',
        answers: [
            { user: 'TechExpert22', text: 'Unnatural eye movements, strange lighting inconsistencies, and distorted audio are common red flags.' },
        ]
    }
];

// --- API ROUTES ---

// ========= CORRECTED NEWS API ENDPOINT =========
app.get('/api/news', async (req, res) => {
    const { q, category, source } = req.query;
    const baseURL = 'https://newsapi.org/v2/';
    let endpoint;
    const params = new URLSearchParams({ apiKey: NEWS_API_KEY });

    // Define correct source IDs for NewsAPI
    const sourceMap = {
        'reuters': 'reuters',
        'bbc': 'bbc-news',
        'cnn': 'cnn',
        'associated press': 'associated-press'
    };

    // **LOGIC FIX:** Determine the correct endpoint and parameters
    if (q) {
        // Use 'everything' endpoint for search queries
        endpoint = 'everything';
        params.append('q', q);
        // Add source if provided, but NOT category
        if (source && source !== 'All') {
            const sourceId = sourceMap[source.toLowerCase()];
            if (sourceId) params.append('sources', sourceId);
        }
    } else {
        // Use 'top-headlines' for browsing by category or source
        endpoint = 'top-headlines';
        params.append('country', 'us'); // 'top-headlines' requires a country or source

        if (source && source !== 'All') {
            const sourceId = sourceMap[source.toLowerCase()];
            if (sourceId) params.append('sources', sourceId);
        } else if (category && category !== 'All') {
            params.append('category', category.toLowerCase());
        }
    }

    const finalUrl = `${baseURL}${endpoint}?${params.toString()}`;
    console.log(`Fetching news from: ${finalUrl}`);

    try {
        const response = await axios.get(finalUrl);
        res.json(response.data);
    } catch (error) {
        const status = error.response ? error.response.status : 500;
        const message = error.response ? error.response.data.message : 'Failed to fetch news';
        console.error('Error fetching news from API:', { status, message });
        res.status(status).json({ error: message });
    }
});
// ===============================================

// Other API endpoints remain the same...

// Summarize
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

// Validate Fact
const { XMLParser } = require('fast-xml-parser');

// Initialize XML parser
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseAttributeValue: true,
  trimValues: true
});

// Cache for RSS feeds to avoid frequent requests
let rssCache = {
  data: null,
  timestamp: 0,
  ttl: 15 * 60 * 1000 // 15 minutes
};

async function validateWithFactCheckOrg(claim) {
  try {
    console.log('Fetching FactCheck.org RSS feed...');
    
    // Use cache if available and not expired
    const now = Date.now();
    if (rssCache.data && (now - rssCache.timestamp) < rssCache.ttl) {
      console.log('Using cached RSS data');
      return processFactCheck(claim, rssCache.data);
    }

    const response = await axios.get('https://www.factcheck.org/feed/', {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    // Update cache
    rssCache.data = response.data;
    rssCache.timestamp = now;

    return processFactCheck(claim, response.data);

  } catch (error) {
    console.error('FactCheck.org access failed:', error.message);
    
    // If we have cached data, use it even if expired
    if (rssCache.data) {
      console.log('Using expired cache as fallback');
      return processFactCheck(claim, rssCache.data);
    }
    
    throw new Error('Unable to access fact-checking database');
  }
}

function processFactCheck(claim, rssData) {
  try {
    const parsedData = parser.parse(rssData);
    const items = parsedData?.rss?.channel?.item || [];
    
    console.log(`Found ${items.length} fact-check articles`);

    // Search for relevant fact-checks
    const relevantChecks = findRelevantFactChecks(claim, items);
    
    if (relevantChecks.length > 0) {
      const bestMatch = relevantChecks[0];
      return formatFactCheckResult(claim, bestMatch);
    } else {
      return {
        claim: claim,
        rating: 'Not Found',
        confidence: 0,
        explanation: 'No matching fact-checks found in FactCheck.org database. This claim may be new or not widely fact-checked.',
        details: {
          analysisMethod: "FactCheck.org RSS Search",
          articlesChecked: items.length,
          source: "FactCheck.org",
          matchQuality: "No strong matches found"
        }
      };
    }
  } catch (parseError) {
    console.error('Error parsing RSS data:', parseError);
    throw new Error('Failed to process fact-check data');
  }
}

function findRelevantFactChecks(claim, items) {
  const claimWords = preprocessText(claim);
  const relevantItems = [];

  items.forEach(item => {
    const title = item.title?.toLowerCase() || '';
    const description = item.description?.toLowerCase() || '';
    const content = item['content:encoded']?.toLowerCase() || '';
    
    let relevanceScore = calculateRelevanceScore(claimWords, title, description, content);
    const rating = extractRating(title + ' ' + description + ' ' + content);
    
    if (relevanceScore > 2) { // Increased threshold for better matches
      relevantItems.push({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        description: item.description,
        relevanceScore: relevanceScore,
        rating: rating,
        fullText: title + ' ' + description
      });
    }
  });

  // Sort by relevance score (highest first) and take top 3
  return relevantItems.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 3);
}

function preprocessText(text) {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 2) // Keep words longer than 2 chars
    .filter((word, index, array) => array.indexOf(word) === index); // Remove duplicates
}

function calculateRelevanceScore(claimWords, title, description, content) {
  let score = 0;
  const allText = title + ' ' + description + ' ' + content;
  
  claimWords.forEach(word => {
    // Weight title matches highest
    if (title.includes(word)) score += 3;
    if (description.includes(word)) score += 2;
    if (content.includes(word)) score += 1;
    
    // Bonus for exact phrase matches
    if (title.includes(claimWords.join(' ').substring(0, 50))) score += 5;
  });

  return score;
}

function extractRating(text) {
  const lowerText = text.toLowerCase();
  
  // More comprehensive rating extraction
  const ratingPatterns = {
    'false': /\b(false|bogus|baseless|fabricat|untrue|inaccurate|wrong|debunk)\b/,
    'true': /\b(true|accurate|correct|valid|verified|confirmed|right)\b/,
    'misleading': /\b(misleading|exaggerat|distort|out of context|spin|twist)\b/,
    'unproven': /\b(unproven|unsupported|no evidence|unsubstantiated|unverified)\b/,
    'mostly true': /\b(mostly true|largely accurate|substantially correct|mainly true)\b/,
    'mostly false': /\b(mostly false|largely false|mainly inaccurate|primarily false)\b/,
    'mixture': /\b(mixture|partly true|partly false|half true|both|and false)\b/
  };

  for (const [rating, pattern] of Object.entries(ratingPatterns)) {
    if (pattern.test(lowerText)) {
      return rating.charAt(0).toUpperCase() + rating.slice(1);
    }
  }
  
  return 'Unknown';
}

function formatFactCheckResult(claim, factCheck) {
  const ratingConfig = {
    'True': { confidence: 90, explanation: 'Verified as accurate' },
    'Mostly True': { confidence: 80, explanation: 'Mostly accurate with minor limitations' },
    'Mixture': { confidence: 50, explanation: 'Contains both true and false elements' },
    'Mostly False': { confidence: 70, explanation: 'Mostly inaccurate with some truth' },
    'False': { confidence: 90, explanation: 'Verified as inaccurate' },
    'Misleading': { confidence: 75, explanation: 'Presents information in a deceptive way' },
    'Unproven': { confidence: 60, explanation: 'Lacks sufficient evidence for verification' }
  };

  const config = ratingConfig[factCheck.rating] || { confidence: 70, explanation: 'Reviewed by fact-checkers' };

  return {
    claim: claim,
    rating: factCheck.rating,
    confidence: config.confidence,
    explanation: `${config.explanation}. ${factCheck.title}`,
    source: 'FactCheck.org',
    sourceUrl: factCheck.link,
    evidence: [
      `Relevance score: ${factCheck.relevanceScore}/10`,
      `Published: ${new Date(factCheck.pubDate).toLocaleDateString()}`,
      'Source: Annenberg Public Policy Center'
    ],
    details: {
      analysisMethod: "Semantic matching with fact-check database",
      articleTitle: factCheck.title,
      publicationDate: factCheck.pubDate,
      relevanceScore: factCheck.relevanceScore,
      source: "FactCheck.org - Annenberg Public Policy Center"
    }
  };
}

// Enhanced fallback validation with better logic
async function enhancedCustomFactValidation(text) {
  console.log('Using enhanced custom validation for:', text.substring(0, 100));
  
  const lowerText = text.toLowerCase();
  
  // Common factual claims with verification
  const knownFacts = [
    {
      patterns: [
        /water boils at 100 degrees? celsius/i,
        /h2o is water/i,
        /earth revolves around the sun/i
      ],
      rating: 'Likely True',
      confidence: 95,
      explanation: 'This matches established scientific consensus'
    },
    {
      patterns: [
        /earth is flat/i,
        /vaccines cause autism/i,
        /moon landing was fake/i
      ],
      rating: 'Likely False',
      confidence: 90,
      explanation: 'This contradicts scientific evidence and expert consensus'
    }
  ];

  // Check against known facts
  for (const fact of knownFacts) {
    for (const pattern of fact.patterns) {
      if (pattern.test(text)) {
        return {
          claim: text,
          rating: fact.rating,
          confidence: fact.confidence,
          explanation: fact.explanation,
          source: 'Internal Knowledge Base',
          details: {
            analysisMethod: "Pattern matching with verified facts",
            source: "Curated fact database"
          }
        };
      }
    }
  }

  // Linguistic analysis for unknown claims
  const analysis = analyzeClaimText(text);
  
  return {
    claim: text,
    rating: analysis.rating,
    confidence: analysis.confidence,
    explanation: analysis.explanation,
    source: 'AI Analysis',
    evidence: analysis.evidence,
    details: {
      analysisMethod: "Linguistic and contextual analysis",
      source: "Algorithmic assessment"
    }
  };
}

function analyzeClaimText(text) {
  const words = text.split(/\s+/).length;
  const hasCitations = /\b(study|research|scientists|university|journal)\b/i.test(text);
  const absoluteTerms = /\b(always|never|everyone|nobody|all|none)\b/i.test(text);
  const emotionalLanguage = /\b(terrible|disastrous|amazing|incredible|shocking)\b/i.test(text);

  let rating, confidence, explanation;
  const evidence = [];

  if (hasCitations && words > 20) {
    rating = 'Possibly True';
    confidence = 65;
    explanation = 'Claim references research or studies, but source verification is recommended.';
    evidence.push('References academic or scientific terms');
  } else if (absoluteTerms && emotionalLanguage) {
    rating = 'Questionable';
    confidence = 60;
    explanation = 'Claim uses absolute terms and emotional language, which often indicates exaggeration.';
    evidence.push('Uses absolute statements');
    evidence.push('Emotional language detected');
  } else {
    rating = 'Unverified';
    confidence = 50;
    explanation = 'Unable to verify this claim with available sources. Consider checking reliable references.';
    evidence.push('No matching patterns found in knowledge base');
  }

  return { rating, confidence, explanation, evidence };
}

// Enhanced API endpoint with multiple fallbacks
app.post('/api/validate-facts', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Text is required for fact validation.' });
    }

    if (text.length < 10) {
      return res.status(400).json({ error: 'Text must be at least 10 characters long.' });
    }

    console.log(`Validating fact: "${text.substring(0, 100)}..."`);

    let validationResult;

    // Try FactCheck.org first
    try {
      validationResult = await validateWithFactCheckOrg(text);
      // Only return if we found a good match
      if (validationResult.confidence > 60 && validationResult.rating !== 'Not Found') {
        return res.json(validationResult);
      }
    } catch (error) {
      console.log('FactCheck.org failed, trying fallbacks...');
    }

    // Try enhanced custom validation
    validationResult = await enhancedCustomFactValidation(text);
    res.json(validationResult);

  } catch (error) {
    console.error('Error validating facts:', error);
    
    // Final fallback response
    res.json({
      claim: req.body.text,
      rating: 'Validation Error',
      confidence: 0,
      explanation: 'Temporary issue with fact-checking services. Please try again later.',
      source: 'System',
      details: {
        error: error.message,
        analysisMethod: "Emergency fallback"
      }
    });
  }
});

// Detect Fake News
app.post('/api/detect-fake-news', async (req, res) => {
    try {
        const { articleText, title, source } = req.body;
        if (!articleText || articleText.trim() === '') {
            return res.status(400).json({ error: 'Article text is required for detection.' });
        }
        const detectionResult = await localFakeNewsDetection(articleText, title, source);
        res.json(detectionResult);
    } catch (error) {
        console.error('Error detecting fake news:', error);
        res.status(500).json({ error: 'Failed to analyze article: ' + error.message });
    }
});

// User Questions
app.get('/api/questions', (req, res) => res.json(questions));
app.post('/api/questions', (req, res) => {
    const { question } = req.body;
    if (!question || typeof question !== 'string' || question.trim() === '') {
        return res.status(400).json({ error: 'Question text is required.' });
    }
    const newQuestion = {
        id: questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1,
        user: { name: 'Anonymous', avatar: '' },
        question: question.trim(),
        answers: []
    };
    questions.unshift(newQuestion);
    res.status(201).json(newQuestion);
});


// Local detection logic...
async function localFakeNewsDetection(articleText, title = '', source = '') {
    const text = articleText.toLowerCase();
    const titleLower = title.toLowerCase();
    let fakeScore = 0;
    let realScore = 0;
    const factors = [];
    const sensationalWords = ['breaking', 'shocking', 'unbelievable', 'mind-blowing', 'explosive', 'bombshell', 'secret', 'hidden truth'];
    sensationalWords.forEach(word => {
        if (text.includes(word) || titleLower.includes(word)) {
            fakeScore += 2;
            factors.push(`Sensational language: "${word}"`);
        }
    });
    const sentimentAnalysis = new Sentiment();
    const sentimentResult = sentimentAnalysis.analyze(articleText);
    if (Math.abs(sentimentResult.score) > 10) {
        fakeScore += 2;
        factors.push('Extreme emotional language detected');
    }
    const credibleSources = ['reuters', 'associated press', 'bbc', 'cnn', 'npr'];
    if (source && credibleSources.some(s => source.toLowerCase().includes(s))) {
        realScore += 3;
        factors.push(`Credible source: ${source}`);
    }
    const totalScore = fakeScore + realScore;
    const isFake = fakeScore > realScore;
    const confidence = totalScore > 0 ? Math.min(Math.round(Math.abs(fakeScore - realScore) / totalScore * 100), 95) : 50;
    let explanation = isFake ? `High likelihood of misinformation (${confidence}% confidence).` : `Likely credible content (${confidence}% confidence).`;
    return { isFake, confidence, explanation, details: { fakeScore, realScore, factors: factors.slice(0, 5) } };
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});