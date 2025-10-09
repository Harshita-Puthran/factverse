import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { FileText, Loader2, AlertCircle } from 'lucide-react';

export function SummarizeArticles() {
  const [articleText, setArticleText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSummarize = async () => {
    setIsLoading(true);
    setSummary('');
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/summarize', {
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
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-300/30">
            <FileText className="w-6 h-6 text-purple-300" />
          </div>
          <h1 className="text-3xl font-medium bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Summarize Articles
          </h1>
        </div>
        <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Paste any news article text below to get a quick, intelligent summary using an open-source AI model.
        </p>
      </div>

      <Card className="bg-slate-800/50 backdrop-blur-xl border border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Your Article</CardTitle>
          <CardDescription className="text-slate-400">
            Paste the full text of the article you want to summarize.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your article text here..."
            className="min-h-[200px] bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
            value={articleText}
            onChange={(e) => setArticleText(e.target.value)}
          />
          <Button 
            onClick={handleSummarize} 
            disabled={isLoading || !articleText}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
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

      {isLoading && (
        <Card className="bg-slate-800/50 backdrop-blur-xl p-6 text-center border border-slate-700">
          <div className="flex items-center justify-center gap-3 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>AI is reading and summarizing... Please wait.</span>
          </div>
        </Card>
      )}
      {error && (
        <Card className="border-red-500/30 bg-red-900/20 backdrop-blur-xl p-6">
           <div className="flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <div>
              <div className="font-medium">Error</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        </Card>
      )}
      {summary && !isLoading && (
        <Card className="bg-slate-800/50 backdrop-blur-xl border border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Generated Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 leading-relaxed">{summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

