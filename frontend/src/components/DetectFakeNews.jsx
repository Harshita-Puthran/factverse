import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';
import { Shield, AlertTriangle, CheckCircle, Zap, Loader2 } from 'lucide-react';

export function DetectFakeNews() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newsText, setNewsText] = useState('');
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:3000/api/detect-fake-news';

  const analyzeNews = async () => {
    if (!newsText.trim() || newsText.length < 50) {
      setError('Please enter a substantial news article for accurate detection.');
      return;
    }
    
    setIsAnalyzing(true);
    setError('');
    setAnalysisResult(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleText: newsText, title: '', source: '' }),
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `API error: ${response.status}`);
      }
      
      const result = await response.json();
      setAnalysisResult(result);

    } catch (err) {
      console.error('Error analyzing news:', err);
      setError(err.message || 'Failed to analyze news. Please try again later.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAnalysis = () => {
    setNewsText('');
    setAnalysisResult(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-300/30">
            <Shield className="w-6 h-6 text-red-300" />
          </div>
          <h1 className="text-3xl font-medium bg-gradient-to-r from-red-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
            Detect Fake News
          </h1>
        </div>
        <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
          AI-powered analysis to detect misinformation and verify news authenticity.
        </p>
      </div>

      <Card className="bg-slate-800/50 backdrop-blur-xl border border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">News Analysis</CardTitle>
          <CardDescription className="text-slate-400">
            Enter news article to analyze
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <textarea
              className="w-full h-40 p-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 resize-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
              placeholder="Paste the full news article content here..."
              value={newsText}
              onChange={(e) => setNewsText(e.target.value)}
            />
            
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                onClick={analyzeNews}
                disabled={isAnalyzing || !newsText.trim()}
                className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Analyze Content
                  </>
                )}
              </Button>
              
              <Button 
                onClick={clearAnalysis}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800"
              >
                Clear
              </Button>
            </div>
          </div>

          {analysisResult && (
            <div className="mt-6 space-y-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
              <div className="flex items-center gap-2">
                {analysisResult.isFake ? (
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
                <span className="text-white font-medium">
                  {analysisResult.isFake ? 'Potentially Misinformation' : 'Likely Credible'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Confidence:</span>
                <Badge className={
                  analysisResult.isFake 
                    ? "bg-red-500/20 text-red-300 border-red-500/30" 
                    : "bg-green-500/20 text-green-300 border-green-500/30"
                }>
                  {analysisResult.confidence}%
                </Badge>
              </div>
              
              {analysisResult.explanation && (
                <div className="text-sm text-slate-400">
                  <strong className="text-slate-200">Analysis:</strong> {analysisResult.explanation}
                </div>
              )}
              
              {analysisResult.details && analysisResult.details.factors && analysisResult.details.factors.length > 0 && (
                 <div className="space-y-2 pt-2">
                    <span className="text-slate-300 font-medium">Key Factors Identified:</span>
                    <ul className="space-y-1">
                    {analysisResult.details.factors.map((factor, index) => (
                        <li key={index} className="text-sm text-slate-400 flex items-start gap-2">
                        <Zap className="w-3 h-3 text-amber-400 mt-1 flex-shrink-0" />
                        {factor}
                        </li>
                    ))}
                    </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

