import React, { useState, useEffect } from 'react';

interface SmokeLoadingScreenProps {
  onLoadingComplete: () => void;
}

const SmokeLoadingScreen: React.FC<SmokeLoadingScreenProps> = ({ onLoadingComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    // Show content immediately
    setShowContent(true);

    const progressTimer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => {
            onLoadingComplete();
          }, 500);
          return 100;
        }
        return prev + 8;
      });
    }, 200);

    return () => {
      clearInterval(progressTimer);
    };
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-50 opacity-100">
      {/* Background with dense smoke effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        {/* Large smoke clouds covering the entire screen */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Layer 1 - Large background smoke */}
          <div className="absolute top-1/6 left-1/6 w-96 h-96 bg-blue-400/15 rounded-full animate-pulse blur-3xl"></div>
          <div className="absolute top-1/4 right-1/6 w-80 h-80 bg-purple-400/12 rounded-full animate-pulse blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-cyan-400/18 rounded-full animate-pulse blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-indigo-400/14 rounded-full animate-pulse blur-3xl"></div>
          
          {/* Layer 2 - Medium smoke clouds */}
          <div className="absolute top-1/8 left-1/3 w-48 h-48 bg-blue-300/20 rounded-full animate-pulse blur-2xl"></div>
          <div className="absolute top-1/3 right-1/8 w-56 h-56 bg-purple-300/16 rounded-full animate-pulse blur-2xl"></div>
          <div className="absolute bottom-1/3 left-1/8 w-40 h-40 bg-cyan-300/22 rounded-full animate-pulse blur-2xl"></div>
          <div className="absolute top-2/3 right-1/3 w-44 h-44 bg-indigo-300/18 rounded-full animate-pulse blur-2xl"></div>
          
          {/* Layer 3 - Smaller smoke clouds */}
          <div className="absolute top-1/12 left-1/2 w-32 h-32 bg-blue-200/25 rounded-full animate-pulse blur-xl"></div>
          <div className="absolute top-1/2 left-1/12 w-36 h-36 bg-purple-200/20 rounded-full animate-pulse blur-xl"></div>
          <div className="absolute bottom-1/6 right-1/6 w-28 h-28 bg-cyan-200/28 rounded-full animate-pulse blur-xl"></div>
          <div className="absolute top-3/4 left-3/4 w-24 h-24 bg-indigo-200/24 rounded-full animate-pulse blur-xl"></div>
          
          {/* Layer 4 - Small smoke particles */}
          <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-white/30 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-blue-300/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-purple-300/35 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-2/3 left-1/2 w-8 h-8 bg-cyan-300/50 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/6 right-1/2 w-14 h-14 bg-indigo-300/45 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/6 w-10 h-10 bg-white/25 rounded-full animate-bounce" style={{ animationDelay: '2.5s' }}></div>
          
          {/* Additional floating particles */}
          <div className="absolute top-1/8 left-1/8 w-6 h-6 bg-blue-400/30 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute top-3/4 right-1/8 w-4 h-4 bg-purple-400/35 rounded-full animate-bounce" style={{ animationDelay: '0.8s' }}></div>
          <div className="absolute bottom-1/8 left-3/4 w-8 h-8 bg-cyan-400/40 rounded-full animate-bounce" style={{ animationDelay: '1.2s' }}></div>
          <div className="absolute top-1/3 left-3/4 w-5 h-5 bg-indigo-400/38 rounded-full animate-bounce" style={{ animationDelay: '1.8s' }}></div>
          
          {/* Extra dense smoke clouds */}
          <div className="absolute top-1/5 left-1/5 w-20 h-20 bg-blue-300/25 rounded-full dense-smoke"></div>
          <div className="absolute top-2/5 right-1/5 w-16 h-16 bg-purple-300/30 rounded-full dense-smoke" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/5 left-2/5 w-18 h-18 bg-cyan-300/28 rounded-full dense-smoke" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-3/5 right-2/5 w-14 h-14 bg-indigo-300/32 rounded-full dense-smoke" style={{ animationDelay: '3s' }}></div>
          
          {/* Drifting smoke */}
          <div className="absolute top-1/4 left-1/6 w-12 h-12 bg-white/20 rounded-full smoke-drift"></div>
          <div className="absolute top-1/2 right-1/6 w-10 h-10 bg-blue-200/25 rounded-full smoke-drift" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-8 h-8 bg-purple-200/30 rounded-full smoke-drift" style={{ animationDelay: '3s' }}></div>
          <div className="absolute top-2/3 right-1/3 w-6 h-6 bg-cyan-200/35 rounded-full smoke-drift" style={{ animationDelay: '4.5s' }}></div>
          
          {/* Additional smoke coverage */}
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Top layer smoke */}
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-400/10 rounded-full animate-pulse blur-2xl"></div>
            <div className="absolute top-0 right-1/4 w-28 h-28 bg-purple-400/8 rounded-full animate-pulse blur-2xl"></div>
            <div className="absolute top-1/6 left-0 w-24 h-24 bg-cyan-400/12 rounded-full animate-pulse blur-2xl"></div>
            <div className="absolute top-1/6 right-0 w-20 h-20 bg-indigo-400/10 rounded-full animate-pulse blur-2xl"></div>
            
            {/* Bottom layer smoke */}
            <div className="absolute bottom-0 left-1/3 w-36 h-36 bg-blue-300/15 rounded-full animate-pulse blur-2xl"></div>
            <div className="absolute bottom-0 right-1/3 w-40 h-40 bg-purple-300/12 rounded-full animate-pulse blur-2xl"></div>
            <div className="absolute bottom-1/6 left-0 w-30 h-30 bg-cyan-300/18 rounded-full animate-pulse blur-2xl"></div>
            <div className="absolute bottom-1/6 right-0 w-26 h-26 bg-indigo-300/14 rounded-full animate-pulse blur-2xl"></div>
            
            {/* Center smoke */}
            <div className="absolute top-1/2 left-0 w-22 h-22 bg-white/15 rounded-full animate-pulse blur-xl"></div>
            <div className="absolute top-1/2 right-0 w-18 h-18 bg-blue-200/20 rounded-full animate-pulse blur-xl"></div>
            <div className="absolute top-1/3 left-0 w-20 h-20 bg-purple-200/18 rounded-full animate-pulse blur-xl"></div>
            <div className="absolute top-2/3 right-0 w-16 h-16 bg-cyan-200/22 rounded-full animate-pulse blur-xl"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        {/* Vape Device Icon */}
        <div className="relative mb-8">
          <div className="text-6xl text-yellow-400 animate-pulse">
            {/* Custom Vape Device Icon */}
            <div className="relative">
              <div className="w-16 h-24 bg-gradient-to-b from-gray-300 to-gray-400 rounded-lg mx-auto relative">
                {/* Vape tank */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></div>
                {/* Vape button */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
                {/* Vape tip */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-gray-500 rounded-t-full"></div>
              </div>
              {/* Vape smoke effect */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-2 h-8 bg-white/30 rounded-full animate-pulse"></div>
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-blue-300/40 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>
          {/* Smoke effect around vape device */}
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/10 rounded-full animate-ping"></div>
          <div className="absolute -top-2 -right-2 w-12 h-12 bg-blue-300/15 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-purple-300/20 rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
          <span className="text-yellow-400">VAPE</span> CAPITOLE
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 text-center">
          تجربة فريدة في عالم الفيب
        </p>

        {/* Loading bar */}
        <div className="w-64 md:w-80 bg-gray-700 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>

        {/* Loading text */}
        <p className="text-lg text-gray-400">
          جاري تحميل المحتوى... {loadingProgress}%
        </p>
      </div>
    </div>
  );
};

export default SmokeLoadingScreen; 

