// ─────────────────────────────────────────
// navbar.js — Mobile menu + logout + active
// Used by: ALL pages
// ─────────────────────────────────────────

// Mobile hamburger toggle
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("navLinks");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove("open");
    }
  });
}

// ── Highlight active nav button ──
function setActiveNav() {
  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links .btn").forEach((btn) => {
    const btnPage = btn.getAttribute("data-page");
    if (btnPage && currentPage.includes(btnPage)) {
      btn.classList.remove("btn-outline");
      btn.classList.add("btn-primary");
    }
  });
}
setActiveNav();

// ── Logout ──
function logout() {
  localStorage.removeItem("erms_user");
  localStorage.removeItem("erms_token");
  localStorage.removeItem("erms_role");
  window.location.href = "/login.html";
}

// ── Get current logged-in user ──
function getCurrentUser() {
  const user = localStorage.getItem("erms_user");
  return user ? JSON.parse(user) : null;
}

// ── Redirect to correct dashboard by role ──
function goToDashboard() {
  const role = localStorage.getItem("erms_role");
  const routes = {
    Attendee:   "/pages/attendee-dashboard.html",
    Organizer:  "/pages/organizer-dashboard.html",
    Admin:      "/pages/admin-dashboard.html",
    Supervisor: "/pages/supervisor-dashboard.html",
  };
  window.location.href = routes[role] || "/login.html";
}

// ── Protect page — redirect if not logged in ──
function requireAuth() {
  const user = getCurrentUser();
  if (!user) window.location.href = "/login.html";
  return user;
}

// ── Protect page by role ──
function requireRole(allowedRoles = []) {
  const role = localStorage.getItem("erms_role");
  if (!role || !allowedRoles.includes(role)) {
    alert("You do not have permission to view this page.");
    window.location.href = "/login.html";
  }
}