'use client'

import { useReducer, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookingFormData, DayMeal } from '@/lib/types'
import { calculateDuration } from '@/lib/utils/booking'
import { StepDatesValues, StepGuestsValues } from '@/lib/validators/booking'
import { ProgressBar } from '@/components/booking/ProgressBar'
import { StepDates } from '@/components/booking/steps/StepDates'
import { StepGuests } from '@/components/booking/steps/StepGuests'
import { StepEventType } from '@/components/booking/steps/StepEventType'
import { StepDecorationTheme } from '@/components/booking/steps/StepDecorationTheme'
import { StepThemeColour } from '@/components/booking/steps/StepThemeColour'
import { StepRoomCategory } from '@/components/booking/steps/StepRoomCategory'
import { StepEntertainment } from '@/components/booking/steps/StepEntertainment'
import { StepPhotography } from '@/components/booking/steps/StepPhotography'
import { StepTransportation } from '@/components/booking/steps/StepTransportation'
import { StepMeals } from '@/components/booking/steps/StepMeals'
import { StepSpecialRequests } from '@/components/booking/steps/StepSpecialRequests'
import { StepReview } from '@/components/booking/steps/StepReview'

interface WizardState {
  step: number
  data: Partial<BookingFormData>
}

type WizardAction =
  | { type: 'NEXT_DATES'; payload: StepDatesValues }
  | { type: 'NEXT_GUESTS'; payload: StepGuestsValues }
  | { type: 'NEXT_EVENT'; payload: { event_type: string } }
  | { type: 'NEXT_DECORATION'; payload: { decoration_theme: string } }
  | { type: 'NEXT_THEME'; payload: { theme_colour: string } }
  | { type: 'NEXT_ROOM'; payload: { room_category: string } }
  | { type: 'NEXT_ENTERTAINMENT'; payload: { entertainment: string[] } }
  | { type: 'NEXT_PHOTOGRAPHY'; payload: { photography: string } }
  | { type: 'NEXT_TRANSPORT'; payload: { transportation: string } }
  | { type: 'NEXT_MEALS'; payload: { meals: DayMeal[] } }
  | { type: 'NEXT_REQUESTS'; payload: { special_requests: string } }
  | { type: 'PREV' }

function wizardReducer(
  state: WizardState,
  action: WizardAction
): WizardState {
  switch (action.type) {
    case 'NEXT_DATES':
      return {
        step: 2,
        data: { ...state.data, ...action.payload },
      }

    case 'NEXT_GUESTS':
      return {
        step: 3,
        data: { ...state.data, ...action.payload },
      }

    case 'NEXT_EVENT':
      return {
        step: 4,
        data: { ...state.data, ...action.payload },
      }

    case 'NEXT_DECORATION':
      return {
        step: 5,
        data: { ...state.data, ...action.payload },
      }

    case 'NEXT_THEME':
      return {
        step: 6,
        data: { ...state.data, ...action.payload },
      }

    case 'NEXT_ROOM':
      return {
        step: 7,
        data: { ...state.data, ...action.payload },
      }

    case 'NEXT_ENTERTAINMENT':
      return {
        step: 8,
        data: { ...state.data, ...action.payload },
      }

    case 'NEXT_PHOTOGRAPHY':
      return {
        step: 9,
        data: { ...state.data, ...action.payload },
      }

    case 'NEXT_TRANSPORT':
      return {
        step: 10,
        data: { ...state.data, ...action.payload },
      }

    case 'NEXT_MEALS':
      return {
        step: 11,
        data: { ...state.data, ...action.payload },
      }

    case 'NEXT_REQUESTS':
      return {
        step: 12,
        data: { ...state.data, ...action.payload },
      }

    case 'PREV':
      return {
        ...state,
        step: Math.max(1, state.step - 1),
      }

    default:
      return state
  }
}

const STEP_LABELS = [
  'Dates',
  'Guests',
  'Event',
  'Decoration',
  'Theme',
  'Room',
  'Entertainment',
  'Photography',
  'Transport',
  'Meals',
  'Requests',
  'Review',
]

