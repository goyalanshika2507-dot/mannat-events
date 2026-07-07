import { BookingStatus, BOOKING_STATUS_LABELS } from '@/lib/types'

interface StatusBadgeProps {
  status: BookingStatus
}

const statusStyles: Record<BookingStatus, string> = {
  pending:   'bg-yellow-50 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-50   text-blue-800   border-blue-200',
  completed: 'bg-green-50  text-green-800  border-green-200',
  cancelled: 'bg-red-50    text-red-800    border-red-200',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
        statusStyles[status],
      ].join(' ')}
    >
      {BOOKING_STATUS_LABELS[status]}
    </span>
  )
}
