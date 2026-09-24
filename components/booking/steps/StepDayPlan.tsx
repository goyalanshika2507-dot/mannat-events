'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bed, Users, UtensilsCrossed, Calendar, Leaf, Flame, CheckCircle2, Award, Sparkles, Gem, Crown, Info, Check, X, Loader2 } from 'lucide-react'
import { DayPlan, FoodPreference, BookingFormData, DecorationPackageTier } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils/cn'
import { MenuConfig, BanquetPackage } from '@/lib/menu'

interface Props {
  day: number
  totalDays: number
  plan: DayPlan
  data?: Partial<BookingFormData>
  vegMenuItems?: any[]
  nonVegMenuItems?: any[]
  onNext: (plan: DayPlan, decorTier?: DecorationPackageTier, decorTitle?: string) => void
  onPrev: () => void
}

interface DecorPkg {
  id: DecorationPackageTier
  title: string
  subtitle: string
  badge: string
  features: string[]
  image_url: string
  price: number
  is_active: boolean
}

const FALLBACK_LUNCH = ['Welcome Lunch','Mehendi','Haldi','Cocktail','Jaimala / Wedding Ceremony','Phere','Reception','Other']
const FALLBACK_DINNER = ['Welcome Dinner','Mehendi','Haldi','Cocktail','Jaimala / Wedding Ceremony','Phere','Reception','Other']

