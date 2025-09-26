import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';

export function EcosystemDiagram() {
  return (
    <div className="space-y-6">
      <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Ecosystem Diagram</CardTitle>
          <CardDescription className="text-white/60">
            Visual representation of the FactVerse ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/70">Ecosystem diagram functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}