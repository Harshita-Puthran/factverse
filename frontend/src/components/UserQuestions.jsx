import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { HelpCircle } from 'lucide-react';

export function UserQuestions() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-300/30">
            <HelpCircle className="w-6 h-6 text-amber-300" />
          </div>
          <h1 className="text-3xl font-medium bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            User Questions
          </h1>
        </div>
        <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
          Community-driven Q&A and discussions
        </p>
      </div>

      <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Community Q&A</CardTitle>
          <CardDescription className="text-white/60">
            This feature will provide community-driven questions and answers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/70">User questions functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}