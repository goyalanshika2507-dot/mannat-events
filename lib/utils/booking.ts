import { DayMeal, MealSummary } from '@/lib/types'

/**
 * Calculates the number of nights between two ISO date strings.
 * Returns 0 if dates are invalid or check_out <= check_in.
 */
export function calculateDuration(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0
  const msPerDay = 1000 * 60 * 60 * 24
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
  return diff > 0 ? Math.round(diff / msPerDay) : 0
}

/**
 * Formats an ISO date string (YYYY-MM-DD) into a human-readable format.
 * e.g. "2026-07-07" → "7 Jul 2026"
 */
export function formatDate(iso: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Generates a human-readable unique booking ID.
 * Format: MNT-YYYYMMDD-XXXX (4 random alphanumeric chars)
 */
export function generateBookingId(): string {
  const date = new Date()
  const datePart = date
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, '')
  const randomPart = Math.random()
    .toString(36)
    .toUpperCase()
    .slice(2, 6)
  return `MNT-${datePart}-${randomPart}`
}

/**
 * Generates the initial default meal selections for a given number of days.
 * All meals default to 'skip'.
 */
export function generateDefaultMeals(duration: number): DayMeal[] {
  return Array.from({ length: duration }, (_, i) => ({
    day: i + 1,
    lunch: 'skip' as const,
    dinner: 'skip' as const,
  }))
}

/**
 * Returns a display label for a meal option.
 */
export function getMealLabel(option: DayMeal['lunch']): string {
  const labels: Record<string, string> = {
    skip: 'Skip',
    veg: 'Veg',
    'non-veg': 'Non-Veg',
  }
  return labels[option] ?? option
}

/**
 * Returns ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 */
export function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
