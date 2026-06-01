# 🎓 What I Learned: Backend Development with Django & REST API  
**Event Registration & Management System**  

When I started this project, I had no backend experience. I was told to use Django and Python, but I didn’t even know what a virtual environment was. Now I’ve built a complete, production‑ready REST API with professional features. Here’s everything I learned along the way.

---

## 1. Virtual Environments & Project Setup
- **Why .venv matters:** Isolates project dependencies, preventing conflicts between projects.
- **Activation:** Learned to activate/deactivate the environment (`venv\Scripts\activate` or `bin/activate`).
- **Package management:** Used `pip install` and `pip freeze` to manage Django, DRF, JWT, etc.
- **Path issues:** Debugged wrong Python interpreters and fixed PATH variables.

## 2. Django Project Architecture
- **Project vs. Apps:** The `config` folder is the project; each feature (users, events, registrations) is an **app**.
- **Key files:**
  - `models.py` – Database tables as Python classes (ORM).
  - `serializers.py` – Converts models ↔ JSON.
  - `views_api.py` – Request/response logic.
  - `urls_api.py` – API route definitions.
  - `admin.py` – Registers models for the built‑in admin panel.
  - `apps.py` – App configuration (must use the full dotted path like `apps.users`).
- **Migrations:** `makemigrations` creates instructions, `migrate` applies them to SQLite.

## 3. Custom User Model & Authentication
- **Why custom user:** Replaced the default username‑based user with an **email‑based** system.
- **Roles:** Created a `role` field (Admin, Organizer, Supervisor, Attendee) to control access.
- **UserManager:** Built custom manager to handle user creation and superuser creation.
- **JWT Tokens:** Used `djangorestframework-simplejwt` for secure, stateless authentication.
  - `access` token (short‑lived) for API calls.
  - `refresh` token to get new access tokens without re‑logging in.
- **Permission classes:** `AllowAny`, `IsAuthenticated`, and custom classes like `IsOrganizerOrAdmin`.

## 4. Building REST APIs with Django REST Framework
- **Serializers:** Transform complex model instances into JSON and validate incoming data.
- **Generic Views:** Used `ListCreateAPIView`, `RetrieveUpdateDestroyAPIView` for rapid development.
- **APIView:** Learned to write custom endpoints (e.g., profile update, payment, cancel).
- **Business Logic:** Put validation in `perform_create()` – capacity checks, duplicate registrations, etc.
- **HTTP Status Codes:** 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden).

## 5. Advanced API Features
- **Pagination, Search, Filtering:** Added with DRF’s `PageNumberPagination`, `SearchFilter`, and `django_filters`.
- **Swagger/OpenAPI:** Integrated `drf-yasg` to auto‑generate interactive API docs (`/api/docs/`).
- **File Uploads:** Added an image field to events and configured media serving for development.
- **Mock Payment Flow:** Simulated a payment step that changes registration status from “pending” to “confirmed”.
- **Dashboard Statistics:** Aggregated counts (total events, users, registrations, etc.) for an admin overview.

## 6. Database & Migrations
- **SQLite:** Used the built‑in development database; learned how to delete and recreate it.
- **Migration errors:** Dealt with “InconsistentMigrationHistory”, missing `__init__.py`, and circular imports.
- **Schema changes:** Added fields (ticket_code, image) and altered defaults (status) with new migrations.

## 7. Admin Panel
- **Customization:** Registered models and tweaked `UserAdmin` to show roles, search, and filter.
- **Read‑only fields:** Fixed `date_joined` being non‑editable by moving it to `readonly_fields`.
- **Management:** Used the admin to manually change registration statuses for testing.

## 8. Testing with Unit Tests
- **Why tests matter:** Prove code works and prevent regressions.
- **Wrote tests for:**
  - User model creation and superuser behavior.
  - Registration API (success and duplicate prevention).
  - Role‑based event management (organizer restrictions).
- **Running tests:** `python manage.py test` – all 7 passed.

## 9. Cross‑Origin Resource Sharing (CORS)
- **Purpose:** Allows the frontend (on a different port/domain) to call the API.
- **Implementation:** Used `django-cors-headers` middleware, allowed all origins during development.

