// ─────────────────────────────────────
// 4_dashboard.js — Real API dashboard
// ─────────────────────────────────────

const API_BASE = 'http://127.0.0.1:8000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('erms_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

function getCurrentRole() {
  return localStorage.getItem('erms_role');
}

// ── Tab switching ──
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const content = document.getElementById(tabId);
  const button  = document.querySelector(`[data-tab="${tabId}"]`);
  if (content) content.classList.add('active');
  if (button)  button.classList.add('active');
}

// ── Render attendee registrations ──
async function renderMyRegistrations() {
  const grid = document.getElementById('myEventsGrid');
  if (!grid) return;

  try {
    const resp = await fetch(`${API_BASE}/my-registrations/`, {
      headers: getAuthHeaders()
    });
    if (!resp.ok) {
      if (resp.status === 401) {
        window.location.href = '2_login.html';
        return;
      }
      throw new Error('Failed to fetch registrations');
    }
    const registrations = await resp.json();

    if (registrations.length === 0) {
      grid.innerHTML = '<div class="empty-state"><p>You have no registrations yet.</p></div>';
      return;
    }

    grid.innerHTML = registrations.map(reg => {
      // Extract event info from the registration (serializer includes event_title, etc.)
      const eventTitle = reg.event_title || 'Untitled Event';
      const eventDate = reg.registered_at ? new Date(reg.registered_at).toLocaleDateString() : '';
      const ticketCode = reg.ticket_code || '';
      const status = reg.status;
      const imgSrc = reg.event_image 
        ? `http://127.0.0.1:8000/media/${reg.event_image}` 
        : '../Images/Sport event.jpg';
      // event location might not be available directly; we can fetch full event later if needed, but for now we can show ticket code
      return `
      <div class="event-list-item">
        <div class="event-list-img">
          <img src="${imgSrc}" alt="${eventTitle}" onerror="this.src='../Images/Sport event.jpg'" />
          <span class="price-tag">Ticket</span>
        </div>
        <div class="event-list-info">
          <div class="event-list-header">
            <span class="badge badge-${status === 'confirmed' ? 'confirmed' : status}">${status}</span>
            <span class="ticket-id">Ticket: ${ticketCode}</span>
          </div>
          <h3>${eventTitle}</h3>
          <div class="event-meta" style="margin-top:6px">
            <div class="event-meta-item">
              <i class="ri-calendar-line"></i> Registered: ${eventDate}
            </div>
          </div>
          <div class="event-list-actions">
            <button class="btn btn-primary btn-sm" onclick="viewQRTicket(${reg.id}, '${ticketCode}')">
              <i class="ri-qr-code-line"></i> View QR Ticket
            </button>
            <button class="btn btn-outline btn-sm" onclick="downloadTicket('${ticketCode}')">
              <i class="ri-download-line"></i> Download
            </button>
            <button class="btn btn-danger btn-sm" onclick="requestRefund(${reg.id})">
              <i class="ri-close-circle-line"></i> Cancel Registration
            </button>
          </div>
        </div>
      </div>`;
    }).join('');
  } catch (err) {
    console.error(err);
    grid.innerHTML = '<div class="empty-state"><p>Error loading registrations.</p></div>';
  }
}

// ── Render admin/organizer dashboard stats ──
async function renderAdminDashboard() {
  try {
    const resp = await fetch(`${API_BASE}/dashboard/`, {
      headers: getAuthHeaders()
    });
    if (!resp.ok) {
      if (resp.status === 401) window.location.href = '2_login.html';
      return;
    }
    const stats = await resp.json();

    // Update stat cards if present
    const setStat = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    setStat('statTotalEvents', stats.total_events);
    setStat('statTotalRegistrations', stats.total_registrations);
    setStat('statTotalUsers', stats.total_users);
    setStat('statUpcomingEvents', stats.upcoming_events);

    // Render events you organized (if organizer) – we can list from stats? Not directly.
    // We'll load owned events if role is organizer.
    const role = getCurrentRole();
    if (role === 'organizer') {
      // Fetch events where organizer is current user
      const eventsResp = await fetch(`${API_BASE}/events/`, {
        headers: getAuthHeaders()
      });
      if (eventsResp.ok) {
        const eventsData = await eventsResp.json();
        const events = eventsData.results || eventsData;
        // Render in a container if present
        const grid = document.getElementById('myEventsGrid');
        if (grid && events.length > 0) {
          grid.innerHTML = events.map(e => {
            const imgSrc = e.image 
              ? `http://127.0.0.1:8000/media/${e.image}` 
              : '../Images/Sport event.jpg';
            return `
            <div class="event-list-item">
              <div class="event-list-img">
                <img src="${imgSrc}" alt="${e.title}" onerror="this.src='../Images/Sport event.jpg'" />
                <span class="price-tag">$${e.price}</span>
              </div>
              <div class="event-list-info">
                <h3>${e.title}</h3>
                <div class="event-meta">
                  <div class="event-meta-item"><i class="ri-calendar-line"></i> ${new Date(e.date).toLocaleDateString()}</div>
                  <div class="event-meta-item"><i class="ri-map-pin-line"></i> ${e.location}</div>
                </div>
                <div class="event-list-actions">
                  <button class="btn btn-primary btn-sm" onclick="editEvent(${e.id})">Edit</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteEvent(${e.id})">Delete</button>
                </div>
              </div>
            </div>`;
          }).join('');
        }
      }
    }

    // If there's a table for attendees (admin), we'd need another endpoint; skip for now.
  } catch (err) {
    console.error(err);
  }
}

// ── Ticket actions ──
function viewQRTicket(registrationId, ticketCode) {
  localStorage.setItem('erms_registration_id', registrationId);
  localStorage.setItem('erms_ticket_code', ticketCode);
  window.location.href = '../HTML/10_ticket.html';
}

function downloadTicket(ticketId) {
  alert('Downloading ticket: ' + ticketId);
}

async function requestRefund(registrationId) {
  if (!confirm('Are you sure you want to cancel this registration?')) return;
  try {
    const resp = await fetch(`${API_BASE}/registrations/${registrationId}/cancel/`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (resp.ok) {
      alert('Registration cancelled successfully.');
      renderMyRegistrations(); // refresh the list
    } else {
      const data = await resp.json();
      alert('Cancellation failed: ' + JSON.stringify(data));
    }
  } catch (err) {
    alert('Network error.');
  }
}

// ── Organizer actions ──
function editEvent(id)   { alert('Edit event ' + id); }
function deleteEvent(id) {
  if (confirm('Delete this event?')) alert('Event ' + id + ' deleted.');
}

document.addEventListener('DOMContentLoaded', () => {
  const role = getCurrentRole();
  if (!role) {
    window.location.href = '2_login.html';
    return;
  }

  if (role === 'attendee') {
    renderMyRegistrations();
  } else {
    // Admin, organizer, supervisor all see dashboard stats
    renderAdminDashboard();
  }
});