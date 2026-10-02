import type { Locator, Page } from '@playwright/test'

export class TourBookingPage {
  readonly page: Page

  readonly bookYourTourHeading: Locator
  readonly tourSummaryHeading: Locator
  readonly downloadBrochureHeading: Locator
  readonly supportHeading: Locator

  readonly nameInput: Locator
  readonly mobileInput: Locator
  readonly emailInput: Locator
  readonly packageSelect: Locator
  readonly dateInput: Locator
  readonly travellersInput: Locator
  readonly notesInput: Locator

  readonly confirmBookingButton: Locator
  readonly resetButton: Locator
  readonly downloadBrochureButton: Locator
  readonly bookingMessage: Locator

  readonly supportCard: Locator
  readonly downloadBrochureCard: Locator
  readonly downloadBrochureSubtext: Locator

  readonly packagePill: Locator
  readonly priceText: Locator
  readonly travellerCalcText: Locator

  constructor(page: Page) {
    this.page = page

    this.bookYourTourHeading = page.getByRole('heading', { name: 'Book Your Tour' })
    this.tourSummaryHeading = page.getByRole('heading', { name: 'Tour Summary' })
    this.downloadBrochureHeading = page.getByRole('heading', { name: 'Download Brochure' })
    this.supportHeading = page.getByRole('heading', { name: 'Support' })

    // Labels in this static page are not programmatically associated (no
    // `for`/id pairing), so getByLabel cannot resolve them. Fall back to
    // placeholder text, and to id selectors for fields without one.
    this.nameInput = page.getByPlaceholder('Enter your name')
    this.mobileInput = page.getByPlaceholder('e.g. 9876543210')
    this.emailInput = page.getByPlaceholder('Enter email')
    this.packageSelect = page.getByRole('combobox')
    this.dateInput = page.locator('#date')
    this.travellersInput = page.locator('#travellers')
    this.notesInput = page.getByPlaceholder('Pickup city, hotel preference, etc.')

    this.confirmBookingButton = page.getByRole('button', { name: 'Confirm Booking' })
    this.resetButton = page.getByRole('button', { name: 'Reset' })
    this.downloadBrochureButton = page.getByRole('button', { name: 'Download Brochure' })
    this.bookingMessage = page.locator('#message')

    this.supportCard = page.locator('.box').filter({ has: this.supportHeading })
    this.downloadBrochureCard = page.locator('.box').filter({ has: this.downloadBrochureHeading })
    this.downloadBrochureSubtext = this.downloadBrochureCard.getByText('Download brochure', {
      exact: true,
    })

    this.packagePill = page.locator('#pkgLabel')
    this.priceText = page.locator('#price')
    this.travellerCalcText = page.locator('#calcText')
  }

  async selectPackage(value: string) {
    await this.packageSelect.selectOption(value)
  }

  async setTravellers(count: number) {
    await this.travellersInput.fill(String(count))
  }

  async fillBookingForm(details: {
    name: string
    mobile: string
    email: string
    date: string
    notes?: string
  }) {
    await this.nameInput.fill(details.name)
    await this.mobileInput.fill(details.mobile)
    await this.emailInput.fill(details.email)
    await this.dateInput.fill(details.date)
    if (details.notes) {
      await this.notesInput.fill(details.notes)
    }
  }
}
