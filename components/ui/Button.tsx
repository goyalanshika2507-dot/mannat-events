'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-[#1A1A1A] text-white',
    'hover:bg-[#2D2D2D]',
    'focus-visible:ring-[#1A1A1A]',
    'shadow-sm hover:shadow-md',
  ].join(' '),

  secondary: [
    'bg-white text-[#1A1A1A]',
    'border border-[#E8E5E0]',
    'hover:bg-[#FAF8F5] hover:border-[#D4CFC9]',
    'focus-visible:ring-[#C9A84C]',
    'shadow-sm',
  ].join(' '),

  outline: [
    'bg-transparent text-[#1A1A1A]',
    'border border-[#1A1A1A]',
    'hover:bg-[#1A1A1A] hover:text-white',
    'focus-visible:ring-[#1A1A1A]',
  ].join(' '),

  ghost: [
    'bg-transparent text-[#737373]',
    'hover:bg-[#F0EDE9] hover:text-[#1A1A1A]',
    'focus-visible:ring-[#C9A84C]',
  ].join(' '),

  danger: [
    'bg-red-700 text-white',
    'hover:bg-red-800',
    'focus-visible:ring-red-600',
    'shadow-sm',
  ].join(' '),

  gold: [
    'bg-[#C9A84C] text-white',
    'hover:bg-[#B8943E]',
    'focus-visible:ring-[#C9A84C]',
    'shadow-sm hover:shadow-md',
  ].join(' '),
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs font-semibold tracking-wide rounded-[8px]',
  md: 'px-5 py-2.5 text-sm font-semibold tracking-wide rounded-[10px]',
  lg: 'px-7 py-3.5 text-sm font-semibold tracking-wide rounded-[10px]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
        'active:scale-[0.98]',
        'cursor-pointer select-none whitespace-nowrap',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  )
}
