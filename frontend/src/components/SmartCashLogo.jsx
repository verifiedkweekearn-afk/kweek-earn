import React from 'react';
import { useTheme } from '../context/ThemeContext';

const SmartCashLogo = ({ size = 'md', showText = true }) => {
  const { theme } = useTheme();
  
  const sizes = {
    sm: { container: 'w-8 h-8', text: 'text-sm', gap: 'gap-2' },
    md: { container: 'w-12 h-12', text: 'text-base', gap: 'gap-3' },
    lg: { container: 'w-16 h-16', text: 'text-lg', gap: 'gap-4' }
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center ${s.gap}`}>
      {/* Your circular logo from PixelLab */}
      <img 
        src="/SmartCash-logo.png" 
        alt="SmartCash PSB"
        className={`${s.container} object-contain`}
      />
      
      {/* SmartCash Text */}
      {showText && (
        <div>
          <div className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            SmartCash
          </div>
          <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Payment Service Bank
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartCashLogo;
