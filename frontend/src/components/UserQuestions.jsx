import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Textarea } from './ui/textarea.jsx';
import { HelpCircle, Loader2 } from 'lucide-react';

export function UserQuestions() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setAnswer('');
    setError(null);

    try {
      const response = await fetch('/api/answer-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error('The AI could not be reached. Please try again.');
      }

      const data = await response.json();
      setAnswer(data.answer);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-300/30">
            <HelpCircle className="w-6 h-6 text-amber-300" />
          </div>
          <h1 className="text-3xl font-medium bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            Ask the AI
          </h1>
        </div>
        <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Pose any question and get an instant answer from our AI assistant.
        </p>
      </div>

      <Card className="border border-gray-200 bg-white backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-gray-800">Your Question</CardTitle>
          <CardDescription className="text-gray-600">
            Enter your question below to get an answer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAsk} className="space-y-4">
            <Textarea
              placeholder="E.g., 'What is the speed of light?'"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[100px]"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !question.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Getting Answer...' : 'Ask Question'}
            </Button>
          </form>

          {answer && !isLoading && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">AI's Answer:</h3>
              <div className="text-gray-700 bg-gray-50 p-4 rounded-md whitespace-pre-wrap font-sans">
                {answer}
              </div>
            </div>
          )}

          {error && !isLoading && (
             <div className="mt-6 border-t pt-4">
               <p className="text-red-500">{error}</p>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

