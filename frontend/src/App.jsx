import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card.jsx';
import { Badge } from './components/ui/badge.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs.jsx';
import { FilterNews } from './components/FilterNews.jsx';
import { DetectFakeNews } from './components/DetectFakeNews.jsx';
import { SummarizeArticles } from './components/SummarizeArticles.jsx';
import { ValidateFacts } from './components/ValidateFacts.jsx';
import { UserQuestions } from './components/UserQuestions.jsx';
import { CrowdFeedback } from './components/CrowdFeedback.jsx';
import { EcosystemDiagram } from './components/EcosystemDiagram.jsx';
import { InteractiveLogo } from './components/InteractiveLogo.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [clickEffect, setClickEffect] = useState({ show: false, x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [animatedStats, setAnimatedStats] = useState({
    articles: 0,
    users: 0,
    queue: 0
  });

  // Mouse tracking for interactive effects
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Click effect animation
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setClickEffect({
      show: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setTimeout(() => setClickEffect({ show: false, x: 0, y: 0 }), 1000);
  };

  // Animated counter effect
  useEffect(() => {
    const targets = { articles: 12847, users: 8924, queue: 47 };
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedStats({
        articles: Math.floor(targets.articles * easeOut),
        users: Math.floor(targets.users * easeOut),
        queue: Math.floor(targets.queue * easeOut)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(targets);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [activeTab]);

  const sections = [
    { id: 'dashboard', label: 'Home', icon: FileText },
    { id: 'filter', label: 'Filter News', icon: Filter },
    { id: 'detect', label: 'Detect Fake News', icon: Shield },
    { id: 'summarize', label: 'Summarize Articles', icon: FileText },
    { id: 'validate', label: 'Validate Facts', icon: CheckCircle },
    { id: 'questions', label: 'User Questions', icon: HelpCircle },
    { id: 'feedback', label: 'Crowd Feedback', icon: Users },
  ];

  const featureCards = [
    {
      id: 'filter',
      title: 'Filter News',
      description: 'Smart filtering by source, topic, and credibility',
      icon: Filter,
      iconColor: 'text-cyan-300',
      titleColor: 'text-white font-semibold drop-shadow-lg',
      descColor: 'text-cyan-50/90 drop-shadow-md',
      bgGradient: 'bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20',
      borderColor: 'border-cyan-300/30',
      glowColor: 'shadow-cyan-500/25'
    },
    {
      id: 'detect',
      title: 'Detect Fake News',
      description: 'AI-powered fake news detection and analysis',
      icon: Shield,
      iconColor: 'text-red-300',
      titleColor: 'text-white font-semibold drop-shadow-lg',
      descColor: 'text-red-50/90 drop-shadow-md',
      bgGradient: 'bg-gradient-to-br from-red-500/20 via-pink-500/20 to-rose-500/20',
      borderColor: 'border-red-300/30',
      glowColor: 'shadow-red-500/25'
    },
    {
      id: 'summarize',
      title: 'Summarize Articles',
      description: 'Quick, intelligent article summaries',
      icon: FileText,
      iconColor: 'text-emerald-300',
      titleColor: 'text-white font-semibold drop-shadow-lg',
      descColor: 'text-emerald-50/90 drop-shadow-md',
      bgGradient: 'bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20',
      borderColor: 'border-emerald-300/30',
      glowColor: 'shadow-emerald-500/25'
    },
    {
      id: 'validate',
      title: 'Validate Facts',
      description: 'Cross-reference facts with trusted sources',
      icon: CheckCircle,
      iconColor: 'text-violet-300',
      titleColor: 'text-white font-semibold drop-shadow-lg',
      descColor: 'text-violet-50/90 drop-shadow-md',
      bgGradient: 'bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-fuchsia-500/20',
      borderColor: 'border-violet-300/30',
      glowColor: 'shadow-violet-500/25'
    },
    {
      id: 'questions',
      title: 'User Questions',
      description: 'Community-driven Q&A and discussions',
      icon: HelpCircle,
      iconColor: 'text-amber-300',
      titleColor: 'text-white font-semibold drop-shadow-lg',
      descColor: 'text-amber-50/90 drop-shadow-md',
      bgGradient: 'bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-yellow-500/20',
      borderColor: 'border-amber-300/30',
      glowColor: 'shadow-amber-500/25'
    },
    {
      id: 'feedback',
      title: 'Crowd Feedback',
      description: 'Collaborative fact-checking and ratings',
      icon: Users,
      iconColor: 'text-sky-300',
      titleColor: 'text-white font-semibold drop-shadow-lg',
      descColor: 'text-sky-50/90 drop-shadow-md',
      bgGradient: 'bg-gradient-to-br from-sky-500/20 via-blue-500/20 to-indigo-500/20',
      borderColor: 'border-sky-300/30',
      glowColor: 'shadow-sky-500/25'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <InteractiveLogo size="sm" showText={true} />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Button
                  key={section.id}
                  variant={activeTab === section.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(section.id)}
                  className={`gap-2 transition-all duration-300 hover:scale-105 text-white ${
                    activeTab === section.id 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-white/20 shadow-lg' 
                      : 'hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-all duration-300 text-white ${
                    activeTab === section.id ? 'text-cyan-300' : ''
                  } hover:scale-110`} />
                  <span className="text-white">{section.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/30 backdrop-blur-xl">
            <nav className="container mx-auto px-4 py-3 grid grid-cols-2 gap-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <Button
                    key={section.id}
                    variant={activeTab === section.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setActiveTab(section.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`gap-2 justify-start transition-all duration-300 text-white ${
                      activeTab === section.id 
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-white/20' 
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 text-white ${activeTab === section.id ? 'text-cyan-300' : ''}`} />
                    <span className="text-white">{section.label}</span>
                  </Button>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Central Card with Rotating Carousel */}
            <div 
              className="relative flex items-center justify-center min-h-[550px] overflow-hidden cursor-none"
              onMouseEnter={() => setIsCarouselPaused(true)}
              onMouseLeave={() => setIsCarouselPaused(false)}
              onMouseMove={handleMouseMove}
              onClick={handleClick}
            >
              {/* Interactive Mouse Follower */}
              <div 
                className="absolute w-8 h-8 bg-gradient-to-r from-cyan-400/30 to-purple-400/30 rounded-full pointer-events-none z-50 transition-all duration-300 ease-out"
                style={{
                  left: `${mousePosition.x - 16}px`,
                  top: `${mousePosition.y - 16}px`,
                  transform: `scale(${hoveredCard ? 1.5 : 1})`,
                }}
              />
              
              {/* Click Ripple Effect */}
              {clickEffect.show && (
                <div 
                  className="absolute w-4 h-4 border-2 border-white/50 rounded-full pointer-events-none z-40 animate-ping"
                  style={{
                    left: `${clickEffect.x - 8}px`,
                    top: `${clickEffect.y - 8}px`,
                  }}
                />
              )}
              {/* Ambient Glow Background */}
              <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent opacity-60 blur-3xl"></div>
              
              {/* Floating Particles */}
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 25 }).map((_, i) => {
                  const colors = ['bg-cyan-400/30', 'bg-purple-400/30', 'bg-pink-400/30', 'bg-emerald-400/30', 'bg-orange-400/30'];
                  const sizes = ['w-1 h-1', 'w-2 h-2', 'w-1.5 h-1.5'];
                  return (
                    <div
                      key={i}
                      className={`absolute ${colors[i % colors.length]} ${sizes[i % sizes.length]} rounded-full animate-float`}
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${4 + Math.random() * 3}s`
                      }}
                    />
                  );
                })}
              </div>
              
              {/* Decorative Rings */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/5 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/10 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-full"></div>
              </div>
              
              {/* Corner Accent Elements */}
              <div className="absolute top-10 left-10 w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-300/20 backdrop-blur-sm animate-glow"></div>
              <div className="absolute top-10 right-10 w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-300/20 backdrop-blur-sm animate-glow" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-10 left-10 w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg border border-emerald-300/20 backdrop-blur-sm animate-glow" style={{animationDelay: '2s'}}></div>
              <div className="absolute bottom-10 right-10 w-12 h-12 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg border border-orange-300/20 backdrop-blur-sm animate-glow" style={{animationDelay: '3s'}}></div>
              
              {/* Additional Decorative Elements */}
              <div className="absolute top-1/4 left-8 w-3 h-3 bg-cyan-400/40 rounded-full animate-pulse"></div>
              <div className="absolute top-1/3 right-8 w-2 h-2 bg-purple-400/40 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute bottom-1/4 left-6 w-4 h-4 bg-emerald-400/40 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-1/3 right-6 w-2.5 h-2.5 bg-orange-400/40 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
              
              {/* Grid Pattern Overlay */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}></div>
              
              {/* Central FactVerse Card */}
              <Card className="relative z-10 w-80 h-80 flex flex-col items-center justify-center text-center shadow-2xl border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10"></div>
                <CardContent className="relative space-y-4 p-6 flex flex-col items-center">
                  <InteractiveLogo size="lg" />
                  <div>
                    <h2 className="text-3xl font-medium mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      FactVerse
                    </h2>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Your trusted platform for news verification and fact-checking
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Rotating Feature Cards */}
              <div className={`absolute inset-0 ${isCarouselPaused ? 'animate-spin-paused' : 'animate-spin-slow'}`}>
                {featureCards.map((feature, index) => {
                  const Icon = feature.icon;
                  const angle = (index * 60) - 90; // 60 degrees apart, starting from top
                  const radius = 240; // Distance from center
                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = Math.sin((angle * Math.PI) / 180) * radius;
                  
                  return (
                    <Card
                      key={feature.id}
                      className={`absolute w-44 h-28 cursor-pointer transition-all duration-500 hover:scale-110 hover:shadow-2xl ${feature.bgGradient} ${feature.borderColor} ${feature.glowColor} border backdrop-blur-sm ${isCarouselPaused ? 'animate-spin-reverse-paused' : 'animate-spin-reverse-slow'} hover:shadow-xl group`}
                      style={{
                        left: `calc(50% + ${x}px - 5.5rem)`,
                        top: `calc(50% + ${y}px - 3.5rem)`,
                        transform: hoveredCard === feature.id ? 'scale(1.15)' : 'scale(1)',
                      }}
                      onClick={() => {
                        setActiveTab(feature.id);
                        // Add click animation
                        setClickEffect({
                          show: true,
                          x: mousePosition.x,
                          y: mousePosition.y
                        });
                      }}
                      onMouseEnter={() => setHoveredCard(feature.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <CardContent className="p-3 h-full flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent group-hover:from-white/10"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className={`w-4 h-4 ${feature.iconColor} drop-shadow-lg group-hover:scale-110 transition-transform duration-300`} />
                            <h3 className={`${feature.titleColor} text-xs transition-all duration-300 group-hover:text-sm`}>{feature.title}</h3>
                          </div>
                          <p className={`text-xs ${feature.descColor} leading-tight transition-all duration-300 group-hover:text-opacity-100`}>
                            {feature.description}
                          </p>
                        </div>
                        {/* Hover glow effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.iconColor.replace('text-', 'from-')}10 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Interactive Feature Highlights */}
            <div className="grid md:grid-cols-4 gap-3 mt-8">
              <Card className="border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-sm p-4 text-center cursor-pointer hover:scale-105 transition-all duration-300 group hover:shadow-lg hover:shadow-purple-500/25">
                <div className="text-purple-400 text-2xl mb-2 group-hover:animate-bounce">⚡</div>
                <div className="text-white text-sm font-medium drop-shadow-lg">Real-time Analysis</div>
                <div className="text-purple-200/80 text-xs mt-1">Lightning fast processing</div>
              </Card>
              <Card className="border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm p-4 text-center cursor-pointer hover:scale-105 transition-all duration-300 group hover:shadow-lg hover:shadow-cyan-500/25">
                <div className="text-cyan-400 text-2xl mb-2 group-hover:animate-pulse">🔍</div>
                <div className="text-white text-sm font-medium drop-shadow-lg">AI Detection</div>
                <div className="text-cyan-200/80 text-xs mt-1">Advanced algorithms</div>
              </Card>
              <Card className="border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-green-500/10 backdrop-blur-sm p-4 text-center cursor-pointer hover:scale-105 transition-all duration-300 group hover:shadow-lg hover:shadow-emerald-500/25">
                <div className="text-emerald-400 text-2xl mb-2 group-hover:animate-spin">📊</div>
                <div className="text-white text-sm font-medium drop-shadow-lg">Data Insights</div>
                <div className="text-emerald-200/80 text-xs mt-1">Comprehensive analytics</div>
              </Card>
              <Card className="border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-amber-500/10 backdrop-blur-sm p-4 text-center cursor-pointer hover:scale-105 transition-all duration-300 group hover:shadow-lg hover:shadow-orange-500/25">
                <div className="text-orange-400 text-2xl mb-2 group-hover:animate-pulse">🤝</div>
                <div className="text-white text-sm font-medium drop-shadow-lg">Community Driven</div>
                <div className="text-orange-200/80 text-xs mt-1">Collaborative verification</div>
              </Card>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <Card className="border border-red-500/20 bg-gradient-to-br from-red-500/10 via-pink-500/5 to-transparent backdrop-blur-sm hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Shield className="w-5 h-5 text-red-400" />
                    Fact-Checking
                  </CardTitle>
                  <CardDescription className="text-white/60 text-sm">
                    AI-powered detection and verification
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80 text-sm">Articles Verified</span>
                      <Badge className="bg-red-500/20 text-red-300 border-red-500/30 animate-pulse">{animatedStats.articles.toLocaleString()}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80 text-sm">Accuracy Rate</span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">94.2%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="w-5 h-5 text-blue-400" />
                    Community
                  </CardTitle>
                  <CardDescription className="text-white/60 text-sm">
                    User contributions and feedback
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80 text-sm">Active Users</span>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 animate-pulse">{animatedStats.users.toLocaleString()}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80 text-sm">Feedback Score</span>
                      <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">4.7/5</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent backdrop-blur-sm hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <FileText className="w-5 h-5 text-orange-400" />
                    Processing
                  </CardTitle>
                  <CardDescription className="text-white/60 text-sm">
                    Real-time article analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80 text-sm">Queue Length</span>
                      <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 animate-pulse">{animatedStats.queue}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80 text-sm">Avg. Process Time</span>
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">2.3s</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interactive Bottom Status */}
            <div className="mt-8 flex justify-center items-center gap-8">
              <div className="flex items-center gap-2 text-white/60 text-sm cursor-pointer hover:text-white transition-colors duration-300 group">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse group-hover:w-3 group-hover:h-3 transition-all duration-300"></div>
                <span>System Online</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm cursor-pointer hover:text-white transition-colors duration-300 group">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse group-hover:w-3 group-hover:h-3 transition-all duration-300" style={{animationDelay: '0.5s'}}></div>
                <span>24/7 Monitoring</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm cursor-pointer hover:text-white transition-colors duration-300 group">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse group-hover:w-3 group-hover:h-3 transition-all duration-300" style={{animationDelay: '1s'}}></div>
                <span>Global Coverage</span>
              </div>
            </div>



            {/* Gradient Divider */}
            <div className="mt-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
        )}
        
        <div className={activeTab !== 'dashboard' ? 'bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 p-6' : ''}>
          {activeTab === 'filter' && <FilterNews />}
          {activeTab === 'detect' && <DetectFakeNews />}
          {activeTab === 'summarize' && <SummarizeArticles />}
          {activeTab === 'validate' && <ValidateFacts />}
          {activeTab === 'questions' && <UserQuestions />}
          {activeTab === 'feedback' && <CrowdFeedback />}
        </div>
      </main>
    </div>
  );
}