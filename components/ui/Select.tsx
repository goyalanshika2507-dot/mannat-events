import React from 'react'
import { cn } from '@/lib/utils/cn'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, options, placeholder, className, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <select
          ref={ref}
          className={cn(
            'w-full rounded-[10px] px-4 py-3 text-sm text-[#1A1A1A] bg-white border',
            'appearance-none cursor-pointer pr-10',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:ring-offset-0 focus:border-transparent',
            error
              ? 'border-red-400 focus:ring-red-400 bg-red-50/30'
              : 'border-[#E8E5E0] hover:border-[#D4CFC9]',
            'disabled:bg-[#F5F3F0] disabled:text-[#A8A8A8] disabled:cursor-not-allowed',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom chevron icon */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A8A8]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {error && (
          <p className="mt-1.5 text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
