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
app.post('/api/validate-fact', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text to validate is required.' });
    if (!CLAIMBUSTER_API_KEY) return res.status(500).json({ error: 'Server configuration error: Missing API key.' });

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