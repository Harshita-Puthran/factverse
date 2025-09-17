import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Avatar } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  HelpCircle, 
  MessageSquare, 
  Search, 
  TrendingUp, 
  Clock, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle,
  User,
  Crown,
  CheckCircle,
  AlertCircle,
  Plus,
  Filter,
  Star,
  Eye,
  ArrowUp,
  ArrowDown,
  Share2,
  Flag
} from 'lucide-react';

export function UserQuestions() {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [newQuestion, setNewQuestion] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState('general');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [newAnswer, setNewAnswer] = useState('');

  // Mock questions data with enhanced properties
  const questions = [
    {
      id: 1,
      title: "How can I identify misinformation on social media?",
      content: "I often see conflicting information on social media platforms. What are the best practices for identifying and avoiding misinformation?",
      category: "fact-checking",
      author: {
        name: "Sarah Johnson",
        avatar: "SJ",
        reputation: 342,
        isVerified: true,
        role: "researcher"
      },
      createdAt: "2024-01-15T10:30:00Z",
      votes: 47,
      answers: 12,
      views: 1250,
      tags: ["misinformation", "social-media", "verification"],
      isTrending: true,
      status: "answered",
      bestAnswer: {
        id: 1,
        content: "Here are key strategies for identifying misinformation: 1) Check the source's credibility and track record, 2) Look for corroborating evidence from multiple reliable sources, 3) Be skeptical of emotionally charged headlines, 4) Verify images and videos using reverse search tools, 5) Check fact-checking websites like Snopes, PolitiFact, or FactCheck.org.",
        author: {
          name: "Dr. Michael Chen",
          avatar: "MC",
          reputation: 1250,
          isVerified: true,
          role: "expert"
        },
        votes: 23,
        createdAt: "2024-01-15T14:20:00Z"
      }
    },
    {
      id: 2,
      title: "What makes a news source credible?",
      content: "I'm trying to understand what criteria I should use to evaluate whether a news source is trustworthy and reliable.",
      category: "source-evaluation",
      author: {
        name: "Alex Rodriguez",
        avatar: "AR",
        reputation: 156,
        isVerified: false,
        role: "user"
      },
      createdAt: "2024-01-14T16:45:00Z",
      votes: 34,
      answers: 8,
      views: 890,
      tags: ["credibility", "sources", "journalism"],
      isTrending: false,
      status: "answered"
    },
    {
      id: 3,
      title: "How does AI detect fake news?",
      content: "I'm curious about the technical aspects of how artificial intelligence systems can identify fake news and misinformation. What technologies are involved?",
      category: "technology",
      author: {
        name: "Emma Wilson",
        avatar: "EW",
        reputation: 567,
        isVerified: true,
        role: "developer"
      },
      createdAt: "2024-01-13T09:15:00Z",
      votes: 89,
      answers: 15,
      views: 2100,
      tags: ["AI", "machine-learning", "detection", "technology"],
      isTrending: true,
      status: "answered"
    },
    {
      id: 4,
      title: "Best practices for fact-checking historical claims?",
      content: "When researching historical events, what are the most reliable methods and sources for verifying claims and avoiding historical misinformation?",
      category: "historical-research",
      author: {
        name: "Prof. David Kumar",
        avatar: "DK",
        reputation: 890,
        isVerified: true,
        role: "academic"
      },
      createdAt: "2024-01-12T11:20:00Z",
      votes: 56,
      answers: 9,
      views: 1340,
      tags: ["history", "research", "verification", "academia"],
      isTrending: false,
      status: "answered"
    },
    {
      id: 5,
      title: "How to handle contradictory expert opinions?",
      content: "Sometimes experts disagree on the same topic. How should I navigate situations where credible sources present conflicting information?",
      category: "expert-analysis",
      author: {
        name: "Maria Garcia",
        avatar: "MG",
        reputation: 234,
        isVerified: false,
        role: "user"
      },
      createdAt: "2024-01-11T13:50:00Z",
      votes: 42,
      answers: 6,
      views: 750,
      tags: ["experts", "conflicting-information", "analysis"],
      isTrending: false,
      status: "open"
    }
  ];

  // Filter questions based on search and category
  useEffect(() => {
    let filtered = questions;

    if (searchTerm) {
      filtered = filtered.filter(q =>
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }

    // Sort questions
    switch (sortBy) {
      case 'trending':
        filtered.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0) || b.votes - a.votes);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'votes':
        filtered.sort((a, b) => b.votes - a.votes);
        break;
      case 'answers':
        filtered.sort((a, b) => b.answers - a.answers);
        break;
      default:
        break;
    }

    setFilteredQuestions(filtered);
  }, [searchTerm, selectedCategory, sortBy]);

  const getCategoryColor = (category) => {
    const colors = {
      'fact-checking': 'bg-red-500/20 text-red-300 border-red-500/30',
      'source-evaluation': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'technology': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'historical-research': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      'expert-analysis': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      'general': 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    };
    return colors[category] || colors.general;
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'expert':
        return <Crown className="w-3 h-3 text-yellow-400" />;
      case 'academic':
        return <CheckCircle className="w-3 h-3 text-blue-400" />;
      case 'researcher':
        return <Star className="w-3 h-3 text-purple-400" />;
      case 'developer':
        return <AlertCircle className="w-3 h-3 text-green-400" />;
      default:
        return <User className="w-3 h-3 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'open':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'closed':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const submitQuestion = () => {
    if (newQuestion.trim()) {
      // Mock submission
      console.log('Submitting question:', newQuestion);
      setNewQuestion('');
      // Add success feedback here
    }
  };

  const submitAnswer = () => {
    if (newAnswer.trim() && selectedQuestion) {
      // Mock answer submission
      console.log('Submitting answer for question:', selectedQuestion.id);
      setNewAnswer('');
      // Add success feedback here
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
          User Questions
        </h1>
        <p className="text-white/70">
          Community-driven Q&A and discussions about fact-checking
        </p>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/10 border border-white/20">
          <TabsTrigger 
            value="browse" 
            className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Browse Questions
          </TabsTrigger>
          <TabsTrigger 
            value="ask" 
            className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ask Question
          </TabsTrigger>
          <TabsTrigger 
            value="trending" 
            className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending
          </TabsTrigger>
        </TabsList>

        {/* Browse Questions */}
        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  <Input
                    placeholder="Search questions, topics, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-amber-400/50 focus:ring-amber-400/25"
                  />
                </div>

                {/* Filters */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/20">
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="fact-checking">Fact Checking</SelectItem>
                        <SelectItem value="source-evaluation">Source Evaluation</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="historical-research">Historical Research</SelectItem>
                        <SelectItem value="expert-analysis">Expert Analysis</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/20">
                        <SelectItem value="trending">Trending</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="votes">Most Voted</SelectItem>
                        <SelectItem value="answers">Most Answers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-sm text-white/60 flex items-center">
                    {filteredQuestions.length} questions found
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions List */}
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <Card 
                key={question.id}
                className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedQuestion(question)}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Question Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-white group-hover:text-amber-300 transition-colors duration-300">
                            {question.title}
                          </h3>
                          {question.isTrending && (
                            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>
                        <p className="text-white/70 text-sm line-clamp-2 mb-3">
                          {question.content}
                        </p>
                      </div>
                      <Badge className={getStatusColor(question.status)}>
                        {question.status}
                      </Badge>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getCategoryColor(question.category)}>
                        {question.category.replace('-', ' ')}
                      </Badge>
                      {question.tags.map((tag, index) => (
                        <Badge 
                          key={index}
                          className="bg-gray-500/20 text-gray-300 border-gray-500/30 text-xs"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Question Footer */}
                    <div className="flex items-center justify-between text-sm text-white/60">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Avatar className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xs">
                            {question.author.avatar}
                          </Avatar>
                          <span>{question.author.name}</span>
                          {question.author.isVerified && (
                            <CheckCircle className="w-3 h-3 text-cyan-400" />
                          )}
                          {getRoleIcon(question.author.role)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <ArrowUp className="w-3 h-3 text-emerald-400" />
                          <span>{question.votes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3 text-blue-400" />
                          <span>{question.answers}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-purple-400" />
                          <span>{question.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Ask Question */}
        <TabsContent value="ask" className="space-y-6">
          <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                Ask a Question
              </CardTitle>
              <CardDescription className="text-white/60">
                Get help from the fact-checking community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm text-white/80 mb-2">Question Title</label>
                <Input
                  placeholder="What would you like to know?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-amber-400/50 focus:ring-amber-400/25"
                />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">Category</label>
                <Select value={newQuestionCategory} onValueChange={setNewQuestionCategory}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20">
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="fact-checking">Fact Checking</SelectItem>
                    <SelectItem value="source-evaluation">Source Evaluation</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="historical-research">Historical Research</SelectItem>
                    <SelectItem value="expert-analysis">Expert Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">Question Details</label>
                <Textarea
                  placeholder="Provide more details about your question..."
                  rows={4}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-amber-400/50 focus:ring-amber-400/25"
                />
              </div>

              <Button
                onClick={submitQuestion}
                disabled={!newQuestion.trim()}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium h-11 transition-all duration-300 disabled:opacity-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post Question
              </Button>
            </CardContent>
          </Card>

          {/* Question Guidelines */}
          <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Question Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-white/80 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0"></div>
                  <span>Be specific and clear about what you want to know</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0"></div>
                  <span>Search existing questions before posting to avoid duplicates</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0"></div>
                  <span>Choose the most appropriate category for your question</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0"></div>
                  <span>Provide context and background information when relevant</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trending Questions */}
        <TabsContent value="trending" className="space-y-6">
          <div className="space-y-4">
            {filteredQuestions.filter(q => q.isTrending).map((question, index) => (
              <Card 
                key={question.id}
                className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-center">
                      <div className="text-2xl text-orange-400 font-medium">#{index + 1}</div>
                      <div className="text-xs text-white/60">trending</div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="text-white text-lg">{question.title}</h3>
                        <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Hot
                        </Badge>
                      </div>
                      <p className="text-white/70 line-clamp-2">{question.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <div className="flex items-center gap-1">
                            <ArrowUp className="w-3 h-3 text-emerald-400" />
                            <span>{question.votes} votes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3 text-blue-400" />
                            <span>{question.answers} answers</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3 text-purple-400" />
                            <span>{question.views} views</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedQuestion(question)}
                          className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                        >
                          View Question
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Question Detail Modal */}
      {selectedQuestion && (
        <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-white mb-2">{selectedQuestion.title}</CardTitle>
                <CardDescription className="text-white/70 text-base">
                  {selectedQuestion.content}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedQuestion(null)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                    {selectedQuestion.author.avatar}
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-white text-sm">{selectedQuestion.author.name}</span>
                      {selectedQuestion.author.isVerified && (
                        <CheckCircle className="w-3 h-3 text-cyan-400" />
                      )}
                      {getRoleIcon(selectedQuestion.author.role)}
                    </div>
                    <div className="text-xs text-white/60">
                      Reputation: {selectedQuestion.author.reputation}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="text-emerald-400 hover:bg-emerald-500/10">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  {selectedQuestion.votes}
                </Button>
                <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/10">
                  <ArrowDown className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-blue-500/10">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-amber-400 hover:bg-amber-500/10">
                  <Flag className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Best Answer */}
            {selectedQuestion.bestAnswer && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 text-sm font-medium">Best Answer</span>
                </div>
                <p className="text-white/90 mb-3">{selectedQuestion.bestAnswer.content}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xs">
                      {selectedQuestion.bestAnswer.author.avatar}
                    </Avatar>
                    <span className="text-white/80">{selectedQuestion.bestAnswer.author.name}</span>
                    {selectedQuestion.bestAnswer.author.isVerified && (
                      <CheckCircle className="w-3 h-3 text-cyan-400" />
                    )}
                    {getRoleIcon(selectedQuestion.bestAnswer.author.role)}
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{selectedQuestion.bestAnswer.votes}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Answer Form */}
            <div className="space-y-3">
              <h4 className="text-white flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-amber-400" />
                Your Answer
              </h4>
              <Textarea
                placeholder="Share your knowledge and help others..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                rows={4}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-amber-400/50 focus:ring-amber-400/25"
              />
              <Button
                onClick={submitAnswer}
                disabled={!newAnswer.trim()}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white disabled:opacity-50"
              >
                Post Answer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Community Stats */}
      <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <MessageSquare className="w-5 h-5 text-orange-400" />
            Community Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center space-y-1">
              <div className="text-2xl text-amber-400">1,247</div>
              <div className="text-white/60 text-sm">Total Questions</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl text-emerald-400">3,891</div>
              <div className="text-white/60 text-sm">Answers Provided</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl text-blue-400">567</div>
              <div className="text-white/60 text-sm">Active Members</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl text-purple-400">92%</div>
              <div className="text-white/60 text-sm">Resolution Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}