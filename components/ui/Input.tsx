import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={[
            'w-full rounded border px-3 py-2 text-sm text-gray-900',
            'placeholder:text-gray-400 bg-white',
            'focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent',
            'transition-colors',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            className,
          ].join(' ')}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
