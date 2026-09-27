import Card from './Card'
import type { BookingState } from '../types/booking'

function formatINR(amount: number): string {
  return `₹ ${amount.toLocaleString('en-IN')}`
}

interface TourSummaryCardProps {
  booking: BookingState
}

export default function TourSummaryCard({ booking }: TourSummaryCardProps) {
  const total = booking.pricePerTraveller * booking.travellers

  return (
    <Card title="Tour Summary">
      <div className="summary">
        <div className="pill">{booking.packageName}</div>
        <div className="price">{formatINR(total)}</div>
        <div className="muted">
          For {booking.travellers} traveller{booking.travellers > 1 ? 's' : ''}
        </div>
      </div>
    </Card>
  )
}
