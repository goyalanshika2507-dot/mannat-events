'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Search } from 'lucide-react'

export function AdminSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSearch = searchParams.get('search') || ''
  const currentStatus = searchParams.get('status') || ''

  const [query, setQuery] = useState(currentSearch)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (currentStatus) params.set('status', currentStatus)
    if (query.trim()) params.set('search', query.trim())
    
    router.push(`/admin?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-sm w-full relative">
      <div className="relative w-full">
        <Input
          placeholder="Search by ID or Guest UUID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A8A8] pointer-events-none">
          <Search size={16} />
        </div>
      </div>
      <Button type="submit" variant="secondary" className="px-5">
        Search
      </Button>
    </form>
  )
}
