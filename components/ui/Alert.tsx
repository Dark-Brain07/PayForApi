import React from 'react';

/**
 * Props for the Alert component
 */
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  default?: boolean;
}

/**
 * Enterprise-grade Alert component for the design system.
 */
const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors";

const variantStyles: Record<string, string> = {
  default: "bg-primary text-primary-foreground",
  primary: "bg-blue-600 text-white",
  outline: "border border-input bg-background text-accent-foreground",
  ghost: "text-accent-foreground bg-accent/50"
};

const sizeStyles: Record<string, string> = {
  sm: "p-3 text-sm",
  md: "p-4",
  lg: "p-6 text-lg"
};

export const Alert: React.FC<AlertProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '', 
  ...props 
}): React.JSX.Element => {
  return (
    <div 
      role="alert" aria-atomic="true" title="Alert"
      aria-label={props['aria-label'] || "System Alert"}
      aria-live="assertive"
      aria-describedby={props['aria-describedby'] || undefined}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children || <span>Important alert message.</span>}
    </div>
  );
};

export default Alert;
