import React, { useState, useEffect } from 'react';

export function InteractiveLogo({ size = 'md', showText = false }) {
  const [hovered, setHovered] = useState(false);
  const [particles, setParticles] = useState([]);
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  useEffect(() => {
    if (hovered) {
      const newParticles = Array.from({ length: 6 }, (_, i) => ({
        id: i,
        delay: i * 100,
        duration: 1000 + Math.random() * 500
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [hovered]);

  return (
    <div 
      className={`flex items-center gap-3 cursor-pointer relative ${showText ? 'group' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Logo Container */}
      <div className={`relative ${sizeClasses[size]} flex-shrink-0`}>
        {/* Pulsing Rings */}
        <div className={`absolute inset-0 rounded-full border-2 border-cyan-400/30 ${hovered ? 'animate-pulse-ring' : ''}`} />
        <div className={`absolute inset-0 rounded-full border border-purple-400/20 ${hovered ? 'animate-ping' : ''} delay-150`} />
        
        {/* Orbiting Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute inset-0 animate-particle-orbit"
            style={{ animationDelay: `${particle.delay}ms`, animationDuration: `${particle.duration}ms` }}
          >
            <div className="w-1 h-1 bg-cyan-400 rounded-full" />
          </div>
        ))}
        
        {/* Main Logo */}
        <div className={`
          relative w-full h-full rounded-full 
          bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600
          flex items-center justify-center
          border-2 border-white/20
          shadow-lg shadow-cyan-500/25
          transition-all duration-300
          ${hovered ? 'scale-110 shadow-xl shadow-cyan-500/40 animate-neon-glow' : ''}
        `}>
          {/* Inner Glow */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-cyan-300/30 to-purple-500/30 blur-sm" />
          
          {/* Logo Icon */}
          <div className="relative z-10 text-white font-bold">
            {size === 'sm' && 'F'}
            {size === 'md' && 'FV'}
            {size === 'lg' && 'FV'}
            {size === 'xl' && 'FV'}
          </div>
          
          {/* Scanning Effect */}
          {hovered && (
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-scanner-sweep" />
            </div>
          )}
        </div>
        
        {/* Data Flow Lines */}
        {hovered && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-full w-8 h-px bg-gradient-to-r from-cyan-400/60 to-transparent animate-data-flow" />
            <div className="absolute top-1/2 right-full w-8 h-px bg-gradient-to-l from-purple-400/60 to-transparent animate-data-flow delay-300" />
            <div className="absolute left-1/2 top-full h-8 w-px bg-gradient-to-b from-blue-400/60 to-transparent animate-data-flow delay-150" />
            <div className="absolute left-1/2 bottom-full h-8 w-px bg-gradient-to-t from-indigo-400/60 to-transparent animate-data-flow delay-450" />
          </div>
        )}
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="relative">
          <div className={`
            ${textSizes[size]} font-medium
            bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 
            bg-clip-text text-transparent
            transition-all duration-300
            ${hovered ? 'animate-neon-glow' : ''}
            group-hover:scale-105
          `}>
            FactVerse
          </div>
          
          {/* Glitch Effect */}
          {hovered && (
            <div className={`
              absolute inset-0 ${textSizes[size]} font-medium
              bg-gradient-to-r from-red-400 via-green-400 to-blue-400 
              bg-clip-text text-transparent
              animate-cyber-glitch opacity-30
            `}>
              FactVerse
            </div>
          )}
        </div>
      )}
      
      {/* Matrix Rain Effect (for larger sizes) */}
      {hovered && (size === 'lg' || size === 'xl') && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full opacity-20">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px h-4 bg-green-400 animate-matrix-rain"
              style={{
                left: `${(i + 1) * 12.5}%`,
                animationDelay: `${i * 200}ms`,
                animationDuration: '4s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}