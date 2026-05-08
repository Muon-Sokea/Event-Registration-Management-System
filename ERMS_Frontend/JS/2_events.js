// ─────────────────────────────────────────
// events.js — Event cards + category filter
// Used by: index.html, pages/event-detail.html
// Task: T13 — Event creation & management
// ─────────────────────────────────────────

// ── Mock event data (replace with API later) ──
const mockEvents = [
  {
    id: 1,
    title: "Tech Innovation Summit 2026",
    category: "Technology",
    date: "April 30, 2026",
    time: "9:00 AM - 5:00 PM",
    location: "Prey Veng Province",
    price: 250,
    rating: 4.0,
    attending: 1000,
    status: "Available",
    image: "assets/images/events/tech-summit.jpg",
  },
  {
    id: 2,
    title: "Pre-Event Planning Workshop",
    category: "Workshop",
    date: "March 20, 2026",
    time: "8:00 AM - 12:00 PM",
    location: "Phnom Penh, RUPP",
    price: 300,
    rating: 4.0,
    attending: 1250,
    status: "Full",
    image: "assets/images/events/workshop.jpg",
  },
  {
    id: 3,
    title: "Business Leadership Conference",
    category: "Business",
    date: "March 20, 2026",
    time: "9:00 AM - 6:00 PM",
    location: "Preah Sihanouk Province",
    price: 450,
    rating: 4.0,
    attending: 2500,
    status: "Available",
    image: "assets/images/events/business.jpg",
  },
  {
    id: 4,
    title: "Music Festival 2026",
    category: "Entertainment",
    date: "March 20, 2026",
    time: "6:00 PM - 11:00 PM",
    location: "Phnom Penh, Koh Pech",
    price: 100,
    rating: 4.0,
    attending: 5230,
    status: "Available",
    image: "assets/images/events/music.jpg",
  },
  {
    id: 5,
    title: "Digital Marketing Workshop",
    category: "Education",
    date: "March 20, 2026",
    time: "9:00 AM - 4:00 PM",
    location: "Phnom Penh, RUPP",
    price: 300,
    rating: 4.0,
    attending: 1250,
    status: "Available",
    image: "assets/images/events/marketing.jpg",
  },
  {
    id: 6,
    title: "Networking & Innovation Forum",
    category: "Workshop",
    date: "March 20, 2026",
    time: "10:00 AM - 5:00 PM",
    location: "Phnom Penh, RUPP",
    price: 300,
    rating: 4.0,
    attending: 1250,
    status: "Full",
    image: "assets/images/events/networking.jpg",
  },
  {
    id: 7,
    title: "Annual Healthcare Conference",
    category: "Business",
    date: "March 20, 2026",
    time: "8:00 AM - 5:00 PM",
    location: "Phnom Penh, RUPP",
    price: 300,
    rating: 4.0,
    attending: 1250,
    status: "Available",
    image: "assets/images/events/healthcare.jpg",
  },
  {
    id: 8,
    title: "Sport Event 2026",
    category: "Sports",
    date: "March 20, 2026",
    time: "7:00 AM - 12:00 PM",
    location: "Phnom Penh, RUPP",
    price: 300,
    rating: 4.0,
    attending: 1250,
    status: "Available",
    image: "assets/images/events/sport.jpg",
  },
];

// ── State ──
let currentCategory = "All";
let currentSearch   = "";

// ── Render event cards ──
function renderEvents(events) {
  const grid = document.getElementById("eventsGrid");
  if (!grid) return;

  if (events.length === 0) {
    grid.innerHTML = `
      <div class="no-events">
        <p>No events found. Try a different category or search.</p>
      </div>`;
    return;
  }

  grid.innerHTML = events.map((e) => `
    <div class="event-card" onclick="viewEvent(${e.id})">
      <div class="event-card-img">
        <img src="${e.image}" alt="${e.title}"
             onerror="this.src='assets/images/events/default.jpg'" />
        <span class="badge ${e.status === 'Full'
          ? 'badge-full' : 'badge-available'}">
          ${e.status}
        </span>
      </div>
      <div class="event-card-body">
        <div class="event-category">
          ${e.category}
          <span class="event-rating">⭐ ${e.rating.toFixed(1)}</span>
        </div>
        <h3 class="event-title">${e.title}</h3>
        <div class="event-meta">
          <div class="event-meta-item">📅 ${e.date}</div>
          <div class="event-meta-item">📍 ${e.location}</div>
        </div>
        <div class="event-card-footer">
          <span class="event-price">$${e.price}</span>
          <span class="event-attendees">👥 ${e.attending.toLocaleString()} attending</span>
        </div>
      </div>
    </div>
  `).join("");
}

// ── Filter by category ──
function filterByCategory(category) {
  currentCategory = category;

  // Update active pill
  document.querySelectorAll(".filter-pill").forEach((pill) => {
    pill.classList.toggle("active", pill.dataset.category === category);
  });

  applyFilters();
}

// ── Search handler ──
function handleSearch() {
  const input = document.getElementById("searchInput");
  currentSearch = input ? input.value.trim().toLowerCase() : "";
  applyFilters();
}

// ── Apply both category + search filters ──
function applyFilters() {
  let filtered = mockEvents;

  // Category filter
  if (currentCategory !== "All") {
    filtered = filtered.filter(
      (e) => e.category.toLowerCase() === currentCategory.toLowerCase()
    );
  }

  // Search filter
  if (currentSearch !== "") {
    filtered = filtered.filter(
      (e) =>
        e.title.toLowerCase().includes(currentSearch) ||
        e.location.toLowerCase().includes(currentSearch) ||
        e.category.toLowerCase().includes(currentSearch)
    );
  }

  renderEvents(filtered);
}

// ── Navigate to event detail page ──
function viewEvent(id) {
  window.location.href = `pages/event-detail.html?id=${id}`;
}

// ── Get single event by ID (used in event-detail.html) ──
function getEventById(id) {
  return mockEvents.find((e) => e.id === parseInt(id)) || null;
}

// ── Save event to localStorage for detail page ──
function saveEventToStorage(event) {
  localStorage.setItem("erms_selected_event", JSON.stringify(event));
}

// ── Load event from localStorage ──
function loadEventFromStorage() {
  const e = localStorage.getItem("erms_selected_event");
  return e ? JSON.parse(e) : null;
}

// ── Initialize on page load ──
document.addEventListener("DOMContentLoaded", () => {
  renderEvents(mockEvents);

  // Search on Enter key
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleSearch();
    });
  }
});