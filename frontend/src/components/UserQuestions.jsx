import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Textarea } from './ui/textarea.jsx';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx';
import { HelpCircle, Send, Loader2, AlertTriangle } from 'lucide-react';

export function UserQuestions() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // --- FETCH QUESTIONS FROM SERVER ---
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const response = await fetch('http://localhost:3000/api/questions');
        if (!response.ok) {
          throw new Error('Failed to fetch questions from the server.');
        }
        const data = await response.json();
        setQuestions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []); // Empty dependency array means this runs once when the component mounts

  // --- HANDLE SUBMITTING A NEW QUESTION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: newQuestion }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit your question. Please try again.');
      }

      const createdQuestion = await response.json();
      // Add the new question to the top of the list locally
      setQuestions([createdQuestion, ...questions]);
      setNewQuestion(''); // Clear the input field
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDER LOGIC ---
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-10">
          <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
          <span className="ml-3 text-gray-600">Loading questions...</span>
        </div>
      );
    }

    if (error) {
      return (
         <div className="flex items-center gap-3 p-4 rounded-md bg-red-500/10 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      );
    }

    if (questions.length === 0) {
      return (
        <div className="text-center p-8 text-gray-500">
          No questions yet. Be the first to ask!
        </div>
      );
    }

    return questions.map((q) => (
      <Card key={q.id} className="border border-gray-200 bg-white/80 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage src={q.user.avatar} alt={q.user.name} />
              <AvatarFallback>{q.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{q.user.name}</p>
              <p className="text-gray-700 mt-1">{q.question}</p>

              <div className="mt-4 space-y-3">
                {q.answers.map((ans, index) => (
                  <div key={index} className="flex items-start gap-3 bg-gray-50/80 p-3 rounded-lg border border-gray-200/50">
                    <p className="text-xs font-bold text-amber-700 pt-1">{ans.user}:</p>
                    <p className="text-sm text-gray-600">{ans.text}</p>
                  </div>
                ))}
                {q.answers.length === 0 && <p className="text-sm text-gray-500 italic">No answers yet.</p>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="space-y-6">
      {/* --- HEADER --- */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-300/30">
            <HelpCircle className="w-6 h-6 text-amber-300" />
          </div>
          <h1 className="text-3xl font-medium bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            Community Q&A
          </h1>
        </div>
        <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Engage with a community of fact-checkers and experts. Ask questions, get answers, and help verify information.
        </p>
      </div>

      {/* --- SUBMIT QUESTION CARD --- */}
      <Card className="border border-gray-200 bg-white backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-gray-800">Ask the Community</CardTitle>
          <CardDescription className="text-gray-600">
            Have a question about a news story or a potential piece of misinformation? Post it here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Type your question here..."
              className="min-h-[100px] bg-gray-50 border-gray-200 text-gray-800"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              disabled={isSubmitting}
            />
            <Button type="submit" disabled={isSubmitting || !newQuestion.trim()} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit Question'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* --- QUESTIONS LIST --- */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Recent Questions</h2>
        {renderContent()}
      </div>
    </div>
  );
}