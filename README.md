# Tour Booking Demo

A React + Vite + TypeScript single-page app for booking a tour, with an
in-browser PDF brochure download.

## Stack

- React + Vite + TypeScript
- React Router (client-side routing)
- jsPDF (lazy-loaded, client-side PDF generation)
- Vitest + React Testing Library (unit/component tests)

## Setup

```bash
npm install
```

## Run (development)

```bash
npm run dev
```

Opens the dev server (default `http://localhost:5173`). The app redirects
`/` to `/tour-booking`.

## Build

```bash
npm run build
npm run preview   # serve the production build locally
```

## Test

```bash
npm test          # run the full suite once
npm run test:watch
```

## Tour Booking page (`/tour-booking`)

- Left column: booking form (name, mobile, email, package, travel date,
  travellers, notes).
- Right column, in order:
  1. **Tour Summary** — selected package, price, traveller count.
  2. **Download Brochure** — generates and downloads `brochure.pdf`
     entirely client-side via a lazily-imported `jsPDF`. The brochure
     includes the package name, duration (explicit, or derived from
     start/end dates, or `N/A`), traveller count, price per traveller,
     total price, and support contact details. If generation fails, an
     inline error message is shown on the card (no `alert()`).
  3. **Support** — contact details.

### Key modules

- `src/lib/brochureSelector.ts` — pure function that extracts
  `BrochureData` from the current booking state.
- `src/lib/brochurePdf.ts` — wraps `jsPDF` (dynamic import) to build a
  PDF `Blob` and trigger a browser download.
- `src/components/DownloadBrochureCard.tsx` — UI wiring: click handler,
  loading state, and inline error handling.

`src/public/index.html` is a legacy static HTML/CSS/JS demo of the same
page, kept for reference only — it is not wired into the Vite build.
