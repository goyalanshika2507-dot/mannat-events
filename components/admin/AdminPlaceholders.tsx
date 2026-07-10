import { Card } from '@/components/ui/Card'
import { Activity, BarChart3, CheckCircle2, UserPlus, FilePlus2 } from 'lucide-react'

export function OccupancyAnalytics() {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA] flex justify-between items-center">
        <h4 className="text-caption text-[#C9A84C]">Analytics</h4>
        <span className="text-[10px] text-[#A8A8A8] uppercase font-bold tracking-wider">Occupancy</span>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-light text-[#1A1A1A]">78%</span>
          <span className="text-xs font-semibold text-[#065F46] bg-[#F0FDF4] px-2 py-0.5 rounded">+4.2% this month</span>
        </div>

        {/* Minimalist Bar Chart representation with SVG/CSS */}
        <div className="h-32 flex items-end gap-3 pt-2">
          {[
            { month: 'Jan', val: 'h-[40%]' },
            { month: 'Feb', val: 'h-[55%]' },
            { month: 'Mar', val: 'h-[48%]' },
            { month: 'Apr', val: 'h-[70%]' },
            { month: 'May', val: 'h-[85%]' },
            { month: 'Jun', val: 'h-[78%]' },
          ].map((bar) => (
            <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className={`w-full rounded-t-sm bg-[#FAF8F5] border border-[#E8E5E0] hover:bg-[#C9A84C] hover:border-[#C9A84C] transition-all duration-300 ${bar.val}`} />
              <span className="text-[10px] font-semibold text-[#A8A8A8] uppercase tracking-wider">{bar.month}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

interface TimelineItemProps {
  icon: React.ReactNode
  title: string
  meta: string
  time: string
  isLast?: boolean
}

function TimelineItem({ icon, title, meta, time, isLast = false }: TimelineItemProps) {
  return (
    <div className="flex gap-4">
      {/* Icon track */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-8 h-8 rounded-full border border-[#E8E5E0] bg-[#FAF8F5] flex items-center justify-center text-[#737373]">
          {icon}
        </div>
        {!isLast && <div className="w-px flex-1 bg-[#E8E5E0] my-2" />}
      </div>

      {/* Info */}
      <div className="space-y-1 pb-4">
        <p className="text-xs font-semibold text-[#1A1A1A]">{title}</p>
        <p className="text-[11px] text-[#737373] font-mono">{meta}</p>
        <p className="text-[10px] text-[#A8A8A8] uppercase tracking-wider">{time}</p>
      </div>
    </div>
  )
}

export function ActivityTimeline() {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA] flex justify-between items-center">
        <h4 className="text-caption text-[#C9A84C]">Activity Log</h4>
        <span className="text-[10px] text-[#A8A8A8] uppercase font-bold tracking-wider">Live System</span>
      </div>
      <div className="p-6">
        <div className="flex flex-col">
          <TimelineItem
            icon={<FilePlus2 size={14} />}
            title="New booking submitted"
            meta="ID: #MN-1082"
            time="2 minutes ago"
          />
          <TimelineItem
            icon={<CheckCircle2 size={14} />}
            title="Booking status confirmed"
            meta="ID: #MN-1049"
            time="1 hour ago"
          />
          <TimelineItem
            icon={<UserPlus size={14} />}
            title="New guest registered"
            meta="UID: 7d2fa91b…"
            time="4 hours ago"
            isLast
          />
        </div>
      </div>
    </Card>
  )
}
