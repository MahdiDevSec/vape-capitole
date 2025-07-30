import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Vape-themed loading spinner */}
      <div className="relative">
        <div className={`${sizeClasses[size]} vape-loading`}></div>
        
        {/* Smoke effect */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-blue-400/30 rounded-full vape-smoke"></div>
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-purple-400/20 rounded-full vape-smoke" style={{animationDelay: '0.5s'}}></div>
      </div>
      
      {/* Loading text */}
      {text && (
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium vape-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner; 