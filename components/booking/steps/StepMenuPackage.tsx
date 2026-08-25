'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { UtensilsCrossed, Info, Check, ChevronRight, ChevronLeft, Leaf, Flame } from 'lucide-react'
import { DayPlan } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils/cn'
import {
  getPackagesForMealType,
  findPackageById,
  MenuConfig,
  CategorySelection,
} from '@/lib/menu'

interface Props {
  day: number
  plan: DayPlan
  onNext: (data: {
    lunchMenuPackage: string
    dinnerMenuPackage: string
    lunchMenuConfig: MenuConfig
    dinnerMenuConfig: MenuConfig
  }) => void
  onPrev: () => void
}

export function StepMenuPackage({ day, plan, onNext, onPrev }: Props) {
  // Wizard Sub-steps:
  // 0: Package Selection (Lunch and Dinner packages chosen)
  // 1: Menu Customisation (dishes, live stations, add-ons)
  // 2: Review & Confirm
  const [subStep, setSubStep] = useState<number>(0)

  // Active tab in Customisation sub-step (subStep === 1)
  const [activeTab, setActiveTab] = useState<'lunch' | 'dinner'>('lunch')

  // Package Selections - Initialize from saved data or empty
  const [selectedLunchPkgId, setSelectedLunchPkgId] = useState<string>(() => {
    return plan.lunch.menu_config?.packageId || ''
  })
  const [selectedDinnerPkgId, setSelectedDinnerPkgId] = useState<string>(() => {
    return plan.dinner.menu_config?.packageId || ''
  })

  // Menu Selections per meal - Initialize from saved data or empty
  const [lunchSelections, setLunchSelections] = useState<Record<string, string[]>>(() => {
    const config = plan.lunch.menu_config
    if (config) {
      const selObj: Record<string, string[]> = {}
      config.selections.forEach(sel => {
        selObj[sel.categoryId] = sel.items
      })
      return selObj
    }
    return {}
  })

  const [dinnerSelections, setDinnerSelections] = useState<Record<string, string[]>>(() => {
    const config = plan.dinner.menu_config
    if (config) {
      const selObj: Record<string, string[]> = {}
      config.selections.forEach(sel => {
        selObj[sel.categoryId] = sel.items
      })
      return selObj
    }
    return {}
  })

  // Selected Live Stations
  const [lunchLiveStations, setLunchLiveStations] = useState<string[]>(() => {
    return plan.lunch.menu_config?.liveStations ?? []
  })
  const [dinnerLiveStations, setDinnerLiveStations] = useState<string[]>(() => {
    return plan.dinner.menu_config?.liveStations ?? []
  })

  // Selected Add-ons
  const [lunchAddOns, setLunchAddOns] = useState<string[]>(() => {
    return plan.lunch.menu_config?.addOns ?? []
  })
  const [dinnerAddOns, setDinnerAddOns] = useState<string[]>(() => {
    return plan.dinner.menu_config?.addOns ?? []
  })

  const lunchPackages = getPackagesForMealType(plan.lunch.type)
  const dinnerPackages = getPackagesForMealType(plan.dinner.type)

  const currentLunchPkg = findPackageById(selectedLunchPkgId)
  const currentDinnerPkg = findPackageById(selectedDinnerPkgId)

  // Reset selections when package changes
  const handleLunchPkgChange = (pkgId: string) => {
    setSelectedLunchPkgId(pkgId)
    setLunchSelections({})
    setLunchLiveStations([])
    setLunchAddOns([])
  }

  const handleDinnerPkgChange = (pkgId: string) => {
    setSelectedDinnerPkgId(pkgId)
    setDinnerSelections({})
    setDinnerLiveStations([])
    setDinnerAddOns([])
  }

  // Handle item checkbox selections
  const handleItemToggle = (
    meal: 'lunch' | 'dinner',
    categoryId: string,
    itemName: string,
    limit?: number
  ) => {
    const selections = meal === 'lunch' ? lunchSelections : dinnerSelections
    const setSelections = meal === 'lunch' ? setLunchSelections : setDinnerSelections
    
    const currentList = selections[categoryId] ?? []
    
    if (currentList.includes(itemName)) {
      setSelections({
        ...selections,
        [categoryId]: currentList.filter(name => name !== itemName),
      })
    } else {
      if (!limit || currentList.length < limit) {
        setSelections({
          ...selections,
          [categoryId]: [...currentList, itemName],
        })
      }
    }
  }

  const handleLiveStationToggle = (meal: 'lunch' | 'dinner', stationLabel: string) => {
    const list = meal === 'lunch' ? lunchLiveStations : dinnerLiveStations
    const setList = meal === 'lunch' ? setLunchLiveStations : setDinnerLiveStations

    if (list.includes(stationLabel)) {
      setList(list.filter(l => l !== stationLabel))
    } else {
      setList([...list, stationLabel])
    }
  }

  const handleAddOnToggle = (meal: 'lunch' | 'dinner', addOn: string) => {
    const list = meal === 'lunch' ? lunchAddOns : dinnerAddOns
    const setList = meal === 'lunch' ? setLunchAddOns : setDinnerAddOns

    if (list.includes(addOn)) {
      setList(list.filter(a => a !== addOn))
    } else {
      setList([...list, addOn])
    }
  }

  // Build final MenuConfig objects
  const buildMenuConfig = (meal: 'lunch' | 'dinner'): MenuConfig | null => {
    const pkg = meal === 'lunch' ? currentLunchPkg : currentDinnerPkg
    const selections = meal === 'lunch' ? lunchSelections : dinnerSelections
    const liveStations = meal === 'lunch' ? lunchLiveStations : dinnerLiveStations
    const addOns = meal === 'lunch' ? lunchAddOns : dinnerAddOns
    const mealType = meal === 'lunch' ? plan.lunch.type : plan.dinner.type

    if (!pkg) return null

    const categorySelections: CategorySelection[] = Object.keys(selections).map(catId => ({
      categoryId: catId,
      items: selections[catId] || [],
    }))

    return {
      packageId: pkg.id,
      packageName: pkg.name,
      pricePerHead: pkg.pricePerHead,
      mealType,
      selections: categorySelections,
      liveStations,
      addOns,
    }
  }

  // Submit back to Wizard
  const handleSubmit = () => {
    const lunchConf = buildMenuConfig('lunch')
    const dinnerConf = buildMenuConfig('dinner')

    if (!lunchConf || !dinnerConf) return

    onNext({
      lunchMenuPackage: lunchConf.packageName,
      dinnerMenuPackage: dinnerConf.packageName,
      lunchMenuConfig: lunchConf,
      dinnerMenuConfig: dinnerConf,
    })
  }

  const handleNextSubStep = () => {
    if (subStep === 0) {
      if (!selectedLunchPkgId || !selectedDinnerPkgId) {
        return
      }
    }
    setSubStep(prev => prev + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePrevSubStep = () => {
    if (subStep === 0) {
      onPrev()
    } else {
      setSubStep(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Categories helper for render
  const renderCuisineCategory = (meal: 'lunch' | 'dinner', cat: any) => {
    const selections = meal === 'lunch' ? lunchSelections : dinnerSelections
    const selectedList = selections[cat.id] ?? []
    const limitReached = cat.limit ? selectedList.length >= cat.limit : false

    return (
      <div key={cat.id} className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-4 shadow-sm">
        <div className="flex justify-between items-center border-b border-[#F0EDE9] pb-3">
          <h3 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </h3>
          <span className={cn(
            "text-xs font-semibold px-2 py-1 rounded-full border",
            cat.limit 
              ? (limitReached ? "bg-green-50 text-green-700 border-green-200" : "bg-[#F5EDD6] text-[#A08040] border-[#E8D9A8]")
              : "bg-gray-50 text-gray-600 border-gray-200"
          )}>
            {cat.limit ? `Selected: ${selectedList.length} of ${cat.limit}` : 'Assorted (Unlimited)'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {cat.items.map((item: any) => {
            const isChecked = selectedList.includes(item.name)
            const isDisabled = !isChecked && limitReached

            return (
              <label
                key={item.name}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all duration-200 select-none",
                  isChecked 
                    ? "bg-[#C5A85C]/10 border-[#C5A85C] text-[#1A1A1A]" 
                    : (isDisabled ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border-[#E8E2D8] text-[#555] hover:border-[#C5A85C]/60")
                )}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={isDisabled}
                  onChange={() => handleItemToggle(meal, cat.id, item.name, cat.limit)}
                  className="mt-0.5 border-[#E8E2D8] rounded text-[#C5A85C] focus:ring-[#C5A85C] shrink-0"
                />
                <div>
                  <span className="block font-semibold">{item.name}</span>
                  {item.subLabel && <span className="block text-[10px] text-gray-500 mt-0.5">{item.subLabel}</span>}
                </div>
              </label>
            )
          })}
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
      {/* Sub-wizard Progress Indicator */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] text-xs font-bold tracking-widest text-[#A08040] uppercase">
          Day {day} Planning: Step 2 of 3
        </span>
        <div className="flex gap-1 text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider">
          <span className={cn(subStep === 0 && "text-[#C9A84C]")}>1. Package Selection</span>
          <span>·</span>
          <span className={cn(subStep === 1 && "text-[#C9A84C]")}>2. Menu Customisation</span>
          <span>·</span>
          <span className={cn(subStep === 2 && "text-[#C9A84C]")}>3. Review & Confirm</span>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* SUB-STEP 0: PACKAGE SELECTION */}
      {/* ──────────────────────────────────────────────────────── */}
      {subStep === 0 && (
        <div className="space-y-8">
          {/* Lunch Package Selection */}
          <div className="space-y-4">
            <div>
              <h2 className="text-headline mb-1 flex items-center gap-2">
                <Leaf className="text-green-600 inline" size={24} /> Lunch Package Selection
              </h2>
              <p className="text-body text-[#737373]">
                Pick a dining package tier for Day {day}&apos;s Lunch ({plan.lunch.guest_count} Guests, {plan.lunch.type === 'veg' ? 'Veg' : 'Non-Veg'}).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {lunchPackages.map(pkg => {
                const isSelected = selectedLunchPkgId === pkg.id
                return (
                  <Card
                    key={pkg.id}
                    onClick={() => handleLunchPkgChange(pkg.id)}
                    className={cn(
                      "cursor-pointer p-6 flex flex-col justify-between border-2 transition-all duration-300 relative overflow-hidden",
                      isSelected ? "border-[#C5A85C] bg-[#FDFDFC] shadow-lg" : "border-[#E8E2D8] bg-white hover:border-[#C5A85C]/60"
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-0 right-0 bg-[#C5A85C] text-white p-1 rounded-bl-xl">
                        <Check size={16} />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-serif font-semibold text-[#1A1A1A] mb-1">{pkg.name}</h3>
                      <p className="text-xs text-[#737373] mb-4">{pkg.tagline}</p>
                      <div className="border-t border-[#F0EDE9] pt-4 mb-4">
                        <p className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider mb-2">Key Categories</p>
                        <ul className="text-xs text-[#555] space-y-1.5">
                          {pkg.categories.slice(0, 5).map(cat => (
                            <li key={cat.id} className="flex items-center gap-1.5">
                              <span className="text-[#C5A85C]">•</span>
                              <span>{cat.label} {cat.limit ? `(Choose ${cat.limit})` : ''}</span>
                            </li>
                          ))}
                          {pkg.categories.length > 5 && (
                            <li className="text-[#A8A8A8] italic">+ {pkg.categories.length - 5} more categories</li>
                          )}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#F0EDE9] flex justify-between items-end">
                      <div>
                        <span className="text-xs text-[#A8A8A8] block">Price per head</span>
                        <span className="text-xl font-bold text-[#1A1A1A]">₹{pkg.pricePerHead.toLocaleString('en-IN')}</span>
                      </div>
                      <Button variant={isSelected ? "gold" : "secondary"} size="sm">
                        {isSelected ? "Selected" : "Select"}
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Dinner Package Selection */}
          <div className="space-y-4 pt-4 border-t border-[#E8E2D8]">
            <div>
              <h2 className="text-headline mb-1 flex items-center gap-2">
                <Flame className="text-red-500 inline" size={24} /> Dinner Package Selection
              </h2>
              <p className="text-body text-[#737373]">
                Pick a dining package tier for Day {day}&apos;s Dinner ({plan.dinner.guest_count} Guests, {plan.dinner.type === 'veg' ? 'Veg' : 'Non-Veg'}).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dinnerPackages.map(pkg => {
                const isSelected = selectedDinnerPkgId === pkg.id
                return (
                  <Card
                    key={pkg.id}
                    onClick={() => handleDinnerPkgChange(pkg.id)}
                    className={cn(
                      "cursor-pointer p-6 flex flex-col justify-between border-2 transition-all duration-300 relative overflow-hidden",
                      isSelected ? "border-[#C5A85C] bg-[#FDFDFC] shadow-lg" : "border-[#E8E2D8] bg-white hover:border-[#C5A85C]/60"
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-0 right-0 bg-[#C5A85C] text-white p-1 rounded-bl-xl">
                        <Check size={16} />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-serif font-semibold text-[#1A1A1A] mb-1">{pkg.name}</h3>
                      <p className="text-xs text-[#737373] mb-4">{pkg.tagline}</p>
                      <div className="border-t border-[#F0EDE9] pt-4 mb-4">
                        <p className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider mb-2">Key Categories</p>
                        <ul className="text-xs text-[#555] space-y-1.5">
                          {pkg.categories.slice(0, 5).map(cat => (
                            <li key={cat.id} className="flex items-center gap-1.5">
                              <span className="text-[#C5A85C]">•</span>
                              <span>{cat.label} {cat.limit ? `(Choose ${cat.limit})` : ''}</span>
                            </li>
                          ))}
                          {pkg.categories.length > 5 && (
                            <li className="text-[#A8A8A8] italic">+ {pkg.categories.length - 5} more categories</li>
                          )}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#F0EDE9] flex justify-between items-end">
                      <div>
                        <span className="text-xs text-[#A8A8A8] block">Price per head</span>
                        <span className="text-xl font-bold text-[#1A1A1A]">₹{pkg.pricePerHead.toLocaleString('en-IN')}</span>
                      </div>
                      <Button variant={isSelected ? "gold" : "secondary"} size="sm">
                        {isSelected ? "Selected" : "Select"}
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* SUB-STEP 1: MENU CUSTOMISATION */}
      {/* ──────────────────────────────────────────────────────── */}
      {subStep === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-headline mb-1 flex items-center gap-2">
              <UtensilsCrossed className="text-[#C9A84C] inline" size={24} /> Customize Menu Items
            </h2>
            <p className="text-body text-[#737373]">
              Configure dishes for Day {day}&apos;s Lunch and Dinner. All selections must be made manually.
            </p>
          </div>

          {/* Lunch / Dinner Tabs */}
          <div className="flex gap-2 border-b border-[#E8E2D8] pb-px">
            <button
              type="button"
              onClick={() => setActiveTab('lunch')}
              className={cn(
                "px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all",
                activeTab === 'lunch'
                  ? "border-[#C5A85C] text-[#C5A85C]"
                  : "border-transparent text-[#737373] hover:text-[#1A1A1A]"
              )}
            >
              ☀️ Lunch ({currentLunchPkg?.name || 'No Package'})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dinner')}
              className={cn(
                "px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all",
                activeTab === 'dinner'
                  ? "border-[#C5A85C] text-[#C5A85C]"
                  : "border-transparent text-[#737373] hover:text-[#1A1A1A]"
              )}
            >
              🌙 Dinner ({currentDinnerPkg?.name || 'No Package'})
            </button>
          </div>

          <div className="space-y-6 pt-4">
            {activeTab === 'lunch' && currentLunchPkg && (
              <>
                {currentLunchPkg.categories.map(cat => renderCuisineCategory('lunch', cat))}
                
                {/* Lunch Live Stations */}
                {currentLunchPkg.liveStations.length > 0 && (
                  <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-4 shadow-sm">
                    <div className="border-b border-[#F0EDE9] pb-3">
                      <h3 className="text-sm font-bold text-[#1A1A1A]">🔥 Included Live Stations</h3>
                      <p className="text-xs text-[#737373] mt-0.5">Toggle live stations included in this menu.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentLunchPkg.liveStations.map(station => {
                        const isChecked = lunchLiveStations.includes(station.label)
                        return (
                          <div
                            key={station.id}
                            onClick={() => handleLiveStationToggle('lunch', station.label)}
                            className={cn(
                              "p-4 rounded-xl border text-xs cursor-pointer transition-all duration-200 select-none",
                              isChecked ? "bg-[#C5A85C]/15 border-[#C5A85C] text-[#1A1A1A]" : "bg-white border-[#E8E2D8] text-gray-400"
                            )}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-bold">{station.label}</span>
                              <span className={cn("w-4 h-4 rounded-full border flex items-center justify-center", isChecked ? "bg-[#C5A85C] border-[#C5A85C]" : "border-gray-300")}>
                                {isChecked && <Check size={10} className="text-white" />}
                              </span>
                            </div>
                            <p className="text-[10px] leading-relaxed opacity-85">
                              {station.subItems.join(', ')}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Lunch Add-ons */}
                {currentLunchPkg.addOns.length > 0 && (
                  <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-4 shadow-sm">
                    <div className="border-b border-[#F0EDE9] pb-3">
                      <h3 className="text-sm font-bold text-[#1A1A1A]">✨ Available Menu Add-ons</h3>
                      <p className="text-xs text-[#737373] mt-0.5">Select optional add-ons (charged separately on actuals).</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {currentLunchPkg.addOns.map(addOn => {
                        const isChecked = lunchAddOns.includes(addOn)
                        return (
                          <label
                            key={addOn}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all duration-200 select-none",
                              isChecked ? "bg-[#C5A85C]/10 border-[#C5A85C] text-[#1A1A1A]" : "bg-white border-[#E8E2D8] text-[#555] hover:border-[#C5A85C]/60"
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleAddOnToggle('lunch', addOn)}
                              className="border-[#E8E2D8] rounded text-[#C5A85C] focus:ring-[#C5A85C]"
                            />
                            {addOn}
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'dinner' && currentDinnerPkg && (
              <>
                {currentDinnerPkg.categories.map(cat => renderCuisineCategory('dinner', cat))}

                {/* Dinner Live Stations */}
                {currentDinnerPkg.liveStations.length > 0 && (
                  <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-4 shadow-sm">
                    <div className="border-b border-[#F0EDE9] pb-3">
                      <h3 className="text-sm font-bold text-[#1A1A1A]">🔥 Included Live Stations</h3>
                      <p className="text-xs text-[#737373] mt-0.5">Toggle live stations included in this menu.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentDinnerPkg.liveStations.map(station => {
                        const isChecked = dinnerLiveStations.includes(station.label)
                        return (
                          <div
                            key={station.id}
                            onClick={() => handleLiveStationToggle('dinner', station.label)}
                            className={cn(
                              "p-4 rounded-xl border text-xs cursor-pointer transition-all duration-200 select-none",
                              isChecked ? "bg-[#C5A85C]/15 border-[#C5A85C] text-[#1A1A1A]" : "bg-white border-[#E8E2D8] text-gray-400"
                            )}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-bold">{station.label}</span>
                              <span className={cn("w-4 h-4 rounded-full border flex items-center justify-center", isChecked ? "bg-[#C5A85C] border-[#C5A85C]" : "border-gray-300")}>
                                {isChecked && <Check size={10} className="text-white" />}
                              </span>
                            </div>
                            <p className="text-[10px] leading-relaxed opacity-85">
                              {station.subItems.join(', ')}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Dinner Add-ons */}
                {currentDinnerPkg.addOns.length > 0 && (
                  <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-4 shadow-sm">
                    <div className="border-b border-[#F0EDE9] pb-3">
                      <h3 className="text-sm font-bold text-[#1A1A1A]">✨ Available Menu Add-ons</h3>
                      <p className="text-xs text-[#737373] mt-0.5">Select optional add-ons (charged separately on actuals).</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {currentDinnerPkg.addOns.map(addOn => {
                        const isChecked = dinnerAddOns.includes(addOn)
                        return (
                          <label
                            key={addOn}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all duration-200 select-none",
                              isChecked ? "bg-[#C5A85C]/10 border-[#C5A85C] text-[#1A1A1A]" : "bg-white border-[#E8E2D8] text-[#555] hover:border-[#C5A85C]/60"
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleAddOnToggle('dinner', addOn)}
                              className="border-[#E8E2D8] rounded text-[#C5A85C] focus:ring-[#C5A85C]"
                            />
                            {addOn}
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* SUB-STEP 2: REVIEW & CONFIRM */}
      {/* ──────────────────────────────────────────────────────── */}
      {subStep === 2 && currentLunchPkg && currentDinnerPkg && (
        <div className="space-y-6">
          <div>
            <h2 className="text-headline mb-1">Review Selections</h2>
            <p className="text-body text-[#737373] mb-6">
              Review your customized menus before proceeding to event function scheduling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lunch Review */}
            <Card className="p-5 space-y-4 border border-[#E8E2D8] bg-white">
              <div className="flex justify-between items-center border-b border-[#F0EDE9] pb-3">
                <div>
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold rounded-md uppercase tracking-wider">Lunch Menu</span>
                  <h3 className="text-base font-serif font-semibold text-[#1A1A1A] mt-1">{currentLunchPkg.name}</h3>
                </div>
                <span className="text-sm font-bold text-[#C5A85C]">₹{currentLunchPkg.pricePerHead}/head</span>
              </div>
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {currentLunchPkg.categories.map(cat => {
                  const items = lunchSelections[cat.id] ?? []
                  if (items.length === 0) return null
                  return (
                    <div key={cat.id} className="text-xs">
                      <p className="font-bold text-[#1A1A1A] mb-1">{cat.label}</p>
                      <p className="text-[#737373] leading-relaxed">{items.join(', ')}</p>
                    </div>
                  )
                })}

                {lunchLiveStations.length > 0 && (
                  <div className="text-xs pt-1 border-t border-[#F0EDE9]">
                    <p className="font-bold text-[#1A1A1A] mb-1">Live Stations</p>
                    <p className="text-[#737373]">{lunchLiveStations.join(', ')}</p>
                  </div>
                )}

                {lunchAddOns.length > 0 && (
                  <div className="text-xs pt-1 border-t border-[#F0EDE9]">
                    <p className="font-bold text-[#1A1A1A] mb-1">Add-ons Selected</p>
                    <p className="text-[#907030] font-semibold">{lunchAddOns.join(', ')}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Dinner Review */}
            <Card className="p-5 space-y-4 border border-[#E8E2D8] bg-white">
              <div className="flex justify-between items-center border-b border-[#F0EDE9] pb-3">
                <div>
                  <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold rounded-md uppercase tracking-wider">Dinner Menu</span>
                  <h3 className="text-base font-serif font-semibold text-[#1A1A1A] mt-1">{currentDinnerPkg.name}</h3>
                </div>
                <span className="text-sm font-bold text-[#C5A85C]">₹{currentDinnerPkg.pricePerHead}/head</span>
              </div>
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {currentDinnerPkg.categories.map(cat => {
                  const items = dinnerSelections[cat.id] ?? []
                  if (items.length === 0) return null
                  return (
                    <div key={cat.id} className="text-xs">
                      <p className="font-bold text-[#1A1A1A] mb-1">{cat.label}</p>
                      <p className="text-[#737373] leading-relaxed">{items.join(', ')}</p>
                    </div>
                  )
                })}

                {dinnerLiveStations.length > 0 && (
                  <div className="text-xs pt-1 border-t border-[#F0EDE9]">
                    <p className="font-bold text-[#1A1A1A] mb-1">Live Stations</p>
                    <p className="text-[#737373]">{dinnerLiveStations.join(', ')}</p>
                  </div>
                )}

                {dinnerAddOns.length > 0 && (
                  <div className="text-xs pt-1 border-t border-[#F0EDE9]">
                    <p className="font-bold text-[#1A1A1A] mb-1">Add-ons Selected</p>
                    <p className="text-[#907030] font-semibold">{dinnerAddOns.join(', ')}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* NAVIGATION CONTROLS */}
      {/* ──────────────────────────────────────────────────────── */}
      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-between mt-10 pt-6 border-t border-[#E8E2D8]">
        <Button variant="secondary" size="lg" onClick={handlePrevSubStep}>
          <ChevronLeft size={16} className="mr-1" /> Back
        </Button>
        
        {subStep < 2 ? (
          <Button 
            size="lg" 
            onClick={handleNextSubStep}
            disabled={subStep === 0 && (!selectedLunchPkgId || !selectedDinnerPkgId)}
          >
            Next <ChevronRight size={16} className="ml-1" />
          </Button>
        ) : (
          <Button size="lg" onClick={handleSubmit}>
            Confirm Selections <ChevronRight size={16} className="ml-1" />
          </Button>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button variant="secondary" size="lg" onClick={handlePrevSubStep} className="flex-1">
            Back
          </Button>
          
          {subStep < 2 ? (
            <Button 
              size="lg" 
              onClick={handleNextSubStep} 
              className="flex-1"
              disabled={subStep === 0 && (!selectedLunchPkgId || !selectedDinnerPkgId)}
            >
              Next
            </Button>
          ) : (
            <Button size="lg" onClick={handleSubmit} className="flex-1">
              Confirm
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
