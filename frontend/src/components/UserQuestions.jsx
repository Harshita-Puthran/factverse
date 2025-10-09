import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Textarea } from './ui/textarea.jsx';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx';
import { HelpCircle, Send, Loader2, AlertTriangle, Sparkles } from 'lucide-react';

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
  }, []);

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
      setQuestions([createdQuestion, ...questions]);
      setNewQuestion('');
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
          <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          <span className="ml-3 text-slate-400">Loading questions...</span>
        </div>
      );
    }

    if (error) {
      return (
         <div className="flex items-center gap-3 p-4 rounded-md bg-red-900/20 text-red-400 border border-red-500/30">
          <AlertTriangle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      );
    }

    if (questions.length === 0) {
      return (
        <div className="text-center p-8 text-slate-500">
          No questions yet. Be the first to ask!
        </div>
      );
    }

    return questions.map((q) => (
      <Card key={q.id} className="bg-slate-800/50 backdrop-blur-lg border border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage src={q.user.avatar} alt={q.user.name} />
              <AvatarFallback>{q.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-white">{q.user.name}</p>
              <p className="text-slate-300 mt-1">{q.question}</p>

              <div className="mt-4 space-y-3">
                {q.answers.map((ans, index) => (
                  <div key={index} className="flex items-start gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                    <p className="text-xs font-bold text-blue-400 pt-1 flex items-center gap-1">
                      {ans.user === 'FactVerse Bot' && <Sparkles className="w-3 h-3 text-blue-400"/>}
                      {ans.user}:
                    </p>
                    <p className="text-sm text-slate-400">{ans.text}</p>
                  </div>
                ))}
                {q.answers.length === 0 && <p className="text-sm text-slate-500 italic">No answers yet.</p>}
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
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-red-500/20 border border-blue-300/30">
            <HelpCircle className="w-6 h-6 text-blue-300" />
          </div>
          <h1 className="text-3xl font-medium bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
            Community Q&A
          </h1>
        </div>
        <p className="text-slate-200 max-w-2xl mx-auto leading-relaxed">
          Engage with a community of fact-checkers and experts. Ask questions, get answers, and help verify information.
        </p>
      </div>

      {/* --- SUBMIT QUESTION CARD --- */}
      <Card className="bg-slate-800/50 backdrop-blur-xl border border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Ask the Community</CardTitle>
          <CardDescription className="text-slate-400">
            Have a question about a news story or a potential piece of misinformation? Post it here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Type your question here..."
              className="min-h-[100px] bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              disabled={isSubmitting}
            />
            <Button type="submit" disabled={isSubmitting || !newQuestion.trim()} className="bg-gradient-to-r from-blue-600 to-red-600 text-white">
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit Question'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* --- QUESTIONS LIST --- */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">Recent Questions</h2>
        {renderContent()}
      </div>
    </div>
  );
}

