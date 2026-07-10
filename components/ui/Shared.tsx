import { cn } from '@/lib/utils/cn'

// ---- Section Header ----

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(
      'space-y-3',
      align === 'center' && 'text-center',
      className
    )}>
      {eyebrow && (
        <div className={cn('flex items-center gap-3', align === 'center' && 'justify-center')}>
          <span className="divider-gold" />
          <p className="text-caption text-[#C9A84C]">{eyebrow}</p>
        </div>
      )}
      <h2 className="text-headline">{title}</h2>
      {description && (
        <p className="text-body-lg text-[#737373] max-w-2xl">
          {description}
        </p>
      )}
    </div>
  )
}

// ---- Empty State ----

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      'py-16 px-8 rounded-[14px]',
      'border border-dashed border-[#E8E5E0]',
      className
    )}>
      {icon && (
        <div className="mb-4 text-[#D4CFC9]">
          {icon}
        </div>
      )}
      <p className="text-sm font-semibold text-[#1A1A1A] mb-1">{title}</p>
      {description && (
        <p className="text-sm text-[#737373] max-w-xs">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

// ---- Skeleton ----

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton', className)} />
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-[14px] border border-[#E8E5E0] p-6 space-y-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-16" />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-0">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-[#F0EDE9] last:border-0">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  )
}

// ---- Divider ----

interface DividerProps {
  className?: string
  label?: string
}

export function Divider({ className, label }: DividerProps) {
  if (label) {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        <div className="flex-1 h-px bg-[#E8E5E0]" />
        <span className="text-xs text-[#A8A8A8] font-medium">{label}</span>
        <div className="flex-1 h-px bg-[#E8E5E0]" />
      </div>
    )
  }
  return <div className={cn('h-px bg-[#E8E5E0]', className)} />
}
