import React from 'react';

/**
 * Props for the Card component
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
}

/**
 * Enterprise-grade Card component for the design system.
 * Supports multiple variants, sizes, and accessibility standards.
 */
export const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  isDisabled = false, 
  className = '', 
  ...props 
}): React.ReactNode => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:ring-1 hover:ring-brand-green/30" as const;
  
  const variantStyles: Record<NonNullable<CardProps["variant"]>, string> = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground"
  };

  const sizeStyles: Record<NonNullable<CardProps["size"]>, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8 rounded-md text-lg"
  };
  
  return (
    <div role="region"
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim()}
      aria-disabled={isDisabled}
      aria-labelledby={props['aria-labelledby'] || "card-heading"}
      data-state={isDisabled ? 'disabled' : 'active'}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
