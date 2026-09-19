import React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

// eslint-disable-next-line react-refresh/only-export-components
export const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-theme-primary focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-theme-primary text-white hover:opacity-90',
        secondary: 'border-transparent bg-theme-secondary text-white hover:opacity-90',
        destructive: 'border-transparent bg-red-600 text-white hover:bg-red-700',
        outline: 'text-theme-base border-theme',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export default Badge
