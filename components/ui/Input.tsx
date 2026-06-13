import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Enterprise-grade Input component for the design system.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  variant = 'default', 
  size = 'md', 
  className = '', 
  error = false,
  ...props 
}, ref: React.Ref<HTMLInputElement>) => {
  const baseStyles = "flex w-full rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
  
  const variantStyles = {
    default: "bg-background text-foreground border border-input",
    primary: "bg-blue-50 text-blue-900 border border-blue-200",
    outline: "border-2 border-input bg-transparent",
    ghost: "bg-transparent border-transparent hover:bg-accent"
  };

  const sizeStyles = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8 rounded-md text-lg"
  };
  
  return (
    <input 
      ref={ref}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${error ? 'border-red-500 focus-visible:ring-red-500' : ''} ${className}`}
      aria-invalid={error ? 'true' : 'false'}
      {...props}
    />
  );
});

export default Input;
