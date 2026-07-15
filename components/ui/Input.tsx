import { InputHTMLAttributes, forwardRef } from 'react';

/**
 * Props for the Input component
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  id?: string;
  variant?: 'default' | 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  error: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Enterprise-grade Input component for the design system.
 */
const baseStyles = "flex w-full rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  variant = 'default', 
  size = 'md', 
  className = '', 
  error,
  ...props 
}, ref: React.Ref<HTMLInputElement>) => {
  
  const variantStyles: Record<string, string> = {
    default: "bg-background text-foreground border border-input",
    primary: "bg-blue-50 text-blue-900 border border-blue-200",
    outline: "border-2 border-input bg-transparent",
    ghost: "bg-transparent border-transparent hover:bg-accent"
  };

  const sizeStyles: Record<string, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8 rounded-md text-lg"
  };
  
  return (
    <input data-has-title="true"
      ref={ref}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${!!error ? 'border-red-500 focus-visible:ring-red-500' : ''} ${className}`.trim()}
      aria-hidden={props.type === 'hidden' ? 'true' : undefined}
      aria-invalid={!!error ? 'true' : undefined}
      aria-required={props.required ? 'true' : undefined}
      aria-describedby={error && props.id ? `${props.id}-error` : props['aria-describedby']}
      title={props.title || (typeof props.placeholder === 'string' ? props.placeholder : "Input field")}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
