import { Card } from '@/components/ui/Card'

interface SummaryProps {
  total: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
}

export function AdminSummaryCards({ total, pending, confirmed, completed, cancelled }: SummaryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card className="p-4 text-center">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Total</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{total}</p>
      </Card>
      <Card className="p-4 text-center bg-yellow-50/50">
        <p className="text-xs text-yellow-700 font-semibold uppercase tracking-wide">Pending</p>
        <p className="mt-1 text-2xl font-semibold text-yellow-900">{pending}</p>
      </Card>
      <Card className="p-4 text-center bg-blue-50/50">
        <p className="text-xs text-blue-700 font-semibold uppercase tracking-wide">Confirmed</p>
        <p className="mt-1 text-2xl font-semibold text-blue-900">{confirmed}</p>
      </Card>
      <Card className="p-4 text-center bg-green-50/50">
        <p className="text-xs text-green-700 font-semibold uppercase tracking-wide">Completed</p>
        <p className="mt-1 text-2xl font-semibold text-green-900">{completed}</p>
      </Card>
      <Card className="p-4 text-center bg-red-50/50">
        <p className="text-xs text-red-700 font-semibold uppercase tracking-wide">Cancelled</p>
        <p className="mt-1 text-2xl font-semibold text-red-900">{cancelled}</p>
      </Card>
    </div>
  )
}
