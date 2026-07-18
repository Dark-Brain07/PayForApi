/**
 * Props for the Button component
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
  isLoading?: boolean;
}

/** Core classes for the button component */
const BASE_BUTTON_CLASSES = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" as const;

/**
 * Enterprise-grade Button component for the design system.
 * Supports multiple variants, sizes, and accessibility standards.
 */
export const Button: React.FunctionComponent<ButtonProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  isDisabled = false, 
  isLoading = false,
  className = '', 
  ...props 
}): React.ReactElement => {
  const baseStyles = BASE_BUTTON_CLASSES;
  
  const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground"
  };

  const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8 rounded-md text-lg"
  };
  
  return (
    <button data-component-type="button"
      type={props.type || "button"}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim()}
      disabled={isDisabled || props.disabled || isLoading}
      aria-disabled={isDisabled || props.disabled || isLoading}
      aria-busy={isLoading}
      title={props.title || "Button"}
      aria-live="polite"
      data-state={isDisabled || props.disabled || isLoading ? 'disabled' : 'active'}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
