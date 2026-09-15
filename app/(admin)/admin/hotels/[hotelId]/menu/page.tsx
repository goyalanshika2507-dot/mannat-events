'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Loader2, Check, Sliders, Search, Plus, Pencil, Trash2, X,
  IndianRupee, ChevronLeft, ToggleRight, ToggleLeft, ArrowUpDown
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

interface BanquetPkg {
  id: string
  name: string
  meal_type: 'veg' | 'non-veg'
  price_per_head: number
  tagline?: string
  is_active: boolean
  hotel_id: string
}

interface Category {
  id: string
  label: string
  emoji: string
}

interface MenuItem {
  id: string
  name: string
  type: 'veg' | 'non-veg'
  price?: number
  sub_label?: string | null
}

interface PkgItem {
  package_id: string
  category_id: string
  item_id: string
  price?: number
  hotel_id: string
}

interface PkgCategory {
  package_id: string
  category_id: string
  limit_count: number
  hotel_id: string
}

export default function HotelMenuPage() {
  const params = useParams<{ hotelId: string }>()
  const hotelId = params.hotelId

  const [packages, setPackages] = useState<BanquetPkg[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [allItems, setAllItems] = useState<MenuItem[]>([])
  const [pkgItems, setPkgItems] = useState<PkgItem[]>([])
  const [pkgCats, setPkgCats] = useState<PkgCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [hotelName, setHotelName] = useState('')

  // Selected package
  const [selectedPkgId, setSelectedPkgId] = useState('')
  // Search/filter
  const [dishSearch, setDishSearch] = useState('')
  const [dishCatFilter, setDishCatFilter] = useState('all')

  // Add dish modal
  const [addMode, setAddMode] = useState<'existing' | 'new'>('existing')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selCatId, setSelCatId] = useState('')
  const [selItemId, setSelItemId] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')
  const [newDishName, setNewDishName] = useState('')
  const [newDishType, setNewDishType] = useState<'veg' | 'non-veg'>('veg')
  const [newDishSubLabel, setNewDishSubLabel] = useState('')

  // Edit dish
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  // Edit package price
  const [editingPkgPrice, setEditingPkgPrice] = useState<string | null>(null)
  const [pkgPriceInput, setPkgPriceInput] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [resMenu, resHotels] = await Promise.all([
        fetch(`/api/admin/hotels/${hotelId}/menu`),
        fetch('/api/admin/hotels'),
      ])
      const menuData = await resMenu.json()
      const hotels = await resHotels.json()

      const hotel = (hotels || []).find((h: any) => h.id === hotelId)
      setHotelName(hotel?.name || hotelId)

      setPackages(menuData.packages ?? [])
      setPkgCats(menuData.pkgCats ?? [])
      setPkgItems(menuData.pkgItems ?? [])
      setCategories(menuData.categories ?? [])
      setAllItems(menuData.allItems ?? [])

      if ((menuData.packages ?? []).length > 0 && !selectedPkgId) {
        setSelectedPkgId(menuData.packages[0].id)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [hotelId, selectedPkgId])

  useEffect(() => { load() }, [load])

  async function updatePackagePrice(pkgId: string, price: number) {
    setSaving(`pkg-price-${pkgId}`)
    try {
      await fetch(`/api/admin/hotels/${hotelId}/packages`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pkgId, price_per_head: price })
      })
      setPackages(prev => prev.map(p => p.id === pkgId ? { ...p, price_per_head: price } : p))
      setEditingPkgPrice(null)
    } finally {
      setSaving(null)
    }
  }

  async function togglePackageActive(pkg: BanquetPkg) {
    setSaving(`pkg-active-${pkg.id}`)
    try {
      await fetch(`/api/admin/hotels/${hotelId}/packages`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pkg.id, is_active: !pkg.is_active })
      })
      setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, is_active: !p.is_active } : p))
    } finally {
      setSaving(null)
    }
  }

  async function updateCategoryLimit(package_id: string, category_id: string, limit_count: number) {
    setSaving(`cat-${package_id}-${category_id}`)
    try {
      await fetch(`/api/admin/hotels/${hotelId}/menu`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package_id, category_id, limit_count })
      })
      setPkgCats(prev => {
        const copy = [...prev]
        const idx = copy.findIndex(x => x.package_id === package_id && x.category_id === category_id)
        if (idx !== -1) copy[idx] = { ...copy[idx], limit_count }
        else copy.push({ hotel_id: hotelId, package_id, category_id, limit_count })
        return copy
      })
    } finally {
      setSaving(null)
    }
  }

  async function updateDishPrice(package_id: string, category_id: string, item_id: string, price: number) {
    setSaving(`dish-${package_id}-${item_id}`)
    try {
      await fetch(`/api/admin/hotels/${hotelId}/menu`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package_id, category_id, item_id, price })
      })
      setPkgItems(prev => prev.map(pi =>
        pi.package_id === package_id && pi.item_id === item_id ? { ...pi, price } : pi
      ))
    } finally {
      setSaving(null)
    }
  }

  async function handleAddDish() {
    if (!selectedPkgId || !selCatId) return
    setSaving('add-dish')
    try {
      let targetItemId = selItemId
      const priceVal = Number(newItemPrice) || 0

      if (addMode === 'new') {
        if (!newDishName.trim()) return
        const res = await fetch('/api/admin/menu-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newDishName.trim(), type: newDishType, sub_label: newDishSubLabel || null, price: priceVal })
        })
        const created = await res.json()
        targetItemId = created.id
        setAllItems(prev => [...prev, created])
      }

      if (!targetItemId) return

      await fetch(`/api/admin/hotels/${hotelId}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package_id: selectedPkgId, category_id: selCatId, item_id: targetItemId, price: priceVal })
      })
      setPkgItems(prev => [
        ...prev.filter(pi => !(pi.package_id === selectedPkgId && pi.item_id === targetItemId)),
        { hotel_id: hotelId, package_id: selectedPkgId, category_id: selCatId, item_id: targetItemId, price: priceVal }
      ])

      setShowAddModal(false)
      setSelCatId('')
      setSelItemId('')
      setNewItemPrice('')
      setNewDishName('')
      setNewDishSubLabel('')
    } finally {
      setSaving(null)
    }
  }

  async function handleRemoveDish(package_id: string, category_id: string, item_id: string) {
    if (!confirm('Remove this dish from the package?')) return
    setSaving(`del-${package_id}-${item_id}`)
    try {
      await fetch(`/api/admin/hotels/${hotelId}/menu`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package_id, category_id, item_id })
      })
      setPkgItems(prev => prev.filter(pi => !(pi.package_id === package_id && pi.category_id === category_id && pi.item_id === item_id)))
    } finally {
      setSaving(null)
    }
  }

  async function handleSaveEditItem() {
    if (!editingItem) return
    setSaving('edit-item')
    try {
      await fetch('/api/admin/menu-items', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      })
      setAllItems(prev => prev.map(i => i.id === editingItem.id ? editingItem : i))
      setEditingItem(null)
    } finally {
      setSaving(null)
    }
  }

  const selectedPkg = packages.find(p => p.id === selectedPkgId)
  const thisPkgItems = pkgItems.filter(pi => pi.package_id === selectedPkgId)

  // Dishes in selected package, enriched
  const enrichedDishes = thisPkgItems.map(pi => {
    const itemDef = allItems.find(i => i.id === pi.item_id)
    if (!itemDef) return null
    const cat = categories.find(c => c.id === pi.category_id)
    return { ...pi, itemDef, catLabel: cat?.label || pi.category_id, catEmoji: cat?.emoji || '🍽️' }
  }).filter(Boolean) as any[]

  const filteredDishes = enrichedDishes.filter(d => {
    const matchSearch = !dishSearch || d.itemDef.name.toLowerCase().includes(dishSearch.toLowerCase())
    const matchCat = dishCatFilter === 'all' || d.category_id === dishCatFilter
    return matchSearch && matchCat
  })

  // Categories assigned to selected package
  const thisPkgCats = pkgCats.filter(pc => pc.package_id === selectedPkgId)

  // Dishes not yet in this package
  const existingItemIds = new Set(thisPkgItems.map(pi => pi.item_id))
  const availableToAdd = allItems.filter(i => !existingItemIds.has(i.id))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <Link
          href="/admin/hotels"
          className="flex items-center gap-1.5 text-xs text-[#C5A85C] hover:text-white transition-colors"
        >
          <ChevronLeft size={14} /> Back to Hotels
        </Link>
        <div className="flex-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#C5A85C]">Hotel Management</p>
          <h1 className="text-xl font-serif font-bold text-white">{hotelName}</h1>
          <p className="text-xs text-[#737373] mt-0.5">Menu & Package Configuration</p>
        </div>
        <Link href={`/admin/hotels/${hotelId}/decor`}>
          <Button variant="secondary" size="sm">
            Manage Decoration →
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#C5A85C]" /></div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-6">
          {/* LEFT — Package List */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C5A85C]">Packages</p>
            {packages.map(pkg => {
              const isEditing = editingPkgPrice === pkg.id
              return (
                <div
                  key={`${pkg.id}-${pkg.hotel_id}`}
                  onClick={() => { if (!isEditing) setSelectedPkgId(pkg.id) }}
                  className={`rounded-xl border p-3.5 cursor-pointer transition-all ${
                    selectedPkgId === pkg.id
                      ? 'border-[#C5A85C]/60 bg-[#C5A85C]/8 shadow-sm'
                      : 'border-[#2A2A2E] bg-[#141418] hover:border-[#C5A85C]/30'
                  } ${!pkg.is_active ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{pkg.name}</p>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                        pkg.meal_type === 'veg'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {pkg.meal_type}
                      </span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); togglePackageActive(pkg) }}
                      className="shrink-0 text-[#737373] hover:text-[#C5A85C] transition-colors"
                    >
                      {pkg.is_active
                        ? <ToggleRight size={20} className="text-[#C5A85C]" />
                        : <ToggleLeft size={20} />
                      }
                    </button>
                  </div>

                  {/* Price editing */}
                  {isEditing ? (
                    <div className="mt-2 flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <div className="relative flex-1">
                        <IndianRupee size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#C5A85C]" />
                        <input
                          type="number"
                          value={pkgPriceInput}
                          onChange={e => setPkgPriceInput(e.target.value)}
                          className="w-full pl-6 pr-2 py-1 text-xs bg-[#1A1A1E] border border-[#C5A85C]/40 rounded-lg text-white focus:outline-none"
                          autoFocus
                        />
                      </div>
                      <button
                        onClick={() => updatePackagePrice(pkg.id, Number(pkgPriceInput))}
                        className="p-1.5 rounded-lg bg-[#C5A85C]/20 text-[#C5A85C] hover:bg-[#C5A85C]/30"
                      >
                        <Check size={12} />
                      </button>
                      <button
                        onClick={() => setEditingPkgPrice(null)}
                        className="p-1.5 rounded-lg bg-[#27272A] text-[#737373] hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <IndianRupee size={11} className="text-[#C5A85C]" />
                        <span className="text-sm font-bold text-white">
                          {pkg.price_per_head.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-[#737373]">/head</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingPkgPrice(pkg.id)
                          setPkgPriceInput(String(pkg.price_per_head))
                        }}
                        className="p-1 rounded-lg text-[#737373] hover:text-[#C5A85C] transition-colors"
                      >
                        <Pencil size={11} />
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* RIGHT — Package Details */}
          <div className="space-y-5">
            {selectedPkg ? (
              <>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h2 className="text-base font-bold text-white">{selectedPkg.name}</h2>
                    <p className="text-xs text-[#737373]">
                      ₹{selectedPkg.price_per_head.toLocaleString('en-IN')}/head ·{' '}
                      {thisPkgItems.length} dishes assigned
                    </p>
                  </div>
                  <Button size="sm" onClick={() => setShowAddModal(true)}>
                    <Plus size={14} className="mr-1.5" /> Add Dish
                  </Button>
                </div>

                {/* Category Limits */}
                {thisPkgCats.length > 0 && (
                  <div className="rounded-xl border border-[#2A2A2E] bg-[#141418] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#C5A85C] mb-3">
                      <Sliders size={11} className="inline mr-1.5" />Category Limits
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {thisPkgCats.map(pc => {
                        const cat = categories.find(c => c.id === pc.category_id)
                        const limitKey = `cat-${pc.package_id}-${pc.category_id}`
                        return (
                          <div key={`${pc.package_id}-${pc.category_id}`} className="flex items-center gap-2 bg-[#1A1A1E] border border-[#27272A] rounded-lg px-3 py-2">
                            <span className="text-xs">{cat?.emoji}</span>
                            <span className="text-[10px] text-[#D4D4D8] truncate flex-1">{cat?.label || pc.category_id}</span>
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                defaultValue={pc.limit_count}
                                onBlur={e => updateCategoryLimit(pc.package_id, pc.category_id, Number(e.target.value))}
                                className="w-10 text-center text-xs bg-[#27272A] border border-[#3A3A3E] rounded px-1 py-0.5 text-white focus:outline-none focus:border-[#C5A85C]/40"
                              />
                              {saving === limitKey && <Loader2 size={10} className="animate-spin text-[#C5A85C]" />}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Dish Search & Filter */}
                <div className="flex gap-2 flex-wrap">
                  <div className="relative flex-1 min-w-[160px]">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
                    <Input
                      placeholder="Search dishes..."
                      value={dishSearch}
                      onChange={e => setDishSearch(e.target.value)}
                      className="pl-8 text-xs py-2"
                    />
                  </div>
                  <select
                    value={dishCatFilter}
                    onChange={e => setDishCatFilter(e.target.value)}
                    className="text-xs bg-[#141418] border border-[#2A2A2E] rounded-xl px-3 py-2 text-[#D4D4D8] focus:outline-none focus:border-[#C5A85C]/40"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
                  </select>
                </div>

                {/* Dish List */}
                {filteredDishes.length === 0 ? (
                  <div className="py-10 text-center text-sm text-[#737373]">
                    No dishes assigned to this package yet.{' '}
                    <button onClick={() => setShowAddModal(true)} className="text-[#C5A85C] hover:underline">Add one.</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredDishes.map((d: any) => {
                      const dishKey = `dish-${d.package_id}-${d.item_id}`
                      return (
                        <div key={`${d.package_id}-${d.category_id}-${d.item_id}`}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#141418] border border-[#2A2A2E] hover:border-[#C5A85C]/20 transition-all"
                        >
                          <span className="text-base shrink-0">{d.catEmoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-xs font-semibold text-white truncate">{d.itemDef.name}</p>
                              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                                d.itemDef.type === 'veg'
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}>{d.itemDef.type}</span>
                            </div>
                            <p className="text-[10px] text-[#737373]">{d.catLabel} {d.itemDef.sub_label ? `· ${d.itemDef.sub_label}` : ''}</p>
                          </div>

                          {/* Dish price (hotel+package specific) */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <IndianRupee size={11} className="text-[#C5A85C]" />
                            <input
                              type="number"
                              defaultValue={d.price ?? 0}
                              onBlur={e => updateDishPrice(d.package_id, d.category_id, d.item_id, Number(e.target.value))}
                              className="w-20 text-xs text-right bg-[#1A1A1E] border border-[#27272A] rounded-lg px-2 py-1 text-white focus:outline-none focus:border-[#C5A85C]/40"
                            />
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => setEditingItem(d.itemDef)}
                              className="p-1.5 rounded-lg text-[#737373] hover:text-[#C5A85C] hover:bg-[#C5A85C]/10 transition-all"
                              title="Edit dish name/label"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={() => handleRemoveDish(d.package_id, d.category_id, d.item_id)}
                              className="p-1.5 rounded-lg text-[#737373] hover:text-red-400 hover:bg-red-500/10 transition-all"
                              title="Remove from package"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                          {saving === dishKey && <Loader2 size={13} className="animate-spin text-[#C5A85C] shrink-0" />}
                        </div>
                      )
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="py-16 text-center text-sm text-[#737373]">Select a package to manage its dishes.</div>
            )}
          </div>
        </div>
      )}

      {/* Add Dish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0D0D0F] border border-[#2A2A2E] rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">Add Dish to {selectedPkg?.name}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#737373] hover:text-white"><X size={16} /></button>
            </div>

            {/* Mode toggle */}
            <div className="flex gap-1 bg-[#1A1A1E] rounded-xl p-1">
              {(['existing', 'new'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setAddMode(m)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    addMode === m
                      ? 'bg-[#C5A85C] text-black'
                      : 'text-[#737373] hover:text-white'
                  }`}
                >
                  {m === 'existing' ? 'Existing Dish' : 'Create New Dish'}
                </button>
              ))}
            </div>

            {/* Category selection */}
            <div className="space-y-1">
              <Label>Category</Label>
              <select
                value={selCatId}
                onChange={e => setSelCatId(e.target.value)}
                className="w-full text-sm bg-[#141418] border border-[#2A2A2E] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#C5A85C]/40"
              >
                <option value="">Select category…</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
            </div>

            {addMode === 'existing' ? (
              <div className="space-y-1">
                <Label>Dish</Label>
                <select
                  value={selItemId}
                  onChange={e => setSelItemId(e.target.value)}
                  className="w-full text-sm bg-[#141418] border border-[#2A2A2E] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#C5A85C]/40"
                >
                  <option value="">Select dish…</option>
                  {availableToAdd.map(i => (
                    <option key={i.id} value={i.id}>{i.name} ({i.type})</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label required>Dish Name</Label>
                  <Input value={newDishName} onChange={e => setNewDishName(e.target.value)} placeholder="e.g. Paneer Tikka" />
                </div>
                <div className="space-y-1">
                  <Label>Sub Label</Label>
                  <Input value={newDishSubLabel} onChange={e => setNewDishSubLabel(e.target.value)} placeholder="e.g. Punjabi Style" />
                </div>
                <div className="space-y-1">
                  <Label>Type</Label>
                  <select
                    value={newDishType}
                    onChange={e => setNewDishType(e.target.value as 'veg' | 'non-veg')}
                    className="w-full text-sm bg-[#141418] border border-[#2A2A2E] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#C5A85C]/40"
                  >
                    <option value="veg">Veg</option>
                    <option value="non-veg">Non-Veg</option>
                  </select>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <Label>Package-Specific Price (₹)</Label>
              <div className="relative">
                <IndianRupee size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C5A85C]" />
                <Input
                  type="number"
                  value={newItemPrice}
                  onChange={e => setNewItemPrice(e.target.value)}
                  className="pl-8"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button onClick={handleAddDish} loading={saving === 'add-dish'} className="flex-1">
                <Check size={14} className="mr-1.5" /> Add Dish
              </Button>
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dish Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0D0D0F] border border-[#2A2A2E] rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">Edit Dish</h3>
              <button onClick={() => setEditingItem(null)} className="text-[#737373] hover:text-white"><X size={16} /></button>
            </div>
            <div className="space-y-1">
              <Label required>Name</Label>
              <Input value={editingItem.name} onChange={e => setEditingItem(prev => prev ? { ...prev, name: e.target.value } : null)} />
            </div>
            <div className="space-y-1">
              <Label>Sub Label</Label>
              <Input value={editingItem.sub_label || ''} onChange={e => setEditingItem(prev => prev ? { ...prev, sub_label: e.target.value } : null)} />
            </div>
            <div className="space-y-1">
              <Label>Type</Label>
              <select
                value={editingItem.type}
                onChange={e => setEditingItem(prev => prev ? { ...prev, type: e.target.value as 'veg' | 'non-veg' } : null)}
                className="w-full text-sm bg-[#141418] border border-[#2A2A2E] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#C5A85C]/40"
              >
                <option value="veg">Veg</option>
                <option value="non-veg">Non-Veg</option>
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <Button onClick={handleSaveEditItem} loading={saving === 'edit-item'} className="flex-1">
                <Check size={14} className="mr-1.5" /> Save
              </Button>
              <Button variant="secondary" onClick={() => setEditingItem(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
