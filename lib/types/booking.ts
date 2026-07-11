// -------------------------------------------------------
// Core Application Types — Mannat Events Phase 1
// -------------------------------------------------------

export type MealOption = 'skip' | 'veg' | 'non-veg'

export interface DayMeal {
  day: number
  lunch: MealOption
  dinner: MealOption
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending:   'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export interface Booking {
  id: string
  booking_id: string
  user_id: string
  check_in: string
  check_out: string
  duration: number
  guests: number
  meals: DayMeal[]
  status: BookingStatus
  notes: string | null
  created_at: string
  updated_at: string
}

// ---- Wizard Form State ----

export interface StepDatesData {
  check_in: string
  check_out: string
}

export interface StepGuestsData {
  guests: number
}

export interface StepMealsData {
  meals: DayMeal[]
}

// Interface ko thoda behtar tarike se structured kiya hai
export interface BookingFormData extends StepDatesData, StepGuestsData, StepMealsData {
  event_type: string
  decoration_theme: string
  theme_colour: string
  room_category: string
  entertainment: string[]
  photography: string
  transportation: string
  special_requests: string
}

// ---- Meal Summary ----
export interface MealSummary {
  vegLunch: number
  nonVegLunch: number
  vegDinner: number
  nonVegDinner: number
  totalLunch: number
  totalDinner: number
}

// ---- API Responses ----
export interface ApiError {
  error: string
  code?: string
}

export interface CreateBookingResponse {
  booking_id: string
}