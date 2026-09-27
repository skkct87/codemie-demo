import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import DownloadBrochureCard from './DownloadBrochureCard'
import * as brochurePdf from '../lib/brochurePdf'
import type { BookingState } from '../types/booking'

const booking: BookingState = {
  packageName: 'Goa Getaway',
  pricePerTraveller: 8999,
  travellers: 2,
  durationDays: 3,
  supportPhone: '+91 98765 43210',
  supportEmail: 'tours@example.com',
}

describe('DownloadBrochureCard', () => {
  const alertSpy = vi.spyOn(window, 'alert')

  beforeEach(() => {
    alertSpy.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the button and the helper caption', () => {
    render(<DownloadBrochureCard booking={booking} />)

    expect(screen.getByRole('button', { name: 'Download Brochure' })).toBeInTheDocument()
    expect(screen.getByText('Download brochure')).toBeInTheDocument()
  })

  it('generates and saves the PDF when clicked', async () => {
    const saveSpy = vi.spyOn(brochurePdf, 'saveBrochurePdf').mockResolvedValue(undefined)
    const user = userEvent.setup()

    render(<DownloadBrochureCard booking={booking} />)
    await user.click(screen.getByRole('button', { name: 'Download Brochure' }))

    await waitFor(() => expect(saveSpy).toHaveBeenCalledTimes(1))
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({ packageName: 'Goa Getaway', duration: '3 days' }),
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(alertSpy).not.toHaveBeenCalled()
  })

  it('shows a non-blocking inline error instead of alert() when generation fails', async () => {
    vi.spyOn(brochurePdf, 'saveBrochurePdf').mockRejectedValue(new Error('boom'))
    const user = userEvent.setup()

    render(<DownloadBrochureCard booking={booking} />)
    await user.click(screen.getByRole('button', { name: 'Download Brochure' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Could not generate the brochure. Please try again.',
    )
    expect(alertSpy).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Download Brochure' })).toBeEnabled()
  })
})
