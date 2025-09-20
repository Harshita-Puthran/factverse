import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { Users } from 'lucide-react';

export function CrowdFeedback() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 border border-sky-300/30">
            <Users className="w-6 h-6 text-sky-300" />
          </div>
          <h1 className="text-3xl font-medium bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Crowd Feedback
          </h1>
        </div>
        <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
          Collaborative fact-checking and community ratings
        </p>
      </div>

      <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Community Feedback</CardTitle>
          <CardDescription className="text-white/60">
            This feature will provide collaborative fact-checking and ratings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/70">Crowd feedback functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}