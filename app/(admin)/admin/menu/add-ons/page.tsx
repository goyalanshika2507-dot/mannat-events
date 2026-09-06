'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2, Plus, Pencil, Trash2, Check, X, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

interface MenuAddon {
  id: string
  name: string
  price: number
  unit: string
  is_active: boolean
  sort_order: number
}

export default function AdminAddonsPage() {
  const [addons, setAddons] = useState<MenuAddon[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<MenuAddon>>({})
  const [newForm, setNewForm] = useState({ name: '', price: 0, unit: 'per head', is_active: true })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/addons')
      const data = await res.json()
      setAddons(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleAdd() {
    if (!newForm.name.trim()) return
    setSaving(true)
    try {
      await fetch('/api/admin/addons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          ...newForm
        })
      })
      setNewForm({ name: '', price: 0, unit: 'per head', is_active: true })
      setAdding(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveEdit(id: string) {
    setSaving(true)
    try {
      await fetch('/api/admin/addons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editForm })
      })
      setEditId(null)
      load()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete add-on "${name}"?`)) return
    try {
      await fetch('/api/admin/addons', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      load()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#C5A85C]/20 border border-[#C5A85C]/40 text-[#C5A85C] text-[10px] font-bold tracking-widest uppercase inline-block mb-2">
            FOOD & COUNTER ENHANCEMENTS
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
            Add-ons Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#A1A1AA]">
            Manage extra counters, desserts, paan stalls, and special live add-ons.
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="px-4 py-2 rounded-xl bg-[#C5A85C] text-black font-bold text-xs hover:bg-[#D4AF37] transition-all flex items-center gap-1.5 shadow-md"
        >
          <Plus size={16} /> Add New Add-on
        </button>
      </div>

      {adding && (
        <div className="bg-[#121214] border border-[#C5A85C]/40 rounded-2xl p-5 space-y-4 shadow-xl">
          <h3 className="font-semibold text-white text-sm flex items-center gap-2">
            <PlusCircle size={16} className="text-[#C5A85C]" /> Add New Food Add-on
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label required>Add-on Title</Label>
              <Input
                placeholder="e.g. Premium Paan Counter"
                value={newForm.name}
                onChange={e => setNewForm(f => ({ ...f, name: e.target.value }))}
                className="bg-[#1A1A1E] text-white border-[#27272A]"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Price (₹)</Label>
              <Input
                type="number"
                value={newForm.price}
                onChange={e => setNewForm(f => ({ ...f, price: Number(e.target.value) }))}
                className="bg-[#1A1A1E] text-white border-[#27272A]"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Pricing Unit</Label>
              <Input
                placeholder="per head / flat"
                value={newForm.unit}
                onChange={e => setNewForm(f => ({ ...f, unit: e.target.value }))}
                className="bg-[#1A1A1E] text-white border-[#27272A]"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={handleAdd} loading={saving} size="sm">
              <Check size={14} className="mr-1" /> Save Add-on
            </Button>
            <Button onClick={() => setAdding(false)} variant="secondary" size="sm">
              <X size={14} className="mr-1" /> Cancel
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#C5A85C]" /></div>
      ) : (
        <div className="bg-[#121214] rounded-2xl border border-[#C5A85C]/20 overflow-hidden shadow-xl">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#27272A] bg-[#18181C] text-[11px] font-bold uppercase tracking-wider text-[#C5A85C]">
                <th className="p-4">Add-on Name</th>
                <th className="p-4">Price</th>
                <th className="p-4">Unit</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]">
              {addons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#71717A]">
                    No add-ons configured yet. Click &quot;Add New Add-on&quot; to create one.
                  </td>
                </tr>
              ) : (
                addons.map((item) => {
                  const isEditing = editId === item.id
                  return (
                    <tr key={item.id} className="hover:bg-[#18181C]/60 transition-colors">
                      <td className="p-4 font-semibold text-white">
                        {isEditing ? (
                          <input
                            value={editForm.name ?? item.name}
                            onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                            className="bg-[#1A1A1E] text-white border border-[#C5A85C] rounded-lg px-2.5 py-1 text-xs w-full"
                          />
                        ) : (
                          item.name
                        )}
                      </td>
                      <td className="p-4 font-mono font-bold text-[#C5A85C]">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editForm.price ?? item.price}
                            onChange={e => setEditForm(f => ({ ...f, price: Number(e.target.value) }))}
                            className="bg-[#1A1A1E] text-white border border-[#C5A85C] rounded-lg px-2.5 py-1 text-xs w-24"
                          />
                        ) : (
                          `₹${(item.price ?? 0).toLocaleString('en-IN')}`
                        )}
                      </td>
                      <td className="p-4 text-[#A1A1AA]">
                        {isEditing ? (
                          <input
                            value={editForm.unit ?? item.unit}
                            onChange={e => setEditForm(f => ({ ...f, unit: e.target.value }))}
                            className="bg-[#1A1A1E] text-white border border-[#C5A85C] rounded-lg px-2.5 py-1 text-xs w-28"
                          />
                        ) : (
                          item.unit || 'per head'
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          item.is_active !== false
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                            : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                        }`}>
                          {item.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleSaveEdit(item.id)}
                              className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => setEditId(null)}
                              className="p-1.5 rounded-lg bg-[#27272A] text-[#A1A1AA] hover:text-white transition-all"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => { setEditId(item.id); setEditForm(item) }}
                              className="p-1.5 rounded-lg bg-[#1A1A1E] hover:bg-[#C5A85C] hover:text-black border border-[#27272A] text-[#A1A1AA] transition-all"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, item.name)}
                              className="p-1.5 rounded-lg bg-[#1A1A1E] hover:bg-rose-500 hover:text-white border border-[#27272A] text-[#A1A1AA] transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
