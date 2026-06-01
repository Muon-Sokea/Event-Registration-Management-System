// ─────────────────────────────────────
// 2_events.js — Live events from API
// Used by: 1_index.html, 8_event-detail.html
// ─────────────────────────────────────

const API_BASE = 'http://127.0.0.1:8000/api';

// ── Helper: fetch with auth (for registration) ──
function getAuthHeaders() {
  const token = localStorage.getItem('erms_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// ── Render event cards from API data ──
function renderEvents(events) {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;

  if (!events || events.length === 0) {
    grid.innerHTML = `<div class="no-events">
      <p>No events found. Try a different category or search.</p>
    </div>`;
    return;
  }

  grid.innerHTML = events.map(e => {
    // Build image URL: prefer event.image if exists, else fallback
    const imgSrc = e.image 
      ? `http://127.0.0.1:8000/media/${e.image}` 
      : '../Images/Sport event.jpg';
    // Format date nicely
    const eventDate = new Date(e.date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    // Category display
    const category = e.category ? e.category.charAt(0).toUpperCase() + e.category.slice(1) : 'General';
    // Price display
    const price = e.price ? `$${parseFloat(e.price).toFixed(2)}` : 'Free';

    return `
    <div class="event-card" onclick="viewEvent(${e.id})">
      <div class="event-card-img">
        <img src="${imgSrc}" alt="${e.title}"
          onerror="this.src='../Images/Sport event.jpg'" />
        <span class="badge badge-available">Available</span>
      </div>
      <div class="event-card-body">
        <div class="event-category">
          ${category}
          <span class="event-rating">
            <i class="ri-star-fill" style="color:var(--primary)"></i>
            New
          </span>
        </div>
        <h3 class="event-title">${e.title}</h3>
        <div class="event-meta">
          <div class="event-meta-item">
            <i class="ri-calendar-line"></i> ${eventDate}
          </div>
          <div class="event-meta-item">
            <i class="ri-map-pin-line"></i> ${e.location}
          </div>
        </div>
        <div class="event-card-footer">
          <span class="event-price">${price}</span>
          <span class="event-attendees">
            <i class="ri-group-line"></i>
            Capacity: ${e.capacity}
          </span>
        </div>
        <button class="btn btn-primary" onclick="event.stopPropagation(); registerForEvent(${e.id})" style="margin-top:10px; width:100%;">
          Register Now
        </button>
      </div>
    </div>`;
  }).join('');
}

// ── Fetch events with optional filters ──
async function loadEvents(search = '', category = '') {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'All') params.append('category', category.toLowerCase());
    // You could also add pagination: &page=1&page_size=20
    const url = `${API_BASE}/events/?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error('Failed to fetch events');
      return;
    }
    const data = await response.json();
    // data.results is the array of events if pagination is enabled; fallback to data if not
    const events = data.results || data;
    renderEvents(events);
  } catch (err) {
    console.error('Error loading events:', err);
  }
}

// ── Filter & search functions ──
let currentCategory = 'All';
let currentSearch = '';

function filterByCategory(category) {
  currentCategory = category;
  document.querySelectorAll('.filter-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.category === category);
  });
  loadEvents(currentSearch, currentCategory);
}

function handleSearch() {
  const input = document.getElementById('searchInput');
  currentSearch = input ? input.value.trim() : '';
  window.currentSearch = currentSearch; // for navbar
  loadEvents(currentSearch, currentCategory);
}

// ── Registration helper (requires login) ──
async function registerForEvent(eventId) {
  const token = localStorage.getItem('erms_token');
  if (!token) {
    alert('Please login to register for events.');
    window.location.href = '2_login.html';
    return;
  }
  try {
    const response = await fetch(`${API_BASE}/events/${eventId}/register/`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    if (response.ok) {
      alert(`Registered successfully! Ticket: ${data.ticket_code}`);
      // Optionally reload events to reflect new capacity?
      loadEvents(currentSearch, currentCategory);
    } else {
      // Show first error message from the response
      const msg = Object.values(data).flat().join(' ') || 'Registration failed.';
      alert(msg);
    }
  } catch (err) {
    alert('Network error. Please try again.');
    console.error(err);
  }
}

// ── Event detail navigation (still stores id, but we'll fetch detail on the detail page) ──
function viewEvent(id) {
  localStorage.setItem('erms_selected_event_id', id);
  // No need to save mock event; detail page will fetch from API
  window.location.href = '../HTML/8_event-detail.html';
}

// ── Initial load ──
document.addEventListener('DOMContentLoaded', () => {
  loadEvents(); // load all events initially
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleSearch();
    });
  }
});