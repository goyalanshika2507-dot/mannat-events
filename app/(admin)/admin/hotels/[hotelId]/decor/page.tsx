'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Loader2, Check, X, Pencil, Trash2, Plus, ChevronLeft,
  IndianRupee, ToggleRight, ToggleLeft, Flower2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

interface DecorPkg {
  id: string
  hotel_id: string
  title: string
  subtitle: string
  badge?: string
  price: number
  features: string[]
  image_url?: string
  is_active: boolean
  sort_order?: number
}

export default function HotelDecorPage() {
  const params = useParams<{ hotelId: string }>()
  const hotelId = params.hotelId

  const [decor, setDecor] = useState<DecorPkg[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [hotelName, setHotelName] = useState('')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<DecorPkg>>({})
  const [showAddModal, setShowAddModal] = useState(false)
  const [newForm, setNewForm] = useState<Partial<DecorPkg>>({
    id: '', title: '', subtitle: '', badge: '', price: 280000,
    features: ['Stage setup', 'Floral backdrop', 'Ambient lighting'],
    image_url: '/wedding_mandap.png', is_active: true, sort_order: 99
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [resDecor, resHotels] = await Promise.all([
        fetch(`/api/admin/hotels/${hotelId}/decor`),
        fetch('/api/admin/hotels'),
      ])
      const decorData = await resDecor.json()
      const hotels = await resHotels.json()

      const hotel = (hotels || []).find((h: any) => h.id === hotelId)
      setHotelName(hotel?.name || hotelId)
      setDecor(decorData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [hotelId])

  useEffect(() => { load() }, [load])

  async function handleSaveEdit(id: string) {
    setSaving(`edit-${id}`)
    try {
      const res = await fetch(`/api/admin/hotels/${hotelId}/decor`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editForm })
      })
      const updated = await res.json()
      setDecor(prev => prev.map(d => d.id === id ? { ...d, ...updated } : d))
      setEditingId(null)
      setEditForm({})
    } finally {
      setSaving(null)
    }
  }

  async function toggleActive(pkg: DecorPkg) {
    setSaving(`toggle-${pkg.id}`)
    try {
      await fetch(`/api/admin/hotels/${hotelId}/decor`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pkg.id, is_active: !pkg.is_active })
      })
      setDecor(prev => prev.map(d => d.id === pkg.id ? { ...d, is_active: !d.is_active } : d))
    } finally {
      setSaving(null)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this decoration package?')) return
    setSaving(`del-${id}`)
    try {
      await fetch(`/api/admin/hotels/${hotelId}/decor`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      setDecor(prev => prev.filter(d => d.id !== id))
    } finally {
      setSaving(null)
    }
  }

  async function handleAdd() {
    if (!newForm.id || !newForm.title) return
    setSaving('add')
    try {
      const res = await fetch(`/api/admin/hotels/${hotelId}/decor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newForm)
      })
      const created = await res.json()
      if (res.ok) {
        setDecor(prev => [...prev, created].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)))
        setShowAddModal(false)
        setNewForm({
          id: '', title: '', subtitle: '', badge: '', price: 280000,
          features: ['Stage setup', 'Floral backdrop', 'Ambient lighting'],
          image_url: '/wedding_mandap.png', is_active: true, sort_order: 99
        })
      } else {
        alert(created.error || 'Failed to create')
      }
    } finally {
      setSaving(null)
    }
  }

  const badgeColors: Record<string, string> = {
    Essential: 'bg-blue-500/20 text-blue-400',
    Popular: 'bg-amber-500/20 text-amber-400',
    Premium: 'bg-purple-500/20 text-purple-400',
    Signature: 'bg-rose-500/20 text-rose-400',
  }

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
          <p className="text-xs text-[#737373] mt-0.5">Decoration Package Configuration</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/hotels/${hotelId}/menu`}>
            <Button variant="secondary" size="sm">← Manage Menu</Button>
          </Link>
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus size={14} className="mr-1.5" /> Add Package
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#C5A85C]" /></div>
      ) : decor.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <Flower2 size={32} className="text-[#C5A85C]/40 mx-auto" />
          <p className="text-[#737373] text-sm">No decoration packages configured for this hotel.</p>
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus size={14} className="mr-1.5" /> Add First Package
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {decor.map(pkg => {
            const isEditing = editingId === pkg.id
            return (
              <div
                key={`${pkg.id}-${pkg.hotel_id}`}
                className={`rounded-2xl border ${pkg.is_active ? 'border-[#2A2A2E] bg-[#141418]' : 'border-[#2A2A2E] bg-[#0D0D0F] opacity-60'} overflow-hidden transition-all`}
              >
                {/* Header bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2A2E]">
                  <div className="flex items-center gap-2">
                    {pkg.badge && (
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${badgeColors[pkg.badge] || 'bg-[#C5A85C]/20 text-[#C5A85C]'}`}>
                        {pkg.badge}
                      </span>
                    )}
                    <h3 className="text-sm font-bold text-white">{pkg.title}</h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleActive(pkg)}
                      className="text-[#737373] hover:text-[#C5A85C] transition-colors"
                    >
                      {pkg.is_active ? <ToggleRight size={18} className="text-[#C5A85C]" /> : <ToggleLeft size={18} />}
                    </button>
                    <button
                      onClick={() => { setEditingId(pkg.id); setEditForm({ ...pkg }) }}
                      className="p-1.5 rounded-lg text-[#737373] hover:text-[#C5A85C] hover:bg-[#C5A85C]/10 transition-all"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="p-1.5 rounded-lg text-[#737373] hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label required>Title</Label>
                        <Input value={editForm.title || ''} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
                      </div>
                      <div className="space-y-1">
                        <Label>Subtitle</Label>
                        <Input value={editForm.subtitle || ''} onChange={e => setEditForm(f => ({ ...f, subtitle: e.target.value }))} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label required>Price (₹)</Label>
                        <div className="relative">
                          <IndianRupee size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C5A85C]" />
                          <Input
                            type="number"
                            value={editForm.price || 0}
                            onChange={e => setEditForm(f => ({ ...f, price: Number(e.target.value) }))}
                            className="pl-7"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label>Badge</Label>
                        <select
                          value={editForm.badge || ''}
                          onChange={e => setEditForm(f => ({ ...f, badge: e.target.value }))}
                          className="w-full text-sm bg-[#1A1A1E] border border-[#27272A] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#C5A85C]/40"
                        >
                          <option value="">None</option>
                          {['Essential','Popular','Premium','Signature'].map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label>Features (comma-separated)</Label>
                      <Input
                        value={(editForm.features || []).join(', ')}
                        onChange={e => setEditForm(f => ({ ...f, features: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Image URL</Label>
                      <Input value={editForm.image_url || ''} onChange={e => setEditForm(f => ({ ...f, image_url: e.target.value }))} />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button onClick={() => handleSaveEdit(pkg.id)} loading={saving === `edit-${pkg.id}`} size="sm" className="flex-1">
                        <Check size={13} className="mr-1.5" /> Save
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => { setEditingId(null); setEditForm({}) }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    <p className="text-xs text-[#737373]">{pkg.subtitle}</p>
                    <div className="flex items-center gap-1.5">
                      <IndianRupee size={14} className="text-[#C5A85C]" />
                      <span className="text-xl font-bold text-white">
                        {(pkg.price || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {(pkg.features || []).slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-[11px] text-[#A1A1AA]">
                          <div className="w-1 h-1 rounded-full bg-[#C5A85C]/60 shrink-0" />
                          {f}
                        </li>
                      ))}
                      {(pkg.features || []).length > 3 && (
                        <li className="text-[11px] text-[#737373]">+{pkg.features.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Add Package Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0D0D0F] border border-[#2A2A2E] rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">Add Decoration Package</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#737373] hover:text-white"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label required>ID (unique slug)</Label>
                <Input
                  value={newForm.id || ''}
                  onChange={e => setNewForm(f => ({ ...f, id: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                  placeholder="e.g. diamond"
                />
              </div>
              <div className="space-y-1">
                <Label required>Title</Label>
                <Input value={newForm.title || ''} onChange={e => setNewForm(f => ({ ...f, title: e.target.value }))} placeholder="Diamond Package" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Subtitle</Label>
                <Input value={newForm.subtitle || ''} onChange={e => setNewForm(f => ({ ...f, subtitle: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Badge</Label>
                <select
                  value={newForm.badge || ''}
                  onChange={e => setNewForm(f => ({ ...f, badge: e.target.value }))}
                  className="w-full text-sm bg-[#141418] border border-[#2A2A2E] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#C5A85C]/40"
                >
                  <option value="">None</option>
                  {['Essential','Popular','Premium','Signature'].map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <Label required>Price (₹)</Label>
              <div className="relative">
                <IndianRupee size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C5A85C]" />
                <Input
                  type="number"
                  value={newForm.price || ''}
                  onChange={e => setNewForm(f => ({ ...f, price: Number(e.target.value) }))}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Features (comma-separated)</Label>
              <Input
                value={(newForm.features || []).join(', ')}
                onChange={e => setNewForm(f => ({ ...f, features: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Image URL</Label>
              <Input
                value={newForm.image_url || ''}
                onChange={e => setNewForm(f => ({ ...f, image_url: e.target.value }))}
                placeholder="/wedding_mandap.png"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button onClick={handleAdd} loading={saving === 'add'} className="flex-1">
                <Plus size={14} className="mr-1.5" /> Create Package
              </Button>
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
