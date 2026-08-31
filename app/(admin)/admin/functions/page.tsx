'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2, Pencil, Trash2, ToggleLeft, ToggleRight, Plus, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

interface WeddingFunction {
  id: string
  name: string
  type: 'lunch' | 'dinner' | 'both'
  is_active: boolean
  sort_order: number
}

export default function AdminFunctionsPage() {
  const [functions, setFunctions] = useState<WeddingFunction[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<'lunch' | 'dinner' | 'both'>('both')
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editType, setEditType] = useState<'lunch' | 'dinner' | 'both'>('both')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/wedding-functions')
    const data = await res.json()
    setFunctions(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleAdd() {
    if (!newName.trim()) return
    setSaving(true)
    await fetch('/api/admin/wedding-functions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim(), type: newType, sort_order: functions.length + 1 }),
    })
    setNewName('')
    setNewType('both')
    setAdding(false)
    setSaving(false)
    load()
  }

  async function toggleActive(fn: WeddingFunction) {
    await fetch('/api/admin/wedding-functions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: fn.id, is_active: !fn.is_active }),
    })
    setFunctions(prev => prev.map(f => f.id === fn.id ? { ...f, is_active: !f.is_active } : f))
  }

  async function saveEdit(fn: WeddingFunction) {
    await fetch('/api/admin/wedding-functions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: fn.id, name: editName, type: editType }),
    })
    setFunctions(prev => prev.map(f => f.id === fn.id ? { ...f, name: editName, type: editType } : f))
    setEditId(null)
  }

  async function handleDelete(fn: WeddingFunction) {
    if (!confirm(`Delete function "${fn.name}"?`)) return
    await fetch('/api/admin/wedding-functions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: fn.id }),
    })
    setFunctions(prev => prev.filter(f => f.id !== fn.id))
  }

  const typeBadge = (type: string) => {
    if (type === 'lunch') return 'bg-amber-50 text-amber-700 border-amber-200'
    if (type === 'dinner') return 'bg-indigo-50 text-indigo-700 border-indigo-200'
    return 'bg-[#F5EDD6] text-[#A08040] border-[#E8D9A8]'
  }

  const typeLabel = (type: string) => {
    if (type === 'lunch') return 'Lunch only'
    if (type === 'dinner') return 'Dinner only'
    return 'Both meals'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-caption text-[#C9A84C] mb-1">Configuration</p>
          <h1 className="text-headline">Event Functions</h1>
          <p className="mt-1 text-sm text-[#737373]">
            Manage lunch and dinner function dropdown options shown in the booking wizard Day Planning step.
          </p>
        </div>
        <Button onClick={() => setAdding(true)}>
          <Plus size={16} className="mr-1.5" /> Add Function
        </Button>
      </div>

      {adding && (
        <div className="bg-[#FDFCFA] border border-[#E8E2D8] rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold text-[#1A1A1A] text-sm">Add New Function</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="fn-name" required>Function Name</Label>
              <Input id="fn-name" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Phere" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fn-type" required>Meal Type</Label>
              <select id="fn-type" value={newType} onChange={e => setNewType(e.target.value as any)}
                className="w-full border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-sm bg-white">
                <option value="both">Both (Lunch & Dinner)</option>
                <option value="lunch">Lunch only</option>
                <option value="dinner">Dinner only</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} loading={saving} size="sm"><Check size={14} className="mr-1.5" /> Add</Button>
            <Button onClick={() => { setAdding(false); setNewName(''); setNewType('both') }} variant="secondary" size="sm"><X size={14} className="mr-1" /> Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#C5A85C]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#E8E2D8] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F8F5EF] border-b border-[#E8E2D8]">
              <tr>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#737373]">Function Name</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#737373]">Appears In</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#737373]">Status</th>
                <th className="text-right px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#737373]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDE8]">
              {functions.length === 0 && (
                <tr><td colSpan={4} className="text-center py-10 text-[#A8A8A8] text-sm">No functions configured.</td></tr>
              )}
              {functions.map(fn => (
                <tr key={fn.id} className={`${!fn.is_active ? 'opacity-50' : ''} hover:bg-[#FDFCFA] transition-colors`}>
                  <td className="px-4 py-3">
                    {editId === fn.id ? (
                      <div className="flex items-center gap-2">
                        <input value={editName} onChange={e => setEditName(e.target.value)}
                          className="border border-[#E8E2D8] rounded-lg px-2 py-1 text-sm flex-1"
                          onKeyDown={e => { if (e.key === 'Enter') saveEdit(fn); if (e.key === 'Escape') setEditId(null) }}
                          autoFocus />
                        <select value={editType} onChange={e => setEditType(e.target.value as any)}
                          className="border border-[#E8E2D8] rounded-lg px-2 py-1 text-sm">
                          <option value="both">Both</option>
                          <option value="lunch">Lunch</option>
                          <option value="dinner">Dinner</option>
                        </select>
                        <button onClick={() => saveEdit(fn)} className="text-green-600 hover:text-green-800"><Check size={14} /></button>
                        <button onClick={() => setEditId(null)} className="text-[#737373] hover:text-red-500"><X size={14} /></button>
                      </div>
                    ) : (
                      <span className="font-medium text-[#1A1A1A]">{fn.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full border ${typeBadge(fn.type)}`}>
                      {typeLabel(fn.type)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold ${fn.is_active ? 'text-green-700' : 'text-[#A8A8A8]'}`}>
                      {fn.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setEditId(fn.id); setEditName(fn.name); setEditType(fn.type) }} className="p-1.5 rounded-lg hover:bg-[#F5EDD6] text-[#737373] hover:text-[#C5A85C] transition-all"><Pencil size={13} /></button>
                      <button onClick={() => toggleActive(fn)} className="p-1.5 rounded-lg hover:bg-[#F5EDD6] text-[#737373] hover:text-[#C5A85C] transition-all">
                        {fn.is_active ? <ToggleRight size={16} className="text-[#C5A85C]" /> : <ToggleLeft size={16} />}
                      </button>
                      <button onClick={() => handleDelete(fn)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#737373] hover:text-red-500 transition-all"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
