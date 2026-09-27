import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { BrochureData } from '../types/booking'

const brochureData: BrochureData = {
  packageName: 'Goa Getaway',
  duration: '3 days',
  travellers: 2,
  pricePerTraveller: 8999,
  totalPrice: 17998,
  supportPhone: '+91 98765 43210',
  supportEmail: 'tours@example.com',
}

const textMock = vi.fn()
const setFontSizeMock = vi.fn()
const outputMock = vi.fn(() => new Blob(['pdf'], { type: 'application/pdf' }))
const jsPDFConstructorMock = vi.fn()

vi.mock('jspdf', () => {
  class MockJsPDF {
    text = textMock
    setFontSize = setFontSizeMock
    output = outputMock

    constructor() {
      jsPDFConstructorMock()
    }
  }

  return { jsPDF: MockJsPDF }
})

describe('createBrochurePdfBlob', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lazily imports jsPDF and returns a Blob built from the brochure data', async () => {
    const { createBrochurePdfBlob } = await import('./brochurePdf')

    const blob = await createBrochurePdfBlob(brochureData)

    expect(jsPDFConstructorMock).toHaveBeenCalledTimes(1)
    expect(textMock).toHaveBeenCalledWith(expect.stringContaining('Goa Getaway'), 14, expect.any(Number))
    expect(textMock).toHaveBeenCalledWith(expect.stringContaining('3 days'), 14, expect.any(Number))
    expect(textMock).toHaveBeenCalledWith(expect.stringContaining('+91 98765 43210'), 14, expect.any(Number))
    expect(outputMock).toHaveBeenCalledWith('blob')
    expect(blob).toBeInstanceOf(Blob)
  })
})

describe('saveBrochurePdf', () => {
  const createObjectURLMock = vi.fn(() => 'blob:mock-url')
  const revokeObjectURLMock = vi.fn()
  let clickMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    clickMock = vi.fn()
    URL.createObjectURL = createObjectURLMock
    URL.revokeObjectURL = revokeObjectURLMock
    HTMLAnchorElement.prototype.click = clickMock
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates a download link for the generated PDF blob', async () => {
    const { saveBrochurePdf } = await import('./brochurePdf')

    await saveBrochurePdf(brochureData)

    expect(createObjectURLMock).toHaveBeenCalledTimes(1)
    expect(clickMock).toHaveBeenCalledTimes(1)
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-url')
  })

  it('propagates errors when PDF generation fails', async () => {
    outputMock.mockImplementationOnce(() => {
      throw new Error('jsPDF failed')
    })

    const { saveBrochurePdf } = await import('./brochurePdf')

    await expect(saveBrochurePdf(brochureData)).rejects.toThrow('jsPDF failed')
    expect(createObjectURLMock).not.toHaveBeenCalled()
  })
})
