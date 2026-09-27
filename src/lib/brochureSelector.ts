import type { BookingState, BrochureData } from '../types/booking'

const MS_PER_DAY = 24 * 60 * 60 * 1000

function deriveDuration(state: BookingState): string {
  if (state.durationDays && state.durationDays > 0) {
    return `${state.durationDays} day${state.durationDays > 1 ? 's' : ''}`
  }

  if (state.startDate && state.endDate) {
    const start = new Date(state.startDate)
    const end = new Date(state.endDate)
    const diffDays = Math.round((end.getTime() - start.getTime()) / MS_PER_DAY) + 1

    if (Number.isFinite(diffDays) && diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`
    }
  }

  return 'N/A'
}

export function selectBrochureData(state: BookingState): BrochureData {
  const travellers = state.travellers > 0 ? state.travellers : 1
  const pricePerTraveller = state.pricePerTraveller > 0 ? state.pricePerTraveller : 0

  return {
    packageName: state.packageName || 'N/A',
    duration: deriveDuration(state),
    travellers,
    pricePerTraveller,
    totalPrice: pricePerTraveller * travellers,
    supportPhone: state.supportPhone || 'N/A',
    supportEmail: state.supportEmail || 'N/A',
  }
}
