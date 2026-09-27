import { packages, formatINR } from '../data/packages.js';

export function initSummary() {
  const pkgSelect = document.getElementById("package");
  const travellersInput = document.getElementById("travellers");
  const pkgLabel = document.getElementById("pkgLabel");
  const priceEl = document.getElementById("price");
  const calcText = document.getElementById("calcText");
  const brochureLink = document.getElementById("brochureLink");

  function updateSummary() {
    const key = pkgSelect.value;
    const t = Math.max(1, parseInt(travellersInput.value || "1", 10));
    travellersInput.value = t;

    const pkg = packages[key];
    const total = pkg.price * t;

    pkgLabel.textContent = pkg.name;
    priceEl.textContent = formatINR(total);
    calcText.textContent = `For ${t} traveller${t > 1 ? "s" : ""}`;

    const brochureText = `========================================
         TOUR ITINERARY & BROCHURE
========================================
Package Name: ${pkg.name}
Price per Traveller: ${formatINR(pkg.price)}
Number of Travellers: ${t}
----------------------------------------
TOTAL PRICE: ${formatINR(total)}
----------------------------------------

INCLUSIONS:
- Deluxe hotel accommodation
- Daily breakfast & dinner
- Guided sightseeing tours
- Airport/Station transfers in AC vehicle

EXCLUSIONS:
- Flight or train tickets
- Personal expenses, tips, and laundry
- Entry tickets to monuments/activities not specified

For bookings or inquiries, contact tours@example.com
========================================`;

    const blob = new Blob([brochureText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    brochureLink.href = url;
    brochureLink.download = pkg.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase() + "-brochure.txt";
  }

  pkgSelect.addEventListener("change", updateSummary);
  travellersInput.addEventListener("input", updateSummary);

  updateSummary();
}