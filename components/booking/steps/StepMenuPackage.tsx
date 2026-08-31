import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UtensilsCrossed, Check, ChevronRight, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils/cn'
import { MenuConfig, BanquetPackage } from '@/lib/menu'

interface Props {
  meal: 'lunch' | 'dinner'
  mealType: 'veg' | 'non-veg'
  guestCount: number
  initialConfig: MenuConfig | undefined
  onSave: (config: MenuConfig) => void
  onClose: () => void
}

export function StepMenuPackage({ meal, mealType, initialConfig, onSave, onClose }: Props) {
  const [view, setView] = useState<'packages' | 'details'>('packages')
  const [selectedPkgId, setSelectedPkgId] = useState<string>(initialConfig?.packageId || '')
  
  const [packages, setPackages] = useState<BanquetPackage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/config/banquet-packages')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const filtered = data.filter((p: any) => p.mealType === mealType)
          setPackages(filtered)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load packages:', err)
        setLoading(false)
      })
  }, [mealType])

  const currentPkg = packages.find(p => p.id === selectedPkgId)

  function handleSelectPackage(pkgId: string) {
    setSelectedPkgId(pkgId)
  }

  function handleConfirmPackage() {
    if (!currentPkg) return
    onSave({
      packageId: currentPkg.id,
      packageName: currentPkg.name,
      pricePerHead: currentPkg.pricePerHead,
      mealType,
      selections: currentPkg.categories.map(cat => ({
        categoryId: cat.id,
        items: cat.items.map(item => item.name),
      })),
      liveStations: currentPkg.liveStations.map(s => s.label),
      addOns: [],
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1a1a1a]/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-4xl bg-[#FCFAF6] rounded-3xl overflow-hidden shadow-3d border border-[#E8D9A8] flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EEEAE4] bg-gradient-to-r from-[#FDFCFA] to-[#FAF6EE] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] flex items-center justify-center text-[#A08040]">
              <UtensilsCrossed size={16} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#C5A85C] font-bold">
                {meal === 'lunch' ? 'Lunch' : 'Dinner'} Menu · {mealType === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
              </p>
              <h3 className="text-base font-serif font-semibold text-[#1A1A1A]">
                {view === 'packages'
                  ? 'Select Package'
                  : currentPkg?.name ?? 'Package Details'}
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

        {/* Scrollable Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <Loader2 className="animate-spin text-[#C5A85C]" size={32} />
              <p className="text-xs text-[#737373]">Loading packages...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* ── PACKAGE SELECTION ── */}
              {view === 'packages' && (
                <motion.div
                  key="packages"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="space-y-5"
                >
                  <div>
                    <h4 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">
                      Available Packages
                    </h4>
                    <p className="text-xs text-[#737373]">
                      Select a package to view its inclusions.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {packages.map(pkg => {
                      const isSelected = selectedPkgId === pkg.id
                      // Strip price prefix from tagline
                      const cleanTagline = pkg.tagline.replace(/^₹[\d,]+\s*(?:per head)?\s*·?\s*/i, '')

                      return (
                        <Card
                          key={pkg.id}
                          onClick={() => handleSelectPackage(pkg.id)}
                          className={cn(
                            'p-5 border cursor-pointer transition-all duration-300 rounded-2xl flex flex-col justify-between min-h-[160px] relative overflow-hidden select-none',
                            isSelected
                              ? 'border-[#C5A85C] bg-[#FFFDF7] shadow-md ring-1 ring-[#C5A85C]/20'
                              : 'border-[#E8E2D8] bg-white hover:border-[#C5A85C]/50 hover:shadow-sm'
                          )}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <h5 className="font-serif font-semibold text-sm text-[#1A1A1A]">
                                {pkg.name}
                              </h5>
                              {isSelected && (
                                <span className="w-5 h-5 rounded-full bg-[#C5A85C] flex items-center justify-center text-white text-[10px]">
                                  ✓
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#737373] leading-relaxed">
                              {cleanTagline}
                            </p>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── INCLUSIONS DETAIL ── */}
              {view === 'details' && currentPkg && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between gap-4 border-b border-[#EEEAE4] pb-4">
                    <div>
                      <h4 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">
                        Inclusions
                      </h4>
                      <p className="text-xs text-[#737373]">
                        These items are included in your package by default.
                      </p>
                    </div>
                  </div>

                  {currentPkg.categories.map(cat => (
                    <div
                      key={cat.id}
                      className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-[#F0EDE9] pb-2.5">
                        <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
                          <span>{cat.emoji}</span> {cat.label}
                        </span>
                        {cat.limit !== undefined && (
                          <span className="px-2 py-0.5 bg-[#F5EDD6] border border-[#E8D9A8] text-[10px] text-[#A08040] rounded-md font-bold uppercase tracking-wider">
                            Choose up to {cat.limit}
                          </span>
                        )}
                      </div>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                        {cat.items.map((item, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-[#555] flex items-start gap-1.5"
                          >
                            <span className="text-[#C5A85C] mt-0.5 shrink-0">•</span>
                            <span>
                              {item.name}
                              {item.subLabel && (
                                <span className="ml-1 text-[10px] text-[#A8A8A8] italic">
                                  ({item.subLabel})
                                </span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {currentPkg.liveStations.length > 0 && (
                    <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-3">
                      <h4 className="text-xs font-bold text-[#1A1A1A] border-b border-[#F0EDE9] pb-2.5">🔥 Live Stations</h4>
                      <ul className="space-y-1.5">
                        {currentPkg.liveStations.map(s => (
                          <li key={s.id} className="text-xs text-[#555] flex items-start gap-2">
                            <span className="text-[#C5A85C] mt-0.5 shrink-0">•</span>
                            <span>{s.label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#EEEAE4] bg-[#FDFCFA] flex justify-between items-center">
          {view === 'packages' ? (
            <>
              <Button variant="secondary" size="md" onClick={onClose}>Close</Button>
              <div className="flex gap-2">
                {selectedPkgId && (
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setView('details')}
                  >
                    View Inclusions <ChevronRight size={14} className="ml-1" />
                  </Button>
                )}
                <Button
                  size="md"
                  variant="gold"
                  disabled={!selectedPkgId}
                  onClick={handleConfirmPackage}
                >
                  <Check size={14} className="mr-1" /> Confirm Package
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button variant="secondary" size="md" onClick={() => setView('packages')}>
                ← Back to Packages
              </Button>
              <Button
                size="md"
                variant="gold"
                onClick={handleConfirmPackage}
              >
                <Check size={14} className="mr-1" /> Confirm Package
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
