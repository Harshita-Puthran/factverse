// server.js - FactVerse Q&A Backend using Google Gemini API

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

// Middleware setup
app.use(bodyParser.json());
// Allow requests from all origins for local development (adjust for production)
app.use(cors()); 

// --- Configuration ---
// Ensure this variable name matches what you set in your .env file
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 

if (!GEMINI_API_KEY) {
    console.error("FATAL ERROR: GEMINI_API_KEY is not set in the .env file. Please check factverse.env or .env.");
    // Exit gracefully if the key is missing
}

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
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
