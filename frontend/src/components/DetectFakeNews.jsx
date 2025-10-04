import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';
import { Shield, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

export function DetectFakeNews() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeNews = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult({
        score: 87,
        status: 'reliable',
        factors: ['Verified source', 'Multiple references', 'Expert quotes', 'Fact-checked claims']
      });
      setIsAnalyzing(false);
    }, 2000);
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
        <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
          AI-powered analysis to detect misinformation and verify news authenticity
        </p>
      </div>

      <Card className="border border-gray-200 bg-white backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-gray-800">News Analysis</CardTitle>
          <CardDescription className="text-gray-600">
            Enter a news article URL or paste content to analyze
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <textarea
              className="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder:text-gray-400 resize-none"
              placeholder="Paste news article content or URL here..."
            />
            <Button 
              onClick={analyzeNews}
              disabled={isAnalyzing}
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
          </div>

          {analysisResult && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-800 font-medium">Analysis Complete</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-700">Reliability Score:</span>
                <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
                  {analysisResult.score}%
                </Badge>
              </div>
              <div className="space-y-2">
                <span className="text-gray-700 font-medium">Key Factors:</span>
                <ul className="space-y-1">
                  {analysisResult.factors.map((factor, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-600" />
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