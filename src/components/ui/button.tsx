import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

const variants = cva(
  [
    'relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full',
    'font-semibold tracking-[0.01em] transition-all duration-300 ease-out',
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/20',
    'disabled:pointer-events-none disabled:opacity-55',
    'active:scale-[0.985]',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'bg-dusk text-white shadow-soft',
          'hover:-translate-y-0.5 hover:bg-plum hover:shadow-[0_14px_34px_rgba(91,45,142,0.22)]',
        ].join(' '),
        secondary: [
          'border border-dusk/10 bg-white text-dusk shadow-[0_6px_18px_rgba(34,28,24,0.05)]',
          'hover:-translate-y-0.5 hover:border-plum/20 hover:bg-pearl hover:text-plum',
        ].join(' '),
        ghost: [
          'bg-transparent text-dusk',
          'hover:bg-white/70 hover:text-plum',
        ].join(' '),
      },
      size: {
        sm: 'min-h-[42px] px-4 py-2 text-sm',
        md: 'min-h-[46px] px-5 py-2.5 text-sm',
        lg: 'min-h-[52px] px-6 py-3.5 text-base',
      },
      loading: {
        true: 'text-transparent',
        false: '',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      loading: false,
      fullWidth: false,
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof variants> & {
    loading?: boolean;
    fullWidth?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading,
      fullWidth,
      children,
      disabled,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        variants({ variant, size, loading, fullWidth, className })
      )}
      {...props}
    >
      <span
        className={cn(
          'inline-flex items-center gap-2 transition-opacity duration-200',
          loading ? 'opacity-0' : 'opacity-100'
        )}
      >
        {children}
      </span>

      {loading ? (
        <span className="absolute inset-0 inline-flex items-center justify-center gap-2 text-current">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/25 border-t-current" />
          <span className="text-sm font-semibold">Loading…</span>
        </span>
      ) : null}
    </button>
  )
);

Button.displayName = 'Button';