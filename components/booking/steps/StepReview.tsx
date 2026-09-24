'use client'

import { motion } from 'framer-motion'
import { Calendar, Bed, Users, UtensilsCrossed, Leaf, Flame, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'
import { BookingFormData } from '@/lib/types'
import { formatDate, calculateDuration } from '@/lib/utils/booking'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface StepReviewProps {
  data: BookingFormData
  onNext: () => void
  onPrev: () => void
}

function ReviewRow({ label, value }: { label: string; value: string | number }) {
  if (value === undefined || value === null || value === '') return null
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-[#F0EDE9] last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-[#737373]">
        {label}
      </span>
      <span className="text-xs font-bold text-[#1A1A1A] text-right">
        {value}
      </span>
    </div>
  )
}

export function StepReview({ data, onNext, onPrev }: StepReviewProps) {
  const duration = data.check_in && data.check_out ? calculateDuration(data.check_in, data.check_out) : 1
  const dayPlans = data.day_plans ?? []

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="pb-28 md:pb-0 space-y-6"
    >
      {/* Header */}
      <div>
        <div className="mb-2">
          <span className="px-3 py-1 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] text-xs font-bold tracking-widest text-[#A08040] uppercase">
            Review &amp; Confirm
          </span>
        </div>
        <h2 className="text-headline mb-1">Review Your Selections</h2>
        <p className="text-body text-[#737373]">
          Please review your selections before continuing to mobile verification.
        </p>
      </div>

      {/* ── 1. STAY DETAILS ── */}
      <Card className="p-5 space-y-3 border-[#E8E2D8] bg-white shadow-xs">
        <div className="flex items-center gap-2 border-b border-[#EEEAE4] pb-2.5">
          <Calendar size={16} className="text-[#C5A85C]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">Stay &amp; Accommodation</h4>
        </div>
        <div>
          <ReviewRow label="Check-in Date" value={data.check_in ? formatDate(data.check_in) : 'Not specified'} />
          <ReviewRow label="Check-out Date" value={data.check_out ? formatDate(data.check_out) : 'Not specified'} />
          <ReviewRow label="Stay Duration" value={`${duration} ${duration === 1 ? 'Night' : 'Nights'}`} />
        </div>
      </Card>

      {/* ── 2. DAY-BY-DAY CATERING & EVENT SUMMARY ── */}
      {dayPlans.map((plan) => {
        const lunchConf = plan.lunch?.menu_config
        const dinnerConf = plan.dinner?.menu_config

        return (
          <Card key={plan.day} className="p-6 space-y-5 border-[#E8E2D8] bg-white shadow-xs">
            <div className="flex items-center justify-between border-b border-[#EEEAE4] pb-3">
              <h4 className="text-sm font-serif font-bold text-[#1A1A1A]">Day {plan.day} Event &amp; Catering Setup</h4>
              <span className="text-xs font-bold text-[#C5A85C] flex items-center gap-1">
                <Bed size={14} /> {plan.rooms} Rooms Required
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Lunch Summary */}
              <div className="rounded-2xl border border-green-100 bg-green-50/30 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-green-200/60 pb-2">
                  <span className="text-xs font-bold text-green-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Leaf size={14} className="text-green-600" /> Lunch Catering
                  </span>
                  <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full capitalize">
                    {plan.lunch?.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                  </span>
                </div>

                <div className="text-xs space-y-1.5 text-[#555]">
                  <p className="flex justify-between">
                    <span className="text-[#737373]">Function:</span>
                    <span className="font-semibold text-[#1A1A1A]">{plan.lunch_function || 'Welcome Lunch'}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-[#737373]">Guests:</span>
                    <span className="font-semibold text-[#1A1A1A]">{plan.lunch?.guest_count ?? 0} Guests</span>
                  </p>
                  {lunchConf && (
                    <p className="flex justify-between">
                      <span className="text-[#737373]">Package:</span>
                      <span className="font-bold text-[#C5A85C]">{lunchConf.packageName}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Dinner Summary */}
              <div className="rounded-2xl border border-red-100 bg-red-50/30 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-red-200/60 pb-2">
                  <span className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Flame size={14} className="text-red-500" /> Dinner Catering
                  </span>
                  <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full capitalize">
                    {plan.dinner?.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                  </span>
                </div>

                <div className="text-xs space-y-1.5 text-[#555]">
                  <p className="flex justify-between">
                    <span className="text-[#737373]">Function:</span>
                    <span className="font-semibold text-[#1A1A1A]">{plan.dinner_function || 'Welcome Dinner'}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-[#737373]">Guests:</span>
                    <span className="font-semibold text-[#1A1A1A]">{plan.dinner?.guest_count ?? 0} Guests</span>
                  </p>
                  {dinnerConf && (
                    <p className="flex justify-between">
                      <span className="text-[#737373]">Package:</span>
                      <span className="font-bold text-[#C5A85C]">{dinnerConf.packageName}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )
      })}

      {/* ── 3. BASE DECORATION SUMMARY ── */}
      <Card className="p-5 border-[#E8D9A8] bg-[#FDFAF3] shadow-xs">
        <div className="flex items-center gap-2 border-b border-[#E8D9A8] pb-2.5 mb-3">
          <Sparkles size={16} className="text-[#C5A85C]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#A08040]">Decoration Setup</h4>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-serif font-bold text-[#1A1A1A]">
              {data.decoration_theme_title || 'Base Decoration Package'}
            </p>
            <p className="text-xs text-[#737373] mt-0.5">
              Standard base decoration tier selected for venue setup.
            </p>
          </div>
          <span className="w-6 h-6 rounded-full bg-[#C5A85C] text-white flex items-center justify-center text-xs font-bold">
            ✓
          </span>
        </div>
      </Card>

      {/* Verification Notice */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 flex items-start gap-3 text-xs text-blue-900">
        <CheckCircle2 size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-semibold mb-0.5">Ready for Verification</strong>
          Your selections are confirmed. Click <strong>OKAY, CONTINUE</strong> below to verify your phone number and view hotel comparison details.
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-between pt-6 border-t border-[#E8E2D8]">
        <Button variant="secondary" size="lg" onClick={onPrev}>
          Previous Step
        </Button>
        <Button size="lg" variant="gold" onClick={onNext} className="flex items-center gap-2">
          OKAY, CONTINUE <ArrowRight size={16} />
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button variant="secondary" size="lg" onClick={onPrev} className="flex-1">
            Previous
          </Button>
          <Button size="lg" variant="gold" onClick={onNext} className="flex-1 flex items-center justify-center gap-1">
            OKAY, CONTINUE →
          </Button>
        </div>
      </div>
    </motion.div>
  )
}