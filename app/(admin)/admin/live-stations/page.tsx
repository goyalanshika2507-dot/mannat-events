'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2, ToggleLeft, ToggleRight, ChevronDown, ChevronRight, Flame } from 'lucide-react'

interface LiveStation {
  id: string
  label: string
  is_active: boolean
  sort_order: number
  items?: string[]
}

export default function AdminLiveStationsPage() {
  const [stations, setStations] = useState<LiveStation[]>([])
  const [stationItems, setStationItems] = useState<any[]>([])
  const [pkgStations, setPkgStations] = useState<any[]>([])
  const [pkgs, setPkgs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const load = useCallback(async () => {
    setLoading(true)
    const [sRes, siRes, psRes, pkgRes] = await Promise.all([
      fetch('/api/admin/menu-categories'), // reuse mockDb via direct query
      fetch('/api/supabase-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table: 'live_stations', action: 'select', filters: [], sortColumn: 'sort_order', sortAscending: true }) }),
      fetch('/api/supabase-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table: 'live_station_items', action: 'select', filters: [], sortColumn: 'sort_order', sortAscending: true }) }),
      fetch('/api/supabase-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table: 'package_live_stations', action: 'select', filters: [] }) }),
    ])

    const stationsData = (await siRes.json()).data ?? []
    const itemsData = (await psRes.json()).data ?? []
    const pkgStationsData = (await pkgRes.json()).data ?? []
    const pkgsRes = await fetch('/api/admin/banquet-packages')
    const pkgsData = await pkgsRes.json()

    setStations(stationsData)
    setStationItems(itemsData)
    setPkgStations(pkgStationsData)
    setPkgs(pkgsData ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function toggleActive(station: LiveStation) {
    await fetch('/api/supabase-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'live_stations', action: 'update', filters: [{ type: 'eq', column: 'id', value: station.id }], updates: { is_active: !station.is_active } }),
    })
    setStations(prev => prev.map(s => s.id === station.id ? { ...s, is_active: !s.is_active } : s))
  }

  function toggleExpand(id: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const getStationItems = (stationId: string) =>
    stationItems.filter(i => i.station_id === stationId).sort((a: any, b: any) => a.sort_order - b.sort_order)

  const getStationPackages = (stationId: string) =>
    pkgStations
      .filter(ps => ps.station_id === stationId)
      .map(ps => pkgs.find((p: any) => p.id === ps.package_id))
      .filter(Boolean)

  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption text-[#C9A84C] mb-1">Menu Management</p>
        <h1 className="text-headline">Live Stations</h1>
        <p className="mt-1 text-sm text-[#737373]">
          Live cooking stations included with banquet packages. Toggle to enable/disable.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#C5A85C]" /></div>
      ) : (
        <div className="space-y-3">
          {stations.map(station => {
            const items = getStationItems(station.id)
            const relatedPkgs = getStationPackages(station.id)
            const isExpanded = expanded.has(station.id)

            return (
              <div key={station.id} className={`rounded-2xl border ${station.is_active ? 'border-[#E8E2D8] bg-white' : 'border-[#E8E2D8] bg-[#FAFAFA] opacity-60'} overflow-hidden`}>
                <div className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F5EDD6] flex items-center justify-center text-[#A08040]">
                      <Flame size={15} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A1A1A] text-sm">{station.label}</h3>
                      <p className="text-[11px] text-[#A8A8A8]">{items.length} items · {relatedPkgs.length} packages</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleActive(station)} className="p-1.5 rounded-lg hover:bg-[#F5EDD6] text-[#737373] hover:text-[#C5A85C] transition-all">
                      {station.is_active ? <ToggleRight size={18} className="text-[#C5A85C]" /> : <ToggleLeft size={18} />}
                    </button>
                    <button onClick={() => toggleExpand(station.id)} className="p-1.5 rounded-lg hover:bg-[#F5EDD6] text-[#737373] transition-all">
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t border-[#F0EDE8] px-5 py-4 grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#A8A8A8] mb-2">Station Items</p>
                      <ul className="space-y-1">
                        {items.map(item => (
                          <li key={item.id} className="text-sm text-[#1A1A1A] flex items-center gap-1.5">
                            <span className="text-[#C5A85C] text-xs">•</span> {item.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#A8A8A8] mb-2">Included In Packages</p>
                      <ul className="space-y-1">
                        {relatedPkgs.map((pkg: any) => (
                          <li key={pkg.id} className="text-sm text-[#1A1A1A] flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${pkg.meal_type === 'veg' ? 'bg-green-500' : 'bg-red-500'}`} /> {pkg.name}
                          </li>
                        ))}
                        {relatedPkgs.length === 0 && <li className="text-xs text-[#A8A8A8]">Not assigned to any packages</li>}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
