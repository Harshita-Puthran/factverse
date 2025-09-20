import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Filter, Search, Calendar, Globe, TrendingUp, Clock, User, Star, Eye, MessageSquare } from 'lucide-react';

export function FilterNews() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedCredibility, setSelectedCredibility] = useState('all');
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState('grid');

  // Mock news articles with enhanced data
  const newsArticles = [
    {
      id: 1,
      title: "Climate Change Summit Reaches Historic Agreement on Carbon Emissions",
      source: "Reuters",
      topic: "environment",
      credibility: "high",
      date: "2024-01-15",
      summary: "World leaders agree on ambitious carbon reduction targets for 2030.",
      author: "Sarah Johnson",
      readTime: "4 min read",
      views: 15420,
      comments: 89,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=400&h=200&fit=crop&crop=center",
      tags: ["climate", "politics", "international", "environment"],
      verified: true,
      trending: true
    },
    {
      id: 2,
      title: "New AI Technology Revolutionizes Medical Diagnosis Accuracy",
      source: "BBC",
      topic: "technology",
      credibility: "high",
      date: "2024-01-14",
      summary: "Machine learning model achieves 95% accuracy in early cancer detection.",
      author: "Dr. Michael Chen",
      readTime: "6 min read",
      views: 23100,
      comments: 156,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop&crop=center",
      tags: ["AI", "healthcare", "innovation", "medical"],
      verified: true,
      trending: false
    },
    {
      id: 3,
      title: "Economic Markets Show Signs of Recovery Following Policy Changes",
      source: "CNN",
      topic: "economy",
      credibility: "medium",
      date: "2024-01-13",
      summary: "Stock indices rise 3% after federal reserve announcement.",
      author: "Robert Williams",
      readTime: "3 min read",
      views: 8750,
      comments: 45,
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop&crop=center",
      tags: ["economy", "finance", "markets", "policy"],
      verified: true,
      trending: false
    },
    {
      id: 4,
      title: "Breaking: Major Sports Championship Results Announced",
      source: "ESPN",
      topic: "sports",
      credibility: "high",
      date: "2024-01-12",
      summary: "Championship finals deliver unexpected outcomes and record viewership.",
      author: "Lisa Martinez",
      readTime: "2 min read",
      views: 45300,
      comments: 278,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=200&fit=crop&crop=center",
      tags: ["sports", "championship", "breaking", "live"],
      verified: true,
      trending: true
    },
    {
      id: 5,
      title: "Unverified: Celebrity Scandal Rocks Entertainment Industry",
      source: "TMZ",
      topic: "entertainment",
      credibility: "low",
      date: "2024-01-11",
      summary: "Allegations surface about major Hollywood figure - verification pending.",
      author: "Anonymous Source",
      readTime: "1 min read",
      views: 67800,
      comments: 445,
      rating: 2.1,
      image: "https://images.unsplash.com/photo-1499364615650-ec38552909c6?w=400&h=200&fit=crop&crop=center",
      tags: ["celebrity", "scandal", "unverified", "entertainment"],
      verified: false,
      trending: true
    }
  ];

  // Filter articles based on criteria
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      let filtered = newsArticles;

      if (searchTerm) {
        filtered = filtered.filter(article =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      if (selectedSource !== 'all') {
        filtered = filtered.filter(article => article.source.toLowerCase() === selectedSource);
      }

      if (selectedTopic !== 'all') {
        filtered = filtered.filter(article => article.topic === selectedTopic);
      }

      if (selectedCredibility !== 'all') {
        filtered = filtered.filter(article => article.credibility === selectedCredibility);
      }

      setFilteredArticles(filtered);
      setIsLoading(false);
    }, 500);
  }, [searchTerm, selectedSource, selectedTopic, selectedCredibility]);

  const getCredibilityColor = (credibility) => {
    switch (credibility) {
      case 'high': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'low': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getTopicColor = (topic) => {
    const colors = {
      environment: 'bg-green-500/20 text-green-300 border-green-500/30',
      technology: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      economy: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      sports: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      entertainment: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      politics: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    };
    return colors[topic] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Filter News
        </h1>
        <p className="text-white/70">
          Smart filtering by source, topic, and credibility
        </p>
      </div>

      {/* Filter Controls */}
      <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Filter className="w-5 h-5 text-cyan-400" />
            Filter Controls
          </CardTitle>
          <CardDescription className="text-white/60">
            Customize your news feed with advanced filtering options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              placeholder="Search articles, keywords, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400/50 focus:ring-cyan-400/25"
            />
          </div>

          {/* Filter Selects */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-white/80 mb-2">Source</label>
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="reuters">Reuters</SelectItem>
                  <SelectItem value="bbc">BBC</SelectItem>
                  <SelectItem value="cnn">CNN</SelectItem>
                  <SelectItem value="espn">ESPN</SelectItem>
                  <SelectItem value="tmz">TMZ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-2">Topic</label>
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="All Topics" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                  <SelectItem value="all">All Topics</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="politics">Politics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-2">Credibility</label>
              <Select value={selectedCredibility} onValueChange={setSelectedCredibility}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="high">High Credibility</SelectItem>
                  <SelectItem value="medium">Medium Credibility</SelectItem>
                  <SelectItem value="low">Low Credibility</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-white/60">
              Showing {filteredArticles.length} of {newsArticles.length} articles
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedSource('all');
                setSelectedTopic('all');
                setSelectedCredibility('all');
              }}
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
            >
              Clear All Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle */}
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20">
          <TabsTrigger value="grid" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
            Grid View
          </TabsTrigger>
          <TabsTrigger value="list" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
            List View
          </TabsTrigger>
        </TabsList>

        {/* Articles Display */}
        <TabsContent value="grid" className="mt-6">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border border-white/20 bg-white/5 backdrop-blur-sm animate-pulse">
                  <div className="h-48 bg-white/10 rounded-t-lg"></div>
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-white/20 rounded"></div>
                    <div className="h-3 bg-white/10 rounded w-3/4"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-white/10 rounded w-16"></div>
                      <div className="h-6 bg-white/10 rounded w-16"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.map((article) => (
                <Card
                  key={article.id}
                  className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 cursor-pointer group"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {article.verified && (
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                          ✓ Verified
                        </Badge>
                      )}
                      {article.trending && (
                        <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <Globe className="w-3 h-3" />
                      <span>{article.source}</span>
                      <Calendar className="w-3 h-3 ml-2" />
                      <span>{new Date(article.date).toLocaleDateString()}</span>
                    </div>
                    
                    <h3 className="text-white line-clamp-2 group-hover:text-cyan-300 transition-colors duration-300">
                      {article.title}
                    </h3>
                    
                    <p className="text-white/70 text-sm line-clamp-2">
                      {article.summary}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      <Badge className={getTopicColor(article.topic)}>
                        {article.topic}
                      </Badge>
                      <Badge className={getCredibilityColor(article.credibility)}>
                        {article.credibility} credibility
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{article.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{article.comments}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400" />
                          <span>{article.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                      <User className="w-3 h-3 text-white/50" />
                      <span className="text-xs text-white/60">{article.author}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <div className="space-y-4">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <Card key={i} className="border border-white/20 bg-white/5 backdrop-blur-sm animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-16 bg-white/10 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-white/20 rounded w-3/4"></div>
                        <div className="h-3 bg-white/10 rounded w-1/2"></div>
                        <div className="flex gap-2">
                          <div className="h-5 bg-white/10 rounded w-12"></div>
                          <div className="h-5 bg-white/10 rounded w-12"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              filteredArticles.map((article) => (
                <Card
                  key={article.id}
                  className="border border-white/20 bg-gradient-to-r from-white/10 via-white/5 to-transparent backdrop-blur-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 cursor-pointer group"
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-24 h-16 object-cover rounded transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="text-white group-hover:text-cyan-300 transition-colors duration-300 flex-1 pr-4">
                            {article.title}
                          </h3>
                          <div className="flex gap-1 flex-shrink-0">
                            {article.verified && (
                              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                                ✓
                              </Badge>
                            )}
                            {article.trending && (
                              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                                <TrendingUp className="w-2 h-2" />
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-white/70 text-sm line-clamp-1">
                          {article.summary}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Badge className={getTopicColor(article.topic)}>
                              {article.topic}
                            </Badge>
                            <Badge className={getCredibilityColor(article.credibility)}>
                              {article.credibility}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-white/60">
                            <span>{article.source}</span>
                            <span>{new Date(article.date).toLocaleDateString()}</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400" />
                              <span>{article.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* No Results */}
      {!isLoading && filteredArticles.length === 0 && (
        <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
          <CardContent className="text-center py-12">
            <Filter className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <h3 className="text-white text-lg mb-2">No articles found</h3>
            <p className="text-white/60 mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedSource('all');
                setSelectedTopic('all');
                setSelectedCredibility('all');
              }}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}