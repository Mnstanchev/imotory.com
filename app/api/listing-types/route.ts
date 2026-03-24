import { NextRequest } from 'next/server'
import { createResponse } from '@/src/lib/api-utils'

export async function GET() {
  try {
    const listingTypes = [
      { value: 'SALE', label: { en: 'For Sale', bg: 'За продажба', ru: 'Продается' } },
      { value: 'RENT', label: { en: 'For Rent', bg: 'Под наем', ru: 'Сдается' } }
    ]

    return createResponse({ listingTypes })
  } catch (error) {

    return createResponse({ listingTypes: [] })
  }
}