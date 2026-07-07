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

// ---- Step 3: Meals ----

const MealOptionEnum = z.enum(['skip', 'veg', 'non-veg'], {
  error: 'Please select a meal option',
})

const DayMealSchema = z.object({
  day: z.number().int().positive(),
  lunch: MealOptionEnum,
  dinner: MealOptionEnum,
})

export const StepMealsSchema = z.object({
  meals: z.array(DayMealSchema).min(1, 'Meal selections are required'),
})

// ---- Full Booking Schema ----

export const BookingSchema = StepDatesSchema.and(StepGuestsSchema).and(StepMealsSchema)

// ---- Inferred Types ----

export type StepDatesValues  = z.infer<typeof StepDatesSchema>
export type StepGuestsValues = z.infer<typeof StepGuestsSchema>
export type StepMealsValues  = z.infer<typeof StepMealsSchema>
export type BookingValues     = z.infer<typeof BookingSchema>
