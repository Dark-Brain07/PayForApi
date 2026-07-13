import React from 'react';

/**
 * Props for the Accordion component
 */
export interface AccordionProps extends React.DetailsHTMLAttributes<HTMLDetailsElement> {
  /** The summary or title of the accordion */
  summary: React.ReactNode;
}

/**
 * Enterprise-grade Accordion component for the design system.
 */
export const Accordion: React.FC<AccordionProps> = ({ 
  children, 
  summary = 'Details',
  className = '', 
  ...props 
}) => {
  return (
    <details 
      title="Accordion details"
      className={`group border border-input rounded-md ${className}`}
      {...props}
    >
      <summary aria-label="Toggle accordion" className="cursor-pointer p-4 font-medium hover:bg-accent transition-colors">
        {summary}
      </summary>
      <div className="p-4 border-t border-input">
        {children || <p className="text-muted-foreground">No content provided.</p>}
      </div>
    </details>
  );
};

/** Default export for the Accordion UI component */
export default Accordion;
