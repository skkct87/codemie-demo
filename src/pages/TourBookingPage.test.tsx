import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TourBookingPage from './TourBookingPage'

describe('TourBookingPage footer (CCD-49)', () => {
  it('renders the exact footer copy from AC5.1', () => {
    const { container } = render(<TourBookingPage />)

    const footers = container.querySelectorAll('footer')
    expect(footers).toHaveLength(1)
    expect(footers[0].textContent).toBe('© Tour Booking - Single Page Demo')
  })
})
