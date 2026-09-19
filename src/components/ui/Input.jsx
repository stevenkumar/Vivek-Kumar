import React, { useId } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '../../lib/utils'

export const Input = React.forwardRef(
  (
    {
      id,
      name,
      label,
      helperText,
      error,
      icon: Icon,
      required = false,
      disabled = false,
      type = 'text',
      className,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id || name || generatedId

    return (
      <div className={cn('w-full space-y-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-mono uppercase tracking-wider text-theme-muted flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              {label}
              {required && <span className="text-red-400 font-bold">*</span>}
            </span>
          </label>
        )}

        <div className="relative">
          {Icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-theme-muted">
              <Icon size={16} />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            required={required}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={cn(
              'w-full bg-theme-canvas border rounded-xl px-4 py-3 text-sm text-theme-base placeholder:text-zinc-600 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed',
              Icon && 'pl-10',
              error
                ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                : 'border-theme focus:border-theme-primary focus:ring-1 focus:ring-theme-primary/30',
              className
            )}
            {...props}
          />
        </div>

        {error ? (
          <p id={`${inputId}-error`} role="alert" className="text-red-400 text-xs flex items-center gap-1.5 mt-1 font-sans">
            <AlertCircle size={13} className="shrink-0" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-theme-muted text-xs mt-1 font-sans">
            {helperText}
          </p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
