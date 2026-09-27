import { packages } from '../data/packages.js';

export function initBookingForm() {
  const bookBtn = document.getElementById("bookBtn");
  const resetBtn = document.getElementById("resetBtn");
  const message = document.getElementById("message");
  const pkgSelect = document.getElementById("package");
  const travellersInput = document.getElementById("travellers");

  bookBtn.addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const email = document.getElementById("email").value.trim();
    const date = document.getElementById("date").value;

    if (!name || !mobile || !email || !date) {
      message.innerHTML = `<div style="background:#fee2e2; border:1px solid #fecaca; color:#991b1b; padding:10px; border-radius:8px; font-size:13px;">Please fill in all required fields (Name, Mobile, Email, Travel Date).</div>`;
      return;
    }

    const pkg = packages[pkgSelect.value].name;
    const travellers = travellersInput.value;

    message.innerHTML = `
      <div style="background:#dcfce7; border:1px solid #bbf7d0; color:#166534; padding:12px; border-radius:8px; font-size:13px;">
        <div style="font-weight:700; margin-bottom:4px;">🎉 Booking Confirmed Successfully!</div>
        <div><strong>Name:</strong> ${name}</div>
        <div><strong>Package:</strong> ${pkg}</div>
        <div><strong>Travellers:</strong> ${travellers}</div>
        <div><strong>Travel Date:</strong> ${date}</div>
      </div>
    `;
  });

  resetBtn.addEventListener("click", () => {
    document.querySelectorAll("input, textarea").forEach(el => {
      if (el.type === "number") el.value = 1;
      else el.value = "";
    });
    pkgSelect.value = "goa";
    message.innerHTML = "";
    pkgSelect.dispatchEvent(new Event('change'));
  });
}