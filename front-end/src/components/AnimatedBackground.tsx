import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: -1 }}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 vape-gradient"></div>
      
      {/* Right side smoke cloud */}
      <div className="smoke-cloud" style={{
        width: '320px',
        height: '220px',
        top: '10%',
        right: '-120px',
        background: 'radial-gradient(circle, rgba(120,150,255,0.18) 0%, rgba(120,150,255,0.10) 60%, transparent 100%)',
        animation: 'smokeCloud 28s ease-in-out infinite',
        animationDelay: '0s',
        filter: 'blur(2px)'
      }}></div>
      <div className="smoke-cloud" style={{
        width: '220px',
        height: '160px',
        bottom: '15%',
        right: '-80px',
        background: 'radial-gradient(circle, rgba(120,150,255,0.13) 0%, rgba(120,150,255,0.07) 60%, transparent 100%)',
        animation: 'smokeCloud 32s ease-in-out infinite',
        animationDelay: '7s',
        filter: 'blur(2px)'
      }}></div>
      
      {/* Left side smoke cloud */}
      <div className="smoke-cloud" style={{
        width: '300px',
        height: '200px',
        top: '20%',
        left: '-110px',
        background: 'radial-gradient(circle, rgba(120,150,255,0.18) 0%, rgba(120,150,255,0.10) 60%, transparent 100%)',
        animation: 'smokeCloud 30s ease-in-out infinite',
        animationDelay: '3s',
        filter: 'blur(2px)'
      }}></div>
      <div className="smoke-cloud" style={{
        width: '180px',
        height: '120px',
        bottom: '10%',
        left: '-60px',
        background: 'radial-gradient(circle, rgba(120,150,255,0.13) 0%, rgba(120,150,255,0.07) 60%, transparent 100%)',
        animation: 'smokeCloud 26s ease-in-out infinite',
        animationDelay: '10s',
        filter: 'blur(2px)'
      }}></div>
      
      {/* Gentle smoke particles */}
      <div className="gentle-smoke gentle-smoke-1"></div>
      <div className="gentle-smoke gentle-smoke-2"></div>
      <div className="gentle-smoke gentle-smoke-3"></div>
      <div className="gentle-smoke gentle-smoke-4"></div>
      <div className="gentle-smoke gentle-smoke-5"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      
      {/* Vape smoke effects */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-30 vape-smoke"></div>
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-400 rounded-full opacity-40 vape-smoke" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-35 vape-smoke" style={{animationDelay: '2s'}}></div>
      
      {/* Geometric shapes */}
      <div className="absolute top-1/4 right-1/3 w-8 h-8 border-2 border-blue-400/20 rounded-full vape-float"></div>
      <div className="absolute bottom-1/4 left-1/3 w-6 h-6 border-2 border-purple-400/20 rotate-45 vape-rotate"></div>
      <div className="absolute top-3/4 right-1/4 w-4 h-4 bg-pink-400/10 rounded-full vape-pulse"></div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5"></div>
    </div>
  );
};

export default AnimatedBackground; 