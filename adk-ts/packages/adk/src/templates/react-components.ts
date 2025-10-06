/**
 * React Component Templates
 * Pre-built templates for common React components
 */

export interface ComponentConfig {
	name: string;
	type: "functional" | "class";
	props?: Record<string, string>;
	hooks?: string[];
	styling?: "tailwind" | "css" | "none";
}

/**
 * Generate a functional React component
 */
export function generateFunctionalComponent(config: ComponentConfig): string {
	const propsInterface = config.props
		? `interface ${config.name}Props {
${Object.entries(config.props)
	.map(([key, type]) => `  ${key}: ${type};`)
	.join("\n")}
}`
		: "";

	const propsParam = config.props ? `props: ${config.name}Props` : "";
	const hooks = config.hooks?.map((hook) => `  ${hook}`).join("\n") || "";

	return `${propsInterface ? `${propsInterface}\n\n` : ""}export function ${config.name}(${propsParam}) {
${hooks ? `${hooks}\n` : ""}
  return (
    <div>
      <h2>${config.name}</h2>
    </div>
  );
}
`;
}

/**
 * Generate a button component
 */
export function generateButton(): string {
	return `interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
}: ButtonProps) {
  const baseStyles = 'rounded font-medium transition-colors focus:outline-none focus:ring-2';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={\`\${baseStyles} \${variantStyles[variant]} \${sizeStyles[size]} \${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }\`}
    >
      {children}
    </button>
  );
}
`;
}

/**
 * Generate a card component
 */
export function generateCard(): string {
	return `interface CardProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Card({ title, description, children, footer }: CardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {(title || description) && (
        <div className="px-6 py-4 border-b border-gray-200">
          {title && <h3 className="text-xl font-semibold text-gray-900">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
        </div>
      )}
      
      {children && <div className="px-6 py-4">{children}</div>}
      
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
}
`;
}

/**
 * Generate a form component
 */
export function generateForm(): string {
	return `'use client';

import { useState } from 'react';

interface FormProps {
  onSubmit: (data: Record<string, any>) => void;
  fields: Array<{
    name: string;
    label: string;
    type: string;
    required?: boolean;
  }>;
}

export function Form({ onSubmit, fields }: FormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = \`\${field.label} is required\`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(field => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors[field.name] && (
            <p className="mt-1 text-sm text-red-500">{errors[field.name]}</p>
          )}
        </div>
      ))}
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Submit
      </button>
    </form>
  );
}
`;
}

/**
 * Generate a modal component
 */
export function generateModal(): string {
	return `'use client';

import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
          {title && (
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            </div>
          )}
          
          <div>{children}</div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
`;
}

/**
 * Generate a data table component
 */
export function generateTable(): string {
	return `interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export function Table<T extends Record<string, any>>({ data, columns }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(column => (
              <th
                key={String(column.key)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map(column => (
                <td key={String(column.key)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.render ? column.render(row[column.key], row) : String(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
`;
}

/**
 * Component template registry
 */
export const componentTemplates = {
	button: generateButton,
	card: generateCard,
	form: generateForm,
	modal: generateModal,
	table: generateTable,
};

/**
 * Get template by component type
 */
export function getComponentTemplate(type: keyof typeof componentTemplates): string {
	const generator = componentTemplates[type];
	return generator ? generator() : generateFunctionalComponent({ 
		name: "CustomComponent",
		type: "functional"
	});
}
