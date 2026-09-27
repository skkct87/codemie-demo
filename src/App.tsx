import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import TourBookingPage from './pages/TourBookingPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tour-booking" replace />} />
        <Route path="/tour-booking" element={<TourBookingPage />} />
      </Routes>
    </BrowserRouter>
  )
}
