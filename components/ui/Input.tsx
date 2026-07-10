import React from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  hint?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, hint, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            // Base
            'w-full rounded-[10px] px-4 py-3 text-sm text-[#1A1A1A]',
            'bg-white border',
            'placeholder:text-[#A8A8A8]',
            // Transitions
            'transition-all duration-200',
            // Focus
            'focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:ring-offset-0 focus:border-transparent',
            // Error / Normal
            error
              ? 'border-red-400 focus:ring-red-400 bg-red-50/30'
              : 'border-[#E8E5E0] hover:border-[#D4CFC9]',
            // Disabled
            'disabled:bg-[#F5F3F0] disabled:text-[#A8A8A8] disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="mt-1.5 text-xs text-[#A8A8A8]">{hint}</p>
        )}
        {error && (
          <p className="mt-1.5 text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
