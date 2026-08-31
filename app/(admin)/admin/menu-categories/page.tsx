'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2, Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

interface MenuCategory {
  id: string
  label: string
  emoji: string
  sort_order: number
}

export default function AdminMenuCategoriesPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<MenuCategory>>({})
  const [newForm, setNewForm] = useState({ id: '', label: '', emoji: '🍽️', sort_order: 99 })
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/menu-categories')
      const data = await res.json()
      setCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleAdd() {
    if (!newForm.id || !newForm.label) return
    setSaving(true)
    try {
      await fetch('/api/admin/menu-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newForm)
      })
      setNewForm({ id: '', label: '', emoji: '🍽️', sort_order: 99 })
      setAdding(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveEdit(id: string) {
    setSaving(true)
    try {
      await fetch('/api/admin/menu-categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editForm })
      })
      setEditingId(null)
      load()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(`Delete category "${id}"?`)) return
    try {
      await fetch('/api/admin/menu-categories', {
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
          <p className="text-caption text-[#C9A84C] mb-1">Configuration</p>
          <h1 className="text-headline">Menu Categories</h1>
          <p className="mt-1 text-sm text-[#737373]">
            Manage menu categories (Welcome Drinks, Starters, Main Course, Sweets, etc.) used in packages and master food library.
          </p>
        </div>
        <Button onClick={() => setAdding(true)}>
          <Plus size={16} className="mr-1.5" /> Add Category
        </Button>
      </div>

      {adding && (
        <div className="bg-[#FDFCFA] border border-[#E8E2D8] rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="font-semibold text-[#1A1A1A]">Add New Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label required>Category ID (slug)</Label>
              <Input placeholder="e.g. desserts-special" value={newForm.id} onChange={e => setNewForm(f => ({ ...f, id: e.target.value }))} />
            </div>
            <div>
              <Label required>Category Label</Label>
              <Input placeholder="e.g. Desserts & Sweets" value={newForm.label} onChange={e => setNewForm(f => ({ ...f, label: e.target.value }))} />
            </div>
            <div>
              <Label>Emoji</Label>
              <Input value={newForm.emoji} onChange={e => setNewForm(f => ({ ...f, emoji: e.target.value }))} />
            </div>
            <div>
              <Label>Sort Order</Label>
              <Input type="number" value={newForm.sort_order} onChange={e => setNewForm(f => ({ ...f, sort_order: Number(e.target.value) }))} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} loading={saving} size="sm"><Check size={14} className="mr-1" /> Save</Button>
            <Button onClick={() => setAdding(false)} variant="secondary" size="sm"><X size={14} className="mr-1" /> Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#C5A85C]" /></div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E8E2D8] bg-white shadow-xs">
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Emoji</th>
                <th>Category ID</th>
                <th>Label</th>
                <th>Order</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => {
                const isEditing = editingId === cat.id
                return isEditing ? (
                  <tr key={cat.id}>
                    <td>
                      <Input className="w-16" value={editForm.emoji ?? cat.emoji} onChange={e => setEditForm(f => ({ ...f, emoji: e.target.value }))} />
                    </td>
                    <td className="font-mono text-xs">{cat.id}</td>
                    <td>
                      <Input value={editForm.label ?? cat.label} onChange={e => setEditForm(f => ({ ...f, label: e.target.value }))} />
                    </td>
                    <td>
                      <Input type="number" className="w-20" value={editForm.sort_order ?? cat.sort_order} onChange={e => setEditForm(f => ({ ...f, sort_order: Number(e.target.value) }))} />
                    </td>
                    <td>
                      <div className="flex gap-2 justify-end">
                        <Button onClick={() => handleSaveEdit(cat.id)} loading={saving} size="sm"><Check size={14} /></Button>
                        <Button onClick={() => setEditingId(null)} variant="secondary" size="sm"><X size={14} /></Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={cat.id}>
                    <td className="text-xl">{cat.emoji}</td>
                    <td className="font-mono text-xs text-[#737373]">{cat.id}</td>
                    <td className="font-semibold text-[#1A1A1A]">{cat.label}</td>
                    <td className="text-xs text-[#737373]">{cat.sort_order}</td>
                    <td>
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => { setEditingId(cat.id); setEditForm(cat) }} className="p-1.5 rounded-lg hover:bg-[#F5EDD6] text-[#737373] hover:text-[#C5A85C]">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#737373] hover:text-red-500">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
