// ─────────────────────────────────────
// 5_ticket.js — Real QR ticket from API
// Used by: 10_ticket.html
// ─────────────────────────────────────

const API_BASE = 'http://127.0.0.1:8000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('erms_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

function loadQRLibrary() {
  return new Promise((resolve) => {
    if (window.QRCode) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

async function generateQRCode(text) {
  await loadQRLibrary();
  const container = document.getElementById('qrCodeContainer');
  if (!container) return;
  container.innerHTML = '';
  new QRCode(container, {
    text: text,
    width: 176,
    height: 176,
    colorDark: '#222222',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });
}

function loadTicketDetails(registration) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  set('ticketIdDisplay', registration.ticket_code);
  set('ticketEventTitle', registration.event_title || 'Event');
  set('ticketAttendee', `Attendee: ${registration.attendee_email || ''}`);
  set('ticketDate', new Date(registration.registered_at).toLocaleDateString());
  set('ticketLocation', 'See event details');
}

document.addEventListener('DOMContentLoaded', async () => {
  const registrationId = localStorage.getItem('erms_registration_id');
  if (!registrationId) {
    document.body.innerHTML = '<div class="empty-state"><p>No ticket selected.</p></div>';
    return;
  }

  try {
    // Fetch all registrations and find the one with matching ID
    const resp = await fetch(`${API_BASE}/my-registrations/`, {
      headers: getAuthHeaders()
    });
    if (!resp.ok) {
      window.location.href = '2_login.html';
      return;
    }
    const registrations = await resp.json();
    const reg = registrations.find(r => r.id == registrationId);
    if (!reg) {
      document.body.innerHTML = '<div class="empty-state"><p>Ticket not found.</p></div>';
      return;
    }

    loadTicketDetails(reg);
    await generateQRCode(reg.ticket_code);

    document.getElementById('downloadBtn')?.addEventListener('click', () => {
      alert('Ticket download started!');
    });
  } catch (err) {
    console.error(err);
  }
});