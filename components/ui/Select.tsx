import React from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          ref={ref}
          className={[
            'w-full rounded border px-3 py-2 text-sm text-gray-900 bg-white',
            'focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent',
            'transition-colors appearance-none',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            className,
          ].join(' ')}
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
        {error && (
          <p className="mt-1 text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
