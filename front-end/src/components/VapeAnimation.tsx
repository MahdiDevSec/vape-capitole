import React from 'react';
import './VapeAnimation.css';

interface VapeAnimationProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const VapeAnimation: React.FC<VapeAnimationProps> = ({ className = '', size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48',
    large: 'w-64 h-64'
  };

  return (
    <div className={`vape-animation-container ${sizeClasses[size]} ${className}`}>
      {/* Person 1 - Modern Vaper */}
      <div className="vaper vaper-1">
        <div className="person">
          <div className="head">
            <div className="face">
              <div className="eye eye-left"></div>
              <div className="eye eye-right"></div>
              <div className="mouth"></div>
            </div>
            <div className="hair"></div>
          </div>
          <div className="body">
            <div className="arm arm-left"></div>
            <div className="arm arm-right holding-vape">
              <div className="vape-device modern">
                <div className="tank"></div>
                <div className="mod"></div>
                <div className="button"></div>
              </div>
            </div>
            <div className="torso"></div>
          </div>
        </div>
        <div className="vapor-cloud vapor-1">
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
        </div>
      </div>

      {/* Person 2 - Casual Vaper */}
      <div className="vaper vaper-2">
        <div className="person">
          <div className="head">
            <div className="face">
              <div className="eye eye-left"></div>
              <div className="eye eye-right"></div>
              <div className="mouth relaxed"></div>
            </div>
            <div className="hair long"></div>
          </div>
          <div className="body">
            <div className="arm arm-left"></div>
            <div className="arm arm-right holding-vape">
              <div className="vape-device pod">
                <div className="pod-cartridge"></div>
                <div className="pod-body"></div>
              </div>
            </div>
            <div className="torso casual"></div>
          </div>
        </div>
        <div className="vapor-cloud vapor-2">
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
          <div className="cloud cloud-4"></div>
        </div>
      </div>

      {/* Person 3 - Professional Vaper */}
      <div className="vaper vaper-3">
        <div className="person">
          <div className="head">
            <div className="face">
              <div className="eye eye-left"></div>
              <div className="eye eye-right"></div>
              <div className="mouth satisfied"></div>
            </div>
            <div className="hair professional"></div>
          </div>
          <div className="body">
            <div className="arm arm-left"></div>
            <div className="arm arm-right holding-vape">
              <div className="vape-device box-mod">
                <div className="atomizer"></div>
                <div className="box"></div>
                <div className="screen"></div>
              </div>
            </div>
            <div className="torso professional"></div>
          </div>
        </div>
        <div className="vapor-cloud vapor-3">
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
          <div className="cloud cloud-4"></div>
          <div className="cloud cloud-5"></div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="background-elements">
        <div className="floating-vapor floating-vapor-1"></div>
        <div className="floating-vapor floating-vapor-2"></div>
        <div className="floating-vapor floating-vapor-3"></div>
        <div className="floating-vapor floating-vapor-4"></div>
      </div>
    </div>
  );
};

export default VapeAnimation;
