import React from 'react';

/**
 * Props for the Label component
 */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Visual variant of the label */
  variant?: 'default' | 'primary' | 'outline' | 'ghost';
  /** Size of the label */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the label is disabled */
  isDisabled?: boolean;
}

/**
 * Enterprise-grade Label component for the design system.
 * Supports multiple variants, sizes, and accessibility standards.
 */
export const Label: React.FC<LabelProps> = ({ 
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
    <label 
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim()}
      aria-disabled={isDisabled}
      data-state={isDisabled ? 'disabled' : 'active'}
      {...props}
    >
      {children}
    </label>
  );
};

/** Default export for the Label UI component */
export default Label;
