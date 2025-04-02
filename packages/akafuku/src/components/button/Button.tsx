import { useMemo, type ButtonHTMLAttributes, type FC } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** @default false */
  fullWidth?: boolean;
  /** @default 'medium' */
  size?: 'small' | 'medium' | 'large';
  /** @default 'primary' */
  variant?: 'primary' | 'secondary' | 'destructive';
}

export const Button: FC<ButtonProps> = ({
  fullWidth = false,
  size = 'medium',
  variant = 'primary',
  children,
  className,
  disabled,
  ...rest
}) => {
  const baseClasses = 'rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-tint';

  const variantClasses = useMemo(
    () => ({
      primary: 'bg-primary text-primary-contrast hover:bg-primary-shade active:primary-shade',
      secondary: 'bg-secondary text-secondary-contrast hover:bg-secondary-shade active:bg-secondary-shade',
      destructive: 'bg-danger text-danger-contrast hover:bg-danger-shade active:bg-danger-shade',
    }),
    []
  );

  const sizeClasses = useMemo(
    () => ({
      small: 'px-2 py-1 text-xs',
      medium: 'px-4 py-2 text-sm',
      large: 'px-6 py-3',
    }),
    []
  );

  const disabledClasses = useMemo(() => (disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'), [disabled]);

  const widthClasses = useMemo(() => (fullWidth ? 'w-full' : ''), [fullWidth]);

  const buttonClasses = useMemo(
    () =>
      `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${disabledClasses} 
    ${widthClasses}
    ${className}
  `
        .trim()
        .replace(/\s+/g, '\u0020'),
    [className, disabledClasses, size, sizeClasses, variant, variantClasses, widthClasses]
  );

  return (
    <button className={buttonClasses} disabled={disabled} {...rest}>
      {children}
    </button>
  );
};
