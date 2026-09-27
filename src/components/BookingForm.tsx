import { useState } from 'react'
import { PACKAGES } from '../data/packages'

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

  function handleConfirm() {
    if (!name.trim() || !mobile.trim() || !email.trim() || !travelDate) {
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
          <input
            id="date"
            type="date"
            value={travelDate}
            onChange={(e) => onTravelDateChange(e.target.value)}
          />
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
