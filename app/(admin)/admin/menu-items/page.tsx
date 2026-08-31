'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2, Pencil, Trash2, ToggleLeft, ToggleRight, Plus, Check, X, Search, ImageOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

interface MenuItem {
  id: string
  name: string
  sub_label: string | null
  type: 'veg' | 'non-veg'
  is_active: boolean
  sort_order: number
}

function AddItemForm({ onAdd, onCancel }: { onAdd: () => void; onCancel: () => void }) {
  const [name, setName] = useState('')
  const [type, setType] = useState<'veg' | 'non-veg'>('veg')
  const [subLabel, setSubLabel] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    await fetch('/api/admin/menu-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), type, sub_label: subLabel || null }),
    })
    onAdd()
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#FDFCFA] border border-[#E8E2D8] rounded-2xl p-5 space-y-4">
      <h3 className="font-semibold text-[#1A1A1A] text-sm">Add New Menu Item</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-1.5">
          <Label htmlFor="item-name" required>Item Name</Label>
          <Input id="item-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Paneer Butter Masala" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="item-type" required>Type</Label>
          <select
            id="item-type"
            value={type}
            onChange={e => setType(e.target.value as 'veg' | 'non-veg')}
            className="w-full border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-sm bg-white"
          >
            <option value="veg">Vegetarian</option>
            <option value="non-veg">Non-Vegetarian</option>
          </select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="sub-label">Sub-label (optional)</Label>
        <Input id="sub-label" value={subLabel} onChange={e => setSubLabel(e.target.value)} placeholder="e.g. with Rotis / Rice" />
      </div>
      <div className="flex gap-2">
        <Button type="submit" loading={saving} size="sm"><Check size={14} className="mr-1.5" /> Add Item</Button>
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}><X size={14} className="mr-1" /> Cancel</Button>
      </div>
    </form>
  )
}

export default function AdminMenuItemsPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'veg' | 'non-veg'>('all')
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all')
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/menu-items')
    const data = await res.json()
    setItems(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function toggleActive(item: MenuItem) {
    await fetch('/api/admin/menu-items', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, is_active: !item.is_active }),
    })
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_active: !i.is_active } : i))
  }

  async function saveEdit(item: MenuItem) {
    await fetch('/api/admin/menu-items', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, name: editName }),
    })
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, name: editName } : i))
    setEditId(null)
  }

  async function handleDelete(item: MenuItem) {
    if (!confirm(`Delete "${item.name}"? This also removes it from all packages.`)) return
    await fetch('/api/admin/menu-items', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id }),
    })
    setItems(prev => prev.filter(i => i.id !== item.id))
  }

  const filtered = items
    .filter(i => filterType === 'all' || i.type === filterType)
    .filter(i => filterActive === 'all' || (filterActive === 'active' ? i.is_active : !i.is_active))
    .filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-caption text-[#C9A84C] mb-1">Menu Management</p>
          <h1 className="text-headline">Menu Items</h1>
          <p className="mt-1 text-sm text-[#737373]">{items.length} total items — disable to hide from customers instantly.</p>
        </div>
        <Button onClick={() => setAdding(true)}>
          <Plus size={16} className="mr-1.5" /> Add Item
        </Button>
      </div>

      {adding && <AddItemForm onAdd={() => { setAdding(false); load() }} onCancel={() => setAdding(false)} />}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A8A8]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-[#E8E2D8] rounded-xl bg-white"
          />
        </div>
        <div className="flex items-center gap-1 border border-[#E8E2D8] rounded-xl p-1 bg-white">
          {(['all', 'veg', 'non-veg'] as const).map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-3 py-1 text-[11px] font-semibold uppercase rounded-lg transition-all ${filterType === t ? 'bg-[#1A1A1A] text-white' : 'text-[#737373] hover:bg-[#F5F3F0]'}`}>
              {t === 'non-veg' ? 'Non-Veg' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 border border-[#E8E2D8] rounded-xl p-1 bg-white">
          {(['all', 'active', 'inactive'] as const).map(s => (
            <button key={s} onClick={() => setFilterActive(s)}
              className={`px-3 py-1 text-[11px] font-semibold uppercase rounded-lg transition-all ${filterActive === s ? 'bg-[#1A1A1A] text-white' : 'text-[#737373] hover:bg-[#F5F3F0]'}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#C5A85C]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#E8E2D8] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F8F5EF] border-b border-[#E8E2D8]">
              <tr>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#737373]">Item Name</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#737373]">Type</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#737373]">Status</th>
                <th className="text-right px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#737373]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDE8]">
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="text-center py-10 text-[#A8A8A8] text-sm">No items match your filters.</td></tr>
              )}
              {filtered.map(item => (
                <tr key={item.id} className={`${!item.is_active ? 'opacity-50' : ''} hover:bg-[#FDFCFA] transition-colors`}>
                  <td className="px-4 py-3">
                    {editId === item.id ? (
                      <div className="flex items-center gap-2">
                        <input value={editName} onChange={e => setEditName(e.target.value)}
                          className="border border-[#E8E2D8] rounded-lg px-2 py-1 text-sm flex-1"
                          onKeyDown={e => { if (e.key === 'Enter') saveEdit(item); if (e.key === 'Escape') setEditId(null) }}
                          autoFocus />
                        <button onClick={() => saveEdit(item)} className="text-green-600 hover:text-green-800"><Check size={14} /></button>
                        <button onClick={() => setEditId(null)} className="text-[#737373] hover:text-red-500"><X size={14} /></button>
                      </div>
                    ) : (
                      <div>
                        <span className="font-medium text-[#1A1A1A]">{item.name}</span>
                        {item.sub_label && <span className="ml-1.5 text-[11px] text-[#A8A8A8]">({item.sub_label})</span>}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full border ${item.type === 'veg' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold ${item.is_active ? 'text-green-700' : 'text-[#A8A8A8]'}`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setEditId(item.id); setEditName(item.name) }} className="p-1.5 rounded-lg hover:bg-[#F5EDD6] text-[#737373] hover:text-[#C5A85C] transition-all"><Pencil size={13} /></button>
                      <button onClick={() => toggleActive(item)} className="p-1.5 rounded-lg hover:bg-[#F5EDD6] text-[#737373] hover:text-[#C5A85C] transition-all">
                        {item.is_active ? <ToggleRight size={16} className="text-[#C5A85C]" /> : <ToggleLeft size={16} />}
                      </button>
                      <button onClick={() => handleDelete(item)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#737373] hover:text-red-500 transition-all"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-2.5 text-xs text-[#A8A8A8] bg-[#FDFCFA] border-t border-[#F0EDE8]">
            Showing {filtered.length} of {items.length} items
          </div>
        </div>
      )}
    </div>
  )
}
