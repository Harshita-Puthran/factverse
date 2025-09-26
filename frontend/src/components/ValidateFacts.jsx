import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { CheckCircle } from 'lucide-react';

export function ValidateFacts() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-300/30">
            <CheckCircle className="w-6 h-6 text-violet-300" />
          </div>
          <h1 className="text-3xl font-medium bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            Validate Facts
          </h1>
        </div>
        <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
          Cross-reference facts with trusted sources
        </p>
      </div>

      <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Fact Validation</CardTitle>
          <CardDescription className="text-white/60">
            This feature will validate facts against trusted sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/70">Fact validation functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}