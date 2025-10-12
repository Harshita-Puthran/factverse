import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2, AlertTriangle, Link } from 'lucide-react';

export function FactReferenceLinkGenerator() {
  const [searchTerm, setSearchTerm] = useState('');
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateLinks = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a topic to search for.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLinks([]);

    try {
      const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchTerm}&format=json&origin=*`);
      if (!response.ok) {
        throw new Error('Failed to fetch data from Wikipedia.');
      }
      const data = await response.json();
      const searchResults = data.query.search.map(item => ({
        title: item.title,
        url: `https://en.wikipedia.org/?curid=${item.pageid}`
      }));
      setLinks(searchResults.slice(0, 10)); // Show top 10 links
    } catch (err) {
      setError(err.message);
      console.error("Failed to generate links:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-green-500/20 border border-blue-300/30">
            <Link className="w-6 h-6 text-blue-300" />
          </div>
          <h1 className="text-3xl font-medium bg-gradient-to-r from-blue-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
            Fact Reference Link Generator
          </h1>
        </div>
        <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Enter a topic to generate credible reference links from Wikipedia for validation.
        </p>
      </div>

      <Card className="bg-slate-800/50 backdrop-blur-xl border border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Generate Links</CardTitle>
          <CardDescription className="text-slate-400">
            Enter a topic to find relevant Wikipedia articles.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter a topic..."
            className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            onClick={generateLinks}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white border-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Links'
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-500/30 bg-red-900/20 backdrop-blur-xl p-6">
           <div className="flex items-center gap-3 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <div>
              <div className="font-medium">Error</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        </Card>
      )}

      {links.length > 0 && !isLoading && (
        <Card className="bg-slate-800/50 backdrop-blur-xl border border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Generated Links</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}