import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Textarea } from './ui/textarea.jsx'; // Assuming you have a Textarea component
import { FileText, Loader2, AlertCircle } from 'lucide-react';

export function SummarizeArticles() {
  // --- STATE MANAGEMENT ---
  const [articleText, setArticleText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- FUNCTION TO HANDLE API CALL ---
  const handleSummarize = async () => {
    // Reset previous results and start loading
    setIsLoading(true);
    setSummary('');
    setError(null);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleText: articleText }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong with the request.');
      }

      const data = await response.json();
      setSummary(data.summary);

    } catch (err) {
      setError('Failed to summarize the article. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* --- HEADER (No changes) --- */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-300/30">
            <FileText className="w-6 h-6 text-emerald-300" />
          </div>
          <h1 className="text-3xl font-medium bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
            Summarize Articles
          </h1>
        </div>
        <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Paste any news article text below to get a quick, intelligent summary using an open-source AI model.
        </p>
      </div>

      {/* --- INPUT CARD --- */}
      <Card className="border border-gray-200 bg-white backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-gray-800">Your Article</CardTitle>
          <CardDescription className="text-gray-600">
            Paste the full text of the article you want to summarize.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your article text here..."
            className="min-h-[200px] bg-gray-50 border-gray-200 text-gray-800"
            value={articleText}
            onChange={(e) => setArticleText(e.target.value)}
          />
          <Button 
            onClick={handleSummarize} 
            disabled={isLoading || !articleText}
            className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white border-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              'Summarize Text'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* --- RESULTS AREA (Displays loading, error, or summary) --- */}
      {isLoading ? (
        <Card className="border-gray-200 bg-white/80 backdrop-blur-xl p-6 text-center">
          <div className="flex items-center justify-center gap-3 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>AI is reading and summarizing... Please wait.</span>
          </div>
        </Card>
      ) : error ? (
        <Card className="border-red-500/30 bg-red-500/10 backdrop-blur-xl p-6">
           <div className="flex items-center gap-3 text-red-500">
            <AlertCircle className="w-5 h-5" />
            <div>
              <div className="font-medium">Error</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        </Card>
      ) : summary && (
        <Card className="border-gray-200 bg-white backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-gray-800">Generated Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </CardContent>
        </Card>
      )
      }
    </div>
  );
}