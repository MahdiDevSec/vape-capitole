import React from 'react';

interface VapeIconProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const VapeIcon: React.FC<VapeIconProps> = ({ 
  size = 'md', 
  animated = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Vape device body */}
      <div className={`w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg border-2 border-gray-600 ${animated ? 'vape-device' : ''}`}>
        {/* Device screen */}
        <div className="absolute top-1 left-1 right-1 h-1 bg-blue-400 rounded-sm vape-glow"></div>
        
        {/* Button */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
      </div>
      
      {/* Smoke effect */}
      {animated && (
        <>
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-blue-400/30 rounded-full vape-smoke"></div>
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-purple-400/20 rounded-full vape-smoke" style={{animationDelay: '0.5s'}}></div>
        </>
      )}
    </div>
  );
};

export default VapeIcon; 

