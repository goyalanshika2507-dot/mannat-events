import React from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  hint?: string
  rightElement?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, hint, rightElement, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
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
              rightElement && 'pr-11',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>
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
