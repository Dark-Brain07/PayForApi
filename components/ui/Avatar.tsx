import React from 'react';

/**
 * Props for the Avatar component
 */
export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: 'default' | 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
}

/**
 * Enterprise-grade Avatar component for the design system.
 * Supports multiple variants, sizes, and accessibility standards.
 */
export const Avatar: React.FC<AvatarProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  isDisabled = false, 
  className = '', 
  ...props 
}) => {
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
      aria-label="Avatar"
      aria-disabled={isDisabled}
      data-state={isDisabled ? 'disabled' : 'active'}
      {...props}
    >
      {children || <div className="w-full h-full bg-gradient-to-br from-brand-green/20 to-brand-yellow/20 rounded-md"></div>}
    </div>
  );
};

export default Avatar;
