import React from 'react'
import { cn } from '../../lib/utils'

const variantStyles = {
  h1: 'text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-theme-base',
  h2: 'text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-theme-base',
  h3: 'text-xl sm:text-2xl font-bold tracking-tight text-theme-base',
  h4: 'text-lg sm:text-xl font-bold text-theme-base',
  body: 'text-sm sm:text-base text-theme-muted leading-relaxed',
  lead: 'text-base sm:text-lg text-theme-muted leading-relaxed font-normal',
  caption: 'text-xs text-theme-muted font-mono uppercase tracking-wider',
  gradient: 'font-black tracking-tight gradient-primary-text',
  mono: 'font-mono text-xs text-theme-muted',
}

const defaultElementMap = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  lead: 'p',
  caption: 'span',
  gradient: 'h2',
  mono: 'span',
}

export const Typography = React.forwardRef(
  ({ as, variant = 'body', className, children, ...props }, ref) => {
    const Component = as || defaultElementMap[variant] || 'p'
    const variantStyle = variantStyles[variant] || variantStyles.body

    return (
      <Component ref={ref} className={cn(variantStyle, className)} {...props}>
        {children}
      </Component>
    )
  }
)

Typography.displayName = 'Typography'

export default Typography
