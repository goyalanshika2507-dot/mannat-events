import { cn } from '@/lib/utils/cn'

interface SummaryProps {
  total: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
  todaysArrivals: number
}

interface StatItemProps {
  label: string
  value: number
  dotColor: string
  bg: string
  className?: string
}

function StatItem({
  label,
  value,
  dotColor,
  bg,
  className,
}: StatItemProps) {
  return (
    <div
      className={cn(
        'rounded-[14px] border border-[#E8E5E0] p-6 flex flex-col gap-4',
        'shadow-[0_2px_12px_rgba(0,0,0,0.04)]',
        bg,
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'w-2 h-2 rounded-full',
            dotColor
          )}
        />

        <p className="text-caption text-[#737373]">
          {label}
        </p>
      </div>

      <p className="text-4xl font-light text-[#1A1A1A] tracking-tight">
        {value}
      </p>
    </div>
  )
}

export function AdminSummaryCards({
  total,
  pending,
  confirmed,
  completed,
  cancelled,
  todaysArrivals,
}: SummaryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <StatItem
        label="Total"
        value={total}
        dotColor="bg-[#1A1A1A]"
        bg="bg-white"
      />

      <StatItem
        label="Today's Arrivals"
        value={todaysArrivals}
        dotColor="bg-[#C9A84C]"
        bg="bg-white"
      />

      <StatItem
        label="Pending"
        value={pending}
        dotColor="bg-amber-400"
        bg="bg-white"
      />

      <StatItem
        label="Confirmed"
        value={confirmed}
        dotColor="bg-blue-400"
        bg="bg-white"
      />

      <StatItem
        label="Completed"
        value={completed}
        dotColor="bg-emerald-400"
        bg="bg-white"
      />

      <StatItem
        label="Cancelled"
        value={cancelled}
        dotColor="bg-red-400"
        bg="bg-white"
      />
    </div>
  )
}