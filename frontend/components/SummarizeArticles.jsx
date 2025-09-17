import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  FileText, 
  Link, 
  Sparkles, 
  Clock, 
  BookOpen, 
  Target, 
  Brain, 
  TrendingUp,
  Copy,
  Download,
  Share2,
  Zap,
  BarChart3,
  Eye,
  MessageSquare,
  Hash
} from 'lucide-react';

export function SummarizeArticles() {
  const [inputMethod, setInputMethod] = useState('url');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [summaryLength, setSummaryLength] = useState('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [summaryResult, setSummaryResult] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('professional');

  // Mock summarization process
  const generateSummary = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setSummaryResult(null);

    const steps = [
      { progress: 15, message: "Extracting content..." },
      { progress: 35, message: "Analyzing key themes..." },
      { progress: 55, message: "Identifying main points..." },
      { progress: 75, message: "Generating summary..." },
      { progress: 95, message: "Optimizing readability..." },
      { progress: 100, message: "Summary complete!" }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setProcessingProgress(step.progress);
    }

    // Generate mock summary based on settings
    const mockSummaries = {
      short: {
        text: "Climate researchers announced breakthrough findings on carbon capture technology, showing 40% improved efficiency. The new method could significantly accelerate global emission reduction goals by 2030.",
        wordCount: 25,
        readingTime: "15 seconds"
      },
      medium: {
        text: "International climate researchers have announced a significant breakthrough in carbon capture technology, demonstrating a 40% improvement in efficiency compared to current methods. The innovative approach combines advanced materials science with AI-powered optimization systems. Leading scientists believe this technology could accelerate global emission reduction goals, potentially helping nations meet their 2030 climate targets. The research team, spanning universities across five countries, plans to begin pilot testing at industrial sites next year.",
        wordCount: 72,
        readingTime: "45 seconds"
      },
      long: {
        text: "An international consortium of climate researchers has unveiled a groundbreaking advancement in carbon capture technology that promises to revolutionize the fight against climate change. The new methodology demonstrates a remarkable 40% improvement in efficiency compared to existing carbon capture systems, achieved through the integration of advanced nanomaterials and AI-powered optimization algorithms. Dr. Sarah Martinez, leading the research team, explained that the technology addresses previous limitations in energy consumption and capture rates. The collaborative effort involves scientists from top universities across the United States, Europe, and Asia, representing the largest coordinated research initiative in this field to date. Early modeling suggests that widespread implementation of this technology could help nations accelerate their emission reduction timelines, potentially enabling achievement of 2030 climate targets that previously seemed unrealistic. The research team has secured funding for pilot testing at three major industrial facilities, with commercial deployment projected within five years.",
        wordCount: 145,
        readingTime: "2 minutes"
      }
    };

    const selectedSummary = mockSummaries[summaryLength];
    
    const mockResult = {
      originalLength: Math.floor(Math.random() * 2000) + 1000,
      summary: selectedSummary.text,
      wordCount: selectedSummary.wordCount,
      readingTime: selectedSummary.readingTime,
      compressionRatio: Math.floor((selectedSummary.wordCount / 2500) * 100),
      keyPoints: [
        "40% improvement in carbon capture efficiency",
        "International research collaboration",
        "AI-powered optimization systems",
        "2030 climate targets acceleration",
        "Pilot testing at industrial sites"
      ],
      topics: ["Climate Change", "Technology", "Research", "Environment", "Innovation"],
      sentiment: "Positive",
      readabilityScore: 85,
      processingTime: "3.2s",
      style: selectedStyle,
      language: "English",
      generatedAt: new Date().toISOString()
    };

    setSummaryResult(mockResult);
    setIsProcessing(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Add toast notification here if needed
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30';
      case 'negative': return 'text-red-300 bg-red-500/20 border-red-500/30';
      case 'neutral': return 'text-gray-300 bg-gray-500/20 border-gray-500/30';
      default: return 'text-blue-300 bg-blue-500/20 border-blue-500/30';
    }
  };

  const sampleUrls = [
    "https://www.nature.com/articles/climate-research-2024",
    "https://www.reuters.com/technology/ai-breakthrough-article",
    "https://www.bbc.com/news/science-environment-latest"
  ];

  const sampleText = `Artificial intelligence has revolutionized numerous industries, from healthcare to transportation. Recent breakthroughs in machine learning have enabled computers to perform tasks that were once thought to be exclusively human. Natural language processing allows machines to understand and generate human language with remarkable accuracy. Computer vision systems can now identify objects, recognize faces, and even diagnose medical conditions from images. However, these advances also raise important questions about privacy, job displacement, and the ethical use of AI technology. As we continue to develop more sophisticated AI systems, it's crucial that we consider both the tremendous potential benefits and the significant challenges they present for society.`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Summarize Articles
        </h1>
        <p className="text-white/70">
          Quick, intelligent article summaries powered by AI
        </p>
      </div>

      {/* Input Section */}
      <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="w-5 h-5 text-emerald-400" />
            Content Input
          </CardTitle>
          <CardDescription className="text-white/60">
            Submit content for intelligent summarization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={inputMethod} onValueChange={setInputMethod}>
            <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20">
              <TabsTrigger 
                value="url" 
                className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300"
              >
                <Link className="w-4 h-4 mr-2" />
                URL Input
              </TabsTrigger>
              <TabsTrigger 
                value="text" 
                className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300"
              >
                <FileText className="w-4 h-4 mr-2" />
                Text Input
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4">
              <div>
                <Input
                  placeholder="Enter article URL for summarization"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400/50 focus:ring-emerald-400/25"
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
              <div>
                <Textarea
                  placeholder="Paste the article text here for summarization..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={6}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400/50 focus:ring-emerald-400/25"
                />
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-white/60">
                    Minimum 200 characters for optimal results
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTextInput(sampleText)}
                    className="h-6 px-2 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                  >
                    Use Sample Text
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Summary Options */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/80 mb-2">Summary Length</label>
              <Select value={summaryLength} onValueChange={setSummaryLength}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                  <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                  <SelectItem value="medium">Medium (1 paragraph)</SelectItem>
                  <SelectItem value="long">Long (2-3 paragraphs)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-2">Writing Style</label>
              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="journalistic">Journalistic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={generateSummary}
            disabled={isProcessing || (inputMethod === 'url' ? !urlInput : textInput.length < 200)}
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium h-11 transition-all duration-300 disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                Generating Summary...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Generate Summary
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Processing Progress */}
      {isProcessing && (
        <Card className="border border-white/20 bg-gradient-to-br from-emerald-500/10 via-blue-500/5 to-transparent backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-emerald-400 animate-pulse" />
                <span className="text-white">AI Processing Content</span>
              </div>
              <Progress 
                value={processingProgress} 
                className="h-2 bg-white/10"
              />
              <div className="flex justify-between text-sm text-white/60">
                <span>Progress: {processingProgress}%</span>
                <span>Analyzing content structure...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Results */}
      {summaryResult && !isProcessing && (
        <div className="space-y-6">
          {/* Main Summary Card */}
          <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  Generated Summary
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(summaryResult.summary)}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="text-white/60">
                AI-generated summary with key insights extracted
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary Text */}
              <div className="bg-white/5 border border-white/20 rounded-lg p-6 backdrop-blur-sm">
                <p className="text-white leading-relaxed text-lg">
                  {summaryResult.summary}
                </p>
              </div>

              {/* Summary Metrics */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="border border-white/20 bg-white/5 backdrop-blur-sm p-4 text-center">
                  <div className="space-y-1">
                    <div className="text-emerald-400 text-xl">{summaryResult.wordCount}</div>
                    <div className="text-white/60 text-sm">Words</div>
                  </div>
                </Card>
                <Card className="border border-white/20 bg-white/5 backdrop-blur-sm p-4 text-center">
                  <div className="space-y-1">
                    <div className="text-blue-400 text-xl">{summaryResult.readingTime}</div>
                    <div className="text-white/60 text-sm">Reading Time</div>
                  </div>
                </Card>
                <Card className="border border-white/20 bg-white/5 backdrop-blur-sm p-4 text-center">
                  <div className="space-y-1">
                    <div className="text-purple-400 text-xl">{summaryResult.compressionRatio}%</div>
                    <div className="text-white/60 text-sm">Compression</div>
                  </div>
                </Card>
                <Card className="border border-white/20 bg-white/5 backdrop-blur-sm p-4 text-center">
                  <div className="space-y-1">
                    <div className="text-orange-400 text-xl">{summaryResult.readabilityScore}</div>
                    <div className="text-white/60 text-sm">Readability</div>
                  </div>
                </Card>
              </div>

              {/* Key Points */}
              <div className="space-y-3">
                <h4 className="text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  Key Points
                </h4>
                <div className="space-y-2">
                  {summaryResult.keyPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                      <span className="text-white/80">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topics and Sentiment */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-white flex items-center gap-2">
                    <Hash className="w-4 h-4 text-blue-400" />
                    Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {summaryResult.topics.map((topic, index) => (
                      <Badge 
                        key={index}
                        className="bg-blue-500/20 text-blue-300 border-blue-500/30"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                    Analysis
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80 text-sm">Sentiment</span>
                      <Badge className={getSentimentColor(summaryResult.sentiment)}>
                        {summaryResult.sentiment}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80 text-sm">Style</span>
                      <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">
                        {summaryResult.style}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Processing Info */}
              <div className="flex items-center justify-between text-sm text-white/60 pt-4 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Processed in {summaryResult.processingTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>AI-Generated</span>
                  </div>
                </div>
                <div className="text-xs">
                  {new Date(summaryResult.generatedAt).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => {
                setSummaryResult(null);
                setUrlInput('');
                setTextInput('');
              }}
            >
              Summarize Another
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Full Analysis
            </Button>
          </div>
        </div>
      )}

      {/* Feature Information */}
      <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BookOpen className="w-5 h-5 text-blue-400" />
            Summarization Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto">
                <Brain className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="text-white">Smart Extraction</h4>
              <p className="text-white/60 text-sm">
                AI identifies and extracts the most important information from any content
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-white">Key Points</h4>
              <p className="text-white/60 text-sm">
                Automatically generates bullet points highlighting crucial information
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-white">Multiple Styles</h4>
              <p className="text-white/60 text-sm">
                Choose from various writing styles to match your audience and purpose
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}