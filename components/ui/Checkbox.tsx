import React from 'react';

/**
 * Props for the Checkbox component
 */
export interface CheckboxProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The visual variant of the checkbox */
  variant?: 'default' | 'primary' | 'outline' | 'ghost';
  /** The size of the checkbox */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the checkbox is disabled */
  isDisabled?: boolean;
}

/**
 * Enterprise-grade Checkbox component for the design system.
 * Supports multiple variants, sizes, and accessibility standards.
 */
export const Checkbox: React.FC<CheckboxProps> = ({ 
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
    <div role="checkbox"
      aria-checked={props['aria-checked'] || 'false'}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim()}
      aria-disabled={isDisabled}
      aria-required="false"
      data-state={isDisabled ? 'disabled' : 'active'}
      {...props}
    >
      {children}
    </div>
  );
};

export default Checkbox;
