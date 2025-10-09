import React, { useState } from 'react';
import { CheckCircle, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';

// --- Single-File UI Components (Resolving Import Errors) ---

// Card Component
function Card({ className = '', children }) {
  return (
    <div className={`rounded-xl border bg-card text-card-foreground shadow ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ className = '', children }) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({ className = '', children }) {
  return (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h3>
  );
}

function CardDescription({ className = '', children }) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>
      {children}
    </p>
  );
}

function CardContent({ className = '', children }) {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
}

// Button Component
function Button({ className = '', children, onClick, disabled, type = 'button' }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// Textarea Component
function Textarea({ className = '', value, onChange, placeholder, disabled }) {
  return (
    <textarea
      className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}

// Badge Component
function Badge({ className = '', children }) {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
    >
      {children}
    </div>
  );
}

// --- Main Application Component ---

export function ValidateFacts() {
  const [text, setText] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Calculates the appropriate Tailwind class for the score badge.
   * Scores are typically between 0 and 1.
   * @param {number} score The claim score from the API.
   * @returns {string} Tailwind classes for badge styling.
   */
  const getScoreColor = (score) => {
    if (score >= 0.7) return 'bg-green-500/20 text-green-700 border-green-500/30';
    if (score >= 0.4) return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
    return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
  };

  /**
   * Handles the fact validation submission.
   * It sends the text to the backend API for claim detection.
   */
  const handleValidate = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Using a relative path is better than hardcoding localhost:3000, 
      // assuming a proxy or co-located service handles the routing.
      const response = await fetch('/api/validate-fact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        let errorMessage = 'The server returned an error. Please try again.';
        try {
          // Attempt to get a specific error message from the server
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (jsonError) {
          console.error("Could not parse error JSON:", jsonError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      // Expecting data to contain a 'results' array from the backend
      setResults(data.results || []); 

    } catch (err) {
      // Set error state if the fetch or parsing fails
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-300/30 shadow-md">
              <CheckCircle className="w-6 h-6 text-violet-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600">
              Validate Facts
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Enter a statement or paragraph to check for factual claims using a modern NLP service, powered by the backend.
          </p>
        </div>

        {/* Input Card */}
        <Card className="shadow-2xl border-2 border-violet-200/50 bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900">Text Analyzer</CardTitle>
            <CardDescription className="text-gray-500">
              Paste the text you want to analyze below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter a sentence like: 'The sky is blue.' or a full article..."
              className="min-h-[150px] bg-gray-50 border-gray-300 focus:border-violet-500 text-gray-800 transition-all duration-200 rounded-lg"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
            />
            <Button 
              onClick={handleValidate} 
              disabled={isLoading || !text.trim()} 
              className="w-full sm:w-auto px-6 py-2 rounded-lg text-white font-semibold shadow-lg transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] 
                         bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Text...
                </>
              ) : (
                'Validate Text'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500 bg-red-50/70 text-red-700 shadow-lg">
            <AlertTriangle className="w-5 h-5 mt-1 shrink-0" />
            <div>
              <div className="font-semibold text-lg">Validation Failed</div>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Results Display */}
        {results && (
          <Card className="shadow-2xl border-2 border-violet-200/50 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <ShieldCheck className="w-5 h-5 text-violet-600"/>
                Validation Results ({results.length} Claims Found)
              </CardTitle>
              <CardDescription className="text-gray-500">
                Each section represents a sentence or clause identified as a potential factual claim.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 divide-y divide-gray-100">
              {results.length > 0 ? (
                results.map((result, index) => (
                  <div key={index} className="pt-4 first:pt-0">
                    <p className="text-gray-800 italic text-base mb-2 font-medium">"{result.text}"</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className={getScoreColor(result.score)}>
                        Confidence Score: {(result.score * 100).toFixed(2)}%
                      </Badge>
                      <span className={`text-sm font-semibold ${result.score >= 0.5 ? 'text-violet-700' : 'text-gray-500'}`}>
                        {result.score >= 0.5 ? 'High Likelihood of Check-worthy Claim' : 'Low Likelihood Factual Statement'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 p-4 bg-gray-50 rounded-lg">
                  No factual claims were clearly detected in the text provided, or the text was too short/simple.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Export the component as the default export to satisfy common application entry points
export default ValidateFacts;
