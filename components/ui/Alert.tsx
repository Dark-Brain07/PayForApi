import React from 'react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Enterprise-grade Alert component for the design system.
 */
export const Alert: React.FC<AlertProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors";
  
  const variantStyles = {
    default: "bg-primary text-primary-foreground",
    primary: "bg-blue-600 text-white",
    outline: "border border-input bg-background text-accent-foreground",
    ghost: "text-accent-foreground bg-accent/50"
  };

  const sizeStyles = {
    sm: "p-3 text-sm",
    md: "p-4",
    lg: "p-6 text-lg"
  };
  
  return (
    <div 
      role="alert"
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Alert;
