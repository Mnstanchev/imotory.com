import { NextRequest } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { createResponse } from '@/src/lib/api-utils'

export async function GET() {
  try {
    const propertyTypes = [
      { value: 'APARTMENT', label: { en: 'Apartment', bg: 'Апартамент', ru: 'Квартира' } },
      { value: 'HOUSE', label: { en: 'House', bg: 'Къща', ru: 'Дом' } },
      { value: 'VILLA', label: { en: 'Villa', bg: 'Вила', ru: 'Вилла' } },
      { value: 'STUDIO', label: { en: 'Studio', bg: 'Студио', ru: 'Студия' } },
      { value: 'OFFICE', label: { en: 'Office', bg: 'Офис', ru: 'Офис' } },
      { value: 'COMMERCIAL', label: { en: 'Commercial', bg: 'Търговски', ru: 'Коммерческая' } },
      { value: 'LAND', label: { en: 'Land', bg: 'Земя', ru: 'Земля' } }
    ]

    return createResponse({ propertyTypes })
  } catch (error) {

    return createResponse({ propertyTypes: [] })
  }
}