'use client'

import { useState } from 'react'
import { Bed, Users, UtensilsCrossed, Calendar, Leaf, Flame, CheckCircle2, Sparkles } from 'lucide-react'
import { DayPlan, FoodPreference } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { StepMenuPackage } from './StepMenuPackage'
import { MenuConfig } from '@/lib/menu'

interface DayCardProps {
  day: number
  totalDays: number
  plan: DayPlan
  onChange: (plan: DayPlan) => void
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

/** A single-day planning card. Calls onChange whenever any field changes. */
function DayPlanCard({ day, totalDays, plan, onChange }: DayCardProps) {
  const [rooms, setRooms] = useState<number>(plan.rooms ?? 1)
  const [lunchGuestCount, setLunchGuestCount] = useState<number>(plan.lunch.guest_count ?? 50)
  const [dinnerGuestCount, setDinnerGuestCount] = useState<number>(plan.dinner.guest_count ?? 50)
  const [lunchFoodPref, setLunchFoodPref] = useState<FoodPreference | null>(plan.lunch.type ?? null)
  const [dinnerFoodPref, setDinnerFoodPref] = useState<FoodPreference | null>(plan.dinner.type ?? null)
  const [lunchFunction, setLunchFunction] = useState<string>(plan.lunch_function ?? LUNCH_FUNCTIONS[0])
  const [dinnerFunction, setDinnerFunction] = useState<string>(plan.dinner_function ?? DINNER_FUNCTIONS[0])
  const [lunchMenuConfig, setLunchMenuConfig] = useState<MenuConfig | undefined>(plan.lunch.menu_config)
  const [dinnerMenuConfig, setDinnerMenuConfig] = useState<MenuConfig | undefined>(plan.dinner.menu_config)
  const [activeConfigMeal, setActiveConfigMeal] = useState<'lunch' | 'dinner' | null>(null)

  /** Emit current state upward whenever anything changes */
  function emit(overrides: Partial<{
    rooms: number
    lunchGuestCount: number
    dinnerGuestCount: number
    lunchFoodPref: FoodPreference | null
    dinnerFoodPref: FoodPreference | null
    lunchFunction: string
    dinnerFunction: string
    lunchMenuConfig: MenuConfig | undefined
    dinnerMenuConfig: MenuConfig | undefined
  }> = {}) {
    const r = overrides.rooms ?? rooms
    const lgc = overrides.lunchGuestCount ?? lunchGuestCount
    const dgc = overrides.dinnerGuestCount ?? dinnerGuestCount
    const lfp = overrides.lunchFoodPref !== undefined ? overrides.lunchFoodPref : lunchFoodPref
    const dfp = overrides.dinnerFoodPref !== undefined ? overrides.dinnerFoodPref : dinnerFoodPref
    const lf = overrides.lunchFunction ?? lunchFunction
    const df = overrides.dinnerFunction ?? dinnerFunction
    const lmc = overrides.lunchMenuConfig !== undefined ? overrides.lunchMenuConfig : lunchMenuConfig
    const dmc = overrides.dinnerMenuConfig !== undefined ? overrides.dinnerMenuConfig : dinnerMenuConfig

    onChange({
      ...plan,
      day,
      rooms: r,
      guest_count: Math.max(lgc, dgc),
      food_preference: lfp ?? plan.food_preference,
      lunch_function: lf,
      dinner_function: df,
      lunch: {
        type: lfp ?? plan.lunch.type,
        guest_count: lgc,
        menu_item_ids: [],
        menu_item_names: lmc ? [lmc.packageName] : plan.lunch.menu_item_names,
        menu_config: lmc,
      },
      dinner: {
        type: dfp ?? plan.dinner.type,
        guest_count: dgc,
        menu_item_ids: [],
        menu_item_names: dmc ? [dmc.packageName] : plan.dinner.menu_item_names,
        menu_config: dmc,
      },
    })
  }

  const foodPrefOptions: { value: FoodPreference; label: string; icon: React.ReactNode }[] = [
    { value: 'veg',     label: 'Vegetarian',     icon: <Leaf size={13} className="text-green-600" /> },
    { value: 'non-veg', label: 'Non-Vegetarian', icon: <Flame size={13} className="text-red-500" /> },
  ]

  const renderMenuConfigSummary = (config: MenuConfig | undefined) => {
    if (!config) {
      return (
        <p className="text-[11px] text-red-500 font-medium flex items-center gap-1">
          ⚠️ Menu not configured yet. Click button above to customize.
        </p>
      )
    }
    const totalDishes = config.selections.reduce((acc, curr) => acc + curr.items.length, 0)
    return (
      <div className="rounded-xl border border-green-200 bg-green-50/40 p-3.5 space-y-1.5 text-xs text-green-800">
        <div className="flex items-center gap-1.5 font-bold text-green-900">
          <CheckCircle2 size={14} className="text-green-600 shrink-0" />
          <span>Configured: {config.packageName}</span>
        </div>
        <div className="text-[11px] leading-relaxed text-green-700/90 pl-5">
          <span className="font-semibold">{totalDishes} Dishes Selected:</span>{' '}
          {config.selections.map(sel => {
            if (sel.items.length === 0) return null
            const label = sel.categoryId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
            return `${label} (${sel.items.length})`
          }).filter(Boolean).join(', ')}
          {config.liveStations.length > 0 && (
            <span className="block mt-0.5"><span className="font-semibold">Live Stations:</span> {config.liveStations.join(', ')}</span>
          )}
          {config.addOns.length > 0 && (
            <span className="block mt-0.5"><span className="font-semibold">Add-ons:</span> {config.addOns.join(', ')}</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border-2 border-[#E8D9A8] bg-[#FDFCF8] p-6 space-y-6 shadow-sm">
      {/* Day Header */}
      <div className="flex items-center gap-3 border-b border-[#F0EDE9] pb-4">
        <div className="w-10 h-10 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] flex items-center justify-center text-sm font-bold text-[#A08040]">
          {day}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] text-[10px] font-bold tracking-widest text-[#A08040] uppercase">
              Day {day} of {totalDays}
            </span>
            <span className="text-xs text-[#A8A8A8]">🌅 Breakfast included</span>
          </div>
          <h3 className="text-base font-serif font-semibold text-[#1A1A1A] mt-0.5">Day {day} Planning</h3>
        </div>
      </div>

      {/* Room Requirement */}
      <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#737373] flex items-center gap-2">
          <Bed size={15} className="text-[#C5A85C]" />
          Rooms Required
        </label>
        <input
          type="number"
          min={1}
          max={999}
          value={rooms}
          onChange={e => {
            const v = Math.max(1, Number(e.target.value) || 1)
            setRooms(v)
            emit({ rooms: v })
          }}
          className="w-full max-w-xs border border-[#E8E2D8] rounded-xl px-4 py-3 text-base font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs"
          placeholder="e.g. 25"
        />
      </div>

      {/* Lunch Configuration */}
      <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-5">
        <div className="flex items-center gap-2 border-b border-[#F0EDE9] pb-3">
          <Leaf size={16} className="text-green-600" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">Lunch Configuration</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5 mb-2">
              <Users size={13} className="text-[#C5A85C]" /> Lunch Guest Count
            </label>
            <input
              type="number"
              min={1}
              max={9999}
              value={lunchGuestCount}
              onChange={e => {
                const v = Math.max(1, Number(e.target.value) || 1)
                setLunchGuestCount(v)
                emit({ lunchGuestCount: v })
              }}
              className="w-full border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs"
              placeholder="e.g. 150"
            />
          </div>

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
                    setLunchFoodPref(opt.value)
                    const cleared = lunchFoodPref !== opt.value ? undefined : lunchMenuConfig
                    if (lunchFoodPref !== opt.value) setLunchMenuConfig(undefined)
                    emit({ lunchFoodPref: opt.value, lunchMenuConfig: cleared })
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

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5 mb-2">
              <Calendar size={13} className="text-[#C5A85C]" /> Lunch Function
            </label>
            <select
              value={lunchFunction}
              onChange={e => {
                setLunchFunction(e.target.value)
                emit({ lunchFunction: e.target.value })
              }}
              className="w-full border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs cursor-pointer"
            >
              {LUNCH_FUNCTIONS.map(fn => <option key={fn} value={fn}>{fn}</option>)}
            </select>
          </div>

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
          <div className="pt-2">{renderMenuConfigSummary(lunchMenuConfig)}</div>
        )}
      </div>

      {/* Dinner Configuration */}
      <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-5">
        <div className="flex items-center gap-2 border-b border-[#F0EDE9] pb-3">
          <Flame size={16} className="text-red-500" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">Dinner Configuration</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5 mb-2">
              <Users size={13} className="text-[#C5A85C]" /> Dinner Guest Count
            </label>
            <input
              type="number"
              min={1}
              max={9999}
              value={dinnerGuestCount}
              onChange={e => {
                const v = Math.max(1, Number(e.target.value) || 1)
                setDinnerGuestCount(v)
                emit({ dinnerGuestCount: v })
              }}
              className="w-full border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs"
              placeholder="e.g. 250"
            />
          </div>

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
                    setDinnerFoodPref(opt.value)
                    const cleared = dinnerFoodPref !== opt.value ? undefined : dinnerMenuConfig
                    if (dinnerFoodPref !== opt.value) setDinnerMenuConfig(undefined)
                    emit({ dinnerFoodPref: opt.value, dinnerMenuConfig: cleared })
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

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5 mb-2">
              <Calendar size={13} className="text-[#C5A85C]" /> Dinner Function
            </label>
            <select
              value={dinnerFunction}
              onChange={e => {
                setDinnerFunction(e.target.value)
                emit({ dinnerFunction: e.target.value })
              }}
              className="w-full border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs cursor-pointer"
            >
              {DINNER_FUNCTIONS.map(fn => <option key={fn} value={fn}>{fn}</option>)}
            </select>
          </div>

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
          <div className="pt-2">{renderMenuConfigSummary(dinnerMenuConfig)}</div>
        )}
      </div>

      {/* Menu Modal */}
      {activeConfigMeal && (
        <StepMenuPackage
          meal={activeConfigMeal}
          mealType={activeConfigMeal === 'lunch' ? lunchFoodPref! : dinnerFoodPref!}
          guestCount={activeConfigMeal === 'lunch' ? lunchGuestCount : dinnerGuestCount}
          initialConfig={activeConfigMeal === 'lunch' ? lunchMenuConfig : dinnerMenuConfig}
          onSave={(config) => {
            if (activeConfigMeal === 'lunch') {
              setLunchMenuConfig(config)
              emit({ lunchMenuConfig: config })
            } else {
              setDinnerMenuConfig(config)
              emit({ dinnerMenuConfig: config })
            }
            setActiveConfigMeal(null)
          }}
          onClose={() => setActiveConfigMeal(null)}
        />
      )}
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// StepDayPlan: renders ALL days on a single scrollable page
// ──────────────────────────────────────────────────────────────────────────────
interface Props {
  day: number            // kept for API compat but not used for iteration — we use plans
  totalDays: number
  plan: DayPlan          // kept for API compat (the first/only day when totalDays === 1)
  plans: DayPlan[]       // full array for multi-day rendering
  vegMenuItems: any[]
  nonVegMenuItems: any[]
  onNext: (plans: DayPlan[]) => void
  onPrev: () => void
}

export function StepDayPlan({
  totalDays, plans, onNext, onPrev,
}: Props) {
  // Local copy of all day plans — updated incrementally via DayPlanCard.onChange
  const [localPlans, setLocalPlans] = useState<DayPlan[]>(plans)
  const [validationError, setValidationError] = useState('')

  function handleDayChange(updatedPlan: DayPlan) {
    setLocalPlans(prev => prev.map(p => p.day === updatedPlan.day ? updatedPlan : p))
  }

  function handleSubmit() {
    // Validate all days
    for (const p of localPlans) {
      if (!p.lunch.type || !p.dinner.type) {
        setValidationError(`Day ${p.day}: Please select Lunch and Dinner food preferences.`)
        return
      }
      if (!p.lunch.menu_config || !p.dinner.menu_config) {
        setValidationError(`Day ${p.day}: Please configure both Lunch and Dinner menus.`)
        return
      }
    }
    setValidationError('')
    onNext(localPlans)
  }

  return (
    <div className="pb-28 md:pb-0">
      {/* Step header */}
      <div className="mb-6 flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] text-xs font-bold tracking-widest text-[#A08040] uppercase">
          Step 2 · Day Planning
        </span>
        <span className="text-xs text-[#A8A8A8]">{totalDays} event {totalDays === 1 ? 'day' : 'days'}</span>
      </div>

      <h2 className="text-headline mb-1">Event Day Planning</h2>
      <p className="text-body text-[#737373] mb-8">
        Configure rooms, meal preferences, event functions, and catering menus for each event day.
      </p>

      {/* All day cards */}
      <div className="space-y-8">
        {localPlans.map(p => (
          <DayPlanCard
            key={p.day}
            day={p.day}
            totalDays={totalDays}
            plan={p}
            onChange={handleDayChange}
          />
        ))}
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
        <Button size="lg" onClick={handleSubmit}>Next Step: Decoration</Button>
      </div>

      {/* Mobile Nav */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-4 py-3">
        {validationError && (
          <p className="text-xs font-semibold text-red-600 text-center pb-2">⚠️ {validationError}</p>
        )}
        <div className="max-w-lg mx-auto flex gap-3">
          <Button variant="secondary" size="lg" onClick={onPrev} className="flex-1">Previous</Button>
          <Button size="lg" onClick={handleSubmit} className="flex-1">Decoration →</Button>
        </div>
      </div>
    </div>
  )
}
