import React from 'react'
import { cn } from '@/lib/utils/cn'

// ---- Card ----

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  hover?: boolean
  as?: React.ElementType
}

export function Card({
  children,
  className,
  hover = false,
  as: As = 'div',
  ...props
}: CardProps) {
  return (
    <As
      className={cn(
        'luxury-card luxury-card-glow rounded-[16px] p-8',
        'transition-all duration-300',
        hover &&
          'hover:shadow-[0_12px_38px_rgba(26,26,26,0.06)] hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </As>
  )
}

// ---- CardHeader ----

interface CardHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  eyebrow?: string
}

export function CardHeader({
  title,
  description,
  action,
  eyebrow,
}: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        {eyebrow && <p className="text-caption mb-1">{eyebrow}</p>}

        <h2 className="text-title">{title}</h2>

        {description && (
          <p className="mt-1 text-sm text-[#737373]">{description}</p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

// ---- StatCard ----

interface StatCardProps {
  label: string
  value: string | number
  className?: string
  accent?: boolean
}

export function StatCard({
  label,
  value,
  className,
  accent = false,
}: StatCardProps) {
  return (
    <Card className={cn('p-6', className)}>
      <p className="text-caption mb-3">{label}</p>

      <p
        className={cn(
          'text-3xl font-light tracking-tight',
          accent ? 'text-[#C9A84C]' : 'text-[#1A1A1A]'
        )}
      >
        {value}
      </p>
    </Card>
  )
}