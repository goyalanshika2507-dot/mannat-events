import React from 'react'
import { cn } from '@/lib/utils/cn'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  children: React.ReactNode
}

export function Label({ required, className, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        'block mb-2 text-xs font-semibold tracking-wide uppercase text-[#737373]',
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-0.5 text-[#C9A84C]" aria-hidden="true">
          *
        </span>
      )}
    </label>
  )
}
