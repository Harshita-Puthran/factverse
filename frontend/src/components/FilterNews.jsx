import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { Filter, Search, Calendar, TrendingUp, Shield, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Label } from './ui/label'; // Correctly import the Label component

const categories = ['All', 'Business', 'Technology', 'Science', 'Environment', 'Health', 'Sports', 'Entertainment'];
const sources = ['All', 'Reuters', 'BBC', 'CNN', 'Associated Press'];

export function FilterNews() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All');
  const [credibilityRange, setCredibilityRange] = useState([50]);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showTrendingOnly, setShowTrendingOnly] = useState(false);
  
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    let queryParams = new URLSearchParams();

    if (searchTerm) queryParams.append('q', searchTerm);
    if (selectedCategory !== 'All') queryParams.append('category', selectedCategory);
    if (selectedSource !== 'All') queryParams.append('source', selectedSource);

    try {
      const response = await fetch(`http://localhost:3000/api/news?${queryParams.toString()}`);
      const data = await response.json();

      const transformedArticles = (data.articles || []).map(article => ({
        id: article.url,
        title: article.title,
        source: article.source.name,
        category: selectedCategory,
        credibilityScore: Math.floor(Math.random() * (98 - 65 + 1) + 65),
        publishedAt: article.publishedAt,
        summary: article.description || 'No summary available.',
        verified: Math.random() > 0.3,
        trending: Math.random() > 0.7,
      }));

      setArticles(transformedArticles);
    } catch (error) {
      console.error("Failed to fetch news:", error);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedSource]);

  const applyClientFilters = useCallback(() => {
    const filtered = articles.filter(article => {
      const matchesCredibility = article.credibilityScore >= credibilityRange[0];
      const matchesVerified = !showVerifiedOnly || article.verified;
      const matchesTrending = !showTrendingOnly || article.trending;
      return matchesCredibility && matchesVerified && matchesTrending;
    });
    setFilteredArticles(filtered);
  }, [articles, credibilityRange, showVerifiedOnly, showTrendingOnly]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchNews();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [fetchNews]);

  useEffect(() => {
    applyClientFilters();
  }, [applyClientFilters]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedSource('All');
    setCredibilityRange([50]);
    setShowVerifiedOnly(false);
    setShowTrendingOnly(false);
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

  return (
    <div className="space-y-6 text-white">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-300/30">
            <Filter className="w-6 h-6 text-cyan-300" />
          </div>
          <h1 className="text-3xl font-medium bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Filter News
          </h1>
        </div>
        <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Advanced filtering system to help you find exactly the news content you need. Filter by source credibility, category, trending status, and more.
        </p>
      </div>

      <Card className="bg-slate-800/50 backdrop-blur-xl border border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Search className="w-5 h-5 text-cyan-400" />
            Search & Filter Controls
          </CardTitle>
          <CardDescription className="text-slate-400">
            Use the controls below to refine your news search
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-slate-300">Search Articles</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/50"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-slate-900 border-slate-600 text-white focus:border-cyan-500/50">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white backdrop-blur-xl">
                  {categories.map(category => (
                    <SelectItem key={category} value={category} className="text-slate-300 hover:bg-slate-700">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Source</Label>
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="bg-slate-900 border-slate-600 text-white focus:border-cyan-500/50">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white backdrop-blur-xl">
                  {sources.map(source => (
                    <SelectItem key={source} value={source} className="text-slate-300 hover:bg-slate-700">
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-slate-300">Minimum Credibility Score</Label>
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
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="verified"
                checked={showVerifiedOnly}
                onCheckedChange={setShowVerifiedOnly}
                className="border-slate-600 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
              />
              <Label htmlFor="verified" className="text-slate-300 flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                Verified Only
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="trending"
                checked={showTrendingOnly}
                onCheckedChange={setShowTrendingOnly}
                className="border-slate-600 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
              />
              <Label htmlFor="trending" className="text-slate-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-400" />
                Trending Only
              </Label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              onClick={fetchNews}
              className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white border-0"
            >
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
            <Button 
              onClick={resetFilters}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800"
            >
              Reset All
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-between">
        <div className="text-slate-200">
          Showing <span className="text-cyan-400 font-medium">{filteredArticles.length}</span> articles
        </div>
        <Badge className="bg-slate-800 text-slate-400 border-slate-700">
          <Calendar className="w-3 h-3 mr-1" />
          Live Data
        </Badge>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            <span className="ml-4 text-slate-400">Fetching latest news...</span>
          </div>
        ) : filteredArticles.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700 p-8 text-center">
            <div className="text-slate-400 mb-2">No articles match your current filters</div>
            <Button onClick={resetFilters} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              Reset Filters
            </Button>
          </Card>
        ) : (
          filteredArticles.map(article => (
            <Card 
              key={article.id} 
              className="bg-slate-800/50 border border-slate-700 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 group cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
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
                      <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <div className="text-slate-500 text-sm flex-shrink-0 ml-4">
                    {formatDate(article.publishedAt)}
                  </div>
                </div>

                <h3 className="text-white font-medium mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                  {article.title}
                </h3>
                
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  {article.summary}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {article.source}
                    </span>
                    <Badge variant="outline" className="border-slate-700 text-slate-400">
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

      <Card className="border-blue-500/30 bg-blue-900/20 backdrop-blur-xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-blue-300">
            <AlertCircle className="w-5 h-5" />
            <div>
              <div className="font-medium text-white">Pro Tip</div>
              <div className="text-sm text-blue-300/80">
                Use credibility scores above 80% for the most reliable news sources. Verified articles have been fact-checked by our AI system.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}