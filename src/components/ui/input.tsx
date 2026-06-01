import { cn } from '@/lib/utils';
import { forwardRef, useId } from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className, required, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const describedBy = error
      ? `${inputId}-error`
      : hint
      ? `${inputId}-hint`
      : undefined;

    return (
      <div className="flex flex-col gap-2">
        {label ? (
          <label
            htmlFor={inputId}
            className="text-sm font-medium tracking-[0.01em] text-dusk/74"
          >
            {label}
            {required ? (
              <span className="ml-1 text-plum" aria-hidden="true">
                *
              </span>
            ) : null}
          </label>
        ) : null}

        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={describedBy}
            className={cn(
              [
                'w-full rounded-2xl border bg-white px-4 py-3.5 text-sm text-dusk outline-none',
                'placeholder:text-dusk/28',
                'transition-all duration-300 ease-out',
                'focus:-translate-y-0.5 focus:ring-4',
                error
                  ? 'border-[#d8a8bf] bg-[#fffafb] focus:border-[#b75a84] focus:ring-[#f3dbe7]'
                  : 'border-dusk/10 focus:border-plum/35 focus:ring-plum/10',
                'disabled:cursor-not-allowed disabled:bg-black/[0.02] disabled:text-dusk/40',
                className,
              ].join(' ')
            )}
            {...props}
          />
        </div>

        {error ? (
          <p
            id={`${inputId}-error`}
            className="text-sm leading-6 text-[#9b4667]"
          >
            {error}
          </p>
        ) : hint ? (
          <p
            id={`${inputId}-hint`}
            className="text-sm leading-6 text-dusk/46"
          >
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';