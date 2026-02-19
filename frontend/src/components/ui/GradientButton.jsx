import React from 'react';

const GradientButton = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  icon,
  animate = true,
  fullWidth = false
}) => {
  
  const variants = {
    primary: {
      gradient: 'from-military-olive via-military-olive/80 to-military-brass',
      hover: 'hover:from-military-olive/90 hover:via-military-olive/70 hover:to-military-brass/90',
      border: 'border-military-brass/30',
      text: 'text-white',
      shadow: 'shadow-lg shadow-military-olive/20'
    },
    secondary: {
      gradient: 'from-military-taupe via-military-taupe/80 to-military-brass/70',
      hover: 'hover:from-military-taupe/90 hover:via-military-taupe/70 hover:to-military-brass/60',
      border: 'border-military-brass/20',
      text: 'text-white',
      shadow: 'shadow-lg shadow-military-taupe/20'
    },
    success: {
      gradient: 'from-military-olive via-military-brass to-military-olive',
      hover: 'hover:from-military-olive/90 hover:via-military-brass/90 hover:to-military-olive/90',
      border: 'border-military-brass/40',
      text: 'text-white',
      shadow: 'shadow-lg shadow-military-brass/20'
    },
    danger: {
      gradient: 'from-military-crimson via-military-crimson/80 to-military-brass/50',
      hover: 'hover:from-military-crimson/90 hover:via-military-crimson/70 hover:to-military-brass/40',
      border: 'border-military-crimson/30',
      text: 'text-white',
      shadow: 'shadow-lg shadow-military-crimson/20'
    },
    warning: {
      gradient: 'from-military-brass via-amber-500 to-military-brass',
      hover: 'hover:from-military-brass/90 hover:via-amber-500/90 hover:to-military-brass/90',
      border: 'border-military-brass/40',
      text: 'text-military-dark',
      shadow: 'shadow-lg shadow-military-brass/20'
    }
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const v = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-lg font-medium
        bg-gradient-to-r ${v.gradient}
        ${v.hover} ${v.text} ${v.border} border
        ${sizeClass} ${v.shadow}
        transition-all duration-300 transform
        hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${fullWidth ? 'w-full' : ''}
        ${animate ? 'hover:animate-gradient-shift' : ''}
        group
        ${className}
      `}
    >
      {/* Animated shine overlay */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {icon && <span className="w-5 h-5">{icon}</span>}
        {children}
      </span>
    </button>
  );
};

export default GradientButton;
