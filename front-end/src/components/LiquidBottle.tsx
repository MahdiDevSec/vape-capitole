import React from 'react';

interface LiquidBottleProps {
  color?: string;
  level?: number; // 0-100
  animated?: boolean;
  className?: string;
}

const LiquidBottle: React.FC<LiquidBottleProps> = ({ 
  color = '#f093fb',
  level = 80,
  animated = true,
  className = ''
}) => {
  return (
    <div className={`relative w-8 h-12 ${className}`}>
      {/* Bottle outline */}
      <div className="absolute inset-0 border-2 border-gray-400 rounded-lg bg-white/10 backdrop-blur-sm">
        {/* Bottle neck */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-gray-400 rounded-t-lg"></div>
        
        {/* Liquid inside */}
        <div 
          className={`absolute bottom-0 left-0 right-0 rounded-b-lg ${animated ? 'liquid-bottle' : ''}`}
          style={{
            height: `${level}%`,
            background: `linear-gradient(45deg, ${color}, ${color}dd)`
          }}
        ></div>
        
        {/* Liquid surface effect */}
        <div 
          className="absolute w-full h-1 rounded-t-lg opacity-60"
          style={{
            bottom: `${level}%`,
            background: `linear-gradient(90deg, ${color}80, ${color}40, ${color}80)`
          }}
        ></div>
      </div>
      
      {/* Bubbles */}
      {animated && (
        <>
          <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/30 rounded-full vape-float" style={{animationDelay: '0s'}}></div>
          <div className="absolute bottom-3 right-2 w-0.5 h-0.5 bg-white/20 rounded-full vape-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-4 left-3 w-0.5 h-0.5 bg-white/25 rounded-full vape-float" style={{animationDelay: '2s'}}></div>
        </>
      )}
    </div>
  );
};

export default LiquidBottle; 