export interface TourPackage {
  id: string
  name: string
  pricePerTraveller: number
  durationDays?: number
}

export interface BookingState {
  packageName: string
  pricePerTraveller: number
  travellers: number
  durationDays?: number
  startDate?: string
  endDate?: string
  supportPhone?: string
  supportEmail?: string
}

export interface BrochureData {
  packageName: string
  duration: string
  travellers: number
  pricePerTraveller: number
  totalPrice: number
  supportPhone: string
  supportEmail: string
}
