import type { BrochureData } from '../types/booking'

function formatCurrency(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-IN')}`
}

function buildLines(data: BrochureData): string[] {
  return [
    `Package: ${data.packageName}`,
    `Duration: ${data.duration}`,
    `Travellers: ${data.travellers}`,
    `Price per traveller: ${formatCurrency(data.pricePerTraveller)}`,
    `Total price: ${formatCurrency(data.totalPrice)}`,
    '',
    'Support',
    `Phone: ${data.supportPhone}`,
    `Email: ${data.supportEmail}`,
  ]
}

export async function createBrochurePdfBlob(data: BrochureData): Promise<Blob> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.text('Tour Brochure', 14, 20)

  doc.setFontSize(12)
  let y = 35
  for (const line of buildLines(data)) {
    doc.text(line, 14, y)
    y += 8
  }

  return doc.output('blob')
}

export async function saveBrochurePdf(
  data: BrochureData,
  filename = 'tour-brochure.pdf',
): Promise<void> {
  const blob = await createBrochurePdfBlob(data)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
