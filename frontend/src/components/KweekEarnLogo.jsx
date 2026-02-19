import React from 'react';
import { useTheme } from '../context/ThemeContext';

const KweekEarnLogo = ({ 
  variant = 'horizontal', 
  size = 'md',
  showSymbol = true,
  className = '' 
}) => {
  const { theme } = useTheme();
  
  const sizes = {
    sm: {
      container: 'gap-1.5',
      symbol: 'w-5 h-5',
      text: 'text-lg tracking-tight'
    },
    md: {
      container: 'gap-2',
      symbol: 'w-6 h-6',
      text: 'text-xl tracking-tight'
    },
    lg: {
      container: 'gap-3',
      symbol: 'w-8 h-8',
      text: 'text-2xl tracking-tight'
    }
  };

  const selectedSize = sizes[size] || sizes.md;

  // Chevron Ascend Symbol - Clean, geometric, professional
  const ChevronAscend = () => (
    <svg
      className={`${selectedSize.symbol} ${theme === 'dark' ? 'text-military-brass' : 'text-military-olive'}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 4L4 12L7 15L12 10L17 15L20 12L12 4Z"
        fill="currentColor"
        className="drop-shadow-sm"
      />
      <path
        d="M12 10L7 15L4 18L12 20L20 18L17 15L12 10Z"
        fill="currentColor"
        fillOpacity="0.5"
        className="drop-shadow-sm"
      />
    </svg>
  );

  // Wordmark only
  const Wordmark = () => (
    <span 
      className={`font-sans font-extrabold ${selectedSize.text} ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      } ${className}`}
    >
      KWEEK EARN
    </span>
  );

  // Horizontal lockup: symbol + wordmark
  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center ${selectedSize.container}`}>
        {showSymbol && <ChevronAscend />}
        <Wordmark />
      </div>
    );
  }

  // Vertical lockup: symbol above stacked wordmark
  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center ${selectedSize.container}`}>
        {showSymbol && <ChevronAscend />}
        <div className="flex flex-col items-center">
          <span className={`font-sans font-extrabold ${selectedSize.text} ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            KWEEK
          </span>
          <span className={`font-sans font-extrabold ${selectedSize.text} ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            EARN
          </span>
        </div>
      </div>
    );
  }

  // Symbol only
  if (variant === 'symbol') {
    return <ChevronAscend />;
  }

  // Wordmark only
  return <Wordmark />;
};

export default KweekEarnLogo;
