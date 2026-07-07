// -------------------------------------------------------
// Core Application Types — Mannat Events Phase 1
// -------------------------------------------------------

// ---- Auth & User ----

export type UserRole = 'user' | 'admin'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

// ---- Meal Types ----

export type MealOption = 'skip' | 'veg' | 'non-veg'

export interface DayMeal {
  day: number        // 1-indexed
  lunch: MealOption
  dinner: MealOption
  // Breakfast is always included — not stored
}

// ---- Booking Status ----

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending:   'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

// ---- Booking ----

export interface Booking {
  id: string
  booking_id: string
  user_id: string
  check_in: string    // ISO date string YYYY-MM-DD
  check_out: string   // ISO date string YYYY-MM-DD
  duration: number
  guests: number
  meals: DayMeal[]
  status: BookingStatus
  notes: string | null
  created_at: string
  updated_at: string
}

// Booking joined with profile data (for admin views)
export interface BookingWithProfile extends Booking {
  profiles: Pick<Profile, 'email' | 'full_name'>
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

export interface BookingFormData extends StepDatesData, StepGuestsData, StepMealsData {}

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
