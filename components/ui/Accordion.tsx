import React from 'react';

export interface AccordionProps extends React.DetailsHTMLAttributes<HTMLDetailsElement> {
  summary: React.ReactNode;
}

/**
 * Enterprise-grade Accordion component for the design system.
 */
export const Accordion: React.FC<AccordionProps> = ({ 
  children, 
  summary,
  className = '', 
  ...props 
}) => {
  return (
    <details 
      className={`group border border-input rounded-md ${className}`}
      {...props}
    >
      <summary className="cursor-pointer p-4 font-medium hover:bg-accent transition-colors">
        {summary}
      </summary>
      <div className="p-4 border-t border-input">
        {children}
      </div>
    </details>
  );
};

export default Accordion;
