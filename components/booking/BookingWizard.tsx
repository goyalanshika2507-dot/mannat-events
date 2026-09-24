'use client'

import { useReducer, useEffect, useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

import {
  BookingFormData,
  DayPlan,
  DecorationPackageTier,
} from '@/lib/types'
import {
  calculateDuration,
  generateDefaultDayPlans,
} from '@/lib/utils/booking'

import { StepDates } from './steps/StepDates'
import { StepDayPlan } from './steps/StepDayPlan'
import { StepDecorationTheme } from './steps/StepDecorationTheme'
import { StepReview } from './steps/StepReview'
import { StepHotelComparison } from './steps/StepHotelComparison'
import { DynamicProgressBar } from './DynamicProgressBar'
import { LiveBookingSummary } from './LiveBookingSummary'
import { Phone, ShieldCheck, AlertCircle, ArrowRight, RefreshCcw, Info } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'

type StepKind =
  | { kind: 'dates' }
  | { kind: 'day-plan'; day: number }
  | { kind: 'review' }
  | { kind: 'verify' }
  | { kind: 'hotel-comparison' }

function buildStepList(duration: number): StepKind[] {
  const steps: StepKind[] = [{ kind: 'dates' }]
  for (let day = 1; day <= duration; day++) {
    steps.push({ kind: 'day-plan', day })
  }
  steps.push({ kind: 'review' })
  steps.push({ kind: 'verify' })
  steps.push({ kind: 'hotel-comparison' })
  return steps
}

function stepLabel(step: StepKind): string {
  switch (step.kind) {
    case 'dates':            return 'Stay Dates'
    case 'day-plan':         return `Day ${step.day} Menu & Decor`
    case 'review':           return 'Review Selections'
    case 'verify':           return 'Mobile Verification'
    case 'hotel-comparison': return 'Hotel Comparison'
  }
}

interface WizardState {
  stepIndex: number
  steps: StepKind[]
  data: Partial<BookingFormData>
}

type WizardAction =
  | { type: 'SET_DATES'; checkIn: string; checkOut: string }
  | { type: 'SET_DAY_PLAN'; day: number; plan: Partial<DayPlan> }
  | { type: 'SET_DECORATION'; tier: DecorationPackageTier; title: string }
  | { type: 'SET_PHONE'; phone: string }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'RESTORE'; state: WizardState }

function updateDayPlan(
  plans: DayPlan[],
  day: number,
  updater: (plan: DayPlan) => DayPlan
): DayPlan[] {
  return plans.map((p) => (p.day === day ? updater(p) : p))
}

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_DATES': {
      const duration = calculateDuration(action.checkIn, action.checkOut)
      const steps = buildStepList(duration)
      const dayPlans = generateDefaultDayPlans(duration)
      return {
        ...state,
        steps,
        stepIndex: 1,
        data: {
          ...state.data,
          check_in: action.checkIn,
          check_out: action.checkOut,
          day_plans: dayPlans,
        },
      }
    }

    case 'SET_DAY_PLAN':
      return {
        ...state,
        data: {
          ...state.data,
          day_plans: updateDayPlan(state.data.day_plans!, action.day, (oldPlan) => {
            const nextPlan = {
              ...oldPlan,
              ...action.plan,
            }
            if (action.plan.lunch) {
              nextPlan.lunch = {
                ...oldPlan.lunch,
                ...action.plan.lunch,
              }
            }
            if (action.plan.dinner) {
              nextPlan.dinner = {
                ...oldPlan.dinner,
                ...action.plan.dinner,
              }
            }
            return nextPlan
          }),
        },
      }

    case 'SET_DECORATION':
      return {
        ...state,
        data: {
          ...state.data,
          decoration_package: action.tier,
          decoration_theme_title: action.title,
        },
      }

    case 'SET_PHONE':
      return {
        ...state,
        data: {
          ...state.data,
          phone: action.phone,
        },
      }


    case 'NEXT':
      return {
        ...state,
        stepIndex: Math.min(state.stepIndex + 1, state.steps.length - 1),
      }

    case 'PREV':
      return {
        ...state,
        stepIndex: Math.max(0, state.stepIndex - 1),
      }

    case 'RESTORE':
      return action.state

    default:
      return state
  }
}

const STORAGE_KEY = 'mannat-booking-v6'

function loadSavedState(): Partial<WizardState> | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Partial<WizardState>
  } catch {
    return null
  }
}

const DEFAULT_WIZARD_STATE: WizardState = {
  stepIndex: 0,
  steps: [{ kind: 'dates' }] as StepKind[],
  data: {},
}