export function StepDayPlan({
  day, totalDays, plan, data = {}, onNext, onPrev,
}: Props) {
  const [rooms, setRooms] = useState<string>(plan.rooms > 0 ? String(plan.rooms) : '')
  const [lunchGuestCount, setLunchGuestCount] = useState<string>(plan.lunch.guest_count > 0 ? String(plan.lunch.guest_count) : '')
  const [dinnerGuestCount, setDinnerGuestCount] = useState<string>(plan.dinner.guest_count > 0 ? String(plan.dinner.guest_count) : '')

  // Meal preferences (null = unselected)
  const [lunchFoodPref, setLunchFoodPref] = useState<FoodPreference | null>(plan.lunch.type ?? null)
  const [dinnerFoodPref, setDinnerFoodPref] = useState<FoodPreference | null>(plan.dinner.type ?? null)

  // Wedding functions
  const [lunchFunctions, setLunchFunctions] = useState<string[]>(FALLBACK_LUNCH)
  const [dinnerFunctions, setDinnerFunctions] = useState<string[]>(FALLBACK_DINNER)
  const [lunchFunction, setLunchFunction] = useState<string>(plan.lunch_function ?? '')
  const [dinnerFunction, setDinnerFunction] = useState<string>(plan.dinner_function ?? '')

  // Catering Packages State
  const [allPackages, setAllPackages] = useState<BanquetPackage[]>([])
  const [loadingPackages, setLoadingPackages] = useState(true)

  const [lunchPkgId, setLunchPkgId] = useState<string>(plan.lunch.menu_config?.packageId ?? '')
  const [dinnerPkgId, setDinnerPkgId] = useState<string>(plan.dinner.menu_config?.packageId ?? '')

  // Menu Modals State
  const [showLunchMenuModal, setShowLunchMenuModal] = useState(false)
  const [showDinnerMenuModal, setShowDinnerMenuModal] = useState(false)

  // Decoration State & Modal
  const [selectedDecorTier, setSelectedDecorTier] = useState<DecorationPackageTier | null>(
    data.decoration_package ?? null
  )
  const [selectedDecorTitle, setSelectedDecorTitle] = useState<string>(
    data.decoration_theme_title ?? ''
  )
  const [tempDecorTier, setTempDecorTier] = useState<DecorationPackageTier | null>(null)
  const [decorPackages, setDecorPackages] = useState<DecorPkg[]>([])
  const [loadingDecor, setLoadingDecor] = useState(true)
  const [showDecorModal, setShowDecorModal] = useState(false)

  const [validationError, setValidationError] = useState('')

  // 1. Fetch Banquet Packages
  useEffect(() => {
    fetch('/api/config/banquet-packages')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAllPackages(data)
        }
        setLoadingPackages(false)
      })
      .catch(err => {
        console.error('Failed to load banquet packages:', err)
        setLoadingPackages(false)
      })
  }, [])

  // 2. Fetch Decoration Packages
  useEffect(() => {
    const hotelId = data.selected_hotel?.id || 'mannat-events'
    fetch(`/api/config/decoration-packages?hotel_id=${encodeURIComponent(hotelId)}`)
      .then(res => res.json())
      .then(decorData => {
        if (Array.isArray(decorData)) {
          setDecorPackages(decorData)
          if (data.decoration_package && !selectedDecorTitle) {
            const match = decorData.find((p: DecorPkg) => p.id === data.decoration_package)
            if (match) setSelectedDecorTitle(match.title)
          }
        }
        setLoadingDecor(false)
      })
      .catch(err => {
        console.error('Failed to load decoration packages:', err)
        setLoadingDecor(false)
      })
  }, [data.selected_hotel?.id, data.decoration_package])

  // 3. Fetch Wedding Functions
  useEffect(() => {
    fetch('/api/config/wedding-functions')
      .then(r => r.json())
      .then((fns: any[]) => {
        if (!Array.isArray(fns)) return
        const lunch = fns.filter(f => f.type === 'lunch' || f.type === 'both').map(f => f.name)
        const dinner = fns.filter(f => f.type === 'dinner' || f.type === 'both').map(f => f.name)
        if (lunch.length > 0) setLunchFunctions(lunch)
        if (dinner.length > 0) setDinnerFunctions(dinner)
      })
      .catch(() => {})
  }, [])

  // Submit Handler
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
      setValidationError('Please select the Lunch food preference (Vegetarian or Non-Vegetarian).')
      return
    }
    if (!lunchPkgId) {
      setValidationError('Please select a Lunch Catering Package.')
      return
    }
    if (!dinnerGuestCount || isNaN(dinnerGuests) || dinnerGuests < 1) {
      setValidationError('Please enter the Dinner guest count.')
      return
    }
    if (!dinnerFoodPref) {
      setValidationError('Please select the Dinner food preference (Vegetarian or Non-Vegetarian).')
      return
    }
    if (!dinnerPkgId) {
      setValidationError('Please select a Dinner Catering Package.')
      return
    }
    if (!selectedDecorTier) {
      setValidationError('Please select a Base Decoration Package.')
      return
    }

    setValidationError('')

    const lunchPkg = allPackages.find(p => p.id === lunchPkgId)!
    const dinnerPkg = allPackages.find(p => p.id === dinnerPkgId)!

    const lunchConfig: MenuConfig = {
      packageId: lunchPkg.id,
      packageName: lunchPkg.name,
      pricePerHead: lunchPkg.pricePerHead,
      mealType: lunchFoodPref,
      selections: lunchPkg.categories.map(cat => ({
        categoryId: cat.id,
        items: cat.items.map(i => i.name),
      })),
      liveStations: lunchPkg.liveStations?.map(s => s.label) || [],
      addOns: lunchPkg.addOns || [],
    }

    const dinnerConfig: MenuConfig = {
      packageId: dinnerPkg.id,
      packageName: dinnerPkg.name,
      pricePerHead: dinnerPkg.pricePerHead,
      mealType: dinnerFoodPref,
      selections: dinnerPkg.categories.map(cat => ({
        categoryId: cat.id,
        items: cat.items.map(i => i.name),
      })),
      liveStations: dinnerPkg.liveStations?.map(s => s.label) || [],
      addOns: dinnerPkg.addOns || [],
    }

    onNext(
      {
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
          menu_item_names: [lunchPkg.name],
          menu_config: lunchConfig,
        },
        dinner: {
          type: dinnerFoodPref,
          guest_count: dinnerGuests,
          menu_item_ids: [],
          menu_item_names: [dinnerPkg.name],
          menu_config: dinnerConfig,
        },
      },
      selectedDecorTier,
      selectedDecorTitle || 'Decoration Package'
    )
  }

  const foodPrefOptions: { value: FoodPreference; label: string; icon: React.ReactNode }[] = [
    { value: 'veg',     label: 'Vegetarian',     icon: <Leaf size={14} className="text-green-600" /> },
    { value: 'non-veg', label: 'Non-Vegetarian', icon: <Flame size={14} className="text-red-500" /> },
  ]

  const getDecorIcon = (id: string) => {
    if (id === 'silver') return <Award size={20} className="text-slate-500" />
    if (id === 'gold') return <Sparkles size={20} className="text-amber-500" />
    if (id === 'platinum') return <Gem size={20} className="text-cyan-600" />
    return <Crown size={20} className="text-[#C5A85C]" />
  }

  const activeLunchPackages = allPackages.filter(p => p.mealType === lunchFoodPref)
  const selectedLunchPkg = allPackages.find(p => p.id === lunchPkgId)

  const activeDinnerPackages = allPackages.filter(p => p.mealType === dinnerFoodPref)
  const selectedDinnerPkg = allPackages.find(p => p.id === dinnerPkgId)

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="pb-28 md:pb-0 space-y-8"
    >
      {/* Step Header */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] text-xs font-bold tracking-widest text-[#A08040] uppercase">
            Step 2: Day {day} Menu &amp; Decor
          </span>
          <span className="text-xs text-[#A8A8A8]">🌅 Breakfast included</span>
        </div>
        <h2 className="text-headline mb-1">Catering Menu &amp; Decoration Setup</h2>
        <p className="text-body text-[#737373]">
          Select stay details, food preference, banquet package, and base decoration tier for your event.
        </p>
      </div>

      {/* ── 1. Room Requirement & Selected Decor Summary Bar ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-2 shadow-xs">
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
            className="w-full max-w-xs border border-[#E8E2D8] rounded-xl px-4 py-2.5 text-base font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs"
            placeholder="Enter number of rooms"
          />
        </div>

        {/* Selected Decoration Summary Widget */}
        <div className="rounded-2xl border border-[#E8D9A8] bg-[#FDFAF3] p-5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A08040] flex items-center gap-1.5">
              <Sparkles size={14} /> Base Decoration
            </span>
            {selectedDecorTier && (
              <span className="w-5 h-5 rounded-full bg-[#C5A85C] text-white flex items-center justify-center text-[10px] font-bold">
                ✓
              </span>
            )}
          </div>

          <div>
            <p className="text-sm font-serif font-bold text-[#1A1A1A]">
              {selectedDecorTitle || 'No Decoration Selected'}
            </p>
            <p className="text-[11px] text-[#737373] mt-0.5">
              {selectedDecorTier ? 'Base tier set for wedding venue' : 'Click Decoration button to select'}
            </p>
          </div>

          <Button
            type="button"
            variant="gold"
            size="sm"
            onClick={() => {
              setTempDecorTier(selectedDecorTier)
              setShowDecorModal(true)
            }}
            className="w-full mt-2 flex items-center justify-center gap-1 text-xs font-bold"
          >
            <Sparkles size={13} /> {selectedDecorTier ? 'Change Decoration' : 'Select Decoration'}
          </Button>
        </div>
      </div>

      {/* ── 2. LUNCH CATERING SECTION ── */}
      <div className="rounded-3xl border border-[#E8E2D8] bg-white p-6 space-y-6 shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-[#F0EDE9] pb-4">
          <div className="w-8 h-8 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-700">
            <Leaf size={16} />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-[#1A1A1A]">Lunch Catering &amp; Setup</h3>
            <p className="text-xs text-[#737373]">Configure guest count, meal preference, function &amp; decoration</p>
          </div>
        </div>

        {/* EXACT 2x2 GRID STRUCTURE AS REQUESTED */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ROW 1 LEFT: Lunch Guest Count */}
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
              className="w-full border border-[#E8E2D8] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs"
              placeholder="Enter guest count"
            />
          </div>

          {/* ROW 1 RIGHT: Meal Preference */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5 mb-2">
              <UtensilsCrossed size={13} className="text-[#C5A85C]" /> Meal Preference
            </label>
            <div className="grid grid-cols-2 gap-2">
              {foodPrefOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    if (lunchFoodPref !== opt.value) {
                      setLunchFoodPref(opt.value)
                      setLunchPkgId('')
                    }
                    setShowLunchMenuModal(true)
                  }}
                  className={cn(
                    'flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 select-none cursor-pointer',
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

          {/* ROW 2 LEFT: Event Functions */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5 mb-2">
              <Calendar size={13} className="text-[#C5A85C]" /> Functions
            </label>
            <select
              value={lunchFunction}
              onChange={e => setLunchFunction(e.target.value)}
              className="w-full border border-[#E8E2D8] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs cursor-pointer"
            >
              <option value="">— Select Lunch Function —</option>
              {lunchFunctions.map(fn => <option key={fn} value={fn}>{fn}</option>)}
            </select>
          </div>

          {/* ROW 2 RIGHT: Decoration */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5 mb-2">
              <Sparkles size={13} className="text-[#C5A85C]" /> Decoration
            </label>
            <Button
              type="button"
              variant="gold"
              size="md"
              onClick={() => {
                setTempDecorTier(selectedDecorTier)
                setShowDecorModal(true)
              }}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-bold shadow-xs py-2.5"
            >
              <Sparkles size={13} /> {selectedDecorTitle ? `Decor: ${selectedDecorTitle}` : 'Select Decoration'}
            </Button>
          </div>
        </div>

        {/* Lunch Package Summary Banner on Step 2 */}
        {lunchFoodPref && (
          <div className="pt-2 border-t border-[#F0EDE9]">
            {selectedLunchPkg ? (
              <div className="rounded-2xl border border-[#E8D9A8] bg-[#FDFAF3] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F5EDD6] border border-[#E8D9A8] flex items-center justify-center text-[#A08040] shrink-0">
                    <UtensilsCrossed size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#A08040]">
                      Lunch Menu Selected
                    </span>
                    <h4 className="text-sm font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
                      {selectedLunchPkg.name}
                      <span className="text-xs font-sans text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                        {lunchFoodPref === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                      </span>
                    </h4>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="gold"
                  size="sm"
                  onClick={() => setShowLunchMenuModal(true)}
                  className="shrink-0 text-xs font-bold"
                >
                  <UtensilsCrossed size={13} className="mr-1" /> View / Change Menu
                </Button>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#C5A85C]/60 bg-[#FFFDF8] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F5EDD6]/50 border border-[#E8D9A8]/50 flex items-center justify-center text-[#A08040] shrink-0">
                    <Info size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A]">No Lunch Package Selected</h4>
                    <p className="text-[11px] text-[#737373]">
                      Click below to open the {lunchFoodPref === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'} menu modal and select a package.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="gold"
                  size="sm"
                  onClick={() => setShowLunchMenuModal(true)}
                  className="shrink-0 text-xs font-bold"
                >
                  Choose Package &amp; View Menu
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 3. DINNER CATERING SECTION ── */}
      <div className="rounded-3xl border border-[#E8E2D8] bg-white p-6 space-y-6 shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-[#F0EDE9] pb-4">
          <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <Flame size={16} />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-[#1A1A1A]">Dinner Catering &amp; Setup</h3>
            <p className="text-xs text-[#737373]">Configure guest count, meal preference, function &amp; decoration</p>
          </div>
        </div>

        {/* EXACT 2x2 GRID STRUCTURE AS REQUESTED */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ROW 1 LEFT: Dinner Guest Count */}
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
              className="w-full border border-[#E8E2D8] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs"
              placeholder="Enter guest count"
            />
          </div>

          {/* ROW 1 RIGHT: Meal Preference */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5 mb-2">
              <UtensilsCrossed size={13} className="text-[#C5A85C]" /> Meal Preference
            </label>
            <div className="grid grid-cols-2 gap-2">
              {foodPrefOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    if (dinnerFoodPref !== opt.value) {
                      setDinnerFoodPref(opt.value)
                      setDinnerPkgId('')
                    }
                    setShowDinnerMenuModal(true)
                  }}
                  className={cn(
                    'flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 select-none cursor-pointer',
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

          {/* ROW 2 LEFT: Event Functions */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5 mb-2">
              <Calendar size={13} className="text-[#C5A85C]" /> Functions
            </label>
            <select
              value={dinnerFunction}
              onChange={e => setDinnerFunction(e.target.value)}
              className="w-full border border-[#E8E2D8] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs cursor-pointer"
            >
              <option value="">— Select Dinner Function —</option>
              {dinnerFunctions.map(fn => <option key={fn} value={fn}>{fn}</option>)}
            </select>
          </div>

          {/* ROW 2 RIGHT: Decoration */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5 mb-2">
              <Sparkles size={13} className="text-[#C5A85C]" /> Decoration
            </label>
            <Button
              type="button"
              variant="gold"
              size="md"
              onClick={() => {
                setTempDecorTier(selectedDecorTier)
                setShowDecorModal(true)
              }}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-bold shadow-xs py-2.5"
            >
              <Sparkles size={13} /> {selectedDecorTitle ? `Decor: ${selectedDecorTitle}` : 'Select Decoration'}
            </Button>
          </div>
        </div>

        {/* Dinner Package Summary Banner on Step 2 */}
        {dinnerFoodPref && (
          <div className="pt-2 border-t border-[#F0EDE9]">
            {selectedDinnerPkg ? (
              <div className="rounded-2xl border border-[#E8D9A8] bg-[#FDFAF3] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F5EDD6] border border-[#E8D9A8] flex items-center justify-center text-[#A08040] shrink-0">
                    <Flame size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#A08040]">
                      Dinner Menu Selected
                    </span>
                    <h4 className="text-sm font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
                      {selectedDinnerPkg.name}
                      <span className="text-xs font-sans text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                        {dinnerFoodPref === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                      </span>
                    </h4>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="gold"
                  size="sm"
                  onClick={() => setShowDinnerMenuModal(true)}
                  className="shrink-0 text-xs font-bold"
                >
                  <UtensilsCrossed size={13} className="mr-1" /> View / Change Menu
                </Button>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#C5A85C]/60 bg-[#FFFDF8] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F5EDD6]/50 border border-[#E8D9A8]/50 flex items-center justify-center text-[#A08040] shrink-0">
                    <Info size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A]">No Dinner Package Selected</h4>
                    <p className="text-[11px] text-[#737373]">
                      Click below to open the {dinnerFoodPref === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'} menu modal and select a package.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="gold"
                  size="sm"
                  onClick={() => setShowDinnerMenuModal(true)}
                  className="shrink-0 text-xs font-bold"
                >
                  Choose Package &amp; View Menu
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <p className="text-sm font-semibold text-red-600 flex items-center gap-1.5 pt-2">
          ⚠️ {validationError}
        </p>
      )}

      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-between pt-6 border-t border-[#E8E2D8]">
        <Button variant="secondary" size="lg" onClick={onPrev}>Previous Step</Button>
        <Button size="lg" variant="gold" onClick={handleSubmit}>
          {day < totalDays ? `Next: Day ${day + 1}` : 'Next Step: Verification'}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-4 py-3">
        {validationError && (
          <p className="text-xs font-semibold text-red-600 text-center pb-2">⚠️ {validationError}</p>
        )}
        <div className="max-w-lg mx-auto flex gap-3">
          <Button variant="secondary" size="lg" onClick={onPrev} className="flex-1">Previous</Button>
          <Button size="lg" variant="gold" onClick={handleSubmit} className="flex-1">
            {day < totalDays ? `Day ${day + 1} →` : 'Verification →'}
          </Button>
        </div>
      </div>

      {/* ── 4. EXISTING DECORATION SELECTION MODAL ── */}
      <AnimatePresence>
        {showDecorModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1a1a1a]/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-4xl bg-[#FCFAF6] rounded-3xl overflow-hidden shadow-3d border border-[#E8D9A8] flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[#EEEAE4] bg-gradient-to-r from-[#FDFCFA] to-[#FAF6EE] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] flex items-center justify-center text-[#A08040]">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#C5A85C] font-bold">
                      Base Decoration Setup
                    </p>
                    <h3 className="text-base font-serif font-semibold text-[#1A1A1A]">
                      Select Decoration Package
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDecorModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-[#EEEAE4] text-[#737373] hover:text-[#1A1A1A] hover:border-[#C5A85C] transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Content: Existing Decoration Cards */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {/* Disclaimer Banner */}
                <div className="rounded-2xl border border-[#E8D9A8] bg-[#FDFAF3] p-4 flex items-start gap-3 text-xs text-[#907030]">
                  <Info size={18} className="text-[#C5A85C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold text-[#1A1A1A] mb-0.5">Base Package Selection</strong>
                    Select your standard base decoration package tier. Specific color schemes, stage concepts and lighting details can be customized after booking.
                  </div>
                </div>

                {loadingDecor ? (
                  <div className="flex items-center justify-center py-12 text-xs text-[#737373] gap-2">
                    <Loader2 className="animate-spin text-[#C5A85C]" size={20} /> Loading decoration options...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {decorPackages.map((pkg) => {
                      const activeTier = tempDecorTier || selectedDecorTier
                      const isSel = activeTier === pkg.id
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => setTempDecorTier(pkg.id)}
                          className={cn(
                            'group relative text-left rounded-2xl overflow-hidden border transition-all duration-200 bg-white cursor-pointer select-none',
                            isSel
                              ? 'border-[#C5A85C] ring-2 ring-[#C5A85C] shadow-md'
                              : 'border-[#E8E2D8] hover:border-[#C5A85C]/60 shadow-xs'
                          )}
                        >
                          <div className="relative h-36 w-full bg-[#F5EDD6] overflow-hidden">
                            <img
                              src={pkg.image_url}
                              alt={pkg.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                if (!target.src.endsWith('/floral.jpg')) {
                                  target.src = '/floral.jpg'
                                }
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            
                            <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/90 backdrop-blur-md text-[#1A1A1A]">
                              {pkg.badge}
                            </span>

                            {isSel && (
                              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#C5A85C] text-white flex items-center justify-center shadow-md">
                                <Check size={14} strokeWidth={3} />
                              </div>
                            )}

                            <div className="absolute bottom-3 left-3 right-3 text-white">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                {getDecorIcon(pkg.id)}
                                <h4 className="text-base font-bold">{pkg.title}</h4>
                              </div>
                              <p className="text-[11px] text-white/80">{pkg.subtitle}</p>
                            </div>
                          </div>

                          <div className="p-4">
                            <ul className="space-y-1">
                              {pkg.features.map((feat) => (
                                <li key={feat} className="flex items-center gap-2 text-xs text-[#737373]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A85C] shrink-0" />
                                  {feat}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-[#EEEAE4] bg-[#FDFCFA] flex justify-between items-center">
                <Button variant="secondary" size="md" onClick={() => setShowDecorModal(false)}>
                  Cancel
                </Button>
                <Button
                  size="md"
                  variant="gold"
                  disabled={!tempDecorTier && !selectedDecorTier}
                  onClick={() => {
                    const chosenTier = tempDecorTier || selectedDecorTier
                    if (chosenTier) {
                      setSelectedDecorTier(chosenTier)
                      const pkg = decorPackages.find(p => p.id === chosenTier)
                      setSelectedDecorTitle(pkg?.title ?? 'Decoration Package')
                    }
                    setShowDecorModal(false)
                  }}
                >
                  <Check size={14} className="mr-1" /> Confirm Decoration
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 5. LUNCH MENU SELECTION MODAL ── */}
      <AnimatePresence>
        {showLunchMenuModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1a1a1a]/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-4xl bg-[#FCFAF6] rounded-3xl overflow-hidden shadow-3d border border-[#E8D9A8] flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[#EEEAE4] bg-gradient-to-r from-[#FDFCFA] to-[#FAF6EE] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] flex items-center justify-center text-[#A08040]">
                    <UtensilsCrossed size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#C5A85C] font-bold">
                      Lunch Menu &amp; Package Setup
                    </p>
                    <h3 className="text-base font-serif font-semibold text-[#1A1A1A]">
                      {lunchFoodPref === 'veg' ? 'Vegetarian Menu & Packages' : 'Non-Vegetarian Menu & Packages'}
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLunchMenuModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-[#EEEAE4] text-[#737373] hover:text-[#1A1A1A] hover:border-[#C5A85C] transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <div className="rounded-2xl border border-[#E8D9A8] bg-[#FDFAF3] p-4 flex items-start gap-3 text-xs text-[#907030]">
                  <Info size={18} className="text-[#C5A85C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold text-[#1A1A1A] mb-0.5">Package Selection Required</strong>
                    Select a package below to view its included banquet menu dishes. No package is pre-selected by default.
                  </div>
                </div>

                {loadingPackages ? (
                  <div className="flex items-center justify-center py-12 text-xs text-[#737373] gap-2">
                    <Loader2 className="animate-spin text-[#C5A85C]" size={20} /> Loading packages...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {activeLunchPackages.map(pkg => {
                      const isSel = lunchPkgId === pkg.id
                      return (
                        <Card
                          key={pkg.id}
                          onClick={() => setLunchPkgId(pkg.id)}
                          className={cn(
                            'p-4 border cursor-pointer transition-all duration-200 rounded-2xl flex flex-col justify-between select-none relative overflow-hidden',
                            isSel
                              ? 'border-[#C5A85C] bg-[#FFFDF7] ring-2 ring-[#C5A85C]/30 shadow-md'
                              : 'border-[#E8E2D8] bg-white hover:border-[#C5A85C]/50 shadow-xs'
                          )}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h5 className="font-serif font-bold text-sm text-[#1A1A1A]">{pkg.name}</h5>
                              {isSel ? (
                                <span className="w-5 h-5 rounded-full bg-[#C5A85C] text-white flex items-center justify-center text-[10px]">
                                  ✓
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-[#A8A8A8] border border-[#E8E2D8] px-2 py-0.5 rounded-full">
                                  Not selected
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#737373] leading-relaxed">
                              {pkg.tagline.replace(/^₹[\d,]+\s*(?:per head)?\s*·?\s*/i, '')}
                            </p>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                )}

                {/* Display-Only Menu Dishes for Selected Package */}
                {selectedLunchPkg && (
                  <div className="space-y-4 pt-4 border-t border-[#EEEAE4]">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-[#C5A85C]" />
                        {selectedLunchPkg.name} — Included Menu
                      </h4>
                    </div>

                    <div className="space-y-4">
                      {selectedLunchPkg.categories.map(cat => (
                        <div key={cat.id} className="rounded-2xl border border-[#E8E2D8] bg-[#FDFCFA] p-4 space-y-2">
                          <div className="flex items-center gap-1.5 border-b border-[#EEEAE4] pb-2">
                            <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
                              <span>{cat.emoji}</span> {cat.label}
                            </span>
                          </div>

                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-1.5 gap-x-6 pt-1">
                            {cat.items.map((item, idx) => (
                              <li key={idx} className="text-xs text-[#555] flex items-start gap-2 font-medium">
                                <span className="text-[#C5A85C] shrink-0">•</span>
                                <span>{item.name}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-[#EEEAE4] bg-[#FDFCFA] flex justify-between items-center">
                <Button variant="secondary" size="md" onClick={() => setShowLunchMenuModal(false)}>
                  Close
                </Button>
                <Button
                  size="md"
                  variant="gold"
                  onClick={() => setShowLunchMenuModal(false)}
                >
                  <Check size={14} className="mr-1" /> Done
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 6. DINNER MENU SELECTION MODAL ── */}
      <AnimatePresence>
        {showDinnerMenuModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1a1a1a]/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-4xl bg-[#FCFAF6] rounded-3xl overflow-hidden shadow-3d border border-[#E8D9A8] flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[#EEEAE4] bg-gradient-to-r from-[#FDFCFA] to-[#FAF6EE] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                    <Flame size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#C5A85C] font-bold">
                      Dinner Menu &amp; Package Setup
                    </p>
                    <h3 className="text-base font-serif font-semibold text-[#1A1A1A]">
                      {dinnerFoodPref === 'veg' ? 'Vegetarian Menu & Packages' : 'Non-Vegetarian Menu & Packages'}
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDinnerMenuModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-[#EEEAE4] text-[#737373] hover:text-[#1A1A1A] hover:border-[#C5A85C] transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <div className="rounded-2xl border border-[#E8D9A8] bg-[#FDFAF3] p-4 flex items-start gap-3 text-xs text-[#907030]">
                  <Info size={18} className="text-[#C5A85C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold text-[#1A1A1A] mb-0.5">Package Selection Required</strong>
                    Select a package below to view its included banquet menu dishes. No package is pre-selected by default.
                  </div>
                </div>

                {loadingPackages ? (
                  <div className="flex items-center justify-center py-12 text-xs text-[#737373] gap-2">
                    <Loader2 className="animate-spin text-[#C5A85C]" size={20} /> Loading packages...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {activeDinnerPackages.map(pkg => {
                      const isSel = dinnerPkgId === pkg.id
                      return (
                        <Card
                          key={pkg.id}
                          onClick={() => setDinnerPkgId(pkg.id)}
                          className={cn(
                            'p-4 border cursor-pointer transition-all duration-200 rounded-2xl flex flex-col justify-between select-none relative overflow-hidden',
                            isSel
                              ? 'border-[#C5A85C] bg-[#FFFDF7] ring-2 ring-[#C5A85C]/30 shadow-md'
                              : 'border-[#E8E2D8] bg-white hover:border-[#C5A85C]/50 shadow-xs'
                          )}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h5 className="font-serif font-bold text-sm text-[#1A1A1A]">{pkg.name}</h5>
                              {isSel ? (
                                <span className="w-5 h-5 rounded-full bg-[#C5A85C] text-white flex items-center justify-center text-[10px]">
                                  ✓
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-[#A8A8A8] border border-[#E8E2D8] px-2 py-0.5 rounded-full">
                                  Not selected
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#737373] leading-relaxed">
                              {pkg.tagline.replace(/^₹[\d,]+\s*(?:per head)?\s*·?\s*/i, '')}
                            </p>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                )}

                {/* Display-Only Menu Dishes for Selected Package */}
                {selectedDinnerPkg && (
                  <div className="space-y-4 pt-4 border-t border-[#EEEAE4]">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-[#C5A85C]" />
                        {selectedDinnerPkg.name} — Included Menu
                      </h4>
                    </div>

                    <div className="space-y-4">
                      {selectedDinnerPkg.categories.map(cat => (
                        <div key={cat.id} className="rounded-2xl border border-[#E8E2D8] bg-[#FDFCFA] p-4 space-y-2">
                          <div className="flex items-center gap-1.5 border-b border-[#EEEAE4] pb-2">
                            <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
                              <span>{cat.emoji}</span> {cat.label}
                            </span>
                          </div>

                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-1.5 gap-x-6 pt-1">
                            {cat.items.map((item, idx) => (
                              <li key={idx} className="text-xs text-[#555] flex items-start gap-2 font-medium">
                                <span className="text-[#C5A85C] shrink-0">•</span>
                                <span>{item.name}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-[#EEEAE4] bg-[#FDFCFA] flex justify-between items-center">
                <Button variant="secondary" size="md" onClick={() => setShowDinnerMenuModal(false)}>
                  Close
                </Button>
                <Button
                  size="md"
                  variant="gold"
                  onClick={() => setShowDinnerMenuModal(false)}
                >
                  <Check size={14} className="mr-1" /> Done
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
