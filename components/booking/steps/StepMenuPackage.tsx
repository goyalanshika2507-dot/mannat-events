'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { UtensilsCrossed, Info, Check, ChevronRight, ChevronLeft, X } from 'lucide-react'
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
  meal: 'lunch' | 'dinner'
  mealType: 'veg' | 'non-veg'
  guestCount: number
  initialConfig: MenuConfig | undefined
  onSave: (config: MenuConfig) => void
  onClose: () => void
}

export function StepMenuPackage({ meal, mealType, guestCount, initialConfig, onSave, onClose }: Props) {
  // Configurator sub-steps:
  // 0: Package Selection
  // 1: Menu Customisation
  const [subStep, setSubStep] = useState<number>(0)

  // Package Selection
  const [selectedPkgId, setSelectedPkgId] = useState<string>(() => {
    return initialConfig?.packageId || ''
  })

  // Menu Selections per category
  const [selections, setSelections] = useState<Record<string, string[]>>(() => {
    if (initialConfig) {
      const selObj: Record<string, string[]> = {}
      initialConfig.selections.forEach(sel => {
        selObj[sel.categoryId] = sel.items
      })
      return selObj
    }
    return {}
  })

  // Selected Live Stations
  const [liveStations, setLiveStations] = useState<string[]>(() => {
    return initialConfig?.liveStations ?? []
  })

  // Selected Add-ons
  const [addOns, setAddOns] = useState<string[]>(() => {
    return initialConfig?.addOns ?? []
  })

  const packages = getPackagesForMealType(mealType)
  const currentPkg = findPackageById(selectedPkgId)

  const handlePkgChange = (pkgId: string) => {
    setSelectedPkgId(pkgId)
    setSelections({})
    setLiveStations([])
    setAddOns([])
  }

  const handleItemToggle = (categoryId: string, itemName: string, limit?: number) => {
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

  const handleLiveStationToggle = (stationLabel: string) => {
    if (liveStations.includes(stationLabel)) {
      setLiveStations(liveStations.filter(l => l !== stationLabel))
    } else {
      setLiveStations([...liveStations, stationLabel])
    }
  }

  const handleAddOnToggle = (addOn: string) => {
    if (addOns.includes(addOn)) {
      setAddOns(addOns.filter(a => a !== addOn))
    } else {
      setAddOns([...addOns, addOn])
    }
  }

  const handleConfirm = () => {
    if (!currentPkg) return

    const categorySelections: CategorySelection[] = Object.keys(selections).map(catId => ({
      categoryId: catId,
      items: selections[catId] || [],
    }))

    onSave({
      packageId: currentPkg.id,
      packageName: currentPkg.name,
      pricePerHead: currentPkg.pricePerHead,
      mealType,
      selections: categorySelections,
      liveStations,
      addOns,
    })
  }

  const handleNextSubStep = () => {
    if (subStep === 0 && !selectedPkgId) return
    setSubStep(prev => prev + 1)
  }

  const handlePrevSubStep = () => {
    if (subStep === 0) {
      onClose()
    } else {
      setSubStep(prev => prev - 1)
    }
  }

  // Categories helper for render
  const renderCuisineCategory = (cat: any) => {
    const selectedList = selections[cat.id] ?? []
    const limitReached = cat.limit ? selectedList.length >= cat.limit : false

    return (
      <div key={cat.id} className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-3.5 shadow-sm">
        <div className="flex justify-between items-center border-b border-[#F0EDE9] pb-2.5">
          <h4 className="text-xs font-bold text-[#1A1A1A] flex items-center gap-2">
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </h4>
          <span className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full border",
            cat.limit 
              ? (limitReached ? "bg-green-50 text-green-700 border-green-200" : "bg-[#F5EDD6] text-[#A08040] border-[#E8D9A8]")
              : "bg-gray-50 text-gray-600 border-gray-200"
          )}>
            {cat.limit ? `Selected: ${selectedList.length} of ${cat.limit}` : 'Assorted (Unlimited)'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
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
                  onChange={() => handleItemToggle(cat.id, item.name, cat.limit)}
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1a1a1a]/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-5xl bg-[#FCFAF6] rounded-3xl overflow-hidden shadow-3d border border-[#E8D9A8] flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EEEAE4] bg-gradient-to-r from-[#FDFCFA] to-[#FAF6EE] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] flex items-center justify-center text-[#A08040]">
              <UtensilsCrossed size={16} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#C5A85C] font-bold">
                Cuisine Customizer · {meal === 'lunch' ? 'Lunch' : 'Dinner'}
              </p>
              <h3 className="text-base font-serif font-semibold text-[#1A1A1A]">
                {currentPkg ? currentPkg.name : 'Select Package'}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-[#EEEAE4] text-[#737373] hover:text-[#1A1A1A] hover:border-[#C5A85C] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Sub-step Indicator */}
        <div className="px-6 py-2.5 border-b border-[#EEEAE4] bg-white flex justify-center gap-6 text-[10px] font-bold text-[#A8A8A8] uppercase tracking-wider">
          <span className={cn(subStep === 0 && "text-[#C5A85C]")}>1. Package</span>
          <span>&rarr;</span>
          <span className={cn(subStep === 1 && "text-[#C5A85C]")}>2. Customisation</span>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">

          {/* SUB-STEP 0: PACKAGE SELECTION */}
          {subStep === 0 && (
            <div className="space-y-4">
              <div className="mb-2">
                <h4 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">Available Packages ({mealType === 'veg' ? 'Veg Only' : 'Non-Veg'})</h4>
                <p className="text-xs text-[#737373] mt-0.5">Please choose the menu tier package for {guestCount} guests.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {packages.map(pkg => {
                  const isSelected = selectedPkgId === pkg.id
                  // Strip the pricing prefix from tagline if exists
                  const cleanTagline = pkg.tagline.replace(/^₹.*?\s·\s/, '')

                  return (
                    <Card
                      key={pkg.id}
                      onClick={() => handlePkgChange(pkg.id)}
                      className={cn(
                        "cursor-pointer p-5 flex flex-col justify-between border-2 transition-all duration-300 relative overflow-hidden select-none",
                        isSelected ? "border-[#C5A85C] bg-white shadow-lg" : "border-[#E8E2D8] bg-white hover:border-[#C5A85C]/60"
                      )}
                    >
                      {isSelected && (
                        <div className="absolute top-0 right-0 bg-[#C5A85C] text-white p-1 rounded-bl-xl">
                          <Check size={14} />
                        </div>
                      )}
                      <div>
                        <h5 className="text-base font-serif font-semibold text-[#1A1A1A] mb-1">{pkg.name}</h5>
                        <p className="text-[11px] text-[#737373] mb-3">{cleanTagline}</p>
                        <div className="border-t border-[#F0EDE9] pt-3 mb-3">
                          <ul className="text-[11px] text-[#555] space-y-1">
                            {pkg.categories.slice(0, 4).map(cat => (
                              <li key={cat.id} className="flex items-center gap-1.5">
                                <span className="text-[#C5A85C]">•</span>
                                <span>{cat.label} {cat.limit ? `(Choose ${cat.limit})` : ''}</span>
                              </li>
                            ))}
                            {pkg.categories.length > 4 && (
                              <li className="text-[#A8A8A8] italic">+ {pkg.categories.length - 4} more</li>
                            )}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-2 pt-3 border-t border-[#F0EDE9] flex justify-between items-center">
                        <span className="text-[11px] font-semibold text-[#A8A8A8] uppercase tracking-wider">Premium Dining</span>
                        <Button variant={isSelected ? "gold" : "secondary"} size="sm">
                          {isSelected ? "Selected" : "Select"}
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* SUB-STEP 1: MENU CUSTOMISATION */}
          {subStep === 1 && currentPkg && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#E8D9A8] bg-[#FDFAF3] px-4 py-3 flex items-start gap-3 text-xs text-[#907030]">
                <Info size={16} className="shrink-0 text-[#C5A85C] mt-0.5" />
                <p>
                  Tick checkboxes to select dishes. Category limits are enforced automatically based on the package specifications.
                </p>
              </div>

              {currentPkg.categories.map(cat => renderCuisineCategory(cat))}

              {/* Live Stations */}
              {currentPkg.liveStations.length > 0 && (
                <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-3.5 shadow-xs">
                  <div className="border-b border-[#F0EDE9] pb-2.5">
                    <h4 className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">🔥 Included Live Stations</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {currentPkg.liveStations.map(station => {
                      const isChecked = liveStations.includes(station.label)
                      return (
                        <div
                          key={station.id}
                          onClick={() => handleLiveStationToggle(station.label)}
                          className={cn(
                            "p-3.5 rounded-xl border text-xs cursor-pointer transition-all duration-200 select-none",
                            isChecked ? "bg-[#C5A85C]/15 border-[#C5A85C] text-[#1A1A1A]" : "bg-white border-[#E8E2D8] text-gray-400"
                          )}
                        >
                          <div className="flex justify-between items-center mb-1.5">
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

              {/* Add-ons */}
              {currentPkg.addOns.length > 0 && (
                <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-3.5 shadow-xs">
                  <div className="border-b border-[#F0EDE9] pb-2.5">
                    <h4 className="text-xs font-bold text-[#1A1A1A]">✨ Menu Add-ons</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {currentPkg.addOns.map(addOn => {
                      const isChecked = addOns.includes(addOn)
                      return (
                        <label
                          key={addOn}
                          className={cn(
                            "flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all duration-200 select-none",
                            isChecked ? "bg-[#C5A85C]/10 border-[#C5A85C] text-[#1A1A1A]" : "bg-white border-[#E8E2D8] text-[#555] hover:border-[#C5A85C]/60"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleAddOnToggle(addOn)}
                            className="border-[#E8E2D8] rounded text-[#C5A85C] focus:ring-[#C5A85C]"
                          />
                          {addOn}
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-[#EEEAE4] bg-[#FDFCFA] flex justify-between">
          <Button variant="secondary" size="md" onClick={handlePrevSubStep}>
            <ChevronLeft size={14} className="mr-1" /> {subStep === 0 ? 'Close' : 'Back'}
          </Button>

          {subStep === 0 ? (
            <Button
              size="md"
              onClick={handleNextSubStep}
              disabled={!selectedPkgId}
            >
              Next <ChevronRight size={14} className="ml-1" />
            </Button>
          ) : (
            <Button
              size="md"
              variant="gold"
              onClick={handleConfirm}
              className="flex items-center gap-1 shadow-xs"
            >
              <Check size={14} /> Done
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
