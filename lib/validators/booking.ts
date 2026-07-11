import { z } from 'zod'

// ---- Step 1: Dates ----

export const StepDatesSchema = z
  .object({
    check_in: z.string().min(1, 'Check-in date is required'),
    check_out: z.string().min(1, 'Check-out date is required'),
  })
  .refine(
    (data) => {
      if (!data.check_in || !data.check_out) return true
      return new Date(data.check_out) > new Date(data.check_in)
    },
    {
      message: 'Check-out must be after check-in',
      path: ['check_out'],
    }
  )
  .refine(
    (data) => {
      if (!data.check_in) return true
      return new Date(data.check_in) >= new Date(new Date().toDateString())
    },
    {
      message: 'Check-in date cannot be in the past',
      path: ['check_in'],
    }
  )

// ---- Step 2: Guests ----

export const StepGuestsSchema = z.object({
  guests: z
    .number()
    .int('Must be a whole number')
    .min(1, 'At least 1 guest is required')
    .max(500, 'Maximum 500 guests allowed'),
})

// ---- Meals ----

const MealOptionEnum = z.enum(['skip', 'veg', 'non-veg'])

const DayMealSchema = z.object({
  day: z.number().int().positive(),
  lunch: MealOptionEnum,
  dinner: MealOptionEnum,
})

export const StepMealsSchema = z.object({
  meals: z
    .array(DayMealSchema)
    .min(1, 'Meal selections are required'),
})

// ---- Phase 2 Event Details ----

export const StepEventSchema = z.object({
  event_type: z.string().min(1, 'Event type is required'),
})

export const StepDecorationSchema = z.object({
  decoration_theme: z
    .string()
    .min(1, 'Decoration theme is required'),
})

export const StepThemeColourSchema = z.object({
  theme_colour: z
    .string()
    .min(1, 'Theme colour is required'),
})

export const StepRoomSchema = z.object({
  room_category: z
    .string()
    .min(1, 'Room category is required'),
})

// ---- Additional Services ----

export const StepEntertainmentSchema = z.object({
  entertainment: z.array(z.string()),
})

export const StepPhotographySchema = z.object({
  photography: z.string().min(1, 'Photography option is required'),
})

export const StepTransportationSchema = z.object({
  transportation: z
    .string()
    .min(1, 'Transportation option is required'),
})

export const StepSpecialRequestsSchema = z.object({
  special_requests: z.string(),
})

// ---- Full Booking Schema ----

export const BookingSchema = z.object({
  check_in: z.string().min(1),
  check_out: z.string().min(1),

  guests: z.number().int().min(1).max(500),

  event_type: z.string().min(1),
  decoration_theme: z.string().min(1),
  theme_colour: z.string().min(1),
  room_category: z.string().min(1),

  entertainment: z.array(z.string()),
  photography: z.string().min(1),
  transportation: z.string().min(1),
  special_requests: z.string(),

  meals: z.array(DayMealSchema).min(1),
})

// ---- Inferred Types ----

export type StepDatesValues = z.infer<typeof StepDatesSchema>
export type StepGuestsValues = z.infer<typeof StepGuestsSchema>
export type StepMealsValues = z.infer<typeof StepMealsSchema>
export type BookingValues = z.infer<typeof BookingSchema>