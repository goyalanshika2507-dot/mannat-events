import { BookingStatus, BOOKING_STATUS_LABELS } from '@/lib/types'
import { cn } from '@/lib/utils/cn'

interface StatusBadgeProps {
  status: BookingStatus
  className?: string
}

const statusStyles: Record<BookingStatus, string> = {
  pending:   'bg-[#FEF9EC] text-[#92400E] border-[#FDE68A]',
  confirmed: 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]',
  completed: 'bg-[#F0FDF4] text-[#065F46] border-[#BBF7D0]',
  cancelled: 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]',
}

const statusDotColor: Record<BookingStatus, string> = {
  pending:   'bg-[#F59E0B]',
  confirmed: 'bg-[#3B82F6]',
  completed: 'bg-[#10B981]',
  cancelled: 'bg-[#EF4444]',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full',
        'text-[11px] font-semibold tracking-wide border',
        statusStyles[status],
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', statusDotColor[status])} />
      {BOOKING_STATUS_LABELS[status]}
    </span>
  )
}