// ── Mobile OTP Gate Component with Mock OTP 0000 ──
function StepMobileVerification({ onVerified, onPrev }: { onVerified: (phone: string) => void; onPrev: () => void }) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(0)

  function formatPhone(raw: string) {
    const digits = raw.replace(/\D/g, '')
    if (digits.startsWith('91') && digits.length > 10) return `+${digits}`
    return `+91${digits}`
  }

  function startCooldown() {
    setResendCooldown(30)
    const timer = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) { clearInterval(timer); return 0 }
        return c - 1
      })
    }, 1000)
  }

  async function sendOTP(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number.')
      return
    }
    // Demo mode — no real SMS sent
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setStep('otp')
      startCooldown()
    }, 400)
  }

  function verifyOTP(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const cleanOtp = otp.trim()
    if (cleanOtp.length < 4) {
      setError('Please enter the OTP.')
      return
    }
    // Demo mode — only accept 0000
    if (cleanOtp === '0000') {
      const formatted = formatPhone(phone)
      if (typeof window !== 'undefined') {
        document.cookie = `mannat-session=${encodeURIComponent(formatted)}; path=/; max-age=86400; SameSite=Lax`
      }
      onVerified(formatted)
      return
    }
    setError('Invalid OTP code. For testing, please enter 0000.')
  }

  function resendOTP() {
    if (resendCooldown > 0) return
    setError(null)
    // Demo mode — just restart the cooldown, no network request
    startCooldown()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="pb-28 md:pb-0"
    >
      <div className="mb-6">
        <span className="px-3 py-1 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] text-xs font-bold tracking-widest text-[#A08040] uppercase">
          Step 5: Mobile Verification
        </span>
      </div>

      <h2 className="text-headline mb-1">Verify Mobile Number to See Prices</h2>
      <p className="text-body text-[#737373] mb-8">
        Enter your 10-digit mobile number. We will send a one-time passcode to reveal pricing &amp; hotel comparison.
      </p>

      <div className="max-w-md rounded-2xl border border-[#E8E2D8] bg-white p-6 shadow-sm space-y-4">
        {/* Mock OTP Testing Hint Banner */}
        <div className="rounded-xl bg-[#FDFAF3] border border-[#E8D9A8] px-4 py-3 flex items-start gap-2.5 text-xs text-[#907030]">
          <Info size={16} className="text-[#C5A85C] shrink-0 mt-0.5" />
          <span>
            <strong>Testing Note:</strong> SMS gateway is in demo mode. Use mock OTP <strong>0000</strong> to verify instantly.
          </span>
        </div>

        <AnimatePresence mode="wait">
          {step === 'phone' ? (
            <motion.form
              key="phone-step"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              onSubmit={sendOTP}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="phone" required>
                  Mobile Number
                </Label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-sm font-semibold text-[#C5A85C] pointer-events-none select-none">
                    +91
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    disabled={isLoading}
                    className="w-full pl-12 pr-10 py-3 rounded-xl border border-[#E8E2D8] text-sm font-semibold text-[#1A1A1A] placeholder:text-[#C0B9B0] focus:outline-none focus:border-[#C5A85C] transition-colors"
                  />
                  <Phone size={15} className="absolute right-3 text-[#C0B9B0]" />
                </div>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-semibold text-red-600 flex items-center gap-1.5">
                  <AlertCircle size={13} className="shrink-0" />
                  {error}
                </motion.p>
              )}

              <Button type="submit" loading={isLoading} variant="gold" size="lg" className="w-full">
                Send OTP <ArrowRight size={14} />
              </Button>
            </motion.form>
          ) : (
            <motion.form
              key="otp-step"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              onSubmit={verifyOTP}
              className="space-y-4"
            >
              <div className="rounded-xl bg-[#F5EDD6] border border-[#E8D9A8] px-4 py-3 flex items-start gap-2.5 text-sm text-[#A08040]">
                <ShieldCheck size={16} className="text-[#C5A85C] mt-0.5 shrink-0" />
                <span>
                  Passcode requested for <strong className="text-[#1A1A1A]">+91 {phone}</strong>.{' '}
                  <button type="button" onClick={() => { setStep('phone'); setOtp(''); setError(null) }} className="underline underline-offset-2 hover:text-[#C5A85C]">
                    Change?
                  </button>
                </span>
              </div>

              <div>
                <Label htmlFor="otp" required>
                  Enter Passcode (e.g. 0000)
                </Label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="0 0 0 0"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E2D8] text-center text-2xl font-bold text-[#1A1A1A] tracking-[0.4em] focus:outline-none focus:border-[#C5A85C]"
                />
              </div>

              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-semibold text-red-600 flex items-center gap-1.5">
                  <AlertCircle size={13} className="shrink-0" />
                  {error}
                </motion.p>
              )}

              <Button type="submit" loading={isLoading} variant="gold" size="lg" className="w-full">
                Verify &amp; Compare Hotel Prices
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={resendOTP}
                  disabled={resendCooldown > 0 || isLoading}
                  className="text-xs font-semibold text-[#C5A85C] hover:underline disabled:opacity-40"
                >
                  <RefreshCcw size={11} className="inline mr-1" />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <div className="hidden md:flex justify-start mt-10 pt-6 border-t border-[#E8E2D8]">
        <Button variant="secondary" size="lg" onClick={onPrev}>Previous</Button>
      </div>
    </motion.div>
  )
}

