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

describe('TourBookingPage header branding (CCD-50)', () => {
  it('shows "XYZ-Tour Company" inside the header, above a single h1', () => {
    const { container } = render(<TourBookingPage />)

    const header = container.querySelector('header')
    expect(header).not.toBeNull()

    const company = header!.querySelector('.company-name')
    expect(company?.textContent).toBe('XYZ-Tour Company')
    expect(company?.tagName).toBe('DIV')
    expect(company?.closest('h1, h2, h3, h4, h5, h6')).toBeNull()

    expect(container.querySelectorAll('h1')).toHaveLength(1)
    const h1 = header!.querySelector('h1')
    expect(h1).not.toBeNull()
    expect(company!.compareDocumentPosition(h1!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
