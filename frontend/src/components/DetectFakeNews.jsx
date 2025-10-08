import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';
import { Shield, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

export function DetectFakeNews() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newsText, setNewsText] = useState('');
  const [error, setError] = useState('');

  // FIX 1: Correct API URL - your server runs on port 3000
  const API_URL = 'http://localhost:3000/api/detect-fake-news';

  const analyzeNews = async () => {
    if (!newsText.trim()) {
      setError('Please enter some news text to analyze.');
      return;
    }
    if (newsText.length < 50) {
      setError('Please enter a longer news article for accurate detection.');
      return;
    }
    
    setIsAnalyzing(true);
    setError('');
    setAnalysisResult(null);

    try {
      // FIX 2: Correct request body format for your server
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          articleText: newsText, 
          title: '', // Your server expects these fields
          source: '' 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();

      //Transform API result to match your server's response structure
      const transformedResult = {
        score: result.confidence,
        status: result.isFake ? 'unreliable' : 'reliable',
        isFake: result.isFake,
        confidence: result.confidence,
        factors: getFactorsFromResult(result), // ← This calls the helper function
        explanation: result.explanation,
        rawResult: result
      };
      
      setAnalysisResult(transformedResult);
    } catch (err) {
      console.error('Error analyzing news:', err);
      setError('Failed to analyze news. Please try again later.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ▼▼▼ ADD THE getFactorsFromResult FUNCTION RIGHT HERE ▼▼▼
  const getFactorsFromResult = (result) => {
    const factors = [];
    
    if (result.isFake) {
      factors.push('Multiple suspicious patterns detected', 'Potential misinformation indicators');
    } else {
      factors.push('Credible content characteristics', 'Reliable information patterns');
    }
    
    if (result.confidence > 80) {
      factors.push('High confidence analysis');
    } else if (result.confidence > 60) {
      factors.push('Moderate confidence analysis');
    } else {
      factors.push('Mixed signals - verify with sources');
    }
    
    // Add specific factors from the analysis
    if (result.details && result.details.factors) {
      factors.push(...result.details.factors);
    }
    
    return factors.slice(0, 5); // Show top 5 factors
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
        <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed"> {/* Changed to gray-700 */}
          AI-powered analysis to detect misinformation and verify news authenticity
        </p>
      </div>

      <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-gray-900">News Analysis</CardTitle> {/* Changed to gray-900 */}
          <CardDescription className="text-gray-900">
            Enter a news article URL or paste content to analyze
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <textarea
              className="w-full h-32 p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent" /* Fixed colors */
              placeholder="Paste news article content or URL here..."
              value={newsText}
              onChange={(e) => setNewsText(e.target.value)}
            />
            
            {/* FIX 5: Show error messages */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"> {/* Fixed error colors */}
                {error}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                onClick={analyzeNews}
                disabled={isAnalyzing || !newsText.trim()}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
              >
                {isAnalyzing ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
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
                className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50" /* Fixed colors */
              >
                Clear
              </Button>
            </div>
          </div>

          {analysisResult && (
            <div className="mt-6 space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200"> {/* Fixed colors */}
              <div className="flex items-center gap-2">
                {analysisResult.isFake ? (
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
                <span className="text-gray-900 font-medium"> {/* Changed to gray-900 */}
                  {analysisResult.isFake ? 'Potentially Fake News' : 'Likely Real News'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-700">Reliability Score:</span> {/* Changed to gray-700 */}
                <Badge className={
                  analysisResult.isFake 
                    ? "bg-red-500/20 text-red-300 border-red-500/30" 
                    : "bg-green-500/20 text-green-300 border-green-500/30"
                }>
                  {analysisResult.score}%
                </Badge>
              </div>
              
              {/* FIX 6: Show explanation from server */}
              {analysisResult.explanation && (
                <div className="text-sm text-gray-700"> {/* Changed to gray-700 */}
                  <strong>Analysis:</strong> {analysisResult.explanation}
                </div>
              )}
              
              <div className="space-y-2">
                <span className="text-gray-700 font-medium">Key Factors:</span>
                <ul className="space-y-1">
                  {analysisResult.factors.map((factor, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center gap-2"> {/* Changed to gray-600 */}
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
