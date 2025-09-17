import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Scan, 
  Link, 
  FileText, 
  Brain,
  TrendingUp,
  Clock,
  Eye,
  BarChart3,
  Zap,
  Target
} from 'lucide-react';

export function DetectFakeNews() {
  const [inputMethod, setInputMethod] = useState('url');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Mock analysis with realistic progression
  const analyzeContent = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisResult(null);

    const steps = [
      { progress: 20, message: "Fetching content..." },
      { progress: 40, message: "Analyzing language patterns..." },
      { progress: 60, message: "Cross-referencing sources..." },
      { progress: 80, message: "Checking fact databases..." },
      { progress: 100, message: "Generating report..." }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisProgress(step.progress);
    }

    // Generate mock analysis result
    const mockResult = {
      overallScore: Math.floor(Math.random() * 40) + 60, // 60-100
      verdict: '',
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100
      factors: {
        sourceCredibility: Math.floor(Math.random() * 40) + 60,
        languageAnalysis: Math.floor(Math.random() * 40) + 60,
        factChecking: Math.floor(Math.random() * 40) + 60,
        biasDetection: Math.floor(Math.random() * 40) + 60,
        crossReference: Math.floor(Math.random() * 40) + 60
      },
      flags: [],
      recommendations: [],
      sources: [
        { name: "Reuters", credibility: 95, status: "verified" },
        { name: "AP News", credibility: 93, status: "verified" },
        { name: "BBC", credibility: 91, status: "verified" },
        { name: "Snopes", credibility: 88, status: "verified" }
      ],
      processingTime: "2.3s",
      analysisDate: new Date().toISOString()
    };

    // Determine verdict based on score
    if (mockResult.overallScore >= 80) {
      mockResult.verdict = 'reliable';
      mockResult.flags = ['High source credibility', 'Factual consistency', 'No bias detected'];
      mockResult.recommendations = [
        'Content appears trustworthy',
        'Sources are well-established',
        'Information is consistent with verified facts'
      ];
    } else if (mockResult.overallScore >= 60) {
      mockResult.verdict = 'questionable';
      mockResult.flags = ['Moderate credibility concerns', 'Some inconsistencies found', 'Limited source verification'];
      mockResult.recommendations = [
        'Verify with additional sources',
        'Check for recent updates',
        'Cross-reference key claims'
      ];
    } else {
      mockResult.verdict = 'unreliable';
      mockResult.flags = ['Low source credibility', 'Multiple inconsistencies', 'Potential misinformation'];
      mockResult.recommendations = [
        'Avoid sharing without verification',
        'Seek alternative sources',
        'Report if suspected fake news'
      ];
    }

    setAnalysisResult(mockResult);
    setIsAnalyzing(false);
  };

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'reliable':
        return 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30';
      case 'questionable':
        return 'text-amber-300 bg-amber-500/20 border-amber-500/30';
      case 'unreliable':
        return 'text-red-300 bg-red-500/20 border-red-500/30';
      default:
        return 'text-gray-300 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getVerdictIcon = (verdict) => {
    switch (verdict) {
      case 'reliable':
        return <CheckCircle className="w-5 h-5" />;
      case 'questionable':
        return <AlertTriangle className="w-5 h-5" />;
      case 'unreliable':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const sampleUrls = [
    "https://www.reuters.com/world/climate-summit-2024",
    "https://www.bbc.com/news/technology-ai-breakthrough",
    "https://suspicious-news-site.fake/breaking-story"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
          Detect Fake News
        </h1>
        <p className="text-white/70">
          AI-powered fake news detection and analysis
        </p>
      </div>

      {/* Input Section */}
      <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="w-5 h-5 text-red-400" />
            Content Analysis
          </CardTitle>
          <CardDescription className="text-white/60">
            Submit a URL or paste text content for fake news detection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={inputMethod} onValueChange={setInputMethod}>
            <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20">
              <TabsTrigger 
                value="url" 
                className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-300"
              >
                <Link className="w-4 h-4 mr-2" />
                URL Analysis
              </TabsTrigger>
              <TabsTrigger 
                value="text" 
                className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-300"
              >
                <FileText className="w-4 h-4 mr-2" />
                Text Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4">
              <div>
                <Input
                  placeholder="Enter article URL (e.g., https://example.com/news/article)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-red-400/50 focus:ring-red-400/25"
                />
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-white/60">Try these sample URLs:</p>
                  <div className="flex flex-wrap gap-2">
                    {sampleUrls.map((url, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => setUrlInput(url)}
                        className="h-6 px-2 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                      >
                        Sample {index + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
              <Textarea
                placeholder="Paste the article text or news content here for analysis..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={6}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-red-400/50 focus:ring-red-400/25"
              />
              <p className="text-xs text-white/60">
                Minimum 100 characters required for accurate analysis
              </p>
            </TabsContent>
          </Tabs>

          <Button
            onClick={analyzeContent}
            disabled={isAnalyzing || (inputMethod === 'url' ? !urlInput : textInput.length < 100)}
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-medium h-11 transition-all duration-300 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <div className="flex items-center gap-2">
                <Scan className="w-4 h-4 animate-spin" />
                Analyzing Content...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Analyze for Fake News
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card className="border border-white/20 bg-gradient-to-br from-red-500/10 via-orange-500/5 to-transparent backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-red-400 animate-pulse" />
                <span className="text-white">AI Analysis in Progress</span>
              </div>
              <Progress 
                value={analysisProgress} 
                className="h-2 bg-white/10"
              />
              <div className="flex justify-between text-sm text-white/60">
                <span>Progress: {analysisProgress}%</span>
                <span>Please wait while we analyze the content...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisResult && !isAnalyzing && (
        <div className="space-y-6">
          {/* Main Result Card */}
          <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="w-5 h-5 text-red-400" />
                Analysis Results
              </CardTitle>
              <CardDescription className="text-white/60">
                Comprehensive fake news detection report
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Verdict */}
              <div className="text-center space-y-4">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getVerdictColor(analysisResult.verdict)}`}>
                  {getVerdictIcon(analysisResult.verdict)}
                  <span className="text-lg capitalize">{analysisResult.verdict}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="text-3xl text-white">
                    <span className={getScoreColor(analysisResult.overallScore)}>
                      {analysisResult.overallScore}
                    </span>
                    <span className="text-white/60">/100</span>
                  </div>
                  <p className="text-white/70">Overall Credibility Score</p>
                  <p className="text-sm text-white/60">
                    Confidence: {analysisResult.confidence}%
                  </p>
                </div>
              </div>

              {/* Analysis Factors */}
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(analysisResult.factors).map(([factor, score]) => (
                  <div key={factor} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white capitalize">
                        {factor.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className={`${getScoreColor(score)}`}>
                        {score}%
                      </span>
                    </div>
                    <Progress value={score} className="h-2 bg-white/10" />
                  </div>
                ))}
              </div>

              {/* Analysis Details */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Flags */}
                <div className="space-y-3">
                  <h4 className="text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Key Findings
                  </h4>
                  <div className="space-y-2">
                    {analysisResult.flags.map((flag, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0"></div>
                        <span className="text-white/80">{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-3">
                  <h4 className="text-white flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Recommendations
                  </h4>
                  <div className="space-y-2">
                    {analysisResult.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                        <span className="text-white/80">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Analysis Metadata */}
              <div className="flex items-center justify-between text-sm text-white/60 pt-4 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Analyzed in {analysisResult.processingTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>AI-Powered Detection</span>
                  </div>
                </div>
                <div className="text-xs">
                  {new Date(analysisResult.analysisDate).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Source Verification */}
          <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Source Verification
              </CardTitle>
              <CardDescription className="text-white/60">
                Cross-reference with trusted fact-checking sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analysisResult.sources.map((source, index) => (
                  <Card 
                    key={index} 
                    className="border border-white/20 bg-white/5 backdrop-blur-sm p-4 text-center"
                  >
                    <div className="space-y-2">
                      <h4 className="text-white text-sm">{source.name}</h4>
                      <div className={`text-lg ${getScoreColor(source.credibility)}`}>
                        {source.credibility}%
                      </div>
                      <Badge className={source.status === 'verified' ? 
                        'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 
                        'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }>
                        {source.status}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => {
                setAnalysisResult(null);
                setUrlInput('');
                setTextInput('');
              }}
            >
              Analyze Another
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Detailed Report
            </Button>
          </div>
        </div>
      )}

      {/* How It Works */}
      <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="w-5 h-5 text-purple-400" />
            How Our AI Detection Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mx-auto">
                <Scan className="w-6 h-6 text-cyan-400" />
              </div>
              <h4 className="text-white">Content Analysis</h4>
              <p className="text-white/60 text-sm">
                Natural language processing analyzes writing patterns and credibility indicators
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-white">Source Verification</h4>
              <p className="text-white/60 text-sm">
                Cross-references claims with established fact-checking databases
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
              <h4 className="text-white">Bias Detection</h4>
              <p className="text-white/60 text-sm">
                Identifies potential bias and emotional manipulation in content
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}