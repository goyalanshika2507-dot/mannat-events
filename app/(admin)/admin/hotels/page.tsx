'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Loader2, Plus, Pencil, Trash2, Building2, Check, X, Sliders, ExternalLink, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

interface Hotel {
  id: string
  name: string
  star_rating: number
  image_url: string
  location: string
  room_category: string
  venue_capacity: string
  room_rate: number
  multiplier: number
  is_active: boolean
  sort_order?: number
}

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null)

  // Forms state
  const [newHotel, setNewHotel] = useState<Partial<Hotel>>({
    name: '',
    star_rating: 5,
    image_url: '/venue_palace.jpg',
    location: 'Agra',
    room_category: 'Deluxe Rooms',
    venue_capacity: 'Up to 500 Guests',
    room_rate: 10000,
    multiplier: 1.0,
    is_active: true
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/hotels')
      const data = await res.json()
      setHotels(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load hotels:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleAddHotel() {
    if (!newHotel.name?.trim()) return
    setSaving('add')
    try {
      const res = await fetch('/api/admin/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHotel)
      })
      if (res.ok) {
        const created = await res.json()
        setHotels(prev => [...prev, created])
        setShowAddModal(false)
        setNewHotel({
          name: '',
          star_rating: 5,
          image_url: '/venue_palace.jpg',
          location: 'Agra',
          room_category: 'Deluxe Rooms',
          venue_capacity: 'Up to 500 Guests',
          room_rate: 10000,
          multiplier: 1.0,
          is_active: true
        })
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to add hotel')
      }
    } finally {
      setSaving(null)
    }
  }

  async function handleSaveEdit() {
    if (!editingHotel) return
    setSaving(`edit-${editingHotel.id}`)
    try {
      const res = await fetch('/api/admin/hotels', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingHotel)
      })
      if (res.ok) {
        const updated = await res.json()
        setHotels(prev => prev.map(h => h.id === updated.id ? updated : h))
        setEditingHotel(null)
      }
    } finally {
      setSaving(null)
    }
  }

  async function handleToggleActive(hotel: Hotel) {
    setSaving(`toggle-${hotel.id}`)
    try {
      const res = await fetch('/api/admin/hotels', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: hotel.id, is_active: !hotel.is_active })
      })
      if (res.ok) {
        setHotels(prev => prev.map(h => h.id === hotel.id ? { ...h, is_active: !h.is_active } : h))
      }
    } finally {
      setSaving(null)
    }
  }

  async function handleDelete(hotel: Hotel) {
    if (!confirm(`Delete hotel "${hotel.name}"? Master dish definitions will be preserved.`)) return
    setSaving(`del-${hotel.id}`)
    try {
      const res = await fetch('/api/admin/hotels', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: hotel.id })
      })
      if (res.ok) {
        setHotels(prev => prev.filter(h => h.id !== hotel.id))
      }
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-caption text-[#C9A84C] mb-1">Venue Management</p>
          <h1 className="text-headline">Hotel &amp; Venue Management</h1>
          <p className="mt-1 text-sm text-[#737373]">
            Manage venues, star ratings, room rates, venue multipliers, and hotel-specific packages.
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={16} className="mr-1.5" /> Add New Hotel
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#C5A85C]" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map(hotel => {
            const isSaving = saving?.includes(hotel.id)
            return (
              <div
                key={hotel.id}
                className="bg-white border border-[#E8E2D8] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-[#F5EDD6] overflow-hidden">
                    <img
                      src={hotel.image_url}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLElement).style.display = 'none' }}
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        hotel.is_active ? 'bg-emerald-500 text-white shadow-xs' : 'bg-zinc-700 text-zinc-300'
                      }`}>
                        {hotel.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                      <span>⭐ {hotel.star_rating} Star</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#1A1A1A]">{hotel.name}</h3>
                      <p className="text-xs text-[#737373]">{hotel.location}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-[#FDFCFA] p-3 rounded-xl border border-[#EEEAE4]">
                      <div>
                        <span className="text-[10px] text-[#A8A8A8] block uppercase">Room Rate</span>
                        <strong className="text-[#1A1A1A]">₹{(hotel.room_rate ?? 0).toLocaleString('en-IN')}/night</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#A8A8A8] block uppercase">Multiplier</span>
                        <strong className="text-[#1A1A1A]">{hotel.multiplier ?? 1.0}x</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#A8A8A8] block uppercase">Room Category</span>
                        <span className="text-[#1A1A1A] truncate block">{hotel.room_category}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#A8A8A8] block uppercase">Capacity</span>
                        <span className="text-[#1A1A1A] truncate block">{hotel.venue_capacity}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#F8F5EF] border-t border-[#E8E2D8] space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/admin/hotels/${hotel.id}/menu`}
                      className="px-3 py-1.5 bg-white border border-[#D5C9B1] rounded-lg text-[11px] font-semibold text-[#8C6D1F] hover:bg-[#FAF6EC] flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Sliders size={13} />
                      Manage Menu
                    </Link>
                    <Link
                      href={`/admin/hotels/${hotel.id}/decor`}
                      className="px-3 py-1.5 bg-white border border-[#D5C9B1] rounded-lg text-[11px] font-semibold text-[#8C6D1F] hover:bg-[#FAF6EC] flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Sparkles size={13} />
                      Manage Decor
                    </Link>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#EAE3D5]">
                    <div className="text-[11px] font-semibold text-[#737373]">
                      Status: <strong className={hotel.is_active ? 'text-emerald-700' : 'text-zinc-600'}>{hotel.is_active ? 'Active' : 'Inactive'}</strong>
                    </div>

                    <div className="flex gap-1.5 justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleToggleActive(hotel)}
                        disabled={isSaving}
                        className="text-xs px-2.5 h-8"
                      >
                        {hotel.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditingHotel(hotel)}
                        disabled={isSaving}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil size={13} />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDelete(hotel)}
                        disabled={isSaving}
                        className="text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add New Hotel Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E8E2D8] p-6 max-w-lg w-full space-y-4 shadow-xl max-h-[85vh] overflow-y-auto">
            <h3 className="font-semibold text-[#1A1A1A] text-base">Add New Hotel</h3>
            <div className="space-y-3 text-xs">
              <div>
                <Label>Hotel Name</Label>
                <Input
                  placeholder="e.g. Radisson Blu Hotel Agra"
                  value={newHotel.name}
                  onChange={e => setNewHotel({ ...newHotel, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Star Rating</Label>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={newHotel.star_rating}
                    onChange={e => setNewHotel({ ...newHotel, star_rating: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Room Rate (₹/night)</Label>
                  <Input
                    type="number"
                    value={newHotel.room_rate}
                    onChange={e => setNewHotel({ ...newHotel, room_rate: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Location</Label>
                  <Input
                    value={newHotel.location}
                    onChange={e => setNewHotel({ ...newHotel, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Multiplier (e.g. 1.15)</Label>
                  <Input
                    type="number"
                    step="0.05"
                    value={newHotel.multiplier}
                    onChange={e => setNewHotel({ ...newHotel, multiplier: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label>Image URL</Label>
                <Input
                  value={newHotel.image_url}
                  onChange={e => setNewHotel({ ...newHotel, image_url: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Room Category</Label>
                  <Input
                    value={newHotel.room_category}
                    onChange={e => setNewHotel({ ...newHotel, room_category: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Venue Capacity</Label>
                  <Input
                    value={newHotel.venue_capacity}
                    onChange={e => setNewHotel({ ...newHotel, venue_capacity: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="secondary" size="sm" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button size="sm" onClick={handleAddHotel} disabled={!newHotel.name?.trim()}>Add Hotel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Hotel Modal */}
      {editingHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E8E2D8] p-6 max-w-lg w-full space-y-4 shadow-xl max-h-[85vh] overflow-y-auto">
            <h3 className="font-semibold text-[#1A1A1A] text-base">Edit Hotel Details</h3>
            <div className="space-y-3 text-xs">
              <div>
                <Label>Hotel Name</Label>
                <Input
                  value={editingHotel.name}
                  onChange={e => setEditingHotel({ ...editingHotel, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Star Rating</Label>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={editingHotel.star_rating}
                    onChange={e => setEditingHotel({ ...editingHotel, star_rating: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Room Rate (₹/night)</Label>
                  <Input
                    type="number"
                    value={editingHotel.room_rate}
                    onChange={e => setEditingHotel({ ...editingHotel, room_rate: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Location</Label>
                  <Input
                    value={editingHotel.location}
                    onChange={e => setEditingHotel({ ...editingHotel, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Multiplier</Label>
                  <Input
                    type="number"
                    step="0.05"
                    value={editingHotel.multiplier}
                    onChange={e => setEditingHotel({ ...editingHotel, multiplier: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label>Image URL</Label>
                <Input
                  value={editingHotel.image_url}
                  onChange={e => setEditingHotel({ ...editingHotel, image_url: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Room Category</Label>
                  <Input
                    value={editingHotel.room_category}
                    onChange={e => setEditingHotel({ ...editingHotel, room_category: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Venue Capacity</Label>
                  <Input
                    value={editingHotel.venue_capacity}
                    onChange={e => setEditingHotel({ ...editingHotel, venue_capacity: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="secondary" size="sm" onClick={() => setEditingHotel(null)}>Cancel</Button>
              <Button size="sm" onClick={handleSaveEdit}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
