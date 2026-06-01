## 📄 README.md (copy‑paste into your project root `README.md`)

```markdown
# Event Registration & Management System (ERMS)

A full‑stack web application for managing events, registrations, and digital tickets.  
Built with **Django REST Framework** on the backend and vanilla HTML/CSS/JS on the frontend.

## Features

### Core Backend
- Custom user model with roles: **Admin**, **Organizer**, **Supervisor**, **Attendee**
- JWT‑based authentication (registration, login, token refresh)
- Profile update (name, email, password)
- Event creation, listing, updating, and deletion (with permissions)
- Online event registration with real‑time seat tracking
- Unique ticket codes (e.g., `EVT01-REG001`)
- Registration cancellation
- Mock payment flow (pending → confirmed)
- Admin panel for data management

### Enhancements
1. **Search, Filtering & Pagination** on events (`?search=&category=&page=`)
2. **Event Image Upload** (organizers can attach a poster)
3. **Mock Payment Integration** (status change with business rules)
4. **Email Notifications** (console backend – prints to terminal)
5. **Dashboard Statistics** (`/api/dashboard/` – counts, upcoming events, etc.)
6. **Swagger / OpenAPI Documentation** (`/api/docs/`, `/api/redoc/`)
7. **Unit Tests** (models and API endpoints)
8. **Role‑Specific Event Management** (organizers see only their events)

## Technologies

- **Python 3.14**, **Django 6.0.5**
- **Django REST Framework**, **Simple JWT**
- **drf‑yasg** (Swagger)
- **django‑filter** (filtering)
- **django‑cors‑headers**
- **SQLite** (development database)

## Setup Instructions

1. **Clone the repository** and navigate to the project folder.
2. **Create and activate a virtual environment:**
   ```powershell
   python -m venv .venv
   .venv\Scripts\activate   # Windows
   ```
3. **Install dependencies:**
   ```powershell
   pip install django djangorestframework djangorestframework-simplejwt django-cors-headers django-filter drf-yasg Pillow
   ```
4. **Navigate to the backend folder and apply migrations:**
   ```powershell
   cd backend
   python manage.py migrate
   ```
5. **Create a superuser:**
   ```powershell
   python manage.py createsuperuser
   ```
6. **Start the development server:**
   ```powershell
   python manage.py runserver
   ```
7. **Access the admin panel:** `http://127.0.0.1:8000/admin/`  
   **Swagger docs:** `http://127.0.0.1:8000/api/docs/`

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/register/` | Register a new user | No |
| POST | `/api/login/` | Obtain JWT tokens | No |
| POST | `/api/token/refresh/` | Refresh access token | No |
| GET | `/api/me/` | Get current user | Yes |
| PUT | `/api/me/` | Update profile | Yes |
| GET | `/api/events/` | List events (search/filter/paginate) | No |
| POST | `/api/events/` | Create event | Admin/Organizer |
| GET | `/api/events/{id}/` | Retrieve event | No |
| PUT | `/api/events/{id}/` | Update event | Admin/Organizer |
| DELETE | `/api/events/{id}/` | Delete event | Admin/Organizer |
| POST | `/api/events/{id}/register/` | Register for event | Yes |
| GET | `/api/my-registrations/` | User's registrations | Yes |
| POST | `/api/registrations/{id}/cancel/` | Cancel registration | Yes |
| POST | `/api/registrations/{id}/pay/` | Mock payment | Yes |
| GET | `/api/dashboard/` | Dashboard statistics | Admin/Organizer |

Full interactive documentation available at `/api/docs/`.

## Running Tests

```powershell
cd backend
python manage.py test
```

## Notes

- **Email notifications** use the console backend – emails appear in the terminal.
- **Image upload** uses `FileField` to avoid Pillow dependency; install Pillow for `ImageField`.
- **Mock payment** only changes the registration status; no real payment gateway is integrated.
```

---

## 🎤 Demo Script (use with Swagger UI)

**Prerequisite:** Server running at `http://127.0.0.1:8000/`, browser open to `http://127.0.0.1:8000/api/docs/`.

### 1. Register a new attendee
- Expand **POST /api/register/** → Try it out.
- Fill JSON body:
  ```json
  { "email": "demo@example.com", "first_name": "Demo", "last_name": "User", "password": "demo1234" }
  ```
- Execute → **201 Created**.

### 2. Login as attendee
- Expand **POST /api/login/** → Try it out.
- JSON body: `{ "email": "demo@example.com", "password": "demo1234" }`.
- Execute → **200 OK** with `access` token.
- Copy the `access` token, scroll up, click **Authorize**, paste `Bearer <token>`, click Authorize, then Close.

### 3. Update profile
- Expand **PUT /api/me/** → Try it out.
- JSON: `{ "first_name": "DemoUpdated" }`.
- Execute → **200 OK**. Verify with **GET /api/me/**.

### 4. Create an event (requires admin – login as admin first, then re-authorize)
- Authorize as admin (repeat step 2 with admin credentials).
- Expand **POST /api/events/** → Try it out.
- Fill form data (scroll to use the form, not JSON): title, description, date (e.g., `2026-07-01T09:00:00Z`), location, category=workshop, capacity=5, price=0.
- For the `image` field, choose a file (any small image).
- Execute → **201 Created**. Note the event `id`.

### 5. List events with search & filter
- Expand **GET /api/events/** → Try it out.
- Add query params: `search=workshop`, `category=workshop`, `page=1`, `page_size=2`.
- Execute → filtered, paginated results.

### 6. Register for the event (as attendee)
- Re‑authorize as `demo@example.com`.
- Expand **POST /api/events/{id}/register/** → Try it out.
- Enter the event ID from step 4.
- Execute → **201 Created** with `"status": "pending"` and a `ticket_code`. Note the registration `id`.

### 7. Pay for the registration
- Expand **POST /api/registrations/{id}/pay/** → Try it out.
- Enter registration ID → Execute → **200 OK** with `"status": "confirmed"`.
- Try again → **400 Bad Request** (already confirmed).

### 8. Check terminal for email notification
- Show the terminal where `runserver` is running – the registration confirmation email is printed.

### 9. View my registrations
- Expand **GET /api/my-registrations/** → Execute → shows confirmed registration with ticket code.

### 10. Cancel a registration
- Expand **POST /api/registrations/{id}/cancel/** → Execute → status changes to `"cancelled"`.

### 11. Dashboard statistics (as admin)
- Re‑authorize as admin.
- Expand **GET /api/dashboard/** → Execute → shows total events, registrations, users, etc.

### 12. Role‑specific management
- Create an organizer user (POST /api/register/), login, authorize.
- **GET /api/events/** → only events created by that organizer.
- Attempt **PUT** on an event belonging to another user → **403 Forbidden**.

### 13. Swagger & ReDoc
- Show `http://127.0.0.1:8000/api/docs/` (Swagger UI) with all endpoints.
- Show `http://127.0.0.1:8000/api/redoc/` (ReDoc).

### 14. Run unit tests
- In a terminal, navigate to `backend` and run:
  ```powershell
  python manage.py test
  ```
- Show that all tests pass.

**End of demo.**
