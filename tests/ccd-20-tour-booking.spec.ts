import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import fs from 'fs'
import { test, expect } from '@playwright/test'
import { TourBookingPage } from './pages/tourBooking.page'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const filePath = path.resolve(__dirname, '..', 'src', 'public', 'index.html')
const fileUrl = pathToFileURL(filePath).toString()

const DOWNLOAD_DIR = path.resolve(__dirname, '..', 'test-results', 'downloads')

test.beforeEach(async ({ page }) => {
  await page.goto(fileUrl)
})

test.describe('CCD-20 Tour Booking & Summary Interface', () => {
  test('renders the Book Your Tour, Tour Summary, Download Brochure, and Support panels', async ({
    page,
  }) => {
    const tourBookingPage = new TourBookingPage(page)

    await expect(tourBookingPage.bookYourTourHeading).toBeVisible()
    await expect(tourBookingPage.tourSummaryHeading).toBeVisible()
    await expect(tourBookingPage.downloadBrochureHeading).toBeVisible()
    await expect(tourBookingPage.supportHeading).toBeVisible()
  })

  test('renders the booking form fields and the Confirm Booking / Reset buttons', async ({
    page,
  }) => {
    const tourBookingPage = new TourBookingPage(page)

    await expect(tourBookingPage.nameInput).toBeVisible()
    await expect(tourBookingPage.mobileInput).toBeVisible()
    await expect(tourBookingPage.emailInput).toBeVisible()
    await expect(tourBookingPage.packageSelect).toBeVisible()
    await expect(tourBookingPage.dateInput).toBeVisible()
    await expect(tourBookingPage.travellersInput).toBeVisible()
    await expect(tourBookingPage.notesInput).toBeVisible()

    await expect(tourBookingPage.confirmBookingButton).toBeVisible()
    await expect(tourBookingPage.resetButton).toBeVisible()
  })

  test('updates the summary when selecting a package and changing travellers', async ({
    page,
  }) => {
    const tourBookingPage = new TourBookingPage(page)

    await tourBookingPage.selectPackage('kerala')
    await tourBookingPage.setTravellers(3)

    await expect(tourBookingPage.packagePill).toHaveText('Kerala Backwaters (5 Days)')
    await expect(tourBookingPage.travellerCalcText).toHaveText('For 3 travellers')
    await expect(tourBookingPage.priceText).toHaveText(/₹\s?[\d,]+/)
  })

  test('downloads the brochure file when Download Brochure is clicked', async ({ page }) => {
    const tourBookingPage = new TourBookingPage(page)

    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true })

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      tourBookingPage.downloadBrochureButton.click(),
    ])

    const savedPath = path.join(DOWNLOAD_DIR, download.suggestedFilename())
    await download.saveAs(savedPath)

    expect(path.extname(savedPath)).toBe('.txt')
    expect(fs.statSync(savedPath).size).toBeGreaterThan(0)
  })

  test('clears the form after Reset is clicked', async ({ page }) => {
    const tourBookingPage = new TourBookingPage(page)

    await tourBookingPage.fillBookingForm({
      name: 'Jane Doe',
      mobile: '9876543210',
      email: 'jane@example.com',
      date: '2026-12-01',
      notes: 'Window seat please',
    })
    await tourBookingPage.selectPackage('manali')
    await tourBookingPage.setTravellers(4)

    await tourBookingPage.resetButton.click()

    await expect(tourBookingPage.nameInput).toHaveValue('')
    await expect(tourBookingPage.mobileInput).toHaveValue('')
    await expect(tourBookingPage.emailInput).toHaveValue('')
    await expect(tourBookingPage.dateInput).toHaveValue('')
    await expect(tourBookingPage.notesInput).toHaveValue('')
    await expect(tourBookingPage.travellersInput).toHaveValue('1')
    await expect(tourBookingPage.packageSelect).toHaveValue('goa')
  })
})
