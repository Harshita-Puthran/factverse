import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { FilterNews } from './components/FilterNews.jsx';
import { DetectFakeNews } from './components/DetectFakeNews.jsx';
import { SummarizeArticles } from './components/SummarizeArticles.jsx';
import { UserQuestions } from './components/UserQuestions.jsx';
import { Login } from './components/Login.jsx';
import { SignUp } from './components/SignUp.jsx'; // Import the SignUp component
import {
  Filter,
  Shield,
  FileText,
  HelpCircle,
  Menu,
  X,
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

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false); // State for the sign-up modal
  const [animatedStats, setAnimatedStats] = useState({
    verified: 0,
    accuracy: 0,
    users: 0,
    sources: 0
  });

  // Handlers to switch between login and sign-up modals
  const handleSwitchToSignUp = () => {
    setShowLogin(false);
    setShowSignUp(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignUp(false);
    setShowLogin(true);
  };

  // The rest of your code (useEffect, navItems, features, etc.) remains the same...

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
          color: 'text-blue-400'
        },
        {
          id: 'detect',
          title: 'Detect Fake News',
          description: 'Advanced machine learning algorithms detect misinformation',
          icon: Shield,
          color: 'text-red-400'
        },
        {
          id: 'summarize',
          title: 'Summarize Articles',
          description: 'Get concise, accurate summaries of complex news stories',
          icon: FileText,
          color: 'text-purple-400'
        },
        {
          id: 'questions',
          title: 'User Questions',
          description: 'Community-driven Q&A and expert fact-checking discussions',
          icon: HelpCircle,
          color: 'text-amber-400'
        },
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
      
      const renderMainContent = () => {
        switch (activeSection) {
          case 'filter':
            return <FilterNews />;
          case 'detect':
            return <DetectFakeNews />;
          case 'summarize':
            return <SummarizeArticles />;
          case 'questions':
            return <UserQuestions />;
          case 'features':
            return (
              <section className="relative py-20 min-h-screen bg-slate-900 text-white">
                <div className="container mx-auto px-4">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent mb-6">Platform Features</h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                      Discover the comprehensive suite of tools that make FactVerse the most trusted
                      platform for news verification and fact-checking.
                    </p>
                  </div>
    
                  <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {features.map((feature) => {
                      const Icon = feature.icon;
                      return (
                        <Card key={feature.id} className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 cursor-pointer group hover:border-blue-700">
                          <CardHeader>
                            <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-blue-900 rounded-xl flex items-center justify-center mb-4 border border-slate-600">
                              <Icon className={`w-8 h-8 ${feature.color} group-hover:scale-110 transition-transform`} />
                            </div>
                            <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-slate-400 leading-relaxed mb-4">
                              {feature.description}
                            </p>
                            <Button
                              onClick={() => setActiveSection(feature.id)}
                              className="w-full bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105"
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
            );
          case 'about':
            return (
              <section className="relative py-20 min-h-screen bg-slate-900 text-white">
                <div className="container mx-auto px-4">
                  <div className="max-w-5xl mx-auto">
                    <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent mb-12 text-center">About FactVerse</h2>
                    
                    <div className="space-y-12">
                      <p className="text-xl leading-relaxed text-center max-w-3xl mx-auto text-slate-300">
                        FactVerse was founded with a simple yet critical mission: to provide the world with
                        reliable, accurate, and timely fact-checking services in an era of information overload
                        and digital misinformation.
                      </p>
                      
                      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-10 shadow-lg">
                        <h3 className="text-3xl font-semibold text-white mb-4">Our Mission</h3>
                        <p className="leading-relaxed text-lg text-slate-400">
                          We believe that access to accurate information is a fundamental right. Our platform
                          combines cutting-edge artificial intelligence with human expertise to create the most
                          comprehensive fact-checking ecosystem available today.
                        </p>
                      </div>
                      
                      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-10 shadow-lg">
                        <h3 className="text-3xl font-semibold text-white mb-8">How It Works</h3>
                        <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-4">
                            <h4 className="text-2xl font-semibold text-blue-400">AI-Powered Analysis</h4>
                            <p className="leading-relaxed text-lg text-slate-400">
                              Our machine learning algorithms analyze news articles, social media posts,
                              and other content in real-time, flagging potential misinformation.
                            </p>
                          </div>
                          <div className="space-y-4">
                            <h4 className="text-2xl font-semibold text-red-400">Human Verification</h4>
                            <p className="leading-relaxed text-lg text-slate-400">
                              Expert fact-checkers review flagged content, providing detailed analysis
                              and verification against trusted sources.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-3xl font-semibold text-white mb-8 text-center">Our Impact</h3>
                        <div className="grid md:grid-cols-3 gap-8">
                          <Card className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 text-center shadow-lg">
                            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent mb-2">250,000+</div>
                            <div className="text-slate-300 font-medium">Articles Verified</div>
                          </Card>
                          <Card className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 text-center shadow-lg">
                            <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">94.2%</div>
                            <div className="text-slate-300 font-medium">Accuracy Rate</div>
                          </Card>
                          <Card className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 text-center shadow-lg">
                            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">85,000+</div>
                            <div className="text-slate-300 font-medium">Active Users</div>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          case 'contact':
            return (
              <section className="relative py-20 min-h-screen bg-slate-900 text-white">
                <div className="container mx-auto px-4">
                  <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent mb-8 text-center">Contact Us</h2>
                    
                    <div className="grid md:grid-cols-2 gap-12">
                      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-8 shadow-lg">
                        <h3 className="text-2xl font-semibold text-white mb-6">Get in Touch</h3>
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold text-blue-400 mb-2">General Inquiries</h4>
                            <p className="text-slate-400">info@factverse.com</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-blue-400 mb-2">Press & Media</h4>
                            <p className="text-slate-400">press@factverse.com</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-blue-400 mb-2">Technical Support</h4>
                            <p className="text-slate-400">support@factverse.com</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-blue-400 mb-2">Partnerships</h4>
                            <p className="text-slate-400">partnerships@factverse.com</p>
                          </div>
                        </div>
                      </div>
                      
                      <Card className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 shadow-2xl">
                        <CardHeader>
                          <CardTitle className="text-white text-xl">Send us a message</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                          <div>
                            <Label htmlFor="name" className="text-slate-300">Name</Label>
                            <Input id="name" placeholder="Your name" className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 mt-2" />
                          </div>
                          <div>
                            <Label htmlFor="email" className="text-slate-300">Email</Label>
                            <Input id="email" type="email" placeholder="your@email.com" className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 mt-2" />
                          </div>
                          <div>
                            <Label htmlFor="subject" className="text-slate-300">Subject</Label>
                            <Input id="subject" placeholder="What's this about?" className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 mt-2" />
                          </div>
                          <div>
                            <Label htmlFor="message" className="text-slate-300">Message</Label>
                            <textarea
                              id="message"
                              rows={5}
                              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder:text-slate-500 transition-all duration-300 mt-2"
                              placeholder="Tell us more..."
                            ></textarea>
                          </div>
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105">
                            Send Message
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </section>
            );
          default:
            return (
              <>
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                  
                  <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900"></div>
    
                  <div className="relative z-10 w-full">
                    
                    <div className="text-center text-white px-4 max-w-4xl mx-auto mb-20">
                      <div className="mb-8">
                        <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                          <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent animate-glow">Fact</span>
                          <span className="bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 bg-clip-text text-transparent animate-glow" style={{ animationDelay: '0.5s' }}>Verse</span>
                        </h1>
                        <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-red-500 mx-auto rounded-full mb-6 animate-pulse"></div>
                      </div>
                      
                      <p className="text-xl md:text-2xl mb-12 text-slate-200 leading-relaxed font-light">
                        The Ultimate Platform for <span className="text-blue-300 font-semibold">News Verification</span> and <span className="text-red-400 font-semibold">Fact-Checking</span>
                      </p>
                      
                      <div className="flex justify-center items-center">
                        <Button
                          onClick={() => setActiveSection('features')}
                          className="group bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50"
                        >
                          Explore Features
                          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
    
                    <div className="px-4 xl:px-20 2xl:px-32">
                      <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-4 md:p-6 text-center">
                            <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent mb-2">
                              {animatedStats.verified.toLocaleString()}+
                            </div>
                            <div className="text-slate-200 text-sm md:text-base font-medium">
                              Articles Verified
                            </div>
                          </div>
                          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-4 md:p-6 text-center">
                            <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent mb-2">
                              {animatedStats.accuracy}%
                            </div>
                            <div className="text-slate-200 text-sm md:text-base font-medium">
                              Accuracy Rate
                            </div>
                          </div>
                          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-4 md:p-6 text-center">
                            <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
                              {animatedStats.users.toLocaleString()}+
                            </div>
                            <div className="text-slate-200 text-sm md:text-base font-medium">
                              Active Users
                            </div>
                          </div>
                          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-4 md:p-6 text-center">
                            <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent mb-2">
                              {animatedStats.sources}+
                            </div>
                            <div className="text-slate-200 text-sm md:text-base font-medium">
                              Trusted Sources
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
    
                  <div className="absolute left-2 xl:left-4 2xl:left-8 top-1/2 -translate-y-1/2 hidden xl:block pointer-events-none">
                    <div className="space-y-4">
                      {features.slice(0, 2).map((feature) => {
                        const Icon = feature.icon;
                        return (
                          <Card
                            key={`left-${feature.id}`}
                            className="w-56 h-28 bg-white/10 backdrop-blur-lg border border-white/20"
                          >
                            <CardContent className="p-4 text-white h-full flex flex-col justify-center">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-white/10">
                                  <Icon className={`w-5 h-5 ${feature.color}`} />
                                </div>
                                <h3 className="font-semibold">{feature.title}</h3>
                              </div>
                              <p className="text-xs text-slate-300 leading-tight">
                                {feature.description}
                              </p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
    
                  <div className="absolute right-2 xl:right-4 2xl:right-8 top-1/2 -translate-y-1/2 hidden xl:block pointer-events-none">
                    <div className="space-y-4">
                      {features.slice(2, 4).map((feature) => {
                        const Icon = feature.icon;
                        return (
                          <Card
                            key={`right-${feature.id}`}
                            className="w-56 h-28 bg-white/10 backdrop-blur-lg border border-white/20"
                          >
                            <CardContent className="p-4 text-white h-full flex flex-col justify-center">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-white/10">
                                  <Icon className={`w-5 h-5 ${feature.color}`} />
                                </div>
                                <h3 className="font-semibold">{feature.title}</h3>
                              </div>
                              <p className="text-xs text-slate-300 leading-tight">
                                {feature.description}
                              </p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
    
                </section>
                
                <section className="relative py-20 bg-slate-900 text-white">
                  <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent mb-6">About FactVerse</h2>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        FactVerse is a cutting-edge news verification platform that combines artificial intelligence
                        with community collaboration to combat misinformation and ensure news accuracy in the digital age.
                      </p>
                    </div>
    
                    <div className="grid md:grid-cols-3 gap-8">
                      <Card className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 shadow-xl">
                        <CardHeader>
                          <div className="w-14 h-14 bg-gradient-to-br from-slate-800 to-blue-900 rounded-xl flex items-center justify-center mb-4 border border-slate-600">
                            <TrendingUp className="w-7 h-7 text-blue-400" />
                          </div>
                          <CardTitle className="text-white text-xl">AI-Powered Detection</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-400 leading-relaxed">
                            Our advanced machine learning algorithms analyze news articles in real-time,
                            detecting patterns and inconsistencies that indicate misinformation.
                          </p>
                        </CardContent>
                      </Card>
    
                      <Card className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 shadow-xl">
                        <CardHeader>
                          <div className="w-14 h-14 bg-gradient-to-br from-slate-800 to-red-900 rounded-xl flex items-center justify-center mb-4 border border-slate-600">
                            <Globe className="w-7 h-7 text-red-400" />
                          </div>
                          <CardTitle className="text-white text-xl">Global Coverage</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-400 leading-relaxed">
                            Monitor news sources from around the world, providing comprehensive
                            fact-checking coverage across multiple languages and regions.
                          </p>
                        </CardContent>
                      </Card>
    
                      <Card className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 shadow-xl">
                        <CardHeader>
                          <div className="w-14 h-14 bg-gradient-to-br from-slate-800 to-green-900 rounded-xl flex items-center justify-center mb-4 border border-slate-600">
                            <Award className="w-7 h-7 text-green-400" />
                          </div>
                          <CardTitle className="text-white text-xl">Community Trust</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-400 leading-relaxed">
                            Built on collaborative verification where journalists, experts, and citizens
                            work together to maintain the highest standards of news accuracy.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </section>
    
                <section className="relative py-20 bg-slate-900 text-white">
                  <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent mb-6">Trusted by Professionals</h2>
                      <p className="text-xl text-slate-300">
                        See what journalists and fact-checkers are saying about FactVerse
                      </p>
                    </div>
    
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                      {testimonials.map((testimonial, index) => (
                        <Card key={index} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 text-white shadow-xl">
                          <CardContent className="p-8">
                            <div className="flex items-center mb-4">
                              {Array.from({ length: testimonial.rating }).map((_, i) => (
                                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <p className="text-slate-400 mb-6 italic leading-relaxed">
                              "{testimonial.content}"
                            </p>
                            <div>
                              <div className="font-semibold text-white">{testimonial.name}</div>
                              <div className="text-blue-400 text-sm font-medium">{testimonial.role}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </section>
    
                <section className="relative py-20 bg-slate-800">
                  <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-red-500 to-rose-500 bg-clip-text text-transparent">Join FactVerse Today</h2>
                    <p className="text-xl mb-8 text-slate-300 max-w-2xl mx-auto leading-relaxed">
                      Be part of the solution. Help us build a world where accurate information prevails
                      over misinformation. Join thousands of professionals already using FactVerse.
                    </p>
                    <div className="flex justify-center">
                      <Button
                        onClick={() => setActiveSection('features')}
                        className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:scale-105"
                      >
                        Start Verifying Now
                      </Button>
                    </div>
                  </div>
                </section>
              </>
            );
        }
      };

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-xl border-b border-slate-700 shadow-sm z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveSection('home')}>
            <div className="w-10 h-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                >
                    <defs>
                        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: 'rgb(59, 130, 246)' }} />
                            <stop offset="100%" style={{ stopColor: 'rgb(239, 68, 68)' }} />
                        </linearGradient>
                    </defs>
                    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="url(#logoGradient)" fillOpacity="0.2"/>
                    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="url(#logoGradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.5 12.5L11 15L15.5 10.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">FactVerse</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeSection === item.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => setShowLogin(true)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-300"
            >
              Login
            </button>
            {/* <Button
                onClick={() => setActiveSection('features')}
                className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white px-6 py-2 rounded-xl shadow-md shadow-blue-500/20 transition-all duration-300 hover:scale-105"
            >
                Get Started
            </Button> */}
          </nav>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-slate-300 hover:bg-slate-800 rounded-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/90 backdrop-blur-xl px-4 py-3 space-y-2 border-t border-slate-700">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-xl transition-all duration-300 ${
                activeSection === item.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                setShowLogin(true);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-300"
            >
              Login
            </button>
            <Button
            onClick={() => {
                setActiveSection('features');
                setMobileMenuOpen(false);
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-red-600 text-white mt-2 rounded-xl"
            >
            Get Started
            </Button>
          </div>
        )}
      </header>

      <main className="pt-16">
        {/* Render modals based on state */}
        {showLogin && <Login onClose={() => setShowLogin(false)} onSwitchToSignUp={handleSwitchToSignUp} />}
        {showSignUp && <SignUp onClose={() => setShowSignUp(false)} onSwitchToLogin={handleSwitchToLogin} />}
        
        {renderMainContent()}
      </main>

      <footer className="relative bg-gray-900 border-t border-gray-700 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full"
                    >
                        <defs>
                            <linearGradient id="logoGradientFooter" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: 'rgb(59, 130, 246)' }} />
                                <stop offset="100%" style={{ stopColor: 'rgb(239, 68, 68)' }} />
                            </linearGradient>
                        </defs>
                        <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="url(#logoGradientFooter)" fillOpacity="0.2"/>
                        <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="url(#logoGradientFooter)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8.5 12.5L11 15L15.5 10.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">FactVerse</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
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
                  className="text-gray-400 hover:text-white hover:bg-blue-500/20 p-2 rounded-xl"
                >
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-blue-500/20 p-2 rounded-xl"
                >
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-purple-500/20 p-2 rounded-xl"
                >
                  <Linkedin className="w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-red-500/20 p-2 rounded-xl"
                >
                  <Youtube className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 FactVerse. All rights reserved. | Building trust in digital information.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}