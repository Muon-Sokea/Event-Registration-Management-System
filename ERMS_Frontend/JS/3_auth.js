// ─────────────────────────────────────────
// auth.js — Login, Register, Validation
// Used by: login.html, register.html
// Task: T07 — User registration & login
// ─────────────────────────────────────────

// ── Mock users (replace with API later) ──
const mockUsers = [
  { id: 1, firstName: "Muon",   lastName: "Sokea",     email: "muonsokea@gmail.com",       phone: "093513252", password: "Admin@123",    role: "Admin"      },
  { id: 2, firstName: "San",    lastName: "Sotheayuth", email: "attendee@example.com",      phone: "093759005", password: "Attend@123",   role: "Attendee"   },
  { id: 3, firstName: "Proeung",lastName: "Sivly",      email: "organizer@example.com",     phone: "093759006", password: "Organ@123",    role: "Organizer"  },
  { id: 4, firstName: "Lang",   lastName: "Socheat",    email: "supervisor@example.com",    phone: "093759007", password: "Super@123",    role: "Supervisor" },
];

// ── Show/hide error message ──
function showError(message) {
  const el = document.getElementById("authError");
  if (!el) return;
  el.textContent = message;
  el.style.display = "block";
}

function hideError() {
  const el = document.getElementById("authError");
  if (el) el.style.display = "none";
}

// ── Show/hide success message ──
function showSuccess(message) {
  const el = document.getElementById("authSuccess");
  if (!el) return;
  el.textContent = message;
  el.style.display = "block";
}

// ── Toggle password visibility ──
function togglePassword(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon  = document.getElementById(iconId);
  if (!input) return;

  if (input.type === "password") {
    input.type = "text";
    if (icon) icon.textContent = "🙈";
  } else {
    input.type = "password";
    if (icon) icon.textContent = "👁️";
  }
}

// ── Select role pill ──
let selectedRole = "Attendee";

function selectRole(role) {
  selectedRole = role;
  document.querySelectorAll(".role-pill").forEach((pill) => {
    pill.classList.toggle("active", pill.dataset.role === role);
  });
}

// ── Validate email format ──
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Validate password strength ──
function isValidPassword(password) {
  // Min 8 chars, at least one uppercase, one lowercase, one number
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

// ── Validate phone number ──
function isValidPhone(phone) {
  return /^[0-9]{9,11}$/.test(phone.replace(/\s/g, ""));
}

// ── LOGIN ──
function handleLogin(e) {
  e.preventDefault();
  hideError();

  const email    = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value;

  // Validation
  if (!email || !password) {
    showError("Please fill in all fields.");
    return;
  }
  if (!isValidEmail(email)) {
    showError("Please enter a valid email address.");
    return;
  }

  // TODO: Replace with real API call
  // const response = await fetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password, role: selectedRole }) });

  // Mock authentication
  const user = mockUsers.find(
    (u) =>
      u.email === email &&
      u.password === password &&
      u.role === selectedRole
  );

  if (!user) {
    showError("Invalid email, password, or role. Please try again.");
    return;
  }

  // Save session
  localStorage.setItem("erms_user",  JSON.stringify({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  }));
  localStorage.setItem("erms_role",  user.role);
  localStorage.setItem("erms_token", "mock-token-" + user.id);

  // Redirect by role
  const routes = {
    Attendee:   "/pages/attendee-dashboard.html",
    Organizer:  "/pages/organizer-dashboard.html",
    Admin:      "/pages/admin-dashboard.html",
    Supervisor: "/pages/supervisor-dashboard.html",
  };
  window.location.href = routes[user.role] || "/index.html";
}

// ── REGISTER ──
function handleRegister(e) {
  e.preventDefault();
  hideError();

  const firstName       = document.getElementById("regFirstName")?.value.trim();
  const lastName        = document.getElementById("regLastName")?.value.trim();
  const email           = document.getElementById("regEmail")?.value.trim();
  const phone           = document.getElementById("regPhone")?.value.trim();
  const password        = document.getElementById("regPassword")?.value;
  const confirmPassword = document.getElementById("regConfirmPassword")?.value;

  // Validation
  if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
    showError("Please fill in all fields.");
    return;
  }
  if (!isValidEmail(email)) {
    showError("Please enter a valid email address.");
    return;
  }
  if (!isValidPhone(phone)) {
    showError("Please enter a valid phone number (9–11 digits).");
    return;
  }
  if (!isValidPassword(password)) {
    showError("Password must be at least 8 characters with uppercase, lowercase, and a number.");
    return;
  }
  if (password !== confirmPassword) {
    showError("Passwords do not match.");
    return;
  }

  // Check duplicate email
  const existing = mockUsers.find((u) => u.email === email);
  if (existing) {
    showError("An account with this email already exists.");
    return;
  }

  // TODO: Replace with real API call
  // const response = await fetch("/api/auth/register", { method: "POST", body: JSON.stringify({ firstName, lastName, email, phone, password }) });

  // Mock registration success
  showSuccess("Account created successfully! Redirecting to login...");
  setTimeout(() => {
    window.location.href = "/login.html";
  }, 2000);
}

// ── Initialize on page load ──
document.addEventListener("DOMContentLoaded", () => {
  // Attach login form
  const loginForm = document.getElementById("loginForm");
  if (loginForm) loginForm.addEventListener("submit", handleLogin);

  // Attach register form
  const registerForm = document.getElementById("registerForm");
  if (registerForm) registerForm.addEventListener("submit", handleRegister);

  // Set default role pill
  selectRole("Attendee");
});