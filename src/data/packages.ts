import type { TourPackage } from '../types/booking'

export const PACKAGES: TourPackage[] = [
  { id: 'goa', name: 'Goa Getaway', pricePerTraveller: 8999, durationDays: 3 },
  { id: 'kerala', name: 'Kerala Backwaters', pricePerTraveller: 15999, durationDays: 5 },
  { id: 'manali', name: 'Manali Adventure', pricePerTraveller: 12999, durationDays: 4 },
  { id: 'rajasthan', name: 'Rajasthan Heritage', pricePerTraveller: 21999, durationDays: 6 },
]

export const DEFAULT_SUPPORT_PHONE = '+91 98765 43210'
export const DEFAULT_SUPPORT_EMAIL = 'tours@example.com'
