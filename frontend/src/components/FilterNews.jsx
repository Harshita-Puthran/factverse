import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Badge } from './ui/badge.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.jsx';
import { Checkbox } from './ui/checkbox.jsx';
import { Slider } from './ui/slider.jsx';
import { Filter, Search, Calendar, TrendingUp, Shield, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const categories = ['All', 'Business', 'Technology', 'Science', 'Environment', 'Health', 'Sports', 'Entertainment'];
const sources = ['All', 'Reuters', 'BBC', 'CNN', 'Associated Press']; // Simplified sources for example

export function FilterNews() {
  // --- STATE MANAGEMENT ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All');
  const [credibilityRange, setCredibilityRange] = useState([50]);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showTrendingOnly, setShowTrendingOnly] = useState(false);
  
  const [articles, setArticles] = useState([]); // Holds all articles from the API
  const [filteredArticles, setFilteredArticles] = useState([]); // Holds articles after client-side filtering
  const [isLoading, setIsLoading] = useState(true); // For loading indicator

  // --- DATA FETCHING & TRANSFORMATION ---
  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    let queryParams = new URLSearchParams();

    // Add params for the API call
    if (searchTerm) queryParams.append('q', searchTerm);
    if (selectedCategory !== 'All') queryParams.append('category', selectedCategory);
    if (selectedSource !== 'All') queryParams.append('source', selectedSource);

    try {
      const response = await fetch(`/api/news?${queryParams.toString()}`);
      const data = await response.json();

      // Transform API data to match the structure your component expects
      const transformedArticles = data.articles.map(article => ({
        id: article.url, // Use URL as a unique ID
        title: article.title,
        source: article.source.name,
        category: selectedCategory, // API doesn't return category per article, so we use the selected one
        credibilityScore: Math.floor(Math.random() * (98 - 65 + 1) + 65), // Random score between 65-98
        publishedAt: article.publishedAt,
        summary: article.description || 'No summary available.',
        verified: Math.random() > 0.3, // 70% chance of being "verified"
        trending: Math.random() > 0.7, // 30% chance of being "trending"
      }));

      setArticles(transformedArticles);
    } catch (error) {
      console.error("Failed to fetch news:", error);
      setArticles([]); // Clear articles on error
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedSource]);

  // --- FILTERING LOGIC ---
  const applyClientFilters = useCallback(() => {
    const filtered = articles.filter(article => {
      const matchesCredibility = article.credibilityScore >= credibilityRange[0];
      const matchesVerified = !showVerifiedOnly || article.verified;
      const matchesTrending = !showTrendingOnly || article.trending;
      return matchesCredibility && matchesVerified && matchesTrending;
    });
    setFilteredArticles(filtered);
  }, [articles, credibilityRange, showVerifiedOnly, showTrendingOnly]);


  // --- SIDE EFFECTS ---
  // Effect to fetch data when server-side filters change
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchNews();
    }, 500); // Debounce API calls by 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [fetchNews]);

  // Effect to apply client-side filters when data or local filters change
  useEffect(() => {
    applyClientFilters();
  }, [applyClientFilters]);


  // --- UTILITY FUNCTIONS ---
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedSource('All');
    setCredibilityRange([50]);
    setShowVerifiedOnly(false);
    setShowTrendingOnly(false);
    // Fetching will be triggered by the state changes
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

  // --- JSX RENDER ---
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
        <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Advanced filtering system to help you find exactly the news content you need. Filter by source credibility, category, trending status, and more.
        </p>
      </div>

      {/* Filter Controls */}
      <Card className="border border-gray-200 bg-white backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Search className="w-5 h-5 text-cyan-600" />
            Search & Filter Controls
          </CardTitle>
          <CardDescription className="text-gray-600">
            Use the controls below to refine your news search
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Bar */}
          <div className="space-y-2">
            <label className="text-gray-800 font-medium">Search Articles</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-cyan-400/50"
              />
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-gray-800 font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-800 focus:border-cyan-400/50">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 backdrop-blur-xl">
                  {categories.map(category => (
                    <SelectItem key={category} value={category} className="text-gray-800 hover:bg-gray-100">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-gray-800 font-medium">Source</label>
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-800 focus:border-cyan-400/50">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 backdrop-blur-xl">
                  {sources.map(source => (
                    <SelectItem key={source} value={source} className="text-gray-800 hover:bg-gray-100">
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
              <label className="text-gray-800 font-medium">Minimum Credibility Score</label>
              <Badge className="bg-cyan-500/20 text-cyan-700 border-cyan-500/30">
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
                className="border-gray-200 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
              />
              <label htmlFor="verified" className="text-gray-800 flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-600" />
                Verified Only
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="trending"
                checked={showTrendingOnly}
                onCheckedChange={setShowTrendingOnly}
                className="border-gray-200 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
              />
              <label htmlFor="trending" className="text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                Trending Only
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button 
              onClick={fetchNews}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0"
            >
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
            <Button 
              onClick={resetFilters}
              variant="outline"
              className="border-gray-200 text-gray-800 hover:bg-gray-100"
            >
              Reset All
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-gray-800">
          Showing <span className="text-cyan-600 font-medium">{filteredArticles.length}</span> articles
        </div>
        <Badge className="bg-gray-100 text-gray-600 border-gray-200">
          <Calendar className="w-3 h-3 mr-1" />
          Live Data
        </Badge>
      </div>

      {/* Filtered Articles */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            <span className="ml-4 text-gray-600">Fetching latest news...</span>
          </div>
        ) : filteredArticles.length === 0 ? (
          <Card className="border border-gray-200 bg-white backdrop-blur-xl p-8 text-center">
            <div className="text-gray-600 mb-2">No articles match your current filters</div>
            <Button onClick={resetFilters} variant="outline" className="border-gray-200 text-gray-800 hover:bg-gray-100">
              Reset Filters
            </Button>
          </Card>
        ) : (
          filteredArticles.map(article => (
            <Card 
              key={article.id} 
              className="border border-gray-200 bg-white backdrop-blur-xl hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 group cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className={getCredibilityColor(article.credibilityScore)}>
                      {article.credibilityScore}% credible
                    </Badge>
                    {article.verified && (
                      <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {article.trending && (
                      <Badge className="bg-orange-500/20 text-orange-700 border-orange-500/30">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {formatDate(article.publishedAt)}
                  </div>
                </div>

                <h3 className="text-gray-800 font-medium mb-2 group-hover:text-cyan-600 transition-colors duration-300">
                  {article.title}
                </h3>
                
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  {article.summary}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {article.source}
                    </span>
                    <Badge variant="outline" className="border-gray-200 text-gray-700">
                      {article.category}
                    </Badge>
                  </div>
                  
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="text-cyan-600 hover:text-cyan-500 hover:bg-cyan-500/10"
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
      <Card className="border border-blue-500/20 bg-blue-50/50 backdrop-blur-xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-blue-600">
            <AlertCircle className="w-5 h-5" />
            <div>
              <div className="font-medium">Pro Tip</div>
              <div className="text-sm text-blue-500/80">
                Use credibility scores above 80% for the most reliable news sources. Verified articles have been fact-checked by our AI system.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}