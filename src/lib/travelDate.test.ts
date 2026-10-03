import { describe, expect, it } from 'vitest'
import {
  TRAVEL_DATE_FORMAT_ERROR,
  TRAVEL_DATE_INVALID_ERROR,
  TRAVEL_DATE_PAST_ERROR,
  isoToDisplay,
  parseTravelDate,
  todayIso,
} from './travelDate'

const TODAY = '2026-10-03'

describe('parseTravelDate', () => {
  it('accepts a future dd-mm-yyyy date and returns ISO', () => {
    expect(parseTravelDate('01-12-2026', TODAY)).toEqual({ ok: true, iso: '2026-12-01' })
  })

  it('accepts today', () => {
    expect(parseTravelDate('03-10-2026', TODAY)).toEqual({ ok: true, iso: '2026-10-03' })
  })

  it('rejects yesterday', () => {
    expect(parseTravelDate('02-10-2026', TODAY)).toEqual({ ok: false, error: TRAVEL_DATE_PAST_ERROR })
  })

  it.each(['2026-12-01', '1-12-2026', '01/12/2026', '01-12-26', '', 'abc', '01-12-2026x'])(
    'rejects wrong format %j',
    (text) => {
      expect(parseTravelDate(text, TODAY)).toEqual({ ok: false, error: TRAVEL_DATE_FORMAT_ERROR })
    },
  )

  it.each(['31-02-2027', '30-02-2028', '31-04-2027', '00-05-2027', '32-01-2027', '10-13-2027', '10-00-2027'])(
    'rejects impossible date %s',
    (text) => {
      expect(parseTravelDate(text, TODAY)).toEqual({ ok: false, error: TRAVEL_DATE_INVALID_ERROR })
    },
  )

  it('handles leap years', () => {
    expect(parseTravelDate('29-02-2028', TODAY)).toEqual({ ok: true, iso: '2028-02-29' })
    expect(parseTravelDate('29-02-2027', TODAY)).toEqual({ ok: false, error: TRAVEL_DATE_INVALID_ERROR })
    expect(parseTravelDate('29-02-2100', TODAY)).toEqual({ ok: false, error: TRAVEL_DATE_INVALID_ERROR })
    expect(parseTravelDate('29-02-2400', TODAY)).toEqual({ ok: true, iso: '2400-02-29' })
  })

  it('ignores surrounding whitespace', () => {
    expect(parseTravelDate(' 01-12-2026 ', TODAY)).toEqual({ ok: true, iso: '2026-12-01' })
  })
})

describe('todayIso / isoToDisplay', () => {
  it('formats the local calendar date as ISO', () => {
    expect(todayIso(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('converts ISO to dd-mm-yyyy', () => {
    expect(isoToDisplay('2026-12-01')).toBe('01-12-2026')
  })
})
