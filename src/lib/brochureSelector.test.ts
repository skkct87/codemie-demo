import { describe, expect, it } from 'vitest'
import { selectBrochureData } from './brochureSelector'
import type { BookingState } from '../types/booking'

const baseState: BookingState = {
  packageName: 'Goa Getaway',
  pricePerTraveller: 8999,
  travellers: 2,
  durationDays: 3,
  supportPhone: '+91 98765 43210',
  supportEmail: 'tours@example.com',
}

describe('selectBrochureData', () => {
  it('extracts brochure data from a fully populated booking state', () => {
    const data = selectBrochureData(baseState)

    expect(data).toEqual({
      packageName: 'Goa Getaway',
      duration: '3 days',
      travellers: 2,
      pricePerTraveller: 8999,
      totalPrice: 17998,
      supportPhone: '+91 98765 43210',
      supportEmail: 'tours@example.com',
    })
  })

  it('uses singular "day" when explicit duration is 1', () => {
    const data = selectBrochureData({ ...baseState, durationDays: 1 })

    expect(data.duration).toBe('1 day')
  })

  it('derives duration from start/end dates when no explicit duration is present', () => {
    const data = selectBrochureData({
      ...baseState,
      durationDays: undefined,
      startDate: '2026-01-01',
      endDate: '2026-01-04',
    })

    expect(data.duration).toBe('4 days')
  })

  it('falls back to N/A duration when neither explicit duration nor dates are present', () => {
    const data = selectBrochureData({
      ...baseState,
      durationDays: undefined,
      startDate: undefined,
      endDate: undefined,
    })

    expect(data.duration).toBe('N/A')
  })

  it('falls back to N/A duration when only a start date is present', () => {
    const data = selectBrochureData({
      ...baseState,
      durationDays: undefined,
      startDate: '2026-01-01',
      endDate: undefined,
    })

    expect(data.duration).toBe('N/A')
  })

  it('defaults travellers to 1 when missing or invalid', () => {
    const data = selectBrochureData({ ...baseState, travellers: 0 })

    expect(data.travellers).toBe(1)
    expect(data.totalPrice).toBe(8999)
  })

  it('falls back to N/A for missing support contact details', () => {
    const data = selectBrochureData({
      ...baseState,
      supportPhone: undefined,
      supportEmail: undefined,
    })

    expect(data.supportPhone).toBe('N/A')
    expect(data.supportEmail).toBe('N/A')
  })

  it('falls back to N/A for missing package name', () => {
    const data = selectBrochureData({ ...baseState, packageName: '' })

    expect(data.packageName).toBe('N/A')
  })
})
