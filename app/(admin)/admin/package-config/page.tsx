'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2, Check, Sliders, Layers } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface PkgCategory {
  package_id: string
  category_id: string
  limit_count: number
}

interface BanquetPkg {
  id: string
  name: string
  meal_type: 'veg' | 'non-veg'
}

interface Category {
  id: string
  label: string
  emoji: string
}

export default function AdminPackageConfigPage() {
  const [pkgCats, setPkgCats] = useState<PkgCategory[]>([])
  const [packages, setPackages] = useState<BanquetPkg[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [resConfig, resPkgs, resCats] = await Promise.all([
        fetch('/api/admin/package-config'),
        fetch('/api/admin/banquet-packages'),
        fetch('/api/admin/menu-categories'),
      ])
      const dataConfig = await resConfig.json()
      const dataPkgs = await resPkgs.json()
      const dataCats = await resCats.json()

      setPkgCats(dataConfig.pkgCats ?? [])
      setPackages(Array.isArray(dataPkgs) ? dataPkgs : [])
      setCategories(Array.isArray(dataCats) ? dataCats : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function updateLimit(package_id: string, category_id: string, limit_count: number) {
    const key = `${package_id}-${category_id}`
    setSaving(key)
    try {
      await fetch('/api/admin/package-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package_id, category_id, limit_count })
      })
      setPkgCats(prev => {
        const copy = [...prev]
        const idx = copy.findIndex(x => x.package_id === package_id && x.category_id === category_id)
        if (idx !== -1) copy[idx] = { ...copy[idx], limit_count }
        else copy.push({ package_id, category_id, limit_count })
        return copy
      })
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption text-[#C9A84C] mb-1">Configuration</p>
        <h1 className="text-headline">Package Limits &amp; Add-ons Config</h1>
        <p className="mt-1 text-sm text-[#737373]">
          Configure dish limits (e.g. maximum selectable starters or main courses) for each banquet package tier.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#C5A85C]" /></div>
      ) : (
        <div className="space-y-8">
          {packages.map(pkg => {
            return (
              <div key={pkg.id} className="rounded-2xl border border-[#E8E2D8] bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#F0EDE9] pb-3">
                  <div className="flex items-center gap-2">
                    <Layers size={18} className="text-[#C5A85C]" />
                    <h2 className="font-semibold text-[#1A1A1A]">{pkg.name}</h2>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${pkg.meal_type === 'veg' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {pkg.meal_type}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categories.map(cat => {
                    const row = pkgCats.find(x => x.package_id === pkg.id && x.category_id === cat.id)
                    const limitVal = row?.limit_count ?? 0
                    const key = `${pkg.id}-${cat.id}`
                    const isSaving = saving === key

                    return (
                      <div key={cat.id} className="p-3.5 rounded-xl border border-[#EEEAE4] bg-[#FDFCFA] flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#1A1A1A] truncate">
                            {cat.emoji} {cat.label}
                          </p>
                          <p className="text-[10px] text-[#A8A8A8]">Max Choice Limit</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <input
                            type="number"
                            min={0}
                            className="w-14 border border-[#E8E2D8] rounded-lg px-2 py-1 text-xs text-center font-bold bg-white"
                            defaultValue={limitVal}
                            onBlur={(e) => updateLimit(pkg.id, cat.id, Number(e.target.value))}
                          />
                          {isSaving && <Loader2 size={12} className="animate-spin text-[#C5A85C]" />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
