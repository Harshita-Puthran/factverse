// src/components/ValidateFacts.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Textarea } from './ui/textarea.jsx';
import { Badge } from './ui/badge.jsx';
import { CheckCircle, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';

export function ValidateFacts() {
  const [text, setText] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleValidate = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Updated to use port 3000 to match the new server
      const response = await fetch('http://localhost:3000/api/validate-fact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        // Try to get a more specific error message from the server's response body
        let errorMessage = 'The server returned an error. Please try again.';
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMessage = errorData.error; // Use the specific error from the server
          }
        } catch (jsonError) {
          // The response body wasn't valid JSON, so we stick with the generic message.
          console.error("Could not parse error JSON:", jsonError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 0.7) return 'bg-green-500/20 text-green-700 border-green-500/30';
    if (score >= 0.4) return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
    return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-300/30">
            <CheckCircle className="w-6 h-6 text-violet-300" />
          </div>
          <h1 className="text-3xl font-medium bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            Validate Facts
          </h1>
        </div>
        <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Enter a statement or paragraph to check for factual claims using the ClaimBuster API.
        </p>
      </div>

      <Card className="border border-gray-200 bg-white backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-gray-800">Fact Validation</CardTitle>
          <CardDescription className="text-gray-600">
            Paste the text you want to analyze below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter a sentence like: 'The sky is blue.' or a full article..."
            className="min-h-[150px] bg-gray-50 border-gray-200 text-gray-800"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button onClick={handleValidate} disabled={isLoading || !text} className="bg-gradient-to-r from-violet-500 to-purple-500">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              'Validate Text'
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-md bg-red-500/10 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          <div>
            <div className="font-medium">Error</div>
            <p>{error}</p>
          </div>
        </div>
      )}

      {results && (
        <Card className="border border-gray-200 bg-white backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <ShieldCheck className="w-5 h-5 text-violet-600"/>
              Validation Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.length > 0 ? (
              results.map((result, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <p className="text-gray-800 italic">"{result.text}"</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge className={getScoreColor(result.score)}>
                      Score: {(result.score * 100).toFixed(2)}%
                    </Badge>
                    <span className="text-sm font-medium text-gray-700">
                      {result.score >= 0.5 ? 'Check-worthy Claim' : 'Not a Factual Claim'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No factual claims were detected in the text provided.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}


