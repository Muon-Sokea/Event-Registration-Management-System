// ─────────────────────────────────────────
// ticket.js — QR code generation + download
// Used by: pages/ticket.html
// Task: T15 — Ticket management (QR code/ID)
// ─────────────────────────────────────────

// ── Mock ticket data (replace with API later) ──
const mockTickets = [
  {
    ticketId:  "TKT-001-2026",
    eventTitle: "Tech Innovation Summit 2026",
    attendee:   "Muon Sokea",
    date:       "April 30, 2026",
    time:       "9:00 AM - 5:00 PM",
    location:   "Prey Veng Province",
    price:      250,
    status:     "Confirmed",
  },
  {
    ticketId:  "TKT-002-2026",
    eventTitle: "Pre-Event Planning Workshop",
    attendee:   "Muon Sokea",
    date:       "March 20, 2026",
    time:       "8:00 AM - 12:00 PM",
    location:   "Phnom Penh, RUPP",
    price:      300,
    status:     "Confirmed",
  },
];

// ── Load QR code library ──
function loadQRLibrary() {
  return new Promise((resolve) => {
    if (window.QRCode) { resolve(); return; }
    const script  = document.createElement("script");
    script.src    = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

// ── Generate QR code ──
async function generateQRCode(ticketId) {
  await loadQRLibrary();

  const container = document.getElementById("qrCodeContainer");
  if (!container) return;

  // Clear previous QR
  container.innerHTML = "";

  new QRCode(container, {
    text:         ticketId,
    width:        180,
    height:       180,
    colorDark:    "#222222",
    colorLight:   "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
}

// ── Load ticket details into page ──
function loadTicketDetails(ticket) {
  const fields = {
    ticketIdDisplay:    ticket.ticketId,
    ticketEventTitle:   ticket.eventTitle,
    ticketAttendee:     `Attendee: ${ticket.attendee}`,
    ticketDate:         ticket.date,
    ticketTime:         ticket.time,
    ticketLocation:     ticket.location,
  };

  Object.entries(fields).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
}

// ── Download ticket as image ──
async function downloadTicket() {
  const ticketCard = document.getElementById("ticketCard");
  if (!ticketCard) return;

  // TODO: Replace with html2canvas or jsPDF for real download
  alert("Ticket download started! In production this will save a PDF.");
}

// ── Show success screen after payment ──
function showSuccessScreen() {
  const success = document.getElementById("successScreen");
  const ticket  = document.getElementById("ticketView");
  if (success) success.style.display = "flex";
  if (ticket)  ticket.style.display  = "none";

  // Auto-redirect to ticket view after 3 seconds
  setTimeout(() => {
    if (success) success.style.display = "none";
    if (ticket)  ticket.style.display  = "block";
  }, 3000);
}

// ── Get ticket by ID ──
function getTicketById(ticketId) {
  return mockTickets.find((t) => t.ticketId === ticketId) || null;
}

// ── Initialize on page load ──
document.addEventListener("DOMContentLoaded", async () => {
  // Get ticket ID from localStorage (set by dashboard.js)
  const ticketId = localStorage.getItem("erms_ticket_id") || "TKT-001-2026";

  // Get ticket data
  const ticket = getTicketById(ticketId);

  if (!ticket) {
    document.body.innerHTML = `
      <div class="empty-state" style="margin-top:80px">
        <p>Ticket not found. Please go back to your dashboard.</p>
        <a href="../pages/attendee-dashboard.html" class="btn btn-primary"
           style="margin-top:16px">Back to Dashboard</a>
      </div>`;
    return;
  }

  // Populate ticket info
  loadTicketDetails(ticket);

  // Generate QR code
  await generateQRCode(ticket.ticketId);

  // Attach download button
  const downloadBtn = document.getElementById("downloadBtn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", downloadTicket);
  }

  // Check if coming from payment (show success screen first)
  const fromPayment = localStorage.getItem("erms_from_payment");
  if (fromPayment === "true") {
    localStorage.removeItem("erms_from_payment");
    showSuccessScreen();
  }
});