import { type InputHTMLAttributes, type SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/format';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn('input-field', className)} {...props} />;
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select ref={ref} className={cn('input-field', className)} {...props}>
        {children}
      </select>
    );
  },
);
