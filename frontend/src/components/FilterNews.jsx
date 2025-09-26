import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Badge } from './ui/badge.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.jsx';
import { Checkbox } from './ui/checkbox.jsx';
import { Slider } from './ui/slider.jsx';
import { Filter, Search, Calendar, TrendingUp, Shield, AlertCircle, CheckCircle } from 'lucide-react';

const mockArticles = [
  {
    id: '1',
    title: 'Climate Change Summit Reaches Historic Agreement',
    source: 'Reuters',
    category: 'Environment',
    credibilityScore: 95,
    publishedAt: '2024-01-15T10:30:00Z',
    summary: 'World leaders agree on ambitious carbon reduction targets in landmark climate summit.',
    verified: true,
    trending: true
  },
  {
    id: '2',
    title: 'New AI Technology Breakthrough in Medical Diagnosis',
    source: 'Nature',
    category: 'Science',
    credibilityScore: 92,
    publishedAt: '2024-01-14T14:20:00Z',
    summary: 'Researchers develop AI system that can detect diseases with 98% accuracy.',
    verified: true,
    trending: false
  },
  {
    id: '3',
    title: 'Controversial Social Media Policy Changes',
    source: 'TechBlog',
    category: 'Technology',
    credibilityScore: 67,
    publishedAt: '2024-01-13T09:15:00Z',
    summary: 'Platform announces new content moderation policies amid user backlash.',
    verified: false,
    trending: true
  },
  {
    id: '4',
    title: 'Economic Recovery Shows Positive Signs',
    source: 'Financial Times',
    category: 'Economics',
    credibilityScore: 88,
    publishedAt: '2024-01-12T16:45:00Z',
    summary: 'Latest indicators suggest sustained growth in key economic sectors.',
    verified: true,
    trending: false
  }
];

const categories = ['All', 'Politics', 'Technology', 'Science', 'Environment', 'Economics', 'Health', 'Sports'];
const sources = ['All', 'Reuters', 'BBC', 'CNN', 'Nature', 'Financial Times', 'TechBlog', 'Associated Press'];

export function FilterNews() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All');
  const [credibilityRange, setCredibilityRange] = useState([50]);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showTrendingOnly, setShowTrendingOnly] = useState(false);
  const [filteredArticles, setFilteredArticles] = useState(mockArticles);

  const applyFilters = () => {
    let filtered = mockArticles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.summary.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      const matchesSource = selectedSource === 'All' || article.source === selectedSource;
      const matchesCredibility = article.credibilityScore >= credibilityRange[0];
      const matchesVerified = !showVerifiedOnly || article.verified;
      const matchesTrending = !showTrendingOnly || article.trending;

      return matchesSearch && matchesCategory && matchesSource && matchesCredibility && matchesVerified && matchesTrending;
    });

    setFilteredArticles(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedSource('All');
    setCredibilityRange([50]);
    setShowVerifiedOnly(false);
    setShowTrendingOnly(false);
    setFilteredArticles(mockArticles);
  };

  const getCredibilityColor = (score) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 75) return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    if (score >= 60) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    return 'text-red-400 border-red-500/30 bg-red-500/10';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  React.useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedCategory, selectedSource, credibilityRange, showVerifiedOnly, showTrendingOnly]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-300/30">
            <Filter className="w-6 h-6 text-cyan-300" />
          </div>
          <h1 className="text-3xl font-medium bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Filter News
          </h1>
        </div>
        <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
          Advanced filtering system to help you find exactly the news content you need. Filter by source credibility, category, trending status, and more.
        </p>
      </div>

      {/* Filter Controls */}
      <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Search className="w-5 h-5 text-cyan-400" />
            Search & Filter Controls
          </CardTitle>
          <CardDescription className="text-white/60">
            Use the controls below to refine your news search
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Bar */}
          <div className="space-y-2">
            <label className="text-white/80 font-medium">Search Articles</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-white/50" />
              <Input
                placeholder="Search by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-cyan-400/50"
              />
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-white/80 font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-cyan-400/50">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800/95 border-white/10 backdrop-blur-xl">
                  {categories.map(category => (
                    <SelectItem key={category} value={category} className="text-white hover:bg-white/10">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-white/80 font-medium">Source</label>
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-cyan-400/50">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800/95 border-white/10 backdrop-blur-xl">
                  {sources.map(source => (
                    <SelectItem key={source} value={source} className="text-white hover:bg-white/10">
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Credibility Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-white/80 font-medium">Minimum Credibility Score</label>
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                {credibilityRange[0]}%+
              </Badge>
            </div>
            <Slider
              value={credibilityRange}
              onValueChange={setCredibilityRange}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>

          {/* Checkbox Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="verified"
                checked={showVerifiedOnly}
                onCheckedChange={setShowVerifiedOnly}
                className="border-white/20 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
              />
              <label htmlFor="verified" className="text-white/80 flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                Verified Only
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="trending"
                checked={showTrendingOnly}
                onCheckedChange={setShowTrendingOnly}
                className="border-white/20 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
              />
              <label htmlFor="trending" className="text-white/80 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                Trending Only
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button 
              onClick={applyFilters}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0"
            >
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
            <Button 
              onClick={resetFilters}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Reset All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-white/80">
          Showing <span className="text-cyan-400 font-medium">{filteredArticles.length}</span> of {mockArticles.length} articles
        </div>
        <Badge className="bg-white/10 text-white/80 border-white/20">
          <Calendar className="w-3 h-3 mr-1" />
          Last 7 days
        </Badge>
      </div>

      {/* Filtered Articles */}
      <div className="grid gap-4">
        {filteredArticles.length === 0 ? (
          <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl p-8 text-center">
            <div className="text-white/60 mb-2">No articles match your current filters</div>
            <Button 
              onClick={resetFilters}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Reset Filters
            </Button>
          </Card>
        ) : (
          filteredArticles.map(article => (
            <Card 
              key={article.id} 
              className="border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 group cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className={getCredibilityColor(article.credibilityScore)}>
                      {article.credibilityScore}% credible
                    </Badge>
                    {article.verified && (
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {article.trending && (
                      <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <div className="text-white/50 text-sm">
                    {formatDate(article.publishedAt)}
                  </div>
                </div>

                <h3 className="text-white font-medium mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                  {article.title}
                </h3>
                
                <p className="text-white/70 text-sm mb-4 leading-relaxed">
                  {article.summary}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {article.source}
                    </span>
                    <Badge variant="outline" className="border-white/20 text-white/70">
                      {article.category}
                    </Badge>
                  </div>
                  
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                  >
                    Read More →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Advanced Filters Info */}
      <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 backdrop-blur-xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-blue-300">
            <AlertCircle className="w-5 h-5" />
            <div>
              <div className="font-medium">Pro Tip</div>
              <div className="text-sm text-blue-200/80">
                Use credibility scores above 80% for the most reliable news sources. Verified articles have been fact-checked by our AI system.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}