import { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { FilterNews } from './components/FilterNews.jsx';
import { DetectFakeNews } from './components/DetectFakeNews.jsx';
import { SummarizeArticles } from './components/SummarizeArticles.jsx';
import { ValidateFacts } from './components/ValidateFacts.jsx';
import { UserQuestions } from './components/UserQuestions.jsx';
import { CrowdFeedback } from './components/CrowdFeedback.jsx';
import { 
  Filter, 
  Shield, 
  FileText, 
  CheckCircle, 
  HelpCircle, 
  Users, 
  Menu,
  X,
  User,
  Star,
  TrendingUp,
  Globe,
  Award,
  ChevronRight,
  Facebook,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({
    verified: 0,
    accuracy: 0,
    users: 0,
    sources: 0
  });

  // Feature carousel rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Animated stats
  useEffect(() => {
    if (activeSection === 'home') {
      const targets = { verified: 250000, accuracy: 94, users: 85000, sources: 450 };
      const duration = 2000;
      const steps = 60;
      const stepTime = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        setAnimatedStats({
          verified: Math.floor(targets.verified * easeOut),
          accuracy: Math.floor(targets.accuracy * easeOut),
          users: Math.floor(targets.users * easeOut),
          sources: Math.floor(targets.sources * easeOut)
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setAnimatedStats(targets);
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [activeSection]);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const features = [
    {
      id: 'filter',
      title: 'Filter News',
      description: 'AI-powered news filtering by credibility, source, and topic relevance',
      icon: Filter,
      color: 'text-blue-500'
    },
    {
      id: 'detect',
      title: 'Detect Fake News',
      description: 'Advanced machine learning algorithms detect misinformation',
      icon: Shield,
      color: 'text-red-500'
    },
    {
      id: 'summarize',
      title: 'Summarize Articles',
      description: 'Get concise, accurate summaries of complex news stories',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      id: 'validate',
      title: 'Validate Facts',
      description: 'Cross-reference facts with multiple trusted sources',
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      id: 'questions',
      title: 'User Questions',
      description: 'Community-driven Q&A and expert fact-checking discussions',
      icon: HelpCircle,
      color: 'text-red-600'
    },
    {
      id: 'feedback',
      title: 'Crowd Feedback',
      description: 'Collaborative verification through community input',
      icon: Users,
      color: 'text-blue-700'
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Journalist, CNN",
      content: "FactVerse has revolutionized how I verify sources. The AI detection is incredibly accurate.",
      rating: 5
    },
    {
      name: "Dr. Michael Chen",
      role: "Professor of Media Studies",
      content: "An essential tool for combating misinformation in the digital age.",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      role: "Fact-Checker, Reuters",
      content: "The collaborative features make fact-checking faster and more reliable.",
      rating: 5
    }
  ];

  if (activeSection !== 'home' && activeSection !== 'features' && activeSection !== 'about' && activeSection !== 'contact') {
    return (
      <div className="min-h-screen bg-white">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-red-500/5 animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Header */}
        <header className="relative z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-lg sticky top-0">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <span className="text-white font-bold">FV</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">FactVerse</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Button
                variant="ghost"
                onClick={() => setActiveSection('home')}
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 backdrop-blur-sm border border-transparent hover:border-blue-200 transition-all duration-300"
              >
                Back to Home
              </Button>
            </nav>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-700 hover:bg-blue-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden bg-white/90 backdrop-blur-xl px-4 py-3 space-y-2 border-t border-gray-200">
              <Button
                variant="ghost"
                onClick={() => {
                  setActiveSection('home');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                Back to Home
              </Button>
            </div>
          )}
        </header>

        {/* Dashboard Content */}
        <main className="relative z-10 container mx-auto px-4 py-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 p-6">
            {activeSection === 'filter' && <FilterNews />}
            {activeSection === 'detect' && <DetectFakeNews />}
            {activeSection === 'summarize' && <SummarizeArticles />}
            {activeSection === 'validate' && <ValidateFacts />}
            {activeSection === 'questions' && <UserQuestions />}
            {activeSection === 'feedback' && <CrowdFeedback />}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-red-500/5 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gray-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Fixed Navigation */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-lg z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <span className="text-white font-bold">FV</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">FactVerse</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm border ${
                  activeSection === item.id 
                    ? 'bg-gradient-to-r from-blue-500 to-red-500 text-white border-blue-400 shadow-lg shadow-blue-500/25' 
                    : 'text-gray-700 hover:text-blue-600 border-transparent hover:border-blue-200 hover:bg-blue-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <Button
              onClick={() => setActiveSection('features')}
              className="bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white px-6 py-2 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105"
            >
              Get Started
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-gray-700 hover:bg-blue-50 rounded-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-xl px-4 py-3 space-y-2 border-t border-gray-200">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-xl transition-all duration-300 ${
                  activeSection === item.id 
                    ? 'bg-gradient-to-r from-blue-500 to-red-500 text-white' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <Button
              onClick={() => {
                setActiveSection('features');
                setMobileMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white mt-2 rounded-xl"
            >
              Get Started
            </Button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {/* Home Section */}
        {activeSection === 'home' && (
          <>
            {/* Hero Section with Background Video */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
              {/* Background Video */}
              <div className="absolute inset-0 z-0">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(0.7) contrast(1.1)' }}
                  onError={(e) => {
                    // Fallback to image if video fails to load
                    e.target.style.display = 'none';
                    const fallbackImg = e.target.nextElementSibling;
                    if (fallbackImg) fallbackImg.style.display = 'block';
                  }}
                >
                  <source
                    src="https://player.vimeo.com/external/465522858.sd.mp4?s=b6bb6fb17e2f2a831b61b6b9b3f8f3a7b6e6b0bb&profile_id=164&oauth2_token_id=57447761"
                    type="video/mp4"
                  />
                  <source
                    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
                {/* Fallback image for when video fails to load */}
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1668536618600-754ef972b9b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzcm9vbSUyMGJyb2FkY2FzdCUyMHN0dWRpb3xlbnwxfHx8fDE3NTg1NjE4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="News broadcast studio background"
                  className="w-full h-full object-cover"
                  style={{ display: 'none', filter: 'brightness(0.7) contrast(1.1)' }}
                />
                {/* Enhanced gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-white/20 to-red-900/70"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-red-900/20"></div>
              </div>

              {/* Hero Content Container */}
              <div className="relative z-10 w-full">
                {/* Main Hero Content - Centered */}
                <div className="text-center text-white px-4 max-w-4xl mx-auto mb-20">
                  <div className="mb-8">
                    <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                      <span className="bg-gradient-to-r from-blue-400 via-white to-red-400 bg-clip-text text-transparent animate-glow">Fact</span>
                      <span className="bg-gradient-to-r from-red-400 via-white to-blue-400 bg-clip-text text-transparent animate-glow" style={{ animationDelay: '0.5s' }}>Verse</span>
                    </h1>
                    <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-red-500 mx-auto rounded-full mb-6 animate-pulse"></div>
                  </div>
                  
                  <p className="text-xl md:text-2xl mb-12 text-gray-100 leading-relaxed font-light">
                    The Ultimate Platform for <span className="text-blue-300 font-semibold">News Verification</span> and <span className="text-red-300 font-semibold">Fact-Checking</span>
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Button
                      onClick={() => setActiveSection('features')}
                      className="group bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-2xl shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40"
                    >
                      Explore Features
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                      onClick={() => setActiveSection('features')}
                      variant="outline"
                      className="border-2 border-white/70 text-white hover:bg-white/20 hover:border-white backdrop-blur-sm px-10 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      Start Verifying
                    </Button>
                  </div>
                </div>

                {/* Statistics Cards - Properly Centered Below */}
                <div className="px-4 xl:px-20 2xl:px-32">
                  <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                      <div className="bg-white/20 backdrop-blur-xl rounded-2xl border border-blue-300/30 p-4 md:p-6 text-center hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:border-blue-400/50 group">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent mb-2 group-hover:from-blue-300 group-hover:to-white transition-all duration-300">
                          {animatedStats.verified.toLocaleString()}+
                        </div>
                        <div className="text-gray-100 text-sm md:text-base font-medium">
                          Articles Verified
                        </div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-xl rounded-2xl border border-green-300/30 p-4 md:p-6 text-center hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:border-green-400/50 group">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent mb-2 group-hover:from-green-300 group-hover:to-emerald-200 transition-all duration-300">
                          {animatedStats.accuracy}%
                        </div>
                        <div className="text-gray-100 text-sm md:text-base font-medium">
                          Accuracy Rate
                        </div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 p-4 md:p-6 text-center hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:border-white/50 group">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent mb-2 group-hover:from-gray-100 group-hover:to-blue-200 transition-all duration-300">
                          {animatedStats.users.toLocaleString()}+
                        </div>
                        <div className="text-gray-100 text-sm md:text-base font-medium">
                          Active Users
                        </div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-xl rounded-2xl border border-red-300/30 p-4 md:p-6 text-center hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:border-red-400/50 group">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-400 to-white bg-clip-text text-transparent mb-2 group-hover:from-red-300 group-hover:to-white transition-all duration-300">
                          {animatedStats.sources}+
                        </div>
                        <div className="text-gray-100 text-sm md:text-base font-medium">
                          Trusted Sources
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Left Side Rotating Cards */}
              <div className="absolute left-2 xl:left-4 2xl:left-8 top-1/2 -translate-y-1/2 hidden xl:block pointer-events-none">
                <div className="space-y-4">
                  {features.slice(0, 3).map((feature, index) => {
                    const Icon = feature.icon;
                    const rotationProgress = (carouselIndex + index) % 6;
                    const rotationY = (rotationProgress * 60) - 180; // 3D rotation effect
                    const isActive = index === carouselIndex % 3;
                    
                    return (
                      <Card
                        key={`left-${feature.id}`}
                        className={`w-48 xl:w-52 2xl:w-56 h-24 xl:h-26 2xl:h-28 bg-white/20 backdrop-blur-xl border border-blue-300/30 transition-all duration-1000 transform-gpu ${
                          isActive ? 'scale-105 bg-white/30 border-blue-400/50 shadow-2xl shadow-blue-500/20' : 'scale-90 opacity-60'
                        }`}
                        style={{
                          transform: `perspective(1000px) rotateY(${rotationY}deg) ${isActive ? 'translateX(8px)' : 'translateX(-5px)'}`,
                          transformStyle: 'preserve-3d',
                          backfaceVisibility: 'hidden',
                        }}
                      >
                        <CardContent className="p-3 text-white h-full flex flex-col justify-between">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400/40 to-red-400/40 flex items-center justify-center ${isActive ? 'bg-gradient-to-br from-blue-500/60 to-red-500/60 shadow-lg shadow-blue-500/25' : ''} backdrop-blur-sm`}>
                              <Icon className={`w-4 h-4 ${feature.color} brightness-200`} />
                            </div>
                            <h3 className="font-semibold text-sm">{feature.title}</h3>
                          </div>
                          <p className="text-xs text-gray-100 leading-tight flex-1">
                            {feature.description.slice(0, 80)}...
                          </p>
                          {isActive && (
                            <div className="mt-2 pt-2 border-t border-blue-300/30">
                              <div className="flex items-center gap-1 text-xs">
                                <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-red-400 rounded-full animate-pulse"></div>
                                <span className="text-blue-200">Featured</span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Right Side Rotating Cards */}
              <div className="absolute right-2 xl:right-4 2xl:right-8 top-1/2 -translate-y-1/2 hidden xl:block pointer-events-none">
                <div className="space-y-4">
                  {features.slice(3, 6).map((feature, index) => {
                    const Icon = feature.icon;
                    const rotationProgress = (carouselIndex + index + 3) % 6;
                    const rotationY = (rotationProgress * 60) + 180; // 3D rotation effect (opposite direction)
                    const isActive = (index + 3) === carouselIndex % 6;
                    
                    return (
                      <Card
                        key={`right-${feature.id}`}
                        className={`w-48 xl:w-52 2xl:w-56 h-24 xl:h-26 2xl:h-28 bg-white/20 backdrop-blur-xl border border-red-300/30 transition-all duration-1000 transform-gpu ${
                          isActive ? 'scale-105 bg-white/30 border-red-400/50 shadow-2xl shadow-red-500/20' : 'scale-90 opacity-60'
                        }`}
                        style={{
                          transform: `perspective(1000px) rotateY(${rotationY}deg) ${isActive ? 'translateX(-8px)' : 'translateX(5px)'}`,
                          transformStyle: 'preserve-3d',
                          backfaceVisibility: 'hidden',
                        }}
                      >
                        <CardContent className="p-3 text-white h-full flex flex-col justify-between">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-red-400/40 to-blue-400/40 flex items-center justify-center ${isActive ? 'bg-gradient-to-br from-red-500/60 to-blue-500/60 shadow-lg shadow-red-500/25' : ''} backdrop-blur-sm`}>
                              <Icon className={`w-4 h-4 ${feature.color} brightness-200`} />
                            </div>
                            <h3 className="font-semibold text-sm">{feature.title}</h3>
                          </div>
                          <p className="text-xs text-gray-100 leading-tight flex-1">
                            {feature.description.slice(0, 80)}...
                          </p>
                          {isActive && (
                            <div className="mt-2 pt-2 border-t border-red-300/30">
                              <div className="flex items-center gap-1 text-xs">
                                <div className="w-1.5 h-1.5 bg-gradient-to-r from-red-400 to-blue-400 rounded-full animate-pulse"></div>
                                <span className="text-red-200">Featured</span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Large Screen Side Cards (Simplified) */}
              <div className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 hidden lg:block xl:hidden pointer-events-none">
                <div className="space-y-4">
                  {features.slice(0, 2).map((feature, index) => {
                    const Icon = feature.icon;
                    const isActive = index === carouselIndex % 2;
                    
                    return (
                      <Card
                        key={`lg-left-${feature.id}`}
                        className={`w-56 lg:w-60 h-28 lg:h-30 bg-white/20 backdrop-blur-md border border-white/30 transition-all duration-1000 ${
                          isActive ? 'scale-105 bg-white/30 border-white/50' : 'scale-95 opacity-70'
                        }`}
                        style={{
                          transform: `${isActive ? 'translateX(5px)' : 'translateX(0px)'}`,
                        }}
                      >
                        <CardContent className="p-4 text-white">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-8 h-8 rounded-lg bg-white/30 flex items-center justify-center`}>
                              <Icon className={`w-4 h-4 ${feature.color} brightness-200`} />
                            </div>
                            <h3 className="font-semibold text-sm">{feature.title}</h3>
                          </div>
                          <p className="text-xs text-white/90 leading-tight">
                            {feature.description}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 hidden lg:block xl:hidden pointer-events-none">
                <div className="space-y-4">
                  {features.slice(2, 4).map((feature, index) => {
                    const Icon = feature.icon;
                    const isActive = (index + 2) === carouselIndex % 4;
                    
                    return (
                      <Card
                        key={`lg-right-${feature.id}`}
                        className={`w-56 lg:w-60 h-28 lg:h-30 bg-white/20 backdrop-blur-md border border-white/30 transition-all duration-1000 ${
                          isActive ? 'scale-105 bg-white/30 border-white/50' : 'scale-95 opacity-70'
                        }`}
                        style={{
                          transform: `${isActive ? 'translateX(-5px)' : 'translateX(0px)'}`,
                        }}
                      >
                        <CardContent className="p-4 text-white">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-8 h-8 rounded-lg bg-white/30 flex items-center justify-center`}>
                              <Icon className={`w-4 h-4 ${feature.color} brightness-200`} />
                            </div>
                            <h3 className="font-semibold text-sm">{feature.title}</h3>
                          </div>
                          <p className="text-xs text-white/90 leading-tight">
                            {feature.description}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Feature Indicators */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 lg:hidden">
                <div className="flex gap-2">
                  {features.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === carouselIndex ? 'bg-blue-400 w-6' : 'bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Mobile/Tablet Feature Cards Grid */}
            <section className="relative py-20 lg:hidden bg-gray-50">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent mb-4">Platform Features</h2>
                  <p className="text-gray-700 text-lg">
                    Discover our comprehensive fact-checking ecosystem
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    const isActive = index === carouselIndex;
                    
                    return (
                      <Card
                        key={`mobile-${feature.id}`}
                        className={`bg-white/90 backdrop-blur-xl border border-gray-200 text-gray-800 transition-all duration-500 hover:scale-105 hover:bg-white hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer ${
                          isActive ? 'ring-2 ring-blue-400 bg-white shadow-2xl shadow-blue-500/20' : ''
                        }`}
                        onClick={() => setActiveSection(feature.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-red-500/20 flex items-center justify-center backdrop-blur-sm ${isActive ? 'bg-gradient-to-br from-blue-500/30 to-red-500/30 shadow-lg shadow-blue-500/25' : ''}`}>
                              <Icon className={`w-7 h-7 ${feature.color}`} />
                            </div>
                            <h3 className="font-semibold text-xl text-gray-800">{feature.title}</h3>
                          </div>
                          <p className="text-gray-600 leading-relaxed mb-6">
                            {feature.description}
                          </p>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveSection(feature.id);
                            }}
                            className="w-full bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                          >
                            Try Now
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* About Section */}
            <section className="relative py-20 bg-gray-50">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-16">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent mb-6">About FactVerse</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    FactVerse is a cutting-edge news verification platform that combines artificial intelligence
                    with community collaboration to combat misinformation and ensure news accuracy in the digital age.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <Card className="bg-white/90 backdrop-blur-xl border border-blue-200 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:border-blue-300">
                    <CardHeader>
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-red-500/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                        <TrendingUp className="w-7 h-7 text-blue-600" />
                      </div>
                      <CardTitle className="text-gray-800 text-xl">AI-Powered Detection</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">
                        Our advanced machine learning algorithms analyze news articles in real-time,
                        detecting patterns and inconsistencies that indicate misinformation.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/90 backdrop-blur-xl border border-red-200 shadow-2xl hover:shadow-red-500/20 transition-all duration-300 hover:scale-105 hover:border-red-300">
                    <CardHeader>
                      <div className="w-14 h-14 bg-gradient-to-br from-red-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                        <Globe className="w-7 h-7 text-red-600" />
                      </div>
                      <CardTitle className="text-gray-800 text-xl">Global Coverage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">
                        Monitor news sources from around the world, providing comprehensive
                        fact-checking coverage across multiple languages and regions.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/90 backdrop-blur-xl border border-blue-200 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:border-blue-300">
                    <CardHeader>
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-red-500/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                        <Award className="w-7 h-7 text-blue-600" />
                      </div>
                      <CardTitle className="text-gray-800 text-xl">Community Trust</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">
                        Built on collaborative verification where journalists, experts, and citizens
                        work together to maintain the highest standards of news accuracy.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="relative py-20">
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent mb-6">Trusted by Professionals</h2>
                  <p className="text-xl text-gray-700">
                    See what journalists and fact-checkers are saying about FactVerse
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {testimonials.map((testimonial, index) => (
                    <Card key={index} className="bg-white/90 backdrop-blur-xl border border-blue-200 text-gray-800 hover:border-blue-300 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-600 mb-4 italic leading-relaxed">
                          "{testimonial.content}"
                        </p>
                        <div>
                          <div className="font-semibold text-gray-800">{testimonial.name}</div>
                          <div className="text-blue-600 text-sm">{testimonial.role}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* Call to Action Section */}
            <section className="relative py-20 bg-gradient-to-r from-blue-100/50 to-red-100/50 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-red-500/10"></div>
              <div className="container mx-auto px-4 text-center relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-red-600 to-blue-800 bg-clip-text text-transparent">Join FactVerse Today</h2>
                <p className="text-xl mb-8 text-gray-700 max-w-2xl mx-auto leading-relaxed">
                  Be part of the solution. Help us build a world where accurate information prevails
                  over misinformation. Join thousands of professionals already using FactVerse.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button
                    onClick={() => setActiveSection('features')}
                    className="bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-2xl shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                  >
                    Start Verifying Now
                  </Button>
                  <Button
                    onClick={() => setActiveSection('contact')}
                    variant="outline"
                    className="border-2 border-blue-400/50 text-gray-700 hover:bg-blue-500/20 hover:border-blue-400 backdrop-blur-sm px-10 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    Contact Sales
                  </Button>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Features Section */}
        {activeSection === 'features' && (
          <section className="relative py-20 min-h-screen bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent mb-6">Platform Features</h2>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                  Discover the comprehensive suite of tools that make FactVerse the most trusted
                  platform for news verification and fact-checking.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={feature.id} className="bg-white/90 backdrop-blur-xl border border-blue-200 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 cursor-pointer group hover:border-blue-300">
                      <CardHeader>
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-red-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:from-blue-500/30 group-hover:to-red-500/30 transition-all duration-300 backdrop-blur-sm group-hover:shadow-lg group-hover:shadow-blue-500/25">
                          <Icon className={`w-8 h-8 ${feature.color} group-hover:scale-110 transition-transform`} />
                        </div>
                        <CardTitle className="text-gray-800 text-xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {feature.description}
                        </p>
                        <Button
                          onClick={() => setActiveSection(feature.id)}
                          className="w-full bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                        >
                          Try Now
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* About Section */}
        {activeSection === 'about' && (
          <section className="relative py-20 min-h-screen bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent mb-8 text-center">About FactVerse</h2>
                
                <div className="space-y-8 text-gray-700">
                  <p className="text-xl leading-relaxed text-center">
                    FactVerse was founded with a simple yet critical mission: to provide the world with
                    reliable, accurate, and timely fact-checking services in an era of information overload
                    and digital misinformation.
                  </p>
                  
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-blue-200 p-8 shadow-lg">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h3>
                    <p className="leading-relaxed">
                      We believe that access to accurate information is a fundamental right. Our platform
                      combines cutting-edge artificial intelligence with human expertise to create the most
                      comprehensive fact-checking ecosystem available today.
                    </p>
                  </div>
                  
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-red-200 p-8 shadow-lg">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6">How It Works</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-blue-600">AI-Powered Analysis</h4>
                        <p className="leading-relaxed">
                          Our machine learning algorithms analyze news articles, social media posts,
                          and other content in real-time, flagging potential misinformation.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-red-600">Human Verification</h4>
                        <p className="leading-relaxed">
                          Expert fact-checkers review flagged content, providing detailed analysis
                          and verification against trusted sources.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Our Impact</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <Card className="bg-white/90 backdrop-blur-xl border border-blue-200 p-6 text-center hover:border-blue-300 transition-all duration-300 shadow-lg">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent mb-2">250,000+</div>
                        <div className="text-gray-600">Articles Verified</div>
                      </Card>
                      <Card className="bg-white/90 backdrop-blur-xl border border-green-200 p-6 text-center hover:border-green-300 transition-all duration-300 shadow-lg">
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">94.2%</div>
                        <div className="text-gray-600">Accuracy Rate</div>
                      </Card>
                      <Card className="bg-white/90 backdrop-blur-xl border border-blue-200 p-6 text-center hover:border-blue-300 transition-all duration-300 shadow-lg">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">85,000+</div>
                        <div className="text-gray-600">Active Users</div>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        {activeSection === 'contact' && (
          <section className="relative py-20 min-h-screen bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent mb-8 text-center">Contact Us</h2>
                
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-blue-200 p-8 shadow-lg">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6">Get in Touch</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-2">General Inquiries</h4>
                        <p className="text-gray-600">info@factverse.com</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-2">Press & Media</h4>
                        <p className="text-gray-600">press@factverse.com</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-2">Technical Support</h4>
                        <p className="text-gray-600">support@factverse.com</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-2">Partnerships</h4>
                        <p className="text-gray-600">partnerships@factverse.com</p>
                      </div>
                    </div>
                  </div>
                  
                  <Card className="bg-white/90 backdrop-blur-xl border border-red-200 shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-gray-800 text-xl">Send us a message</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-gray-700">Name</Label>
                        <Input id="name" placeholder="Your name" className="bg-white border-blue-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200" />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-gray-700">Email</Label>
                        <Input id="email" type="email" placeholder="your@email.com" className="bg-white border-blue-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200" />
                      </div>
                      <div>
                        <Label htmlFor="subject" className="text-gray-700">Subject</Label>
                        <Input id="subject" placeholder="What's this about?" className="bg-white border-blue-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200" />
                      </div>
                      <div>
                        <Label htmlFor="message" className="text-gray-700">Message</Label>
                        <textarea
                          id="message"
                          rows={4}
                          className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-gray-800 placeholder:text-gray-400 transition-all duration-300"
                          placeholder="Tell us more..."
                        ></textarea>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105">
                        Send Message
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="relative bg-gray-900/90 backdrop-blur-xl border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <span className="text-white font-bold">FV</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">FactVerse</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Leading the fight against misinformation with AI-powered fact-checking and community collaboration.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveSection('about')}
                  className="block text-gray-400 hover:text-blue-300 transition-colors text-sm"
                >
                  About
                </button>
                <button
                  onClick={() => setActiveSection('features')}
                  className="block text-gray-400 hover:text-blue-300 transition-colors text-sm"
                >
                  Features
                </button>
                <button className="block text-gray-400 hover:text-blue-300 transition-colors text-sm">
                  Privacy Policy
                </button>
                <button className="block text-gray-400 hover:text-blue-300 transition-colors text-sm">
                  Terms of Service
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveSection('contact')}
                  className="block text-gray-400 hover:text-red-300 transition-colors text-sm"
                >
                  Contact
                </button>
                <button className="block text-gray-400 hover:text-red-300 transition-colors text-sm">
                  Help Center
                </button>
                <button className="block text-gray-400 hover:text-red-300 transition-colors text-sm">
                  Documentation
                </button>
                <button className="block text-gray-400 hover:text-red-300 transition-colors text-sm">
                  API Access
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Follow Us</h4>
              <div className="flex gap-3">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-blue-500/20 p-2 rounded-xl border border-transparent hover:border-blue-500/30 transition-all duration-300"
                >
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-blue-500/20 p-2 rounded-xl border border-transparent hover:border-blue-500/30 transition-all duration-300"
                >
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-red-500/20 p-2 rounded-xl border border-transparent hover:border-red-500/30 transition-all duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-red-500/20 p-2 rounded-xl border border-transparent hover:border-red-500/30 transition-all duration-300"
                >
                  <Youtube className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-500/20 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 FactVerse. All rights reserved. | Building trust in digital information.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}