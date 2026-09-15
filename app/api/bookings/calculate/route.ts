import { NextRequest, NextResponse } from 'next/server'
import { calculateBookingEstimate } from '@/lib/utils/pricingCalculator'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = calculateBookingEstimate(body)

    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to calculate booking estimate' }, { status: 500 })
  }
}
