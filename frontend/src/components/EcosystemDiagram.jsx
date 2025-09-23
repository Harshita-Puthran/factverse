import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { 
  Filter, 
  Shield, 
  FileText, 
  CheckCircle, 
  HelpCircle, 
  Users,
  ArrowRight,
  Zap,
  Target,
  Brain,
  Globe,
  Eye,
  TrendingUp
} from 'lucide-react';

export function EcosystemDiagram({ onSectionSelect }) {
  const [activeNode, setActiveNode] = useState(null);
  const [connectionLines, setConnectionLines] = useState([]);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Define the ecosystem nodes
  const ecosystemNodes = [
    {
      id: 'filter',
      title: 'Filter News',
      description: 'Smart filtering by source credibility and topic relevance',
      icon: Filter,
      position: { x: 20, y: 30 },
      color: 'from-cyan-500 to-blue-500',
      connections: ['detect', 'summarize'],
      stats: { processed: '12.4K', accuracy: '94%' }
    },
    {
      id: 'detect',
      title: 'Detect Fake News',
      description: 'AI-powered analysis to identify misinformation patterns',
      icon: Shield,
      position: { x: 70, y: 20 },
      color: 'from-red-500 to-pink-500',
      connections: ['validate', 'feedback'],
      stats: { detected: '2.1K', accuracy: '92%' }
    },
    {
      id: 'summarize',
      title: 'Summarize Articles',
      description: 'Extract key insights and generate concise summaries',
      icon: FileText,
      position: { x: 15, y: 70 },
      color: 'from-emerald-500 to-green-500',
      connections: ['validate', 'questions'],
      stats: { summarized: '8.7K', saved: '45min' }
    },
    {
      id: 'validate',
      title: 'Validate Facts',
      description: 'Cross-reference claims with trusted databases',
      icon: CheckCircle,
      position: { x: 70, y: 75 },
      color: 'from-violet-500 to-purple-500',
      connections: ['questions', 'feedback'],
      stats: { validated: '15.2K', sources: '340' }
    },
    {
      id: 'questions',
      title: 'User Questions',
      description: 'Community-driven Q&A and expert discussions',
      icon: HelpCircle,
      position: { x: 45, y: 40 },
      color: 'from-amber-500 to-orange-500',
      connections: ['feedback'],
      stats: { answered: '3.8K', experts: '156' }
    },
    {
      id: 'feedback',
      title: 'Crowd Feedback',
      description: 'Collaborative rating and community validation',
      icon: Users,
      position: { x: 45, y: 60 },
      color: 'from-sky-500 to-blue-500',
      connections: [],
      stats: { contributors: '2.4K', consensus: '89%' }
    }
  ];

  // Central hub properties
  const centralHub = {
    title: 'FactVerse',
    description: 'AI-Powered News Verification Ecosystem',
    position: { x: 50, y: 50 },
    radius: 80
  };

  // Animation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 6);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Generate connection paths
  useEffect(() => {
    const lines = [];
    ecosystemNodes.forEach(node => {
      node.connections.forEach(targetId => {
        const target = ecosystemNodes.find(n => n.id === targetId);
        if (target) {
          lines.push({
            from: node.position,
            to: target.position,
            active: activeNode === node.id || activeNode === targetId
          });
        }
      });
    });
    setConnectionLines(lines);
  }, [activeNode]);

  const handleNodeClick = (nodeId) => {
    setActiveNode(activeNode === nodeId ? null : nodeId);
    if (onSectionSelect) {
      onSectionSelect(nodeId);
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-900/50 via-purple-900/30 to-slate-900/50 rounded-xl border border-white/10 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Animated Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connectionLines.map((line, index) => (
          <g key={index}>
            <line
              x1={`${line.from.x}%`}
              y1={`${line.from.y}%`}
              x2={`${line.to.x}%`}
              y2={`${line.to.y}%`}
              stroke={line.active ? 'url(#activeGradient)' : 'rgba(255,255,255,0.1)'}
              strokeWidth={line.active ? '2' : '1'}
              strokeDasharray={line.active ? '0' : '5,5'}
              className={line.active ? 'animate-pulse' : ''}
            />
            {line.active && (
              <circle
                r="3"
                fill="rgba(99, 230, 255, 0.8)"
                className="animate-ping"
              >
                <animateMotion
                  dur="2s"
                  repeatCount="indefinite"
                  path={`M ${line.from.x * 6} ${line.from.y * 6} L ${line.to.x * 6} ${line.to.y * 6}`}
                />
              </circle>
            )}
          </g>
        ))}
        
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(99, 230, 255)" />
            <stop offset="50%" stopColor="rgb(168, 85, 247)" />
            <stop offset="100%" stopColor="rgb(236, 72, 153)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Central Hub */}
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
        style={{ left: '50%', top: '50%' }}
      >
        <Card className="w-32 h-32 flex items-center justify-center border-2 border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative">
              {/* Rotating Rings */}
              <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-2 border border-purple-400/30 rounded-full animate-spin-reverse-slow"></div>
              
              {/* Central Icon */}
              <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-cyan-500/40 via-purple-500/40 to-pink-500/40 rounded-full flex items-center justify-center group-hover:animate-pulse">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="mt-2">
              <h3 className="text-white text-xs font-medium">FactVerse</h3>
              <p className="text-white/60 text-xs">AI Hub</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ecosystem Nodes */}
      {ecosystemNodes.map((node) => {
        const Icon = node.icon;
        const isActive = activeNode === node.id;
        const isHighlighted = animationPhase === ecosystemNodes.indexOf(node);
        
        return (
          <div
            key={node.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ 
              left: `${node.position.x}%`, 
              top: `${node.position.y}%` 
            }}
          >
            <Card 
              className={`w-24 h-24 flex items-center justify-center cursor-pointer transition-all duration-500 border backdrop-blur-xl
                ${isActive 
                  ? 'scale-110 shadow-2xl border-white/40 bg-gradient-to-br from-white/20 via-white/10 to-transparent' 
                  : isHighlighted
                    ? 'scale-105 shadow-lg border-white/30 bg-gradient-to-br from-white/15 via-white/8 to-transparent animate-pulse'
                    : 'scale-100 shadow-md border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent hover:scale-105'
                }`}
              onClick={() => handleNodeClick(node.id)}
            >
              <CardContent className="p-3 text-center">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${node.color} flex items-center justify-center mb-1 transition-all duration-300 ${isActive ? 'animate-pulse' : ''}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-white text-xs font-medium leading-tight">{node.title}</h4>
              </CardContent>
            </Card>

            {/* Floating Stats */}
            {isActive && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-30">
                <Card className="w-32 border border-white/20 bg-gradient-to-br from-black/80 via-black/60 to-transparent backdrop-blur-xl">
                  <CardContent className="p-2 text-center">
                    <p className="text-white/90 text-xs mb-1">{node.description}</p>
                    <div className="space-y-1">
                      {Object.entries(node.stats).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-white/60 capitalize">{key}:</span>
                          <span className="text-cyan-400">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );
      })}

      {/* Information Panel */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <Card className="border border-white/20 bg-gradient-to-br from-black/60 via-black/40 to-transparent backdrop-blur-xl">
          <CardContent className="p-4">
            {activeNode ? (
              <div className="space-y-2">
                {(() => {
                  const node = ecosystemNodes.find(n => n.id === activeNode);
                  const Icon = node.icon;
                  return (
                    <>
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${node.color} flex items-center justify-center`}>
                          <Icon className="w-3 h-3 text-white" />
                        </div>
                        <h3 className="text-white font-medium">{node.title}</h3>
                        <Button
                          size="sm"
                          onClick={() => onSectionSelect(node.id)}
                          className="ml-auto bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
                        >
                          <ArrowRight className="w-3 h-3 mr-1" />
                          Explore
                        </Button>
                      </div>
                      <p className="text-white/70 text-sm">{node.description}</p>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        {Object.entries(node.stats).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-cyan-400 font-medium">{value}</div>
                            <div className="text-white/60 text-xs capitalize">{key}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Brain className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-white font-medium">FactVerse Ecosystem</h3>
                </div>
                <p className="text-white/70 text-sm">
                  Click on any component to explore how our AI-powered verification system works
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-white/60 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span>Active Processing</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>Real-time Analysis</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>24/7 Monitoring</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Indicators */}
      <div className="absolute top-4 right-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-white/60 bg-black/40 backdrop-blur-xl px-3 py-1 rounded-full border border-white/20">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span>System Online</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/60 bg-black/40 backdrop-blur-xl px-3 py-1 rounded-full border border-white/20">
          <Zap className="w-3 h-3 text-cyan-400" />
          <span>AI Processing</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/60 bg-black/40 backdrop-blur-xl px-3 py-1 rounded-full border border-white/20">
          <Globe className="w-3 h-3 text-purple-400" />
          <span>Global Coverage</span>
        </div>
      </div>
    </div>
  );
}