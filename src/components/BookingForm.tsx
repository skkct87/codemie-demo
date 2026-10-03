import { useRef, useState } from 'react'
import { PACKAGES } from '../data/packages'
import { isoToDisplay, parseTravelDate, todayIso } from '../lib/travelDate'

interface BookingFormProps {
  packageId: string
  travellers: number
  travelDate: string
  onPackageChange: (packageId: string) => void
  onTravellersChange: (travellers: number) => void
  onTravelDateChange: (travelDate: string) => void
}

export default function BookingForm({
  packageId,
  travellers,
  travelDate,
  onPackageChange,
  onTravellersChange,
  onTravelDateChange,
}: BookingFormProps) {
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null)
  const [dateText, setDateText] = useState('')
  const [dateError, setDateError] = useState<string | null>(null)
  const datePickerRef = useRef<HTMLInputElement>(null)

  function handleDateTextChange(text: string) {
    setDateText(text)
    const result = parseTravelDate(text)
    onTravelDateChange(result.ok ? result.iso : '')
    if (result.ok) setDateError(null)
  }

  function handleDateBlur() {
    if (!dateText.trim()) {
      setDateError(null)
      return
    }
    const result = parseTravelDate(dateText)
    setDateError(result.ok ? null : result.error)
  }

  function handleDatePicked(iso: string) {
    if (!iso) return
    handleDateTextChange(isoToDisplay(iso))
  }

  function openDatePicker() {
    const picker = datePickerRef.current
    if (!picker) return
    if (typeof picker.showPicker === 'function') picker.showPicker()
    else picker.focus()
  }

  function handleConfirm() {
    const dateResult = parseTravelDate(dateText)
    if (dateText.trim() && !dateResult.ok) {
      setDateError(dateResult.error)
      setMessage(null)
      return
    }

    if (!name.trim() || !mobile.trim() || !email.trim() || !dateText.trim()) {
      setMessage({ text: 'Please fill Name, Mobile, Email, and Travel Date.', isError: true })
      return
    }

    setMessage({ text: 'Booking Confirmed', isError: false })
  }

  function handleReset() {
    setName('')
    setMobile('')
    setEmail('')
    setNotes('')
    setMessage(null)
    setDateText('')
    setDateError(null)
    onTravellersChange(1)
    onTravelDateChange('')
    onPackageChange(PACKAGES[0].id)
  }

  return (
    <div className="card">
      <h2>Book Your Tour</h2>
      <p className="muted">Fill details and confirm booking.</p>

      <div className="row">
        <div>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="mobile">Mobile</label>
          <input
            id="mobile"
            type="tel"
            placeholder="e.g. 9876543210"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>
      </div>

      <div className="row">
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="package">Tour Package</label>
          <select id="package" value={packageId} onChange={(e) => onPackageChange(e.target.value)}>
            {PACKAGES.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} ({pkg.durationDays} Days)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        <div>
          <label htmlFor="date">Travel Date</label>
          <div className="date-field">
            <input
              id="date"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="dd-mm-yyyy"
              maxLength={10}
              value={dateText}
              aria-invalid={dateError ? true : undefined}
              aria-describedby={dateError ? 'date-error' : undefined}
              onChange={(e) => handleDateTextChange(e.target.value)}
              onBlur={handleDateBlur}
            />
            <button
              type="button"
              className="date-picker-btn"
              aria-label="Open calendar"
              onClick={openDatePicker}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </button>
            <input
              ref={datePickerRef}
              id="date-picker"
              className="date-native"
              type="date"
              tabIndex={-1}
              aria-hidden="true"
              min={todayIso()}
              value={travelDate}
              onChange={(e) => handleDatePicked(e.target.value)}
            />
          </div>
          {dateError && (
            <div id="date-error" className="error-text" role="alert">
              {dateError}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="travellers">Travellers</label>
          <input
            id="travellers"
            type="number"
            min={1}
            value={travellers}
            onChange={(e) => onTravellersChange(Math.max(1, parseInt(e.target.value, 10) || 1))}
          />
        </div>
      </div>

      <label htmlFor="notes">Notes (optional)</label>
      <textarea
        id="notes"
        placeholder="Pickup city, hotel preference, etc."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button className="btn btn-primary" type="button" onClick={handleConfirm}>
        Confirm Booking
      </button>
      <button
        className="btn btn-outline"
        type="button"
        style={{ marginLeft: 8 }}
        onClick={handleReset}
      >
        Reset
      </button>

      {message && (
        <div className={message.isError ? 'error-text' : 'success-text'} style={{ marginTop: 12 }}>
          {message.text}
        </div>
      )}
    </div>
  )
}