## 10. Email Notifications (Console Backend)
- **Signals:** Used `post_save` signal on the `Registration` model to trigger an email.
- **Console backend:** Emails are printed to the terminal instead of sending real emails (great for development).
- **Wired the signal:** In the app’s `ready()` method so it connects when the server starts.

## 11. Debugging & Problem‑Solving Skills
- **Reading tracebacks:** Learned to interpret Django error messages.
- **Common mistakes:**
  - Forgetting to save files (`apps.py` name not updated).
  - Missing commas in `INSTALLED_APPS`.
  - Circular imports (e.g., importing the same file in itself).
  - Using the wrong virtual environment.
- **Tools:** Used `where.exe python`, `pip list`, `Get-Content` to inspect files from the terminal.

## 12. Postman & API Testing
- **Workspaces & Collections:** Organized requests into folders.
- **Authorization:** Learned to add `Bearer <token>` in the **Authorization** tab, never in the URL.
- **Testing flow:** Registered users, created events, paid, cancelled, and checked dashboard – all with Postman.

## 13. Documentation & Professionalism
- **Swagger UI:** Interactive API docs that teachers or teammates can use.
- **README:** Wrote a complete setup guide with endpoint table.
- **Demo script:** Prepared a step‑by‑step walkthrough to showcase the system.

## 14. Technical Vocabulary
These are the key terms I now understand and can use confidently:

| Term | Meaning |
|------|---------|
| **API (Application Programming Interface)** | A set of rules allowing software to communicate. Our project exposed a **REST API**. |
| **Endpoint** | A specific URL that performs a specific action, e.g., `/api/events/`. |
| **HTTP Methods** | GET (read), POST (create), PUT/PATCH (update), DELETE (delete). |
| **JSON** | JavaScript Object Notation – a lightweight data format for requests/responses. |
| **JWT (JSON Web Token)** | A secure token format for authentication, containing user info and expiry. |
| **Bearer Token** | A token sent in the `Authorization` header, prefixed with “Bearer ”. |
| **ORM (Object‑Relational Mapping)** | Technique to interact with a database using Python classes instead of SQL. |
| **Serializer** | Converts complex data (model instances) to/from JSON. |
| **View** | A function or class that receives an HTTP request and returns a response. |
| **Middleware** | Software that sits between the request and the view (used for CORS, security, etc.). |
| **CORS (Cross‑Origin Resource Sharing)** | Browser security feature; we allowed it for frontend‑backend communication. |
| **Migration** | A file describing database schema changes, applied with `python manage.py migrate`. |
| **SQLite** | A simple, file‑based database perfect for development. |
| **Status Code** | Three‑digit number in HTTP responses: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 500 (Server Error). |
| **Authentication** | Verifying user identity (login). |
| **Authorization** | Determining what an authenticated user is allowed to do (permissions). |
| **Superuser** | An admin account with all permissions, created via `createsuperuser`. |
| **Pagination** | Splitting large result sets into smaller pages. |
| **Filtering** | Returning only items that match certain criteria (e.g., `?category=workshop`). |
| **Search** | Finding records by keywords across specified fields. |
| **Signal** | A mechanism to run code automatically when certain events happen (e.g., after saving a model). |
| **Console Backend** | An email backend that prints emails to the terminal instead of sending them. |
| **Swagger / OpenAPI** | A specification for documenting APIs; provides an interactive UI to test endpoints. |
| **Unit Test** | Automated code that verifies a small piece of functionality works as expected. |
| **Virtual Environment (venv)** | An isolated Python environment with its own packages and Python interpreter. |
| **Dependency** | An external package your project relies on (installed with pip). |

---

## ✅ Final Outcome
I built a fully functional **Event Registration & Management System** that includes:
- User registration & login with JWT
- Four user roles
- Event CRUD with image upload
- Online registration with seat tracking
- Unique ticket codes
- Cancel registration
- Mock payment
- Dashboard statistics
- Search, filter, and pagination
- Console email notifications
- Swagger documentation
- Unit tests (7 passing)

This project gave me real‑world backend skills that I can now apply to any future Django or REST API project. I went from zero to confident backend developer in one project. 💪