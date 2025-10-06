import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Textarea } from './ui/textarea.jsx'; // Make sure you have these components
import { Button } from './ui/button.jsx';   // from your UI library (e.g., shadcn/ui)

export function ValidateFacts() {
  const [claim, setClaim] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleValidate = async (e) => {
    e.preventDefault();
    if (!claim.trim()) return; // Don't submit if input is empty

    setIsLoading(true);
    setResult(null); // Clear previous results

    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim: claim }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error validating fact:', error);
      setResult({ error: 'Failed to get validation results. Please try again.' });
    } finally {
      setIsLoading(false);
    }
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
          Enter a statement or claim to get an AI-powered analysis of its factual accuracy.
        </p>
      </div>

      <Card className="border border-gray-200 bg-white backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-gray-800">Fact Validation</CardTitle>
          <CardDescription className="text-gray-600">
            Check a claim using an open-source language model.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleValidate} className="space-y-4">
            <Textarea
              placeholder="E.g., 'The moon is made of cheese.'"
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              className="min-h-[100px] text-gray-800"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !claim.trim()} className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Analyzing...' : 'Validate Claim'}
            </Button>
          </form>

          {result && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Analysis:</h3>
              {result.error && <p className="text-red-500">{result.error}</p>}
              {result.analysis && (
                <div className="text-gray-700 bg-gray-50 p-4 rounded-md whitespace-pre-wrap font-sans">
                  {result.analysis}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}