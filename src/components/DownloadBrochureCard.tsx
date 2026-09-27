import { useState } from 'react'
import Card from './Card'
import { selectBrochureData } from '../lib/brochureSelector'
import { saveBrochurePdf } from '../lib/brochurePdf'
import type { BookingState } from '../types/booking'

interface DownloadBrochureCardProps {
  booking: BookingState
}

export default function DownloadBrochureCard({ booking }: DownloadBrochureCardProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDownload() {
    setError(null)
    setIsGenerating(true)

    try {
      const data = selectBrochureData(booking)
      await saveBrochurePdf(data)
    } catch {
      setError('Could not generate the brochure. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card title="Download Brochure">
      <button
        className="btn btn-primary"
        type="button"
        onClick={handleDownload}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Download Brochure'}
      </button>
      <p className="muted small">(Demo file generated in-browser)</p>
      {error && (
        <div className="error-text" role="alert">
          {error}
        </div>
      )}
    </Card>
  )
}
