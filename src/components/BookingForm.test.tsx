import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import BookingForm from './BookingForm'
import { PACKAGES } from '../data/packages'
import { todayIso } from '../lib/travelDate'

function dmyFromToday(offsetDays: number) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`
}

function Harness({ onDate }: { onDate?: (iso: string) => void }) {
  const [packageId, setPackageId] = useState(PACKAGES[0].id)
  const [travellers, setTravellers] = useState(1)
  const [travelDate, setTravelDate] = useState('')
  return (
    <BookingForm
      packageId={packageId}
      travellers={travellers}
      travelDate={travelDate}
      onPackageChange={setPackageId}
      onTravellersChange={setTravellers}
      onTravelDateChange={(iso) => {
        setTravelDate(iso)
        onDate?.(iso)
      }}
    />
  )
}

async function fillContact(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Full Name'), 'Jane Doe')
  await user.type(screen.getByLabelText('Mobile'), '9876543210')
  await user.type(screen.getByLabelText('Email'), 'jane@example.com')
}

describe('BookingForm Travel Date (CCD-47)', () => {
  it('shows the dd-mm-yyyy placeholder and an accessible calendar button', () => {
    render(<Harness />)

    expect(screen.getByLabelText('Travel Date')).toHaveAttribute('placeholder', 'dd-mm-yyyy')
    expect(screen.getByRole('button', { name: 'Open calendar' })).toBeInTheDocument()
  })

  it('opens the native date picker with a minimum of today when the icon is clicked', async () => {
    const showPicker = vi.fn()
    HTMLInputElement.prototype.showPicker = showPicker
    const user = userEvent.setup()
    render(<Harness />)

    await user.click(screen.getByRole('button', { name: 'Open calendar' }))

    expect(showPicker).toHaveBeenCalledTimes(1)
    expect(document.getElementById('date-picker')).toHaveAttribute('min', todayIso())
  })

  it('fills the input as dd-mm-yyyy when a date is picked', async () => {
    const onDate = vi.fn()
    render(<Harness onDate={onDate} />)
    const picker = document.getElementById('date-picker') as HTMLInputElement
    const target = dmyFromToday(20)
    const [dd, mm, yyyy] = target.split('-')

    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!
    setter.call(picker, `${yyyy}-${mm}-${dd}`)
    picker.dispatchEvent(new Event('input', { bubbles: true }))

    expect(screen.getByLabelText('Travel Date')).toHaveValue(target)
    expect(onDate).toHaveBeenLastCalledWith(`${yyyy}-${mm}-${dd}`)
  })

  it('confirms the booking for a valid future dd-mm-yyyy date', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await fillContact(user)
    await user.type(screen.getByLabelText('Travel Date'), dmyFromToday(10))
    await user.click(screen.getByRole('button', { name: 'Confirm Booking' }))

    expect(screen.getByText('Booking Confirmed')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it.each([
    ['2027-12-01', 'Enter the travel date in dd-mm-yyyy format.'],
    ['31-02-2099', 'Enter a valid date.'],
  ])('blocks Confirm Booking and shows an error for %s', async (value, error) => {
    const user = userEvent.setup()
    render(<Harness />)

    await fillContact(user)
    await user.type(screen.getByLabelText('Travel Date'), value)
    await user.click(screen.getByRole('button', { name: 'Confirm Booking' }))

    expect(screen.getByRole('alert')).toHaveTextContent(error)
    expect(screen.getByLabelText('Travel Date')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.queryByText('Booking Confirmed')).not.toBeInTheDocument()
  })

  it('rejects a past date and blocks Confirm Booking', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await fillContact(user)
    await user.type(screen.getByLabelText('Travel Date'), dmyFromToday(-1))
    await user.click(screen.getByRole('button', { name: 'Confirm Booking' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Travel date cannot be in the past.')
    expect(screen.queryByText('Booking Confirmed')).not.toBeInTheDocument()
  })

  it('still shows the required-fields message when the date is empty', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.click(screen.getByRole('button', { name: 'Confirm Booking' }))

    expect(screen.getByText('Please fill Name, Mobile, Email, and Travel Date.')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('clears the date and error on Reset', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const input = screen.getByLabelText('Travel Date')

    await user.type(input, 'bad')
    await user.tab()
    expect(screen.getByRole('alert')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reset' }))

    expect(input).toHaveValue('')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
