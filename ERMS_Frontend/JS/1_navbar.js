// ─────────────────────────────────────
// 1_navbar.js — Used by ALL HTML files
// ─────────────────────────────────────

const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("navLinks");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) &&
        !navLinks.contains(e.target)) {
      navLinks.classList.remove("open");
    }
  });
}

function logout() {
  localStorage.removeItem("erms_user");
  localStorage.removeItem("erms_role");
  localStorage.removeItem("erms_token");
  window.location.href = "../HTML/2_login.html";
}

function goToDashboard() {
  const role = localStorage.getItem("erms_role");
  const routes = {
    Attendee:   "../HTML/4_attendee-dashboard.html",
    Organizer:  "../HTML/5_organizer-dashboard.html",
    Admin:      "../HTML/6_admin-dashboard.html",
    Supervisor: "../HTML/7_supervisor-dashboard.html",
  };
  window.location.href = routes[role] || "../HTML/2_login.html";
}

function getCurrentUser() {
  const u = localStorage.getItem("erms_user");
  return u ? JSON.parse(u) : null;
}

function requireAuth() {
  if (!getCurrentUser()) {
    window.location.href = "../HTML/2_login.html";
  }
  return getCurrentUser();
}

function requireRole(allowed = []) {
  const role = localStorage.getItem("erms_role");
  if (!role || !allowed.includes(role)) {
    alert("You do not have permission to view this page.");
    window.location.href = "../HTML/2_login.html";
  }
}