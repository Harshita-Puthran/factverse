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
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Database, 
  Globe, 
  BookOpen, 
  Brain,
  TrendingUp,
  Clock,
  Eye,
  Star,
  ExternalLink,
  Zap,
  Shield,
  Target,
  BarChart3
} from 'lucide-react';

export function ValidateFacts() {
  const [factInput, setFactInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const [validationResult, setValidationResult] = useState(null);
  const [selectedFact, setSelectedFact] = useState(null);

  // Mock fact validation process
  const validateFact = async () => {
    setIsValidating(true);
    setValidationProgress(0);
    setValidationResult(null);

    const steps = [
      { progress: 20, message: "Parsing claim..." },
      { progress: 40, message: "Searching databases..." },
      { progress: 60, message: "Cross-referencing sources..." },
      { progress: 80, message: "Analyzing credibility..." },
      { progress: 100, message: "Validation complete!" }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 700));
      setValidationProgress(step.progress);
    }

    // Generate mock validation result
    const truthValues = ['true', 'false', 'partially-true', 'unverified'];
    const randomTruth = truthValues[Math.floor(Math.random() * truthValues.length)];
    
    const mockResult = {
      claim: factInput,
      verdict: randomTruth,
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100
      credibilityScore: Math.floor(Math.random() * 40) + 60, // 60-100
      sources: [
        { 
          name: "Encyclopedia Britannica", 
          url: "https://britannica.com", 
          credibility: 98, 
          lastUpdated: "2024-01-15",
          status: "verified"
        },
        { 
          name: "Reuters Fact Check", 
          url: "https://reuters.com/fact-check", 
          credibility: 96, 
          lastUpdated: "2024-01-14",
          status: "verified"
        },
        { 
          name: "Associated Press", 
          url: "https://apnews.com", 
          credibility: 94, 
          lastUpdated: "2024-01-13",
          status: "verified"
        },
        { 
          name: "Snopes", 
          url: "https://snopes.com", 
          credibility: 89, 
          lastUpdated: "2024-01-12",
          status: "verified"
        }
      ],
      relatedFacts: [
        "Climate change is primarily caused by human activities",
        "Global temperatures have risen by 1.1°C since pre-industrial times",
        "Carbon dioxide levels are at their highest in 3 million years"
      ],
      evidence: {
        supporting: Math.floor(Math.random() * 20) + 15,
        contradicting: Math.floor(Math.random() * 10) + 2,
        neutral: Math.floor(Math.random() * 8) + 3
      },
      category: selectedCategory,
      processingTime: "1.8s",
      validatedAt: new Date().toISOString()
    };

    // Adjust result based on verdict
    switch (randomTruth) {
      case 'true':
        mockResult.explanation = "This claim is supported by multiple credible sources and scientific evidence.";
        mockResult.details = "Extensive peer-reviewed research confirms this statement. Multiple independent studies and authoritative sources provide consistent verification.";
        break;
      case 'false':
        mockResult.explanation = "This claim contradicts established facts and credible sources.";
        mockResult.details = "Multiple authoritative sources and scientific evidence directly contradict this statement. No credible evidence supports this claim.";
        break;
      case 'partially-true':
        mockResult.explanation = "This claim contains some accurate elements but requires additional context.";
        mockResult.details = "While certain aspects of this statement are supported by evidence, other elements are incomplete or require qualification.";
        break;
      case 'unverified':
        mockResult.explanation = "Insufficient evidence available to confirm or deny this claim.";
        mockResult.details = "Current available sources do not provide adequate information to make a definitive determination about this claim.";
        break;
    }

    setValidationResult(mockResult);
    setIsValidating(false);
  };

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'true':
        return 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30';
      case 'false':
        return 'text-red-300 bg-red-500/20 border-red-500/30';
      case 'partially-true':
        return 'text-amber-300 bg-amber-500/20 border-amber-500/30';
      case 'unverified':
        return 'text-gray-300 bg-gray-500/20 border-gray-500/30';
      default:
        return 'text-blue-300 bg-blue-500/20 border-blue-500/30';
    }
  };

  const getVerdictIcon = (verdict) => {
    switch (verdict) {
      case 'true':
        return <CheckCircle className="w-5 h-5" />;
      case 'false':
        return <XCircle className="w-5 h-5" />;
      case 'partially-true':
        return <AlertTriangle className="w-5 h-5" />;
      case 'unverified':
        return <Search className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  // Sample facts for different categories
  const sampleFacts = {
    science: [
      "Water boils at 100 degrees Celsius at sea level",
      "The Earth is approximately 4.5 billion years old",
      "Light travels at 299,792,458 meters per second in a vacuum"
    ],
    history: [
      "World War II ended in 1945",
      "The Berlin Wall fell in 1989",
      "The first moon landing occurred on July 20, 1969"
    ],
    politics: [
      "The United States has 50 states",
      "The European Union was established by the Maastricht Treaty",
      "The United Nations was founded in 1945"
    ],
    health: [
      "Regular exercise can help prevent cardiovascular disease",
      "Vaccines have eliminated smallpox worldwide",
      "Smoking increases the risk of lung cancer"
    ]
  };

  const quickFacts = [
    {
      id: 1,
      claim: "Climate change is primarily caused by human activities",
      verdict: "true",
      confidence: 97,
      category: "science"
    },
    {
      id: 2,
      claim: "The Great Wall of China is visible from space with the naked eye",
      verdict: "false",
      confidence: 94,
      category: "history"
    },
    {
      id: 3,
      claim: "Drinking 8 glasses of water daily is necessary for everyone",
      verdict: "partially-true",
      confidence: 78,
      category: "health"
    },
    {
      id: 4,
      claim: "Bitcoin was created by a person named Satoshi Nakamoto",
      verdict: "unverified",
      confidence: 65,
      category: "general"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Validate Facts
        </h1>
        <p className="text-white/70">
          Cross-reference facts with trusted sources and databases
        </p>
      </div>

      {/* Quick Fact Validation */}
      <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Zap className="w-5 h-5 text-violet-400" />
            Quick Fact Check
          </CardTitle>
          <CardDescription className="text-white/60">
            Select a common claim to see instant validation results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {quickFacts.map((fact) => (
              <Card 
                key={fact.id}
                className={`border border-white/20 bg-white/5 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  selectedFact?.id === fact.id ? 'ring-2 ring-violet-400/50' : ''
                }`}
                onClick={() => setSelectedFact(fact)}
              >
                <CardContent className="p-4 space-y-3">
                  <p className="text-white text-sm line-clamp-2">{fact.claim}</p>
                  <div className="flex items-center justify-between">
                    <Badge className={getVerdictColor(fact.verdict)}>
                      {getVerdictIcon(fact.verdict)}
                      <span className="ml-1 capitalize">{fact.verdict.replace('-', ' ')}</span>
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-white/60">
                      <Star className="w-3 h-3" />
                      <span>{fact.confidence}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {selectedFact && (
            <div className="mt-4 p-4 bg-violet-500/10 border border-violet-500/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Badge className={getVerdictColor(selectedFact.verdict)}>
                  {getVerdictIcon(selectedFact.verdict)}
                  <span className="ml-1 capitalize">{selectedFact.verdict.replace('-', ' ')}</span>
                </Badge>
                <span className="text-sm text-white/60">Confidence: {selectedFact.confidence}%</span>
              </div>
              <p className="text-white/80 text-sm">{selectedFact.claim}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Fact Validation */}
      <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Database className="w-5 h-5 text-violet-400" />
            Custom Fact Validation
          </CardTitle>
          <CardDescription className="text-white/60">
            Enter any claim or statement for comprehensive fact-checking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              placeholder="Enter the fact or claim you want to validate..."
              value={factInput}
              onChange={(e) => setFactInput(e.target.value)}
              rows={3}
              className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-violet-400/50 focus:ring-violet-400/25"
            />
            <p className="text-xs text-white/60 mt-1">
              Be specific and clear for the most accurate validation results
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/80 mb-2">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="politics">Politics</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-2">Sample Facts</label>
              <Select onValueChange={(value) => setFactInput(value)}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Choose a sample fact" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                  {sampleFacts[selectedCategory]?.map((fact, index) => (
                    <SelectItem key={index} value={fact}>
                      {fact.length > 50 ? `${fact.substring(0, 50)}...` : fact}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={validateFact}
            disabled={isValidating || factInput.length < 10}
            className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-medium h-11 transition-all duration-300 disabled:opacity-50"
          >
            {isValidating ? (
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 animate-spin" />
                Validating Fact...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Validate Fact
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Validation Progress */}
      {isValidating && (
        <Card className="border border-white/20 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-violet-400 animate-pulse" />
                <span className="text-white">Cross-referencing Sources</span>
              </div>
              <Progress 
                value={validationProgress} 
                className="h-2 bg-white/10"
              />
              <div className="flex justify-between text-sm text-white/60">
                <span>Progress: {validationProgress}%</span>
                <span>Analyzing claim against trusted databases...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Results */}
      {validationResult && !isValidating && (
        <div className="space-y-6">
          {/* Main Result */}
          <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="w-5 h-5 text-violet-400" />
                Validation Results
              </CardTitle>
              <CardDescription className="text-white/60">
                Comprehensive fact-checking analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Claim */}
              <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                <h4 className="text-white text-sm font-medium mb-2">Claim:</h4>
                <p className="text-white/80">{validationResult.claim}</p>
              </div>

              {/* Verdict */}
              <div className="text-center space-y-4">
                <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg border ${getVerdictColor(validationResult.verdict)}`}>
                  {getVerdictIcon(validationResult.verdict)}
                  <span className="text-lg capitalize">{validationResult.verdict.replace('-', ' ')}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="text-2xl text-white">
                    <span className={getScoreColor(validationResult.confidence)}>
                      {validationResult.confidence}%
                    </span>
                    <span className="text-white/60 text-base ml-2">Confidence</span>
                  </div>
                  <p className="text-white/70">{validationResult.explanation}</p>
                  <p className="text-white/60 text-sm">{validationResult.details}</p>
                </div>
              </div>

              {/* Evidence Summary */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-sm p-4 text-center">
                  <div className="space-y-1">
                    <div className="text-emerald-400 text-xl">{validationResult.evidence.supporting}</div>
                    <div className="text-white/60 text-sm">Supporting Sources</div>
                  </div>
                </Card>
                <Card className="border border-red-500/20 bg-red-500/10 backdrop-blur-sm p-4 text-center">
                  <div className="space-y-1">
                    <div className="text-red-400 text-xl">{validationResult.evidence.contradicting}</div>
                    <div className="text-white/60 text-sm">Contradicting Sources</div>
                  </div>
                </Card>
                <Card className="border border-gray-500/20 bg-gray-500/10 backdrop-blur-sm p-4 text-center">
                  <div className="space-y-1">
                    <div className="text-gray-400 text-xl">{validationResult.evidence.neutral}</div>
                    <div className="text-white/60 text-sm">Neutral Sources</div>
                  </div>
                </Card>
              </div>

              {/* Processing Info */}
              <div className="flex items-center justify-between text-sm text-white/60 pt-4 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Validated in {validationResult.processingTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" />
                    <span>Credibility Score: {validationResult.credibilityScore}%</span>
                  </div>
                </div>
                <div className="text-xs">
                  {new Date(validationResult.validatedAt).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sources */}
          <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Globe className="w-5 h-5 text-blue-400" />
                Source References
              </CardTitle>
              <CardDescription className="text-white/60">
                Trusted sources used for fact validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {validationResult.sources.map((source, index) => (
                  <Card 
                    key={index} 
                    className="border border-white/20 bg-white/5 backdrop-blur-sm p-4 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white">{source.name}</h4>
                          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                            {source.status}
                          </Badge>
                          <ExternalLink className="w-3 h-3 text-white/50" />
                        </div>
                        <div className="flex items-center gap-4 text-xs text-white/60">
                          <span>Credibility: {source.credibility}%</span>
                          <span>Updated: {new Date(source.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className={`text-lg ${getScoreColor(source.credibility)}`}>
                        {source.credibility}%
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Related Facts */}
          <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BookOpen className="w-5 h-5 text-orange-400" />
                Related Facts
              </CardTitle>
              <CardDescription className="text-white/60">
                Additional facts related to your query
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {validationResult.relatedFacts.map((fact, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 p-3 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0"></div>
                    <span className="text-white/80">{fact}</span>
                  </div>
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
                setValidationResult(null);
                setFactInput('');
              }}
            >
              Validate Another
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Full Report
            </Button>
          </div>
        </div>
      )}

      {/* How It Works */}
      <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="w-5 h-5 text-purple-400" />
            How Fact Validation Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-violet-500/20 rounded-lg flex items-center justify-center mx-auto">
                <Database className="w-6 h-6 text-violet-400" />
              </div>
              <h4 className="text-white">Database Search</h4>
              <p className="text-white/60 text-sm">
                Searches multiple trusted databases and fact-checking sources
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto">
                <Globe className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-white">Cross-Reference</h4>
              <p className="text-white/60 text-sm">
                Compares claims against multiple authoritative sources
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="text-white">Credibility Assessment</h4>
              <p className="text-white/60 text-sm">
                Analyzes source reliability and evidence quality
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}