const TOTAL_STEPS = STEP_LABELS.length

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(state.data),
      })

      const json = await response.json()

      if (!response.ok) {
        setSubmitError(
          json.error ?? 'Booking submission failed. Please try again.'
        )
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
          onNext={(payload) =>
            dispatch({
              type: 'NEXT_DATES',
              payload,
            })
          }
        />
      )}

      {state.step === 2 && (
        <StepGuests
          data={state.data}
          onNext={(payload) =>
            dispatch({
              type: 'NEXT_GUESTS',
              payload,
            })
          }
          onPrev={() =>
            dispatch({
              type: 'PREV',
            })
          }
        />
      )}

      {state.step === 3 && (
        <StepEventType
          data={state.data}
          onNext={(payload) =>
            dispatch({
              type: 'NEXT_EVENT',
              payload,
            })
          }
          onPrev={() =>
            dispatch({
              type: 'PREV',
            })
          }
        />
      )}

      {state.step === 4 && (
        <StepDecorationTheme
          data={state.data}
          onNext={(payload) =>
            dispatch({
              type: 'NEXT_DECORATION',
              payload,
            })
          }
          onPrev={() =>
            dispatch({
              type: 'PREV',
            })
          }
        />
      )}

      {state.step === 5 && (
        <StepThemeColour
          data={state.data}
          onNext={(payload) =>
            dispatch({
              type: 'NEXT_THEME',
              payload,
            })
          }
          onPrev={() =>
            dispatch({
              type: 'PREV',
            })
          }
        />
      )}

      {state.step === 6 && (
        <StepRoomCategory
          data={state.data}
          onNext={(payload) =>
            dispatch({
              type: 'NEXT_ROOM',
              payload,
            })
          }
          onPrev={() =>
            dispatch({
              type: 'PREV',
            })
          }
        />
      )}

      {state.step === 7 && (
        <StepEntertainment
          data={state.data}
          onNext={(payload) =>
            dispatch({
              type: 'NEXT_ENTERTAINMENT',
              payload,
            })
          }
          onPrev={() =>
            dispatch({
              type: 'PREV',
            })
          }
        />
      )}

      {state.step === 8 && (
        <StepPhotography
          data={state.data}
          onNext={(payload) =>
            dispatch({
              type: 'NEXT_PHOTOGRAPHY',
              payload,
            })
          }
          onPrev={() =>
            dispatch({
              type: 'PREV',
            })
          }
        />
      )}

      {state.step === 9 && (
        <StepTransportation
          data={state.data}
          onNext={(payload) =>
            dispatch({
              type: 'NEXT_TRANSPORT',
              payload,
            })
          }
          onPrev={() =>
            dispatch({
              type: 'PREV',
            })
          }
        />
      )}

      {state.step === 10 && (
        <StepMeals
          data={state.data}
          duration={duration}
          onNext={(payload) =>
            dispatch({
              type: 'NEXT_MEALS',
              payload,
            })
          }
          onPrev={() =>
            dispatch({
              type: 'PREV',
            })
          }
        />
      )}

      {state.step === 11 && (
        <StepSpecialRequests
          data={state.data}
          onNext={(payload) =>
            dispatch({
              type: 'NEXT_REQUESTS',
              payload,
            })
          }
          onPrev={() =>
            dispatch({
              type: 'PREV',
            })
          }
        />
      )}

      {state.step === 12 && isCompleteData(state.data) && (
        <>
          <StepReview
            data={state.data}
            onSubmit={handleSubmit}
            onPrev={() =>
              dispatch({
                type: 'PREV',
              })
            }
            isSubmitting={isSubmitting}
          />

          {submitError && (
            <p className="mt-4 text-center text-sm text-red-600">
              {submitError}
            </p>
          )}
        </>
      )}

    </div>
  )
}

function isCompleteData(
  data: Partial<BookingFormData>
): data is BookingFormData {
  return (
    data.check_in !== undefined &&
    data.check_out !== undefined &&
    data.guests !== undefined &&
    data.event_type !== undefined &&
    data.decoration_theme !== undefined &&
    data.theme_colour !== undefined &&
    data.room_category !== undefined &&
    data.entertainment !== undefined &&
    data.photography !== undefined &&
    data.transportation !== undefined &&
    data.meals !== undefined &&
    data.special_requests !== undefined
  )
}