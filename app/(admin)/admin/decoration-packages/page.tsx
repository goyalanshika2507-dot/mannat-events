'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2, Pencil, Trash2, ToggleLeft, ToggleRight, Plus, Check, X, ImageOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

interface DecorPkg {
  id: string
  title: string
  subtitle: string
  badge: string
  features: string[]
  image_url: string
  price: number
  is_active: boolean
  sort_order: number
}

function DecorCard({ pkg, onSave }: { pkg: DecorPkg; onSave: (p: DecorPkg) => void }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...pkg, features: pkg.features.join('\n') })
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(pkg.image_url)

  async function handleSave() {
    setSaving(true)
    const updated = {
      ...pkg,
      title: form.title,
      subtitle: form.subtitle,
      badge: form.badge,
      price: Number(form.price),
      image_url: form.image_url,
      features: form.features.split('\n').map(f => f.trim()).filter(Boolean),
    }
    await fetch('/api/admin/decoration-packages', {
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
    await fetch('/api/admin/decoration-packages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    onSave(updated)
  }

  if (editing) {
    return (
      <div className="rounded-2xl border border-[#E8E2D8] bg-[#FDFCFA] p-5 space-y-4">
        <h3 className="font-semibold text-[#1A1A1A]">Edit: {pkg.title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor={`dec-title-${pkg.id}`}>Title</Label>
              <Input id={`dec-title-${pkg.id}`} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`dec-sub-${pkg.id}`}>Subtitle</Label>
              <Input id={`dec-sub-${pkg.id}`} value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`dec-badge-${pkg.id}`}>Badge</Label>
              <Input id={`dec-badge-${pkg.id}`} value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`dec-price-${pkg.id}`} required>Price (₹)</Label>
              <Input id={`dec-price-${pkg.id}`} type="number" value={String(form.price)} onChange={e => setForm(f => ({ ...f, price: e.target.value as any }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`dec-feat-${pkg.id}`}>Features (one per line)</Label>
              <textarea
                id={`dec-feat-${pkg.id}`}
                value={form.features}
                onChange={e => setForm(f => ({ ...f, features: e.target.value }))}
                rows={4}
                className="w-full border border-[#E8E2D8] rounded-xl px-3 py-2 text-sm resize-none bg-white"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor={`dec-img-${pkg.id}`}>Image URL or Path</Label>
              <div className="flex gap-2">
                <Input id={`dec-img-${pkg.id}`} value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="/image.jpg or https://..." className="flex-1" />
                <button type="button" onClick={() => setPreview(form.image_url)} className="px-3 rounded-xl border border-[#E8E2D8] text-xs font-medium text-[#737373] hover:border-[#C5A85C]">
                  Preview
                </button>
              </div>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden border border-[#E8E2D8] bg-[#F5EDD6] flex items-center justify-center">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" onError={() => setPreview('')} />
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#C5A85C]">
                  <ImageOff size={24} strokeWidth={1.4} />
                  <span className="text-xs text-[#A8A8A8]">Enter URL and click Preview</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} loading={saving} size="sm"><Check size={14} className="mr-1.5" /> Save</Button>
          <Button onClick={() => { setEditing(false); setForm({ ...pkg, features: pkg.features.join('\n') }) }} variant="secondary" size="sm"><X size={14} className="mr-1" /> Cancel</Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl border ${pkg.is_active ? 'border-[#E8E2D8] bg-white' : 'border-[#E8E2D8] bg-[#FAFAFA] opacity-60'} overflow-hidden shadow-sm`}>
      <div className="aspect-video relative overflow-hidden bg-[#F5EDD6]">
        {pkg.image_url ? (
          <img src={pkg.image_url} alt={pkg.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff size={28} className="text-[#C5A85C]" strokeWidth={1.2} />
          </div>
        )}
        {!pkg.is_active && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="px-3 py-1 bg-[#1A1A1A] text-white text-xs font-bold rounded-full">INACTIVE</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-[#1A1A1A]/80 text-[#C5A85C] text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-sm">
            {pkg.badge}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-[#1A1A1A]">{pkg.title}</h3>
            <p className="text-xs text-[#737373] mt-0.5">{pkg.subtitle}</p>
            <p className="text-base font-bold text-[#1A1A1A] mt-2">
              ₹{pkg.price.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-[#F5EDD6] text-[#737373] hover:text-[#C5A85C] transition-all">
              <Pencil size={14} />
            </button>
            <button onClick={toggleActive} className="p-1.5 rounded-lg hover:bg-[#F5EDD6] text-[#737373] hover:text-[#C5A85C] transition-all">
              {pkg.is_active ? <ToggleRight size={18} className="text-[#C5A85C]" /> : <ToggleLeft size={18} />}
            </button>
          </div>
        </div>
        {pkg.features?.length > 0 && (
          <ul className="mt-3 space-y-1">
            {pkg.features.slice(0, 3).map((f, i) => (
              <li key={i} className="text-[11px] text-[#737373] flex items-start gap-1.5">
                <span className="text-[#C5A85C] mt-0.5">✦</span> {f}
              </li>
            ))}
            {pkg.features.length > 3 && <li className="text-[11px] text-[#A8A8A8]">+{pkg.features.length - 3} more</li>}
          </ul>
        )}
      </div>
    </div>
  )
}

export default function AdminDecorationPackagesPage() {
  const [packages, setPackages] = useState<DecorPkg[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/decoration-packages')
    const data = await res.json()
    setPackages(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function handleSave(updated: DecorPkg) {
    setPackages(prev => prev.map(p => p.id === updated.id ? updated : p))
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption text-[#C9A84C] mb-1">Configuration</p>
        <h1 className="text-headline">Decoration Packages</h1>
        <p className="mt-1 text-sm text-[#737373]">
          Manage the Silver, Gold, Platinum and Luxury decoration tiers shown in the booking wizard Step 3. Changes reflect immediately for new bookings.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#C5A85C]" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {packages.map(pkg => (
            <DecorCard key={pkg.id} pkg={pkg} onSave={handleSave} />
          ))}
        </div>
      )}

      <div className="p-4 bg-[#FFFDF5] border border-[#E8D9A8] rounded-xl text-xs text-[#737373]">
        <strong className="text-[#A08040]">Note:</strong> These are separate from <em>Decoration Themes</em> (visual themes used in the Themes section). These packages (Silver, Gold, Platinum, Luxury) are the booking wizard pricing tiers. The prices here are used only in the final estimated total calculation.
      </div>
    </div>
  )
}
