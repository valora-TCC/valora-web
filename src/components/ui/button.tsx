import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/format';

type ButtonVariant = 'primary' | 'ghost' | 'danger';

const variants: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

export function Button({
  variant = 'primary',
  className,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button type={type} className={cn(variants[variant], className)} {...props} />;
}
