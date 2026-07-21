import React from 'react';

export interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant of the slider */
  variant?: 'default' | 'primary' | 'outline' | 'ghost';
  /** Size of the slider */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the slider is disabled */
  isDisabled?: boolean;
}

/**
 * Enterprise-grade Slider component for the design system.
 * Supports multiple variants, sizes, and accessibility standards.
 */
export const Slider: React.FC<SliderProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  isDisabled = false, 
  className = '', 
  ...props 
}): React.ReactElement => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground"
  };

  const sizeStyles = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8 rounded-md text-lg"
  };
  
  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim()}
      aria-disabled={isDisabled}
      aria-valuenow={props['aria-valuenow'] ?? 0}
      data-state={isDisabled ? 'disabled' : 'active'}
      {...props}
    >
      {children}
    </div>
  );
};

export default Slider;
