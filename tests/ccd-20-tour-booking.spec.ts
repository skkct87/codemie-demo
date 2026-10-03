import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import fs from 'fs'
import { test, expect } from '@playwright/test'
import { TourBookingPage } from './pages/tourBooking.page'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const filePath = path.resolve(__dirname, '..', 'src', 'public', 'index.html')
const fileUrl = pathToFileURL(filePath).toString()

const DOWNLOAD_DIR = path.resolve(__dirname, '..', 'test-results', 'downloads')

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function dateFromToday(offsetDays: number) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return { dmy: `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`, iso: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` }
}

const validContact = { name: 'Jane Doe', mobile: '9876543210', email: 'jane@example.com' }

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

    expect(download.suggestedFilename()).toBe('tour-brochure.pdf')

    const savedPath = path.join(DOWNLOAD_DIR, download.suggestedFilename())
    await download.saveAs(savedPath)

    expect(path.extname(savedPath)).toBe('.pdf')
    const contents = fs.readFileSync(savedPath)
    expect(contents.length).toBeGreaterThan(0)
    expect(contents.subarray(0, 5).toString('ascii')).toBe('%PDF-')
  })

  test('clears the form after Reset is clicked', async ({ page }) => {
    const tourBookingPage = new TourBookingPage(page)

    await tourBookingPage.fillBookingForm({
      name: 'Jane Doe',
      mobile: '9876543210',
      email: 'jane@example.com',
      date: dateFromToday(30).dmy,
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

test.describe('CCD-46 Download Brochure card', () => {
  test('AC1: the right column has a card titled Download Brochure', async ({ page }) => {
    const tourBookingPage = new TourBookingPage(page)

    await expect(tourBookingPage.downloadBrochureCard).toHaveCount(1)
    await expect(tourBookingPage.downloadBrochureCard.getByRole('heading')).toHaveText(
      'Download Brochure',
    )
  })

  test('AC2: the card has a primary blue Download Brochure button', async ({ page }) => {
    const tourBookingPage = new TourBookingPage(page)
    const button = tourBookingPage.downloadBrochureCard.getByRole('button', {
      name: 'Download Brochure',
    })

    await expect(button).toBeVisible()
    await expect(button).toHaveCSS('background-color', 'rgb(11, 94, 215)')
    await expect(button).toHaveCSS('color', 'rgb(255, 255, 255)')
  })

  test('AC3: the card shows the subtext "Download brochure"', async ({ page }) => {
    const tourBookingPage = new TourBookingPage(page)

    await expect(tourBookingPage.downloadBrochureSubtext).toBeVisible()
  })

  test('AC4: the card has rounded corners, padding and a drop shadow', async ({ page }) => {
    const tourBookingPage = new TourBookingPage(page)
    const card = tourBookingPage.downloadBrochureCard

    const styles = await card.evaluate((el) => {
      const s = getComputedStyle(el)
      return {
        boxShadow: s.boxShadow,
        borderRadius: parseFloat(s.borderRadius),
        paddingTop: parseFloat(s.paddingTop),
        paddingRight: parseFloat(s.paddingRight),
        paddingBottom: parseFloat(s.paddingBottom),
        paddingLeft: parseFloat(s.paddingLeft),
      }
    })

    expect(styles.borderRadius).toBeGreaterThan(0)
    expect(styles.paddingTop).toBeGreaterThan(0)
    expect(styles.paddingRight).toBeGreaterThan(0)
    expect(styles.paddingBottom).toBeGreaterThan(0)
    expect(styles.paddingLeft).toBeGreaterThan(0)
    expect(styles.boxShadow).not.toBe('none')
  })

  test('AC4: the card uses the same shadow as the Support card', async ({ page }) => {
    const tourBookingPage = new TourBookingPage(page)

    const shadowOf = (locator: typeof tourBookingPage.supportCard) =>
      locator.evaluate((el) => getComputedStyle(el).boxShadow)

    expect(await shadowOf(tourBookingPage.downloadBrochureCard)).toBe(
      await shadowOf(tourBookingPage.supportCard),
    )
  })

  test('the card sits below the Support card in the right column', async ({ page }) => {
    const tourBookingPage = new TourBookingPage(page)

    const support = await tourBookingPage.supportCard.boundingBox()
    const brochure = await tourBookingPage.downloadBrochureCard.boundingBox()

    expect(support).not.toBeNull()
    expect(brochure).not.toBeNull()
    expect(brochure!.y).toBeGreaterThanOrEqual(support!.y + support!.height)
  })
})

test.describe('CCD-47 Travel Date dd-mm-yyyy with calendar icon', () => {
  async function stubShowPicker(page: import('@playwright/test').Page) {
    await page.evaluate(() => {
      HTMLInputElement.prototype.showPicker = function () {
        ;(window as unknown as { __pickerOpenedFor?: string }).__pickerOpenedFor = this.id
      }
    })
  }

  async function confirmWithDate(tourBookingPage: TourBookingPage, date: string) {
    await tourBookingPage.fillBookingForm({ ...validContact, date })
    await tourBookingPage.confirmBookingButton.click()
  }

  test('AC1: the input shows a dd-mm-yyyy placeholder and a calendar icon on the right', async ({
    page,
  }) => {
    const tourBookingPage = new TourBookingPage(page)

    await expect(tourBookingPage.dateInput).toHaveAttribute('placeholder', 'dd-mm-yyyy')
    await expect(tourBookingPage.datePickerButton).toBeVisible()
    await expect(tourBookingPage.datePickerButton.locator('svg')).toBeVisible()

    const input = await tourBookingPage.dateInput.boundingBox()
    const button = await tourBookingPage.datePickerButton.boundingBox()
    expect(input).not.toBeNull()
    expect(button).not.toBeNull()
    expect(button!.x).toBeGreaterThan(input!.x + input!.width / 2)
    expect(button!.x + button!.width).toBeLessThanOrEqual(input!.x + input!.width + 1)
  })

  test('AC2: clicking the calendar icon opens the date picker and the chosen date fills the input as dd-mm-yyyy', async ({
    page,
  }) => {
    const tourBookingPage = new TourBookingPage(page)
    const target = dateFromToday(45)
    await stubShowPicker(page)

    await tourBookingPage.datePickerButton.click()
    expect(
      await page.evaluate(
        () => (window as unknown as { __pickerOpenedFor?: string }).__pickerOpenedFor,
      ),
    ).toBe('datePicker')

    await tourBookingPage.datePickerInput.fill(target.iso, { force: true })
    await expect(tourBookingPage.dateInput).toHaveValue(target.dmy)
    await expect(tourBookingPage.dateError).toBeHidden()
  })

  test('AC2: the date picker does not offer dates earlier than today', async ({ page }) => {
    const tourBookingPage = new TourBookingPage(page)

    await expect(tourBookingPage.datePickerInput).toHaveAttribute('min', dateFromToday(0).iso)
  })

  test('AC3: a valid typed dd-mm-yyyy date allows Confirm Booking', async ({ page }) => {
    const tourBookingPage = new TourBookingPage(page)
    const target = dateFromToday(30)

    await confirmWithDate(tourBookingPage, target.dmy)

    await expect(tourBookingPage.dateError).toBeHidden()
    await expect(tourBookingPage.bookingMessage).toContainText('Booking Confirmed')
    await expect(tourBookingPage.bookingMessage).toContainText(target.dmy)
  })

  for (const wrongFormat of ['2027-12-01', '1/2/2027', '01-12-27', 'tomorrow']) {
    test(`AC3: wrong format "${wrongFormat}" shows an error and blocks Confirm Booking`, async ({
      page,
    }) => {
      const tourBookingPage = new TourBookingPage(page)

      await confirmWithDate(tourBookingPage, wrongFormat)

      await expect(tourBookingPage.dateError).toHaveText(
        'Enter the travel date in dd-mm-yyyy format.',
      )
      await expect(tourBookingPage.dateInput).toHaveAttribute('aria-invalid', 'true')
      await expect(tourBookingPage.bookingMessage).not.toContainText('Booking Confirmed')
    })
  }

  for (const impossible of ['31-02-2099', '30-02-2096', '31-04-2099', '00-05-2099', '10-13-2099']) {
    test(`AC3: impossible date "${impossible}" shows an error and blocks Confirm Booking`, async ({
      page,
    }) => {
      const tourBookingPage = new TourBookingPage(page)

      await confirmWithDate(tourBookingPage, impossible)

      await expect(tourBookingPage.dateError).toHaveText('Enter a valid date.')
      await expect(tourBookingPage.bookingMessage).not.toContainText('Booking Confirmed')
    })
  }

  test('AC3: a leap day is accepted only in a leap year', async ({ page }) => {
    const tourBookingPage = new TourBookingPage(page)

    await confirmWithDate(tourBookingPage, '29-02-2096')
    await expect(tourBookingPage.bookingMessage).toContainText('Booking Confirmed')

    await tourBookingPage.resetButton.click()
    await confirmWithDate(tourBookingPage, '29-02-2099')
    await expect(tourBookingPage.dateError).toHaveText('Enter a valid date.')
  })

  test('AC4: yesterday is rejected and blocks Confirm Booking', async ({ page }) => {
    const tourBookingPage = new TourBookingPage(page)

    await confirmWithDate(tourBookingPage, dateFromToday(-1).dmy)

    await expect(tourBookingPage.dateError).toHaveText('Travel date cannot be in the past.')
    await expect(tourBookingPage.bookingMessage).not.toContainText('Booking Confirmed')
  })

  test('AC4: today is accepted', async ({ page }) => {
    const tourBookingPage = new TourBookingPage(page)

    await confirmWithDate(tourBookingPage, dateFromToday(0).dmy)

    await expect(tourBookingPage.dateError).toBeHidden()
    await expect(tourBookingPage.bookingMessage).toContainText('Booking Confirmed')
  })

  test('the error clears once the date is corrected, and on Reset', async ({ page }) => {
    const tourBookingPage = new TourBookingPage(page)

    await confirmWithDate(tourBookingPage, dateFromToday(-1).dmy)
    await expect(tourBookingPage.dateError).toBeVisible()

    await tourBookingPage.dateInput.fill(dateFromToday(10).dmy)
    await expect(tourBookingPage.dateError).toBeHidden()
    await expect(tourBookingPage.dateInput).not.toHaveAttribute('aria-invalid', 'true')

    await tourBookingPage.dateInput.fill('bad')
    await tourBookingPage.dateInput.blur()
    await expect(tourBookingPage.dateError).toBeVisible()
    await tourBookingPage.resetButton.click()
    await expect(tourBookingPage.dateError).toBeHidden()
    await expect(tourBookingPage.dateInput).toHaveValue('')
  })

  test('an empty date still shows the generic required-fields message', async ({ page }) => {
    const tourBookingPage = new TourBookingPage(page)

    await confirmWithDate(tourBookingPage, '')

    await expect(tourBookingPage.dateError).toBeHidden()
    await expect(tourBookingPage.bookingMessage).toContainText(
      'Please fill Name, Mobile, Email, and Travel Date.',
    )
  })

  test('AC5: the calendar icon button has an aria-label and is keyboard accessible', async ({
    page,
  }) => {
    const tourBookingPage = new TourBookingPage(page)
    await stubShowPicker(page)

    await expect(tourBookingPage.datePickerButton).toHaveAttribute('aria-label', 'Open calendar')

    await tourBookingPage.dateInput.focus()
    await page.keyboard.press('Tab')
    await expect(tourBookingPage.datePickerButton).toBeFocused()

    await page.keyboard.press('Enter')
    expect(
      await page.evaluate(
        () => (window as unknown as { __pickerOpenedFor?: string }).__pickerOpenedFor,
      ),
    ).toBe('datePicker')
  })

  test('the Travel Date label is associated with the input', async ({ page }) => {
    await expect(page.getByLabel('Travel Date')).toHaveAttribute('id', 'date')
  })
})
