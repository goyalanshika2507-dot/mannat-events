import { DayPlan } from '@/lib/types'

/**
 * Calculates night duration between check_in and check_out date strings.
 * Returns 0 if check_out <= check_in or either string is invalid.
 */
export function calculateDuration(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0
  const diffTime = end.getTime() - start.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

/**
 * Formats a Date object or ISO string into "DD MMM YYYY", e.g. "12 OCT 2026".
 */
export function formatDate(dateString: string | Date): string {
  if (!dateString) return '—'
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  if (isNaN(date.getTime())) return '—'
  const day = String(date.getDate()).padStart(2, '0')
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

/**
 * Maps a numeric day index (1-based) to an ordinal string, e.g. 1 -> "1st".
 */
export function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

/**
 * Generates the initial default DayPlans for a given number of days.
 */
export function generateDefaultDayPlans(duration: number): DayPlan[] {
  return Array.from({ length: duration }, (_, i) => ({
    day: i + 1,
    rooms: 0,
    guest_count: 0,
    food_preference: null as unknown as 'veg',
    lunch_function: 'Welcome Lunch',
    dinner_function: 'Welcome Dinner',
    lunch: {
      type: null as unknown as 'veg',
      menu_item_ids: [],
      menu_item_names: [],
      guest_count: 0,
    },
    dinner: {
      type: null as unknown as 'veg',
      menu_item_ids: [],
      menu_item_names: [],
      guest_count: 0,
    },
  }))
}

export function generateBookingId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'ME-'
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function getBaraatLabel(style: string): string {
  switch (style) {
    case 'traditional': return 'Traditional Horse Baraat'
    case 'stylish': return 'Vintage Luxury Car Baraat'
    case 'dj-on-wheels': return 'Mobile Sound & Brass Band'
    default: return style
  }
}
