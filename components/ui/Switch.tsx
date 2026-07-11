import React from 'react';

/**
 * Props for the Switch component
 */
export interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the switch */
  variant?: 'default' | 'primary' | 'outline' | 'ghost';
  /** Size of the switch */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the switch is disabled */
  isDisabled?: boolean;
  /** Accessibility label */
  ariaLabel?: string;
}

/**
 * Enterprise-grade Switch component for the design system.
 * Supports multiple variants, sizes, and accessibility standards.
 */
export const Switch: React.FC<SwitchProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  isDisabled = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  
  const variantStyles: Record<string, string> = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground"
  };

  const sizeStyles: Record<string, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8 rounded-md text-lg"
  };
  
  return (
    <button aria-selected={false}
      role="switch"
      type="button"
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim()}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-checked={props['aria-checked'] || false}
      data-state={isDisabled ? 'disabled' : 'active'}
      {...props}
    >
      {children}
    </button>
  );
};

export default Switch;
