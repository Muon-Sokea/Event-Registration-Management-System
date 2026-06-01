// ─────────────────────────────────────
// 3_auth.js — Login & Register
// Used by: 2_login.html, 3_register.html
// ─────────────────────────────────────

const mockUsers = [
  { id: 1, firstName: "Muon",    lastName: "Sokea",      email: "muonsokea@gmail.com",        password: "sokea123",    role: "Super Admin"  },
  { id: 2, firstName: "San",     lastName: "Sotheayuth", email: "sansotheayuth@gmail.com",     password: "sotheayuth123",   role: "Admin"   },
  { id: 3, firstName: "Proeung", lastName: "Sivly",      email: "proeungsivly@gmail.com",    password: "sivly123",    role: "Organizer"  },
  { id: 4, firstName: "Lang",    lastName: "Socheat",    email: "langsocheat@gmail.com",   password: "socheat123",    role: "Attendee" },
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

// ── Login ──
async function handleLogin(e) {
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

  // Call real API for login
  try {
    const response = await fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const err = await response.json();
      showError(err.detail || "Invalid email or password. Please try again.");
      return;
    }

    const data = await response.json();
    const access = data.access; // JWT token

    // Save token first, then fetch current user profile
    localStorage.setItem("erms_token", access);

    const meResp = await fetch('http://127.0.0.1:8000/api/me/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access}`,
      }
    });

    if (!meResp.ok) {
      showError("Login succeeded but fetching user profile failed.");
      return;
    }

    const user = await meResp.json();

    localStorage.setItem("erms_user", JSON.stringify({
      id: user.id,
      firstName: user.first_name,
      lastName:  user.last_name,
      email:     user.email,
    }));
    localStorage.setItem("erms_role",  (user.role || '').toLowerCase());

    const routes = {
      attendee:   "4_attendee-dashboard.html",
      organizer:  "5_organizer-dashboard.html",
      admin:      "6_admin-dashboard.html",
      supervisor: "7_supervisor-dashboard.html",
    };
    window.location.href = routes[(user.role || '').toLowerCase()] || "1_index.html";
  } catch (err) {
    showError("Network error. Please try again.");
    console.error(err);
  }
}

// ── Register ──
async function handleRegister(e) {
  e.preventDefault();
  hideError();

  const firstName       = document.getElementById("regFirstName")?.value.trim();
  const lastName        = document.getElementById("regLastName")?.value.trim();
  const email           = document.getElementById("regEmail")?.value.trim();
  const password        = document.getElementById("regPassword")?.value;
  const confirmPassword = document.getElementById("regConfirmPassword")?.value;

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    showError("Please fill in all fields."); return;
  }
  if (!isValidEmail(email)) {
    showError("Please enter a valid email address."); return;
  }
  if (!isValidPassword(password)) {
    showError("Password must be at least 8 characters with uppercase, lowercase, and a number."); return;
  }
  if (password !== confirmPassword) {
    showError("Passwords do not match."); return;
  }

  // Call real API for registration
  try {
    const response = await fetch('http://127.0.0.1:8000/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        first_name: firstName,
        last_name: lastName,
        password,
        role: 'attendee' // Default role for new users
      })
    });

    if (!response.ok) {
      const err = await response.json();
      const msg = err.email?.[0] || err.detail || "Registration failed. Please try again.";
      showError(msg);
      return;
    }

    showSuccess("Account created successfully! Redirecting to login...");
    setTimeout(() => {
      window.location.href = "2_login.html";
    }, 2000);
  } catch (err) {
    showError("Network error. Please try again.");
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) loginForm.addEventListener("submit", handleLogin);

  const registerForm = document.getElementById("registerForm");
  if (registerForm) registerForm.addEventListener("submit", handleRegister);
});