'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2, Pencil, Check, X, ToggleLeft, ToggleRight, IndianRupee } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

interface BanquetPackage {
  id: string
  name: string
  meal_type: 'veg' | 'non-veg'
  price_per_head: number
  tagline: string
  is_active: boolean
  sort_order: number
}

function PackageRow({ pkg, onSave }: { pkg: BanquetPackage; onSave: (p: BanquetPackage) => void }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(pkg.name)
  const [price, setPrice] = useState(String(pkg.price_per_head))
  const [tagline, setTagline] = useState(pkg.tagline)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    const updated = { ...pkg, name, price_per_head: Number(price), tagline }
    await fetch('/api/admin/banquet-packages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    onSave(updated)
    setEditing(false)
    setSaving(false)
  }

  async function toggleActive() {
    const updated = { ...pkg, is_active: !pkg.is_active }
    await fetch('/api/admin/banquet-packages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    onSave(updated)
  }

  const mealBadge = pkg.meal_type === 'veg'
    ? 'bg-green-50 text-green-700 border-green-200'
    : 'bg-red-50 text-red-700 border-red-200'

  return (
    <div className={`rounded-2xl border ${pkg.is_active ? 'border-[#E8E2D8] bg-white' : 'border-[#E8E2D8] bg-[#FAFAFA] opacity-60'} overflow-hidden shadow-sm transition-all`}>
      {editing ? (
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor={`name-${pkg.id}`}>Package Name</Label>
              <Input id={`name-${pkg.id}`} value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`price-${pkg.id}`} required>Price Per Head (₹)</Label>
              <div className="relative">
                <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A8A8]" />
                <Input id={`price-${pkg.id}`} type="number" value={price} onChange={e => setPrice(e.target.value)} className="pl-8" />
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`tagline-${pkg.id}`}>Tagline</Label>
            <Input id={`tagline-${pkg.id}`} value={tagline} onChange={e => setTagline(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} loading={saving} size="sm">
              <Check size={14} className="mr-1.5" /> Save
            </Button>
            <Button onClick={() => { setEditing(false); setName(pkg.name); setPrice(String(pkg.price_per_head)); setTagline(pkg.tagline) }} variant="secondary" size="sm">
              <X size={14} className="mr-1" /> Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-5 flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-[#1A1A1A] text-sm">{pkg.name}</h3>
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${mealBadge}`}>
                {pkg.meal_type}
              </span>
            </div>
            <p className="text-xs text-[#737373] mb-2">{pkg.tagline}</p>
            <div className="flex items-center gap-1.5">
              <IndianRupee size={13} className="text-[#C5A85C]" />
              <span className="text-lg font-bold text-[#1A1A1A]">{pkg.price_per_head.toLocaleString('en-IN')}</span>
              <span className="text-xs text-[#A8A8A8]">per head</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-[#F5EDD6] text-[#737373] hover:text-[#C5A85C] transition-all" title="Edit">
              <Pencil size={14} />
            </button>
            <button onClick={toggleActive} className="p-1.5 rounded-lg hover:bg-[#F5EDD6] text-[#737373] hover:text-[#C5A85C] transition-all" title={pkg.is_active ? 'Deactivate' : 'Activate'}>
              {pkg.is_active ? <ToggleRight size={18} className="text-[#C5A85C]" /> : <ToggleLeft size={18} />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<BanquetPackage[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/banquet-packages')
    const data = await res.json()
    setPackages(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function handleSave(updated: BanquetPackage) {
    setPackages(prev => prev.map(p => p.id === updated.id ? updated : p))
  }

  const vegPkgs = packages.filter(p => p.meal_type === 'veg')
  const nonVegPkgs = packages.filter(p => p.meal_type === 'non-veg')

  return (
    <div className="space-y-8">
      <div>
        <p className="text-caption text-[#C9A84C] mb-2">Configuration</p>
        <h1 className="text-headline">Packages & Pricing</h1>
        <p className="mt-2 text-sm text-[#737373]">
          Manage banquet package names, per-head prices, and taglines. Changes are reflected immediately in the booking wizard final estimate.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#C5A85C]" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Vegetarian */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <h2 className="font-semibold text-[#1A1A1A]">Vegetarian Packages</h2>
            </div>
            <div className="space-y-4">
              {vegPkgs.map(pkg => (
                <PackageRow key={pkg.id} pkg={pkg} onSave={handleSave} />
              ))}
            </div>
          </div>

          {/* Non-Vegetarian */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <h2 className="font-semibold text-[#1A1A1A]">Non-Vegetarian Packages</h2>
            </div>
            <div className="space-y-4">
              {nonVegPkgs.map(pkg => (
                <PackageRow key={pkg.id} pkg={pkg} onSave={handleSave} />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="p-4 bg-[#FFFDF5] border border-[#E8D9A8] rounded-xl text-xs text-[#737373]">
        <strong className="text-[#A08040]">Note:</strong> The price-per-head shown here is used exclusively for the final booking estimate calculation. It is <strong>never</strong> displayed to customers during the booking form. Customers only see the final total at the very end.
      </div>
    </div>
  )
}
