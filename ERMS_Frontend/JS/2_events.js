// ─────────────────────────────────────
// 2_events.js — Event cards & filter
// Used by: 1_index.html, 8_event-detail.html
// ─────────────────────────────────────

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
    capacity: 2300,
    status: "Available",
    image: "../Images/Technology.png",
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
    capacity: 2000,
    status: "Full",
    image: "../Images/workshop group.webp",
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
    capacity: 3000,
    status: "Available",
    image: "../Images/Sport event.jpg",
  },
  {
    id: 4,
    title: "AI Colaboration of Technology",
    category: "Technology",
    date: "October 15, 2026",
    time: "6:00 PM - 11:00 PM",
    location: "Phnom Penh, Koh Pech",
    price: 100,
    rating: 4.0,
    attending: 5230,
    capacity: 6000,
    status: "Available",
    image: "../Images/event-technology.jpg",
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
    capacity: 2000,
    status: "Available",
    image: "../Images/Workshop.png",
  },
  {
    id: 6,
    title: "Networking & Innovation Forum",
    category: "Networking",
    date: "March 20, 2026",
    time: "10:00 AM - 5:00 PM",
    location: "Phnom Penh, RUPP",
    price: 300,
    rating: 4.0,
    attending: 1250,
    capacity: 2000,
    status: "Full",
    image: "../Images/Networking.jpg",
  },
  {
    id: 7,
    title: "Annual Healthcare Conference",
    category: "Healthcare",
    date: "March 20, 2026",
    time: "8:00 AM - 5:00 PM",
    location: "Phnom Penh",
    price: 300,
    rating: 4.0,
    attending: 1250,
    capacity: 2000,
    status: "Available",
    image: "../Images/Healthcare-Events.webp",
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
    capacity: 2000,
    status: "Available",
    image: "../Images/Sport run.webp",
  },
  {
    id: 9,
    title: "Digital Marketing Workshop",
    category: "Workshop",
    date: "May 22, 2026",
    time: "9:00 AM - 12:00 PM",
    location: "Phnom Penh, ITC",
    price: 150,
    rating: 4.0,
    attending: 850,
    capacity: 1000,
    status: "Available",
    image: "../Images/Conference Workshop.png",
  },
  {
    id: 10,
    title: "Fundraiser on Eventbrite",
    category: "Business",
    date: "January 30, 2026",
    time: "2:00 PM - 6:00 PM",
    location: "Phnom Penh, AUPP",
    price: 50,
    rating: 4.0,
    attending: 400,
    capacity: 500,
    status: "Available",
    image: "../Images/Business.webp",
  },
  {
    id: 11,
    title: "Corporate Event Entertainment Ideas",
    category: "Entertainment",
    date: "April 5, 2026",
    time: "8:00 AM - 5:00 PM",
    location: "Phnom Penh, RUPP",
    price: 200,
    rating: 4.5,
    attending: 600,
    capacity: 2000,
    status: "Available",
    image: "../Images/event entertainment.png",
  },
];

let currentCategory = "All";
let currentSearch   = "";

function renderEvents(events) {
  const grid = document.getElementById("eventsGrid");
  if (!grid) return;

  if (events.length === 0) {
    grid.innerHTML = `<div class="no-events">
      <p>No events found. Try a different category or search.</p>
    </div>`;
    return;
  }

  grid.innerHTML = events.map((e) => `
  <div class="event-card" onclick="viewEvent(${e.id})">
    <div class="event-card-img">
      <img src="${e.image}" alt="${e.title}"
        onerror="this.src='../Images/Sport event.jpg'" />
      <span class="badge ${e.status === 'Full'
        ? 'badge-full' : 'badge-available'}">
        ${e.status}
      </span>
    </div>
    <div class="event-card-body">
      <div class="event-category">
        ${e.category}
        <span class="event-rating">
          <i class="ri-star-fill" style="color:var(--primary)"></i>
          ${e.rating.toFixed(1)}
        </span>
      </div>
      <h3 class="event-title">${e.title}</h3>
      <div class="event-meta">
        <div class="event-meta-item">
          <i class="ri-calendar-line"></i> ${e.date}
        </div>
        <div class="event-meta-item">
          <i class="ri-map-pin-line"></i> ${e.location}
        </div>
      </div>
      <div class="event-card-footer">
        <span class="event-price">$${e.price}</span>
        <span class="event-attendees">
          <i class="ri-group-line"></i>
          ${e.attending.toLocaleString()} attending
        </span>
      </div>
    </div>
  </div>
`).join("");
}

function filterByCategory(category) {
  currentCategory = category;
  document.querySelectorAll(".filter-pill").forEach((p) => {
    p.classList.toggle("active", p.dataset.category === category);
  });
  applyFilters();
}

function handleSearch() {
  const input = document.getElementById("searchInput");
  currentSearch = input ? input.value.trim().toLowerCase() : "";
  applyFilters();
}

function applyFilters() {
  let filtered = mockEvents;

  // Use window.currentSearch so navbar.js can update it
  const search = (typeof window.currentSearch !== "undefined"
    ? window.currentSearch
    : currentSearch) || "";

  if (currentCategory !== "All") {
    filtered = filtered.filter(
      (e) => e.category.toLowerCase() === currentCategory.toLowerCase()
    );
  }
  if (search) {
    filtered = filtered.filter(
      (e) =>
        e.title.toLowerCase().includes(search) ||
        e.location.toLowerCase().includes(search) ||
        e.category.toLowerCase().includes(search)
    );
  }
  renderEvents(filtered);
}

function viewEvent(id) {
  localStorage.setItem("erms_selected_event_id", id);
  saveEventToStorage(mockEvents.find((e) => e.id === id));
  window.location.href = "../HTML/8_event-detail.html";
}

function getEventById(id) {
  return mockEvents.find((e) => e.id === parseInt(id)) || null;
}

function saveEventToStorage(event) {
  localStorage.setItem("erms_selected_event", JSON.stringify(event));
}

function loadEventFromStorage() {
  const e = localStorage.getItem("erms_selected_event");
  return e ? JSON.parse(e) : null;
}

document.addEventListener("DOMContentLoaded", () => {
  renderEvents(mockEvents);
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleSearch();
    });
  }
});