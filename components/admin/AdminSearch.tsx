'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Search } from 'lucide-react'

export function AdminSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentStatus = searchParams.get('status') || ''

  const [bookingId, setBookingId] = useState(
    searchParams.get('bookingId') || ''
  )
  const [email, setEmail] = useState(
    searchParams.get('email') || ''
  )
  const [from, setFrom] = useState(
    searchParams.get('from') || ''
  )
  const [to, setTo] = useState(
    searchParams.get('to') || ''
  )

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()

    const params = new URLSearchParams()

    if (currentStatus) params.set('status', currentStatus)
    if (bookingId.trim()) params.set('bookingId', bookingId.trim())
    if (email.trim()) params.set('email', email.trim())
    if (from) params.set('from', from)
    if (to) params.set('to', to)

    const query = params.toString()
    router.push(query ? `/admin?${query}` : '/admin')
  }

  function handleClear() {
    setBookingId('')
    setEmail('')
    setFrom('')
    setTo('')

    const params = new URLSearchParams()

    if (currentStatus) {
      params.set('status', currentStatus)
    }

    const query = params.toString()
    router.push(query ? `/admin?${query}` : '/admin')
  }

  return (
    <form
      onSubmit={handleSearch}
      className="w-full space-y-3"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="relative">
          <Input
            placeholder="Booking ID"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="pl-10"
          />

          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A8A8] pointer-events-none"
          />
        </div>

        <Input
          type="email"
          placeholder="Customer email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          aria-label="From date"
        />

        <Input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          aria-label="To date"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" variant="secondary">
          Apply Filters
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={handleClear}
        >
          Clear
        </Button>
      </div>
    </form>
  )
}