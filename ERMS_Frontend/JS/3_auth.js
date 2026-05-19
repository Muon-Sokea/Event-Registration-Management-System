// ─────────────────────────────────────
// 3_auth.js — Login & Register
// Used by: 2_login.html, 3_register.html
// ─────────────────────────────────────

const mockUsers = [
  { id: 1, firstName: "Muon",    lastName: "Sokea",      email: "admin@erms.com",        password: "Admin@123",    role: "Admin"      },
  { id: 2, firstName: "San",     lastName: "Sotheayuth", email: "attendee@erms.com",     password: "Attend@123",   role: "Attendee"   },
  { id: 3, firstName: "Proeung", lastName: "Sivly",      email: "organizer@erms.com",    password: "Organ@123",    role: "Organizer"  },
  { id: 4, firstName: "Lang",    lastName: "Socheat",    email: "supervisor@erms.com",   password: "Super@123",    role: "Supervisor" },
];

function showError(msg) {
  const el = document.getElementById("authError");
  if (el) { el.textContent = msg; el.style.display = "block"; }
}

function hideError() {
  const el = document.getElementById("authError");
  if (el) el.style.display = "none";
}

function showSuccess(msg) {
  const el = document.getElementById("authSuccess");
  if (el) { el.textContent = msg; el.style.display = "block"; }
}

function togglePassword(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon  = document.getElementById(iconId);
  if (!input) return;
  if (input.type === "password") {
    input.type = "text";
    if (icon) {
      icon.classList.remove("ri-eye-line");
      icon.classList.add("ri-eye-off-line");
    }
  } else {
    input.type = "password";
    if (icon) {
      icon.classList.remove("ri-eye-off-line");
      icon.classList.add("ri-eye-line");
    }
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(pw) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pw);
}

function isValidPhone(phone) {
  return /^[0-9]{9,11}$/.test(phone.replace(/\s/g, ""));
}

// ── Login ──
function handleLogin(e) {
  e.preventDefault();
  hideError();

  const email    = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value;

  if (!email || !password) {
    showError("Please fill in all fields."); return;
  }
  if (!isValidEmail(email)) {
    showError("Please enter a valid email address."); return;
  }

  // TODO: Replace with real API
  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    showError("Invalid email or password. Please try again."); return;
  }

  localStorage.setItem("erms_user", JSON.stringify({
    id: user.id,
    firstName: user.firstName,
    lastName:  user.lastName,
    email:     user.email,
  }));
  localStorage.setItem("erms_role",  user.role);
  localStorage.setItem("erms_token", "mock-token-" + user.id);

  const routes = {
    Attendee:   "4_attendee-dashboard.html",
    Organizer:  "5_organizer-dashboard.html",
    Admin:      "6_admin-dashboard.html",
    Supervisor: "7_supervisor-dashboard.html",
  };
  window.location.href = routes[user.role] || "1_index.html";
}

// ── Register ──
function handleRegister(e) {
  e.preventDefault();
  hideError();

  const firstName       = document.getElementById("regFirstName")?.value.trim();
  const lastName        = document.getElementById("regLastName")?.value.trim();
  const email           = document.getElementById("regEmail")?.value.trim();
  const phone           = document.getElementById("regPhone")?.value.trim();
  const address         = document.getElementById("regAddress")?.value.trim();
  const password        = document.getElementById("regPassword")?.value;
  const confirmPassword = document.getElementById("regConfirmPassword")?.value;

  if (!firstName || !lastName || !email ||
      !phone || !address || !password || !confirmPassword) {
    showError("Please fill in all fields."); return;
  }
  if (!isValidEmail(email)) {
    showError("Please enter a valid email address."); return;
  }
  if (!isValidPhone(phone)) {
    showError("Please enter a valid phone number (9–11 digits)."); return;
  }
  if (!isValidPassword(password)) {
    showError("Password must be at least 8 characters with uppercase, lowercase, and a number."); return;
  }
  if (password !== confirmPassword) {
    showError("Passwords do not match."); return;
  }

  const existing = mockUsers.find((u) => u.email === email);
  if (existing) {
    showError("An account with this email already exists."); return;
  }

  // TODO: Replace with real API
  showSuccess("Account created successfully! Redirecting to login...");
  setTimeout(() => {
    window.location.href = "2_login.html";
  }, 2000);
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) loginForm.addEventListener("submit", handleLogin);

  const registerForm = document.getElementById("registerForm");
  if (registerForm) registerForm.addEventListener("submit", handleRegister);
});