// -------------------------------------------------------
// Core Application Types — Mannat Events Final Flow
// -------------------------------------------------------

export interface MenuItem {
  id: string
  type: 'veg' | 'non-veg'
  name: string
  sub_label?: string | null
  description?: string | null
  price?: number
  is_active: boolean
  sort_order: number
  created_at?: string
  updated_at?: string
}

export interface DecorationTheme {
  id: string
  title: string
  description: string | null
  image_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface WeddingFunction {
  id: string
  name: string
  is_active: boolean
  sort_order: number
}

// -------------------------------------------------------
// Day Planning Types
// -------------------------------------------------------

import { MenuConfig } from '@/lib/menu/types'

export type FoodPreference = 'veg' | 'non-veg'

export interface MealSelection {
  type: 'veg' | 'non-veg'
  menu_item_ids: string[]
  menu_item_names: string[]
  guest_count: number
  menu_config?: MenuConfig
}

export interface DayPlan {
  day: number
  rooms: number
  guest_count: number
  food_preference: FoodPreference
  lunch_function?: string
  dinner_function?: string
  lunch: MealSelection
  dinner: MealSelection
}

export interface FunctionAssignment {
  function_id: string
  function_name: string
  day: number
}

// -------------------------------------------------------
// Hotel Comparison Type
// -------------------------------------------------------

export interface HotelComparisonItem {
  id: string
  name: string
  star_rating: number
  image_url: string
  location: string
  package_price: number
  price_display: string
  room_category: string
  venue_capacity: string
  catering_details: string
  amenities: string[]
  inclusions: string[]
  exclusions: string[]
  tax_info: string
}

export type DecorationPackageTier = 'silver' | 'gold' | 'platinum' | 'luxury'

// -------------------------------------------------------
// Booking Status
// -------------------------------------------------------

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending:   'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

// -------------------------------------------------------
// Booking — Database Record
// -------------------------------------------------------

export interface Booking {
  id: string
  booking_id: string
  user_id: string
  customer_email: string | null
  check_in: string
  check_out: string
  duration: number
  phone: string | null
  baraat_style: string | null
  decoration_theme_id: string | null
  decoration_package?: DecorationPackageTier
  selected_hotel?: HotelComparisonItem
  total_price?: number
  day_plans: DayPlan[]
  functions: FunctionAssignment[]
  is_flagged: boolean
  status: BookingStatus
  notes: string | null
  created_at: string
  updated_at: string
}

// -------------------------------------------------------
// Wizard Form State
// -------------------------------------------------------

export interface BookingFormData {
  check_in: string
  check_out: string
  day_plans: DayPlan[]
  functions: FunctionAssignment[]
  decoration_theme_id?: string
  decoration_theme_title?: string
  decoration_package?: DecorationPackageTier
  baraat_style?: string
  phone?: string
  selected_hotel?: HotelComparisonItem
}

// -------------------------------------------------------
// API Responses
// -------------------------------------------------------

export interface ApiError {
  error: string
  code?: string
}

export interface CreateBookingResponse {
  booking_id: string
}

// -------------------------------------------------------
// Admin: Blocked Phone
// -------------------------------------------------------

export interface BlockedPhone {
  id: string
  phone: string
  reason: string | null
  blocked_at: string
  blocked_by: string | null
}

export interface MealSummary {
  vegLunch: number
  nonVegLunch: number
  vegDinner: number
  nonVegDinner: number
  totalLunch: number
  totalDinner: number
}
