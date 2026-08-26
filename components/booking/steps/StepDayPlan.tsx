'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bed, Users, UtensilsCrossed, Calendar, Leaf, Flame, CheckCircle2, Sparkles } from 'lucide-react'
import { DayPlan, FoodPreference } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { StepMenuPackage } from './StepMenuPackage'
import { MenuConfig } from '@/lib/menu'

interface Props {
  day: number
  totalDays: number
  plan: DayPlan
  vegMenuItems: any[]
  nonVegMenuItems: any[]
  onNext: (plan: DayPlan) => void
  onPrev: () => void
}

const LUNCH_FUNCTIONS = [
  'Welcome Lunch',
  'Mehendi',
  'Haldi',
  'Cocktail',
  'Jaimala / Wedding Ceremony',
  'Phere',
  'Reception',
  'Other',
]

const DINNER_FUNCTIONS = [
  'Welcome Dinner',
  'Mehendi',
  'Haldi',
  'Cocktail',
  'Jaimala / Wedding Ceremony',
  'Phere',
  'Reception',
  'Other',
]

export function StepDayPlan({
  day, totalDays, plan, onNext, onPrev,
}: Props) {
  // Empty initial states — user must fill everything
  const [rooms, setRooms] = useState<string>(plan.rooms > 0 ? String(plan.rooms) : '')
  const [lunchGuestCount, setLunchGuestCount] = useState<string>(plan.lunch.guest_count > 0 ? String(plan.lunch.guest_count) : '')
  const [dinnerGuestCount, setDinnerGuestCount] = useState<string>(plan.dinner.guest_count > 0 ? String(plan.dinner.guest_count) : '')

  // null = not yet selected
  const [lunchFoodPref, setLunchFoodPref] = useState<FoodPreference | null>(plan.lunch.type ?? null)
  const [dinnerFoodPref, setDinnerFoodPref] = useState<FoodPreference | null>(plan.dinner.type ?? null)

  const [lunchFunction, setLunchFunction] = useState<string>(plan.lunch_function ?? LUNCH_FUNCTIONS[0])
  const [dinnerFunction, setDinnerFunction] = useState<string>(plan.dinner_function ?? DINNER_FUNCTIONS[0])

  const [lunchMenuConfig, setLunchMenuConfig] = useState<MenuConfig | undefined>(plan.lunch.menu_config)
  const [dinnerMenuConfig, setDinkerMenuConfig] = useState<MenuConfig | undefined>(plan.dinner.menu_config)

  const [activeConfigMeal, setActiveConfigMeal] = useState<'lunch' | 'dinner' | null>(null)
  const [validationError, setValidationError] = useState('')

  function handleSubmit() {
    const roomsNum = parseInt(rooms, 10)
    const lunchGuests = parseInt(lunchGuestCount, 10)
    const dinnerGuests = parseInt(dinnerGuestCount, 10)

    if (!rooms || isNaN(roomsNum) || roomsNum < 1) {
      setValidationError('Please enter the number of rooms required.')
      return
    }
    if (!lunchGuestCount || isNaN(lunchGuests) || lunchGuests < 1) {
      setValidationError('Please enter the Lunch guest count.')
      return
    }
    if (!lunchFoodPref) {
      setValidationError('Please select the Lunch food preference.')
      return
    }
    if (!lunchMenuConfig) {
      setValidationError('Please configure the Lunch menu.')
      return
    }
    if (!dinnerGuestCount || isNaN(dinnerGuests) || dinnerGuests < 1) {
      setValidationError('Please enter the Dinner guest count.')
      return
    }
    if (!dinnerFoodPref) {
      setValidationError('Please select the Dinner food preference.')
      return
    }
    if (!dinnerMenuConfig) {
      setValidationError('Please configure the Dinner menu.')
      return
    }

    setValidationError('')
    onNext({
      ...plan,
      day,
      rooms: roomsNum,
      guest_count: Math.max(lunchGuests, dinnerGuests),
      food_preference: lunchFoodPref,
      lunch_function: lunchFunction,
      dinner_function: dinnerFunction,
      lunch: {
        type: lunchFoodPref,
        guest_count: lunchGuests,
        menu_item_ids: [],
        menu_item_names: [lunchMenuConfig.packageName],
        menu_config: lunchMenuConfig,
      },
      dinner: {
        type: dinnerFoodPref,
        guest_count: dinnerGuests,
        menu_item_ids: [],
        menu_item_names: [dinnerMenuConfig.packageName],
        menu_config: dinnerMenuConfig,
      },
    })
  }

  const foodPrefOptions: { value: FoodPreference; label: string; icon: React.ReactNode }[] = [
    { value: 'veg',     label: 'Vegetarian',     icon: <Leaf size={13} className="text-green-600" /> },
    { value: 'non-veg', label: 'Non-Vegetarian', icon: <Flame size={13} className="text-red-500" /> },
  ]

  const renderMenuSummary = (config: MenuConfig | undefined) => {
    if (!config) {
      return (
        <p className="text-[11px] text-red-500 font-medium flex items-center gap-1">
          ⚠️ Menu not configured yet. Click button above to configure.
        </p>
      )
    }
    return (
      <div className="rounded-xl border border-green-200 bg-green-50/40 p-3.5 text-xs text-green-800">
        <div className="flex items-center gap-1.5 font-bold text-green-900">
          <CheckCircle2 size={14} className="text-green-600 shrink-0" />
          <span>Configured: {config.packageName}</span>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="pb-28 md:pb-0"
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] text-xs font-bold tracking-widest text-[#A08040] uppercase">
          Day {day} of {totalDays}
        </span>
        <span className="text-xs text-[#A8A8A8]">🌅 Breakfast included</span>
      </div>

      <h2 className="text-headline mb-1">Day {day} Planning</h2>
      <p className="text-body text-[#737373] mb-8">
        Specify stay requirements, plus event functions and menu packages for Lunch and Dinner.
      </p>

      <div className="space-y-6">

        {/* ── Room Requirement ── */}
        <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#737373] flex items-center gap-2">
            <Bed size={15} className="text-[#C5A85C]" />
            Number of Rooms Required
          </label>
          <input
            type="number"
            min={1}
            max={999}
            value={rooms}
            onChange={e => setRooms(e.target.value)}
            className="w-full max-w-xs border border-[#E8E2D8] rounded-xl px-4 py-3 text-base font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs"
            placeholder="Enter number of rooms"
          />
        </div>

        {/* ── LUNCH CONFIGURATION ── */}
        <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-5">
          <div className="flex items-center gap-2 border-b border-[#F0EDE9] pb-3">
            <Leaf size={16} className="text-green-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">Lunch Configuration</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lunch Guest Count */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5 mb-2">
                <Users size={13} className="text-[#C5A85C]" /> Lunch Guest Count
              </label>
              <input
                type="number"
                min={1}
                max={9999}
                value={lunchGuestCount}
                onChange={e => setLunchGuestCount(e.target.value)}
                className="w-full border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs"
                placeholder="Enter guest count"
              />
            </div>

            {/* Lunch Food Preference */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5 mb-2">
                <UtensilsCrossed size={13} className="text-[#C5A85C]" /> Lunch Food Preference
              </label>
              <div className="flex gap-1.5">
                {foodPrefOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      // Clear menu config if switching preference
                      if (lunchFoodPref !== opt.value) setLunchMenuConfig(undefined)
                      setLunchFoodPref(opt.value)
                    }}
                    className={cn(
                      'flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 flex-1 justify-center select-none',
                      lunchFoodPref === opt.value
                        ? 'bg-[#C5A85C] border-[#C5A85C] text-white shadow-sm'
                        : 'bg-white border-[#E8E2D8] text-[#737373] hover:border-[#C5A85C]'
                    )}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Lunch Function */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5 mb-2">
                <Calendar size={13} className="text-[#C5A85C]" /> Lunch Function
              </label>
              <select
                value={lunchFunction}
                onChange={e => setLunchFunction(e.target.value)}
                className="w-full border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs cursor-pointer"
              >
                {LUNCH_FUNCTIONS.map(fn => <option key={fn} value={fn}>{fn}</option>)}
              </select>
            </div>

            {/* Lunch Menu Button */}
            <div className="flex flex-col justify-end">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] block mb-2">
                Lunch Catering Menu
              </label>
              <Button
                type="button"
                variant="gold"
                size="md"
                disabled={!lunchFoodPref}
                onClick={() => setActiveConfigMeal('lunch')}
                className="w-full flex items-center justify-center gap-1.5 text-xs"
              >
                <Sparkles size={13} /> {lunchMenuConfig ? 'Modify Lunch Menu' : 'Configure Lunch Menu'}
              </Button>
            </div>
          </div>

          {lunchFoodPref && (
            <div className="pt-2">{renderMenuSummary(lunchMenuConfig)}</div>
          )}
        </div>

        {/* ── DINNER CONFIGURATION ── */}
        <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-5">
          <div className="flex items-center gap-2 border-b border-[#F0EDE9] pb-3">
            <Flame size={16} className="text-red-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">Dinner Configuration</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dinner Guest Count */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5 mb-2">
                <Users size={13} className="text-[#C5A85C]" /> Dinner Guest Count
              </label>
              <input
                type="number"
                min={1}
                max={9999}
                value={dinnerGuestCount}
                onChange={e => setDinnerGuestCount(e.target.value)}
                className="w-full border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs"
                placeholder="Enter guest count"
              />
            </div>

            {/* Dinner Food Preference */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5 mb-2">
                <UtensilsCrossed size={13} className="text-[#C5A85C]" /> Dinner Food Preference
              </label>
              <div className="flex gap-1.5">
                {foodPrefOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      if (dinnerFoodPref !== opt.value) setDinkerMenuConfig(undefined)
                      setDinnerFoodPref(opt.value)
                    }}
                    className={cn(
                      'flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 flex-1 justify-center select-none',
                      dinnerFoodPref === opt.value
                        ? 'bg-[#C5A85C] border-[#C5A85C] text-white shadow-sm'
                        : 'bg-white border-[#E8E2D8] text-[#737373] hover:border-[#C5A85C]'
                    )}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dinner Function */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5 mb-2">
                <Calendar size={13} className="text-[#C5A85C]" /> Dinner Function
              </label>
              <select
                value={dinnerFunction}
                onChange={e => setDinnerFunction(e.target.value)}
                className="w-full border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs cursor-pointer"
              >
                {DINNER_FUNCTIONS.map(fn => <option key={fn} value={fn}>{fn}</option>)}
              </select>
            </div>

            {/* Dinner Menu Button */}
            <div className="flex flex-col justify-end">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] block mb-2">
                Dinner Catering Menu
              </label>
              <Button
                type="button"
                variant="gold"
                size="md"
                disabled={!dinnerFoodPref}
                onClick={() => setActiveConfigMeal('dinner')}
                className="w-full flex items-center justify-center gap-1.5 text-xs"
              >
                <Sparkles size={13} /> {dinnerMenuConfig ? 'Modify Dinner Menu' : 'Configure Dinner Menu'}
              </Button>
            </div>
          </div>

          {dinnerFoodPref && (
            <div className="pt-2">{renderMenuSummary(dinnerMenuConfig)}</div>
          )}
        </div>

      </div>

      {/* Validation error */}
      {validationError && (
        <p className="mt-6 text-sm font-semibold text-red-600 flex items-center gap-1.5">
          ⚠️ {validationError}
        </p>
      )}

      {/* Desktop Nav */}
      <div className="hidden md:flex justify-between mt-8 pt-6 border-t border-[#E8E2D8]">
        <Button variant="secondary" size="lg" onClick={onPrev}>Previous</Button>
        <Button size="lg" onClick={handleSubmit}>
          {day < totalDays ? `Next: Day ${day + 1}` : 'Next Step: Decoration'}
        </Button>
      </div>

      {/* Mobile Nav */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-4 py-3">
        {validationError && (
          <p className="text-xs font-semibold text-red-600 text-center pb-2">⚠️ {validationError}</p>
        )}
        <div className="max-w-lg mx-auto flex gap-3">
          <Button variant="secondary" size="lg" onClick={onPrev} className="flex-1">Previous</Button>
          <Button size="lg" onClick={handleSubmit} className="flex-1">
            {day < totalDays ? `Day ${day + 1} →` : 'Decoration →'}
          </Button>
        </div>
      </div>

      {/* Menu Modal */}
      {activeConfigMeal && (
        <StepMenuPackage
          meal={activeConfigMeal}
          mealType={activeConfigMeal === 'lunch' ? lunchFoodPref! : dinnerFoodPref!}
          guestCount={activeConfigMeal === 'lunch' ? (parseInt(lunchGuestCount) || 1) : (parseInt(dinnerGuestCount) || 1)}
          initialConfig={activeConfigMeal === 'lunch' ? lunchMenuConfig : dinnerMenuConfig}
          onSave={(config) => {
            if (activeConfigMeal === 'lunch') {
              setLunchMenuConfig(config)
            } else {
              setDinkerMenuConfig(config)
            }
            setActiveConfigMeal(null)
          }}
          onClose={() => setActiveConfigMeal(null)}
        />
      )}
    </motion.div>
  )
}
