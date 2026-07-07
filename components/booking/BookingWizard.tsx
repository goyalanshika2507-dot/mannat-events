'use client'

import { useReducer, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookingFormData, DayMeal } from '@/lib/types'
import { calculateDuration } from '@/lib/utils/booking'
import { StepDatesValues, StepGuestsValues } from '@/lib/validators/booking'
import { ProgressBar } from '@/components/booking/ProgressBar'
import { StepDates } from '@/components/booking/steps/StepDates'
import { StepGuests } from '@/components/booking/steps/StepGuests'
import { StepMeals } from '@/components/booking/steps/StepMeals'
import { StepReview } from '@/components/booking/steps/StepReview'

// ---- Wizard State ----

interface WizardState {
  step: number
  data: Partial<BookingFormData>
}

type WizardAction =
  | { type: 'NEXT_DATES';   payload: StepDatesValues }
  | { type: 'NEXT_GUESTS';  payload: StepGuestsValues }
  | { type: 'NEXT_MEALS';   payload: { meals: DayMeal[] } }
  | { type: 'PREV' }

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'NEXT_DATES':
      return { step: 2, data: { ...state.data, ...action.payload } }
    case 'NEXT_GUESTS':
      return { step: 3, data: { ...state.data, ...action.payload } }
    case 'NEXT_MEALS':
      return { step: 4, data: { ...state.data, ...action.payload } }
    case 'PREV':
      return { ...state, step: Math.max(1, state.step - 1) }
    default:
      return state
  }
}

// ---- Step config ----

const STEP_LABELS = ['Dates', 'Guests', 'Meals', 'Review']
const TOTAL_STEPS = STEP_LABELS.length

// ---- Component ----

export function BookingWizard() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [state, dispatch] = useReducer(wizardReducer, {
    step: 1,
    data: {},
  })

  const duration = calculateDuration(
    state.data.check_in ?? '',
    state.data.check_out ?? ''
  )

  async function handleSubmit() {
    if (!isCompleteData(state.data)) return
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state.data),
      })

      const json = await response.json()

      if (!response.ok) {
        setSubmitError(json.error ?? 'Booking submission failed. Please try again.')
        setIsSubmitting(false)
        return
      }

      router.push(`/booking/confirmation?id=${json.booking_id}`)
    } catch {
      setSubmitError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressBar
        currentStep={state.step}
        totalSteps={TOTAL_STEPS}
        stepLabels={STEP_LABELS}
      />

      {state.step === 1 && (
        <StepDates
          data={state.data}
          onNext={(payload) => dispatch({ type: 'NEXT_DATES', payload })}
        />
      )}

      {state.step === 2 && (
        <StepGuests
          data={state.data}
          onNext={(payload) => dispatch({ type: 'NEXT_GUESTS', payload })}
          onPrev={() => dispatch({ type: 'PREV' })}
        />
      )}

      {state.step === 3 && (
        <StepMeals
          data={state.data}
          duration={duration}
          onNext={(payload) => dispatch({ type: 'NEXT_MEALS', payload })}
          onPrev={() => dispatch({ type: 'PREV' })}
        />
      )}

      {state.step === 4 && isCompleteData(state.data) && (
        <>
          <StepReview
            data={state.data as BookingFormData}
            onSubmit={handleSubmit}
            onPrev={() => dispatch({ type: 'PREV' })}
            isSubmitting={isSubmitting}
          />
          {submitError && (
            <p className="mt-4 text-sm text-red-600 text-center" role="alert">
              {submitError}
            </p>
          )}
        </>
      )}
    </div>
  )
}

function isCompleteData(data: Partial<BookingFormData>): data is BookingFormData {
  return !!(
    data.check_in &&
    data.check_out &&
    data.guests !== undefined &&
    data.meals !== undefined
  )
}
