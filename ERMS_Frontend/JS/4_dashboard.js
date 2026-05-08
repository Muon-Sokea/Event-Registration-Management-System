// ─────────────────────────────────────────
// dashboard.js — Tabs, stats, attendee list
// Used by: all dashboard pages
// Task: T08, T09, T10, T11, T12, T16
// ─────────────────────────────────────────

// ── Mock registered events (for attendee) ──
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
    image: "assets/images/events/tech-summit.jpg",
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
    image: "assets/images/events/workshop.jpg",
    isPast: false,
  },
];

// ── Mock attendee list (for organizer/admin) ──
const mockAttendees = [
  { id: 1, name: "Muon Sokea",      email: "muonsokea@gmail.com",    event: "Tech Innovation Summit 2026", date: "March 13, 2026", price: 300, status: "Confirmed" },
  { id: 2, name: "San Sotheayuth",  email: "attendee@example.com",   event: "Pre-Event Planning",          date: "March 20, 2026", price: 300, status: "Confirmed" },
  { id: 3, name: "Proeung Sivly",   email: "organizer@example.com",  event: "Business Leadership",         date: "March 20, 2026", price: 450, status: "Pending"   },
  { id: 4, name: "Lang Socheat",    email: "supervisor@example.com", event: "Music Festival 2026",         date: "March 20, 2026", price: 100, status: "Confirmed" },
];

// ── Mock managed events (for organizer) ──
const managedEvents = [
  { id: 1, title: "Tech Innovation Summit 2026", date: "April 30, 2026", capacity: 1000, registered: 850,  status: "Available" },
  { id: 2, title: "Pre-Event Planning Workshop", date: "March 20, 2026", capacity: 1250, registered: 1250, status: "Full"      },
  { id: 3, title: "Business Leadership Conf.",   date: "March 20, 2026", capacity: 2500, registered: 1800, status: "Available" },
];

// ── Tab switching ──
function switchTab(tabId) {
  // Hide all tab contents
  document.querySelectorAll(".tab-content").forEach((c) => {
    c.classList.remove("active");
  });

  // Deactivate all tab buttons
  document.querySelectorAll(".tab-btn").forEach((b) => {
    b.classList.remove("active");
  });

  // Activate selected tab
  const content = document.getElementById(tabId);
  const button  = document.querySelector(`[data-tab="${tabId}"]`);
  if (content) content.classList.add("active");
  if (button)  button.classList.add("active");
}

// ── Render attendee dashboard event cards ──
function renderMyEvents(filter = "upcoming") {
  const grid = document.getElementById("myEventsGrid");
  if (!grid) return;

  const filtered = myEvents.filter((e) =>
    filter === "upcoming" ? !e.isPast : e.isPast
  );

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i>📅</i>
        <p>No ${filter} events found.</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map((e) => `
    <div class="event-list-item card">
      <div class="event-list-img">
        <img src="${e.image}" alt="${e.title}"
             onerror="this.src='../assets/images/events/default.jpg'" />
        ${e.price ? `<span class="price-tag">$${e.price}</span>` : ""}
      </div>
      <div class="event-list-info">
        <div class="event-list-header">
          <span class="badge badge-${e.status.toLowerCase()}">${e.status}</span>
          <span class="ticket-id">Ticket ID: ${e.ticketId}</span>
        </div>
        <h3>${e.title}</h3>
        <div class="event-meta">
          <div class="event-meta-item">📅 ${e.date}</div>
          <div class="event-meta-item">🕘 ${e.time}</div>
          <div class="event-meta-item">📍 ${e.location}</div>
        </div>
        <div class="event-list-actions">
          <button class="btn btn-primary btn-sm"
            onclick="viewQRTicket('${e.ticketId}')">
            🎫 View QR Ticket
          </button>
          <button class="btn btn-outline btn-sm"
            onclick="downloadTicket('${e.ticketId}')">
            ⬇️ Download
          </button>
          <button class="btn btn-danger btn-sm"
            onclick="requestRefund(${e.id})">
            ❌ Request Refund
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

// ── Render attendees table (organizer/admin) ──
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
      <td>${a.email}</td>
      <td>${a.event}</td>
      <td>${a.date}</td>
      <td>$${a.price}</td>
      <td><span class="badge badge-${a.status.toLowerCase()}">${a.status}</span></td>
    </tr>
  `).join("");
}

// ── Render managed events table (organizer) ──
function renderManagedEvents() {
  const tbody = document.getElementById("managedEventsBody");
  if (!tbody) return;

  tbody.innerHTML = managedEvents.map((e) => `
    <tr>
      <td>${e.title}</td>
      <td>${e.date}</td>
      <td>${e.registered} / ${e.capacity}</td>
      <td>
        <div style="background:#eee;border-radius:4px;height:8px;width:120px">
          <div style="background:var(--primary);height:8px;border-radius:4px;
            width:${Math.round((e.registered / e.capacity) * 100)}%"></div>
        </div>
      </td>
      <td><span class="badge badge-${e.status.toLowerCase()}">${e.status}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn btn-outline btn-sm" onclick="editEvent(${e.id})">✏️ Edit</button>
          <button class="btn btn-danger btn-sm"  onclick="deleteEvent(${e.id})">🗑️ Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

// ── Update dashboard stat cards ──
function updateStats(stats = {}) {
  Object.entries(stats).forEach(([key, value]) => {
    const el = document.getElementById(key);
    if (el) el.textContent = value;
  });
}

// ── View QR ticket ──
function viewQRTicket(ticketId) {
  localStorage.setItem("erms_ticket_id", ticketId);
  window.location.href = "../pages/ticket.html";
}

// ── Download ticket (placeholder) ──
function downloadTicket(ticketId) {
  alert(`Downloading ticket: ${ticketId}`);
  // TODO: connect to PDF generation API
}

// ── Request refund ──
function requestRefund(eventId) {
  if (confirm("Are you sure you want to request a refund for this event?")) {
    alert("Refund request submitted successfully.");
    // TODO: connect to refund API
  }
}

// ── Edit event (organizer) ──
function editEvent(eventId) {
  window.location.href = `../pages/event-register.html?edit=${eventId}`;
}

// ── Delete event (organizer) ──
function deleteEvent(eventId) {
  if (confirm("Are you sure you want to delete this event?")) {
    alert(`Event ${eventId} deleted.`);
    renderManagedEvents();
    // TODO: connect to delete API
  }
}

// ── Initialize on page load ──
document.addEventListener("DOMContentLoaded", () => {
  // Load user info into navbar if element exists
  const user = getCurrentUser ? getCurrentUser() : null;
  const nameEl = document.getElementById("userName");
  if (nameEl && user) {
    nameEl.textContent = `${user.firstName} ${user.lastName}`;
  }

  // Render components if elements exist
  renderMyEvents("upcoming");
  renderAttendeesTable();
  renderManagedEvents();

  // Set default tab
  const firstTab = document.querySelector(".tab-btn");
  if (firstTab) {
    const tabId = firstTab.getAttribute("data-tab");
    if (tabId) switchTab(tabId);
  }

  // Update attendee stats
  updateStats({
    statTotalEvents:    myEvents.length,
    statUpcoming:       myEvents.filter((e) => !e.isPast).length,
    statTotalSpent:     "$" + myEvents.reduce((sum, e) => sum + e.price, 0),
  });
});