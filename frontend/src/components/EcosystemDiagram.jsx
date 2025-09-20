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
  Zap,
  Brain,
  Globe,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';

export function EcosystemDiagram({ onSectionClick }) {
  const [hoveredSection, setHoveredSection] = useState(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [activeConnections, setActiveConnections] = useState([]);

  // Animation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 6);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Connection animation
  useEffect(() => {
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], // Outer ring
      [0, 3], [1, 4], [2, 5] // Cross connections
    ];
    
    const timer = setTimeout(() => {
      setActiveConnections(connections[animationStep] || []);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [animationStep]);

  const ecosystemSections = [
    {
      id: 'filter',
      label: 'Filter News',
      icon: Filter,
      description: 'Smart filtering by source, topic, and credibility',
      position: { x: 50, y: 15 }, // Top center
      color: 'from-cyan-500 to-blue-500',
      iconColor: 'text-cyan-300',
      borderColor: 'border-cyan-400/30',
      glowColor: 'shadow-cyan-500/25'
    },
    {
      id: 'detect',
      label: 'Detect Fake News',
      icon: Shield,
      description: 'AI-powered fake news detection and analysis',
      position: { x: 85, y: 35 }, // Top right
      color: 'from-red-500 to-pink-500',
      iconColor: 'text-red-300',
      borderColor: 'border-red-400/30',
      glowColor: 'shadow-red-500/25'
    },
    {
      id: 'summarize',
      label: 'Summarize Articles',
      icon: FileText,
      description: 'Quick, intelligent article summaries',
      position: { x: 85, y: 65 }, // Bottom right
      color: 'from-emerald-500 to-green-500',
      iconColor: 'text-emerald-300',
      borderColor: 'border-emerald-400/30',
      glowColor: 'shadow-emerald-500/25'
    },
    {
      id: 'validate',
      label: 'Validate Facts',
      icon: CheckCircle,
      description: 'Cross-reference facts with trusted sources',
      position: { x: 50, y: 85 }, // Bottom center
      color: 'from-violet-500 to-purple-500',
      iconColor: 'text-violet-300',
      borderColor: 'border-violet-400/30',
      glowColor: 'shadow-violet-500/25'
    },
    {
      id: 'questions',
      label: 'User Questions',
      icon: HelpCircle,
      description: 'Community-driven Q&A and discussions',
      position: { x: 15, y: 65 }, // Bottom left
      color: 'from-amber-500 to-orange-500',
      iconColor: 'text-amber-300',
      borderColor: 'border-amber-400/30',
      glowColor: 'shadow-amber-500/25'
    },
    {
      id: 'feedback',
      label: 'Crowd Feedback',
      icon: Users,
      description: 'Collaborative fact-checking and ratings',
      position: { x: 15, y: 35 }, // Top left
      color: 'from-sky-500 to-blue-500',
      iconColor: 'text-sky-300',
      borderColor: 'border-sky-400/30',
      glowColor: 'shadow-sky-500/25'
    }
  ];

  const centralFeatures = [
    { icon: Brain, label: 'AI Intelligence', color: 'text-purple-400' },
    { icon: Globe, label: 'Global Sources', color: 'text-blue-400' },
    { icon: TrendingUp, label: 'Real-time Analysis', color: 'text-emerald-400' },
    { icon: Star, label: 'Quality Assurance', color: 'text-amber-400' }
  ];

  const handleSectionClick = (sectionId) => {
    if (onSectionClick) {
      onSectionClick(sectionId);
    }
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer Ring Connections */}
        {ecosystemSections.map((section, index) => {
          const nextIndex = (index + 1) % ecosystemSections.length;
          const nextSection = ecosystemSections[nextIndex];
          const isActive = activeConnections.includes(index) || activeConnections.includes(nextIndex);
          
          return (
            <line
              key={`ring-${index}`}
              x1={section.position.x}
              y1={section.position.y}
              x2={nextSection.position.x}
              y2={nextSection.position.y}
              stroke={isActive ? '#60a5fa' : '#334155'}
              strokeWidth={isActive ? "0.3" : "0.15"}
              strokeOpacity={isActive ? 0.8 : 0.3}
              filter={isActive ? "url(#glow)" : "none"}
              className="transition-all duration-500"
            />
          );
        })}

        {/* Central Hub Connections */}
        {ecosystemSections.map((section, index) => {
          const isActive = activeConnections.includes(index);
          return (
            <line
              key={`hub-${index}`}
              x1="50"
              y1="50"
              x2={section.position.x}
              y2={section.position.y}
              stroke={isActive ? '#8b5cf6' : '#475569'}
              strokeWidth={isActive ? "0.2" : "0.1"}
              strokeOpacity={isActive ? 0.6 : 0.2}
              strokeDasharray={isActive ? "2,1" : "1,2"}
              filter={isActive ? "url(#glow)" : "none"}
              className="transition-all duration-500"
            />
          );
        })}

        {/* Data Flow Animation */}
        {ecosystemSections.map((_, index) => (
          <circle
            key={`flow-${index}`}
            r="0.5"
            fill="#60a5fa"
            opacity="0.8"
            className="animate-pulse"
          >
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              begin={`${index * 0.5}s`}
            >
              <path d={`M50,50 L${ecosystemSections[index].position.x},${ecosystemSections[index].position.y}`} />
            </animateMotion>
          </circle>
        ))}
      </svg>

      {/* Central Hub */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Card className="w-32 h-32 border border-white/20 bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-xl rounded-full flex items-center justify-center group hover:scale-110 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-conic from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-full animate-spin-slow"></div>
          <div className="relative text-center">
            <div className="text-white mb-1">
              <Zap className="w-8 h-8 mx-auto animate-electric-pulse" />
            </div>
            <div className="text-xs text-white/80 font-medium">FactVerse</div>
            <div className="text-xs text-white/60">Core</div>
          </div>
          
          {/* Orbiting Features */}
          {centralFeatures.map((feature, index) => {
            const angle = (index * 90) - 90; // 90 degrees apart
            const radius = 40;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            
            return (
              <div
                key={index}
                className="absolute w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm animate-particle-orbit"
                style={{
                  left: `calc(50% + ${x}px - 12px)`,
                  top: `calc(50% + ${y}px - 12px)`,
                  animationDelay: `${index * 0.5}s`,
                  animationDuration: '8s'
                }}
              >
                <feature.icon className={`w-3 h-3 ${feature.color}`} />
              </div>
            );
          })}
        </Card>
      </div>

      {/* Ecosystem Sections */}
      {ecosystemSections.map((section, index) => {
        const Icon = section.icon;
        const isHighlighted = animationStep === index;
        const isHovered = hoveredSection === section.id;
        
        return (
          <div
            key={section.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{
              left: `${section.position.x}%`,
              top: `${section.position.y}%`
            }}
            onMouseEnter={() => setHoveredSection(section.id)}
            onMouseLeave={() => setHoveredSection(null)}
            onClick={() => handleSectionClick(section.id)}
          >
            <Card 
              className={`w-24 h-24 border ${section.borderColor} bg-gradient-to-br ${section.color}/20 backdrop-blur-xl rounded-lg flex flex-col items-center justify-center transition-all duration-500 ${
                isHighlighted || isHovered ? `scale-125 ${section.glowColor} shadow-xl` : 'scale-100'
              } hover:scale-125 hover:shadow-xl group-hover:${section.glowColor}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg"></div>
              <div className="relative z-10 text-center">
                <Icon 
                  className={`w-6 h-6 ${section.iconColor} mx-auto mb-1 transition-all duration-300 ${
                    isHighlighted ? 'animate-bounce' : isHovered ? 'animate-pulse' : ''
                  }`} 
                />
                <div className="text-xs text-white font-medium leading-tight">
                  {section.label.split(' ').map((word, i) => (
                    <div key={i}>{word}</div>
                  ))}
                </div>
              </div>
              
              {/* Pulse Ring Animation */}
              {isHighlighted && (
                <>
                  <div className="absolute inset-0 border border-white/30 rounded-lg animate-pulse-ring"></div>
                  <div className="absolute inset-0 border border-white/20 rounded-lg animate-pulse-ring" style={{animationDelay: '0.5s'}}></div>
                </>
              )}
            </Card>

            {/* Description Tooltip */}
            {isHovered && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/80 backdrop-blur-sm text-white text-xs rounded-lg border border-white/20 whitespace-nowrap z-50">
                {section.description}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
              </div>
            )}
          </div>
        );
      })}

      {/* Information Panel */}
      <div className="absolute bottom-4 left-4 right-4">
        <Card className="border border-white/20 bg-gradient-to-r from-white/10 via-white/5 to-transparent backdrop-blur-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-lg text-cyan-400">6</div>
                <div className="text-xs text-white/60">Core Functions</div>
              </div>
              <div className="text-center">
                <div className="text-lg text-emerald-400">AI</div>
                <div className="text-xs text-white/60">Powered</div>
              </div>
              <div className="text-center">
                <div className="text-lg text-purple-400">24/7</div>
                <div className="text-xs text-white/60">Monitoring</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-white/70 text-sm">System Online</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Floating Data Points */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/60 rounded-full animate-float"
          style={{
            left: `${20 + (i * 10)}%`,
            top: `${30 + Math.sin(i) * 20}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + i * 0.2}s`
          }}
        />
      ))}

      {/* Performance Indicators */}
      <div className="absolute top-4 right-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-white/60">
          <Clock className="w-3 h-3" />
          <span>Response: 0.8s</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/60">
          <TrendingUp className="w-3 h-3 text-emerald-400" />
          <span>Accuracy: 94%</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/60">
          <Users className="w-3 h-3 text-blue-400" />
          <span>Active: 1.2k</span>
        </div>
      </div>
    </div>
  );
}