// ─────────────────────────────────────
// 5_ticket.js — QR code & ticket view
// Used by: 10_ticket.html
// ─────────────────────────────────────

const mockTickets = [
  {
    ticketId:   "TKT-001-2026",
    eventTitle: "Tech Innovation Summit 2026",
    attendee:   "Muon Sokea",
    date:       "April 30, 2026",
    time:       "9:00 AM - 5:00 PM",
    location:   "Prey Veng Province",
  },
  {
    ticketId:   "TKT-002-2026",
    eventTitle: "Pre-Event Planning Workshop",
    attendee:   "Muon Sokea",
    date:       "March 20, 2026",
    time:       "8:00 AM - 12:00 PM",
    location:   "Phnom Penh, RUPP",
  },
];

function loadQRLibrary() {
  return new Promise((resolve) => {
    if (window.QRCode) { resolve(); return; }
    const script  = document.createElement("script");
    script.src    = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

async function generateQRCode(ticketId) {
  await loadQRLibrary();
  const container = document.getElementById("qrCodeContainer");
  if (!container) return;
  container.innerHTML = "";
  new QRCode(container, {
    text:         ticketId,
    width:        176,
    height:       176,
    colorDark:    "#222222",
    colorLight:   "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
}

function loadTicketDetails(ticket) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  set("ticketIdDisplay",  ticket.ticketId);
  set("ticketEventTitle", ticket.eventTitle);
  set("ticketAttendee",   "Attendee: " + ticket.attendee);
  set("ticketDate",       ticket.date);
  set("ticketTime",       ticket.time);
  set("ticketLocation",   ticket.location);
}

function showSuccessScreen() {
  const success = document.getElementById("successScreen");
  const view    = document.getElementById("ticketView");
  if (success) success.style.display = "flex";
  if (view)    view.style.display    = "none";
  setTimeout(() => {
    if (success) success.style.display = "none";
    if (view)    view.style.display    = "block";
  }, 3000);
}

function downloadTicket() {
  alert("Ticket download started! In production this will save a PDF.");
}

document.addEventListener("DOMContentLoaded", async () => {
  const ticketId = localStorage.getItem("erms_ticket_id") || "TKT-001-2026";
  const ticket   = mockTickets.find((t) => t.ticketId === ticketId);

  if (!ticket) {
    document.body.innerHTML = `
      <div class="empty-state" style="margin-top:80px">
        <p>Ticket not found.</p>
        <a href="../HTML/4_attendee-dashboard.html"
           class="btn btn-primary"
           style="margin-top:16px;display:inline-flex">
           Back to Dashboard
        </a>
      </div>`;
    return;
  }

  loadTicketDetails(ticket);
  await generateQRCode(ticket.ticketId);

  const downloadBtn = document.getElementById("downloadBtn");
  if (downloadBtn) downloadBtn.addEventListener("click", downloadTicket);

  const fromPayment = localStorage.getItem("erms_from_payment");
  if (fromPayment === "true") {
    localStorage.removeItem("erms_from_payment");
    showSuccessScreen();
  }
});