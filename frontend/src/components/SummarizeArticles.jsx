import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { FileText } from 'lucide-react';

export function SummarizeArticles() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-300/30">
            <FileText className="w-6 h-6 text-emerald-300" />
          </div>
          <h1 className="text-3xl font-medium bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
            Summarize Articles
          </h1>
        </div>
        <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
          Get quick, intelligent summaries of news articles
        </p>
      </div>

      <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Article Summarization</CardTitle>
          <CardDescription className="text-white/60">
            This feature will provide intelligent article summaries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/70">Article summarization functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}