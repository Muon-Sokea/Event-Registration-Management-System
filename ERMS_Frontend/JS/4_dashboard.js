// ─────────────────────────────────────
// 4_dashboard.js — All dashboards
// ─────────────────────────────────────

const myEvents = [
  {
    id: 1,
    title: "Tech Innovation Summit 2026",
    ticketId: "TKT-001-2026",
    date: "April 30, 2026",
    time: "9:00 AM - 5:00 PM",
    location: "Prey Veng Province",
    price: 250,
    status: "Confirmed",
    image: "../Images/Technology.png",
    isPast: false,
  },
  {
    id: 2,
    title: "Pre-Event Planning Workshop",
    ticketId: "TKT-002-2026",
    date: "March 20, 2026",
    time: "8:00 AM - 12:00 PM",
    location: "Phnom Penh, RUPP",
    price: 300,
    status: "Confirmed",
    image: "../Images/Workshop.png",
    isPast: false,
  },
];

const mockAttendees = [
  { name: "Muon Sokea",      email: "muonsokea@gmail.com",   event: "Tech Innovation Summit 2026",  date: "March 13, 2026", price: 300, status: "Confirmed" },
  { name: "San Sotheayuth",  email: "attendee@erms.com",     event: "Pre-Event Planning",           date: "March 20, 2026", price: 300, status: "Confirmed" },
  { name: "Proeung Sivly",   email: "organizer@erms.com",    event: "Business Leadership",          date: "March 20, 2026", price: 450, status: "Pending"   },
  { name: "Lang Socheat",    email: "supervisor@erms.com",   event: "Music Festival 2026",          date: "March 20, 2026", price: 100, status: "Confirmed" },
];

// ── Tab switching ──
function switchTab(tabId) {
  document.querySelectorAll(".tab-content").forEach((c) =>
    c.classList.remove("active")
  );
  document.querySelectorAll(".tab-btn").forEach((b) =>
    b.classList.remove("active")
  );
  const content = document.getElementById(tabId);
  const button  = document.querySelector(`[data-tab="${tabId}"]`);
  if (content) content.classList.add("active");
  if (button)  button.classList.add("active");
}

// ── Render attendee event list ──
function renderMyEvents(filter = "upcoming") {
  const grid = document.getElementById("myEventsGrid");
  if (!grid) return;

  const filtered = myEvents.filter((e) =>
    filter === "upcoming" ? !e.isPast : e.isPast
  );

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state">
      <p>No ${filter} events found.</p>
    </div>`;
    return;
  }

  grid.innerHTML = filtered.map((e) => `
  <div class="event-list-item">
    <div class="event-list-img">
      <img src="${e.image}" alt="${e.title}"
        onerror="this.src='../Images/Sport event.jpg'" />
      <span class="price-tag">$${e.price}</span>
    </div>
    <div class="event-list-info">
      <div class="event-list-header">
        <span class="badge badge-confirmed">${e.status}</span>
        <span class="ticket-id">Ticket ID: ${e.ticketId}</span>
      </div>
      <h3>${e.title}</h3>
      <div class="event-meta" style="margin-top:6px">
        <div class="event-meta-item">
          <i class="ri-calendar-line"></i> ${e.date}
        </div>
        <div class="event-meta-item">
          <i class="ri-time-line"></i> ${e.time}
        </div>
        <div class="event-meta-item">
          <i class="ri-map-pin-line"></i> ${e.location}
        </div>
      </div>
      <div class="event-list-actions">
        <button class="btn btn-primary btn-sm"
          onclick="viewQRTicket('${e.ticketId}')">
          <i class="ri-qr-code-line"></i> View QR Ticket
        </button>
        <button class="btn btn-outline btn-sm"
          onclick="downloadTicket('${e.ticketId}')">
          <i class="ri-download-line"></i> Download
        </button>
        <button class="btn btn-danger btn-sm"
          onclick="requestRefund(${e.id})">
          <i class="ri-close-circle-line"></i> Request Refund
        </button>
      </div>
    </div>
  </div>
`).join("");
}

// ── Render attendees table ──
function renderAttendeesTable() {
  const tbody = document.getElementById("attendeesTableBody");
  if (!tbody) return;
  tbody.innerHTML = mockAttendees.map((a) => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div class="avatar-circle">${a.name.charAt(0)}</div>
          ${a.name}
        </div>
      </td>
      <td>${a.event}</td>
      <td>🕐 ${a.date}</td>
      <td>$${a.price}</td>
      <td>
        <span class="badge badge-${a.status.toLowerCase()}">
          ${a.status}
        </span>
      </td>
    </tr>
  `).join("");
}

// ── Update stat cards ──
function updateStats() {
  const totalEl   = document.getElementById("statTotalEvents");
  const upcomingEl= document.getElementById("statUpcoming");
  const spentEl   = document.getElementById("statTotalSpent");
  if (totalEl)    totalEl.textContent    = myEvents.length;
  if (upcomingEl) upcomingEl.textContent = myEvents.filter((e) => !e.isPast).length;
  if (spentEl)    spentEl.textContent    = "$" + myEvents.reduce((s, e) => s + e.price, 0);
}

// ── Ticket actions ──
function viewQRTicket(ticketId) {
  localStorage.setItem("erms_ticket_id", ticketId);
  window.location.href = "../HTML/10_ticket.html";
}

function downloadTicket(ticketId) {
  alert("Downloading ticket: " + ticketId);
}

function requestRefund(eventId) {
  if (confirm("Are you sure you want to request a refund?")) {
    alert("Refund request submitted successfully.");
  }
}

// ── Organizer actions ──
function editEvent(id)   { alert("Edit event " + id); }
function deleteEvent(id) {
  if (confirm("Delete this event?")) alert("Event " + id + " deleted.");
}

document.addEventListener("DOMContentLoaded", () => {
  renderMyEvents("upcoming");
  renderAttendeesTable();
  updateStats();
});