import Card from './Card'
import type { BookingState } from '../types/booking'

interface SupportCardProps {
  booking: BookingState
}

export default function SupportCard({ booking }: SupportCardProps) {
  return (
    <Card title="Support">
      <div className="muted">Working hours: 9:00 AM - 7:00 PM</div>
      <div className="muted">Phone: {booking.supportPhone || 'N/A'}</div>
      <div className="muted">Email: {booking.supportEmail || 'N/A'}</div>
    </Card>
  )
}
