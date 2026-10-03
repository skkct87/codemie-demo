export type TravelDateResult = { ok: true; iso: string } | { ok: false; error: string }

export const TRAVEL_DATE_FORMAT_ERROR = 'Enter the travel date in dd-mm-yyyy format.'
export const TRAVEL_DATE_INVALID_ERROR = 'Enter a valid date.'
export const TRAVEL_DATE_PAST_ERROR = 'Travel date cannot be in the past.'

const DISPLAY_PATTERN = /^(\d{2})-(\d{2})-(\d{4})$/

function daysInMonth(year: number, month: number): number {
  if (month === 2) {
    const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
    return leap ? 29 : 28
  }
  return [4, 6, 9, 11].includes(month) ? 30 : 31
}

function pad(n: number, width: number): string {
  return String(n).padStart(width, '0')
}

export function todayIso(now: Date = new Date()): string {
  return `${pad(now.getFullYear(), 4)}-${pad(now.getMonth() + 1, 2)}-${pad(now.getDate(), 2)}`
}

export function isoToDisplay(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}-${month}-${year}`
}

export function parseTravelDate(text: string, today: string = todayIso()): TravelDateResult {
  const match = DISPLAY_PATTERN.exec(text.trim())
  if (!match) return { ok: false, error: TRAVEL_DATE_FORMAT_ERROR }

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])

  if (year < 1 || month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) {
    return { ok: false, error: TRAVEL_DATE_INVALID_ERROR }
  }

  const iso = `${match[3]}-${match[2]}-${match[1]}`
  if (iso < today) return { ok: false, error: TRAVEL_DATE_PAST_ERROR }

  return { ok: true, iso }
}
