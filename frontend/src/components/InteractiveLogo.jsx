import React, { useState, useEffect } from 'react';

export function InteractiveLogo({ size = 'md', showText = false }) {
  const [isHovered, setIsHovered] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [glitchEffect, setGlitchEffect] = useState(false);

  // Continuous rotation animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotationAngle(prev => (prev + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every interval
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 200);
      }
    }, 2000);
    return () => clearInterval(glitchInterval);
  }, []);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div 
      className={`flex items-center gap-3 cursor-pointer transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'} group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo Symbol */}
      <div className={`relative ${sizeClasses[size]} transition-all duration-300`}>
        {/* Outer Ring - Constantly rotating */}
        <div 
          className={`absolute inset-0 border-2 border-cyan-400/60 rounded-full ${glitchEffect ? 'animate-cyber-glitch' : ''}`}
          style={{ transform: `rotate(${rotationAngle}deg)` }}
        >
          {/* Ring segments */}
          <div className="absolute top-0 left-1/2 w-1 h-1 bg-cyan-400 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-purple-400 rounded-full -translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute left-0 top-1/2 w-1 h-1 bg-pink-400 rounded-full -translate-y-1/2 -translate-x-1/2"></div>
          <div className="absolute right-0 top-1/2 w-1 h-1 bg-emerald-400 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        </div>
        
        {/* Inner Ring - Counter-rotating */}
        <div 
          className={`absolute inset-1 border border-purple-400/80 rounded-full ${glitchEffect ? 'animate-cyber-glitch' : ''}`}
          style={{ transform: `rotate(${-rotationAngle * 1.5}deg)` }}
        >
          <div className="absolute top-0 left-1/2 w-0.5 h-0.5 bg-purple-400 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-1/2 w-0.5 h-0.5 bg-cyan-400 rounded-full -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        {/* Central Core */}
        <div className={`absolute inset-2 bg-gradient-to-br from-cyan-500/40 via-purple-500/40 to-pink-500/40 rounded-full ${isHovered ? 'animate-electric-pulse' : 'animate-glow'} ${glitchEffect ? 'animate-cyber-glitch' : ''}`}>
          {/* Inner glow */}
          <div className="absolute inset-0.5 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
          
          {/* Central symbol - "F" for FactVerse */}
          <div className={`absolute inset-0 flex items-center justify-center ${glitchEffect ? 'animate-cyber-glitch' : ''}`}>
            <div className={`text-white drop-shadow-lg ${isHovered ? 'animate-neon-glow' : ''} ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-base' : 'text-lg'}`}>
              F
            </div>
          </div>
        </div>
        
        {/* Floating data particles */}
        {isHovered && (
          <>
            <div className="absolute -top-1 -left-1 w-1 h-1 bg-cyan-400 rounded-full animate-data-flow"></div>
            <div className="absolute -top-1 -right-1 w-1 h-1 bg-purple-400 rounded-full animate-data-flow" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-pink-400 rounded-full animate-data-flow" style={{animationDelay: '1s'}}></div>
            <div className="absolute -bottom-1 -right-1 w-1 h-1 bg-emerald-400 rounded-full animate-data-flow" style={{animationDelay: '1.5s'}}></div>
          </>
        )}
        
        {/* Pulse rings on hover */}
        {isHovered && (
          <>
            <div className="absolute inset-0 border border-cyan-400/30 rounded-full animate-pulse-ring"></div>
            <div className="absolute inset-0 border border-purple-400/30 rounded-full animate-pulse-ring" style={{animationDelay: '0.5s'}}></div>
          </>
        )}
        
        {/* Scanner sweep effect */}
        {isHovered && (
          <div className={`absolute inset-0 ${glitchEffect ? 'animate-cyber-glitch' : ''}`}>
            <div className="absolute top-1/2 left-1/2 w-0.5 h-full bg-gradient-to-b from-transparent via-cyan-400/60 to-transparent animate-scanner-sweep" style={{transformOrigin: 'center bottom'}}></div>
          </div>
        )}
      </div>
      
      {/* Text Logo */}
      {showText && (
        <div className={`transition-all duration-300 ${isHovered ? 'animate-neon-glow' : ''} ${glitchEffect ? 'animate-cyber-glitch' : ''}`}>
          <span className={`${textSizeClasses[size]} bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg`}>
            FactVerse
          </span>
        </div>
      )}
      
      {/* Hologram flicker overlay */}
      {glitchEffect && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 animate-hologram-flicker"></div>
      )}
    </div>
  );
}