export function BookingWizard() {
  const router = useRouter()

  const [isSubmitting, setSubmitting] = useReducer((_: boolean, v: boolean) => v, false)
  const [submitError, setSubmitError] = useReducer((_: string, v: string) => v, '')

  const [state, dispatch] = useReducer(wizardReducer, DEFAULT_WIZARD_STATE)

  useEffect(() => {
    const saved = loadSavedState()
    if (saved?.data && saved.steps && typeof saved.stepIndex === 'number') {
      dispatch({ type: 'RESTORE', state: saved as WizardState })
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch { /* ignore */ }
  }, [state])

  const handleSubmitEnquiry = useCallback(async () => {
    setSubmitting(true)
    setSubmitError('')
    try {
      // Always book with Mannat Events — comparison hotels are reference-only
      const payload = {
        ...state.data,
        selected_hotel: { id: 'mannat-events', name: 'Mannat Events' },
      }
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        setSubmitError(err.error ?? 'Submission failed. Please try again.')
        return
      }

      const { booking_id } = await res.json()
      localStorage.removeItem(STORAGE_KEY)
      router.push(`/booking/confirmation?id=${booking_id}`)
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }, [state.data, router])

  const { stepIndex, steps, data } = state
  const currentStep = steps[stepIndex]

  function next() { dispatch({ type: 'NEXT' }) }
  function prev() { dispatch({ type: 'PREV' }) }

  function getDayPlan(day: number) {
    return data.day_plans?.find((p) => p.day === day)
  }

  function renderStep(step: StepKind) {
    switch (step.kind) {
      case 'dates':
        return (
          <StepDates
            data={data}
            onNext={(vals) => {
              dispatch({ type: 'SET_DATES', checkIn: vals.check_in, checkOut: vals.check_out })
            }}
          />
        )

      case 'day-plan': {
        const plan = data.day_plans?.find(p => p.day === step.day)!
        const duration = calculateDuration(data.check_in ?? '', data.check_out ?? '')
        return (
          <StepDayPlan
            day={step.day}
            totalDays={duration}
            plan={plan}
            data={data}
            onNext={(newPlan, decorTier, decorTitle) => {
              dispatch({ type: 'SET_DAY_PLAN', day: step.day, plan: newPlan })
              if (decorTier && decorTitle) {
                dispatch({ type: 'SET_DECORATION', tier: decorTier, title: decorTitle })
              }
              next()
            }}
            onPrev={prev}
          />
        )
      }

      case 'review':
        return (
          <StepReview
            data={data as BookingFormData}
            onNext={next}
            onPrev={prev}
          />
        )

      case 'verify':
        return (
          <StepMobileVerification
            onVerified={(phone) => {
              dispatch({ type: 'SET_PHONE', phone })
              next()
            }}
            onPrev={prev}
          />
        )

      case 'hotel-comparison':
        return (
          <>
            {submitError && (
              <div className="mb-6 px-5 py-4 rounded-2xl bg-red-50 border border-[#E8E2D8] text-sm text-red-700 font-medium">
                {submitError}
              </div>
            )}
            <StepHotelComparison
              data={data}
              onSubmit={handleSubmitEnquiry}
              onPrev={prev}
              isSubmitting={isSubmitting}
            />
          </>
        )
    }
  }

  return (
    <div
      className="wizard-light min-h-screen relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 10% 20%, #FAF8F5 0%, #F5EDD6 100%)',
      }}
    >
      <DynamicProgressBar
        currentIndex={stepIndex}
        totalSteps={steps.length}
        currentLabel={stepLabel(currentStep)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative z-10">
        <div className="flex gap-10 items-start">
          <main className="flex-1 min-w-0">
            <div className="max-w-3xl">
              <AnimatePresence mode="wait">
                <div key={`${currentStep.kind}-${'day' in currentStep ? currentStep.day : ''}`}>
                  {renderStep(currentStep)}
                </div>
              </AnimatePresence>
            </div>
          </main>

          <aside className="hidden xl:block w-80 shrink-0 sticky top-28">
            <LiveBookingSummary data={data} />
          </aside>
        </div>
      </div>
    </div>
  )
}