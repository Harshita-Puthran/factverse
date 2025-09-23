import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Avatar } from './ui/avatar';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Users, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Star, 
  TrendingUp,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Flag,
  Share2,
  Filter,
  BarChart3,
  Target,
  Award,
  Globe,
  Zap,
  Brain
} from 'lucide-react';

export function CrowdFeedback() {
  const [activeTab, setActiveTab] = useState('submissions');
  const [selectedRating, setSelectedRating] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Mock submissions for crowd feedback
  const submissions = [
    {
      id: 1,
      title: "Climate Change Report - Arctic Ice Melting Accelerating",
      source: "Environmental Research Institute",
      url: "https://example.com/climate-report-2024",
      submittedBy: {
        name: "Dr. Sarah Chen",
        avatar: "SC",
        reputation: 892,
        isVerified: true
      },
      submittedAt: "2024-01-15T10:30:00Z",
      category: "environment",
      excerpt: "New satellite data shows Arctic ice is melting 40% faster than previous estimates...",
      crowdRating: {
        overall: 4.3,
        credibility: 4.5,
        accuracy: 4.2,
        bias: 4.1,
        totalVotes: 127
      },
      votes: {
        helpful: 89,
        unhelpful: 12,
        accurate: 95,
        inaccurate: 8,
        biased: 15,
        unbiased: 88
      },
      comments: 23,
      views: 1850,
      tags: ["climate", "research", "data", "peer-reviewed"],
      status: "verified",
      consensusReached: true,
      trending: true
    },
    {
      id: 2,
      title: "Economic Analysis: Stock Market Predictions for 2024",
      source: "Financial Analytics Weekly",
      url: "https://example.com/market-predictions",
      submittedBy: {
        name: "Alex Rodriguez",
        avatar: "AR",
        reputation: 456,
        isVerified: false
      },
      submittedAt: "2024-01-14T14:20:00Z",
      category: "economics",
      excerpt: "Market experts predict significant volatility in tech stocks due to AI regulation concerns...",
      crowdRating: {
        overall: 3.2,
        credibility: 3.0,
        accuracy: 3.1,
        bias: 3.5,
        totalVotes: 89
      },
      votes: {
        helpful: 45,
        unhelpful: 28,
        accurate: 38,
        inaccurate: 35,
        biased: 32,
        unbiased: 41
      },
      comments: 16,
      views: 1200,
      tags: ["economics", "predictions", "analysis", "opinion"],
      status: "under-review",
      consensusReached: false,
      trending: false
    },
    {
      id: 3,
      title: "Health Study: Benefits of Mediterranean Diet Confirmed",
      source: "Journal of Nutritional Science",
      url: "https://example.com/mediterranean-diet-study",
      submittedBy: {
        name: "Prof. Maria Garcia",
        avatar: "MG",
        reputation: 1240,
        isVerified: true
      },
      submittedAt: "2024-01-13T09:45:00Z",
      category: "health",
      excerpt: "Long-term study of 50,000 participants confirms cardiovascular benefits of Mediterranean diet...",
      crowdRating: {
        overall: 4.7,
        credibility: 4.8,
        accuracy: 4.6,
        bias: 4.7,
        totalVotes: 203
      },
      votes: {
        helpful: 178,
        unhelpful: 8,
        accurate: 185,
        inaccurate: 11,
        biased: 6,
        unbiased: 189
      },
      comments: 41,
      views: 2650,
      tags: ["health", "nutrition", "study", "peer-reviewed", "long-term"],
      status: "verified",
      consensusReached: true,
      trending: true
    },
    {
      id: 4,
      title: "Tech News: Revolutionary AI Breakthrough Claim",
      source: "TechBuzz Daily",
      url: "https://example.com/ai-breakthrough-claim",
      submittedBy: {
        name: "TechEnthusiast99",
        avatar: "TE",
        reputation: 123,
        isVerified: false
      },
      submittedAt: "2024-01-12T16:30:00Z",
      category: "technology",
      excerpt: "Startup claims to have achieved AGI breakthrough, but details remain vague...",
      crowdRating: {
        overall: 2.1,
        credibility: 1.8,
        accuracy: 2.2,
        bias: 2.3,
        totalVotes: 156
      },
      votes: {
        helpful: 23,
        unhelpful: 89,
        accurate: 19,
        inaccurate: 98,
        biased: 87,
        unbiased: 32
      },
      comments: 67,
      views: 3200,
      tags: ["technology", "AI", "claims", "startup", "unverified"],
      status: "disputed",
      consensusReached: true,
      trending: false
    }
  ];

  // Mock leaderboard data
  const topContributors = [
    { 
      name: "Dr. Sarah Chen", 
      avatar: "SC", 
      points: 2450, 
      contributions: 89, 
      accuracy: 94,
      badges: ["Expert Reviewer", "Accuracy Champion"]
    },
    { 
      name: "Prof. Maria Garcia", 
      avatar: "MG", 
      points: 2280, 
      contributions: 76, 
      accuracy: 96,
      badges: ["Scientific Validator", "Top Contributor"]
    },
    { 
      name: "Alex Rodriguez", 
      avatar: "AR", 
      points: 1890, 
      contributions: 134, 
      accuracy: 87,
      badges: ["Active Reviewer", "Community Helper"]
    },
    { 
      name: "Mike Johnson", 
      avatar: "MJ", 
      points: 1650, 
      contributions: 98, 
      accuracy: 91,
      badges: ["Fact Checker", "Reliable Source"]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'disputed':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'under-review':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4" />;
      case 'disputed':
        return <XCircle className="w-4 h-4" />;
      case 'under-review':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      environment: 'bg-green-500/20 text-green-300 border-green-500/30',
      economics: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      health: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      technology: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      politics: 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.0) return 'text-emerald-400';
    if (rating >= 3.0) return 'text-amber-400';
    return 'text-red-400';
  };

  const submitFeedback = () => {
    if (selectedRating && feedbackText.trim()) {
      // Mock feedback submission
      console.log('Submitting feedback:', { rating: selectedRating, text: feedbackText });
      setSelectedRating(null);
      setFeedbackText('');
      // Add success feedback here
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (filterCategory === 'all') return true;
    return submission.category === filterCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.submittedAt) - new Date(a.submittedAt);
      case 'rating':
        return b.crowdRating.overall - a.crowdRating.overall;
      case 'votes':
        return b.crowdRating.totalVotes - a.crowdRating.totalVotes;
      case 'views':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
          Crowd Feedback
        </h1>
        <p className="text-white/70">
          Collaborative fact-checking and community-driven content validation
        </p>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/10 border border-white/20">
          <TabsTrigger 
            value="submissions" 
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Submissions
          </TabsTrigger>
          <TabsTrigger 
            value="review" 
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300"
          >
            <Star className="w-4 h-4 mr-2" />
            Review
          </TabsTrigger>
          <TabsTrigger 
            value="leaderboard" 
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300"
          >
            <Award className="w-4 h-4 mr-2" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Submissions Tab */}
        <TabsContent value="submissions" className="space-y-6">
          {/* Filters */}
          <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/20">
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="environment">Environment</SelectItem>
                      <SelectItem value="economics">Economics</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="politics">Politics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/20">
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="votes">Most Votes</SelectItem>
                      <SelectItem value="views">Most Views</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-sm text-white/60 flex items-center">
                  {filteredSubmissions.length} submissions found
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submissions List */}
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => (
              <Card 
                key={submission.id}
                className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedSubmission(submission)}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-white group-hover:text-blue-300 transition-colors duration-300">
                            {submission.title}
                          </h3>
                          {submission.trending && (
                            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>
                        <p className="text-white/70 text-sm line-clamp-2 mb-3">
                          {submission.excerpt}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getStatusColor(submission.status)}>
                          {getStatusIcon(submission.status)}
                          <span className="ml-1 capitalize">{submission.status.replace('-', ' ')}</span>
                        </Badge>
                        {submission.consensusReached && (
                          <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                            Consensus Reached
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Rating Display */}
                    <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className={`text-xl ${getRatingColor(submission.crowdRating.overall)}`}>
                            {submission.crowdRating.overall}
                          </div>
                          <div className="text-xs text-white/60">Overall</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-xl ${getRatingColor(submission.crowdRating.credibility)}`}>
                            {submission.crowdRating.credibility}
                          </div>
                          <div className="text-xs text-white/60">Credibility</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-xl ${getRatingColor(submission.crowdRating.accuracy)}`}>
                            {submission.crowdRating.accuracy}
                          </div>
                          <div className="text-xs text-white/60">Accuracy</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-xl ${getRatingColor(submission.crowdRating.bias)}`}>
                            {submission.crowdRating.bias}
                          </div>
                          <div className="text-xs text-white/60">Objectivity</div>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getCategoryColor(submission.category)}>
                        {submission.category}
                      </Badge>
                      {submission.tags.map((tag, index) => (
                        <Badge 
                          key={index}
                          className="bg-gray-500/20 text-gray-300 border-gray-500/30 text-xs"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm text-white/60">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Avatar className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs">
                            {submission.submittedBy.avatar}
                          </Avatar>
                          <span>{submission.submittedBy.name}</span>
                          {submission.submittedBy.isVerified && (
                            <CheckCircle className="w-3 h-3 text-cyan-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400" />
                          <span>{submission.crowdRating.totalVotes} votes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-blue-400" />
                          <span>{submission.comments}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-purple-400" />
                          <span>{submission.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Review Tab */}
        <TabsContent value="review" className="space-y-6">
          <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Star className="w-5 h-5 text-blue-400" />
                Rate Content
              </CardTitle>
              <CardDescription className="text-white/60">
                Help improve content quality through community feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Rating Section */}
              <div className="grid md:grid-cols-4 gap-4">
                {['Credibility', 'Accuracy', 'Objectivity', 'Usefulness'].map((criterion) => (
                  <div key={criterion} className="space-y-2">
                    <label className="block text-sm text-white/80">{criterion}</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          variant="ghost"
                          size="sm"
                          className="p-1 h-8 w-8"
                          onClick={() => setSelectedRating(star)}
                        >
                          <Star 
                            className={`w-4 h-4 ${
                              selectedRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
                            }`} 
                          />
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Feedback Text */}
              <div>
                <label className="block text-sm text-white/80 mb-2">Comments (Optional)</label>
                <Textarea
                  placeholder="Share your thoughts about this content..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={3}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400/50 focus:ring-blue-400/25"
                />
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-emerald-400 hover:bg-emerald-500/10"
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  Helpful
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:bg-red-500/10"
                >
                  <ThumbsDown className="w-4 h-4 mr-1" />
                  Not Helpful
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-amber-400 hover:bg-amber-500/10"
                >
                  <Flag className="w-4 h-4 mr-1" />
                  Report
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-400 hover:bg-blue-500/10"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>

              <Button
                onClick={submitFeedback}
                disabled={!selectedRating}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium h-11 transition-all duration-300 disabled:opacity-50"
              >
                Submit Feedback
              </Button>
            </CardContent>
          </Card>

          {/* Review Guidelines */}
          <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Review Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-white/80 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                  <span>Base your ratings on factual accuracy and credible sources</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                  <span>Consider potential bias and balanced presentation of information</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                  <span>Provide constructive feedback to help improve content quality</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                  <span>Report content that violates community standards</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Award className="w-5 h-5 text-blue-400" />
                Top Contributors
              </CardTitle>
              <CardDescription className="text-white/60">
                Community members making the biggest impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topContributors.map((contributor, index) => (
                  <Card 
                    key={index}
                    className="border border-white/20 bg-white/5 backdrop-blur-sm p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className={`text-2xl ${
                          index === 0 ? 'text-yellow-400' : 
                          index === 1 ? 'text-gray-300' : 
                          index === 2 ? 'text-amber-600' : 'text-white/60'
                        }`}>
                          #{index + 1}
                        </div>
                        {index < 3 && (
                          <Award className={`w-5 h-5 mx-auto ${
                            index === 0 ? 'text-yellow-400' : 
                            index === 1 ? 'text-gray-300' : 'text-amber-600'
                          }`} />
                        )}
                      </div>
                      
                      <Avatar className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                        {contributor.avatar}
                      </Avatar>
                      
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{contributor.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {contributor.badges.map((badge, badgeIndex) => (
                            <Badge 
                              key={badgeIndex}
                              className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs"
                            >
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <div className="text-white font-medium">{contributor.points} pts</div>
                        <div className="text-xs text-white/60">
                          {contributor.contributions} contributions • {contributor.accuracy}% accuracy
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 backdrop-blur-sm p-4 text-center">
              <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-white">Most Active</div>
              <div className="text-yellow-400 text-lg font-medium">Alex Rodriguez</div>
              <div className="text-xs text-white/60">134 contributions this month</div>
            </Card>
            <Card className="border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-green-500/10 backdrop-blur-sm p-4 text-center">
              <Target className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-white">Most Accurate</div>
              <div className="text-emerald-400 text-lg font-medium">Prof. Maria Garcia</div>
              <div className="text-xs text-white/60">96% accuracy rate</div>
            </Card>
            <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm p-4 text-center">
              <Star className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-white">Rising Star</div>
              <div className="text-blue-400 text-lg font-medium">Dr. Sarah Chen</div>
              <div className="text-xs text-white/60">+250 points this week</div>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Community Stats */}
            <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Total Submissions</span>
                    <span className="text-blue-400 font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Active Reviewers</span>
                    <span className="text-emerald-400 font-medium">342</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Consensus Reached</span>
                    <span className="text-purple-400 font-medium">89%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Avg. Response Time</span>
                    <span className="text-orange-400 font-medium">4.2 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quality Metrics */}
            <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="w-5 h-5 text-emerald-400" />
                  Quality Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white/80 text-sm">Overall Accuracy</span>
                      <span className="text-emerald-400 text-sm">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white/80 text-sm">Source Credibility</span>
                      <span className="text-blue-400 text-sm">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white/80 text-sm">Bias Detection</span>
                      <span className="text-purple-400 text-sm">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white/80 text-sm">Community Agreement</span>
                      <span className="text-amber-400 text-sm">91%</span>
                    </div>
                    <Progress value={91} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Globe className="w-5 h-5 text-cyan-400" />
                Category Breakdown
              </CardTitle>
              <CardDescription className="text-white/60">
                Submission distribution across content categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4">
                {[
                  { name: 'Health', count: 312, percentage: 25, color: 'bg-purple-500' },
                  { name: 'Technology', count: 278, percentage: 22, color: 'bg-orange-500' },
                  { name: 'Environment', count: 249, percentage: 20, color: 'bg-green-500' },
                  { name: 'Economics', count: 187, percentage: 15, color: 'bg-blue-500' },
                  { name: 'Politics', count: 221, percentage: 18, color: 'bg-red-500' }
                ].map((category) => (
                  <Card key={category.name} className="border border-white/20 bg-white/5 backdrop-blur-sm p-4 text-center">
                    <div className={`w-12 h-12 ${category.color}/20 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <Brain className={`w-6 h-6 ${category.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="text-white font-medium">{category.name}</div>
                    <div className="text-2xl text-white font-medium">{category.count}</div>
                    <div className="text-xs text-white/60">{category.percentage}% of total</div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}