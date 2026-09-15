'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2, Check, Sliders, Layers, Search, Plus, Pencil, Trash2, X, FolderTree } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

interface PkgCategory {
  package_id: string
  category_id: string
  limit_count: number
}

interface PkgItem {
  package_id: string
  category_id: string
  item_id: string
  price?: number
}

interface BanquetPkg {
  id: string
  name: string
  meal_type: 'veg' | 'non-veg'
  price_per_head?: number
}

interface Category {
  id: string
  label: string
  emoji: string
  sort_order?: number
}

interface MenuItem {
  id: string
  name: string
  type: 'veg' | 'non-veg'
  price?: number
  sub_label?: string | null
}

export default function AdminPackageConfigPage() {
  const [pkgCats, setPkgCats] = useState<PkgCategory[]>([])
  const [pkgItems, setPkgItems] = useState<PkgItem[]>([])
  const [packages, setPackages] = useState<BanquetPkg[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [allItems, setAllItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  
  // Package search & filters
  const [selectedPkgId, setSelectedPkgId] = useState<string>('')
  const [dishSearch, setDishSearch] = useState<string>('')
  const [dishCatFilter, setDishCatFilter] = useState<string>('all')
  const [dishTypeFilter, setDishTypeFilter] = useState<string>('all')

  // Modal for adding dish to package
  const [addingDishPkgId, setAddingDishPkgId] = useState<string | null>(null)
  const [addMode, setAddMode] = useState<'existing' | 'new'>('existing')
  const [selectedCatId, setSelectedCatId] = useState<string>('')
  const [selectedItemId, setSelectedItemId] = useState<string>('')
  const [newItemPrice, setNewItemPrice] = useState<string>('')
  
  // Brand new dish form fields
  const [newDishName, setNewDishName] = useState('')
  const [newDishType, setNewDishType] = useState<'veg' | 'non-veg'>('veg')
  const [newDishSubLabel, setNewDishSubLabel] = useState('')

  // Modal for Category Management
  const [showCatModal, setShowCatModal] = useState(false)
  const [editingCatId, setEditingCatId] = useState<string | null>(null)
  const [editCatForm, setEditCatForm] = useState<Partial<Category>>({})
  const [newCatForm, setNewCatForm] = useState({ id: '', label: '', emoji: '🍽️', sort_order: 99 })
  const [addingCat, setAddingCat] = useState(false)

  // Edit dish modal / state
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  // This page manages Mannat Events' own packages only (hotel_id is fixed in the DB)
  const selectedHotelId = 'mannat-events'

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [resConfig, resPkgs, resCats, resItems] = await Promise.all([
        fetch('/api/admin/package-config'),
        fetch('/api/admin/banquet-packages'),
        fetch('/api/admin/menu-categories'),
        fetch('/api/admin/menu-items'),
      ])
      const dataConfig = await resConfig.json()
      const dataPkgs = await resPkgs.json()
      const dataCats = await resCats.json()
      const dataItems = await resItems.json()

      const pkgsArr = Array.isArray(dataPkgs) ? dataPkgs : []
      setPkgCats(dataConfig.pkgCats ?? [])
      setPkgItems(dataConfig.pkgItems ?? [])
      setPackages(pkgsArr)
      setCategories(Array.isArray(dataCats) ? dataCats : [])
      setAllItems(Array.isArray(dataItems) ? dataItems : [])

      if (pkgsArr.length > 0 && !selectedPkgId) {
        setSelectedPkgId(pkgsArr[0].id)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [selectedPkgId])

  useEffect(() => { load() }, [load])

  async function updateLimit(package_id: string, category_id: string, limit_count: number) {
    const key = `${package_id}-${category_id}`
    setSaving(key)
    try {
      await fetch('/api/admin/package-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotel_id: selectedHotelId, package_id, category_id, limit_count })
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

  async function updateDishPrice(package_id: string, category_id: string, item_id: string, price: number) {
    const key = `${package_id}-${item_id}`
    setSaving(key)
    try {
      await fetch('/api/admin/package-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotel_id: selectedHotelId, package_id, category_id, item_id, price })
      })
      setPkgItems(prev => prev.map(pi => pi.package_id === package_id && pi.item_id === item_id ? { ...pi, price } : pi))
    } finally {
      setSaving(null)
    }
  }

  async function updatePackagePricePerHead(package_id: string, price_per_head: number) {
    setSaving(`pkg-price-${package_id}`)
    try {
      await fetch('/api/admin/banquet-packages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotel_id: selectedHotelId, id: package_id, price_per_head: Number(price_per_head) })
      })
      setPackages(prev => prev.map(p => p.id === package_id ? { ...p, price_per_head: Number(price_per_head) } : p))
    } finally {
      setSaving(null)
    }
  }

  async function handleAddDishToPackage() {
    if (!addingDishPkgId || !selectedCatId) return
    setSaving('add-dish')
    try {
      let targetItemId = selectedItemId
      const priceVal = Number(newItemPrice) || 0

      // If creating a brand new dish first
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

      await fetch('/api/admin/package-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotel_id: selectedHotelId, package_id: addingDishPkgId, category_id: selectedCatId, item_id: targetItemId, price: priceVal })
      })
      setPkgItems(prev => [...prev.filter(pi => !(pi.package_id === addingDishPkgId && pi.item_id === targetItemId)), { package_id: addingDishPkgId, category_id: selectedCatId, item_id: targetItemId, price: priceVal }])
      setAddingDishPkgId(null)
      setSelectedCatId('')
      setSelectedItemId('')
      setNewItemPrice('')
      setNewDishName('')
      setNewDishSubLabel('')
    } finally {
      setSaving(null)
    }
  }

  async function handleRemoveDishFromPackage(package_id: string, category_id: string, item_id: string) {
    if (!confirm('Remove this dish from the package?')) return
    setSaving(`${package_id}-${item_id}`)
    try {
      await fetch('/api/admin/package-config', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotel_id: selectedHotelId, package_id, category_id, item_id })
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

  // Category management handlers
  async function handleAddCategory() {
    if (!newCatForm.id || !newCatForm.label) return
    setSaving('add-cat')
    try {
      await fetch('/api/admin/menu-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCatForm)
      })
      setCategories(prev => [...prev, newCatForm])
      setNewCatForm({ id: '', label: '', emoji: '🍽️', sort_order: 99 })
      setAddingCat(false)
    } finally {
      setSaving(null)
    }
  }

  async function handleSaveCatEdit(id: string) {
    setSaving(`cat-${id}`)
    try {
      await fetch('/api/admin/menu-categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editCatForm })
      })
      setCategories(prev => prev.map(c => c.id === id ? { ...c, ...editCatForm } : c))
      setEditingCatId(null)
    } finally {
      setSaving(null)
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm(`Delete category "${id}"? Dishes assigned to this category will safely retain their data.`)) return
    setSaving(`cat-del-${id}`)
    try {
      await fetch('/api/admin/menu-categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      setCategories(prev => prev.filter(c => c.id !== id))
    } finally {
      setSaving(null)
    }
  }

  const activePkg = packages.find(p => p.id === selectedPkgId) || packages[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-caption text-[#C9A84C] mb-1">Menu Management</p>
          <h1 className="text-headline">Package &amp; Menu Management</h1>
          <p className="mt-1 text-sm text-[#737373]">
            Single hub to manage dishes, package-specific dish prices, limits, and menu categories.
          </p>
        </div>
        <Button variant="secondary" onClick={() => setShowCatModal(true)}>
          <FolderTree size={16} className="mr-1.5" /> Manage Master Categories
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#C5A85C]" /></div>
      ) : (
        <div className="space-y-6">
          {/* Package Selector Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#E8E2D8]">
            {packages.map(pkg => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPkgId(pkg.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
                  (selectedPkgId || packages[0]?.id) === pkg.id
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-sm'
                    : 'bg-white text-[#737373] border-[#E8E2D8] hover:border-[#C5A85C]'
                }`}
              >
                <span>{pkg.name}</span>
                <span className={`px-1.5 py-0.5 text-[9px] uppercase rounded-full ${
                  pkg.meal_type === 'veg' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {pkg.meal_type}
                </span>
              </button>
            ))}
          </div>

          {activePkg && (
            <div className="rounded-2xl border border-[#E8E2D8] bg-white p-6 shadow-xs space-y-6">
              {/* Active Package Header */}
              <div className="flex items-center justify-between border-b border-[#F0EDE9] pb-4 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F5EDD6] border border-[#E8D9A8] flex items-center justify-center text-[#A08040]">
                    <Layers size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-serif font-bold text-lg text-[#1A1A1A]">{activePkg.name}</h2>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                        activePkg.meal_type === 'veg' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {activePkg.meal_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#737373] mt-0.5">
                      <span>Package Price per head:</span>
                      <span className="font-bold text-[#1A1A1A]">₹</span>
                      <input
                        type="number"
                        className="w-24 border border-[#E8E2D8] rounded-md px-2 py-0.5 text-xs font-bold bg-white text-[#1A1A1A]"
                        defaultValue={activePkg.price_per_head ?? 0}
                        onBlur={(e) => updatePackagePricePerHead(activePkg.id, Number(e.target.value))}
                      />
                      {saving === `pkg-price-${activePkg.id}` && <Loader2 size={12} className="animate-spin text-[#C5A85C]" />}
                    </div>
                  </div>
                </div>

                <Button size="sm" onClick={() => { setAddingDishPkgId(activePkg.id); setSelectedCatId(categories[0]?.id || '') }}>
                  <Plus size={15} className="mr-1" /> Add Dish to {activePkg.name}
                </Button>
              </div>

              {/* Category Choice Limits */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#A08040] mb-3">Category Choice Limits</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {categories.map(cat => {
                    const row = pkgCats.find(x => x.package_id === activePkg.id && x.category_id === cat.id)
                    const limitVal = row?.limit_count ?? 0
                    const key = `${activePkg.id}-${cat.id}`
                    const isSaving = saving === key

                    return (
                      <div key={cat.id} className="p-3 rounded-xl border border-[#EEEAE4] bg-[#FDFCFA] flex items-center justify-between gap-3">
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
                            className="w-12 border border-[#E8E2D8] rounded-lg px-2 py-1 text-xs text-center font-bold bg-white"
                            defaultValue={limitVal}
                            onBlur={(e) => updateLimit(activePkg.id, cat.id, Number(e.target.value))}
                          />
                          {isSaving && <Loader2 size={12} className="animate-spin text-[#C5A85C]" />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Package Dishes Table with Filter */}
              <div>
                <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#A08040]">Dishes Included in {activePkg.name}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A8A8]" />
                      <input
                        value={dishSearch}
                        onChange={e => setDishSearch(e.target.value)}
                        placeholder="Search assigned dishes..."
                        className="pl-8 pr-3 py-1.5 text-xs border border-[#E8E2D8] rounded-xl bg-white w-48"
                      />
                    </div>
                    <select
                      value={dishCatFilter}
                      onChange={e => setDishCatFilter(e.target.value)}
                      className="border border-[#E8E2D8] rounded-xl px-3 py-1.5 text-xs bg-white"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
                      ))}
                    </select>
                    <select
                      value={dishTypeFilter}
                      onChange={e => setDishTypeFilter(e.target.value)}
                      className="border border-[#E8E2D8] rounded-xl px-3 py-1.5 text-xs bg-white"
                    >
                      <option value="all">All Food Types</option>
                      <option value="veg">🟢 Veg</option>
                      <option value="non-veg">🔴 Non-Veg</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-xl border border-[#E8E2D8] overflow-hidden bg-white">
                  <table className="w-full text-xs">
                    <thead className="bg-[#F8F5EF] border-b border-[#E8E2D8] text-[#737373]">
                      <tr>
                        <th className="text-left px-4 py-2.5 font-bold uppercase">Dish Name</th>
                        <th className="text-left px-4 py-2.5 font-bold uppercase">Category</th>
                        <th className="text-left px-4 py-2.5 font-bold uppercase">Package-Specific Price</th>
                        <th className="text-right px-4 py-2.5 font-bold uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EDE8]">
                      {(() => {
                        const assignedItems = pkgItems.filter(pi => pi.package_id === activePkg.id)
                        const filteredAssigned = assignedItems.filter(pi => {
                          const itemDef = allItems.find(i => i.id === pi.item_id)
                          const matchesSearch = !dishSearch || itemDef?.name.toLowerCase().includes(dishSearch.toLowerCase())
                          const matchesCat = dishCatFilter === 'all' || pi.category_id === dishCatFilter
                          const matchesType = dishTypeFilter === 'all' || itemDef?.type === dishTypeFilter
                          return matchesSearch && matchesCat && matchesType
                        })

                        if (filteredAssigned.length === 0) {
                          return (
                            <tr><td colSpan={4} className="text-center py-6 text-[#A8A8A8]">No dishes match your filters. Click "+ Add Dish to {activePkg.name}" above.</td></tr>
                          )
                        }

                        return filteredAssigned.map(pi => {
                          const itemDef = allItems.find(i => i.id === pi.item_id)
                          const catDef = categories.find(c => c.id === pi.category_id)
                          const key = `${activePkg.id}-${pi.category_id}-${pi.item_id}`
                          const isSaving = saving === key

                          return (
                            <tr key={key} className="hover:bg-[#FDFCFA]">
                              <td className="px-4 py-2.5 font-semibold text-[#1A1A1A]">
                                <span>{itemDef?.name ?? pi.item_id}</span>
                                {itemDef?.sub_label && <span className="ml-1.5 text-[10px] text-[#A8A8A8]">({itemDef.sub_label})</span>}
                              </td>
                              <td className="px-4 py-2.5 text-[#737373]">
                                {catDef?.emoji} {catDef?.label ?? pi.category_id}
                              </td>
                              <td className="px-4 py-2.5">
                                <div className="flex items-center gap-1">
                                  <span className="text-[#A8A8A8]">₹</span>
                                  <input
                                    type="number"
                                    className="w-20 border border-[#E8E2D8] rounded-md px-2 py-1 text-xs font-bold bg-white"
                                    defaultValue={pi.price ?? itemDef?.price ?? 0}
                                    onBlur={(e) => updateDishPrice(activePkg.id, pi.category_id, pi.item_id, Number(e.target.value))}
                                  />
                                  {isSaving && <Loader2 size={12} className="animate-spin text-[#C5A85C]" />}
                                </div>
                              </td>
                              <td className="px-4 py-2.5 text-right">
                                <div className="flex justify-end gap-1.5">
                                  {itemDef && (
                                    <button
                                      onClick={() => setEditingItem({ ...itemDef })}
                                      className="p-1 rounded hover:bg-[#F5EDD6] text-[#737373] hover:text-[#C5A85C]"
                                      title="Edit Dish Details"
                                    >
                                      <Pencil size={13} />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleRemoveDishFromPackage(activePkg.id, pi.category_id, pi.item_id)}
                                    className="px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-[11px]"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Dish Modal */}
      {addingDishPkgId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E8E2D8] p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#EEEAE4] pb-3">
              <h3 className="font-semibold text-[#1A1A1A] text-base">Add Dish to Package</h3>
              <div className="flex gap-1 bg-[#F5F3F0] p-1 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setAddMode('existing')}
                  className={`px-3 py-1 rounded-md font-semibold ${addMode === 'existing' ? 'bg-white text-[#1A1A1A] shadow-xs' : 'text-[#737373]'}`}
                >
                  From Catalog
                </button>
                <button
                  type="button"
                  onClick={() => setAddMode('new')}
                  className={`px-3 py-1 rounded-md font-semibold ${addMode === 'new' ? 'bg-white text-[#1A1A1A] shadow-xs' : 'text-[#737373]'}`}
                >
                  Create New
                </button>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#737373] block mb-1">Category</label>
                <select
                  value={selectedCatId}
                  onChange={e => setSelectedCatId(e.target.value)}
                  className="w-full border border-[#E8E2D8] rounded-xl px-3 py-2 bg-white"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
                  ))}
                </select>
              </div>

              {addMode === 'existing' ? (
                <div>
                  <label className="font-bold text-[#737373] block mb-1">Select Dish from Library</label>
                  <select
                    value={selectedItemId}
                    onChange={e => setSelectedItemId(e.target.value)}
                    className="w-full border border-[#E8E2D8] rounded-xl px-3 py-2 bg-white"
                  >
                    <option value="">-- Choose Dish --</option>
                    {allItems.map(i => (
                      <option key={i.id} value={i.id}>{i.name} ({i.type})</option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <div>
                    <label className="font-bold text-[#737373] block mb-1">Dish Name</label>
                    <Input
                      placeholder="e.g. Paneer Butter Masala"
                      value={newDishName}
                      onChange={e => setNewDishName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#737373] block mb-1">Type</label>
                    <select
                      value={newDishType}
                      onChange={e => setNewDishType(e.target.value as 'veg' | 'non-veg')}
                      className="w-full border border-[#E8E2D8] rounded-xl px-3 py-2 bg-white"
                    >
                      <option value="veg">Vegetarian</option>
                      <option value="non-veg">Non-Vegetarian</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-[#737373] block mb-1">Sub-label (optional)</label>
                    <Input
                      placeholder="e.g. with Naan / Rice"
                      value={newDishSubLabel}
                      onChange={e => setNewDishSubLabel(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div>
                <label className="font-bold text-[#737373] block mb-1">Package-Specific Price (₹)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newItemPrice}
                  onChange={e => setNewItemPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 justify-end">
              <Button variant="secondary" size="sm" onClick={() => setAddingDishPkgId(null)}>Cancel</Button>
              <Button size="sm" onClick={handleAddDishToPackage} disabled={addMode === 'existing' ? !selectedItemId : !newDishName.trim()}>
                Add to Package
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dish Details Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E8E2D8] p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="font-semibold text-[#1A1A1A] text-base">Edit Dish Details</h3>
            <div className="space-y-3 text-xs">
              <div>
                <Label>Dish Name</Label>
                <Input
                  value={editingItem.name}
                  onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Type</Label>
                <select
                  value={editingItem.type}
                  onChange={e => setEditingItem({ ...editingItem, type: e.target.value as 'veg' | 'non-veg' })}
                  className="w-full border border-[#E8E2D8] rounded-xl px-3 py-2 bg-white"
                >
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                </select>
              </div>
              <div>
                <Label>Sub-label</Label>
                <Input
                  value={editingItem.sub_label || ''}
                  onChange={e => setEditingItem({ ...editingItem, sub_label: e.target.value || null })}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" size="sm" onClick={() => setEditingItem(null)}>Cancel</Button>
              <Button size="sm" onClick={handleSaveEditItem}>Save Dish Details</Button>
            </div>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E8E2D8] p-6 max-w-2xl w-full space-y-4 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EEEAE4] pb-3">
              <div>
                <h3 className="font-semibold text-[#1A1A1A] text-base">Manage Master Categories</h3>
                <p className="text-xs text-[#737373]">Category definitions used across all packages</p>
              </div>
              <Button size="sm" onClick={() => setAddingCat(true)}><Plus size={14} className="mr-1" /> Add Category</Button>
            </div>

            {addingCat && (
              <div className="bg-[#FDFCFA] border border-[#E8E2D8] rounded-xl p-4 space-y-3">
                <h4 className="font-semibold text-xs text-[#1A1A1A]">New Category</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <Label>Slug ID</Label>
                    <Input placeholder="e.g. desserts-special" value={newCatForm.id} onChange={e => setNewCatForm(f => ({ ...f, id: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Label</Label>
                    <Input placeholder="e.g. Desserts & Sweets" value={newCatForm.label} onChange={e => setNewCatForm(f => ({ ...f, label: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Emoji</Label>
                    <Input value={newCatForm.emoji} onChange={e => setNewCatForm(f => ({ ...f, emoji: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Sort Order</Label>
                    <Input type="number" value={newCatForm.sort_order} onChange={e => setNewCatForm(f => ({ ...f, sort_order: Number(e.target.value) }))} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddCategory}><Check size={14} className="mr-1" /> Save Category</Button>
                  <Button size="sm" variant="secondary" onClick={() => setAddingCat(false)}>Cancel</Button>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-[#E8E2D8] overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-[#F8F5EF] border-b border-[#E8E2D8] text-[#737373]">
                  <tr>
                    <th className="p-2.5 text-left">Emoji</th>
                    <th className="p-2.5 text-left">ID</th>
                    <th className="p-2.5 text-left">Label</th>
                    <th className="p-2.5 text-left">Order</th>
                    <th className="p-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDE8]">
                  {categories.map(cat => {
                    const isEditing = editingCatId === cat.id
                    return isEditing ? (
                      <tr key={cat.id}>
                        <td className="p-2">
                          <Input className="w-14" value={editCatForm.emoji ?? cat.emoji} onChange={e => setEditCatForm(f => ({ ...f, emoji: e.target.value }))} />
                        </td>
                        <td className="p-2 font-mono">{cat.id}</td>
                        <td className="p-2">
                          <Input value={editCatForm.label ?? cat.label} onChange={e => setEditCatForm(f => ({ ...f, label: e.target.value }))} />
                        </td>
                        <td className="p-2">
                          <Input type="number" className="w-16" value={editCatForm.sort_order ?? cat.sort_order ?? 0} onChange={e => setEditCatForm(f => ({ ...f, sort_order: Number(e.target.value) }))} />
                        </td>
                        <td className="p-2 text-right">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" onClick={() => handleSaveCatEdit(cat.id)}><Check size={14} /></Button>
                            <Button size="sm" variant="secondary" onClick={() => setEditingCatId(null)}><X size={14} /></Button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr key={cat.id} className="hover:bg-[#FDFCFA]">
                        <td className="p-2.5 text-base">{cat.emoji}</td>
                        <td className="p-2.5 font-mono text-[#737373]">{cat.id}</td>
                        <td className="p-2.5 font-semibold text-[#1A1A1A]">{cat.label}</td>
                        <td className="p-2.5 text-[#737373]">{cat.sort_order ?? 0}</td>
                        <td className="p-2.5 text-right">
                          <div className="flex justify-end gap-1">
                            <button onClick={() => { setEditingCatId(cat.id); setEditCatForm(cat) }} className="p-1.5 rounded hover:bg-[#F5EDD6] text-[#737373] hover:text-[#C5A85C]">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => handleDeleteCategory(cat.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="secondary" size="sm" onClick={() => setShowCatModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

