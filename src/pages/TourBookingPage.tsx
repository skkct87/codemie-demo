import { useMemo, useState } from 'react'
import BookingForm from '../components/BookingForm'
import TourSummaryCard from '../components/TourSummaryCard'
import DownloadBrochureCard from '../components/DownloadBrochureCard'
import SupportCard from '../components/SupportCard'
import { PACKAGES, DEFAULT_SUPPORT_EMAIL, DEFAULT_SUPPORT_PHONE } from '../data/packages'
import type { BookingState } from '../types/booking'

export default function TourBookingPage() {
  const [packageId, setPackageId] = useState(PACKAGES[0].id)
  const [travellers, setTravellers] = useState(1)
  const [travelDate, setTravelDate] = useState('')

  const booking: BookingState = useMemo(() => {
    const selectedPackage = PACKAGES.find((pkg) => pkg.id === packageId) ?? PACKAGES[0]

    return {
      packageName: selectedPackage.name,
      pricePerTraveller: selectedPackage.pricePerTraveller,
      durationDays: selectedPackage.durationDays,
      travellers,
      startDate: travelDate || undefined,
      supportPhone: DEFAULT_SUPPORT_PHONE,
      supportEmail: DEFAULT_SUPPORT_EMAIL,
    }
  }, [packageId, travellers, travelDate])

  return (
    <>
      <header className="app-header">
        <div className="header-inner">
          <div className="company-name">XYZ-Tour Company</div>
          <h1 className="app-title">Tour Booking</h1>
        </div>
      </header>

      <div className="container">
        <div className="grid">
          <BookingForm
            packageId={packageId}
            travellers={travellers}
            travelDate={travelDate}
            onPackageChange={setPackageId}
            onTravellersChange={setTravellers}
            onTravelDateChange={setTravelDate}
          />

          <div className="right-column">
            <TourSummaryCard booking={booking} />
            <DownloadBrochureCard booking={booking} />
            <SupportCard booking={booking} />
          </div>
        </div>
      </div>

      <footer>© Tour Booking - Single Page Demo</footer>
    </>
  )
}
